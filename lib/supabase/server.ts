import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client.
 * - Prefer service role for trusted Route Handlers / migrations helpers.
 * - Falls back to anon key if service role is unset.
 * Returns null when URL is missing (local demo without Supabase).
 */
export function createServerSupabaseClient(
  opts: { useServiceRole?: boolean } = {}
): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;

  const key =
    opts.useServiceRole && process.env.SUPABASE_SERVICE_ROLE_KEY
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
