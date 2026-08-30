import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { DemoWorkspace } from "@/components/demo-workspace";

const views = [
  "dashboard",
  "customers",
  "subscriptions",
  "transactions",
  "analytics",
  "team",
  "settings",
] as const;
export type DemoView = (typeof views)[number];

export const metadata: Metadata = {
  title: "Interactive product demo",
  description:
    "Explore the Nexus SaaS workspace with fictional, read-only data.",
  robots: { index: true, follow: true },
};

export default async function DemoPage({
  params,
}: {
  params: Promise<{ view?: string[] }>;
}) {
  const { view } = await params;
  if (!view?.length) redirect("/demo/dashboard");
  if (view.length !== 1 || !views.includes(view[0] as DemoView)) notFound();
  return <DemoWorkspace view={view[0] as DemoView} />;
}
