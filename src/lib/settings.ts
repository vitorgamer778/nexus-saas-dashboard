import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getCurrentIdentity, getCurrentWorkspace } from "@/lib/workspace";
import { getCustomers, getTeam } from "@/lib/queries";

export async function getSettingsData() {
  const [supabase, identity, workspace, members, customers] = await Promise.all(
    [
      createClient(),
      getCurrentIdentity(),
      getCurrentWorkspace(),
      getTeam(),
      getCustomers(),
    ],
  );
  if (!supabase || !identity || !workspace) return null;

  const [
    profileResult,
    workspaceResult,
    preferencesResult,
    invitationsResult,
    factorsResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name,avatar_url,locale,timezone,compact_mode")
      .eq("id", identity.id)
      .maybeSingle(),
    supabase
      .from("workspaces")
      .select(
        "name,slug,logo_url,locale,timezone,currency,plan_id,plans(name,price_monthly)",
      )
      .eq("id", workspace.id)
      .maybeSingle(),
    supabase
      .from("notification_preferences")
      .select(
        "payment_failed,new_customer,subscription_canceled,weekly_report,security_alert",
      )
      .eq("workspace_id", workspace.id)
      .eq("user_id", identity.id)
      .maybeSingle(),
    supabase
      .from("workspace_invitations")
      .select("id,email,role,status,created_at")
      .eq("workspace_id", workspace.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
    supabase.auth.mfa.listFactors(),
  ]);

  const planJoin = workspaceResult.data?.plans;
  const plan = Array.isArray(planJoin) ? planJoin[0] : planJoin;
  return {
    identity,
    workspace: {
      ...workspace,
      ...workspaceResult.data,
      role: workspace.role as
        "owner" | "admin" | "manager" | "member" | "viewer",
      plan: plan ?? { name: "Free", price_monthly: 0 },
    },
    profile: profileResult.data ?? {
      full_name: identity.name,
      avatar_url: identity.avatarUrl,
      locale: "en-US",
      timezone: "UTC",
      compact_mode: false,
    },
    preferences: preferencesResult.data ?? {
      payment_failed: true,
      new_customer: true,
      subscription_canceled: true,
      weekly_report: true,
      security_alert: true,
    },
    members,
    billing: {
      customerCount: customers.length,
      monthlyRevenue: customers
        .filter((customer) => customer.status !== "Canceled")
        .reduce((total, customer) => total + customer.mrr, 0),
    },
    invitations: invitationsResult.data ?? [],
    mfaEnabled: (factorsResult.data?.totp ?? []).some(
      (factor) => factor.status === "verified",
    ),
  };
}
