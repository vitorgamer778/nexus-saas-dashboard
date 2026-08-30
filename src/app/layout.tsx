import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
export const metadata: Metadata = {
  metadataBase: new URL("https://nexus-saas-dashboard-tawny.vercel.app"),
  title: {
    default: "Nexus — SaaS revenue intelligence",
    template: "%s · Nexus",
  },
  description:
    "A production-minded SaaS operations workspace for revenue, customers, subscriptions and growth.",
  applicationName: "Nexus",
  authors: [{ name: "Vitor", url: "https://github.com/vitorgamer778" }],
  creator: "Vitor",
  keywords: [
    "SaaS dashboard",
    "revenue intelligence",
    "Next.js",
    "Supabase",
    "analytics",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Nexus",
    title: "Nexus — SaaS revenue intelligence",
    description:
      "Revenue, customers and product intelligence in a secure multi-workspace command center.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus — SaaS revenue intelligence",
    description:
      "Revenue, customers and product intelligence in one focused workspace.",
  },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <ThemeProvider>
          {children}
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
