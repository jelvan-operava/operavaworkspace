/** Cloudflare Worker bindings for Operava Desk (OpenNext). */
interface CloudflareEnv {
  ASSETS: Fetcher;
  PORTAL_KV: KVNamespace;
  PORTAL_DB: D1Database;
  PORTAL_FILES: R2Bucket;
  /** Set via `wrangler secret put GEMINI_API_KEY` — not in vars. */
  GEMINI_API_KEY?: string;
  APP_NAME?: string;
  APP_ENV?: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GEMINI_API_KEY?: string;
    }
  }
}

export {};
