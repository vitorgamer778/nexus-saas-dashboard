import { AppShell } from "@/components/app-shell";
import { AppShellLoading } from "@/components/app-shell-loading";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { redirect } from "next/navigation";
import { getCurrentIdentity, getCurrentWorkspace } from "@/lib/workspace";
import { Suspense } from "react";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<AppShellLoading />}>
      <AuthenticatedShell>{children}</AuthenticatedShell>
    </Suspense>
  );
}

async function AuthenticatedShell({ children }: { children: React.ReactNode }) {
  if (!getSupabaseEnv()) redirect("/login?error=configuration");
  const [identity, workspace] = await Promise.all([
    getCurrentIdentity(),
    getCurrentWorkspace(),
  ]);
  if (!identity) redirect("/login");
  if (!workspace) redirect("/onboarding");
  return (
    <AppShell
      user={{
        email: identity.email,
        name: identity.name,
        avatarUrl: identity.avatarUrl,
      }}
      workspace={{ name: workspace.name, role: workspace.role }}
    >
      {children}
    </AppShell>
  );
}
