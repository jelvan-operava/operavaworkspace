import { NextRequest, NextResponse } from 'next/server';
import { getPortalEnv, hasBinding } from '@/lib/cloudflare';

export const dynamic = 'force-dynamic';

/**
 * GET /api/files — list file metadata from D1
 * POST /api/files — upload file bytes to R2 + metadata to D1
 * Query ?key= for download redirect/stream of a single object
 */
export async function GET(req: NextRequest) {
  const env = await getPortalEnv();
  if (!env || !hasBinding(env.PORTAL_DB)) {
    return NextResponse.json(
      { error: 'PORTAL_DB binding unavailable' },
      { status: 503 }
    );
  }

  const key = req.nextUrl.searchParams.get('key');
  if (key && hasBinding(env.PORTAL_FILES)) {
    const obj = await env.PORTAL_FILES.get(key);
    if (!obj) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set('etag', obj.httpEtag);
    headers.set(
      'content-disposition',
      `inline; filename="${key.split('/').pop() || 'file'}"`
    );
    return new NextResponse(obj.body, { headers });
  }

  try {
    const { results } = await env.PORTAL_DB.prepare(
      `SELECT id, name, folder, size_bytes, content_type, object_key, author, version, created_at, updated_at
       FROM files ORDER BY updated_at DESC LIMIT 200`
    ).all();
    return NextResponse.json({ files: results ?? [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'List failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const env = await getPortalEnv();
  if (!env || !hasBinding(env.PORTAL_FILES) || !hasBinding(env.PORTAL_DB)) {
    return NextResponse.json(
      { error: 'PORTAL_FILES and PORTAL_DB bindings required' },
      { status: 503 }
    );
  }

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file field required' }, { status: 400 });
  }

  const folder = String(form.get('folder') || 'Deliverables');
  const author = String(form.get('author') || 'System');
  const id = `file-${crypto.randomUUID()}`;
  const objectKey = `${folder}/${id}-${file.name}`;
  const now = new Date().toISOString();

  try {
    await env.PORTAL_FILES.put(objectKey, file.stream(), {
      httpMetadata: { contentType: file.type || 'application/octet-stream' },
      customMetadata: { id, author },
    });

    await env.PORTAL_DB.prepare(
      `INSERT INTO files (id, name, folder, size_bytes, content_type, object_key, author, version, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        file.name,
        folder,
        file.size,
        file.type || 'application/octet-stream',
        objectKey,
        author,
        'v1',
        now,
        now
      )
      .run();

    return NextResponse.json({
      ok: true,
      id,
      object_key: objectKey,
      name: file.name,
      size: file.size,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
