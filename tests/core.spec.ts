import { test, expect } from "@playwright/test";
test("dashboard and navigation work", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: /Good morning/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Customers" }).click();
  await expect(page.getByRole("heading", { name: "Customers" })).toBeVisible();
  await page.getByLabel("Search customers").fill("Orbit");
  await expect(page.getByText("Marina Costa")).toBeVisible();
});
test("theme control and auth render", async ({ page }) => {
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
  await page.goto("/dashboard");
  await page.getByLabel("Toggle color theme").click();
  await expect(page.locator("html")).toHaveClass(/light|dark/);
});

