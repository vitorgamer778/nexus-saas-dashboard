import { PageHead } from "@/components/page-kit";
import { SettingsForm } from "@/components/settings-form";
export default function Settings() {
  return (
    <>
      <PageHead
        title="Settings"
        description="Manage your profile, workspace and security preferences."
      />
      <SettingsForm />
    </>
  );
}
