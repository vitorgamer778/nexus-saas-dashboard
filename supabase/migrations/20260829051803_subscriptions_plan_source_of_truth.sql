-- Keep plan selection consistent across onboarding, workspace settings and the
-- subscription screen. Privileged operations remain behind authenticated,
-- role-aware functions; callers cannot change another workspace.

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

  insert into public.workspaces(name, slug, owner_id, plan_id)
  values (trim(workspace_name), workspace_slug, current_user_id, selected_plan)
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

create or replace function private.change_workspace_plan_internal(
  target_workspace_id uuid,
  selected_plan text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  previous_plan text;
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if not (select private.has_workspace_role(
    target_workspace_id,
    array['owner','admin']::public.member_role[]
  )) then
    raise exception 'Owner or admin access required' using errcode = '42501';
  end if;
  if not exists (select 1 from public.plans where id = selected_plan) then
    raise exception 'Invalid plan' using errcode = '22023';
  end if;

  select plan_id into previous_plan
  from public.workspaces
  where id = target_workspace_id;

  update public.workspaces
  set plan_id = selected_plan
  where id = target_workspace_id;

  if previous_plan is distinct from selected_plan then
    insert into public.activities(workspace_id, actor_id, kind, metadata)
    values (
      target_workspace_id,
      current_user_id,
      'workspace.plan_changed',
      jsonb_build_object('from', previous_plan, 'to', selected_plan)
    );
  end if;
end;
$$;

revoke all on function private.change_workspace_plan_internal(uuid, text) from public, anon;
grant execute on function private.change_workspace_plan_internal(uuid, text) to authenticated;

create or replace function public.change_workspace_plan(
  target_workspace_id uuid,
  selected_plan text
)
returns void
language sql
security invoker
set search_path = ''
as $$
  select private.change_workspace_plan_internal(target_workspace_id, selected_plan)
$$;

revoke all on function public.change_workspace_plan(uuid, text) from public, anon;
grant execute on function public.change_workspace_plan(uuid, text) to authenticated;
