"use client";
import { useState } from "react";
import { Button, Card, Input } from "./ui";
const tabs = [
  "General",
  "Profile",
  "Workspace",
  "Members",
  "Notifications",
  "Security",
  "Billing",
  "API",
  "Integrations",
  "Appearance",
  "Danger Zone",
];
export function SettingsForm({
  identity,
  workspace,
}: {
  identity: { name: string; email: string };
  workspace: { name: string; slug: string; role: string };
}) {
  const [tab, setTab] = useState("General");
  return (
    <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
      <nav
        className="flex gap-1 overflow-x-auto lg:flex-col"
        aria-label="Settings sections"
      >
        {tabs.map((x) => (
          <button
            key={x}
            onClick={() => setTab(x)}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm ${tab === x ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted"}`}
          >
            {x}
          </button>
        ))}
      </nav>
      <Card className="p-5 sm:p-7">
        <h2 className="text-lg font-semibold">{tab}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure your {tab.toLowerCase()} preferences for this workspace.
        </p>
        {tab === "Danger Zone" ? (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/5 p-5">
            <h3 className="font-semibold text-red-500">Delete workspace</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              This action permanently removes all data and cannot be undone.
            </p>
            <Button
              variant="danger"
              className="mt-4"
              disabled
            >
              Owner confirmation required
            </Button>
          </div>
        ) : (
          <div className="mt-7 max-w-xl space-y-5">
            <label className="block text-sm font-medium">
              Workspace name
              <Input className="mt-2" value={workspace.name} readOnly />
            </label>
            <label className="block text-sm font-medium">
              Workspace slug
              <Input
                className="mt-2"
                value={workspace.slug || "Slug unavailable"}
                readOnly
              />
            </label>
            <label className="block text-sm font-medium">
              Signed-in account
              <Input
                className="mt-2"
                type="email"
                value={identity.email}
                readOnly
              />
            </label>
            <div className="flex items-center justify-between border-t pt-5 text-sm text-muted-foreground">
              <span>{identity.name}</span>
              <span className="capitalize">{workspace.role}</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

