import { NextResponse } from 'next/server';
import { getPortalEnv, hasBinding } from '@/lib/cloudflare';

export const dynamic = 'force-dynamic';

/**
 * GET /api/health — Cloudflare binding readiness check.
 */
export async function GET() {
  const env = await getPortalEnv();
  const gemini =
    Boolean(process.env.GEMINI_API_KEY) || Boolean(env?.GEMINI_API_KEY);

  const bindings = {
    worker: Boolean(env),
    PORTAL_KV: hasBinding(env?.PORTAL_KV),
    PORTAL_DB: hasBinding(env?.PORTAL_DB),
    PORTAL_FILES: hasBinding(env?.PORTAL_FILES),
    GEMINI_API_KEY: gemini,
  };

  let d1Ok: boolean | null = null;
  if (bindings.PORTAL_DB && env?.PORTAL_DB) {
    try {
      await env.PORTAL_DB.prepare('SELECT 1 AS ok').first();
      d1Ok = true;
    } catch {
      d1Ok = false;
    }
  }

  const ready = bindings.worker && (bindings.PORTAL_DB || bindings.PORTAL_KV);

  return NextResponse.json({
    ok: true,
    service: 'operava-desk',
    runtime: env ? 'cloudflare-workers' : 'node-or-local',
    bindings,
    d1_query: d1Ok,
    ready,
    timestamp: new Date().toISOString(),
  });
}
