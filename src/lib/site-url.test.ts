import { describe, expect, it } from "vitest";
import { getAuthOrigin } from "./site-url";

describe("getAuthOrigin", () => {
  it("uses the current origin when no production URL is configured", () => {
    expect(getAuthOrigin("http://localhost:3000/path")).toBe(
      "http://localhost:3000",
    );
  });

  it("rejects non-http origins", () => {
    expect(getAuthOrigin("javascript:alert(1)")).toBeNull();
  });
});
