"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card } from "./ui";
import type { MetricPoint } from "@/lib/dashboard-metrics";
import { cn } from "@/lib/utils";

export function DashboardKpi({
  label,
  value,
  series,
  percent,
  detail,
  lowerIsBetter = false,
  formatTooltip = (number) => number.toLocaleString(),
}: {
  label: string;
  value: string;
  series: MetricPoint[];
  percent: number | null;
  detail: string;
  lowerIsBetter?: boolean;
  formatTooltip?: (value: number) => string;
}) {
  const delta = (series.at(-1)?.value ?? 0) - (series.at(-2)?.value ?? 0);
  const favorable = lowerIsBetter ? delta < 0 : delta > 0;
  const neutral = delta === 0;
  const TrendIcon = neutral ? Minus : delta > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <Card className="group relative min-w-0 animate-rise overflow-hidden p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_22px_55px_-34px_var(--primary)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/55 to-transparent opacity-50" />
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold",
            neutral
              ? "bg-muted text-muted-foreground"
              : favorable
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/10 text-red-600 dark:text-red-400",
          )}
        >
          <TrendIcon className="mr-0.5 size-3.5" />
          {percent === null
            ? neutral
              ? "No change"
              : "New"
            : `${Math.abs(percent).toFixed(1)}%`}
        </span>
      </div>
      <p className="mt-4 truncate font-mono text-2xl font-semibold tracking-[-0.045em] sm:text-[1.75rem]">
        {value}
      </p>
      <p className="mt-1 min-h-4 text-xs text-muted-foreground">{detail}</p>
      <div
        className="mt-4 h-[4.25rem] -mb-1"
        aria-label={`${label} trend over the last six months`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={series}
            margin={{ top: 5, right: 2, bottom: 0, left: 2 }}
          >
            <defs>
              <linearGradient
                id={`kpi-${label.replaceAll(" ", "-")}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0"
                  stopColor={
                    favorable || neutral
                      ? "var(--primary)"
                      : "var(--destructive)"
                  }
                  stopOpacity={0.26}
                />
                <stop
                  offset="1"
                  stopColor={
                    favorable || neutral
                      ? "var(--primary)"
                      : "var(--destructive)"
                  }
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Tooltip
              cursor={{ stroke: "var(--border)" }}
              formatter={(entry) => [formatTooltip(Number(entry)), label]}
              labelStyle={{ color: "var(--muted-foreground)" }}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--popover)",
                fontSize: 12,
                boxShadow: "0 10px 30px rgba(0,0,0,.12)",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={
                favorable || neutral ? "var(--primary)" : "var(--destructive)"
              }
              strokeWidth={2.25}
              fill={`url(#kpi-${label.replaceAll(" ", "-")})`}
              dot={false}
              activeDot={{ r: 3.5, strokeWidth: 2, stroke: "var(--card)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="pointer-events-none absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </Card>
  );
}
