import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { displayName, safeAvatarUrl } from "@/lib/display";
import { cookies } from "next/headers";
import {
  ACTIVE_WORKSPACE_COOKIE,
  selectActiveWorkspace,
  type UserWorkspace,
} from "@/lib/workspace-selection";

export const getCurrentIdentity = cache(async () => {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: authData, error: authError } = await supabase.auth.getUser();
  const user = authData.user;
  if (authError || !user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name,avatar_url,compact_mode")
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
    compactMode: profile?.compact_mode ?? false,
  };
});

export const getUserWorkspaces = cache(async (): Promise<UserWorkspace[]> => {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("workspace_members")
    .select("role, workspaces(id, name, slug)")
    .order("joined_at", { ascending: true });
  if (error || !data) return [];

  return data.flatMap((membership) => {
    const joined = membership.workspaces;
    const workspace = Array.isArray(joined) ? joined[0] : joined;
    if (!workspace) return [];
    return [
      {
        id: workspace.id,
        name: workspace.name.trim() || "Workspace",
        slug: workspace.slug,
        role: membership.role,
      },
    ];
  });
});

export const getCurrentWorkspace = cache(async () => {
  const [workspaces, cookieStore] = await Promise.all([
    getUserWorkspaces(),
    cookies(),
  ]);
  return selectActiveWorkspace(
    workspaces,
    cookieStore.get(ACTIVE_WORKSPACE_COOKIE)?.value,
  );
});
