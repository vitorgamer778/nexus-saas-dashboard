import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCurrentWorkspace } from "@/lib/workspace";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  if (!supabase) redirect("/login?error=configuration");
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");
  const workspace = await getCurrentWorkspace();
  if (!workspace) redirect("/onboarding");
  return (
    <AppShell
      user={{
        email: data.user.email ?? "",
        name:
          data.user.user_metadata?.full_name ??
          data.user.email?.split("@")[0] ??
          "Account",
      }}
      workspace={{ name: workspace.name, role: workspace.role }}
    >
      {children}
    </AppShell>
  );
}
