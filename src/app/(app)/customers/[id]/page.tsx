import Link from "next/link";
import { notFound } from "next/navigation";
import { Activity, ArrowLeft, CalendarDays, Mail } from "lucide-react";
import { Avatar, Badge, Card } from "@/components/ui";
import { PageHead, SectionTitle } from "@/components/page-kit";
import { getCustomerDetails } from "@/lib/queries";

export default async function Customer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const details = await getCustomerDetails(id);
  if (!details) notFound();
  const { customer, transactions, lastPayment, subscription, activities } =
    details;
  const healthColor =
    customer.healthScore >= 75
      ? "bg-emerald-500"
      : customer.healthScore >= 50
        ? "bg-amber-500"
        : "bg-red-500";
  return (
    <>
      <Link
        href="/customers"
        className="mb-4 flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to customers
      </Link>
      <PageHead
        title={customer.name}
        description={customer.company + " · Customer since " + customer.joined}
        action={
          <a
            href={"mailto:" + customer.email}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-muted"
          >
            <Mail className="size-4" />
            Email customer
          </a>
        }
      />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <Avatar initials={customer.initials} />
              <div>
                <h2 className="font-semibold">{customer.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {customer.email}
                </p>
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-5 text-sm">
              <Info label="Company">{customer.company}</Info>
              <Info label="Plan">{customer.plan}</Info>
              <Info label="Status">
                <Badge
                  tone={
                    customer.status === "Active"
                      ? "green"
                      : customer.status === "Trial"
                        ? "blue"
                        : "red"
                  }
                >
                  {customer.status}
                </Badge>
              </Info>
              <Info label="Monthly revenue">
                ${customer.mrr.toLocaleString()}
              </Info>
            </dl>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Customer health</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Based on status, MRR and recent activity
                </p>
              </div>
              <span className="text-2xl font-semibold">
                {customer.healthScore}
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={"h-full rounded-full " + healthColor}
                style={{ width: customer.healthScore + "%" }}
              />
            </div>
            <p className="mt-3 text-sm font-medium">{customer.healthLabel}</p>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold">Internal notes</h2>
            <textarea
              className="mt-3 min-h-28 w-full resize-none rounded-lg border bg-background p-3 text-sm outline-none"
              placeholder="No notes have been added for this customer."
              disabled
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Coming soon — no notes are stored until persistent note storage is
              configured.
            </p>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <SectionTitle
              title="Account overview"
              description="Current relationship and subscription state"
            />
            <dl className="grid gap-5 p-5 text-sm sm:grid-cols-2">
              <Info label="Joined">{customer.joined}</Info>
              <Info label="Last seen">{customer.activity}</Info>
              <Info label="Last payment">
                {lastPayment
                  ? "$" +
                    lastPayment.value.toLocaleString() +
                    " · " +
                    lastPayment.date
                  : "No payments yet"}
              </Info>
              <Info label="Subscription">
                {subscription
                  ? subscription.plan + " · " + subscription.status
                  : "No active subscription"}
              </Info>
              {subscription && (
                <Info label="Current period ends">
                  {subscription.currentPeriodEnd}
                </Info>
              )}
            </dl>
          </Card>
          <Card>
            <SectionTitle
              title="Recent activity"
              description="Latest customer events in this workspace"
            />
            {activities.length ? (
              <div className="divide-y divide-border">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3 p-5">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10">
                      <Activity className="size-4 text-primary" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{activity.kind}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {activity.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                icon={<Activity className="size-5" />}
                text="No activity has been recorded for this customer yet."
              />
            )}
          </Card>
          <Card>
            <SectionTitle
              title="Payment history"
              description="Latest subscription transactions"
            />
            {transactions.length ? (
              <div className="divide-y divide-border">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-4 p-5"
                  >
                    <div>
                      <p className="font-mono text-sm font-medium">
                        {transaction.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.date} · {transaction.method}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-medium">
                        ${transaction.value.toLocaleString()}
                      </p>
                      <Badge
                        tone={
                          transaction.status === "Approved"
                            ? "green"
                            : transaction.status === "Failed"
                              ? "red"
                              : "amber"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                icon={<CalendarDays className="size-5" />}
                text="No payment transactions are available yet."
              />
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

function Info({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{children}</dd>
    </div>
  );
}
function Empty({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="grid min-h-36 place-items-center p-5 text-center text-muted-foreground">
      <div>
        <span className="mx-auto grid size-10 place-items-center rounded-xl bg-muted">
          {icon}
        </span>
        <p className="mt-3 text-sm">{text}</p>
      </div>
    </div>
  );
}
