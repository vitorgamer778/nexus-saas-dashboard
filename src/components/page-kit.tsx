import { ArrowDownRight, ArrowUpRight, Download, Filter } from "lucide-react";
import { Button, Card } from "./ui";
export function PageHead({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-end">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[.18em] text-primary">
          Nexus workspace
        </p>
        <h1 className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-2xl font-semibold tracking-[-0.035em] text-transparent sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex gap-2">
        {action ?? (
          <>
            <Button variant="outline">
              <Download className="size-4" />
              Export
            </Button>
            <Button variant="outline">
              <Filter className="size-4" />
              Filters
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
export function Metric({
  label,
  value,
  change,
  down = false,
  detail,
}: {
  label: string;
  value: string;
  change: string;
  down?: boolean;
  detail?: string;
}) {
  return (
    <Card className="group relative animate-rise overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_16px_50px_-28px_var(--primary)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span
          className={`flex items-center text-xs font-medium ${down ? "text-red-500" : "text-emerald-500"}`}
        >
          {down ? (
            <ArrowDownRight className="size-3.5" />
          ) : (
            <ArrowUpRight className="size-3.5" />
          )}
          {change}
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {detail ?? "vs. previous period"}
          </p>
        </div>
        <div className="flex h-8 items-end gap-1" aria-hidden="true">
          {[34, 48, 42, 68, 58, 82, 76].map((height, index) => (
            <span
              key={index}
              className={
                down
                  ? "w-1 rounded-full bg-red-500/50"
                  : "w-1 rounded-full bg-primary/55"
              }
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
export function SectionTitle({
  title,
  description,
  aside,
}: {
  title: string;
  description?: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border px-5 py-4">
      <div>
        <h2 className="font-semibold">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {aside}
    </div>
  );
}
