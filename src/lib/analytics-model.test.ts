import { describe, expect, it } from "vitest";
import { buildAnalyticsModel } from "@/lib/analytics-model";

describe("analytics model", () => {
  it("derives an honest funnel and acquisition dimensions", () => {
    const model = buildAnalyticsModel(
      [
        {
          id: "one",
          status: "Trial",
          mrr: 0,
          createdAt: "2026-08-01T00:00:00Z",
          lastActivityAt: "2026-08-20T00:00:00Z",
        },
        {
          id: "two",
          status: "Active",
          mrr: 49,
          createdAt: "2026-07-01T00:00:00Z",
          lastActivityAt: null,
        },
      ],
      [{ customerId: "two", status: "Approved" }],
      [
        { metadata: { channel: "Organic", device: "Desktop" } },
        { metadata: { channel: "Organic", device: "Mobile" } },
      ],
      new Date("2026-08-29T00:00:00Z"),
    );
    expect(model.stages[0].value).toBeNull();
    expect(model.stages.at(-1)?.value).toBe(1);
    expect(model.conversion).toBe(50);
    expect(model.dimensions.channels[0]).toMatchObject({
      name: "Organic",
      share: 100,
    });
  });

  it("does not fabricate unavailable expansion data", () => {
    const model = buildAnalyticsModel(
      [],
      [],
      [],
      new Date("2026-08-29T00:00:00Z"),
    );
    expect(
      model.movement.find((item) => item.name === "Expansion")?.available,
    ).toBe(false);
    expect(model.dimensions.countries).toEqual([]);
  });
});
