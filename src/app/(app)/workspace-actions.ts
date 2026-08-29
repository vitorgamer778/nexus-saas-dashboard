"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ACTIVE_WORKSPACE_COOKIE } from "@/lib/workspace-selection";

const workspaceIdSchema = z.string().uuid();

export async function switchWorkspace(workspaceId: string) {
  const parsedId = workspaceIdSchema.safeParse(workspaceId);
  if (!parsedId.success) throw new Error("Invalid workspace.");

  const supabase = await createClient();
  if (!supabase) throw new Error("Workspace service is unavailable.");

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error("Authentication required.");

  const { data: membership, error } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("workspace_id", parsedId.data)
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (error || !membership) throw new Error("Workspace access denied.");

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_WORKSPACE_COOKIE, parsedId.data, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  revalidatePath("/", "layout");
}
