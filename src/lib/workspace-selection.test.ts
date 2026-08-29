import { describe, expect, it } from "vitest";
import {
  selectActiveWorkspace,
  type UserWorkspace,
} from "./workspace-selection";

const workspaces: UserWorkspace[] = [
  { id: "one", name: "One", slug: "one", role: "owner" },
  { id: "two", name: "Two", slug: "two", role: "viewer" },
];

describe("selectActiveWorkspace", () => {
  it("selects a preferred workspace only when it belongs to the user", () => {
    expect(selectActiveWorkspace(workspaces, "two")?.id).toBe("two");
  });

  it("falls back safely when the cookie is missing or unauthorized", () => {
    expect(
      selectActiveWorkspace(workspaces, "another-user-workspace")?.id,
    ).toBe("one");
    expect(selectActiveWorkspace(workspaces)?.id).toBe("one");
  });

  it("returns null when the user has no workspaces", () => {
    expect(selectActiveWorkspace([], "one")).toBeNull();
  });
});
