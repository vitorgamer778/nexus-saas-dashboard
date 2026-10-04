import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  GitFork,
  Layers3,
  LockKeyhole,
  Users,
} from "lucide-react";
import { NexusMark } from "@/components/nexus-mark";

export const metadata: Metadata = {
  title: "Revenue intelligence for modern SaaS teams",
  description:
    "Explore Nexus: revenue, customer health and growth intelligence in a secure multi-workspace SaaS. Try the fictional read-only demo without an account.",
  alternates: { canonical: "/" },
};

const capabilities = [
  {
    icon: BarChart3,
    title: "Revenue, without the guesswork.",
    body: "Follow recurring revenue, subscription plans and transaction history from one operating view.",
    href: "/demo/dashboard",
    action: "Explore revenue",
  },
  {
    icon: Users,
    title: "Know who needs your attention.",
    body: "Connect customer context with health signals, plans and activity before deciding your next step.",
    href: "/demo/customers",
    action: "Explore customers",
  },
  {
    icon: Layers3,
    title: "Find the story behind the numbers.",
    body: "Inspect acquisition, retention and growth signals with explainable, fictional demo insights.",
    href: "/demo/analytics",
    action: "Explore analytics",
  },
];
const architecture = [
  "Server-side session validation",
  "Workspace-scoped PostgreSQL RLS",
  "Role-aware access",
  "Isolated public demo",
  "Safe local redirects",
  "Security headers",
];

export default function Home() {
  return (
    <div className="nexus-landing">
      <a className="landing-skip" href="#main-content">
        Skip to content
      </a>
      <header className="landing-header">
        <nav className="landing-shell landing-nav" aria-label="Main navigation">
          <Link href="/" className="landing-brand" aria-label="Nexus home">
            <NexusMark className="size-9" />
            Nexus
          </Link>
          <div className="landing-nav-links">
            <a href="#product">Product</a>
            <a href="#architecture">Architecture</a>
            <Link href="/login">Sign in</Link>
          </div>
          <Link
            href="/demo/dashboard"
            className="landing-button landing-button-small"
          >
            View demo <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        <section
          className="landing-shell landing-hero"
          aria-labelledby="hero-heading"
        >
          <div className="landing-hero-copy">
            <p className="landing-status">
              <span aria-hidden="true" />A working portfolio product
            </p>
            <h1 id="hero-heading">See the signals shaping your SaaS growth.</h1>
            <p className="landing-lead">
              Revenue, customers and product intelligence. One clear view of
              what changed — and where to look next.
            </p>
            <div className="landing-actions">
              <Link href="/demo/dashboard" className="landing-button">
                Explore the read-only demo{" "}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a
                href="https://github.com/vitorgamer778/nexus-saas-dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="landing-source"
              >
                <GitFork size={16} aria-hidden="true" />
                View source
              </a>
            </div>
            <p className="landing-demo-note">
              No account or credentials required. Demo data is fictional.
            </p>
            <dl className="landing-facts">
              <div>
                <dt>Revenue</dt>
                <dd>MRR &amp; subscriptions</dd>
              </div>
              <div>
                <dt>Customers</dt>
                <dd>Context &amp; health</dd>
              </div>
              <div>
                <dt>Growth</dt>
                <dd>Funnels &amp; retention</dd>
              </div>
            </dl>
          </div>
          <div className="landing-product-scene">
            <div className="landing-revenue-note">
              <BarChart3 size={20} aria-hidden="true" />
              <div>
                <span>From signal to context</span>
                <strong>Every metric has a story.</strong>
              </div>
            </div>
            <Link
              href="/demo/dashboard"
              className="landing-preview"
            >
              <div className="landing-preview-bar">
                <span>
                  <NexusMark className="size-5" />
                  Nexus workspace
                </span>
                <span>Read-only demo</span>
              </div>
              <Image
                src="/dashboard-preview.webp"
                alt="Nexus revenue dashboard with recurring revenue, customer metrics and a revenue chart, using fictional data"
                width={1440}
                height={900}
                sizes="(max-width: 960px) calc(100vw - 40px), 60vw"
                preload
              />
            </Link>
            <p className="landing-capture">
              Actual product capture. Explore the interactive demo to inspect
              the details.
            </p>
          </div>
        </section>
        <section className="landing-stack" aria-label="Technology stack">
          <div className="landing-shell">
            <span>Built with</span>
            {[
              "Next.js",
              "React",
              "TypeScript",
              "Supabase",
              "PostgreSQL",
              "Vercel",
            ].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>
        <section
          id="product"
          className="landing-shell landing-section"
          aria-labelledby="product-heading"
        >
          <div className="landing-section-heading">
            <h2 id="product-heading">
              The operating view.
              <br />
              Not another pile of dashboards.
            </h2>
            <p>
              Move between revenue, customer operations and analytics without
              losing the context behind a decision.
            </p>
          </div>
          <div className="landing-capabilities">
            {capabilities.map(({ icon: Icon, title, body, href, action }) => (
              <article key={title}>
                <Icon size={26} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{body}</p>
                <Link href={href}>
                  {action}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </section>
        <section
          id="architecture"
          className="landing-architecture"
          aria-labelledby="architecture-heading"
        >
          <div className="landing-shell landing-architecture-grid">
            <div>
              <LockKeyhole size={28} aria-hidden="true" />
              <h2 id="architecture-heading">
                A demo you can explore.
                <br />
                Boundaries you can inspect.
              </h2>
              <p>
                The public demo uses fictional data and performs no writes.
                Authenticated routes keep server-side protection and
                workspace-aware authorization.
              </p>
              <a
                className="landing-source"
                href="https://github.com/vitorgamer778/nexus-saas-dashboard#security-model"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the security model{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
            <ul>
              {architecture.map((item) => (
                <li key={item}>
                  <Check size={18} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section
          className="landing-shell landing-section landing-final"
          aria-labelledby="final-heading"
        >
          <div>
            <h2 id="final-heading">Take a closer look.</h2>
            <p>
              Open the workspace, inspect the flows and see how the pieces fit
              together.
            </p>
          </div>
          <Link href="/demo/dashboard" className="landing-button">
            Open the workspace <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </section>
      </main>
      <footer className="landing-footer">
        <div className="landing-shell">
          <Link href="/" className="landing-brand">
            <NexusMark className="size-7" />
            Nexus<span>Portfolio SaaS · Fictional demo</span>
          </Link>
          <nav aria-label="Footer navigation">
            <Link href="/demo/dashboard">Demo</Link>
            <Link href="/login">Sign in</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
