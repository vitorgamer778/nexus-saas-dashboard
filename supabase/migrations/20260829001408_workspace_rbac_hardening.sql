-- Workspace RBAC is enforced in Postgres so every client (REST, SSR, or direct
-- database access through an authenticated role) receives the same decision.

create or replace function private.has_workspace_role(
  target uuid,
  allowed public.member_role[]
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and exists (
      select 1
      from public.workspace_members
      where workspace_id = target
        and user_id = (select auth.uid())
        and role = any(allowed)
    )
$$;

revoke all on function private.has_workspace_role(uuid, public.member_role[]) from public;
grant execute on function private.has_workspace_role(uuid, public.member_role[]) to authenticated;

-- Replace every workspace policy with an operation-specific policy.
drop policy if exists workspaces_read on public.workspaces;
drop policy if exists workspaces_create on public.workspaces;
drop policy if exists workspaces_update on public.workspaces;
drop policy if exists workspaces_delete on public.workspaces;

create policy workspaces_select_member
on public.workspaces for select to authenticated
using ((select private.is_workspace_member(id)));

-- Workspace creation is intentionally available only through create_workspace(),
-- which creates the workspace and owner membership in one transaction.
create policy workspaces_insert_denied
on public.workspaces for insert to authenticated
with check (false);

create policy workspaces_update_owner_admin
on public.workspaces for update to authenticated
using ((select private.has_workspace_role(id, array['owner','admin']::public.member_role[])))
with check ((select private.has_workspace_role(id, array['owner','admin']::public.member_role[])));

create policy workspaces_delete_owner
on public.workspaces for delete to authenticated
using (owner_id = (select auth.uid()) and (select private.has_workspace_role(id, array['owner']::public.member_role[])));

-- Direct updates may change general settings, never ownership. Ownership is
-- transferred atomically through transfer_workspace_ownership().
revoke insert on public.workspaces from authenticated;
revoke update on public.workspaces from authenticated;
grant update (name, slug) on public.workspaces to authenticated;

drop policy if exists memberships_read on public.workspace_members;
drop policy if exists memberships_create_owner on public.workspace_members;
drop policy if exists memberships_update on public.workspace_members;
drop policy if exists memberships_delete on public.workspace_members;

create policy workspace_members_select_member
on public.workspace_members for select to authenticated
using ((select private.is_workspace_member(workspace_id)));

create policy workspace_members_insert_owner
on public.workspace_members for insert to authenticated
with check (
  (select private.has_workspace_role(workspace_id, array['owner']::public.member_role[]))
  and role <> 'owner'
);

create policy workspace_members_insert_admin
on public.workspace_members for insert to authenticated
with check (
  (select private.has_workspace_role(workspace_id, array['admin']::public.member_role[]))
  and role in ('manager', 'member', 'viewer')
);

create policy workspace_members_update_owner
on public.workspace_members for update to authenticated
using (
  role <> 'owner'
  and (select private.has_workspace_role(workspace_id, array['owner']::public.member_role[]))
)
with check (
  role <> 'owner'
  and (select private.has_workspace_role(workspace_id, array['owner']::public.member_role[]))
);

create policy workspace_members_update_admin
on public.workspace_members for update to authenticated
using (
  role in ('manager', 'member', 'viewer')
  and (select private.has_workspace_role(workspace_id, array['admin']::public.member_role[]))
)
with check (
  role in ('manager', 'member', 'viewer')
  and (select private.has_workspace_role(workspace_id, array['admin']::public.member_role[]))
);

create policy workspace_members_delete_owner
on public.workspace_members for delete to authenticated
using (
  role <> 'owner'
  and (select private.has_workspace_role(workspace_id, array['owner']::public.member_role[]))
);

create policy workspace_members_delete_admin
on public.workspace_members for delete to authenticated
using (
  role in ('manager', 'member', 'viewer')
  and (select private.has_workspace_role(workspace_id, array['admin']::public.member_role[]))
);

revoke update on public.workspace_members from authenticated;
grant update (role) on public.workspace_members to authenticated;

drop policy if exists customers_read on public.customers;
drop policy if exists customers_create on public.customers;
drop policy if exists customers_update on public.customers;
drop policy if exists customers_delete on public.customers;

create policy customers_select_member
on public.customers for select to authenticated
using ((select private.is_workspace_member(workspace_id)));

create policy customers_insert_operator
on public.customers for insert to authenticated
with check ((select private.has_workspace_role(workspace_id, array['owner','admin','manager','member']::public.member_role[])));

create policy customers_update_operator
on public.customers for update to authenticated
using ((select private.has_workspace_role(workspace_id, array['owner','admin','manager','member']::public.member_role[])))
with check ((select private.has_workspace_role(workspace_id, array['owner','admin','manager','member']::public.member_role[])));

create policy customers_delete_manager
on public.customers for delete to authenticated
using ((select private.has_workspace_role(workspace_id, array['owner','admin','manager']::public.member_role[])));

drop policy if exists subscriptions_read on public.subscriptions;
drop policy if exists subscriptions_create on public.subscriptions;
drop policy if exists subscriptions_update on public.subscriptions;
drop policy if exists subscriptions_delete on public.subscriptions;

create policy subscriptions_select_member
on public.subscriptions for select to authenticated
using ((select private.is_workspace_member(workspace_id)));

create policy subscriptions_insert_operator
on public.subscriptions for insert to authenticated
with check ((select private.has_workspace_role(workspace_id, array['owner','admin','manager','member']::public.member_role[])));

create policy subscriptions_update_operator
on public.subscriptions for update to authenticated
using ((select private.has_workspace_role(workspace_id, array['owner','admin','manager','member']::public.member_role[])))
with check ((select private.has_workspace_role(workspace_id, array['owner','admin','manager','member']::public.member_role[])));

create policy subscriptions_delete_admin
on public.subscriptions for delete to authenticated
using ((select private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[])));

