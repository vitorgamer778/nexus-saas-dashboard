import { Card } from "@/components/ui";

export default function SettingsLoading() {
  return (
    <div aria-label="Loading settings">
      <div className="mb-7 h-20 animate-pulse rounded-2xl bg-muted" />
      <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
        <Card className="h-96 animate-pulse bg-muted/50" />
        <Card className="h-[34rem] animate-pulse bg-muted/40" />
      </div>
    </div>
  );
}
