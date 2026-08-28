import { RevenueChart, PlansChart } from "@/components/dashboard-chart";
import { Badge, Button, Card } from "@/components/ui";
import { Metric, PageHead, SectionTitle } from "@/components/page-kit";
import { customers } from "@/lib/data";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";
import Link from "next/link";
export default function Dashboard() {
  return (
    <>
      <PageHead
        title="Good morning, Isabela"
        description="Here’s what’s happening with Orbit Labs today."
        action={
          <Button variant="outline">
            <CalendarDays className="size-4" />
            Mar 1 – Aug 28
          </Button>
        }
      />
      <div className="mb-4 flex flex-col gap-3 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/[.12] via-primary/[.05] to-transparent p-4 sm:flex-row sm:items-center">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Sparkles className="size-4" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium">
            Nexus Intelligence found a growth opportunity
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Pro trials that activate 3+ teammates convert 28% better. Consider a
            targeted onboarding campaign.
          </p>
        </div>
        <Button variant="outline" className="bg-background/70">
          View insight <ArrowRight className="size-4" />
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Monthly recurring revenue"
          value="$46,820"
          change="12.4%"
        />
        <Metric label="Annual run rate" value="$561.8K" change="8.2%" />
        <Metric label="Active customers" value="1,284" change="6.8%" />
        <Metric
          label="Churn rate"
          value="2.1%"
          change="0.3%"
          down
          detail="lower is better"
        />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.65fr_1fr]">
        <Card className="animate-rise delay-1 overflow-hidden">
          <SectionTitle
            title="Revenue growth"
            description="MRR performance over the last 6 months"
            aside={<Badge tone="green">+31.6% overall</Badge>}
          />
          <div className="p-4">
            <RevenueChart />
          </div>
        </Card>
        <Card className="animate-rise delay-2 overflow-hidden">
          <SectionTitle
            title="Customers by plan"
            description="Current distribution"
          />
          <PlansChart />
        </Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <Card className="overflow-hidden">
          <SectionTitle
            title="Recent customers"
            description="Latest additions to your workspace"
            aside={
              <Link
                className="flex items-center gap-1 text-xs font-medium text-primary"
                href="/customers"
              >
                View all
                <ArrowRight className="size-3" />
              </Link>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">MRR</th>
                </tr>
              </thead>
              <tbody>
                {customers.slice(0, 4).map((c) => (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-5 py-3">
                      <b className="block font-medium">{c.company}</b>
                      <span className="text-xs text-muted-foreground">
                        {c.email}
                      </span>
                    </td>
                    <td className="px-4 py-3">{c.plan}</td>
                    <td className="px-4 py-3">
                      <Badge
                        tone={
                          c.status === "Active"
                            ? "green"
                            : c.status === "Trial"
                              ? "blue"
                              : "amber"
                        }
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-right font-mono">
                      ${c.mrr.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold">Conversion snapshot</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Visitor-to-paid funnel · August
          </p>
          {[
            ["Visitors", "24,892", "100%"],
            ["Sign ups", "3,814", "15.3%"],
            ["Activated", "2,193", "57.5%"],
            ["Paid", "1,284", "58.5%"],
          ].map((x, i) => (
            <div key={x[0]} className="mt-5">
              <div className="mb-2 flex justify-between text-sm">
                <span>{x[0]}</span>
                <b>
                  {x[1]}{" "}
                  <span className="font-normal text-muted-foreground">
                    · {x[2]}
                  </span>
                </b>
              </div>
              <div className="h-1.5 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${100 - i * 19}%` }}
                />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
