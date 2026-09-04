import type { Metadata } from "next";
import Link from "next/link";
import { NexusMark } from "@/components/nexus-mark";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using the Nexus portfolio SaaS dashboard.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-16">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold"><NexusMark className="size-8" /> Nexus</Link>
        <article className="mt-14 space-y-9 text-sm leading-7 text-muted-foreground">
          <header className="space-y-3 border-b pb-8"><p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Legal</p><h1 className="text-4xl font-semibold tracking-tight text-foreground">Terms of Service</h1><p>Last updated September 3, 2026</p></header>
          <section><h2 className="mb-2 text-xl font-semibold text-foreground">About Nexus</h2><p>Nexus is a portfolio and demonstration SaaS product. Features, sample insights, plans, and analytics may be illustrative and are not financial, accounting, or business advice.</p></section>
          <section><h2 className="mb-2 text-xl font-semibold text-foreground">Acceptable use</h2><p>You agree not to misuse the service, attempt unauthorized access, interfere with other workspaces, upload unlawful content, or use Nexus to harm other people or systems.</p></section>
          <section><h2 className="mb-2 text-xl font-semibold text-foreground">Accounts and security</h2><p>You are responsible for activity under your account and for keeping access credentials secure. Notify us if you believe your account has been compromised.</p></section>
          <section><h2 className="mb-2 text-xl font-semibold text-foreground">Availability</h2><p>The service is provided on an as-is and as-available basis. Because Nexus is a portfolio project, features may change and uninterrupted availability is not guaranteed.</p></section>
          <section><h2 className="mb-2 text-xl font-semibold text-foreground">Your content</h2><p>You retain ownership of content you submit. You grant Nexus the limited permission necessary to store, process, and display that content solely to operate the service.</p></section>
          <section><h2 className="mb-2 text-xl font-semibold text-foreground">Contact</h2><p>Questions about these terms can be sent to <a className="text-primary underline-offset-4 hover:underline" href="mailto:ytvitorgamer6@gmail.com">ytvitorgamer6@gmail.com</a>.</p></section>
        </article>
        <footer className="mt-14 flex gap-5 border-t pt-6 text-sm text-muted-foreground"><Link className="hover:text-foreground" href="/privacy">Privacy</Link><Link className="hover:text-foreground" href="/">Home</Link></footer>
      </div>
    </main>
  );
}
