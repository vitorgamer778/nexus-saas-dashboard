import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false, noarchive: true },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background p-4">
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_30%_20%,color-mix(in_srgb,var(--primary)_22%,transparent),transparent_32%),radial-gradient(circle_at_75%_80%,color-mix(in_srgb,var(--primary)_15%,transparent),transparent_28%)]" />
      <div className="relative z-10 w-full">{children}</div>
    </main>
  );
}
