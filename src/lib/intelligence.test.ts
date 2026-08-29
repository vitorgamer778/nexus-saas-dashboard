import { describe, expect, it } from "vitest";
import { getNexusInsights } from "./intelligence";

describe("Nexus Intelligence provider", () => {
  it("labels demo insights and covers every supported insight type", async () => {
    const result = await getNexusInsights({
      activeCustomers: 0,
      mrr: 0,
      churn: 0,
    });
    expect(result.mode).toBe("demo");
    expect(new Set(result.insights.map((insight) => insight.kind))).toEqual(
      new Set([
        "churn-risk",
        "conversion-anomaly",
        "mrr-opportunity",
        "failed-payment-trend",
        "retention-improvement",
      ]),
    );
    expect(
      result.insights.every(
        (insight) => insight.confidence >= 0 && insight.confidence <= 100,
      ),
    ).toBe(true);
  });
});
