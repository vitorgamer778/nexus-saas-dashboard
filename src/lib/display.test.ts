import { describe, expect, it } from "vitest";
import { displayInitials, displayName, safeAvatarUrl } from "./display";

describe("identity display fallbacks", () => {
  it("prefers profile data and trims it", () => {
    expect(
      displayName({
        profileName: "  Ana Lima  ",
        metadataName: "Ignored",
        email: "ana@example.com",
        userId: "12345678",
      }),
    ).toBe("Ana Lima");
  });

  it("derives a readable name from email when names are absent", () => {
    expect(
      displayName({
        email: "maria.silva@example.com",
        userId: "12345678",
      }),
    ).toBe("Maria Silva");
  });

  it("keeps initials and avatars safe when data is incomplete", () => {
    expect(displayInitials("", "US")).toBe("US");
    expect(safeAvatarUrl("javascript:alert(1)")).toBeNull();
    expect(safeAvatarUrl("https://cdn.example.com/avatar.png")).toBe(
      "https://cdn.example.com/avatar.png",
    );
  });
});
