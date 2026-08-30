import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/demo/"],
      disallow: [
        "/dashboard",
        "/customers",
        "/subscriptions",
        "/transactions",
        "/analytics",
        "/team",
        "/settings",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/onboarding",
        "/auth/",
        "/api/",
      ],
    },
    sitemap: "https://nexus-saas-dashboard-tawny.vercel.app/sitemap.xml",
  };
}
