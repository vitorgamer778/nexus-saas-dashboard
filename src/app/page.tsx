import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  GitFork,
  Layers3,
  LockKeyhole,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import { NexusMark } from "@/components/nexus-mark";

export const metadata: Metadata = {
  title: "Revenue intelligence for modern SaaS teams",
  description:
    "A production-minded SaaS operations workspace for revenue, customers, subscriptions and growth.",
  alternates: { canonical: "/" },
};

const features = [
  {
    icon: BarChart3,
    title: "Revenue clarity",
    body: "MRR movement, churn and plan performance in one decisive view.",
  },
  {
    icon: Users,
    title: "Customer operations",
    body: "Searchable customer records, health signals and complete activity context.",
  },
  {
    icon: Sparkles,
    title: "Nexus Intelligence",
    body: "Explainable demo insights for churn risk, conversion and retention opportunities.",
  },
  {
    icon: Layers3,
    title: "Multi-workspace",
    body: "Workspace-scoped data, role-aware navigation and persistent selection.",
  },
  {
    icon: LockKeyhole,
    title: "Security by default",
    body: "Supabase SSR, fail-closed auth, explicit RLS policies and safe redirects.",
  },
  {
    icon: Workflow,
    title: "Operational depth",
    body: "Subscriptions, transactions, analytics, team management and professional settings.",
  },
];

