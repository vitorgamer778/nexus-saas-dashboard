"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Dialog } from "radix-ui";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { TransactionView } from "@/lib/queries";
import { Badge, Button, Card, Input } from "@/components/ui";

const pageSize = 10;
const selectClass =
  "h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

function tone(status: string): "green" | "amber" | "red" | "blue" {
  if (status === "Approved") return "green";
  if (status === "Pending") return "amber";
  if (status === "Failed") return "red";
  return "blue";
}

export function TransactionsTable({
  transactions,
}: {
  transactions: TransactionView[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");
  const [customer, setCustomer] = useState("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<TransactionView | null>(null);
  const methods = useMemo(
    () => [...new Set(transactions.map((item) => item.method))].sort(),
    [transactions],
  );
  const customers = useMemo(
    () =>
      [
        ...new Map(
          transactions
            .filter((item) => item.customerId)
            .map((item) => [item.customerId, item.customer]),
        ).entries(),
      ].sort((a, b) => a[1].localeCompare(b[1])),
    [transactions],
  );
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const min = minAmount === "" ? null : Number(minAmount);
    const max = maxAmount === "" ? null : Number(maxAmount);
    const fromTime = from ? new Date(from + "T00:00:00").getTime() : null;
    const toTime = to ? new Date(to + "T23:59:59.999").getTime() : null;
    return transactions.filter((item) => {
      const time = new Date(item.processedAt).getTime();
      return (
        (!needle ||
          [
            item.id,
            item.shortId,
            item.customer,
            item.customerName,
            item.customerEmail ?? "",
          ].some((value) => value.toLowerCase().includes(needle))) &&
        (status === "all" || item.status === status) &&
        (method === "all" || item.method === method) &&
        (customer === "all" || item.customerId === customer) &&
        (min === null || item.value >= min) &&
        (max === null || item.value <= max) &&
        (fromTime === null || time >= fromTime) &&
        (toTime === null || time <= toTime)
      );
    });
  }, [
    customer,
    from,
    maxAmount,
    method,
    minAmount,
    query,
    status,
    to,
    transactions,
  ]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const resetPage = () => setPage(1);
  const clear = () => {
    setQuery("");
    setStatus("all");
    setMethod("all");
    setCustomer("all");
    setMinAmount("");
    setMaxAmount("");
    setFrom("");
    setTo("");
    setPage(1);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className="space-y-3 border-b border-border p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  resetPage();
                }}
                placeholder="Search ID, customer or email…"
                aria-label="Search transactions"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                className={selectClass}
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  resetPage();
                }}
                aria-label="Filter by status"
              >
                <option value="all">All statuses</option>
                {["Approved", "Pending", "Failed", "Refunded"].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
              <select
                className={selectClass}
                value={method}
                onChange={(event) => {
                  setMethod(event.target.value);
                  resetPage();
                }}
                aria-label="Filter by payment method"
              >
                <option value="all">All methods</option>
                {methods.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
              <select
                className={selectClass}
                value={customer}
                onChange={(event) => {
                  setCustomer(event.target.value);
                  resetPage();
                }}
                aria-label="Filter by customer"
              >
                <option value="all">All customers</option>
                {customers.map(([id, name]) => (
                  <option key={id ?? "unknown"} value={id ?? ""}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <details>
            <summary className="flex w-fit cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground">
              <SlidersHorizontal className="size-4" />
              Amount and date filters
            </summary>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={minAmount}
                onChange={(event) => {
                  setMinAmount(event.target.value);
                  resetPage();
                }}
                placeholder="Minimum amount"
                aria-label="Minimum amount"
              />
              <Input
                type="number"
                min="0"
                step="0.01"
                value={maxAmount}
                onChange={(event) => {
                  setMaxAmount(event.target.value);
                  resetPage();
                }}
                placeholder="Maximum amount"
                aria-label="Maximum amount"
              />
              <label className="text-xs text-muted-foreground">
                From
                <Input
                  className="mt-1"
                  type="date"
                  value={from}
                  onChange={(event) => {
                    setFrom(event.target.value);
                    resetPage();
                  }}
                />
              </label>
              <label className="text-xs text-muted-foreground">
                To
                <Input
                  className="mt-1"
                  type="date"
                  value={to}
                  onChange={(event) => {
                    setTo(event.target.value);
                    resetPage();
                  }}
                />
              </label>
            </div>
          </details>
        </div>
        {transactions.length === 0 ? (
          <Empty
            title="No transactions yet"
            description="Payments will appear here after they are processed in this workspace."
          />
        ) : visible.length === 0 ? (
          <Empty
            title="No matching transactions"
            description="Try changing or clearing the current filters."
            action={
              <Button variant="outline" onClick={clear}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  {[
                    "Transaction",
                    "Customer",
                    "Method",
                    "Status",
                    "Date",
                    "Amount",
                  ].map((label) => (
                    <th
                      key={label}
                      className="px-5 py-3 font-medium last:text-right"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visible.map((item) => (
                  <tr
                    key={item.id}
                    tabIndex={0}
                    onClick={() => setSelected(item)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelected(item);
                      }
                    }}
                    className="cursor-pointer transition-colors hover:bg-muted/35 focus-visible:bg-muted/50 focus-visible:outline-none"
                  >
                    <td className="px-5 py-4 font-mono text-xs">
                      {item.shortId}
                    </td>
                    <td className="px-5">
                      <p className="font-medium">{item.customer}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.customerName}
                      </p>
                    </td>
                    <td className="px-5 text-muted-foreground">
                      {item.method}
                    </td>
                    <td className="px-5">
                      <Badge tone={tone(item.status)}>{item.status}</Badge>
                    </td>
                    <td className="px-5 text-muted-foreground">{item.date}</td>
                    <td className="px-5 text-right font-mono font-medium">
                      ${item.value.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex flex-col gap-3 border-t border-border px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground">
            {filtered.length
              ? "Showing " +
                ((currentPage - 1) * pageSize + 1) +
                "–" +
                Math.min(currentPage * pageSize, filtered.length) +
                " of " +
                filtered.length
              : "0 results"}
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
      <TransactionDrawer
        transaction={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}

function Empty({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-72 place-items-center p-8 text-center">
      <div>
        <span className="mx-auto grid size-11 place-items-center rounded-xl bg-muted">
          <CreditCard className="size-5 text-muted-foreground" />
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

function TransactionDrawer({
  transaction,
  onClose,
}: {
  transaction: TransactionView | null;
  onClose: () => void;
}) {
  if (!transaction) return null;
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l border-border bg-background p-6 shadow-2xl outline-none">
          <div className="flex items-start justify-between">
            <div>
              <Dialog.Title className="text-lg font-semibold">
                Transaction details
              </Dialog.Title>
              <Dialog.Description className="mt-1 font-mono text-xs text-muted-foreground">
                {transaction.id}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" aria-label="Close transaction details">
                <X className="size-4" />
              </Button>
            </Dialog.Close>
          </div>
          <div className="mt-6 rounded-2xl border border-border p-5 text-center">
            <Badge tone={tone(transaction.status)}>{transaction.status}</Badge>
            <p className="mt-3 text-3xl font-semibold">
              ${transaction.value.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {transaction.method} · {transaction.date}
            </p>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-5 text-sm">
            <Info label="Customer">{transaction.customer}</Info>
            <Info label="Contact">{transaction.customerName}</Info>
            <Info label="Email">
              {transaction.customerEmail ?? "Not available"}
            </Info>
            <Info label="Processed at">
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(transaction.processedAt))}
            </Info>
            <Info label="Payment method">{transaction.method}</Info>
            <Info label="Status">
              <Badge tone={tone(transaction.status)}>
                {transaction.status}
              </Badge>
            </Info>
          </dl>
          {transaction.customerId && (
            <Link
              href={"/customers/" + transaction.customerId}
              className="mt-7 inline-flex h-10 w-full items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-muted"
            >
              Open customer profile
            </Link>
          )}
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
      <dd className="mt-1 break-words font-medium">{children}</dd>
    </div>
  );
}
