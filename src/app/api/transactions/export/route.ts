import { getTransactions } from "@/lib/queries";
import { getCurrentWorkspace } from "@/lib/workspace";
import { createCsv } from "@/lib/csv";

export async function GET() {
  const workspace = await getCurrentWorkspace();
  if (!workspace)
    return Response.json({ error: "Authentication required" }, { status: 401 });
  const transactions = await getTransactions();
  const rows = [
    [
      "Transaction ID",
      "Customer",
      "Customer email",
      "Status",
      "Payment method",
      "Amount",
      "Processed at",
    ],
    ...transactions.map((item) => [
      item.id,
      item.customer,
      item.customerEmail ?? "",
      item.status,
      item.method,
      item.value.toFixed(2),
      item.processedAt,
    ]),
  ];
  const csv = createCsv(rows);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="nexus-transactions.csv"',
      "Cache-Control": "private, no-store",
    },
  });
}
