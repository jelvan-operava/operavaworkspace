# Operava Workspace (Operava Desk)

Enterprise Google Workspace–style client portal built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Material Design 3**.

Omnichannel ticketing, CRM, invoicing, contracts, email blasting, file manager, calendar, analytics, security/audit logging, knowledge base, and a server-side Gemini AI assistant — with offline-first PWA support.

**Repository:** [https://github.com/jelvan-operava/operavaworkspace](https://github.com/jelvan-operava/operavaworkspace)

---

## Target architecture (OPERAVA WORKSPACE)

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
        Pages/Workers           Tickets
        API                     Permissions
             │                  Realtime
             │
             └──────────┬──────────┘
                        ▼
                       MEGA
                  Large files/videos
```

| Layer | Role | Status |
| --- | --- | --- |
| **Cloudflare** | Website, CDN, Workers (SSR + API), D1, KV, R2 | **Implemented in code** — provision resources once (see below) |
| **Supabase** | Auth, Users, RLS, Realtime (optional alternative to D1) | Not wired yet |
| **MEGA** | Large files / videos (optional alternative to R2) | Not wired yet |

---

## Cloudflare stack (implemented)

| Binding | Type | Use |
| --- | --- | --- |
| `ASSETS` | Assets | Static `/_next`, `sw.js` |
| `PORTAL_KV` | KV | Portal JSON cache / sessions |
| `PORTAL_DB` | D1 | `portal_docs`, `tickets`, `crm_leads`, `audit_logs`, `files` |
| `PORTAL_FILES` | R2 | File bytes |
| `GEMINI_API_KEY` | Secret | AI route |

### API routes

| Route | Methods | Purpose |
| --- | --- | --- |
| `/api/health` | GET | Binding readiness + D1 ping |
| `/api/portal` | GET, PUT | Full portal document (D1 + KV) |
| `/api/tickets` | GET, POST | Tickets in D1 |
| `/api/files` | GET, POST | List/upload (D1 metadata + R2 body) |
| `/api/gemini/generate` | POST | Gemini assistant |

Schema: `migrations/0001_init.sql`  
Setup guide: [`scripts/cf-setup.md`](./scripts/cf-setup.md)

### One-time provision + deploy

```bash
npx wrangler login

# Create resources (copy IDs into wrangler.jsonc)
npx wrangler kv namespace create PORTAL_KV
npx wrangler kv namespace create PORTAL_KV --preview
npx wrangler d1 create operava-desk
npx wrangler r2 bucket create operava-desk-files
npx wrangler r2 bucket create operava-desk-files-preview

# After pasting IDs into wrangler.jsonc:
npm run cf:d1:remote
npx wrangler secret put GEMINI_API_KEY
npm run cf:deploy

curl https://operava-desk.<account>.workers.dev/api/health
```

Replace every `REPLACE_WITH_*` in `wrangler.jsonc` before production deploy.

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Local Next.js (no bindings → APIs return 503; UI uses localStorage) |
| `npm run cf:build` / `cf:preview` / `cf:deploy` | OpenNext → Workers |
| `npm run cf:d1:local` / `cf:d1:remote` | Apply D1 migration |
| `npm run cf:typegen` | Regenerate Cloudflare env types |

---

## Quick start (local UI)

```bash
npm install
cp .env.example .env.local   # GEMINI_API_KEY
npm run dev                  # http://localhost:3000
```

---

## Why Workers (not Pages)

Full-stack Next.js App Router + Route Handlers → **OpenNext → Cloudflare Workers** with static assets. Pages is for simpler static sites. DNS/CDN stay on Cloudflare either way.

CI: `.github/workflows/deploy-cloudflare.yml` (needs `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`).

---

## Backend honesty

| Concern | Current |
| --- | --- |
| UI / 15 feature modules | Complete (demo data + localStorage offline) |
| Cloudflare Workers deploy | Ready |
| D1 / KV / R2 + APIs | **Implemented** — needs your account resource IDs |
| Wire UI to `/api/portal` instead of only localStorage | Next step (optional) |
| Supabase Auth / Realtime | Not yet |
| MEGA | Not yet |

Do not store real customer data until you have auth (Supabase or Cloudflare Access) in front of these APIs.

---

## Docs

- [`scripts/cf-setup.md`](./scripts/cf-setup.md) — create KV, D1, R2, secrets
- [`Deployment.md`](./Deployment.md) — features, design system, rollback
- [`migrations/0001_init.sql`](./migrations/0001_init.sql) — D1 schema
