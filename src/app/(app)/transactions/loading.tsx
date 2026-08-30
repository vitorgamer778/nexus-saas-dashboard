import { Card } from "@/components/ui";
export default function TransactionsLoading() {
  return (
    <div aria-label="Loading transactions">
      <div className="mb-7 h-20 animate-pulse rounded-2xl bg-muted" />
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="h-32 animate-pulse bg-muted/60" />
        ))}
      </div>
      <Card className="overflow-hidden">
        <div className="h-24 animate-pulse border-b border-border bg-muted/50" />
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="h-16 animate-pulse border-b border-border bg-muted/30"
          />
        ))}
      </Card>
    </div>
  );
}
