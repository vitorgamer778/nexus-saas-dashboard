import { Download } from "lucide-react";
import { TransactionsTable } from "@/components/transactions-table";
import { PageHead, Metric } from "@/components/page-kit";
import { getTransactions } from "@/lib/queries";

export default async function Transactions() {
  const transactions = await getTransactions();
  const approved = transactions.filter((item) => item.status === "Approved");
  const gross = approved.reduce((total, item) => total + item.value, 0);
  const refunded = transactions
    .filter((item) => item.status === "Refunded")
    .reduce((total, item) => total + item.value, 0);
  const successRate = transactions.length
    ? Math.round((approved.length / transactions.length) * 100)
    : 0;
  return (
    <>
      <PageHead
        title="Transactions"
        description="Track payments, refunds and failed charges."
        action={
          <a
            href="/api/transactions/export"
            download
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Download className="size-4" />
            Export CSV
          </a>
        }
      />
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Metric
          label="Gross volume"
          value={"$" + gross.toLocaleString()}
          change="Live"
        />
        <Metric label="Successful" value={successRate + "%"} change="Live" />
        <Metric
          label="Refunded"
          value={"$" + refunded.toLocaleString()}
          change="Live"
          down
        />
      </div>
      <TransactionsTable transactions={transactions} />
    </>
  );
}
