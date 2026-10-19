"use client";

import { strings, useT } from "@/lib/i18n";
import { useHydrated, useStore } from "@/lib/store";
import { ProgressBar } from "../ui/Progress";

const S = strings({
  en: { done: (d: number, n: number) => `${d} of ${n} done`, yourClass: "Your class" },
  hi: { done: (d: number, n: number) => `${n} में से ${d} पूरे`, yourClass: "आपकी कक्षा" },
});

/** Share of a subject's chapters marked complete, from saved progress. */
export function SubjectProgress({ grade, subject, chapterIds, color, label }: { grade: number; subject: string; chapterIds: string[]; color: string; label: string }) {
  const t = useT(S);
  const hydrated = useHydrated();
  const done = useStore((s) => chapterIds.filter((c) => s.lessons[`${grade}/${subject}/${c}`]).length);
  const pct = hydrated ? Math.round((done / Math.max(1, chapterIds.length)) * 100) : 0;
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs font-bold text-ink-3">
        <span>{t.done(hydrated ? done : 0, chapterIds.length)}</span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <ProgressBar value={pct} label={label} color={color} size="sm" />
    </div>
  );
}

export function YourClassBadge({ grade }: { grade: number }) {
  const t = useT(S);
  const mine = useStore((s) => s.profile.grade);
  if (mine !== grade) return null;
  return <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-white">{t.yourClass}</span>;
}
