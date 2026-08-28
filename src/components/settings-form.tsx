"use client";
import { useState } from "react";
import { toast } from "sonner";
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
export function SettingsForm() {
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
              onClick={() =>
                toast.error("Destructive action blocked in demo mode")
              }
            >
              Delete workspace
            </Button>
          </div>
        ) : (
          <form
            className="mt-7 max-w-xl space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success(`${tab} settings saved`);
            }}
          >
            <label className="block text-sm font-medium">
              Workspace name
              <Input className="mt-2" defaultValue="Orbit Labs" />
            </label>
            <label className="block text-sm font-medium">
              Workspace URL
              <Input className="mt-2" defaultValue="nexus.app/orbit-labs" />
            </label>
            <label className="block text-sm font-medium">
              Contact email
              <Input
                className="mt-2"
                type="email"
                defaultValue="hello@orbitlabs.io"
              />
            </label>
            <div className="flex justify-end border-t pt-5">
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

