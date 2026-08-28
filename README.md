# Nexus SaaS Dashboard

> A production-minded operations workspace for SaaS teams to understand revenue, customers, subscriptions and growth.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org) [![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org) [![CI](https://img.shields.io/badge/CI-lint%20%7C%20test%20%7C%20build-22c55e)](#quality)

Nexus is a polished portfolio-grade SaaS application—not a static dashboard mockup. It includes responsive product navigation, searchable customer operations, billing surfaces, analytics, role-based workspace concepts, keyboard-first navigation, theme switching and a secure Supabase data model.

### [View the live production demo →](https://nexus-saas-dashboard-tawny.vercel.app/dashboard)

## Highlights

- Revenue cockpit with MRR, ARR, churn, acquisition and plan distribution
- Customer directory with search, selection, statuses, responsive data density and detail pages
- Subscription, transaction, analytics, team and eleven-section settings experiences
- `Cmd/Ctrl + K` command palette, keyboard focus, semantic labels and designed loading/error/empty states
- Light and dark themes built from shared design tokens
- Login, registration, password recovery and five-step onboarding flows
- Supabase SSR clients, OAuth callback, normalized PostgreSQL schema and workspace-scoped RLS
- Deterministic demo data so the product is useful before external services are configured

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · shadcn/Radix foundations · Recharts · Supabase SSR · Zod · React Hook Form · Vitest · Playwright

## Architecture

```text
src/
├── app/
│   ├── (app)/             authenticated product routes and shell
│   ├── (auth)/            login, registration, recovery, onboarding
│   └── auth/callback/     Supabase PKCE callback
├── components/            product, chart and primitive components
└── lib/
    ├── supabase/          browser/server clients
    ├── data.ts            realistic demo data
    └── utils.ts           shared formatting and class utilities
supabase/migrations/       schema, indexes, constraints and RLS
tests/                     browser-level product flows
```

Server Components remain the default. Interactivity is isolated to small client boundaries (tables, shell, forms, onboarding and charts). The app runs in demo mode without environment variables and automatically enables Supabase clients when configured.

## Getting started

Requirements: Node.js 22+ and npm 10+.

```bash
git clone https://github.com/vitorgamer778/nexus-saas-dashboard.git
cd nexus-saas-dashboard
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. To explore without a backend, leave `.env.local` unset and use the demo experience.

### Supabase

Create a Supabase project, run `supabase/migrations/20260828000000_initial_schema.sql`, then configure:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

Enable GitHub and/or Google under Authentication → Providers and allow `/auth/callback` in redirect URLs. Never expose a secret or `service_role` key to the browser.

## Quality

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

GitHub Actions runs the complete quality gate with Node 22 and verifies desktop and mobile browser flows.

## Technical decisions

- **Demo-first, backend-ready:** reviewers see a complete product immediately; service configuration remains optional.
- **Workspace tenancy at the database:** every business record belongs to a workspace and RLS checks actual membership, not user-editable metadata.
- **Focused client boundaries:** charts and interactions hydrate; static structure stays server-rendered.
- **Token-driven visual system:** one restrained violet accent, consistent density and semantic light/dark surfaces.
- **Accessible by construction:** landmark navigation, visible focus, labels, 36px+ controls and keyboard command access.

## Roadmap

- [ ] Stripe Checkout and webhook-backed billing lifecycle
- [ ] Supabase Realtime activity feed
- [ ] CSV import/export jobs
- [ ] Audit log and fine-grained permission editor
- [ ] Internationalization and localized currency

## License

MIT — use, learn from and adapt this project with attribution appreciated.

