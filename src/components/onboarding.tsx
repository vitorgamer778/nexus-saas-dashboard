"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "./ui";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
const steps = ["Welcome", "Workspace", "Goal", "Plan", "Team"];
export function Onboarding() {
  const [i, setI] = useState(0),
    router = useRouter();
  return (
    <div className="mx-auto max-w-2xl">
      <div
        className="mb-8 flex items-center justify-center gap-2"
        aria-label={`Step ${i + 1} of ${steps.length}`}
      >
        {steps.map((s, n) => (
          <div key={s} className="flex items-center">
            <span
              className={`grid size-8 place-items-center rounded-full text-xs font-semibold ${n <= i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              {n < i ? <Check className="size-4" /> : n + 1}
            </span>
            {n < steps.length - 1 && (
              <span
                className={`h-px w-7 sm:w-16 ${n < i ? "bg-primary" : "bg-border"}`}
              />
            )}
          </div>
        ))}
      </div>
      <Card className="p-7 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Step {i + 1} of {steps.length}
        </p>
        <h1 className="mt-2 text-2xl font-semibold">
          {
            [
              "Welcome to Nexus",
              "Name your workspace",
              "What is your main goal?",
              "Choose your starting plan",
              "Invite your team",
            ][i]
          }
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {
            [
              "Let’s personalize your workspace in a few quick steps.",
              "You can change this later in workspace settings.",
              "This helps us tailor your dashboard experience.",
              "Start free and upgrade whenever your team is ready.",
              "Collaboration works better when everyone is here.",
            ][i]
          }
        </p>
        <div className="mt-8 min-h-32">
          {i === 0 && (
            <div className="rounded-xl bg-primary/10 p-5 text-sm">
              You’re joining 4,800+ product-led teams making faster, clearer
              decisions with Nexus.
            </div>
          )}
          {i === 1 && (
            <label className="text-sm font-medium">
              Workspace name
              <Input className="mt-2" defaultValue="Orbit Labs" />
            </label>
          )}
          {i === 2 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Grow revenue",
                "Understand customers",
                "Reduce churn",
                "Scale operations",
              ].map((x) => (
                <button
                  key={x}
                  className="rounded-xl border p-4 text-left text-sm hover:border-primary hover:bg-primary/5"
                >
                  {x}
                </button>
              ))}
            </div>
          )}
          {i === 3 && (
            <div className="grid grid-cols-2 gap-3">
              {[
                "Free · $0",
                "Starter · $19",
                "Pro · $49",
                "Business · $129",
              ].map((x) => (
                <button
                  key={x}
                  className="rounded-xl border p-4 text-left text-sm hover:border-primary hover:bg-primary/5"
                >
                  {x}
                </button>
              ))}
            </div>
          )}
          {i === 4 && (
            <div className="space-y-3">
              <Input type="email" placeholder="teammate@company.com" />
              <Input type="email" placeholder="another@company.com" />
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-between border-t pt-5">
          <Button
            variant="ghost"
            disabled={i === 0}
            onClick={() => setI(i - 1)}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Button
            onClick={() =>
              i === steps.length - 1 ? router.push("/dashboard") : setI(i + 1)
            }
          >
            {i === steps.length - 1 ? "Open dashboard" : "Continue"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
