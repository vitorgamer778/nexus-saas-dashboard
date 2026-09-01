"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  Search,
  Settings,
  Sparkles,
  SunMoon,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useState } from "react";
import { NexusMark } from "@/components/nexus-mark";
import { Badge, Card } from "@/components/ui";
import type { DemoView } from "@/app/demo/[[...view]]/page";

const navigation = [
  { view: "dashboard", label: "Overview", icon: LayoutDashboard },
  { view: "customers", label: "Customers", icon: Users },
  { view: "subscriptions", label: "Subscriptions", icon: WalletCards },
  { view: "transactions", label: "Transactions", icon: CreditCard },
  { view: "analytics", label: "Analytics", icon: BarChart3 },
  { view: "team", label: "Team", icon: Activity },
  { view: "settings", label: "Settings", icon: Settings },
] as const;

const customers = [
  ["Marina Costa", "marina@northstar.demo", "Pro", "$249", "Healthy"],
  ["Theo Martins", "theo@arc.demo", "Business", "$599", "Healthy"],
  ["Lina Rocha", "lina@vector.demo", "Starter", "$79", "At risk"],
  ["Noah Silva", "noah@frame.demo", "Pro", "$249", "Healthy"],
  ["Maya Alves", "maya@bright.demo", "Free", "$0", "Trial"],
];

const transactions = [
  [
    "#NX-1048",
    "Northstar Studio",
    "$599.00",
    "Approved",
    "Visa •••• 4242",
    "Aug 28",
  ],
  [
    "#NX-1047",
    "Arc Systems",
    "$249.00",
    "Approved",
    "Mastercard •••• 0912",
    "Aug 28",
  ],
  ["#NX-1046", "Vector Labs", "$79.00", "Pending", "Visa •••• 1834", "Aug 27"],
  ["#NX-1045", "Frame Works", "$249.00", "Failed", "Amex •••• 1001", "Aug 26"],
];

