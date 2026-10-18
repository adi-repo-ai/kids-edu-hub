"use client";

import { BookOpenCheck, ClipboardCheck, Flame, Printer, Target } from "lucide-react";
import { chaptersOf, getChapter, getGrade } from "@/lib/curriculum";
import { streakOf, useHydrated, useStore, weekOf } from "@/lib/store";
import { styleFor } from "@/lib/subjects";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { ProgressBar } from "../ui/Progress";
import { SubjectIcon } from "../ui/SubjectIcon";

export function ParentView() {
  const hydrated = useHydrated();
  const s = useStore((x) => x);
  if (!hydrated) return <div className="h-96" />;
  const week = weekOf(s.activity);
  const max = Math.max(...week.map((d) => d.xp), 1);
  const since = new Date();
  since.setDate(since.getDate() - 7);
  const lessonsWeek = Object.values(s.lessons).filter((d) => new Date(d) >= since).length;
  const quizzes = Object.values(s.quizzes);
  const avg = quizzes.length ? Math.round((quizzes.reduce((n, q) => n + q.best / q.total, 0) / quizzes.length) * 100) : null;
  const grade = s.profile.grade ? getGrade(s.profile.grade) : undefined;
  const recent = Object.entries(s.lessons)
    .sort((a, b) => b[1].localeCompare(a[1]))
    .slice(0, 6);

  if (!s.xp && !Object.keys(s.lessons).length)
    return <EmptyState mood="wave" title="No activity yet" body={`When ${s.profile.name || "your child"} completes lessons and quizzes on this device, a weekly summary will appear here.`} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-ink-2">
          Report for <strong className="text-ink">{s.profile.name || "your child"}</strong>
          {grade ? ` · Class ${grade.grade}` : ""} · last 7 days
        </p>
        <Button variant="secondary" size="sm" className="no-print" onClick={() => window.print()} icon={<Printer className="size-4" aria-hidden />}>
          Print report
        </Button>
      </div>

      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: Flame, c: "text-coral-600", v: `${streakOf(s.activity)} days`, l: "Current streak" },
          { icon: BookOpenCheck, c: "text-green-600", v: String(lessonsWeek), l: "Lessons this week" },
          { icon: Target, c: "text-brand-600", v: avg === null ? "–" : `${avg}%`, l: "Average quiz score" },
          { icon: ClipboardCheck, c: "text-violet-600", v: String(s.mocks.length), l: "Mock tests taken" },
        ].map((k) => (
          <li key={k.l} className="card p-5">
            <k.icon aria-hidden className={`size-6 ${k.c}`} />
            <p className="mt-3 text-2xl font-extrabold">{k.v}</p>
            <p className="text-sm font-bold text-ink-3">{k.l}</p>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5 sm:p-6" aria-labelledby="pw">
          <h2 id="pw" className="text-lg font-extrabold">
            Daily effort (XP)
          </h2>
          <div className="mt-6 flex h-40 items-end gap-3" aria-hidden>
            {week.map((d) => (
              <div key={d.key} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                <span className="text-xs font-bold tabular-nums text-ink-3">{d.xp || ""}</span>
                <div className="w-full max-w-10 rounded-t-lg bg-brand-500" style={{ height: `${Math.max((d.xp / max) * 80, d.xp ? 6 : 2)}%`, opacity: d.xp ? 1 : 0.2 }} />
                <span className="text-xs font-bold text-ink-2">{d.day}</span>
              </div>
            ))}
          </div>
          <table className="sr-only">
            <caption>XP per day</caption>
            <tbody>
              {week.map((d) => (
                <tr key={d.key}>
                  <th>{d.day}</th>
                  <td>{d.xp} XP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {grade && (
          <section className="card p-5 sm:p-6" aria-labelledby="ps">
            <h2 id="ps" className="mb-4 text-lg font-extrabold">
              Subject progress
            </h2>
            <ul className="space-y-4">
              {grade.subjects.map((sub) => {
                const list = chaptersOf(sub);
                const done = list.filter((c) => s.lessons[`${grade.grade}/${sub.id}/${c.id}`]).length;
                return (
                  <li key={sub.id} className="flex items-center gap-3">
                    <SubjectIcon id={sub.id} size="sm" />
                    <div className="flex-1">
                      <div className="mb-1 flex justify-between text-sm font-bold">
                        <span>{sub.name}</span>
                        <span className="tabular-nums text-ink-3">
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
      </div>

      <section className="card p-5 sm:p-6" aria-labelledby="ra">
        <h2 id="ra" className="mb-3 text-lg font-extrabold">
          Recently completed
        </h2>
        <ul className="divide-y divide-line">
          {recent.map(([k, d]) => {
            const [g, sub, ch] = k.split("/");
            const info = getChapter(g, sub, ch);
            const q = s.quizzes[k];
            return (
              <li key={k} className="flex items-center gap-3 py-2.5 text-sm">
                <SubjectIcon id={sub} size="sm" />
                <span className="min-w-0 flex-1 truncate font-bold">
                  {info?.chapter.title ?? ch} <span className="font-normal text-ink-3">· Class {g}</span>
                </span>
                {q && <span className="font-bold text-ink-2">Quiz {q.best}/{q.total}</span>}
                <span className="text-ink-3">{new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
              </li>
            );
          })}
        </ul>
      </section>
      <p className="text-sm text-ink-3">This report reflects learning saved on this device.</p>
    </div>
  );
}
