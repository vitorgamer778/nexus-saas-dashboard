import { RevenueChart } from "@/components/dashboard-chart";
import { Card } from "@/components/ui";
import { Metric, PageHead, SectionTitle } from "@/components/page-kit";
export default function Analytics() {
  return (
    <>
      <PageHead
        title="Analytics"
        description="Understand acquisition, engagement and conversion."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Visitors" value="24,892" change="18.2%" />
        <Metric label="Sessions" value="38,104" change="14.8%" />
        <Metric label="Conversions" value="1,284" change="6.8%" />
        <Metric label="Conversion rate" value="5.16%" change="0.7%" />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card className="overflow-hidden">
          <SectionTitle
            title="Traffic & conversion"
            description="Daily qualified traffic trend"
          />
          <div className="p-4">
            <RevenueChart />
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold">Top acquisition channels</h2>
          {[
            ["Organic search", "38%", 88],
            ["Direct", "26%", 64],
            ["Product Hunt", "16%", 45],
            ["Partner referrals", "12%", 34],
            ["Social", "8%", 24],
          ].map((x) => (
            <div key={x[0]} className="mt-5">
              <div className="mb-2 flex justify-between text-sm">
                <span>{x[0]}</span>
                <b>{x[1]}</b>
              </div>
              <div className="h-1.5 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${x[2]}%` }}
                />
              </div>
            </div>
          ))}
        </Card>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {[
          [
            "Top countries",
            "Brazil · 42%",
            "United States · 21%",
            "Portugal · 11%",
          ],
          ["Devices", "Desktop · 61%", "Mobile · 34%", "Tablet · 5%"],
          ["Browsers", "Chrome · 67%", "Safari · 22%", "Edge · 7%"],
        ].map((x) => (
          <Card key={x[0]} className="p-5">
            <h2 className="font-semibold">{x[0]}</h2>
            {x.slice(1).map((y) => (
              <p
                key={y}
                className="mt-4 flex justify-between border-b pb-3 text-sm last:border-0"
              >
                {y.split(" · ")[0]}
                <b>{y.split(" · ")[1]}</b>
              </p>
            ))}
          </Card>
        ))}
      </div>
    </>
  );
}
