import { getCurrentWorkspace } from "@/lib/workspace";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const [supabase, workspace] = await Promise.all([
    createClient(),
    getCurrentWorkspace(),
  ]);
  if (!supabase || !workspace)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const tables = [
    "customers",
    "subscriptions",
    "transactions",
    "activities",
    "notifications",
  ] as const;
  const results = await Promise.all(
    tables.map((table) =>
      supabase.from(table).select("*").eq("workspace_id", workspace.id),
    ),
  );
  const failed = results.find((result) => result.error);
  if (failed?.error)
    return Response.json({ error: "Export failed" }, { status: 500 });
  const data = Object.fromEntries(
    tables.map((table, index) => [table, results[index].data ?? []]),
  );
  return Response.json(
    {
      exportedAt: new Date().toISOString(),
      workspace: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
      },
      data,
    },
    {
      headers: {
        "Content-Disposition": `attachment; filename="${workspace.slug}-export.json"`,
        "Cache-Control": "private, no-store",
      },
    },
  );
}
