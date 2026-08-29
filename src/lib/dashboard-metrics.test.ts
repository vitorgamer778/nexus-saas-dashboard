import { describe, expect, it } from "vitest";
import { buildDashboardMetrics, periodChange } from "./dashboard-metrics";

describe("dashboard metrics", () => {
  it("builds real cumulative series that end at the current totals", () => {
    const result = buildDashboardMetrics(
      [
        { mrr: 100, status: "Active", createdAt: "2026-07-10T00:00:00Z" },
        { mrr: 50, status: "Active", createdAt: "2026-08-10T00:00:00Z" },
        { mrr: 80, status: "Canceled", createdAt: "2026-08-12T00:00:00Z" },
      ],
      new Date("2026-08-29T12:00:00Z"),
    );
    expect(result.mrr).toBe(150);
    expect(result.active).toBe(2);
    expect(result.churn).toBeCloseTo(33.33, 1);
    expect(result.mrrSeries.at(-1)?.value).toBe(150);
    expect(result.newMrrThisMonth).toBe(50);
  });

  it("does not fabricate a percentage without a comparison base", () => {
    expect(
      periodChange([
        { label: "Jul", value: 0 },
        { label: "Aug", value: 20 },
      ]).percent,
    ).toBeNull();
  });
});
