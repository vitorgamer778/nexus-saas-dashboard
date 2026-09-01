import { cn } from "@/lib/utils";
export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "nexus-surface rounded-2xl border border-border/80 bg-card text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}
export function Button({
  className,
  variant = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "danger";
}) {
  return (
    <button
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium shadow-sm transition-[transform,color,background-color,border-color,box-shadow] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
        variant === "default" &&
          "bg-primary text-primary-foreground shadow-primary/15 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20",
        variant === "outline" &&
          "border border-border bg-background hover:bg-muted",
        variant === "ghost" && "hover:bg-muted",
        variant === "danger" &&
          "bg-destructive text-white hover:bg-destructive/90",
        className,
      )}
      {...props}
    />
  );
}
export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "amber" | "red" | "blue";
}) {
  const tones = {
    neutral: "bg-muted text-muted-foreground",
    green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    red: "bg-red-500/10 text-red-600 dark:text-red-400",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-current/10 px-2 py-1 text-[11px] font-semibold tracking-[.01em]",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
export function Avatar({
  initials,
  avatarUrl,
}: {
  initials: string;
  avatarUrl?: string | null;
}) {
  return (
    <span
      className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 bg-cover bg-center text-xs font-semibold text-primary"
      style={
        avatarUrl
          ? { backgroundImage: `url(${JSON.stringify(avatarUrl)})` }
          : undefined
      }
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="h-10 w-full rounded-lg border border-border/90 bg-background px-3 text-sm shadow-[0_1px_0_rgb(255_255_255/.04)_inset] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/75 hover:border-foreground/20 focus:border-primary/45 focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
    />
  );
}
