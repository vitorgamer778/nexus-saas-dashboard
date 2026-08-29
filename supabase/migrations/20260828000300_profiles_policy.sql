drop policy profiles_select_self on public.profiles;
drop policy profiles_read_workspace on public.profiles;
create policy profiles_read_allowed on public.profiles for select to authenticated using (
  id = (select auth.uid()) or private.shares_workspace(id)
);
