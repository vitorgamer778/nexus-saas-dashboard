import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "./safe-redirect";

describe("safeRedirectPath", () => {
  it("preserves allowlisted local destinations", () => {
    expect(safeRedirectPath("/customers/123?tab=billing")).toBe(
      "/customers/123?tab=billing",
    );
  });

  it.each([
    "//evil.example",
    "/\\evil.example",
    "https://evil.example",
    "/api/private",
    "/login",
    "",
  ])("rejects unsafe destination %s", (destination) => {
    expect(safeRedirectPath(destination)).toBe("/dashboard");
  });
});
