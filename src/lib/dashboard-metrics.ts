type CustomerMetricInput = {
  mrr: number;
  status: string;
  createdAt: string;
};

export type MetricPoint = { label: string; value: number };

export function buildDashboardMetrics(
  customers: CustomerMetricInput[],
  now = new Date(),
) {
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleString("en-US", { month: "short" }),
      newMrr: 0,
      activeAdds: 0,
      additions: 0,
      canceledAdds: 0,
    };
  });
  const recentKeys = new Set(months.map((month) => month.key));
  let baseMrr = 0,
    baseActive = 0,
    baseTotal = 0,
    baseCanceled = 0;

  for (const customer of customers) {
    const created = new Date(customer.createdAt);
    const key = `${created.getFullYear()}-${created.getMonth()}`;
    const month = months.find((item) => item.key === key);
    const canceled = customer.status === "Canceled";
    const active = customer.status === "Active";
    if (month) {
      month.additions += 1;
      month.canceledAdds += canceled ? 1 : 0;
      month.activeAdds += active ? 1 : 0;
      month.newMrr += canceled ? 0 : customer.mrr;
    } else if (
      !recentKeys.has(key) &&
      created < new Date(now.getFullYear(), now.getMonth() - 5, 1)
    ) {
      baseTotal += 1;
      baseCanceled += canceled ? 1 : 0;
      baseActive += active ? 1 : 0;
      baseMrr += canceled ? 0 : customer.mrr;
    }
  }

  let mrr = baseMrr,
    active = baseActive,
    total = baseTotal,
    canceled = baseCanceled;
  const mrrSeries: MetricPoint[] = [],
    activeSeries: MetricPoint[] = [],
    churnSeries: MetricPoint[] = [];
  for (const month of months) {
    mrr += month.newMrr;
    active += month.activeAdds;
    total += month.additions;
    canceled += month.canceledAdds;
    mrrSeries.push({ label: month.label, value: mrr });
    activeSeries.push({ label: month.label, value: active });
    churnSeries.push({
      label: month.label,
      value: total ? (canceled / total) * 100 : 0,
    });
  }

  return {
    mrr: customers.reduce(
      (sum, customer) =>
        sum + (customer.status === "Canceled" ? 0 : customer.mrr),
      0,
    ),
    active: customers.filter((customer) => customer.status === "Active").length,
    churn: customers.length
      ? (customers.filter((customer) => customer.status === "Canceled").length /
          customers.length) *
        100
      : 0,
    newMrrThisMonth: months.at(-1)?.newMrr ?? 0,
    newActiveThisMonth: months.at(-1)?.activeAdds ?? 0,
    mrrSeries,
    activeSeries,
    churnSeries,
  };
}

export function periodChange(series: MetricPoint[]) {
  const current = series.at(-1)?.value ?? 0;
  const previous = series.at(-2)?.value ?? 0;
  return {
    delta: current - previous,
    percent: previous === 0 ? null : ((current - previous) / previous) * 100,
  };
}
