"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { AlertDialog } from "radix-ui";
import {
  Bell,
  Building2,
  Check,
  CircleDollarSign,
  Code2,
  Download,
  KeyRound,
  Palette,
  Plug,
  Save,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import { Avatar, Badge, Button, Card, Input } from "./ui";
import { displayInitials } from "@/lib/display";
import {
  deleteWorkspace,
  inviteMember,
  removeMember,
  transferOwnership,
  updateAppearance,
  updateEmail,
  updateMemberRole,
  updateNotificationPreferences,
  updatePassword,
  updateProfile,
  updateWorkspaceSettings,
} from "@/app/(app)/settings/actions";

type Role = "owner" | "admin" | "manager" | "member" | "viewer";
export type SettingsData = {
  identity: {
    id: string;
    name: string;
    email: string | null;
    avatarUrl: string | null;
    createdAt: string;
    lastSignInAt: string | null;
    provider: string;
  };
  workspace: {
    id: string;
    name: string;
    slug: string;
    role: Role;
    logo_url?: string | null;
    locale?: string;
    timezone?: string;
    currency?: string;
    plan: { name: string; price_monthly: number };
  };
  profile: {
    full_name: string;
    avatar_url: string | null;
    locale: string;
    timezone: string;
    compact_mode: boolean;
  };
  preferences: Record<
    | "payment_failed"
    | "new_customer"
    | "subscription_canceled"
    | "weekly_report"
    | "security_alert",
    boolean
  >;
  members: Array<{
    id: string;
    name: string;
    initials: string;
    avatarUrl: string | null;
    role: string;
    joined: string;
  }>;
  invitations: Array<{
    id: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
  }>;
  mfaEnabled: boolean;
  billing: {
    customerCount: number;
    monthlyRevenue: number;
  };
};
const sections = [
  ["general", "General", Building2],
  ["profile", "Profile", UserRound],
  ["workspace", "Workspace", Building2],
  ["members", "Members", Users],
  ["notifications", "Notifications", Bell],
  ["security", "Security", ShieldCheck],
  ["billing", "Billing", CircleDollarSign],
  ["api", "API", Code2],
  ["integrations", "Integrations", Plug],
  ["appearance", "Appearance", Palette],
  ["danger", "Danger zone", Trash2],
] as const;
const selectClass =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-60";
const zones = [
  "UTC",
  "America/Sao_Paulo",
  "America/New_York",
  "Europe/London",
  "Europe/Lisbon",
];
const formatSecurityDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export function SettingsForm({ data }: { data: SettingsData }) {
  const [section, setSection] = useState("general"),
    [pending, startTransition] = useTransition();
  const router = useRouter();
  const canManage = ["owner", "admin"].includes(data.workspace.role),
    isOwner = data.workspace.role === "owner";
  const run = (action: () => Promise<void>, message: string) =>
    startTransition(async () => {
      try {
        await action();
        toast.success(message);
        router.refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  return (
    <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
      <nav
        className="flex gap-1 overflow-x-auto rounded-xl border bg-card p-2 xl:sticky xl:top-24 xl:h-fit xl:flex-col"
        aria-label="Settings sections"
      >
        {sections.map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            aria-current={section === id ? "page" : undefined}
            className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${section === id ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </nav>
      <div className="min-w-0">
        {section === "general" && (
          <WorkspacePanel
            data={data}
            canManage={canManage}
            pending={pending}
            run={run}
            general
          />
        )}
        {section === "workspace" && (
          <WorkspacePanel
            data={data}
            canManage={canManage}
            pending={pending}
            run={run}
          />
        )}
        {section === "profile" && (
          <ProfilePanel data={data} pending={pending} run={run} />
        )}
        {section === "members" && (
          <MembersPanel
            data={data}
            canManage={canManage}
            pending={pending}
            run={run}
          />
        )}
        {section === "notifications" && (
          <NotificationsPanel data={data} pending={pending} run={run} />
        )}
        {section === "security" && (
          <SecurityPanel data={data} pending={pending} run={run} />
        )}
        {section === "billing" && <BillingPanel data={data} />}
        {section === "api" && (
          <ComingSoon
            title="API keys"
            text="A secure server-side key vault and scoped key issuance backend are not configured. No keys are generated or stored in this browser."
            icon={KeyRound}
          />
        )}
        {section === "integrations" && <Integrations />}
        {section === "appearance" && (
          <Appearance data={data} pending={pending} run={run} />
        )}
        {section === "danger" && (
          <Danger data={data} isOwner={isOwner} pending={pending} run={run} />
        )}
      </div>
    </div>
  );
}
function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <header className="border-b px-5 py-5 sm:px-7">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>
      <div className="p-5 sm:p-7">{children}</div>
    </Card>
  );
}
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <span className="mt-2 block">{children}</span>
      {hint && (
        <span className="mt-1 block text-xs font-normal text-muted-foreground">
          {hint}
        </span>
      )}
    </label>
  );
}
type Run = (a: () => Promise<void>, s: string) => void;
function WorkspacePanel({
  data,
  canManage,
  pending,
  run,
  general = false,
}: {
  data: SettingsData;
  canManage: boolean;
  pending: boolean;
  run: Run;
  general?: boolean;
}) {
  const [name, setName] = useState(data.workspace.name),
    [slug, setSlug] = useState(data.workspace.slug),
    [timezone, setTimezone] = useState(data.workspace.timezone ?? "UTC"),
    [locale, setLocale] = useState(data.workspace.locale ?? "en-US"),
    [currency, setCurrency] = useState(data.workspace.currency ?? "USD"),
    [logoUrl, setLogo] = useState(data.workspace.logo_url ?? "");
  const save = () =>
    run(
      () =>
        updateWorkspaceSettings({
          name,
          slug,
          timezone,
          locale: locale as "en-US" | "pt-BR" | "es-ES",
          currency: currency as "USD" | "BRL" | "EUR",
          logoUrl,
        }),
      "Workspace settings saved.",
    );
  return (
    <Panel
      title={general ? "General settings" : "Workspace identity"}
      description={
        canManage
          ? "Changes apply only to the active workspace."
          : "Your role has read-only access."
      }
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Workspace name">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!canManage}
          />
        </Field>
        {!general && (
          <Field label="Slug">
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={!canManage}
            />
          </Field>
        )}
        {!general && (
          <Field label="Logo URL" hint="HTTPS image URL">
            <Input
              value={logoUrl}
              onChange={(e) => setLogo(e.target.value)}
              disabled={!canManage}
            />
          </Field>
        )}
        <Field label="Timezone">
          <select
            className={selectClass}
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            disabled={!canManage}
          >
            {zones.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </Field>
        <Field label="Locale">
          <select
            className={selectClass}
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            disabled={!canManage}
          >
            <option value="en-US">English (US)</option>
            <option value="pt-BR">Português (Brasil)</option>
            <option value="es-ES">Español</option>
          </select>
        </Field>
        <Field label="Currency">
          <select
            className={selectClass}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            disabled={!canManage}
          >
            <option>USD</option>
            <option>BRL</option>
            <option>EUR</option>
          </select>
        </Field>
      </div>
      {canManage && (
        <Footer>
          <Button onClick={save} disabled={pending}>
            <Save className="size-4" />
            Save changes
          </Button>
        </Footer>
      )}
    </Panel>
  );
}
function ProfilePanel({
  data,
  pending,
  run,
}: {
  data: SettingsData;
  pending: boolean;
  run: Run;
}) {
  const [name, setName] = useState(
      data.profile.full_name || data.identity.name,
    ),
    [avatar, setAvatar] = useState(data.profile.avatar_url ?? ""),
    [email, setEmail] = useState(data.identity.email ?? ""),
    [password, setPassword] = useState("");
  return (
    <Panel
      title="Your profile"
      description="Personal information follows you across Nexus workspaces."
    >
      <div className="flex items-center gap-4 border-b pb-6">
        <Avatar initials={displayInitials(name)} avatarUrl={avatar} />
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">Profile preview</p>
        </div>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Field label="Full name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Avatar URL">
          <Input
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://…"
          />
        </Field>
        <Field label="Email" hint="May require email confirmation">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <div className="flex items-end">
          <Button
            variant="outline"
            disabled={pending || email === data.identity.email}
            onClick={() => run(() => updateEmail(email), "Confirmation sent.")}
          >
            Update email
          </Button>
        </div>
        <Field label="New password" hint="At least 10 characters">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <div className="flex items-end">
          <Button
            variant="outline"
            disabled={pending || password.length < 10}
            onClick={() =>
              run(() => updatePassword(password), "Password updated.")
            }
          >
            Update password
          </Button>
        </div>
      </div>
      <Footer>
        <Button
          disabled={pending}
          onClick={() =>
            run(
              () => updateProfile({ fullName: name, avatarUrl: avatar }),
              "Profile updated.",
            )
          }
        >
          <Save className="size-4" />
          Save profile
        </Button>
      </Footer>
    </Panel>
  );
}
function MembersPanel({
  data,
  canManage,
  pending,
  run,
}: {
  data: SettingsData;
  canManage: boolean;
  pending: boolean;
  run: Run;
}) {
  const [email, setEmail] = useState(""),
    [role, setRole] = useState("member"),
    [removeTarget, setRemoveTarget] = useState<
      SettingsData["members"][number] | null
    >(null);
  const assignableRoles =
    data.workspace.role === "owner"
      ? ["admin", "manager", "member", "viewer"]
      : ["manager", "member", "viewer"];
  return (
    <Panel
      title="Members"
      description={`${data.members.length} active member${data.members.length === 1 ? "" : "s"} in this workspace.`}
    >
      {canManage && (
        <div className="mb-6 grid gap-3 rounded-xl border bg-muted/30 p-4 sm:grid-cols-[1fr_150px_auto]">
          <Input
            type="email"
            placeholder="teammate@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select
            className={selectClass}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {assignableRoles.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <Button
            disabled={pending || !email}
            onClick={() =>
              run(
                () => inviteMember({ email, role }),
                "Pending invitation created.",
              )
            }
          >
            Invite member
          </Button>
          <p className="text-xs text-muted-foreground sm:col-span-3">
            Email delivery is not configured; Nexus records the pending
            invitation without pretending a message was sent.
          </p>
        </div>
      )}
      <div className="divide-y">
        {data.members.map((m) => (
          <div key={m.id} className="flex flex-wrap items-center gap-3 py-4">
            <Avatar initials={m.initials} avatarUrl={m.avatarUrl} />
            <div className="min-w-40 flex-1">
              <p className="font-medium">
                {m.name}
                {m.id === data.identity.id && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    You
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">Joined {m.joined}</p>
            </div>
            {m.role === "owner" ? (
              <Badge tone="blue">Owner</Badge>
            ) : (
              <select
                aria-label={`Role for ${m.name}`}
                className={`${selectClass} w-32 capitalize`}
                defaultValue={m.role}
                disabled={
                  !canManage ||
                  pending ||
                  (m.role === "admin" && data.workspace.role !== "owner")
                }
                onChange={(e) =>
                  run(
                    () => updateMemberRole(m.id, e.target.value),
                    "Role updated.",
                  )
                }
              >
                {assignableRoles.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            )}
            {canManage &&
              m.role !== "owner" &&
              (m.role !== "admin" || data.workspace.role === "owner") && (
                <Button
                  variant="ghost"
                  disabled={pending}
                  onClick={() => setRemoveTarget(m)}
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Remove {m.name}</span>
                </Button>
              )}
          </div>
        ))}
      </div>
      {data.invitations.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="text-sm font-semibold">Pending invitations</h3>
          {data.invitations.map((i) => (
            <div
              key={i.id}
              className="flex justify-between rounded-lg border p-3 text-sm"
            >
              <span>{i.email}</span>
              <Badge>{i.role}</Badge>
            </div>
          ))}
        </div>
      )}
      <AlertDialog.Root
        open={Boolean(removeTarget)}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null);
        }}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-2xl outline-none">
            <AlertDialog.Title className="text-lg font-semibold">
              Remove workspace member?
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
              {removeTarget?.name} will immediately lose access to this
              workspace. Their account and access to other workspaces will not
              be affected.
            </AlertDialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <AlertDialog.Cancel asChild>
                <Button variant="outline" disabled={pending}>
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button
                  variant="danger"
                  disabled={pending || !removeTarget}
                  onClick={() => {
                    if (!removeTarget) return;
                    const memberId = removeTarget.id;
                    setRemoveTarget(null);
                    run(() => removeMember(memberId), "Member removed.");
                  }}
                >
                  Remove member
                </Button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </Panel>
  );
}
function NotificationsPanel({
  data,
  pending,
  run,
}: {
  data: SettingsData;
  pending: boolean;
  run: Run;
}) {
  const [v, setV] = useState(data.preferences);
  const labels = {
    payment_failed: ["Payment failed", "A payment needs attention"],
    new_customer: ["New customer", "A customer joins"],
    subscription_canceled: [
      "Subscription canceled",
      "A subscription is canceled",
    ],
    weekly_report: ["Weekly report", "Workspace performance summary"],
    security_alert: ["Security alert", "Important access events"],
  } as const;
  return (
    <Panel
      title="Notifications"
      description="Choose which workspace events should notify you."
    >
      <div className="divide-y">
        {Object.entries(labels).map(([k, c]) => (
          <label
            key={k}
            className="flex cursor-pointer items-center gap-4 py-4"
          >
            <span className="flex-1">
              <b className="block text-sm">{c[0]}</b>
              <span className="text-xs text-muted-foreground">{c[1]}</span>
            </span>
            <input
              className="size-4 accent-[var(--primary)]"
              type="checkbox"
              checked={v[k as keyof typeof v]}
              onChange={(e) => setV({ ...v, [k]: e.target.checked })}
            />
          </label>
        ))}
      </div>
      <Footer>
        <Button
          disabled={pending}
          onClick={() =>
            run(() => updateNotificationPreferences(v), "Preferences saved.")
          }
        >
          <Save className="size-4" />
          Save preferences
        </Button>
      </Footer>
    </Panel>
  );
}
function SecurityPanel({
  data,
  pending,
  run,
}: {
  data: SettingsData;
  pending: boolean;
  run: Run;
}) {
  const [factor, setFactor] = useState(""),
    [secret, setSecret] = useState(""),
    [code, setCode] = useState("");
  const enroll = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const { data: d, error } = await createClient().auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Nexus",
    });
    if (error) throw error;
    setFactor(d.id);
    setSecret(d.totp.secret);
  };
  const verify = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const { error } = await createClient().auth.mfa.challengeAndVerify({
      factorId: factor,
      code,
    });
    if (error) throw error;
    setFactor("");
    setSecret("");
  };
  const others = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const { error } = await createClient().auth.signOut({ scope: "others" });
    if (error) throw error;
  };
  return (
    <Panel
      title="Security"
      description="Manage sessions and multi-factor authentication."
    >
      <div className="space-y-4">
        <Row
          title="Current session"
          text={
            "Signed in with " +
            data.identity.provider.replace(/^./, (letter) =>
              letter.toUpperCase(),
            ) +
            (data.identity.lastSignInAt
              ? " · Last login " +
                formatSecurityDate(data.identity.lastSignInAt)
              : "")
          }
        >
          <Badge tone="green">Verified</Badge>
        </Row>
        <Row
          title="Account created"
          text={formatSecurityDate(data.identity.createdAt)}
        >
          <Badge>{data.identity.email ?? "No email"}</Badge>
        </Row>
        <Row
          title="Password"
          text="Update your password from the Profile section."
        >
          <Badge>Profile</Badge>
        </Row>
        <Row title="Other sessions" text="Sign out every other active session.">
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => run(others, "Other sessions signed out.")}
          >
            Sign out others
          </Button>
        </Row>
        <Row
          title="Authenticator app"
          text={
            data.mfaEnabled
              ? "A verified TOTP factor protects your account."
              : "Add a TOTP authenticator as a second factor."
          }
        >
          {data.mfaEnabled ? (
            <Badge tone="green">
              <Check className="mr-1 size-3" />
              Enabled
            </Badge>
          ) : (
            <Button
              variant="outline"
              onClick={() => run(enroll, "Enrollment started.")}
            >
              Set up MFA
            </Button>
          )}
        </Row>
        {factor && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <p className="text-sm font-medium">
              Add this secret to your authenticator
            </p>
            <code className="mt-2 block break-all rounded bg-background p-2 text-xs">
              {secret}
            </code>
            <div className="mt-3 flex gap-2">
              <Input
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="6-digit code"
              />
              <Button onClick={() => run(verify, "MFA enabled.")}>
                Verify
              </Button>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}
