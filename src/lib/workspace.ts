import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { displayName, safeAvatarUrl } from "@/lib/display";

export const getCurrentIdentity = cache(async () => {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: authData, error: authError } = await supabase.auth.getUser();
  const user = authData.user;
  if (authError || !user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name,avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const metadata = user.user_metadata ?? {};
  const email = user.email ?? null;

  return {
    id: user.id,
    email,
    name: displayName({
      profileName: profile?.full_name,
      metadataName: metadata.full_name ?? metadata.name,
      email,
      userId: user.id,
    }),
    avatarUrl: safeAvatarUrl(
      profile?.avatar_url ?? metadata.avatar_url ?? metadata.picture,
    ),
  };
});

export const getCurrentWorkspace = cache(async () => {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("workspace_members")
    .select("role, workspaces(id, name, slug)")
    .limit(1)
    .maybeSingle();
  if (error || !data?.workspaces) return null;
  const workspace = Array.isArray(data.workspaces)
    ? data.workspaces[0]
    : data.workspaces;
  return workspace
    ? {
        ...workspace,
        name: workspace.name.trim() || "Workspace",
        role: data.role,
      }
    : null;
});
