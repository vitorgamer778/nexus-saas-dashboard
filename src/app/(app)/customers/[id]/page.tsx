import { getCustomer, getCustomerTransactions } from "@/lib/queries";
import { notFound } from "next/navigation";
import { Avatar, Badge, Button, Card } from "@/components/ui";
import { PageHead, SectionTitle } from "@/components/page-kit";
import { ArrowLeft, Mail, MoreHorizontal } from "lucide-react";
import Link from "next/link";
export default async function Customer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [c, transactions] = await Promise.all([
    getCustomer(id),
    getCustomerTransactions(id),
  ]);
  if (!c) notFound();
  return (
    <>
      <Link
        href="/customers"
        className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to customers
      </Link>
      <PageHead
        title={c.name}
        description={`${c.company} · Customer since ${c.joined}`}
        action={
          <>
            <Button variant="outline">
              <Mail className="size-4" />
              Email
            </Button>
            <Button variant="outline">
              <MoreHorizontal className="size-4" />
            </Button>
          </>
        }
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <Avatar initials={c.initials} />
              <div>
                <h2 className="font-semibold">{c.name}</h2>
                <p className="text-sm text-muted-foreground">{c.email}</p>
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-5 text-sm">
              {[
                ["Company", c.company],
                ["Plan", c.plan],
                ["Status", c.status],
                ["Monthly revenue", `$${c.mrr}`],
              ].map((x) => (
                <div key={x[0]}>
                  <dt className="text-muted-foreground">{x[0]}</dt>
                  <dd className="mt-1 font-medium">{x[1]}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold">Internal notes</h2>
            <textarea
              className="mt-3 min-h-28 w-full resize-none rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              defaultValue="Strong product adoption. Interested in annual Business plan at next renewal."
            />
            <Button className="mt-2">Save note</Button>
          </Card>
        </div>
        <Card className="overflow-hidden">
          <SectionTitle
            title="Payment history"
            description="Latest subscription transactions"
          />
          <div className="divide-y">
            {transactions.slice(0, 4).map((t) => (
              <div key={t.id} className="flex items-center justify-between p-5">
                <div>
                  <p className="font-medium">{t.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.date} · {t.method}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-medium">${t.value}</p>
                  <Badge
                    tone={
                      t.status === "Approved"
                        ? "green"
                        : t.status === "Failed"
                          ? "red"
                          : "amber"
                    }
                  >
                    {t.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
