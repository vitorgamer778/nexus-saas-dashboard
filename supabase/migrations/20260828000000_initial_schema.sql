create extension if not exists pgcrypto;
create schema if not exists private;

create type public.member_role as enum ('owner', 'admin', 'manager', 'member', 'viewer');
create type public.customer_status as enum ('active', 'trial', 'past_due', 'canceled');
create type public.transaction_status as enum ('approved', 'pending', 'failed', 'refunded');

create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, full_name text not null default '', avatar_url text, created_at timestamptz not null default now());
create table public.workspaces (id uuid primary key default gen_random_uuid(), name text not null check (char_length(name) between 2 and 80), slug text unique not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'), owner_id uuid not null references auth.users(id), created_at timestamptz not null default now());
create table public.workspace_members (workspace_id uuid references public.workspaces(id) on delete cascade, user_id uuid references auth.users(id) on delete cascade, role public.member_role not null default 'member', joined_at timestamptz not null default now(), primary key (workspace_id, user_id));
create table public.plans (id text primary key, name text not null, price_monthly numeric(12,2) not null check (price_monthly >= 0), features jsonb not null default '[]' check (jsonb_typeof(features) = 'array'));
create table public.customers (id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade, name text not null, email text not null, company text, plan_id text references public.plans(id), status public.customer_status not null default 'trial', mrr numeric(12,2) not null default 0 check (mrr >= 0), last_activity_at timestamptz, created_at timestamptz not null default now(), unique (workspace_id, email));
create table public.subscriptions (id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade, customer_id uuid not null references public.customers(id) on delete cascade, plan_id text not null references public.plans(id), status text not null check (status in ('active', 'trialing', 'past_due', 'canceled')), current_period_end timestamptz, amount numeric(12,2) not null check (amount >= 0), created_at timestamptz not null default now());
create table public.transactions (id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade, customer_id uuid references public.customers(id) on delete set null, amount numeric(12,2) not null check (amount >= 0), method text not null, status public.transaction_status not null, processed_at timestamptz not null default now());
create table public.activities (id bigint generated always as identity primary key, workspace_id uuid not null references public.workspaces(id) on delete cascade, actor_id uuid references auth.users(id) on delete set null, customer_id uuid references public.customers(id) on delete cascade, kind text not null, metadata jsonb not null default '{}', created_at timestamptz not null default now());
create table public.notifications (id bigint generated always as identity primary key, user_id uuid not null references auth.users(id) on delete cascade, title text not null, read_at timestamptz, created_at timestamptz not null default now());

create index workspace_members_user_idx on public.workspace_members(user_id, workspace_id);
create index customers_workspace_idx on public.customers(workspace_id);
create index subscriptions_workspace_idx on public.subscriptions(workspace_id);
create index subscriptions_customer_idx on public.subscriptions(customer_id);
create index transactions_workspace_date_idx on public.transactions(workspace_id, processed_at desc);
create index transactions_customer_idx on public.transactions(customer_id);
create index activities_workspace_date_idx on public.activities(workspace_id, created_at desc);
create index activities_customer_idx on public.activities(customer_id);
create index notifications_user_date_idx on public.notifications(user_id, created_at desc);

create function private.is_workspace_member(target uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select (select auth.uid()) is not null and exists (select 1 from public.workspace_members where workspace_id = target and user_id = (select auth.uid()))
$$;
create function private.has_workspace_role(target uuid, allowed public.member_role[]) returns boolean language sql stable security definer set search_path = '' as $$
  select (select auth.uid()) is not null and exists (select 1 from public.workspace_members where workspace_id = target and user_id = (select auth.uid()) and role = any(allowed))
$$;
create function private.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', '')) on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on schema private from public;
grant usage on schema private to authenticated;
revoke all on function private.is_workspace_member(uuid) from public;
revoke all on function private.has_workspace_role(uuid, public.member_role[]) from public;
revoke all on function private.handle_new_user() from public;
grant execute on function private.is_workspace_member(uuid) to authenticated;
grant execute on function private.has_workspace_role(uuid, public.member_role[]) to authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.plans enable row level security;
alter table public.customers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.transactions enable row level security;
alter table public.activities enable row level security;
alter table public.notifications enable row level security;

create policy profiles_select_self on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy profiles_insert_self on public.profiles for insert to authenticated with check (id = (select auth.uid()));
create policy profiles_update_self on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy plans_read on public.plans for select to authenticated using (true);
create policy workspaces_read on public.workspaces for select to authenticated using (private.is_workspace_member(id));
create policy workspaces_create on public.workspaces for insert to authenticated with check (owner_id = (select auth.uid()));
create policy workspaces_update on public.workspaces for update to authenticated using (private.has_workspace_role(id, array['owner','admin']::public.member_role[])) with check (private.has_workspace_role(id, array['owner','admin']::public.member_role[]));
create policy workspaces_delete on public.workspaces for delete to authenticated using (owner_id = (select auth.uid()));
create policy memberships_read on public.workspace_members for select to authenticated using (private.is_workspace_member(workspace_id));
create policy memberships_create_owner on public.workspace_members for insert to authenticated with check ((user_id = (select auth.uid()) and role = 'owner' and exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid()))) or private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[]));
create policy memberships_update on public.workspace_members for update to authenticated using (private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[])) with check (private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[]));
create policy memberships_delete on public.workspace_members for delete to authenticated using (private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[]));
create policy customers_read on public.customers for select to authenticated using (private.is_workspace_member(workspace_id));
create policy customers_create on public.customers for insert to authenticated with check (private.has_workspace_role(workspace_id, array['owner','admin','manager']::public.member_role[]));
create policy customers_update on public.customers for update to authenticated using (private.has_workspace_role(workspace_id, array['owner','admin','manager']::public.member_role[])) with check (private.has_workspace_role(workspace_id, array['owner','admin','manager']::public.member_role[]));
create policy customers_delete on public.customers for delete to authenticated using (private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[]));
create policy subscriptions_read on public.subscriptions for select to authenticated using (private.is_workspace_member(workspace_id));
create policy subscriptions_write on public.subscriptions for all to authenticated using (private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[])) with check (private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[]));
create policy transactions_read on public.transactions for select to authenticated using (private.is_workspace_member(workspace_id));
create policy transactions_write on public.transactions for all to authenticated using (private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[])) with check (private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[]));
create policy activities_read on public.activities for select to authenticated using (private.is_workspace_member(workspace_id));
create policy activities_create on public.activities for insert to authenticated with check (private.is_workspace_member(workspace_id) and actor_id = (select auth.uid()));
create policy notifications_read on public.notifications for select to authenticated using (user_id = (select auth.uid()));
create policy notifications_update on public.notifications for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

insert into public.plans (id, name, price_monthly, features) values
  ('free', 'Free', 0, '["2 seats", "Basic analytics"]'),
  ('starter', 'Starter', 19, '["10 seats", "Email support"]'),
  ('pro', 'Pro', 49, '["25 seats", "Advanced analytics"]'),
  ('business', 'Business', 129, '["Unlimited seats", "Priority support"]');
