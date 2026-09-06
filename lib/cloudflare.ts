/**
 * Cloudflare bindings helper for OpenNext on Workers.
 * Prefer getCloudflareContext() inside Route Handlers / Server Components.
 */
import { getCloudflareContext } from '@opennextjs/cloudflare';

export type PortalEnv = CloudflareEnv;

export async function getPortalEnv(): Promise<PortalEnv | null> {
  try {
    const ctx = await getCloudflareContext({ async: true });
    return (ctx?.env as PortalEnv) ?? null;
  } catch {
    // Local `next dev` has no Worker bindings.
    return null;
  }
}

export function hasBinding<T>(value: T | undefined | null): value is T {
  return value != null;
}

/** Safe JSON parse for D1/KV payloads. */
export function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
