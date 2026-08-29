import { PageHead } from "@/components/page-kit";
import { SettingsForm } from "@/components/settings-form";
import { getCurrentIdentity, getCurrentWorkspace } from "@/lib/workspace";

export default async function Settings() {
  const [identity, workspace] = await Promise.all([
    getCurrentIdentity(),
    getCurrentWorkspace(),
  ]);

  return (
    <>
      <PageHead
        title="Settings"
        description="Manage your profile, workspace and security preferences."
      />
      <SettingsForm
        identity={{
          name: identity?.name ?? "Name unavailable",
          email: identity?.email ?? "Email unavailable",
        }}
        workspace={{
          name: workspace?.name ?? "Workspace unavailable",
          slug: workspace?.slug ?? "",
          role: workspace?.role ?? "viewer",
        }}
      />
    </>
  );
}
