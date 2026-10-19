"use client";

import { Award, ClipboardCheck, Flame, Lock, RotateCcw, Target, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { achievements } from "@/lib/achievements";
import { chaptersOf, getChapter, getGrade } from "@/lib/curriculum";
import { cn } from "@/lib/cn";
import { actions, levelOf, LEVEL_XP, streakOf, today, useHydrated, useStore } from "@/lib/store";
import { styleFor } from "@/lib/subjects";
import { Readiness } from "../revise/Readiness";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { ProgressBar } from "../ui/Progress";
import { SubjectIcon } from "../ui/SubjectIcon";

/** 12-week activity heatmap, like a contributions calendar. */
function Heatmap({ activity }: { activity: Record<string, number> }) {
  const days: { key: string; xp: number }[] = [];
  const start = new Date();
  start.setDate(start.getDate() - 83 - start.getDay());
  for (let i = 0; i < 84 + new Date().getDay() + 1; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({ key: today(d), xp: activity[today(d)] ?? 0 });
  }
  const shade = (xp: number) => (xp === 0 ? "bg-surface-2" : xp < 20 ? "bg-green-200" : xp < 50 ? "bg-green-400" : "bg-green-600");
  return (
    <div className="overflow-x-auto">
      <div className="grid w-max grid-flow-col grid-rows-7 gap-1" role="img" aria-label="Study activity over the last 12 weeks">
        {days.map((d) => (
          <span key={d.key} title={`${d.key}: ${d.xp} XP`} className={cn("size-3.5 rounded-[4px]", shade(d.xp))} />
        ))}
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-ink-3">
        Less <span className="size-3 rounded bg-surface-2" /> <span className="size-3 rounded bg-green-200" /> <span className="size-3 rounded bg-green-400" /> <span className="size-3 rounded bg-green-600" /> More
      </p>
    </div>
  );
}

export function ProgressView() {
  const hydrated = useHydrated();
  const s = useStore((x) => x);
  const [confirm, setConfirm] = useState(false);
  if (!hydrated) return <div className="h-96" />;
  const lvl = levelOf(s.xp);
  const streak = streakOf(s.activity);
  const grade = s.profile.grade ? getGrade(s.profile.grade) : undefined;
  const badges = achievements(s);
  const quizList = Object.entries(s.quizzes).sort((a, b) => b[1].last.localeCompare(a[1].last));
  const nothing = !s.xp && !Object.keys(s.lessons).length;

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Zap, color: "text-amber-500 fill-amber-400", label: "Total XP", value: s.xp.toLocaleString("en-IN"), sub: `Level ${lvl.level} · ${LEVEL_XP - lvl.into} XP to next` },
          { icon: Flame, color: "text-coral-600 fill-coral-500", label: "Current streak", value: `${streak} day${streak === 1 ? "" : "s"}`, sub: `${Object.keys(s.activity).length} active days in total` },
          { icon: Target, color: "text-green-600", label: "Lessons completed", value: String(Object.keys(s.lessons).length), sub: `${Object.keys(s.quizzes).length} quizzes taken` },
          { icon: ClipboardCheck, color: "text-violet-600", label: "Mock tests", value: String(s.mocks.length), sub: s.mocks[0] ? `Last: ${s.mocks[0].score}/${s.mocks[0].total}` : "None yet" },
        ].map((k) => (
          <div key={k.label} className="card p-5">
            <k.icon aria-hidden className={cn("size-6", k.color)} />
            <p className="mt-3 text-3xl font-extrabold tabular-nums">{k.value}</p>
            <p className="font-bold">{k.label}</p>
            <p className="text-sm text-ink-3">{k.sub}</p>
          </div>
        ))}
      </section>

      <section className="card p-5 sm:p-6" aria-labelledby="lvl">
        <div className="flex items-center justify-between">
          <h2 id="lvl" className="text-lg font-extrabold">
            Level {lvl.level}
          </h2>
          <span className="text-sm font-bold text-ink-3">
            {lvl.into}/{LEVEL_XP} XP
          </span>
        </div>
        <ProgressBar value={lvl.pct} size="lg" color="bg-amber-400" label="Progress to next level" className="mt-3" />
        <h3 className="mb-3 mt-6 font-extrabold">Activity</h3>
        <Heatmap activity={s.activity} />
      </section>

      {grade && grade.grade >= 9 && (
        <div id="readiness" className="scroll-mt-24">
          <Readiness grade={grade.grade} />
        </div>
      )}

      {nothing ? (
        <EmptyState title="Your progress will appear here" body="Finish a lesson or take a quiz and your XP, streak, badges and subject progress will start filling in." action={<Link href="/learn" className="font-bold text-brand-600 hover:underline">Start a lesson →</Link>} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {grade && (
            <section className="card p-5 sm:p-6" aria-labelledby="sp">
              <h2 id="sp" className="mb-4 text-lg font-extrabold">
                Class {grade.grade} subjects
              </h2>
              <ul className="space-y-4">
                {grade.subjects.map((sub) => {
                  const list = chaptersOf(sub);
                  const done = list.filter((c) => s.lessons[`${grade.grade}/${sub.id}/${c.id}`]).length;
                  return (
                    <li key={sub.id} className="flex items-center gap-3">
                      <SubjectIcon id={sub.id} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex justify-between text-sm">
                          <Link href={`/class/${grade.grade}/${sub.id}`} className="truncate font-bold hover:underline">
                            {sub.name}
                          </Link>
                          <span className="font-bold tabular-nums text-ink-3">
                            {done}/{list.length}
                          </span>
                        </div>
                        <ProgressBar value={(done / list.length) * 100} label={`${sub.name} progress`} color={styleFor(sub.id).bar} size="sm" />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <section className="card p-5 sm:p-6" aria-labelledby="qh">
            <h2 id="qh" className="mb-4 text-lg font-extrabold">
              Quiz history
            </h2>
            {quizList.length ? (
              <ul className="divide-y divide-line">
                {quizList.slice(0, 12).map(([k, q]) => {
                  const [g, sub, ch] = k.split("/");
                  const info = getChapter(g, sub, ch);
                  return (
                    <li key={k} className="flex items-center gap-3 py-2.5">
                      <SubjectIcon id={sub} size="sm" />
                      <Link href={`/class/${g}/${sub}/${ch}#quiz`} className="min-w-0 flex-1 truncate text-sm font-bold hover:underline">
                        {info?.chapter.title ?? ch}
                      </Link>
                      <span className={cn("text-sm font-extrabold tabular-nums", q.best / q.total >= 0.8 ? "text-green-700" : q.best / q.total >= 0.5 ? "text-amber-700" : "text-coral-700")}>
                        {q.best}/{q.total}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-ink-2">No quizzes yet.</p>
            )}
          </section>

          {s.mocks.length > 0 && (
            <section className="card p-5 sm:p-6 lg:col-span-2" aria-labelledby="mh">
              <h2 id="mh" className="mb-4 text-lg font-extrabold">
                Mock test results
              </h2>
              <ul className="divide-y divide-line">
                {s.mocks.map((m) => (
                  <li key={m.date} className="flex flex-wrap items-center gap-3 py-2.5 text-sm">
                    <Link href={`/mock/${m.id}`} className="min-w-0 flex-1 font-bold hover:underline">
                      {m.title}
                    </Link>
                    <span className="text-ink-3">{new Date(m.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    <span className="text-ink-3">{m.minutes} min</span>
                    <span className="font-extrabold tabular-nums">
                      {m.score}/{m.total}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      <section aria-labelledby="bd">
        <h2 id="bd" className="mb-4 text-xl font-extrabold">
          Badges
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {badges.map((b) => (
            <li key={b.id} className="card flex flex-col items-center p-4 text-center">
              <span className={cn("grid size-14 place-items-center rounded-2xl border-b-4", b.earned ? "border-amber-600 bg-amber-400 text-white" : "border-line-strong bg-surface-2 text-ink-3")}>
                {b.earned ? <Award aria-hidden className="size-7" /> : <Lock aria-hidden className="size-5" />}
              </span>
              <p className="mt-2 font-extrabold">{b.name}</p>
              <p className="text-xs text-ink-3">{b.desc}</p>
              {!b.earned && <ProgressBar value={b.progress} label={`${b.name} progress`} size="sm" color="bg-amber-400" className="mt-2 w-full" />}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-line-strong p-5">
        <p className="text-sm text-ink-2">Progress is stored in this browser. Clearing it starts fresh (your name and class are kept).</p>
        {confirm ? (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={() => { actions.reset(); setConfirm(false); }}>
              Yes, clear progress
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setConfirm(true)} icon={<RotateCcw className="size-4" aria-hidden />}>
            Reset progress
          </Button>
        )}
      </section>
    </div>
  );
}
