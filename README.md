# Operava Workspace (Operava Desk)

Enterprise Google Workspace–style client portal built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Material Design 3**.

**Repository:** [https://github.com/jelvan-operava/operavaworkspace](https://github.com/jelvan-operava/operavaworkspace)

---

## Target architecture

```
                 OPERAVA WORKSPACE
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
        CLOUDFLARE              SUPABASE
        ──────────              ────────
        Website                 Database
        DNS                     Authentication
        CDN                     Users
        Workers + API           Tickets + RLS
             │                  Realtime
             └──────────┬──────────┘
                        ▼
                       MEGA
                  Large files/videos
```

| Layer | Status |
| --- | --- |
| **UI (15 modules)** | Done — demo data + localStorage |
| **Cloudflare Workers + D1/KV/R2 + APIs** | Done in code — **you must provision** resources |
| **Supabase client + schema + RLS** | **Base in repo** — **you must create project + apply SQL + set env** |
| **Wire UI → Supabase Auth / queries** | Not done |
| **MEGA** | Not done |
| **AI agent plugin** (`npx plugins add …`) | **Local IDE only** — not app code |

---

## Manual actions required (you)

### A. AI agent plugin (optional, local machine only)

This does **not** change the Next.js app. It installs Supabase MCP + skills into Cursor / Claude / Grok / etc.

```bash
npx plugins add supabase-community/supabase-plugin
# skip prompts: npx plugins add supabase-community/supabase-plugin --yes
```

Then complete MCP login when the agent asks (connects to https://mcp.supabase.com/mcp).

### B. Supabase project (required for Auth / Users / Tickets / Realtime)

1. Create project at https://supabase.com/dashboard  
2. Copy URL + anon + service_role into `.env.local` (see `.env.example`)  
3. Run SQL in `supabase/migrations/20260908000000_operava_init.sql` (SQL Editor or `npx supabase db push`)  
4. Enable Auth providers + redirect URLs  
5. `npm install` (adds `@supabase/supabase-js`)

Details: [`scripts/supabase-setup.md`](./scripts/supabase-setup.md)

### C. Cloudflare provision + deploy (required for live edge backend)

1. `npx wrangler login`  
2. Create KV, D1, R2 → paste IDs into `wrangler.jsonc` (replace `REPLACE_WITH_*`)  
3. `npm run cf:d1:remote`  
4. `npx wrangler secret put GEMINI_API_KEY`  
5. `npm run cf:deploy`  
6. Optional CI secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

Details: [`scripts/cf-setup.md`](./scripts/cf-setup.md)

### D. Not done yet (product work)

- Login / session UI bound to Supabase Auth  
- Replace localStorage-first state with Supabase or `/api/portal`  
- MEGA SDK for large files/videos  
- PWA `manifest.json`  

---

## Quick start (local UI)

```bash
npm install
cp .env.example .env.local   # GEMINI_API_KEY (+ Supabase when ready)
npm run dev                  # http://localhost:3000
```

Helpers:

- `lib/supabase/client.ts` / `server.ts`
- Cloudflare APIs: `/api/health`, `/api/portal`, `/api/tickets`, `/api/files`, `/api/gemini/generate`

---

## Docs

| File | Contents |
| --- | --- |
| [`scripts/supabase-setup.md`](./scripts/supabase-setup.md) | Supabase project, SQL, agent plugin vs app |
| [`scripts/cf-setup.md`](./scripts/cf-setup.md) | KV, D1, R2, secrets, deploy |
| [`Deployment.md`](./Deployment.md) | Features, design system |
| [`supabase/migrations/…`](./supabase/migrations/20260908000000_operava_init.sql) | Postgres + RLS |
| [`migrations/0001_init.sql`](./migrations/0001_init.sql) | Cloudflare D1 |
