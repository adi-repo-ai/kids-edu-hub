"use client";

import { useHydrated, useStore } from "@/lib/store";

export function MockBest({ id }: { id: string }) {
  const hydrated = useHydrated();
  const runs = useStore((s) => s.mocks.filter((m) => m.id === id));
  if (!hydrated || !runs.length) return <span className="text-sm text-ink-3">Not attempted yet</span>;
  const best = runs.reduce((a, b) => (b.score / b.total > a.score / a.total ? b : a));
  return (
    <span className="text-sm font-bold text-green-700">
      Best: {best.score}/{best.total} · {runs.length} attempt{runs.length > 1 ? "s" : ""}
    </span>
  );
}