function DemoAction({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={() =>
        toast.info("Read-only demo", {
          description: "This action is disabled and no data was changed.",
        })
      }
      className={`inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      {children}
    </button>
  );
}

function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: string;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-.035em] sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action ? (
        <DemoAction className="bg-primary text-primary-foreground hover:bg-primary/90">
          {action}
        </DemoAction>
      ) : null}
    </div>
  );
}

function DashboardView() {
  return (
    <>
      <PageHeader
        title="Revenue overview"
        description="A clear view of growth, retention and momentum."
        action="Create report"
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Monthly recurring revenue", "$46,820", "+12.4%", true],
          ["Annual run rate", "$561,840", "+9.1%", true],
          ["Active customers", "1,248", "+7.8%", true],
          ["Revenue churn", "2.4%", "-0.6%", true],
        ].map(([label, value, trend, up]) => (
          <Card
            key={String(label)}
            className="group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_22px_55px_-34px_var(--primary)]"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/55 to-transparent opacity-50" />
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="font-mono text-2xl font-semibold tracking-[-.045em]">
                {value}
              </p>
              <span className="flex items-center text-xs font-medium text-emerald-500">
                {up ? (
                  <ArrowUpRight className="size-3.5" />
                ) : (
                  <ArrowDownRight className="size-3.5" />
                )}
                {trend}
              </span>
            </div>
            <div className="mt-5 flex h-10 items-end gap-1">
              {[18, 27, 22, 34, 31, 44, 39, 54, 49, 62, 58, 72].map(
                (height, index) => (
                  <span
                    key={index}
                    style={{ height: `${height}%` }}
                    className="flex-1 rounded-t-sm bg-primary/25 transition-colors group-hover:bg-primary/35 last:bg-primary"
                  />
                ),
              )}
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Revenue momentum</h2>
              <p className="text-xs text-muted-foreground">
                MRR over the last six months
              </p>
            </div>
            <Badge tone="green">+18.2%</Badge>
          </div>
          <svg
            viewBox="0 0 700 230"
            className="mt-5 h-60 w-full"
            role="img"
            aria-label="Monthly recurring revenue trending upward"
          >
            <defs>
              <linearGradient id="demoArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--primary)" stopOpacity=".28" />
                <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 190 C80 180 105 155 175 164 S280 115 350 126 S450 72 525 84 S620 45 700 35 L700 230 L0 230Z"
              fill="url(#demoArea)"
            />
            <path
              d="M0 190 C80 180 105 155 175 164 S280 115 350 126 S450 72 525 84 S620 45 700 35"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </Card>
        <Card className="relative overflow-hidden border-primary/30 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--card)_94%,var(--primary)),var(--card))] p-6 shadow-[0_24px_70px_-48px_var(--primary)]">
          <div className="pointer-events-none absolute -right-10 -top-12 size-40 rounded-full border border-primary/15" />
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="size-4" />
            Nexus Intelligence <Badge tone="blue">Demo insight</Badge>
          </div>
          <h2 className="relative mt-7 text-xl font-semibold tracking-[-.025em]">
            Trial conversion dropped 14%
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Users who do not invite another team member within 24 hours convert
            37% less often.
          </p>
          <div className="relative mt-6 flex items-center justify-between border-t border-primary/15 pt-4 text-xs">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-semibold text-primary">94%</span>
          </div>
          <DemoAction className="mt-4 w-full">Investigate insight</DemoAction>
        </Card>
      </div>
    </>
  );
}

function TableView({ type }: { type: "customers" | "transactions" }) {
  const rows = type === "customers" ? customers : transactions;
  const headers =
    type === "customers"
      ? ["Customer", "Email", "Plan", "MRR", "Health"]
      : ["ID", "Customer", "Amount", "Status", "Method", "Date"];
  return (
    <>
      <PageHeader
        title={type === "customers" ? "Customers" : "Transactions"}
        description={
          type === "customers"
            ? "Customer health and subscription context in one place."
            : "A complete, searchable ledger of billing activity."
        }
        action={type === "customers" ? "Add customer" : "Export CSV"}
      />
      <Card className="mt-6 overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              aria-label={`Search ${type}`}
              placeholder={`Search ${type}…`}
              className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <DemoAction>
            All statuses <ChevronDown className="ml-2 size-4" />
          </DemoAction>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-muted/45 text-xs text-muted-foreground">
              <tr>
                {headers.map((h) => (
                  <th key={h} className="px-5 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row[0]}
                  className="border-t transition hover:bg-muted/30"
                >
                  {row.map((cell, j) => (
                    <td key={cell} className="px-5 py-4">
                      {type === "customers" && j === 0 ? (
                        <div className="flex items-center gap-3">
                          <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {cell
                              .split(" ")
                              .map((s) => s[0])
                              .join("")}
                          </span>
                          <span className="font-medium">{cell}</span>
                        </div>
                      ) : (type === "customers" && j === 4) ||
                        (type === "transactions" && j === 3) ? (
                        <Badge
                          tone={
                            cell === "Failed" || cell === "At risk"
                              ? "red"
                              : cell === "Pending" || cell === "Trial"
                                ? "amber"
                                : "green"
                          }
                        >
                          {cell}
                        </Badge>
                      ) : (
                        <span
                          className={
                            j === 0 ? "font-medium" : "text-muted-foreground"
                          }
                        >
                          {cell}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="px-4">
                    <button
                      aria-label={`Actions for row ${i + 1}`}
                      className="rounded-lg p-2 hover:bg-muted"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t px-5 py-3 text-xs text-muted-foreground">
          <span>Showing {rows.length} of 1,248</span>
          <span>Page 1 of 250</span>
        </div>
      </Card>
    </>
  );
}

function SubscriptionsView() {
  return (
    <>
      <PageHeader
        title="Subscriptions"
        description="Plan adoption and recurring revenue by tier."
        action="Manage plans"
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Free", "642", "$0"],
          ["Starter", "318", "$25.1k"],
          ["Pro", "246", "$61.3k"],
          ["Business", "42", "$25.2k"],
        ].map(([plan, count, revenue], i) => (
          <Card
            key={plan}
            className={`p-5 ${i === 2 ? "border-primary/35" : ""}`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{plan}</h2>
              {i === 2 ? <Badge tone="blue">Most popular</Badge> : null}
            </div>
            <p className="mt-7 text-3xl font-semibold">{count}</p>
            <p className="mt-1 text-xs text-muted-foreground">customers</p>
            <div className="mt-5 border-t pt-4 text-sm">
              <span className="text-muted-foreground">Revenue</span>
              <span className="float-right font-medium">{revenue}</span>
            </div>
          </Card>
        ))}
      </div>
      <Card className="mt-4 p-5">
        <h2 className="font-semibold">Subscription health</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {[
            ["Active", "1,129", "90.5%"],
            ["Trialing", "81", "6.5%"],
            ["Past due", "38", "3.0%"],
          ].map(([label, value, pct]) => (
            <div key={label}>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: pct }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function AnalyticsView() {
  return (
    <>
      <PageHeader
        title="Analytics"
        description="Acquisition, retention and revenue movement without the noise."
        action="Change period"
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-semibold">Acquisition funnel</h2>
          <p className="mt-1 text-xs text-muted-foreground">Last 30 days</p>
          <div className="mt-6 space-y-3">
            {[
              ["Visitors", 24820, 100],
              ["Signup", 6190, 72],
              ["Activated", 3714, 52],
              ["Trial", 2042, 34],
              ["Paid", 893, 19],
            ].map(([label, value, width], i) => (
              <div key={String(label)} className="flex items-center gap-3">
                <span className="w-16 text-xs text-muted-foreground">
                  {label}
                </span>
                <div
                  className="h-9 rounded-lg bg-primary/15"
                  style={{ width: `${width}%` }}
                >
                  <div className="flex h-full items-center px-3 text-xs font-medium">
                    {Number(value).toLocaleString()}
                  </div>
                </div>
                {i > 0 ? (
                  <span className="text-[10px] text-muted-foreground">
                    {Math.round(
                      (Number(value) /
                        Number([24820, 6190, 3714, 2042][i - 1])) *
                        100,
                    )}
                    %
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold">MRR movement</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Net growth +$4,920
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              ["New", "+$8,420", "green"],
              ["Expansion", "+$3,180", "green"],
              ["Contraction", "−$1,240", "amber"],
              ["Churn", "−$5,440", "red"],
            ].map(([label, value, tone]) => (
              <div key={label} className="rounded-xl border p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p
                  className={`mt-2 text-xl font-semibold ${tone === "green" ? "text-emerald-500" : tone === "red" ? "text-red-500" : "text-amber-500"}`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card className="mt-4 p-5">
        <div className="flex justify-between">
          <div>
            <h2 className="font-semibold">Retention cohort</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Monthly customer retention
            </p>
          </div>
          <Badge tone="green">Stable</Badge>
        </div>
        <div className="mt-6 grid grid-cols-7 gap-1 text-center text-[10px]">
          {[
            100, 86, 78, 73, 69, 66, 64, 100, 88, 80, 75, 72, 69, 100, 84, 76,
            71, 68, 100, 87, 79, 74, 100, 89, 82, 100, 85, 100,
          ].map((n, i) => (
            <div
              key={i}
              style={{ opacity: 0.22 + n / 130 }}
              className="rounded bg-primary px-1 py-3 text-white"
            >
              {n}%
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function TeamView() {
  return (
    <>
      <PageHeader
        title="Team"
        description="Workspace roles and member access."
        action="Invite member"
      />
      <Card className="mt-6 divide-y">
        {[
          ["Vitor Mendes", "vitor@nexus.demo", "Owner"],
          ["Ana Torres", "ana@nexus.demo", "Admin"],
          ["Lucas Freire", "lucas@nexus.demo", "Manager"],
          ["Sofia Lima", "sofia@nexus.demo", "Viewer"],
        ].map(([name, email, role]) => (
          <div key={email} className="flex items-center gap-3 p-4 sm:p-5">
            <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {name
                .split(" ")
                .map((s) => s[0])
                .join("")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
            <Badge tone={role === "Owner" ? "blue" : "neutral"}>{role}</Badge>
            <button
              aria-label={`More options for ${name}`}
              className="rounded-lg p-2 hover:bg-muted"
            >
              <MoreHorizontal className="size-4" />
            </button>
          </div>
        ))}
      </Card>
    </>
  );
}

function SettingsView() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Profile, workspace, security and product preferences."
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-[220px_1fr]">
        <Card className="h-fit p-2">
          {[
            "General",
            "Profile",
            "Members",
            "Notifications",
            "Security",
            "Billing",
            "Integrations",
            "Appearance",
          ].map((item, i) => (
            <button
              key={item}
              className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm ${i === 0 ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted"}`}
            >
              {item}
            </button>
          ))}
        </Card>
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Settings className="size-4 text-primary" />
            <h2 className="font-semibold">General</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Workspace defaults used across Nexus.
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {[
              ["Workspace name", "Orbit Labs"],
              ["Timezone", "America/São Paulo"],
              ["Locale", "English (US)"],
              ["Currency", "USD — US Dollar"],
            ].map(([label, value]) => (
              <label key={label} className="text-sm font-medium">
                {label}
                <input
                  value={value}
                  readOnly
                  className="mt-2 h-10 w-full rounded-lg border bg-muted/35 px-3 text-sm font-normal text-muted-foreground outline-none"
                />
              </label>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between border-t pt-5">
            <p className="text-xs text-muted-foreground">
              <LockKeyhole className="mr-1 inline size-3" />
              Read-only portfolio demo
            </p>
            <DemoAction>Save changes</DemoAction>
          </div>
        </Card>
      </div>
    </>
  );
}

function CurrentView({ view }: { view: DemoView }) {
  if (view === "dashboard") return <DashboardView />;
  if (view === "customers" || view === "transactions")
    return <TableView type={view} />;
  if (view === "subscriptions") return <SubscriptionsView />;
  if (view === "analytics") return <AnalyticsView />;
  if (view === "team") return <TeamView />;
  return <SettingsView />;
}

export function DemoWorkspace({ view }: { view: DemoView }) {
  const [open, setOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-violet-400/20 bg-violet-400/8 px-4 py-2 text-center text-xs text-muted-foreground">
        <Sparkles className="mr-1.5 inline size-3.5 text-primary" />
        <strong className="text-foreground">Portfolio demo:</strong> fictional
        data, read-only actions, no production access.
      </div>
      <div className="flex min-h-[calc(100vh-33px)]">
        <aside
          className={`${open ? "fixed inset-y-0 left-0 z-50 flex" : "hidden"} w-64 flex-col border-r border-border/70 bg-sidebar/95 p-4 shadow-[12px_0_45px_-38px_rgba(0,0,0,.55)] backdrop-blur-xl md:flex`}
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <NexusMark />
              Nexus
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 md:hidden"
              aria-label="Close navigation"
            >
              <X className="size-4" />
            </button>
          </div>
          <button
            onClick={() =>
              toast.info("Demo workspace", {
                description:
                  "Workspace switching is available after signing in.",
              })
            }
            className="mt-7 flex items-center gap-3 rounded-xl border bg-background p-3 text-left"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
              OL
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">
                Orbit Labs
              </span>
              <span className="block text-xs text-muted-foreground">
                Demo workspace
              </span>
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
          <nav className="mt-6 flex-1 space-y-1.5" aria-label="Demo navigation">
            {navigation.map(({ view: itemView, label, icon: Icon }) => (
              <Link
                key={itemView}
                href={`/demo/${itemView}`}
                onClick={() => setOpen(false)}
                aria-current={view === itemView ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:translate-x-0.5 ${view === itemView ? "bg-primary/10 font-semibold text-primary shadow-[inset_3px_0_0_var(--primary)]" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="rounded-xl border bg-background p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Want the real flow?</p>
            <p className="mt-1 leading-5">
              Create an account to test secure workspace onboarding.
            </p>
            <Link
              href="/register"
              className="mt-3 inline-flex font-medium text-primary hover:underline"
            >
              Create account →
            </Link>
          </div>
        </aside>
        {open ? (
          <button
            aria-label="Close navigation overlay"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/70 bg-background/85 px-4 shadow-[0_8px_30px_-28px_rgba(0,0,0,.45)] backdrop-blur-xl sm:px-6">
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg p-2 hover:bg-muted md:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <div className="relative hidden max-w-sm flex-1 sm:block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                aria-label="Search demo"
                placeholder="Search Nexus…"
                className="h-9 w-full rounded-lg border bg-muted/30 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="ml-auto flex items-center gap-1">
              <Link
                href="/"
                className="hidden rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted sm:block"
              >
                Exit demo
              </Link>
              <button
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                className="rounded-lg p-2 hover:bg-muted"
                aria-label="Toggle color theme"
              >
                <SunMoon className="size-4" />
              </button>
              <button
                onClick={() => toast.info("No new notifications in the demo.")}
                className="rounded-lg p-2 hover:bg-muted"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
              </button>
              <span className="ml-1 grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                VM
              </span>
            </div>
          </header>
          <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8 xl:p-9">
            <CurrentView view={view} />
          </main>
        </div>
      </div>
    </div>
  );
}
