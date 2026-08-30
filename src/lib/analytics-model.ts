type CustomerInput = {
  id: string;
  status: string;
  mrr: number;
  createdAt: string;
  lastActivityAt: string | null;
};

type TransactionInput = {
  customerId: string | null;
  status: string;
};

type ActivityInput = { metadata: unknown };

const metadataValue = (metadata: unknown, keys: string[]) => {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata))
    return null;
  const record = metadata as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
};

const distribution = (activities: ActivityInput[], keys: string[]) => {
  const counts = new Map<string, number>();
  for (const activity of activities) {
    const value = metadataValue(activity.metadata, keys);
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  const total = [...counts.values()].reduce((sum, value) => sum + value, 0);
  return [...counts.entries()]
    .map(([name, count]) => ({
      name,
      count,
      share: total ? Math.round((count / total) * 100) : 0,
    }))
    .toSorted((a, b) => b.count - a.count)
    .slice(0, 5);
};

export function buildAnalyticsModel(
  customers: CustomerInput[],
  transactions: TransactionInput[],
  activities: ActivityInput[],
  now = new Date(),
) {
  const paidIds = new Set(
    transactions
      .filter((item) => item.status === "Approved" && item.customerId)
      .map((item) => item.customerId),
  );
  const stages = [
    { name: "Visitor", value: null, note: "Web analytics not connected" },
    {
      name: "Signup",
      value: customers.length,
      note: "Customer records used as signup proxy",
    },
    {
      name: "Activated",
      value: customers.filter((item) => item.lastActivityAt).length,
      note: "Has recorded product activity",
    },
    {
      name: "Trial",
      value: customers.filter((item) => item.status === "Trial").length,
      note: "Current trial customers",
    },
    {
      name: "Paid",
      value: customers.filter((item) => item.mrr > 0 || paidIds.has(item.id))
        .length,
      note: "MRR or approved payment",
    },
  ].map((stage, index, all) => {
    const previous = index ? all[index - 1].value : null;
    const conversion =
      stage.value !== null && previous !== null && previous > 0
        ? Math.round((stage.value / previous) * 100)
        : null;
    return {
      ...stage,
      conversion,
      dropOff: conversion === null ? null : Math.max(0, 100 - conversion),
    };
  });

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const cohortStarts = Array.from(
    { length: 4 },
    (_, index) =>
      new Date(
        monthStart.getFullYear(),
        monthStart.getMonth() - (3 - index),
        1,
      ),
  );
  const cohorts = cohortStarts.map((start) => {
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    const members = customers.filter((item) => {
      const created = new Date(item.createdAt);
      return created >= start && created < end;
    });
    const retention = [0, 1, 2, 3].map((offset) => {
      if (!members.length) return null;
      if (offset === 0) return 100;
      const threshold = new Date(
        start.getFullYear(),
        start.getMonth() + offset,
        1,
      );
      if (threshold > now) return null;
      return Math.round(
        (members.filter(
          (item) =>
            item.lastActivityAt && new Date(item.lastActivityAt) >= threshold,
        ).length /
          members.length) *
          100,
      );
    });
    return {
      cohort: start.toLocaleString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      customers: members.length,
      retention,
    };
  });

  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const movement = [
    {
      name: "New",
      value: customers
        .filter((item) => new Date(item.createdAt) >= last30Days)
        .reduce((sum, item) => sum + item.mrr, 0),
      available: true,
    },
    { name: "Expansion", value: 0, available: false },
    { name: "Contraction", value: 0, available: false },
    {
      name: "Churn",
      value: customers
        .filter((item) => item.status === "Canceled")
        .reduce((sum, item) => sum + item.mrr, 0),
      available: true,
    },
  ];
  const paid = stages.at(-1)?.value ?? 0;
  return {
    stages,
    cohorts,
    movement,
    conversion: customers.length
      ? Math.round((paid / customers.length) * 100)
      : 0,
    dimensions: {
      channels: distribution(activities, ["channel", "source", "utm_source"]),
      devices: distribution(activities, ["device", "device_type"]),
      browsers: distribution(activities, ["browser"]),
      countries: distribution(activities, ["country", "country_code"]),
    },
  };
}
