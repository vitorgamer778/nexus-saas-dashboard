import { cn } from "@/lib/utils";

export function NexusMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_6px_18px_color-mix(in_srgb,var(--primary)_24%,transparent)]",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" className="size-6" fill="none">
        <path
          d="M8 23V9l16 14V9"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="8" cy="8" r="2.2" fill="currentColor" />
        <circle cx="24" cy="8" r="2.2" fill="currentColor" />
        <circle cx="8" cy="24" r="2.2" fill="currentColor" />
        <circle cx="24" cy="24" r="2.2" fill="currentColor" />
      </svg>
    </span>
  );
}
