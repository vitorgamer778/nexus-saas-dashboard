"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentIdentity, getCurrentWorkspace } from "@/lib/workspace";

const urlOrEmpty = z.union([
  z.literal(""),
  z.string().url().startsWith("https://"),
]);
const workspaceSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  timezone: z.string().min(1).max(80),
  locale: z.enum(["en-US", "pt-BR", "es-ES"]),
  currency: z.enum(["USD", "BRL", "EUR"]),
  logoUrl: urlOrEmpty,
});

async function context() {
  const [supabase, identity, workspace] = await Promise.all([
    createClient(),
    getCurrentIdentity(),
    getCurrentWorkspace(),
  ]);
  if (!supabase || !identity || !workspace)
    throw new Error("Authentication required.");
  return { supabase, identity, workspace };
}

export async function updateWorkspaceSettings(
  input: z.infer<typeof workspaceSchema>,
) {
  const values = workspaceSchema.parse(input);
  const { supabase, workspace } = await context();
  const { error } = await supabase
    .from("workspaces")
    .update({
      name: values.name,
      slug: values.slug,
      timezone: values.timezone,
      locale: values.locale,
      currency: values.currency,
      logo_url: values.logoUrl || null,
    })
    .eq("id", workspace.id);
  if (error)
    throw new Error(
      error.code === "42501"
        ? "Owner or admin access required."
        : error.message,
    );
  revalidatePath("/", "layout");
}

export async function updateProfile(input: {
  fullName: string;
  avatarUrl: string;
}) {
  const values = z
    .object({
      fullName: z.string().trim().min(2).max(80),
      avatarUrl: urlOrEmpty,
    })
    .parse(input);
  const { supabase, identity } = await context();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: values.fullName,
      avatar_url: values.avatarUrl || null,
    })
    .eq("id", identity.id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function updateEmail(email: string) {
  const value = z.string().trim().toLowerCase().email().parse(email);
  const { supabase } = await context();
  const { error } = await supabase.auth.updateUser({ email: value });
  if (error) throw new Error(error.message);
}

export async function updatePassword(password: string) {
  const value = z.string().min(10).max(128).parse(password);
  const { supabase } = await context();
  const { error } = await supabase.auth.updateUser({ password: value });
  if (error) throw new Error(error.message);
}

const preferenceSchema = z.object({
  payment_failed: z.boolean(),
  new_customer: z.boolean(),
  subscription_canceled: z.boolean(),
  weekly_report: z.boolean(),
  security_alert: z.boolean(),
});

export async function updateNotificationPreferences(
  input: z.infer<typeof preferenceSchema>,
) {
  const values = preferenceSchema.parse(input);
  const { supabase, identity, workspace } = await context();
  const { error } = await supabase.from("notification_preferences").upsert({
    workspace_id: workspace.id,
    user_id: identity.id,
    ...values,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}

export async function updateAppearance(input: {
  locale: string;
  timezone: string;
  compactMode: boolean;
}) {
  const values = z
    .object({
      locale: z.enum(["en-US", "pt-BR", "es-ES"]),
      timezone: z.string().min(1).max(80),
      compactMode: z.boolean(),
    })
    .parse(input);
  const { supabase, identity } = await context();
  const { error } = await supabase
    .from("profiles")
    .update({
      locale: values.locale,
      timezone: values.timezone,
      compact_mode: values.compactMode,
    })
    .eq("id", identity.id);
  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}

export async function inviteMember(input: { email: string; role: string }) {
  const values = z
    .object({
      email: z.string().trim().toLowerCase().email(),
      role: z.enum(["admin", "manager", "member", "viewer"]),
    })
    .parse(input);
  const { supabase, identity, workspace } = await context();
  const { error } = await supabase.from("workspace_invitations").insert({
    workspace_id: workspace.id,
    invited_by: identity.id,
    email: values.email,
    role: values.role,
  });
  if (error)
    throw new Error(
      error.code === "23505"
        ? "A pending invitation already exists."
        : error.message,
    );
  revalidatePath("/settings");
}

export async function updateMemberRole(userId: string, role: string) {
  const id = z.string().uuid().parse(userId);
  const nextRole = z.enum(["admin", "manager", "member", "viewer"]).parse(role);
  const { supabase, workspace } = await context();
  const { error } = await supabase
    .from("workspace_members")
    .update({ role: nextRole })
    .eq("workspace_id", workspace.id)
    .eq("user_id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}

export async function removeMember(userId: string) {
  const id = z.string().uuid().parse(userId);
  const { supabase, workspace } = await context();
  const { error } = await supabase
    .from("workspace_members")
    .delete()
    .eq("workspace_id", workspace.id)
    .eq("user_id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}

export async function transferOwnership(userId: string) {
  const id = z.string().uuid().parse(userId);
  const { supabase, workspace } = await context();
  const { error } = await supabase.rpc("transfer_workspace_ownership", {
    target_workspace_id: workspace.id,
    new_owner_id: id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function deleteWorkspace(confirmation: string) {
  const { supabase, workspace } = await context();
  if (confirmation !== workspace.name)
    throw new Error("Workspace name does not match.");
  const { error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", workspace.id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}
