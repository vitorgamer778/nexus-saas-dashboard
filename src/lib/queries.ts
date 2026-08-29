import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getCurrentIdentity, getCurrentWorkspace } from "@/lib/workspace";
import { displayInitials, displayName, safeAvatarUrl } from "@/lib/display";
import { customerHealthScore, healthLabel } from "@/lib/customer-health";

export type CustomerView = {
  id: string;
  name: string;
  initials: string;
  email: string;
  company: string;
  plan: string;
  status: string;
  mrr: number;
  joined: string;
  createdAt: string;
  activity: string;
  lastActivityAt: string | null;
  healthScore: number;
  healthLabel: string;
};

const date = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export async function getCustomers(): Promise<CustomerView[]> {
  const [supabase, workspace] = await Promise.all([
    createClient(),
    getCurrentWorkspace(),
  ]);
  if (!supabase || !workspace) return [];
  const { data, error } = await supabase
    .from("customers")
    .select(
      "id,name,email,company,status,mrr,created_at,last_activity_at,plans(name)",
    )
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((customer) => {
    const plan = Array.isArray(customer.plans)
      ? customer.plans[0]
      : customer.plans;
    const healthScore = customerHealthScore({
      status: customer.status.replace(/^./, (letter: string) =>
        letter.toUpperCase(),
      ),
      mrr: Number(customer.mrr),
      lastActivityAt: customer.last_activity_at,
    });
    return {
      id: customer.id,
      name: customer.name,
      initials: displayInitials(customer.name),
      email: customer.email,
      company: customer.company ?? "Independent",
      plan: plan?.name ?? "No plan",
      status: customer.status
        .replace("_", " ")
        .replace(/^./, (letter: string) => letter.toUpperCase()),
      mrr: Number(customer.mrr),
      joined: date(customer.created_at),
      createdAt: customer.created_at,
      activity: customer.last_activity_at
        ? date(customer.last_activity_at)
        : "No activity yet",
      lastActivityAt: customer.last_activity_at,
      healthScore,
      healthLabel: healthLabel(healthScore),
    };
  });
}

export async function getTransactions() {
  const [supabase, workspace] = await Promise.all([
    createClient(),
    getCurrentWorkspace(),
  ]);
  if (!supabase || !workspace) return [];
  const { data, error } = await supabase
    .from("transactions")
    .select("id,amount,method,status,processed_at,customers(name,company)")
    .eq("workspace_id", workspace.id)
    .order("processed_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((transaction) => {
    const customer = Array.isArray(transaction.customers)
      ? transaction.customers[0]
      : transaction.customers;
    return {
      id: transaction.id.slice(0, 8).toUpperCase(),
      customer: customer?.company ?? customer?.name ?? "Unknown customer",
      value: Number(transaction.amount),
      method: transaction.method,
      status: transaction.status.replace(/^./, (letter: string) =>
        letter.toUpperCase(),
      ),
      date: date(transaction.processed_at),
      processedAt: transaction.processed_at,
    };
  });
}

export async function getCustomer(id: string) {
  const customers = await getCustomers();
  return customers.find((customer) => customer.id === id) ?? null;
}

export async function getCustomerTransactions(customerId: string) {
  const [supabase, workspace] = await Promise.all([
    createClient(),
    getCurrentWorkspace(),
  ]);
  if (!supabase || !workspace) return [];
  const { data, error } = await supabase
    .from("transactions")
    .select("id,amount,method,status,processed_at")
    .eq("workspace_id", workspace.id)
    .eq("customer_id", customerId)
    .order("processed_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((item) => ({
    id: item.id.slice(0, 8).toUpperCase(),
    value: Number(item.amount),
    method: item.method,
    status: item.status.replace(/^./, (letter: string) => letter.toUpperCase()),
    date: date(item.processed_at),
  }));
}

export async function getCustomerDetails(customerId: string) {
  const [customer, transactions, supabase, workspace] = await Promise.all([
    getCustomer(customerId),
    getCustomerTransactions(customerId),
    createClient(),
    getCurrentWorkspace(),
  ]);
  if (!customer || !supabase || !workspace) return null;
  const [subscriptionResult, activityResult] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("id,status,amount,current_period_end,created_at,plans(name)")
      .eq("workspace_id", workspace.id)
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("activities")
      .select("id,kind,created_at,metadata")
      .eq("workspace_id", workspace.id)
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);
  if (subscriptionResult.error) throw subscriptionResult.error;
  if (activityResult.error) throw activityResult.error;
  const subscription = subscriptionResult.data;
  const planJoin = subscription?.plans;
  const plan = Array.isArray(planJoin) ? planJoin[0] : planJoin;
  return {
    customer,
    transactions,
    lastPayment: transactions[0] ?? null,
    subscription: subscription
      ? {
          id: subscription.id,
          status: subscription.status,
          amount: Number(subscription.amount),
          plan: plan?.name ?? customer.plan,
          currentPeriodEnd: subscription.current_period_end
            ? date(subscription.current_period_end)
            : "Not scheduled",
        }
      : null,
    activities: (activityResult.data ?? []).map((activity) => ({
      id: String(activity.id),
      kind: activity.kind
        .replaceAll(".", " ")
        .replace(/^./, (value: string) => value.toUpperCase()),
      date: date(activity.created_at),
    })),
  };
}

export async function getPlans() {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .order("price_monthly");
  if (error) throw error;
  return data ?? [];
}

export async function getTeam() {
  const [supabase, workspace, identity] = await Promise.all([
    createClient(),
    getCurrentWorkspace(),
    getCurrentIdentity(),
  ]);
  if (!supabase || !workspace) return [];
  const { data: memberships, error } = await supabase
    .from("workspace_members")
    .select("user_id,role,joined_at")
    .eq("workspace_id", workspace.id)
    .order("joined_at");
  if (error) throw error;
  const ids = (memberships ?? []).map((member) => member.user_id);
  if (!ids.length) return [];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id,full_name,avatar_url")
    .in("id", ids);
  const profileById = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile]),
  );
  return (memberships ?? []).map((member) => {
    const profile = profileById.get(member.user_id);
    const isCurrentUser = member.user_id === identity?.id;
    const name = displayName({
      profileName: profile?.full_name,
      metadataName: isCurrentUser ? identity?.name : null,
      email: isCurrentUser ? identity?.email : null,
      userId: member.user_id,
    });
    return {
      id: member.user_id,
      name,
      initials: displayInitials(name, "US"),
      avatarUrl: safeAvatarUrl(
        profile?.avatar_url ?? (isCurrentUser ? identity?.avatarUrl : null),
      ),
      role: member.role,
      joined: date(member.joined_at),
    };
  });
}
