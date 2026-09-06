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

| Layer | Role | Status in this repo |
| --- | --- | --- |
| **Cloudflare** | Website, DNS, CDN, Workers (API + SSR), optional future D1/R2/KV | **Ready** — OpenNext → Cloudflare Workers |
| **Supabase** | Database, Auth, Users, Tickets, Permissions, Realtime | **Not implemented** (data is mock + `localStorage`) |
| **MEGA** | Large files / videos | **Not implemented** (File Manager is metadata mock only) |

This build is a **frontend-complete demo** with Cloudflare Workers deployment and a production-ready Gemini API route. Real multi-user production requires Supabase (or equivalent) + real file storage (MEGA or R2).

---

## Quick start (local)

```bash
npm install
cp .env.example .env.local   # set GEMINI_API_KEY
npm run dev                  # http://localhost:3000
```

| Variable | Required | Notes |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | Server-only. Get from [Google AI Studio](https://aistudio.google.com/app/apikey). Never use `NEXT_PUBLIC_`. |

---

## Deploy to Cloudflare (Workers — recommended)

This app uses **[@opennextjs/cloudflare](https://opennext.js.org/cloudflare)** and deploys as a **Cloudflare Worker** with static assets (not the legacy Pages-only Next path).

In 2025–2026 Cloudflare recommends **Workers + static assets** for full-stack Next.js (App Router, Route Handlers, Node compat). Pages remains fine for pure static sites; this project is full-stack SSR/API, so **Workers is the correct target**.

### One-time setup

1. Cloudflare account + Wrangler login:

```bash
npx wrangler login
```

2. Set the Gemini secret (production):

```bash
npx wrangler secret put GEMINI_API_KEY
```

   For local `wrangler` / preview, use a gitignored `.dev.vars`:

```bash
echo 'GEMINI_API_KEY=your_key_here' > .dev.vars
```

### Build, preview, deploy

```bash
npm run cf:build      # OpenNext → Worker bundle
npm run cf:preview    # Local Miniflare preview
npm run cf:deploy     # Deploy to Cloudflare Workers
```

Equivalent:

```bash
npx opennextjs-cloudflare build
npx opennextjs-cloudflare deploy
```

Config files:

- `wrangler.jsonc` — Worker name (`operava-desk`), assets binding, optional future KV/D1/R2
- `open-next.config.ts` — OpenNext Cloudflare preset (`buildCommand: npm run build`)

After deploy, the Worker URL is printed by Wrangler (e.g. `https://operava-desk.<account>.workers.dev`). Attach a custom domain in the Cloudflare dashboard under **Workers & Pages → operava-desk → Triggers / Custom Domains**.

### Optional bindings (future backend)

Uncomment in `wrangler.jsonc` when you add real persistence:

| Binding | Type | Purpose |
| --- | --- | --- |
| `PORTAL_KV` | KV | Sessions / cache |
| `PORTAL_DB` | D1 | Relational data (or use Supabase instead) |
| `PORTAL_FILES` | R2 | File uploads (or use MEGA instead) |

### CI/CD (GitHub Actions)

A workflow is provided at `.github/workflows/deploy-cloudflare.yml`.

Repository secrets required for auto-deploy on push to `main`:

| Secret | Description |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Token with Workers edit + Account read |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `GEMINI_API_KEY` | Set via `wrangler secret` in the job, or pre-set in the dashboard |

---

## Why not “Cloudflare Pages” for this app?

| | Cloudflare Pages | Cloudflare Workers (this repo) |
| --- | --- | --- |
| Best for | Static / simple Jamstack | Full-stack Next.js (SSR, API routes, Node APIs) |
| OpenNext target | Legacy / not preferred | **Official path** |
| Git previews | Built-in | Via Workers Builds / Actions |
| Bindings (D1, R2, KV, secrets) | Yes | Yes, first-class |

You can still put DNS and CDN on Cloudflare (Pages or Workers custom domains). The **application runtime** for this codebase is the Worker produced by OpenNext.

---

## Project structure (high level)

```
app/                    # Next.js App Router (page hub, API routes)
components/             # UI + feature views (15 modules)
hooks/
lib/                    # mock-data, offline-storage, m3-theme, utils
public/                 # sw.js (service worker), static assets
wrangler.jsonc          # Cloudflare Worker config
open-next.config.ts     # OpenNext Cloudflare adapter
Deployment.md           # Full feature + architecture guide
```

Feature views live under `components/views/` (Dashboard, CRM, Invoices, Support Tickets, File Manager, etc.). See **[Deployment.md](./Deployment.md)** for the complete module list and backend status table.

---

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Local Next.js dev server |
| `npm run build` / `npm start` | Standalone Node build |
| `npm run lint` | ESLint |
| `npm run cf:build` | OpenNext Cloudflare build |
| `npm run cf:preview` | Build + local Worker preview |
| `npm run cf:deploy` | Build + deploy to Cloudflare Workers |
| `npm run cf:typegen` | `wrangler types` |

---

## Backend status (honest)

| Concern | Current | Target |
| --- | --- | --- |
| Business data | `lib/mock-data.ts` + `localStorage` | Supabase (or D1) |
| Auth / users / permissions | None | Supabase Auth + RLS |
| Tickets / realtime | UI only | Supabase tables + Realtime |
| Large files / videos | Mock metadata | MEGA (or R2) |
| AI Assistant | **Production-ready** (server route + secret) | Keep as-is |

Do **not** store real customer data until auth and a real database are wired.

---

## Documentation

- **[Deployment.md](./Deployment.md)** — Full feature list, design system, env vars, bindings, rollback
- This **README** — Architecture diagram, quick start, Cloudflare Workers deploy, CI secrets

---

## License / about

Multi-themed Material Design 3 client portal for the Operava workspace.