function BillingPanel({ data }: { data: SettingsData }) {
  return (
    <Panel
      title="Billing"
      description="Plan and usage for the active workspace."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric
          label="Current plan"
          value={data.workspace.plan.name}
          help={`$${Number(data.workspace.plan.price_monthly).toFixed(0)} / month`}
        />
        <Metric
          label="Team usage"
          value={String(data.members.length)}
          help="active seats"
        />
        <Metric
          label="Customer usage"
          value={String(data.billing.customerCount)}
          help={`$${data.billing.monthlyRevenue.toLocaleString()} active MRR`}
        />
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/40 p-4">
        <p className="text-sm text-muted-foreground">
          No billing provider is connected, so invoices and real charges are
          unavailable. Workspace tier changes remain available internally.
        </p>
        <Link
          href="/subscriptions"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Manage plan
        </Link>
      </div>
    </Panel>
  );
}
function Integrations() {
  const items = [
    ["GitHub", "Not connected"],
    ["Slack", "Not connected"],
    ["Stripe", "Not connected"],
    ["Discord", "Coming soon"],
    ["Zapier", "Coming soon"],
    ["HubSpot", "Coming soon"],
  ];
  return (
    <Panel
      title="Integrations"
      description="Connect Nexus to your existing tools."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {items.map(([name, status]) => (
          <div
            key={name}
            className="flex items-center gap-3 rounded-xl border p-4"
          >
            <span className="grid size-10 place-items-center rounded-lg bg-muted font-semibold">
              {name[0]}
            </span>
            <div className="flex-1">
              <p className="font-medium">{name}</p>
              <Badge>{status}</Badge>
            </div>
            {status === "Not connected" && (
              <Button variant="outline" disabled>
                Connect
              </Button>
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        OAuth credentials are not configured; disabled controls do not simulate
        a connection.
      </p>
    </Panel>
  );
}
function Appearance({
  data,
  pending,
  run,
}: {
  data: SettingsData;
  pending: boolean;
  run: Run;
}) {
  const { theme, setTheme } = useTheme();
  const [locale, setLocale] = useState(data.profile.locale),
    [timezone, setTimezone] = useState(data.profile.timezone),
    [compact, setCompact] = useState(data.profile.compact_mode);
  return (
    <Panel title="Appearance" description="Personal interface preferences.">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Theme">
          <select
            className={selectClass}
            value={theme ?? "system"}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </Field>
        <Field label="Language">
          <select
            className={selectClass}
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
          >
            <option value="en-US">English</option>
            <option value="pt-BR">Português</option>
            <option value="es-ES">Español</option>
          </select>
        </Field>
        <Field label="Timezone">
          <select
            className={selectClass}
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            {zones.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </Field>
        <label className="flex items-center justify-between rounded-xl border p-4 text-sm">
          <span>
            <b className="block">Compact mode</b>
            <span className="text-xs text-muted-foreground">
              Reduce spacing in dense views
            </span>
          </span>
          <input
            type="checkbox"
            checked={compact}
            onChange={(e) => setCompact(e.target.checked)}
            className="size-4 accent-[var(--primary)]"
          />
        </label>
      </div>
      <Footer>
        <Button
          disabled={pending}
          onClick={() =>
            run(
              () =>
                updateAppearance({ locale, timezone, compactMode: compact }),
              "Appearance saved.",
            )
          }
        >
          <Save className="size-4" />
          Save preferences
        </Button>
      </Footer>
    </Panel>
  );
}
function Danger({
  data,
  isOwner,
  pending,
  run,
}: {
  data: SettingsData;
  isOwner: boolean;
  pending: boolean;
  run: Run;
}) {
  const [confirm, setConfirm] = useState(""),
    [owner, setOwner] = useState(""),
    [transferOpen, setTransferOpen] = useState(false);
  const candidates = data.members.filter((m) => m.role !== "owner");
  const targetOwner = candidates.find((member) => member.id === owner);
  return (
    <Panel
      title="Danger zone"
      description="Sensitive operations require explicit confirmation."
    >
      <div className="space-y-4">
        <Row
          title="Export workspace data"
          text="Download workspace records as JSON."
        >
          <a
            href="/api/workspace/export"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Download className="size-4" />
            Export data
          </a>
        </Row>
        <Row
          title="Transfer ownership"
          text="The selected member becomes owner; you become admin."
        >
          <div className="flex gap-2">
            <select
              className={`${selectClass} min-w-44`}
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              disabled={!isOwner}
            >
              <option value="">Select member</option>
              {candidates.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              disabled={!isOwner || !owner || pending}
              onClick={() => setTransferOpen(true)}
            >
              Transfer
            </Button>
          </div>
        </Row>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
          <h3 className="font-semibold text-destructive">Delete workspace</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Type <b>{data.workspace.name}</b> to permanently delete all
            workspace data.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={!isOwner}
            />
            <Button
              variant="danger"
              disabled={!isOwner || pending || confirm !== data.workspace.name}
              onClick={() =>
                run(() => deleteWorkspace(confirm), "Workspace deleted.")
              }
            >
              <Trash2 className="size-4" />
              Delete forever
            </Button>
          </div>
        </div>
      </div>
      <AlertDialog.Root open={transferOpen} onOpenChange={setTransferOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-2xl outline-none">
            <AlertDialog.Title className="text-lg font-semibold">
              Transfer workspace ownership?
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
              {targetOwner?.name ?? "The selected member"} will become the owner
              of {data.workspace.name}. Your role will change to admin, and only
              the new owner can reverse this operation.
            </AlertDialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <AlertDialog.Cancel asChild>
                <Button variant="outline" disabled={pending}>
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button
                  variant="danger"
                  disabled={pending || !owner}
                  onClick={() => {
                    setTransferOpen(false);
                    run(
                      () => transferOwnership(owner),
                      "Ownership transferred.",
                    );
                  }}
                >
                  Confirm transfer
                </Button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </Panel>
  );
}
function Row({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-5">
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      </div>
      {children}
    </div>
  );
}
function Metric({
  label,
  value,
  help,
}: {
  label: string;
  value: string;
  help: string;
}) {
  return (
    <div className="rounded-xl border p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="text-sm text-muted-foreground">{help}</p>
    </div>
  );
}
function Footer({ children }: { children: React.ReactNode }) {
  return <div className="mt-7 flex justify-end border-t pt-5">{children}</div>;
}
function ComingSoon({
  title,
  text,
  icon: Icon,
}: {
  title: string;
  text: string;
  icon: typeof KeyRound;
}) {
  return (
    <Panel
      title={title}
      description="Secure infrastructure before surface area."
    >
      <div className="grid min-h-64 place-items-center rounded-xl border border-dashed p-8 text-center">
        <div>
          <span className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon />
          </span>
          <h3 className="mt-4 font-semibold">Coming soon</h3>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">{text}</p>
        </div>
      </div>
    </Panel>
  );
}
