export function DealCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-800">
      <div className="aspect-video animate-pulse bg-ink-700/60" />
      <div className="flex flex-col gap-2 p-3.5">
        <div className="h-4 w-4/5 animate-pulse rounded bg-ink-700/60" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-ink-700/60" />
        <div className="mt-1 h-8 w-full animate-pulse rounded-xl bg-ink-700/40" />
      </div>
    </div>
  );
}

export function GameCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-800">
      <div className="poster animate-pulse bg-ink-700/60" />
    </div>
  );
}

export function DealGridSkeleton({
  count = 10,
  className = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <DealCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function GameGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <GameCardSkeleton key={i} />
      ))}
    </div>
  );
}
