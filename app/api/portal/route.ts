import { NextRequest, NextResponse } from 'next/server';
import { getPortalEnv, hasBinding, safeJsonParse } from '@/lib/cloudflare';

export const dynamic = 'force-dynamic';

const DOC_KEY = 'all_portal_data';
const KV_KEY = 'portal:all_portal_data';

/**
 * GET /api/portal — load full portal JSON document from D1 (preferred) or KV.
 * PUT /api/portal — save full portal JSON document.
 *
 * Falls back to 503 when no Cloudflare bindings (e.g. plain `next dev`).
 * Client continues to use localStorage offline path in that case.
 */
export async function GET() {
  const env = await getPortalEnv();
  if (!env) {
    return NextResponse.json(
      { error: 'Cloudflare bindings unavailable', source: 'none' },
      { status: 503 }
    );
  }

  try {
    if (hasBinding(env.PORTAL_DB)) {
      const row = await env.PORTAL_DB.prepare(
        'SELECT value, updated_at FROM portal_docs WHERE key = ?'
      )
        .bind(DOC_KEY)
        .first<{ value: string; updated_at: string }>();

      if (row?.value) {
        return NextResponse.json({
          data: safeJsonParse(row.value, null),
          source: 'd1',
          updated_at: row.updated_at,
        });
      }
    }

    if (hasBinding(env.PORTAL_KV)) {
      const raw = await env.PORTAL_KV.get(KV_KEY);
      if (raw) {
        return NextResponse.json({
          data: safeJsonParse(raw, null),
          source: 'kv',
        });
      }
    }

    return NextResponse.json({ data: null, source: 'empty' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load portal data';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const env = await getPortalEnv();
  if (!env) {
    return NextResponse.json(
      { error: 'Cloudflare bindings unavailable' },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const data =
    body && typeof body === 'object' && 'data' in body
      ? (body as { data: unknown }).data
      : body;

  const serialized = JSON.stringify(data ?? null);
  const now = new Date().toISOString();

  try {
    if (hasBinding(env.PORTAL_DB)) {
      await env.PORTAL_DB.prepare(
        `INSERT INTO portal_docs (key, value, updated_at)
         VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
      )
        .bind(DOC_KEY, serialized, now)
        .run();
    }

    if (hasBinding(env.PORTAL_KV)) {
      await env.PORTAL_KV.put(KV_KEY, serialized, {
        metadata: { updated_at: now },
      });
    }

    if (!hasBinding(env.PORTAL_DB) && !hasBinding(env.PORTAL_KV)) {
      return NextResponse.json(
        { error: 'Neither PORTAL_DB nor PORTAL_KV is bound' },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true, updated_at: now });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save portal data';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