drop policy if exists transactions_read on public.transactions;
drop policy if exists transactions_create on public.transactions;
drop policy if exists transactions_update on public.transactions;
drop policy if exists transactions_delete on public.transactions;

create policy transactions_select_member
on public.transactions for select to authenticated
using ((select private.is_workspace_member(workspace_id)));

create policy transactions_insert_operator
on public.transactions for insert to authenticated
with check ((select private.has_workspace_role(workspace_id, array['owner','admin','manager','member']::public.member_role[])));

create policy transactions_update_operator
on public.transactions for update to authenticated
using ((select private.has_workspace_role(workspace_id, array['owner','admin','manager','member']::public.member_role[])))
with check ((select private.has_workspace_role(workspace_id, array['owner','admin','manager','member']::public.member_role[])));

create policy transactions_delete_admin
on public.transactions for delete to authenticated
using ((select private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[])));

drop policy if exists activities_read on public.activities;
drop policy if exists activities_create on public.activities;

create policy activities_select_member
on public.activities for select to authenticated
using ((select private.is_workspace_member(workspace_id)));

create policy activities_insert_operator
on public.activities for insert to authenticated
with check (
  actor_id = (select auth.uid())
  and (select private.has_workspace_role(workspace_id, array['owner','admin','manager','member']::public.member_role[]))
);

create policy activities_update_owner
on public.activities for update to authenticated
using ((select private.has_workspace_role(workspace_id, array['owner']::public.member_role[])))
with check ((select private.has_workspace_role(workspace_id, array['owner']::public.member_role[])));

create policy activities_delete_owner
on public.activities for delete to authenticated
using ((select private.has_workspace_role(workspace_id, array['owner']::public.member_role[])));

-- Notifications become workspace-scoped so workspace RBAC applies to writes.
alter table public.notifications
  add column workspace_id uuid references public.workspaces(id) on delete cascade;

update public.notifications n
set workspace_id = (
  select wm.workspace_id
  from public.workspace_members wm
  where wm.user_id = n.user_id
  order by wm.joined_at
  limit 1
)
where workspace_id is null;

create index notifications_workspace_idx on public.notifications(workspace_id);

drop policy if exists notifications_read on public.notifications;
drop policy if exists notifications_update on public.notifications;

