"use client";

import { useState } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  BrainCircuit,
  CheckCircle2,
  CreditCard,
  FlaskConical,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { Badge, Button, Card } from "./ui";
import type { InsightKind, NexusInsight } from "@/lib/intelligence";
import { cn } from "@/lib/utils";

const icons: Record<InsightKind, typeof Target> = {
  "churn-risk": ShieldAlert,
  "conversion-anomaly": TrendingUp,
  "mrr-opportunity": BadgeDollarSign,
  "failed-payment-trend": CreditCard,
  "retention-improvement": UsersRound,
};

export function NexusIntelligence({
  insights,
  mode,
}: {
  insights: NexusInsight[];
  mode: "demo" | "live";
}) {
  const [selected, setSelected] = useState(0);
  const [investigating, setInvestigating] = useState(false);
  const insight = insights[selected];
  if (!insight) return null;
  const Icon = icons[insight.kind];
  return (
    <Card className="relative mb-4 overflow-hidden border-primary/25 bg-[color-mix(in_srgb,var(--card)_94%,var(--primary))]">
      <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full border border-primary/10" />
      <div className="pointer-events-none absolute -right-6 -top-10 size-36 rounded-full border border-accent/15" />
      <div className="relative border-b border-primary/10 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <BrainCircuit className="size-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold tracking-tight">
                  Nexus Intelligence
                </h2>
                <Badge tone={mode === "live" ? "green" : "blue"}>
                  {mode === "live" ? "Live" : "Demo insights"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Signals, possible causes and recommended next steps
              </p>
            </div>
          </div>
          <div
            className="flex max-w-full gap-1 overflow-x-auto"
            role="tablist"
            aria-label="Intelligence insights"
          >
            {insights.map((item, index) => {
              const TabIcon = icons[item.kind];
              return (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={index === selected}
                  aria-label={item.eyebrow}
                  onClick={() => {
                    setSelected(index);
                    setInvestigating(false);
                  }}
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-lg border transition-colors",
                    index === selected
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <TabIcon className="size-4" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.35fr_.65fr]">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-primary">
            <Icon className="size-3.5" />
            {insight.eyebrow}
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-.025em] sm:text-2xl">
            {insight.title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {insight.summary}
          </p>
          <div className="mt-5 rounded-xl border border-border/80 bg-background/65 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Possible cause
            </p>
            <p className="mt-2 text-sm leading-6">{insight.possibleCause}</p>
          </div>
          {investigating && (
            <div className="mt-4 grid gap-2 sm:grid-cols-3" aria-live="polite">
              {insight.evidence.map((item) => (
                <div
                  key={item}
                  className="flex gap-2 rounded-lg bg-muted/60 p-3 text-xs leading-5"
                >
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => setInvestigating((value) => !value)}>
              {investigating ? "Hide evidence" : "Investigate"}
              <ArrowRight
                className={cn(
                  "size-4 transition-transform",
                  investigating && "rotate-90",
                )}
              />
            </Button>
            <Button
              variant="outline"
              disabled
              title="Campaign automation is not connected"
            >
              <Sparkles className="size-4" />
              Create campaign · coming soon
            </Button>
          </div>
        </div>
        <aside className="flex flex-col justify-between gap-5 rounded-xl border border-border/70 bg-card/70 p-4">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Confidence</span>
              <strong>{insight.confidence}%</strong>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${insight.confidence}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Demo confidence score for interface preview.
            </p>
          </div>
          <div className="border-t pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Estimated impact
            </p>
            <p className="mt-2 text-sm font-semibold">{insight.impact}</p>
          </div>
          {mode === "demo" && (
            <div className="flex gap-2 rounded-lg bg-amber-500/8 p-3 text-xs leading-5 text-muted-foreground">
              <FlaskConical className="mt-0.5 size-4 shrink-0 text-amber-500" />
              <span>
                Illustrative data only. No AI request was made and no action is
                executed automatically.
              </span>
            </div>
          )}
        </aside>
      </div>
    </Card>
  );
}
