"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, ChevronDown, LoaderCircle, Plus, Settings } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { toast } from "sonner";
import { switchWorkspace } from "@/app/(app)/workspace-actions";
import type { UserWorkspace } from "@/lib/workspace-selection";

export function WorkspaceSwitcher({
  activeWorkspace,
  workspaces,
}: {
  activeWorkspace: UserWorkspace;
  workspaces: UserWorkspace[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function selectWorkspace(workspace: UserWorkspace) {
    if (workspace.id === activeWorkspace.id || pending) return;
    startTransition(async () => {
      try {
        await switchWorkspace(workspace.id);
        setOpen(false);
        router.refresh();
      } catch {
        toast.error("Could not switch workspace. Please try again.");
      }
    });
  }

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className="mt-4 flex w-full items-center gap-3 rounded-xl border border-border p-2.5 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Current workspace: ${activeWorkspace.name}`}
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-violet-500/10 text-xs font-bold text-violet-500">
            {activeWorkspace.name.slice(0, 2).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <b className="block truncate text-sm">{activeWorkspace.name}</b>
            <span className="block truncate text-xs capitalize text-muted-foreground">
              {activeWorkspace.role} workspace
            </span>
          </span>
          {pending ? (
            <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="bottom"
          align="start"
          sideOffset={8}
          className="z-[70] w-60 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl outline-none"
        >
          <DropdownMenu.Label className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Your workspaces
          </DropdownMenu.Label>
          {workspaces.map((workspace) => (
            <DropdownMenu.Item
              key={workspace.id}
              disabled={pending}
              onSelect={() => selectWorkspace(workspace)}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-muted"
            >
              <span className="grid size-7 place-items-center rounded-md bg-violet-500/10 text-[10px] font-bold text-violet-500">
                {workspace.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1 truncate">{workspace.name}</span>
              {workspace.id === activeWorkspace.id && (
                <Check className="size-4 text-primary" aria-label="Selected" />
              )}
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item asChild>
            <Link
              href="/onboarding"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm outline-none data-[highlighted]:bg-muted"
            >
              <Plus className="size-4" /> Create workspace
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link
              href="/settings"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm outline-none data-[highlighted]:bg-muted"
            >
              <Settings className="size-4" /> Manage workspaces
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
