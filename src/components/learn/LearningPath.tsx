"use client";

import { BookOpen, Check, Crown, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { useHydrated, useStore, type State } from "@/lib/store";
import { Mascot } from "../ui/Mascot";

export interface PathUnit {
  title: string;
  chapters: { id: string; title: string; lesson: boolean }[];
}

// Horizontal offsets that make the path snake left and right.
const SWAY = [0, 56, 88, 56, 0, -56, -88, -56];

const starsFor = (q?: { best: number; total: number }) => {
  if (!q || !q.total) return 0;
  const r = q.best / q.total;
  return r >= 1 ? 3 : r >= 0.8 ? 2 : r >= 0.5 ? 1 : 0;
};

export function LearningPath({ grade, subject, units, solid }: { grade: number; subject: string; units: PathUnit[]; solid: string }) {
  const hydrated = useHydrated();
  const lessons = useStore((s) => s.lessons);
  const quizzes = useStore((s) => s.quizzes);
  const key = (c: string) => `${grade}/${subject}/${c}`;
  const all = units.flatMap((u) => u.chapters);
  const currentId = hydrated ? all.find((c) => !lessons[key(c.id)])?.id : all[0]?.id;
  let n = 0;

  return (
    <div className="space-y-10">
      {units.map((u, ui) => {
        const doneInUnit = u.chapters.filter((c) => lessons[key(c.id)]).length;
        return (
          <section key={u.title} aria-labelledby={`unit-${ui}`}>
            <div className={cn("flex items-center justify-between gap-4 rounded-2xl px-5 py-4", solid)}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">Unit {ui + 1}</p>
                <h2 id={`unit-${ui}`} className="text-lg font-extrabold leading-tight sm:text-xl">
                  {u.title}
                </h2>
              </div>
              <span className="shrink-0 rounded-xl bg-white/20 px-3 py-1.5 text-sm font-extrabold tabular-nums">
                {hydrated ? doneInUnit : 0}/{u.chapters.length}
              </span>
            </div>

            <ol className="relative mx-auto mt-12 flex max-w-md flex-col items-center gap-14">
              {u.chapters.map((c) => {
                const i = n++;
                const done = hydrated && !!lessons[key(c.id)];
                const current = c.id === currentId;
                const stars = hydrated ? starsFor(quizzes[key(c.id)]) : 0;
                const x = SWAY[i % SWAY.length];
                return (
                  <li key={c.id} className="relative flex flex-col items-center" style={{ transform: `translateX(${x}px)` }}>
                    {current && (
                      <span className="animate-float absolute -top-11 z-10 whitespace-nowrap rounded-xl border-2 border-line bg-surface px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-brand-600 shadow-card">
                        {done ? "Review" : i === 0 && !Object.keys(lessons).some((k) => k.startsWith(`${grade}/${subject}/`)) ? "Start here" : "Up next"}
                      </span>
                    )}
                    <Link
                      href={`/class/${grade}/${subject}/${c.id}`}
                      aria-label={`${c.title}${done ? ", completed" : current ? ", up next" : ""}`}
                      className={cn(
                        "group relative grid size-[76px] place-items-center rounded-full border-b-[6px] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-1 active:border-b-2",
                        done ? "border-green-700 bg-green-500 text-white" : current ? "animate-pulse-ring border-brand-700 bg-brand-500 text-white" : "border-line-strong bg-surface-2 text-ink-3",
                      )}
                    >
                      {done ? (
                        stars === 3 ? <Crown className="size-8 fill-amber-300 text-amber-300" aria-hidden /> : <Check className="size-9" strokeWidth={3.5} aria-hidden />
                      ) : current ? (
                        <Star className="size-8 fill-white" aria-hidden />
                      ) : (
                        <BookOpen className="size-7" aria-hidden />
                      )}
                    </Link>
                    <span className="mt-2 flex gap-0.5" aria-label={`${stars} of 3 stars`}>
                      {[0, 1, 2].map((s) => (
                        <Star key={s} aria-hidden className={cn("size-3.5", s < stars ? "fill-amber-400 text-amber-400" : "text-line-strong")} />
                      ))}
                    </span>
                    <span className="mt-1 max-w-[190px] text-center text-sm font-bold leading-snug">{c.title}</span>
                    {c.lesson && <span className="mt-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-green-700">Lesson + quiz</span>}
                  </li>
                );
              })}
              {ui === 0 && (
                <li aria-hidden className="pointer-events-none absolute -right-28 top-24 hidden xl:block">
                  <Mascot mood="happy" size={96} />
                </li>
              )}
            </ol>
          </section>
        );
      })}
    </div>
  );
}

export function ContinueButton({ grade, subject, chapters }: { grade: number; subject: string; chapters: { id: string; title: string }[] }) {
  const lessons = useStore((s: State) => s.lessons);
  const hydrated = useHydrated();
  const next = chapters.find((c) => !(hydrated && lessons[`${grade}/${subject}/${c.id}`])) ?? chapters[0];
  const started = hydrated && chapters.some((c) => lessons[`${grade}/${subject}/${c.id}`]);
  return (
    <Link href={`/class/${grade}/${subject}/${next.id}`} className="flex items-center justify-between gap-3 rounded-2xl border-b-4 border-brand-700 bg-brand-500 px-5 py-4 text-white transition-transform hover:-translate-y-0.5 active:translate-y-0.5">
      <span className="min-w-0">
        <span className="block text-xs font-bold uppercase tracking-wider text-brand-100">{started ? "Continue" : "Start"}</span>
        <span className="block truncate text-lg font-extrabold">{next.title}</span>
      </span>
      <Star aria-hidden className="size-6 shrink-0 fill-white" />
    </Link>
  );
}

export function SubjectStats({ grade, subject, chapterIds }: { grade: number; subject: string; chapterIds: string[] }) {
  const hydrated = useHydrated();
  const lessons = useStore((s) => s.lessons);
  const quizzes = useStore((s) => s.quizzes);
  const keys = chapterIds.map((c) => `${grade}/${subject}/${c}`);
  const done = hydrated ? keys.filter((k) => lessons[k]).length : 0;
  const taken = hydrated ? keys.filter((k) => quizzes[k]) : [];
  const avg = taken.length ? Math.round((taken.reduce((n, k) => n + quizzes[k].best / quizzes[k].total, 0) / taken.length) * 100) : 0;
  const stars = hydrated ? keys.reduce((n, k) => n + starsFor(quizzes[k]), 0) : 0;
  return (
    <dl className="grid grid-cols-3 gap-2 text-center">
      {[
        ["Done", `${done}/${keys.length}`],
        ["Quiz avg", taken.length ? `${avg}%` : "–"],
        ["Stars", `${stars}`],
      ].map(([k, v]) => (
        <div key={k} className="rounded-xl bg-surface-2 px-2 py-3">
          <dt className="text-xs font-bold text-ink-3">{k}</dt>
          <dd className="mt-0.5 text-xl font-extrabold tabular-nums">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