create policy notifications_select_recipient
on public.notifications for select to authenticated
using (
  user_id = (select auth.uid())
  and (
    workspace_id is null
    or (select private.is_workspace_member(workspace_id))
  )
);

create policy notifications_insert_admin
on public.notifications for insert to authenticated
with check (
  (select private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[]))
  and exists (
    select 1 from public.workspace_members recipient
    where recipient.workspace_id = notifications.workspace_id
      and recipient.user_id = notifications.user_id
  )
);

create policy notifications_update_recipient
on public.notifications for update to authenticated
using (
  user_id = (select auth.uid())
  and (select private.has_workspace_role(workspace_id, array['owner','admin','manager','member']::public.member_role[]))
)
with check (
  user_id = (select auth.uid())
  and (select private.has_workspace_role(workspace_id, array['owner','admin','manager','member']::public.member_role[]))
);

create policy notifications_delete_recipient_or_admin
on public.notifications for delete to authenticated
using (
  (
    user_id = (select auth.uid())
    and (select private.has_workspace_role(workspace_id, array['owner','admin','manager','member']::public.member_role[]))
  )
  or (select private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[]))
);

revoke update on public.notifications from authenticated;
grant update (read_at) on public.notifications to authenticated;

-- Atomic onboarding. SECURITY DEFINER is required because direct workspace
-- INSERT is denied; the function performs its own auth and input checks.
create or replace function public.create_workspace(
  workspace_name text,
  workspace_slug text,
  selected_goal text default null,
  selected_plan text default 'free'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_workspace_id uuid;
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if char_length(trim(workspace_name)) not between 2 and 80 then
    raise exception 'Invalid workspace name' using errcode = '22023';
  end if;
  if workspace_slug is null or workspace_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception 'Invalid workspace slug' using errcode = '22023';
  end if;
  if not exists (select 1 from public.plans where id = selected_plan) then
    raise exception 'Invalid plan' using errcode = '22023';
  end if;

  insert into public.workspaces(name, slug, owner_id)
  values (trim(workspace_name), workspace_slug, current_user_id)
  returning id into new_workspace_id;

  insert into public.workspace_members(workspace_id, user_id, role)
  values (new_workspace_id, current_user_id, 'owner');

  insert into public.activities(workspace_id, actor_id, kind, metadata)
  values (
    new_workspace_id,
    current_user_id,
    'workspace.created',
    jsonb_build_object('goal', selected_goal, 'plan', selected_plan)
  );

  return new_workspace_id;
end;
$$;

revoke all on function public.create_workspace(text, text, text, text) from public;
grant execute on function public.create_workspace(text, text, text, text) to authenticated;

create or replace function public.transfer_workspace_ownership(
  target_workspace_id uuid,
  new_owner_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if not exists (
    select 1 from public.workspaces
    where id = target_workspace_id and owner_id = current_user_id
  ) then
    raise exception 'Only the current owner can transfer ownership' using errcode = '42501';
  end if;
  if new_owner_id = current_user_id then
    return;
  end if;
  if not exists (
    select 1 from public.workspace_members
    where workspace_id = target_workspace_id and user_id = new_owner_id
  ) then
    raise exception 'The new owner must already be a workspace member' using errcode = '22023';
  end if;

  update public.workspace_members
  set role = case
    when user_id = current_user_id then 'admin'::public.member_role
    when user_id = new_owner_id then 'owner'::public.member_role
    else role
  end
  where workspace_id = target_workspace_id
    and user_id in (current_user_id, new_owner_id);

  update public.workspaces
  set owner_id = new_owner_id
  where id = target_workspace_id;

  insert into public.activities(workspace_id, actor_id, kind, metadata)
  values (
    target_workspace_id,
    current_user_id,
    'workspace.ownership_transferred',
    jsonb_build_object('new_owner_id', new_owner_id)
  );
end;
$$;

revoke all on function public.transfer_workspace_ownership(uuid, uuid) from public;
grant execute on function public.transfer_workspace_ownership(uuid, uuid) to authenticated;
