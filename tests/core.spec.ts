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
});

test("unsafe callback destination never leaves the application", async ({
  page,
}) => {
  await page.goto("/auth/callback?next=//evil.example");
  await expect(page).toHaveURL(/\/login\?error=auth_callback/);
});

