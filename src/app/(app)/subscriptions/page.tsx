import { Badge, Button, Card } from "@/components/ui";
import { PageHead, Metric } from "@/components/page-kit";
import { Check } from "lucide-react";
import { getPlans } from "@/lib/queries";

export default async function Subscriptions() {
  const plans = await getPlans();
  return (
    <>
      <PageHead
        title="Subscriptions"
        description="Plans, billing cycles and recurring revenue."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metric
          label="Available plans"
          value={String(plans.length)}
          change="Live"
        />
        <Metric
          label="Starting at"
          value={
            plans.length
              ? `$${Math.min(...plans.map((plan) => Number(plan.price_monthly)))}`
              : "$0"
          }
          change="Live"
        />
        <Metric label="Billing source" value="Supabase" change="Secure" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan, i) => (
          <Card
            key={plan.id}
            className={`p-5 ${i === 2 ? "ring-2 ring-primary" : ""}`}
          >
            <div className="flex justify-between">
              <h2 className="font-semibold">{plan.name}</h2>
              {i === 2 && <Badge tone="blue">Popular</Badge>}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              A flexible plan for your workspace.
            </p>
            <p className="mt-6 text-3xl font-semibold">
              ${Number(plan.price_monthly)}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                /mo
              </span>
            </p>
            <Button
              className="mt-5 w-full"
              variant={i === 2 ? "default" : "outline"}
            >
              {i === 3 ? "Current plan" : "Choose plan"}
            </Button>
            <div className="mt-5 space-y-3 text-sm">
              {(Array.isArray(plan.features) ? plan.features : []).map(
                (x: unknown) => (
                  <p className="flex gap-2" key={String(x)}>
                    <Check className="size-4 text-emerald-500" />
                    {String(x)}
                  </p>
                ),
              )}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
