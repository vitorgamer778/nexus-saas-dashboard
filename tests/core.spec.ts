import { test, expect } from "@playwright/test";

test("protected routes fail closed and preserve the intended route", async ({
  page,
}) => {
  await page.goto("/customers/example?tab=billing");
  await expect(page).toHaveURL(/\/login\?error=configuration/);
  expect(new URL(page.url()).searchParams.get("next")).toBe(
    "/customers/example?tab=billing",
  );
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
  await expect(page.getByText(/temporarily unavailable/i)).toBeVisible();
});

test("auth routes render and security headers are present", async ({
  page,
}) => {
  const response = await page.goto("/login");
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  expect(response?.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Google" })).toBeVisible();
  await expect(page.getByRole("button", { name: "GitHub" })).toBeVisible();
});

test("unsafe callback destination never leaves the application", async ({
  page,
}) => {
  await page.goto("/auth/callback?next=//evil.example");
  await expect(page).toHaveURL(/\/login\?error=auth_callback/);
});

test("public landing presents the product and opens the safe demo", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /signals shaping your SaaS growth/i }),
  ).toBeVisible();
  await expect(
    page.getByText(/no account or credentials required/i),
  ).toBeVisible();
  await page.getByRole("link", { name: /explore the read-only demo/i }).click();
  await expect(page).toHaveURL(/\/demo\/dashboard/);
  await expect(
    page.getByRole("heading", { name: "Revenue overview" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Create report" }).click();
  await expect(page.getByText("Read-only demo")).toBeVisible();
});

test("demo navigation has no horizontal mobile overflow", async ({ page }) => {
  await page.goto("/demo/customers");
  await expect(page.getByRole("heading", { name: "Customers" })).toBeVisible();
  const widths = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
});

test("product tour links open the matching read-only screens", async ({
  page,
}) => {
  for (const [name, route, heading] of [
    ["Explore customers", "/demo/customers", "Customers"],
    ["Explore analytics", "/demo/analytics", "Analytics"],
  ]) {
    await page.goto("/");
    await page.getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(route));
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
  }
});

test("landing supports keyboard bypass, reduced motion and narrow screens", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  expect(
    await page
      .locator(".landing-preview")
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe("none");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator(".landing-preview img")).toBeVisible();
});
