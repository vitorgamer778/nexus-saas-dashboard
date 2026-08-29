drop policy workspaces_read on public.workspaces;
create policy workspaces_read on public.workspaces for select to authenticated using (
  owner_id = (select auth.uid()) or private.is_workspace_member(id)
);

create function private.shares_workspace(target_user uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select (select auth.uid()) is not null and exists (
    select 1
    from public.workspace_members mine
    join public.workspace_members theirs using (workspace_id)
    where mine.user_id = (select auth.uid()) and theirs.user_id = target_user
  )
$$;
revoke all on function private.shares_workspace(uuid) from public;
grant execute on function private.shares_workspace(uuid) to authenticated;
create policy profiles_read_workspace on public.profiles for select to authenticated using (private.shares_workspace(id));

create function public.create_workspace(workspace_name text, workspace_slug text, selected_goal text default null, selected_plan text default 'free')
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  new_workspace_id uuid;
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if char_length(trim(workspace_name)) not between 2 and 80 then raise exception 'Invalid workspace name'; end if;
  insert into public.workspaces(name, slug, owner_id)
  values (trim(workspace_name), workspace_slug, current_user_id)
  returning id into new_workspace_id;
  insert into public.workspace_members(workspace_id, user_id, role)
  values (new_workspace_id, current_user_id, 'owner');
  insert into public.activities(workspace_id, actor_id, kind, metadata)
  values (new_workspace_id, current_user_id, 'workspace.created', jsonb_build_object('goal', selected_goal, 'plan', selected_plan));
  return new_workspace_id;
end;
$$;
revoke all on function public.create_workspace(text, text, text, text) from public;
grant execute on function public.create_workspace(text, text, text, text) to authenticated;
