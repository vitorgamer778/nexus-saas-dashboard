import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace";

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
  activity: string;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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
    return {
      id: customer.id,
      name: customer.name,
      initials: initials(customer.name),
      email: customer.email,
      company: customer.company ?? "Independent",
      plan: plan?.name ?? "No plan",
      status: customer.status
        .replace("_", " ")
        .replace(/^./, (letter: string) => letter.toUpperCase()),
      mrr: Number(customer.mrr),
      joined: date(customer.created_at),
      activity: customer.last_activity_at
        ? date(customer.last_activity_at)
        : "No activity yet",
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
  const [supabase, workspace] = await Promise.all([
    createClient(),
    getCurrentWorkspace(),
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
    .select("id,full_name")
    .in("id", ids);
  const names = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile.full_name]),
  );
  return (memberships ?? []).map((member) => {
    const name = names.get(member.user_id) || "Workspace member";
    return {
      name,
      initials: initials(name),
      role: member.role,
      joined: date(member.joined_at),
    };
  });
}
