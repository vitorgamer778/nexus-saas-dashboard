import { PageHead } from "@/components/page-kit";
import { SettingsForm } from "@/components/settings-form";
import { getSettingsData } from "@/lib/settings";
import { redirect } from "next/navigation";
import { getCurrentIdentity } from "@/lib/workspace";

export default async function Settings() {
  const [data, identity] = await Promise.all([
    getSettingsData(),
    getCurrentIdentity(),
  ]);
  if (!data) redirect(identity ? "/onboarding" : "/login");

  return (
    <>
      <PageHead
        title="Settings"
        description="Manage your profile, workspace and security preferences."
      />
      <SettingsForm data={data} />
    </>
  );
}
