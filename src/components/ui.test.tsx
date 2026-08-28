import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge, Button } from "./ui";
describe("design system", () => {
  it("renders accessible action labels", () => {
    render(<Button>Save changes</Button>);
    expect(screen.getByRole("button", { name: "Save changes" })).toBeVisible();
  });
  it("renders status badges", () => {
    render(<Badge tone="green">Active</Badge>);
    expect(screen.getByText("Active")).toBeVisible();
  });
});
