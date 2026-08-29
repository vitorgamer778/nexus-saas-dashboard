const allowedDestinations = [
  "/dashboard",
  "/customers",
  "/subscriptions",
  "/transactions",
  "/analytics",
  "/team",
  "/settings",
  "/onboarding",
  "/reset-password",
] as const;

export function safeRedirectPath(
  value: string | null | undefined,
  fallback = "/dashboard",
) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return fallback;
  }
  try {
    const parsed = new URL(value, "https://nexus.local");
    if (parsed.origin !== "https://nexus.local") return fallback;
    const allowed = allowedDestinations.some(
      (route) =>
        parsed.pathname === route || parsed.pathname.startsWith(`${route}/`),
    );
    return allowed
      ? `${parsed.pathname}${parsed.search}${parsed.hash}`
      : fallback;
  } catch {
    return fallback;
  }
}
