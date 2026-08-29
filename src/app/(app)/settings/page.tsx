import { PageHead } from "@/components/page-kit";
import { SettingsForm } from "@/components/settings-form";
import { getSettingsData } from "@/lib/settings";
import { redirect } from "next/navigation";

export default async function Settings() {
  const data = await getSettingsData();
  if (!data) redirect("/login");

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
