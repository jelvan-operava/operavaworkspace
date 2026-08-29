# Enterprise Google Workspace Client Portal - Deployment & Production Architecture Guide

## Overview
This enterprise Google Workspace Client Portal is built using **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS v4**, **Material Design 3 (Material You)**, and **Progressive Web App (PWA)** offline caching capabilities. It features real-time CRM, Invoicing, Email Blasting, Monthly Notifications, Contracts, Files, Support Tickets, Security Audits, and a server-side Gemini 3.5 AI Assistant.

---

## Key Modules & Functional Architecture

### 1. Offline Persistence & PWA Service Worker (`/public/sw.js`, `/lib/offline-storage.ts`)
* **PWA Caching**: Caches static assets (`/_next/static`, CSS, JS, fonts) and core routes so the client portal remains interactive even during network drops.
* **Local Storage Persistence**: Automatically syncs state changes (CRM leads, custom invoices, email campaigns, monthly rules, support tickets) to local device storage, providing offline readability and fault-tolerant state recovery upon reconnecting.

### 2. All-Device Mobile Navigation (`/components/layout/MobileNav.tsx`)
* **Responsive Multi-Tab Bar**: On mobile and tablet devices, provides an interactive horizontal scroll strip and a dedicated full-screen drawer displaying all 15 navigation tabs with icons, status badges, and search.

### 3. Enterprise CRM Pipeline (`/components/views/CrmView.tsx`)
* **Kanban & Table Views**: Features 6-stage deal tracking (Lead -> Contacted -> Qualified -> Proposal -> Negotiation -> Closed Won), deal value metrics, lead scoring (1-100), contact details, and custom deal creation.

### 4. Custom Invoicing & Auto-Recurring Billing (`/components/views/InvoicesView.tsx`)
* **Line-Item Custom Invoicing**: Allows issuing custom client invoices with itemized rates, quantities, and automated tax calculations.
* **Auto-Pay Subscription Engine**: Managed toggle for recurring monthly ACH direct debit billing statements.
* **Export & Print**: One-click CSV statement export and printable statement previews.

### 5. Broadcast Email Blasting (`/components/views/EmailBlastingView.tsx`)
* **Bulk Communication Engine**: Create, test, and dispatch broadcast campaigns with audience segmenting (All Clients, Billing Contacts, Key Decision Makers) and template options.

### 6. Automated Monthly Notifications Schedule (`/components/views/MonthlyNotificationsView.tsx`)
* **Recurring Trigger Rules**: Schedule monthly automated alerts for billing statements, SLA digests, project milestones, and security compliance audits across Portal Banners, Email, SMS, and Workspace Chat.

### 7. Perceived Performance Skeleton Loaders & Theme Error Handling (`/components/ui/M3Skeleton.tsx`, `/components/ui/M3ErrorState.tsx`, `/components/ui/M3ErrorBoundary.tsx`)
* **Data-Heavy View Skeletons**: View-specific loading skeletons (`CrmSkeleton.tsx`, `ProjectsSkeleton.tsx`, `InvoicesSkeleton.tsx`) with Material 3 shimmer animations, matching card layout proportions and metrics.
* **Theme-Aligned Error Recovery**: `M3ErrorState` component styled with Material 3 error tokens (`--m3-error`, `--m3-error-container`), displaying diagnostic error codes, technical accordion details, and retry triggers.
* **Component Error Boundaries**: `M3ErrorBoundary` catches component rendering exceptions cleanly without crashing the root application shell.

---

## Technical Architecture & Design System

### 1. Material Design 3 (Material You)
* **Dynamic Color Tokens**: Uses CSS variable tokens (`--m3-primary`, `--m3-surface`, etc.) generated dynamically per color seed (`google-blue`, `purple-violet`, `emerald-teal`, `coral-sunset`, `amber-gold`).
* **Material Motion**: Framer Motion spring physics with `layoutId` container transforms and smooth view transitions.
* **Elevation & Shapes**: Follows Google Material 3 surface elevation levels (`surface-container-lowest` to `surface-container-highest`) and 16px/24px rounded shape scales.

### 2. Full-Stack Server-Side Architecture
* **Server-Side AI API**: All Gemini requests route through `/api/gemini/generate` using `@google/genai` with `process.env.GEMINI_API_KEY`.
* **State Management**: Reactive state hub in `app/page.tsx` managing project milestones, invoices, digital signatures, support SLA tickets, files, and chat.

---

## Deployment Process & Commands

### Local & Containerized Build
```bash
# Install dependencies
npm install

# Run development server (Port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Environment Variables Configuration

Define all required keys in `.env.example`:

| Environment Variable | Required | Description |
| -------------------- | -------- | ----------- |
| `GEMINI_API_KEY`     | Yes      | Google AI Studio Gemini API key for server-side AI Assistant |

*Note: Never prefix `GEMINI_API_KEY` with `NEXT_PUBLIC_` to protect server secrets.*

---

## Cloudflare & GitHub Ecosystem Compatibility

This application is engineered for zero-lock-in compatibility with Cloudflare Pages/Workers and standard GitHub Actions CI/CD pipelines:

1. **Cloudflare Pages / Workers Integration**:
   - Standard Next.js server routes compatible with `@cloudflare/next-on-pages` or Cloudflare Worker proxies.
   - Clean dynamic CSS variable tokens easily backed by Cloudflare KV or D1 for user custom theme persistence.
   - Cloudflare Cache Rules support for PWA Service Worker static assets.

2. **GitHub Actions Workflow**:
   - Automated `npm run build` validation on every Pull Request.
   - Type-safe build pass guarantees zero TypeScript or linting errors.

---

## Migration & Rollback Procedures

### Rollback
If a deployment requires immediate rollback:
1. Revert to the prior Git commit tag.
2. Re-trigger `npm run build`.
3. Verify `/api/gemini/generate` response handling and environment variable injection.
