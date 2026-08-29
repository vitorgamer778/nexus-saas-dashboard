create index activities_actor_idx on public.activities(actor_id);
create index customers_plan_idx on public.customers(plan_id);
create index subscriptions_plan_idx on public.subscriptions(plan_id);
create index workspaces_owner_idx on public.workspaces(owner_id);

drop policy subscriptions_write on public.subscriptions;
create policy subscriptions_create on public.subscriptions for insert to authenticated with check (private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[]));
create policy subscriptions_update on public.subscriptions for update to authenticated using (private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[])) with check (private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[]));
create policy subscriptions_delete on public.subscriptions for delete to authenticated using (private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[]));

drop policy transactions_write on public.transactions;
create policy transactions_create on public.transactions for insert to authenticated with check (private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[]));
create policy transactions_update on public.transactions for update to authenticated using (private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[])) with check (private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[]));
create policy transactions_delete on public.transactions for delete to authenticated using (private.has_workspace_role(workspace_id, array['owner','admin']::public.member_role[]));
