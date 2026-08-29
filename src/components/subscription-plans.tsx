"use client";

import { useState, useTransition } from "react";
import { Dialog } from "radix-ui";
import { Check, LoaderCircle, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { changeWorkspacePlan } from "@/app/(app)/subscriptions/actions";
import { Badge, Button, Card } from "@/components/ui";
import { cn } from "@/lib/utils";

export type PlanOverview = {
  id: string;
  name: string;
  priceMonthly: number;
  features: string[];
  customerCount: number;
  revenue: number;
  statuses: Record<string, number>;
};

export function SubscriptionPlans({
  plans,
  currentPlanId,
  canChangePlan,
}: {
  plans: PlanOverview[];
  currentPlanId: string;
  canChangePlan: boolean;
}) {
  const [selected, setSelected] = useState<PlanOverview | null>(null);
  const [pending, startTransition] = useTransition();
  const currentPlan = plans.find((plan) => plan.id === currentPlanId);

  function confirm() {
    if (!selected) return;
    startTransition(async () => {
      try {
        await changeWorkspacePlan(selected.id);
        toast.success("Workspace plan changed to " + selected.name + ".");
        setSelected(null);
      } catch (reason) {
        toast.error(
          reason instanceof Error ? reason.message : "Could not change plan.",
        );
      }
    });
  }

  if (!plans.length)
    return (
      <Card className="grid min-h-64 place-items-center p-8 text-center">
        <div>
          <h2 className="font-semibold">Plans are unavailable</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The plan catalog could not be loaded from the database.
          </p>
        </div>
      </Card>
    );

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <p className="text-sm font-semibold">Current workspace plan</p>
          </div>
          <p className="mt-1 text-xl font-semibold">
            {currentPlan?.name ?? "Unknown"}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ${currentPlan?.priceMonthly ?? 0} / month
            </span>
          </p>
        </div>
        <p className="max-w-md text-xs text-muted-foreground">
          Monthly billing is the only cycle currently supported. Plan changes
          update the Nexus workspace tier; an external payment provider is not
          connected.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const current = plan.id === currentPlanId;
          const popular = plan.id === "pro";
          return (
            <Card
              key={plan.id}
              className={cn(
                "relative flex flex-col p-5",
                current && "ring-2 ring-primary",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold">{plan.name}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {plan.customerCount}{" "}
                    {plan.customerCount === 1 ? "customer" : "customers"} on
                    this plan
                  </p>
                </div>
                {current ? (
                  <Badge tone="green">Current</Badge>
                ) : popular ? (
                  <Badge tone="blue">Popular</Badge>
                ) : null}
              </div>
              <p className="mt-5 text-3xl font-semibold">
                ${plan.priceMonthly}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  /mo
                </span>
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="mt-0.5 font-mono font-medium">
                    ${plan.revenue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active</p>
                  <p className="mt-0.5 font-medium">
                    {plan.statuses.active ?? 0}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex-1 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <p className="flex gap-2" key={feature}>
                    <Check className="size-4 shrink-0 text-emerald-500" />
                    {feature}
                  </p>
                ))}
              </div>
              <Button
                className="mt-5 w-full"
                variant={current ? "outline" : popular ? "default" : "outline"}
                disabled={current || !canChangePlan}
                onClick={() => setSelected(plan)}
              >
                {current
                  ? "Current plan"
                  : canChangePlan
                    ? plan.priceMonthly > (currentPlan?.priceMonthly ?? 0)
                      ? "Upgrade to " + plan.name
                      : "Change to " + plan.name
                    : "Owner or admin required"}
              </Button>
            </Card>
          );
        })}
      </div>
      <Dialog.Root
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open && !pending) setSelected(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-2xl outline-none">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-lg font-semibold">
                  Change workspace plan?
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                  Move from {currentPlan?.name ?? "the current plan"} to{" "}
                  {selected?.name}. This changes access tier metadata
                  immediately.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <Button variant="ghost" disabled={pending} aria-label="Close">
                  <X className="size-4" />
                </Button>
              </Dialog.Close>
            </div>
            <div className="mt-5 rounded-xl bg-muted/50 p-4 text-sm">
              <div className="flex justify-between">
                <span>{selected?.name}</span>
                <strong>${selected?.priceMonthly ?? 0} / month</strong>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                No charge will be created because billing is not connected yet.
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button variant="outline" disabled={pending}>
                  Cancel
                </Button>
              </Dialog.Close>
              <Button onClick={confirm} disabled={pending}>
                {pending && <LoaderCircle className="size-4 animate-spin" />}
                Confirm change
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
