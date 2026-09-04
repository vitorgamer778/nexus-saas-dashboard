import type { Metadata } from "next";
import Link from "next/link";
import { NexusMark } from "@/components/nexus-mark";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Nexus handles account and workspace data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-16">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold">
          <NexusMark className="size-8" /> Nexus
        </Link>
        <article className="mt-14 space-y-9 text-sm leading-7 text-muted-foreground">
          <header className="space-y-3 border-b pb-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Legal</p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">Privacy Policy</h1>
            <p>Last updated September 3, 2026</p>
          </header>
          <section><h2 className="mb-2 text-xl font-semibold text-foreground">Overview</h2><p>Nexus is a portfolio SaaS dashboard. We process only the information needed to authenticate users, maintain their session, and provide workspace features.</p></section>
          <section><h2 className="mb-2 text-xl font-semibold text-foreground">Information we process</h2><p>When you sign in, we may receive your name, email address, profile image, authentication provider, and technical session information. Workspace content you create is stored to provide the product experience.</p></section>
          <section><h2 className="mb-2 text-xl font-semibold text-foreground">How information is used</h2><p>Information is used to secure accounts, provide requested features, maintain workspace boundaries, diagnose reliability issues, and prevent abuse. Nexus does not sell personal information.</p></section>
          <section><h2 className="mb-2 text-xl font-semibold text-foreground">Services and retention</h2><p>Nexus uses Supabase for authentication and data storage and Vercel for application hosting. Data is retained while an account or workspace is active, subject to operational backups and applicable legal requirements.</p></section>
          <section><h2 className="mb-2 text-xl font-semibold text-foreground">Your choices</h2><p>You may request access, correction, export, or deletion of your account data. You can also revoke Google access from your Google Account security settings.</p></section>
          <section><h2 className="mb-2 text-xl font-semibold text-foreground">Contact</h2><p>For privacy or account questions, contact <a className="text-primary underline-offset-4 hover:underline" href="mailto:ytvitorgamer6@gmail.com">ytvitorgamer6@gmail.com</a>.</p></section>
        </article>
        <footer className="mt-14 flex gap-5 border-t pt-6 text-sm text-muted-foreground"><Link className="hover:text-foreground" href="/terms">Terms</Link><Link className="hover:text-foreground" href="/">Home</Link></footer>
      </div>
    </main>
  );
}
