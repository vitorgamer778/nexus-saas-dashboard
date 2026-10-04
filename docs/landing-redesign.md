# Nexus landing refresh

## Scope

The public landing now uses a navy, silver and lavender identity, a real product preview and direct links to the revenue, customers and analytics demo screens. Auth, database policies and protected routes are unchanged. The public demo remains fictional and read-only.

`public/dashboard-preview.webp` is a compressed screenshot of the actual public Nexus dashboard at https://nexus-saas-dashboard-tawny.vercel.app/demo/dashboard, captured on 2026-10-04. It is not generated artwork. Next Image supplies responsive sizes.

The page remains a Server Component. Interaction uses CSS, including pointer-aware perspective, visible focus and reduced-motion support. Narrow layouts are tested down to 320px.

## Validation

- ESLint, TypeScript and production build pass.
- Vitest: 26 tests pass.
- Playwright: 14 desktop/mobile checks pass, covering guarded auth, safe redirects, demo routes, keyboard bypass, reduced motion and overflow.
- Production dependency audit: zero known vulnerabilities at validation time. Development tooling still has 13 advisories; no forced major-version changes were applied.
- Next and its ESLint config updated together from 16.3.3 to 16.3.8. The existing shadcn CLI is now a development dependency. Runtime fast-uri updated through the lockfile.

Changes are local. Deployment, live authenticated database validation, Astraea and Orbit updates are not part of this completed Nexus landing milestone.
