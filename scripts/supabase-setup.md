# Supabase setup (Operava Workspace)

## Important: two different “Supabase plugin” things

| Command / thing | What it is | Where |
| --- | --- | --- |
| `npx plugins add supabase-community/supabase-plugin` | **AI coding agent plugin** (MCP + skills for Cursor/Claude/Grok/etc.) | **Your local machine / IDE only** — not part of the Next.js app |
| `@supabase/supabase-js` + `supabase/` migrations | **App runtime** (Auth, DB, Realtime) | This repository |

Install the agent plugin yourself when you want AI tools to talk to your Supabase project:

```bash
npx plugins add supabase-community/supabase-plugin
# or: npx plugins add supabase-community/supabase-plugin --yes
```

Then authenticate the Supabase MCP when your agent prompts you (https://mcp.supabase.com/mcp).

---

## App setup (required for production Auth / Users / Tickets / RLS)

### 1. Create a Supabase project

1. Open https://supabase.com/dashboard
2. **New project** → pick org, name (`operava-desk`), password, region
3. **Settings → API** → copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server only)

### 2. Env files

```bash
cp .env.example .env.local
# fill GEMINI_API_KEY + the three Supabase vars
```

### 3. Apply schema

**Option A — Dashboard**

SQL Editor → paste `supabase/migrations/20260908000000_operava_init.sql` → Run.

**Option B — CLI (local + remote)**

```bash
npm install
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

**Option C — local Docker stack**

```bash
npx supabase start
npm run supabase:db-reset   # applies migrations
npm run supabase:status     # copy local URL + keys into .env.local
```

### 4. Auth providers

Dashboard → **Authentication → Providers** → enable Email (and Google/GitHub if needed).  
Add your deploy URL under **URL configuration → Redirect URLs** (e.g. `https://operava-desk.<account>.workers.dev/**`, `http://localhost:3000/**`).

### 5. Optional Realtime

Dashboard → **Database → Publications** → add `tickets` (and others) to `supabase_realtime`.

### 6. Install deps in the app

```bash
npm install   # pulls @supabase/supabase-js
```

Helpers already in repo:

- `lib/supabase/client.ts` — browser client
- `lib/supabase/server.ts` — server / service-role client

UI still uses mock + `localStorage` until you wire views to these clients and Auth.

---

## Dual backend note

| Layer | Use now |
| --- | --- |
| **Cloudflare D1 / KV / R2** | Edge APIs already in repo (`/api/portal`, `/api/tickets`, `/api/files`) |
| **Supabase** | Source of truth for Auth, users, RLS, Realtime; can replace or complement D1 for relational data |
| **MEGA** | Still not integrated (large files); R2 covers CF-side files |
