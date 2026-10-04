# Nexus landing refresh

## Scope

The public landing now uses a navy, silver and lavender identity, a real product preview and direct links to the revenue, customers and analytics demo screens. Auth, database policies and protected routes are unchanged. The public demo remains fictional and read-only.

`public/dashboard-preview.webp` is a compressed screenshot of the actual public Nexus dashboard at https://nexus-saas-dashboard-tawny.vercel.app/demo/dashboard, captured on 2026-10-04. It is not generated artwork. Next Image supplies responsive sizes.

The page remains a Server Component. Interaction uses CSS, including pointer-aware perspective, visible focus and reduced-motion support. Narrow layouts are tested down to 320px.

## Validation

- ESLint, TypeScript and production build pass.
- Vitest: 26 tests pass.
- Playwright: 14 desktop/mobile checks pass, covering guarded auth, safe redirects, demo routes, keyboard bypass, reduced motion and overflow.
- Production dependency audit: zero known vulnerabilities at validation time. Safe transitive updates reduced development tooling advisories from 13 to 8. These remaining advisories originate in braces 3.0.3 and its dependents; no patched release is available in the registry at validation time. No forced major-version downgrades were applied.
- Next and its ESLint config updated together from 16.3.3 to 16.3.8. The existing shadcn CLI is now a development dependency. Runtime fast-uri updated through the lockfile.

The landing refresh was pushed to main and released through the existing Vercel Git integration on 2026-10-04. Live authenticated database validation is outside this presentation refresh.
