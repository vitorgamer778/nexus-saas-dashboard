"use client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
export function RevenueChart({
  data,
}: {
  data: { month: string; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={270}>
      <AreaChart data={data} margin={{ left: -16, right: 8, top: 10 }}>
        <defs>
          <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--primary)" stopOpacity={0.28} />
            <stop offset="1" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${v / 1000}k`}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <Tooltip
          formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--popover)",
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--primary)"
          strokeWidth={2.5}
          fill="url(#fill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
const colors = ["#6d5dfc", "#8b7dfd", "#b2a9ff", "#ddd9ff"];
export function PlansChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className="flex items-center">
      <ResponsiveContainer width="58%" height={210}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={58}
            outerRadius={82}
            paddingAngle={3}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--popover)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-3">
        {data.map((p, i) => (
          <div key={p.name} className="flex items-center gap-2 text-sm">
            <span
              className="size-2 rounded-full"
              style={{ background: colors[i] }}
            />
            <span className="text-muted-foreground">{p.name}</span>
            <b>{total ? Math.round((p.value / total) * 100) : 0}%</b>
          </div>
        ))}
      </div>
    </div>
  );
}
