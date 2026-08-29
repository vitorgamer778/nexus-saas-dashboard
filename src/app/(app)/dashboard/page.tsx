import { RevenueChart, PlansChart } from "@/components/dashboard-chart";
import { Badge, Button, Card } from "@/components/ui";
import { PageHead, SectionTitle } from "@/components/page-kit";
import { DashboardKpi } from "@/components/dashboard-kpi";
import { NexusIntelligence } from "@/components/nexus-intelligence";
import { buildDashboardMetrics, periodChange } from "@/lib/dashboard-metrics";
import { getNexusInsights } from "@/lib/intelligence";
import { getCustomers, getTransactions } from "@/lib/queries";
import { getCurrentWorkspace } from "@/lib/workspace";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";
export default async function Dashboard() {
  const [customers, transactions, workspace, supabase] = await Promise.all([
    getCustomers(),
    getTransactions(),
    getCurrentWorkspace(),
    createClient(),
  ]);
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "there";
  const metrics = buildDashboardMetrics(customers);
  const mrrChange = periodChange(metrics.mrrSeries);
  const activeChange = periodChange(metrics.activeSeries);
  const churnChange = periodChange(metrics.churnSeries);
  const intelligence = await getNexusInsights({
    activeCustomers: metrics.active,
    mrr: metrics.mrr,
    churn: metrics.churn,
  });
  const money = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  const months = Array.from({ length: 6 }, (_, index) => {
    const value = new Date();
    value.setMonth(value.getMonth() - (5 - index));
    return {
      key: `${value.getFullYear()}-${value.getMonth()}`,
      month: value.toLocaleString("en-US", { month: "short" }),
      value: 0,
    };
  });
  for (const transaction of transactions) {
    if (transaction.status !== "Approved") continue;
    const value = new Date(transaction.processedAt);
    const bucket = months.find(
      (month) => month.key === `${value.getFullYear()}-${value.getMonth()}`,
    );
    if (bucket) bucket.value += transaction.value;
  }
  const planCounts = new Map<string, number>();
  customers.forEach((customer) =>
    planCounts.set(customer.plan, (planCounts.get(customer.plan) ?? 0) + 1),
  );
  const planData = [...planCounts].map(([name, value]) => ({ name, value }));
  return (
    <>
      <PageHead
        title={`Good morning, ${firstName}`}
        description={`Here’s what’s happening with ${workspace?.name ?? "your workspace"} today.`}
        action={
          <Button variant="outline">
            <CalendarDays className="size-4" />
            Mar 1 – Aug 28
          </Button>
        }
      />
      <NexusIntelligence
        insights={intelligence.insights}
        mode={intelligence.mode}
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
        <DashboardKpi
          label="Monthly recurring revenue"
          value={money(metrics.mrr)}
          series={metrics.mrrSeries}
          percent={mrrChange.percent}
          detail={`${metrics.newMrrThisMonth >= 0 ? "+" : ""}${money(metrics.newMrrThisMonth)} new MRR this month`}
          formatTooltip={money}
        />
        <DashboardKpi
          label="Annual run rate"
          value={money(metrics.mrr * 12)}
          series={metrics.mrrSeries.map((point) => ({
            ...point,
            value: point.value * 12,
          }))}
          percent={mrrChange.percent}
          detail={`${metrics.newMrrThisMonth >= 0 ? "+" : ""}${money(metrics.newMrrThisMonth * 12)} annualized this month`}
          formatTooltip={money}
        />
        <DashboardKpi
          label="Active customers"
          value={metrics.active.toLocaleString()}
          series={metrics.activeSeries}
          percent={activeChange.percent}
          detail={`+${metrics.newActiveThisMonth} active ${metrics.newActiveThisMonth === 1 ? "customer" : "customers"} this month`}
        />
        <DashboardKpi
          label="Churn rate"
          value={`${metrics.churn.toFixed(1)}%`}
          series={metrics.churnSeries}
          percent={churnChange.percent}
          lowerIsBetter
          detail={`${churnChange.delta >= 0 ? "+" : ""}${churnChange.delta.toFixed(1)} pts vs previous month · lower is better`}
          formatTooltip={(value) => `${value.toFixed(1)}%`}
        />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.65fr_1fr]">
        <Card className="animate-rise delay-1 overflow-hidden">
          <SectionTitle
            title="Revenue growth"
            description="MRR performance over the last 6 months"
            aside={<Badge tone="green">Live data</Badge>}
          />
          <div className="p-4">
            <RevenueChart data={months} />
          </div>
        </Card>
        <Card className="animate-rise delay-2 overflow-hidden">
          <SectionTitle
            title="Customers by plan"
            description="Current distribution"
          />
          {planData.length ? (
            <PlansChart data={planData} />
          ) : (
            <p className="p-8 text-sm text-muted-foreground">
              Plan distribution will appear after you add customers.
            </p>
          )}
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
