export function AppShellLoading() {
  return (
    <div className="min-h-screen bg-background" aria-label="Loading workspace">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-sidebar p-4 lg:block">
        <div className="h-8 w-28 animate-pulse rounded-lg bg-muted" />
        <div className="mt-6 h-14 animate-pulse rounded-xl bg-muted" />
        <div className="mt-8 space-y-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="h-9 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </aside>
      <div className="lg:pl-64">
        <div className="h-16 border-b border-border" />
        <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
          <div className="h-8 w-56 animate-pulse rounded bg-muted" />
          <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
