import { describe, expect, it } from "vitest";
import { customerHealthScore, healthLabel } from "./customer-health";

describe("customer health", () => {
  it("rewards active, paying and recently engaged customers", () => {
    const score = customerHealthScore({
      status: "Active",
      mrr: 99,
      lastActivityAt: "2026-08-28T00:00:00Z",
      now: new Date("2026-08-29T00:00:00Z"),
    });
    expect(score).toBe(100);
    expect(healthLabel(score)).toBe("Healthy");
  });
  it("keeps canceled inactive customers at risk", () => {
    const score = customerHealthScore({
      status: "Canceled",
      mrr: 0,
      lastActivityAt: null,
    });
    expect(score).toBe(5);
    expect(healthLabel(score)).toBe("At risk");
  });
});
