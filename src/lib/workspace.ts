import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

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
  return workspace ? { ...workspace, role: data.role } : null;
});
