alter table public.profiles
  add column if not exists locale text not null default 'en-US',
  add column if not exists timezone text not null default 'UTC',
  add column if not exists compact_mode boolean not null default false;

alter table public.workspaces
  add column if not exists locale text not null default 'en-US',
  add column if not exists timezone text not null default 'UTC',
  add column if not exists currency text not null default 'USD',
  add column if not exists logo_url text,
  add column if not exists plan_id text not null default 'free' references public.plans(id);

revoke update on public.profiles from authenticated;
grant update (full_name, avatar_url, locale, timezone, compact_mode) on public.profiles to authenticated;
revoke update on public.workspaces from authenticated;
grant update (name, slug, locale, timezone, currency, logo_url) on public.workspaces to authenticated;

create table public.notification_preferences (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  payment_failed boolean not null default true,
  new_customer boolean not null default true,
  subscription_canceled boolean not null default true,
  weekly_report boolean not null default true,
  security_alert boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

alter table public.notification_preferences enable row level security;
grant select, insert, update on public.notification_preferences to authenticated;

create policy notification_preferences_select_self
on public.notification_preferences for select to authenticated
using (user_id = (select auth.uid()) and (select private.is_workspace_member(workspace_id)));

create policy notification_preferences_insert_self
on public.notification_preferences for insert to authenticated
with check (user_id = (select auth.uid()) and (select private.is_workspace_member(workspace_id)));

create policy notification_preferences_update_self
on public.notification_preferences for update to authenticated
using (user_id = (select auth.uid()) and (select private.is_workspace_member(workspace_id)))
with check (user_id = (select auth.uid()) and (select private.is_workspace_member(workspace_id)));

create table public.workspace_invitations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email text not null check (email = lower(email) and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  role public.member_role not null check (role <> 'owner'),
  invited_by uuid not null references auth.users(id),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  created_at timestamptz not null default now()
);

create unique index workspace_invitations_pending_email_idx
on public.workspace_invitations(workspace_id, email) where status = 'pending';

alter table public.workspace_invitations enable row level security;
grant select, insert, update, delete on public.workspace_invitations to authenticated;

create policy workspace_invitations_select_admin
on public.workspace_invitations for select to authenticated
using ((select private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[])));

create policy workspace_invitations_insert_admin
on public.workspace_invitations for insert to authenticated
with check (
  invited_by = (select auth.uid())
  and role <> 'owner'
  and (
    (select private.has_workspace_role(workspace_id, array['owner']::public.member_role[]))
    or (
      role in ('manager','member','viewer')
      and (select private.has_workspace_role(workspace_id, array['admin']::public.member_role[]))
    )
  )
);

create policy workspace_invitations_update_admin
on public.workspace_invitations for update to authenticated
using ((select private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[])))
with check (role <> 'owner' and (select private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[])));

create policy workspace_invitations_delete_admin
on public.workspace_invitations for delete to authenticated
using ((select private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[])));

create index workspace_invitations_workspace_idx on public.workspace_invitations(workspace_id, created_at desc);
create index notification_preferences_user_idx on public.notification_preferences(user_id);
create index workspace_invitations_invited_by_idx on public.workspace_invitations(invited_by);
create index workspaces_plan_idx on public.workspaces(plan_id);
