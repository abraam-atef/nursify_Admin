import { Loader2 } from "lucide-react";

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-ink-light dark:text-white/50">
      <Loader2 className="h-6 w-6 animate-spin text-clinical-500" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function SkeletonRow() {
  return <div className="h-14 w-full animate-pulse rounded-card bg-black/5 dark:bg-white/5" />;
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}
