export const ACTIVE_WORKSPACE_COOKIE = "nexus_active_workspace";

export type UserWorkspace = {
  id: string;
  name: string;
  slug: string;
  role: string;
};

export function selectActiveWorkspace(
  workspaces: UserWorkspace[],
  preferredId?: string,
) {
  return (
    workspaces.find((workspace) => workspace.id === preferredId) ??
    workspaces[0] ??
    null
  );
}
