# Operava Desk — Deployment & Production Architecture Guide

## Overview
Operava Desk is an enterprise Google Workspace-style client portal built with **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS v4**, **Material Design 3 (Material You)**, and **Progressive Web App (PWA)** offline caching. It features omnichannel ticketing, CRM, invoicing, email blasting, monthly notifications, contracts, files, calendar, analytics, security/audit logging, a knowledge base, and a server-side Gemini AI Assistant.

**Current backend status**: All business data (projects, invoices, contracts, tickets, CRM leads, messages, campaigns, audit logs, etc.) is seeded from `lib/mock-data.ts` and persisted client-side via `localStorage` (`lib/offline-storage.ts`) — there is no external database yet. The **only server-side integration is the Gemini AI Assistant API route** (`app/api/gemini/generate/route.ts`). See [Backend & Data Persistence](#backend--data-persistence-status) for what is required to move this to a real production backend.

---

## Key Modules & Functional Architecture

### Navigation & Shell
* **`app/page.tsx`** — Central state hub. Owns all in-memory/localStorage-backed state (projects, invoices, tickets, CRM leads, campaigns, etc.), tab routing, and PWA service worker registration.
* **`components/layout/MobileNav.tsx`** — Responsive multi-tab bar with a horizontal scroll strip and full-screen drawer for all 15 feature tabs, with icons, status badges, and search.

### Feature Views (`components/views/`)
| View | File | Description |
| --- | --- | --- |
| Dashboard | `DashboardView.tsx` | KPI metrics, activity overview, and quick links. |
| Client Dashboard | `ClientDashboardView.tsx` | Client-facing summary: payments, open tickets, project status. |
| Projects | `ProjectsView.tsx` | Project/task tracking with milestones and status. |
| CRM | `CrmView.tsx` | Kanban & table pipeline (Lead → Contacted → Qualified → Proposal → Negotiation → Closed Won), lead scoring (1–100), deal value metrics, and CRM annotations. |
| Invoices | `InvoicesView.tsx` | Line-item custom invoicing, tax calculation, auto-recurring ACH billing toggle, CSV export, printable statements. |
| Contracts | `ContractsView.tsx` | Contract records with digital signature status. |
| Email Blasting | `EmailBlastingView.tsx` | Bulk campaign creation with audience segmentation (All Clients, Billing Contacts, Key Decision Makers) and templates. |
| Monthly Notifications | `MonthlyNotificationsView.tsx` | Recurring trigger rules for billing statements, SLA digests, milestones, and compliance audits across Portal, Email, SMS, and Workspace Chat. |
| Support Tickets | `SupportTicketsView.tsx` | Zoho Desk-style omnichannel ticketing with AUX agent states, SLA timers, and threaded messages. |
| Messages | `MessagesView.tsx` | Channel-based internal/client messaging. |
| File Manager | `FileManagerView.tsx` | File browsing, metadata, and detail modal. |
| Calendar | `CalendarView.tsx` | Scheduling and event/appointment management. |
| Analytics | `AnalyticsView.tsx` | Portfolio and performance metrics/charts (Recharts). |
| Security Audit | `SecurityAuditView.tsx` | Security logs and API key provisioning/rotation UI. |
| Audit Logs | `AuditLogsView.tsx` | Internal audit trail of user/system actions. |
| Knowledge Base | `KnowledgeBaseView.tsx` | Searchable help articles. |
| Settings | `SettingsView.tsx` | Company profile, password, and preference management. |

### Offline Persistence & PWA Service Worker
* **`public/sw.js`** — Registered from `app/page.tsx` on mount. Caches `/` and static assets, serving cached responses with background revalidation and an offline fallback.
* **`lib/offline-storage.ts`** — Namespaced (`gworkspace_portal_cache_v1_`) `localStorage` read/write/clear helpers used to persist all view state across reloads and network drops.
* **Note**: There is currently no `public/manifest.json` (Web App Manifest). To make the app installable as a native-like PWA (add-to-home-screen, standalone display mode, icons), add a manifest and link it from `app/layout.tsx`.

### Perceived Performance & Error Handling
* **`components/ui/M3Skeleton.tsx`** plus view-specific skeletons (`CrmSkeleton.tsx`, `ProjectsSkeleton.tsx`, `InvoicesSkeleton.tsx`, etc.) — Material 3 shimmer loading states.
* **`components/ui/M3ErrorState.tsx`** — Material 3 styled error surface with diagnostic codes and retry actions.
* **`components/ui/M3ErrorBoundary.tsx`** — Catches component render exceptions without crashing the app shell.

---

## Technical Architecture & Design System

### Material Design 3 (Material You)
* **Dynamic Color Tokens** (`lib/m3-theme.ts`) — CSS variable tokens (`--m3-primary`, `--m3-surface`, etc.) generated per color seed (`google-blue`, `purple-violet`, `emerald-teal`, `coral-sunset`, `amber-gold`).
* **Material Motion** — Framer Motion (`motion` package) spring physics with `layoutId` container transforms and view transitions.
* **Elevation & Shapes** — Google Material 3 surface elevation levels (`surface-container-lowest` → `surface-container-highest`) and 16/24px rounded shape scales.

### Server-Side Architecture
* **Gemini AI API Route** (`app/api/gemini/generate/route.ts`) — All Gemini requests are proxied server-side via `@google/genai`, using `process.env.GEMINI_API_KEY`. The route validates the prompt, injects a system instruction with portal context, and returns `{ text }` or a `{ error }` JSON payload with an appropriate HTTP status.
* **State Management** — `app/page.tsx` is the single reactive state hub for all feature views; state is hydrated from `lib/mock-data.ts` and persisted via `lib/offline-storage.ts`.

---

## Backend & Data Persistence Status

This build is **frontend-complete** for all 15 feature areas, but production use with multiple real users requires replacing the client-side mock/localStorage data layer with real, server-backed persistence:

| Concern | Current State | Production Requirement |
| --- | --- | --- |
| CRM leads, invoices, contracts, tickets, campaigns, audit logs | Seeded from `lib/mock-data.ts`, mutated in React state, persisted to `localStorage` | Persist via a real database (e.g. Cloudflare D1/Postgres) behind authenticated API routes |
| Authentication / authorization | None — the portal is open to any visitor of the deployed URL | Add an auth layer (e.g. session cookies + Cloudflare Access, or a provider like Auth.js) before exposing real client data |
| File storage | Mocked file metadata only, no real uploads | Cloudflare R2 (or equivalent object storage) bound to the Worker |
| AI Assistant | Fully implemented, server-side, production-ready | Ensure `GEMINI_API_KEY` is set as a secret (never a public var) in every environment |

Until real persistence and auth are added, treat this deployment as a **fully-featured demo/staging build**: safe to deploy publicly, but do not store real customer data in it.

---

## Deployment Process & Commands

### Local Development
```bash
npm install
cp .env.example .env.local   # set GEMINI_API_KEY
npm run dev                  # http://localhost:3000
```

### Standard Node Build (any Node host)
```bash
npm run build   # next build (output: 'standalone')
npm start       # next start
```

### Cloudflare Workers Deployment (recommended)
This app deploys to **Cloudflare Workers** using the official [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare) (`@opennextjs/cloudflare`), which supports the full Next.js 15 App Router feature set (Server Components, Route Handlers, etc.). The legacy `@cloudflare/next-on-pages` adapter is deprecated and is **not** used here.

Configuration lives in:
* **`wrangler.jsonc`** — Worker name, compatibility date/flags, static asset binding, and commented-out examples for optional KV/D1/R2 bindings.
* **`open-next.config.ts`** — OpenNext build configuration (default Cloudflare preset).

```bash
# One-time: authenticate wrangler with your Cloudflare account
npx wrangler login

# Build the Next.js app into a Cloudflare Worker bundle
npm run cf:build

# Preview the Worker build locally (uses Miniflare)
npm run cf:preview

# Deploy to Cloudflare Workers
npm run cf:deploy
```

#### Required & Optional Bindings
| Binding | Type | Required? | Purpose |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | Secret var | **Yes** | Server-side Gemini AI Assistant calls. Set with `wrangler secret put GEMINI_API_KEY` for production, or in `.dev.vars` (gitignored) for local `wrangler dev`/preview. |
| `ASSETS` | Assets binding | Yes (auto-configured) | Serves static assets (`/_next/static`, images, `sw.js`) from `.open-next/assets`. |
| `PORTAL_KV` | KV namespace | No (future) | Key-value cache/session storage, once server-side sessions are added. |
| `PORTAL_DB` | D1 database | No (future) | Relational persistence for CRM/invoices/tickets/etc., replacing the current mock/localStorage layer. |
| `PORTAL_FILES` | R2 bucket | No (future) | Real file uploads for the File Manager view. |

Uncomment the relevant sections of `wrangler.jsonc` and provision the resources (`wrangler kv namespace create ...`, `wrangler d1 create ...`, `wrangler r2 bucket create ...`) once server-side persistence is implemented.

### Alternative: Any Node-Compatible Host
Since `next.config.ts` sets `output: 'standalone'`, the app can also be containerized/deployed to any Node 20+ host (e.g. a Docker image running `node .next/standalone/server.js`) without Cloudflare-specific tooling.

---

## Environment Variables Configuration

Define all required keys in `.env.local` (copy from [`.env.example`](./.env.example)):

| Environment Variable | Required | Description |
| --------------------- | -------- | ----------- |
| `GEMINI_API_KEY` | Yes | Google AI Studio Gemini API key for the server-side AI Assistant. |

*Note: Never prefix `GEMINI_API_KEY` with `NEXT_PUBLIC_` — this would expose the secret to the browser bundle.*

For Cloudflare deployments, set the same key as a Worker secret (`wrangler secret put GEMINI_API_KEY`) rather than in `wrangler.jsonc`.

---

## GitHub Actions CI/CD
Automate `npm run build` and `npm run lint` validation on every Pull Request to guarantee a type-safe, lint-clean build before merge. To auto-deploy on merge to `main`, add a workflow step running `npm run cf:deploy` with `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` configured as repository secrets.

---

## Migration & Rollback Procedures

### Rollback
If a deployment requires immediate rollback:
1. Revert to the prior Git commit/tag.
2. Re-run `npm run cf:build && npm run cf:deploy` (or `wrangler rollback` for the previous Worker version).
3. Verify `/api/gemini/generate` response handling and that `GEMINI_API_KEY` is present in the target environment.
