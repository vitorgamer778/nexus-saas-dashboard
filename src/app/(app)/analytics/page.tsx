import { AnalyticsSections } from "@/components/analytics-sections";
import { RevenueChart } from "@/components/dashboard-chart";
import { Card } from "@/components/ui";
import { Metric, PageHead, SectionTitle } from "@/components/page-kit";
import { getAnalyticsData } from "@/lib/queries";

export default async function Analytics() {
  const analytics = await getAnalyticsData();
  if (!analytics) return null;
  const { customers, transactions, model } = analytics;
  const months = Array.from({ length: 6 }, (_, index) => {
    const value = new Date();
    value.setMonth(value.getMonth() - (5 - index));
    return {
      key: value.getFullYear() + "-" + value.getMonth(),
      month: value.toLocaleString("en-US", { month: "short" }),
      value: 0,
    };
  });
  transactions
    .filter((item) => item.status === "Approved")
    .forEach((item) => {
      const value = new Date(item.processedAt);
      const bucket = months.find(
        (month) => month.key === value.getFullYear() + "-" + value.getMonth(),
      );
      if (bucket) bucket.value += item.value;
    });
  const approved = transactions.filter(
    (item) => item.status === "Approved",
  ).length;
  const active = customers.filter((item) => item.status === "Active").length;
  return (
    <>
      <PageHead
        title="Analytics"
        description="Understand acquisition, revenue movement, retention and conversion."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Customers"
          value={String(customers.length)}
          change="Live"
          detail="Current workspace"
        />
        <Metric
          label="Active customers"
          value={String(active)}
          change="Live"
          detail="Current status"
        />
        <Metric
          label="Approved payments"
          value={String(approved)}
          change="Live"
          detail="All recorded transactions"
        />
        <Metric
          label="Paid conversion"
          value={model.conversion + "%"}
          change="Live"
          detail="Customer-to-paid proxy"
        />
      </div>
      <Card className="mt-4 overflow-hidden">
        <SectionTitle
          title="Approved revenue trend"
          description="Monthly approved transaction volume from Supabase"
        />
        <div className="p-4">
          <RevenueChart data={months} />
        </div>
      </Card>
      <AnalyticsSections model={model} />
    </>
  );
}
