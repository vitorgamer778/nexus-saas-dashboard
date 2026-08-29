drop policy if exists workspace_members_insert_owner on public.workspace_members;
drop policy if exists workspace_members_insert_admin on public.workspace_members;
drop policy if exists workspace_members_update_owner on public.workspace_members;
drop policy if exists workspace_members_update_admin on public.workspace_members;
drop policy if exists workspace_members_delete_owner on public.workspace_members;
drop policy if exists workspace_members_delete_admin on public.workspace_members;

create policy workspace_members_insert_authorized
on public.workspace_members for insert to authenticated
with check (
  (
    (select private.has_workspace_role(workspace_id, array['owner']::public.member_role[]))
    and role <> 'owner'
  )
  or (
    (select private.has_workspace_role(workspace_id, array['admin']::public.member_role[]))
    and role in ('manager', 'member', 'viewer')
  )
);

create policy workspace_members_update_authorized
on public.workspace_members for update to authenticated
using (
  (
    role <> 'owner'
    and (select private.has_workspace_role(workspace_id, array['owner']::public.member_role[]))
  )
  or (
    role in ('manager', 'member', 'viewer')
    and (select private.has_workspace_role(workspace_id, array['admin']::public.member_role[]))
  )
)
with check (
  (
    role <> 'owner'
    and (select private.has_workspace_role(workspace_id, array['owner']::public.member_role[]))
  )
  or (
    role in ('manager', 'member', 'viewer')
    and (select private.has_workspace_role(workspace_id, array['admin']::public.member_role[]))
  )
);

create policy workspace_members_delete_authorized
on public.workspace_members for delete to authenticated
using (
  (
    role <> 'owner'
    and (select private.has_workspace_role(workspace_id, array['owner']::public.member_role[]))
  )
  or (
    role in ('manager', 'member', 'viewer')
    and (select private.has_workspace_role(workspace_id, array['admin']::public.member_role[]))
  )
);

create or replace function private.create_workspace_internal(
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

revoke all on function private.create_workspace_internal(text, text, text, text) from public, anon;
grant execute on function private.create_workspace_internal(text, text, text, text) to authenticated;

create or replace function public.create_workspace(
  workspace_name text,
  workspace_slug text,
  selected_goal text default null,
  selected_plan text default 'free'
)
returns uuid
language sql
security invoker
set search_path = ''
as $$
  select private.create_workspace_internal(workspace_name, workspace_slug, selected_goal, selected_plan)
$$;

revoke all on function public.create_workspace(text, text, text, text) from public, anon;
grant execute on function public.create_workspace(text, text, text, text) to authenticated;

create or replace function private.transfer_workspace_ownership_internal(
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
  update public.workspaces set owner_id = new_owner_id where id = target_workspace_id;
  insert into public.activities(workspace_id, actor_id, kind, metadata)
  values (
    target_workspace_id,
    current_user_id,
    'workspace.ownership_transferred',
    jsonb_build_object('new_owner_id', new_owner_id)
  );
end;
$$;

revoke all on function private.transfer_workspace_ownership_internal(uuid, uuid) from public, anon;
grant execute on function private.transfer_workspace_ownership_internal(uuid, uuid) to authenticated;

create or replace function public.transfer_workspace_ownership(
  target_workspace_id uuid,
  new_owner_id uuid
)
returns void
language sql
security invoker
set search_path = ''
as $$
  select private.transfer_workspace_ownership_internal(target_workspace_id, new_owner_id)
$$;

revoke all on function public.transfer_workspace_ownership(uuid, uuid) from public, anon;
grant execute on function public.transfer_workspace_ownership(uuid, uuid) to authenticated;
