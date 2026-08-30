"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge, Card } from "@/components/ui";
import { SectionTitle } from "@/components/page-kit";
import type { buildAnalyticsModel } from "@/lib/analytics-model";

type Model = ReturnType<typeof buildAnalyticsModel>;

export function AnalyticsSections({ model }: { model: Model }) {
  return (
    <>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_1fr]">
        <Funnel stages={model.stages} />
        <Movement items={model.movement} />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <Retention cohorts={model.cohorts} />
        <Attribution
          dimensions={model.dimensions}
          conversion={model.conversion}
        />
      </div>
    </>
  );
}

function Funnel({ stages }: { stages: Model["stages"] }) {
  const numericMax = Math.max(
    1,
    ...stages.flatMap((stage) => (stage.value === null ? [] : [stage.value])),
  );
  return (
    <Card className="overflow-hidden">
      <SectionTitle
        title="Acquisition funnel"
        description="Workspace lifecycle conversion; visitor analytics requires tracking"
        aside={<Badge tone="blue">Live + proxy</Badge>}
      />
      <div className="space-y-2 p-5">
        {stages.map((stage, index) => (
          <div key={stage.name} className="group">
            <div className="flex items-center justify-between gap-3 text-sm">
              <div>
                <span className="font-medium">{stage.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {stage.note}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <strong className="font-mono">{stage.value ?? "—"}</strong>
                {index > 0 && (
                  <span className="w-24 text-right text-xs text-muted-foreground">
                    {stage.conversion === null
                      ? "No baseline"
                      : stage.conversion +
                        "% convert · " +
                        stage.dropOff +
                        "% drop"}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-2 h-7 overflow-hidden rounded-lg bg-muted/50">
              <div
                className="h-full min-w-0 rounded-lg bg-primary/70 transition-[width]"
                style={{
                  width:
                    stage.value === null
                      ? "0%"
                      : Math.max(4, (stage.value / numericMax) * 100) + "%",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Movement({ items }: { items: Model["movement"] }) {
  return (
    <Card className="overflow-hidden">
      <SectionTitle
        title="MRR movement"
        description="Current 30-day portfolio snapshot"
      />
      <div className="p-4">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={items}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => "$" + value}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            />
            <Tooltip
              formatter={(value, _name, entry) =>
                entry.payload.available
                  ? ["$" + Number(value).toLocaleString(), "MRR"]
                  : ["Not tracked", "MRR"]
              }
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "var(--popover)",
              }}
            />
            <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2">
          {items.map((item) => (
            <div key={item.name} className="rounded-lg bg-muted/50 p-3 text-sm">
              <p className="text-xs text-muted-foreground">{item.name}</p>
              <p className="mt-1 font-mono font-semibold">
                {item.available
                  ? "$" + item.value.toLocaleString()
                  : "Not tracked"}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Expansion and contraction require subscription change history; Nexus
          does not fabricate those values.
        </p>
      </div>
    </Card>
  );
}

function Retention({ cohorts }: { cohorts: Model["cohorts"] }) {
  return (
    <Card className="overflow-hidden">
      <SectionTitle
        title="Retention cohort"
        description="Monthly customer activity proxy based on last recorded activity"
        aside={<Badge>Activity proxy</Badge>}
      />
      <div className="overflow-x-auto p-5">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr>
              <th className="pb-3 text-left font-medium">Cohort</th>
              <th className="pb-3 text-center font-medium">Customers</th>
              {["M0", "M1", "M2", "M3"].map((month) => (
                <th key={month} className="pb-3 text-center font-medium">
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((cohort) => (
              <tr key={cohort.cohort}>
                <td className="py-1.5 font-medium">{cohort.cohort}</td>
                <td className="py-1.5 text-center font-mono">
                  {cohort.customers}
                </td>
                {cohort.retention.map((value, index) => (
                  <td key={index} className="p-1">
                    <span
                      className="block rounded-md px-2 py-2 text-center text-xs font-medium"
                      style={{
                        backgroundColor:
                          value === null
                            ? "var(--muted)"
                            : "color-mix(in oklab, var(--primary) " +
                              Math.max(8, value) +
                              "%, transparent)",
                      }}
                    >
                      {value === null ? "—" : value + "%"}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Attribution({
  dimensions,
  conversion,
}: {
  dimensions: Model["dimensions"];
  conversion: number;
}) {
  const groups = [
    { title: "Acquisition channel", data: dimensions.channels },
    { title: "Device", data: dimensions.devices },
    { title: "Browser", data: dimensions.browsers },
    { title: "Country", data: dimensions.countries },
  ];
  return (
    <Card className="overflow-hidden">
      <SectionTitle
        title="Acquisition context"
        description="Attribution metadata captured by workspace events"
        aside={<Badge tone="green">{conversion}% paid</Badge>}
      />
      <div className="grid gap-px bg-border sm:grid-cols-2">
        {groups.map((group) => (
          <section key={group.title} className="min-h-36 bg-card p-4">
            <h3 className="text-sm font-semibold">{group.title}</h3>
            {group.data.length ? (
              <div className="mt-3 space-y-2">
                {group.data.slice(0, 3).map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between text-xs">
                      <span className="truncate">{item.name}</span>
                      <strong>{item.share}%</strong>
                    </div>
                    <div className="mt-1 h-1 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: item.share + "%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium">Tracking not connected</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  No real {group.title.toLowerCase()} metadata yet.
                </p>
              </div>
            )}
          </section>
        ))}
      </div>
    </Card>
  );
}
