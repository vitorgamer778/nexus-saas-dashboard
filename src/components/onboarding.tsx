"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "./ui";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { switchWorkspace } from "@/app/(app)/workspace-actions";
const steps = ["Welcome", "Workspace", "Goal", "Plan", "Team"];
export function Onboarding({
  plans,
}: {
  plans: { id: string; name: string; priceMonthly: number }[];
}) {
  const [i, setI] = useState(0),
    [workspaceName, setWorkspaceName] = useState(""),
    [goal, setGoal] = useState("Grow revenue"),
    [plan, setPlan] = useState("free"),
    [error, setError] = useState(""),
    [saving, setSaving] = useState(false),
    router = useRouter();
  const finish = async () => {
    setSaving(true);
    setError("");
    try {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user)
        throw new Error("Your session expired. Please sign in again.");
      const name = workspaceName.trim();
      if (name.length < 2) throw new Error("Enter a workspace name.");
      const base = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const slug = `${base}-${auth.user.id.slice(0, 6)}`;
      const { data: workspaceId, error: workspaceError } = await supabase.rpc(
        "create_workspace",
        {
          workspace_name: name,
          workspace_slug: slug,
          selected_goal: goal,
          selected_plan: plan,
        },
      );
      if (workspaceError) throw workspaceError;
      if (!workspaceId) throw new Error("The workspace could not be selected.");
      await switchWorkspace(workspaceId);
      router.push("/dashboard");
      router.refresh();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Could not create the workspace.",
      );
      setSaving(false);
    }
  };
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
              <Input
                className="mt-2"
                value={workspaceName}
                onChange={(event) => setWorkspaceName(event.target.value)}
                placeholder="Acme Inc."
              />
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
                  onClick={() => setGoal(x)}
                  aria-pressed={goal === x}
                  className={`rounded-xl border p-4 text-left text-sm hover:border-primary hover:bg-primary/5 ${goal === x ? "border-primary bg-primary/10" : ""}`}
                >
                  {x}
                </button>
              ))}
            </div>
          )}
          {i === 3 && (
            <div className="grid grid-cols-2 gap-3">
              {plans.map(({ id, name, priceMonthly }) => (
                <button
                  key={id}
                  onClick={() => setPlan(id)}
                  aria-pressed={plan === id}
                  className={`rounded-xl border p-4 text-left text-sm hover:border-primary hover:bg-primary/5 ${plan === id ? "border-primary bg-primary/10" : ""}`}
                >
                  {name} · ${priceMonthly}
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
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500"
          >
            {error}
          </p>
        )}
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
            disabled={saving || (i === 1 && workspaceName.trim().length < 2)}
            onClick={() => (i === steps.length - 1 ? finish() : setI(i + 1))}
          >
            {i === steps.length - 1
              ? saving
                ? "Creating…"
                : "Open dashboard"
              : "Continue"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
