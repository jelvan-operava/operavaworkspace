# Cloudflare resource setup (Operava Desk)

Run these once per Cloudflare account. Requires [Wrangler](https://developers.cloudflare.com/workers/wrangler/) and `npx wrangler login`.

## 1. Login

```bash
npx wrangler login
```

## 2. Create KV namespace

```bash
npx wrangler kv namespace create PORTAL_KV
npx wrangler kv namespace create PORTAL_KV --preview
```

Copy the returned `id` values into `wrangler.jsonc` → `kv_namespaces[0].id` and `preview_id`.

## 3. Create D1 database

```bash
npx wrangler d1 create operava-desk
```

Paste `database_id` into `wrangler.jsonc` → `d1_databases[0].database_id` (and `preview_database_id`).

Apply schema:

```bash
# Remote (production)
npx wrangler d1 execute operava-desk --remote --file=./migrations/0001_init.sql

# Local Miniflare
npx wrangler d1 execute operava-desk --local --file=./migrations/0001_init.sql
```

## 4. Create R2 buckets

```bash
npx wrangler r2 bucket create operava-desk-files
npx wrangler r2 bucket create operava-desk-files-preview
```

Names must match `wrangler.jsonc` → `r2_buckets`.

## 5. Secret

```bash
npx wrangler secret put GEMINI_API_KEY
```

Local preview: create `.dev.vars` (gitignored):

```
GEMINI_API_KEY=your_key_here
```

## 6. Deploy

```bash
npm run cf:build
npm run cf:deploy
```

Verify:

```bash
curl https://operava-desk.<account>.workers.dev/api/health
```

Expect `bindings.PORTAL_DB`, `PORTAL_KV`, `PORTAL_FILES` true and `d1_query: true` after migrations.

## API surface (Cloudflare)

| Route | Method | Binding |
| --- | --- | --- |
| `/api/health` | GET | all |
| `/api/portal` | GET, PUT | D1 + KV |
| `/api/tickets` | GET, POST | D1 |
| `/api/files` | GET, POST | D1 + R2 |
| `/api/gemini/generate` | POST | `GEMINI_API_KEY` secret |

## Notes

- Replace every `REPLACE_WITH_*` placeholder in `wrangler.jsonc` before production deploy.
- Supabase / MEGA remain optional later; this Cloudflare stack is enough for Workers-side persistence and file storage.