function DashboardPreview() {
  return (
    <div
      className="relative mx-auto max-w-6xl overflow-hidden rounded-[1.5rem] border border-white/12 bg-[#111116] p-2 shadow-[0_45px_120px_-50px_rgba(124,92,255,.72)] ring-1 ring-white/[.025] sm:p-3"
      aria-label="Nexus dashboard preview"
    >
      <div className="flex min-h-[420px] overflow-hidden rounded-2xl border border-white/8 bg-[#0e0e11]">
        <aside className="hidden w-48 shrink-0 border-r border-white/8 p-4 sm:block">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <NexusMark className="size-7 rounded-lg" /> Nexus
          </div>
          <div className="mt-8 space-y-2 text-xs text-zinc-500">
            {[
              "Overview",
              "Customers",
              "Subscriptions",
              "Transactions",
              "Analytics",
            ].map((item, index) => (
              <div
                key={item}
                className={`rounded-lg px-3 py-2 ${index === 0 ? "bg-white/8 text-white" : ""}`}
              >
                {item}
              </div>
            ))}
          </div>
        </aside>
        <div className="min-w-0 flex-1 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">
                Orbit Labs · Demo workspace
              </p>
              <p className="mt-1 font-semibold text-white">Revenue overview</p>
            </div>
            <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2 py-1 text-[10px] font-medium text-violet-300">
              LIVE DEMO
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              ["MRR", "$46,820", "+12.4%"],
              ["ARR", "$561.8k", "+9.1%"],
              ["Customers", "1,248", "+7.8%"],
              ["Churn", "2.4%", "-0.6%"],
            ].map(([label, value, trend]) => (
              <div
                key={label}
                className="rounded-xl border border-white/8 bg-white/[.025] p-3"
              >
                <p className="text-[10px] text-zinc-500">{label}</p>
                <p className="mt-2 text-lg font-semibold text-white sm:text-xl">
                  {value}
                </p>
                <p className="mt-1 text-[10px] text-emerald-400">{trend}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-xl border border-white/8 bg-white/[.025] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white">Revenue momentum</span>
                <span className="text-zinc-500">Last 6 months</span>
              </div>
              <svg
                viewBox="0 0 500 150"
                className="mt-4 h-36 w-full"
                role="img"
                aria-label="Revenue trending upward"
              >
                <defs>
                  <linearGradient id="previewArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#7c5cff" stopOpacity=".35" />
                    <stop offset="1" stopColor="#7c5cff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 126 C60 118 78 98 130 104 S205 72 258 78 S340 42 390 52 S450 24 500 18 L500 150 L0 150Z"
                  fill="url(#previewArea)"
                />
                <path
                  d="M0 126 C60 118 78 98 130 104 S205 72 258 78 S340 42 390 52 S450 24 500 18"
                  fill="none"
                  stroke="#8f78ff"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="rounded-xl border border-violet-400/15 bg-violet-400/[.055] p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-violet-300">
                <Sparkles className="size-4" /> Nexus Intelligence
              </div>
              <p className="mt-5 text-sm font-medium text-white">
                Trial conversion dropped 14%
              </p>
              <p className="mt-2 text-xs leading-5 text-zinc-400">
                Teams that invite a member in 24h convert 37% more often.
              </p>
              <div className="mt-5 flex items-center justify-between text-[10px] text-zinc-500">
                <span>Confidence</span>
                <span className="font-medium text-violet-300">94%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#0e0e11] text-zinc-100">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0e0e11]/85 backdrop-blur-xl">
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold tracking-tight"
          >
            <NexusMark className="size-8 rounded-[.65rem]" /> Nexus
          </Link>
          <div className="hidden items-center gap-7 text-sm text-zinc-400 md:flex">
            <a href="#product" className="transition-colors hover:text-white">
              Product
            </a>
            <a
              href="#architecture"
              className="transition-colors hover:text-white"
            >
              Architecture
            </a>
            <Link href="/login" className="transition-colors hover:text-white">
              Sign in
            </Link>
          </div>
          <Link
            href="/demo/dashboard"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-white px-3.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            View demo <ArrowRight className="size-4" />
          </Link>
        </nav>
      </header>
      <section className="relative px-5 pb-20 pt-20 text-center sm:pt-28 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[440px] max-w-5xl bg-[radial-gradient(ellipse_at_top,rgba(124,92,255,.17),transparent_65%)]" />
        <div className="relative mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/8 px-3 py-1.5 text-xs font-medium text-violet-300">
            <span className="size-1.5 rounded-full bg-cyan-300" /> Portfolio
            project · Production-minded
          </span>
          <h1 className="mx-auto mt-7 max-w-4xl text-balance text-4xl font-semibold tracking-[-.052em] text-white sm:text-6xl lg:text-[4.75rem] lg:leading-[.99]">
            See the signals shaping your SaaS growth.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-zinc-400 sm:text-lg">
            Nexus brings revenue, customers and product intelligence into a
            secure multi-workspace command center built for fast decisions.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/demo/dashboard"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-lg shadow-violet-950/35 transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-violet-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              Explore the read-only demo <ArrowRight className="size-4" />
            </Link>
            <a
              href="https://github.com/vitorgamer778/nexus-saas-dashboard"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/12 bg-white/[.025] px-5 text-sm font-medium text-zinc-200 transition hover:bg-white/[.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <GitFork className="size-4" /> View source
            </a>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            No account or credentials required. Demo data is fictional.
          </p>
        </div>
        <div className="relative mt-16 before:pointer-events-none before:absolute before:-inset-12 before:-z-10 before:bg-[radial-gradient(ellipse_at_center,rgba(124,92,255,.13),transparent_65%)]">
          <DashboardPreview />
        </div>
      </section>
      <section
        className="border-y border-white/8 bg-white/[.018] px-5 py-8"
        aria-label="Technology stack"
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-medium text-zinc-500 sm:text-sm">
          {[
            "Next.js 16",
            "React 19",
            "TypeScript",
            "Supabase",
            "Tailwind CSS",
            "Playwright",
            "Vercel",
          ].map((item) => (
            <span key={item} className="transition-colors hover:text-zinc-300">
              {item}
            </span>
          ))}
        </div>
      </section>
      <section id="product" className="px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-violet-400">
              A complete operating layer
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-.035em] text-white sm:text-4xl">
              Deep enough to feel real. Focused enough to stay useful.
            </h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="group bg-[#111116] p-6 transition-colors hover:bg-[#15151b]"
              >
                <div className="grid size-9 place-items-center rounded-lg border border-white/8 bg-white/[.035] text-violet-300 transition-transform group-hover:-translate-y-0.5 group-hover:scale-105">
                  <Icon className="size-4.5" />
                </div>
                <h3 className="mt-5 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="architecture" className="px-5 pb-24 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 rounded-3xl border border-white/8 bg-white/[.02] p-7 md:grid-cols-[.8fr_1.2fr] md:p-10">
          <div>
            <p className="text-sm font-semibold text-cyan-300">
              Architecture that earns trust
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-.035em] text-white">
              Security is part of the product, not a footnote.
            </h2>
            <p className="mt-4 text-sm leading-6 text-zinc-500">
              The public demo never touches production data. Authenticated
              routes retain server-side protection and workspace-level
              authorization.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Server-side session validation",
              "Explicit workspace-scoped RLS",
              "Owner-to-viewer RBAC",
              "Atomic workspace onboarding",
              "Safe local redirects",
              "CSP and security headers",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-white/8 bg-[#0e0e11] p-4 text-sm text-zinc-300"
              >
                <span className="grid size-6 place-items-center rounded-full bg-emerald-400/10 text-emerald-400">
                  <Check className="size-3.5" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="border-t border-white/8 px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-zinc-300">
            <NexusMark className="size-7 rounded-lg" />
            <span className="font-medium">Nexus</span>
            <span className="text-zinc-600">· Portfolio SaaS</span>
          </div>
          <div className="flex gap-5">
            <Link href="/demo/dashboard" className="hover:text-white">
              Demo
            </Link>
            <Link href="/login" className="hover:text-white">
              Sign in
            </Link>
            <a
              href="https://github.com/vitorgamer778/nexus-saas-dashboard"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
