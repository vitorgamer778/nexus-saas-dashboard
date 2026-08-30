import type { MetadataRoute } from "next";

const baseUrl = "https://nexus-saas-dashboard-tawny.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/demo/dashboard",
    "/demo/customers",
    "/demo/subscriptions",
    "/demo/transactions",
    "/demo/analytics",
    "/demo/team",
    "/demo/settings",
  ].map((path, index) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: "monthly" as const,
    priority: index === 0 ? 1 : 0.6,
  }));
}
