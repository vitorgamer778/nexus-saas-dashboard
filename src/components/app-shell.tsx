"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Users,
  WalletCards,
  ReceiptText,
  ChartNoAxesCombined,
  UserRoundCog,
  Settings,
  Search,
  Menu,
  X,
  Command,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  LogOut,
  Plus,
} from "lucide-react";
import { Avatar, Button } from "./ui";
import { cn } from "@/lib/utils";
import { displayInitials } from "@/lib/display";
const nav = [
  ["/dashboard", "Overview", LayoutDashboard],
  ["/customers", "Customers", Users],
  ["/subscriptions", "Subscriptions", WalletCards],
  ["/transactions", "Transactions", ReceiptText],
  ["/analytics", "Analytics", ChartNoAxesCombined],
  ["/team", "Team", UserRoundCog],
  ["/settings", "Settings", Settings],
] as const;
export function AppShell({
  children,
  user,
  workspace,
}: {
  children: React.ReactNode;
  user: { name: string; email: string | null; avatarUrl: string | null };
  workspace: { name: string; role: string };
}) {
  const path = usePathname(),
    router = useRouter(),
    [mobile, setMobile] = useState(false),
    [cmd, setCmd] = useState(false),
    [accountOpen, setAccountOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const initials = displayInitials(user.name);
  const signOut = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    await createClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  };
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmd((v) => !v);
      }
      if (e.key === "Escape") {
        setCmd(false);
        setMobile(false);
      }
    };
    addEventListener("keydown", fn);
    return () => removeEventListener("keydown", fn);
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-sidebar p-4 transition-transform lg:translate-x-0",
          mobile ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-12 items-center justify-between px-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 font-semibold"
          >
            <span className="grid size-8 place-items-center rounded-xl bg-primary text-sm text-primary-foreground">
              N
            </span>
            Nexus
          </Link>
          <button
            className="lg:hidden"
            onClick={() => setMobile(false)}
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>
        <button className="mt-4 flex w-full items-center gap-3 rounded-xl border border-border p-2.5 text-left hover:bg-muted">
          <span className="grid size-8 place-items-center rounded-lg bg-violet-500/10 text-xs font-bold text-violet-500">
            {workspace.name.slice(0, 2).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <b className="block truncate text-sm">{workspace.name}</b>
            <span className="block text-xs text-muted-foreground">
              {workspace.role} workspace
            </span>
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
        <nav className="mt-6 space-y-1" aria-label="Main navigation">
          {nav.map(([href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobile(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                path.startsWith(href) &&
                  "bg-primary/10 font-medium text-primary",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute inset-x-4 bottom-4 rounded-xl border border-border p-3">
          <div className="flex items-center gap-2">
            <Avatar initials={initials} avatarUrl={user.avatarUrl} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email ?? "Email unavailable"}
              </p>
            </div>
            <button
              aria-label="Account options"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((value) => !value)}
            >
              <ChevronDown className="size-4" />
            </button>
          </div>
          {accountOpen && (
            <button
              className="mt-3 flex w-full items-center gap-2 rounded-lg border-t px-2 pt-3 text-sm text-muted-foreground hover:text-foreground"
              onClick={signOut}
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          )}
        </div>
      </aside>
      {mobile && (
        <button
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobile(false)}
          aria-label="Close menu overlay"
        />
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6">
          <button
            className="lg:hidden"
            onClick={() => setMobile(true)}
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </button>
          <button
            onClick={() => setCmd(true)}
            className="hidden h-9 w-full max-w-sm items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground sm:flex"
          >
            <Search className="size-4" />
            Search anything…
            <span className="ml-auto flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px]">
              <Command className="size-3" />K
            </span>
          </button>
          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              aria-label="Toggle color theme"
            >
              <Sun className="size-4 dark:hidden" />
              <Moon className="hidden size-4 dark:block" />
            </Button>
            <Button variant="ghost" aria-label="Notifications">
              <Bell className="size-4" />
              <span className="absolute mt-[-14px] ml-3 size-2 rounded-full bg-primary" />
            </Button>
            <Button className="hidden sm:flex">
              <Plus className="size-4" />
              Create
            </Button>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      {cmd && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/55 px-4 pt-[15vh]"
          onMouseDown={() => setCmd(false)}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b p-4">
              <Search className="size-5 text-muted-foreground" />
              <input
                autoFocus
                className="flex-1 bg-transparent outline-none"
                placeholder="Search pages, customers, actions…"
              />
              <kbd className="text-xs text-muted-foreground">ESC</kbd>
            </div>
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quick navigation
              </p>
              {nav.slice(0, 5).map(([href, label, Icon]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setCmd(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted"
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

