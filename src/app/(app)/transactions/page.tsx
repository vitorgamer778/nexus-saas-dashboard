import { transactions } from "@/lib/data";
import { Badge, Card, Input } from "@/components/ui";
import { PageHead, Metric } from "@/components/page-kit";
import { Search } from "lucide-react";
export default function Transactions() {
  return (
    <>
      <PageHead
        title="Transactions"
        description="Track payments, refunds and failed charges."
      />
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Metric label="Gross volume" value="$84,290" change="9.3%" />
        <Metric label="Successful" value="98.4%" change="1.2%" />
        <Metric label="Refunded" value="$2,840" change="0.8%" down />
      </div>
      <Card className="overflow-hidden">
        <div className="border-b p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search transaction ID or customer…"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                {[
                  "Transaction",
                  "Customer",
                  "Method",
                  "Status",
                  "Date",
                  "Amount",
                ].map((x) => (
                  <th key={x} className="px-5 py-3 font-medium last:text-right">
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="px-5 py-4 font-mono text-xs">{t.id}</td>
                  <td className="px-5 font-medium">{t.customer}</td>
                  <td className="px-5 text-muted-foreground">{t.method}</td>
                  <td className="px-5">
                    <Badge
                      tone={
                        t.status === "Approved"
                          ? "green"
                          : t.status === "Failed"
                            ? "red"
                            : t.status === "Pending"
                              ? "amber"
                              : "blue"
                      }
                    >
                      {t.status}
                    </Badge>
                  </td>
                  <td className="px-5 text-muted-foreground">{t.date}</td>
                  <td className="px-5 text-right font-mono font-medium">
                    ${t.value.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
