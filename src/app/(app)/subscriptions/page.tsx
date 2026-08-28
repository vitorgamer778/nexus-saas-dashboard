import { Badge, Button, Card } from "@/components/ui";
import { PageHead, Metric } from "@/components/page-kit";
import { Check } from "lucide-react";
const plans = [
  ["Free", "$0", "For small personal projects"],
  ["Starter", "$19", "For early-stage teams"],
  ["Pro", "$49", "For scaling companies"],
  ["Business", "$129", "For advanced operations"],
];
export default function Subscriptions() {
  return (
    <>
      <PageHead
        title="Subscriptions"
        description="Plans, billing cycles and recurring revenue."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metric label="Active subscriptions" value="1,182" change="7.6%" />
        <Metric label="Upcoming revenue" value="$42,940" change="11.3%" />
        <Metric label="Past due" value="18" change="2.4%" down />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((p, i) => (
          <Card
            key={p[0]}
            className={`p-5 ${i === 2 ? "ring-2 ring-primary" : ""}`}
          >
            <div className="flex justify-between">
              <h2 className="font-semibold">{p[0]}</h2>
              {i === 2 && <Badge tone="blue">Popular</Badge>}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{p[2]}</p>
            <p className="mt-6 text-3xl font-semibold">
              {p[1]}
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
              {[
                "Unlimited projects",
                `${i ? 10 * i : 2} team seats`,
                "Advanced analytics",
                "Email support",
              ].map((x) => (
                <p className="flex gap-2" key={x}>
                  <Check className="size-4 text-emerald-500" />
                  {x}
                </p>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
