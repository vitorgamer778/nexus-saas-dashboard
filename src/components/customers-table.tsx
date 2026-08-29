"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Dialog } from "radix-ui";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  SlidersHorizontal,
  UserRoundX,
  X,
} from "lucide-react";
import type { CustomerView } from "@/lib/queries";
import { Avatar, Badge, Button, Card, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

type SortKey = "name" | "status" | "plan" | "mrr" | "healthScore" | "createdAt";
type Direction = "asc" | "desc";
type QuickView = {
  customer: CustomerView;
  lastPayment: {
    id: string;
    value: number;
    method: string;
    status: string;
    date: string;
  } | null;
  subscription: {
    id: string;
    status: string;
    amount: number;
    plan: string;
    currentPeriodEnd: string;
  } | null;
  activities: { id: string; kind: string; date: string }[];
};

const pageSize = 8;
const selectClass =
  "h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

function statusTone(status: string): "green" | "blue" | "red" | "amber" {
  if (status === "Active") return "green";
  if (status === "Trial") return "blue";
  if (status === "Canceled") return "red";
  return "amber";
}

function Health({ score, label }: { score: number; label: string }) {
  const color =
    score >= 75
      ? "bg-emerald-500"
      : score >= 50
        ? "bg-amber-500"
        : "bg-red-500";
  return (
    <div className="min-w-28">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{score}</span>
        <span className="text-muted-foreground">{label}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", color)}
          style={{ width: score + "%" }}
        />
      </div>
    </div>
  );
}

export function CustomersTable({ customers }: { customers: CustomerView[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [plan, setPlan] = useState("all");
  const [sort, setSort] = useState<SortKey>("createdAt");
  const [direction, setDirection] = useState<Direction>("desc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<CustomerView | null>(null);

  const statuses = useMemo(
    () => [...new Set(customers.map((item) => item.status))].sort(),
    [customers],
  );
  const plans = useMemo(
    () => [...new Set(customers.map((item) => item.plan))].sort(),
    [customers],
  );
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return customers
      .filter((item) => status === "all" || item.status === status)
      .filter((item) => plan === "all" || item.plan === plan)
      .filter(
        (item) =>
          !needle ||
          [item.name, item.email, item.company].some((value) =>
            value.toLowerCase().includes(needle),
          ),
      )
      .toSorted((a, b) => {
        const left = a[sort];
        const right = b[sort];
        const result =
          typeof left === "number"
            ? left - Number(right)
            : String(left).localeCompare(String(right));
        return direction === "asc" ? result : -result;
      });
  }, [customers, direction, plan, query, sort, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function changeSort(key: SortKey) {
    if (sort === key)
      setDirection((value) => (value === "asc" ? "desc" : "asc"));
    else {
      setSort(key);
      setDirection("asc");
    }
  }

  return (
    <>
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search name, email or company..."
              className="pl-9"
              aria-label="Search customers"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <SlidersHorizontal className="size-4" /> Filters
            </span>
            <select
              className={selectClass}
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              {statuses.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
            <select
              className={selectClass}
              value={plan}
              onChange={(event) => {
                setPlan(event.target.value);
                setPage(1);
              }}
              aria-label="Filter by plan"
            >
              <option value="all">All plans</option>
              {plans.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
        </div>
        {customers.length === 0 ? (
          <Empty
            icon={UserRoundX}
            title="No customers yet"
            description="Customers will appear here after they are created in this workspace."
          />
        ) : visible.length === 0 ? (
          <Empty
            icon={Search}
            title="No matching customers"
            description="Try another search or clear the selected filters."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setStatus("all");
                  setPlan("all");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <Head
                    label="Customer"
                    field="name"
                    active={sort}
                    direction={direction}
                    onSort={changeSort}
                  />
                  <Head
                    label="Status"
                    field="status"
                    active={sort}
                    direction={direction}
                    onSort={changeSort}
                  />
                  <Head
                    label="Plan"
                    field="plan"
                    active={sort}
                    direction={direction}
                    onSort={changeSort}
                  />
                  <Head
                    label="MRR"
                    field="mrr"
                    active={sort}
                    direction={direction}
                    onSort={changeSort}
                  />
                  <Head
                    label="Health"
                    field="healthScore"
                    active={sort}
                    direction={direction}
                    onSort={changeSort}
                  />
                  <Head
                    label="Last activity"
                    field="createdAt"
                    active={sort}
                    direction={direction}
                    onSort={changeSort}
                  />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visible.map((customer) => (
                  <tr
                    key={customer.id}
                    tabIndex={0}
                    className="cursor-pointer transition-colors hover:bg-muted/35 focus-visible:bg-muted/50 focus-visible:outline-none"
                    onClick={() => setSelected(customer)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelected(customer);
                      }
                    }}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar initials={customer.initials} />
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {customer.company} · {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge tone={statusTone(customer.status)}>
                        {customer.status}
                      </Badge>
                    </td>
                    <td className="p-4">{customer.plan}</td>
                    <td className="p-4 font-mono font-medium">
                      ${customer.mrr.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <Health
                        score={customer.healthScore}
                        label={customer.healthLabel}
                      />
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {customer.activity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex flex-col gap-3 border-t border-border px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground">
            {filtered.length === 0
              ? "0 results"
              : "Showing " +
                ((currentPage - 1) * pageSize + 1) +
                "–" +
                Math.min(currentPage * pageSize, filtered.length) +
                " of " +
                filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => value - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-20 text-center">
              Page {currentPage} of {pages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === pages}
              onClick={() => setPage((value) => value + 1)}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </Card>
      <CustomerDrawer customer={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function Head({
  label,
  field,
  active,
  direction,
  onSort,
}: {
  label: string;
  field: SortKey;
  active: SortKey;
  direction: Direction;
  onSort: (field: SortKey) => void;
}) {
  const Icon =
    active !== field ? ArrowUpDown : direction === "asc" ? ArrowUp : ArrowDown;
  return (
    <th className="px-4 py-3 font-medium">
      <button
        className="inline-flex items-center gap-1.5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => onSort(field)}
      >
        {label}
        <Icon className="size-3.5" />
      </button>
    </th>
  );
}

function Empty({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof Search;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-72 place-items-center p-8 text-center">
      <div>
        <span className="mx-auto grid size-11 place-items-center rounded-xl bg-muted">
          <Icon className="size-5 text-muted-foreground" />
        </span>
        <h3 className="mt-4 font-semibold">{title}</h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}

function CustomerDrawer({
  customer,
  onClose,
}: {
  customer: CustomerView | null;
  onClose: () => void;
}) {
  const [data, setData] = useState<QuickView | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!customer) return;
    const controller = new AbortController();
    fetch("/api/customers/" + customer.id + "/quick-view", {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Request failed");
        return response.json();
      })
      .then(setData)
      .catch((reason) => {
        if (reason.name !== "AbortError") setError(true);
      });
    return () => controller.abort();
  }, [customer]);
  if (!customer) return null;
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l border-border bg-background p-6 shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar initials={customer.initials} />
              <div>
                <Dialog.Title className="font-semibold">
                  {customer.name}
                </Dialog.Title>
                <Dialog.Description className="text-sm text-muted-foreground">
                  {customer.company}
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" aria-label="Close quick view">
                <X className="size-4" />
              </Button>
            </Dialog.Close>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-4 rounded-xl border border-border p-4 text-sm">
            <Info label="Status">
              <Badge tone={statusTone(customer.status)}>
                {customer.status}
              </Badge>
            </Info>
            <Info label="Plan">{customer.plan}</Info>
            <Info label="MRR">${customer.mrr.toLocaleString()}</Info>
            <Info label="Health">
              <Health
                score={customer.healthScore}
                label={customer.healthLabel}
              />
            </Info>
          </div>
          {error ? (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm">
              <p className="font-medium text-red-600 dark:text-red-400">
                Could not load customer details
              </p>
              <p className="mt-1 text-muted-foreground">
                Close this panel and try again.
              </p>
            </div>
          ) : !data ? (
            <DrawerSkeleton />
          ) : (
            <div className="mt-6 space-y-6">
              <section>
                <h3 className="text-sm font-semibold">Account overview</h3>
                <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <Info label="Last payment">
                    {data.lastPayment
                      ? "$" +
                        data.lastPayment.value.toLocaleString() +
                        " · " +
                        data.lastPayment.date
                      : "No payments"}
                  </Info>
                  <Info label="Subscription">
                    {data.subscription
                      ? data.subscription.status +
                        " · " +
                        data.subscription.currentPeriodEnd
                      : "No subscription"}
                  </Info>
                  <Info label="Joined">{customer.joined}</Info>
                  <Info label="Last seen">{customer.activity}</Info>
                </dl>
              </section>
              <section>
                <h3 className="text-sm font-semibold">Recent activity</h3>
                {data.activities.length ? (
                  <div className="mt-3 space-y-3">
                    {data.activities.map((activity) => (
                      <div key={activity.id} className="flex gap-3 text-sm">
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                        <div>
                          <p>{activity.kind}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                    No activity recorded yet.
                  </p>
                )}
              </section>
            </div>
          )}
          <Link
            href={"/customers/" + customer.id}
            className="mt-7 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Open full profile
            <ExternalLink className="size-4" />
          </Link>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
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
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{children}</dd>
    </div>
  );
}
function DrawerSkeleton() {
  return (
    <div className="mt-6 space-y-4" aria-label="Loading customer details">
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-12 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
      <div className="h-4 w-28 animate-pulse rounded bg-muted" />
      <div className="h-24 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}
