import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { NexusMark } from "@/components/nexus-mark";

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background p-6 text-center">
      <div className="pointer-events-none absolute size-[520px] rounded-full bg-primary/10 blur-3xl" />
      <div className="relative max-w-md">
        <NexusMark className="mx-auto size-12 rounded-2xl" />
        <div className="mt-8 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Compass className="size-3.5 text-primary" />
          Signal not found
        </div>
        <h1 className="mt-5 text-6xl font-semibold tracking-[-.06em]">404</h1>
        <p className="mt-4 text-lg font-medium">
          This part of the Nexus is off the map.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The page may have moved, or the link may no longer be available.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            <ArrowLeft className="size-4" />
            Back home
          </Link>
          <Link
            href="/demo/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-lg border bg-card px-4 text-sm font-medium hover:bg-muted"
          >
            Explore demo
          </Link>
        </div>
      </div>
    </main>
  );
}
