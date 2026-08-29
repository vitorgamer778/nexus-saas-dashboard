"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace";

export async function changeWorkspacePlan(planId: string) {
  const selectedPlan = z
    .string()
    .trim()
    .min(1)
    .max(40)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .parse(planId);
  const [supabase, workspace] = await Promise.all([
    createClient(),
    getCurrentWorkspace(),
  ]);
  if (!supabase || !workspace) throw new Error("Authentication required.");
  const { error } = await supabase.rpc("change_workspace_plan", {
    target_workspace_id: workspace.id,
    selected_plan: selectedPlan,
  });
  if (error)
    throw new Error(
      error.code === "42501"
        ? "Owner or admin access required."
        : error.message,
    );
  revalidatePath("/subscriptions");
  revalidatePath("/settings");
}
