"use client";

import { Clock, Flame, Minus, NotebookPen, Target, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { subjectById } from "@/data/curriculum";
import { examTimetable, parent, weekActivity } from "@/data/student";
import { cn } from "@/lib/cn";
import { hue } from "@/lib/hue";
import { Card } from "../ui/Card";
import { CountUp } from "../ui/Motion";
import { ProgressBar } from "../ui/Progress";
import { SubjectIcon } from "../ui/SubjectIcon";
import { Switch } from "../ui/Switch";

export function ParentView() {
  const [child, setChild] = useState(parent.children[0].id);
  const maxMin = Math.max(...weekActivity.map((d) => d.minutes));
  const total = weekActivity.reduce((n, d) => n + d.minutes, 0);

  return (
    <div>
      <div role="tablist" aria-label="Choose child" className="sticker inline-flex bg-surface p-1">
        {parent.children.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={child === c.id}
            onClick={() => setChild(c.id)}
            className={cn("flex min-h-11 items-center gap-2 rounded-md px-3 pr-4 text-left transition-colors", child === c.id ? "bg-ink text-white" : "text-ink-2 hover:bg-sunken")}
          >
            <span className={cn("grid size-8 place-items-center rounded-full text-xs font-bold", hue[c.hue].chip)}>{c.initials}</span>
            <span>
              <span className="block text-sm font-bold leading-tight">{c.name}</span>
              <span className={cn("block text-xs", child === c.id ? "text-white/70" : "text-ink-3")}>{c.grade}</span>
            </span>
          </button>
        ))}
      </div>

      {child !== "ananya" ? (
        <Card className="mt-6 p-8 text-center">
          <p className="text-lg font-bold">Kabir&apos;s first weekly report arrives on Sunday evening</p>
          <p className="mt-1 text-ink-2">He joined this week. So far he has completed 3 EVS lessons and his first Maths quiz.</p>
        </Card>
      ) : (
        <div className="animate-rise mt-6 space-y-6">
          {/* KPIs */}
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { icon: Clock, label: "Studied this week", value: <CountUp value={total} suffix=" min" />, sub: "Goal: 300 min", hue: "royal" as const },
              { icon: NotebookPen, label: "Lessons finished", value: <CountUp value={6} />, sub: "+2 vs last week", hue: "lavender" as const },
              { icon: Target, label: "Quiz average", value: <CountUp value={83} suffix="%" />, sub: "Across 9 quizzes", hue: "mint" as const },
              { icon: Flame, label: "Current streak", value: <CountUp value={12} suffix=" days" />, sub: "Best: 15 days", hue: "coral" as const },
            ].map((k) => (
              <li key={k.label}>
                <Card interactive className={cn("h-full p-4", hue[k.hue].soft)}>
                  <span className={cn("grid size-10 place-items-center rounded-md border-2 border-ink", hue[k.hue].chip)}>
                    <k.icon aria-hidden className="size-5" />
                  </span>
                  <p className="mt-3 font-display text-3xl font-extrabold">{k.value}</p>
                  <p className="text-sm font-semibold">{k.label}</p>
                  <p className="text-xs text-ink-3">{k.sub}</p>
                </Card>
              </li>
            ))}
          </ul>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <Card className="p-5 sm:p-6">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-bold">Daily study time</h2>
                <span className="text-sm text-ink-3">12 – 18 Oct</span>
              </div>
              <div className="mt-6 flex h-44 items-end gap-2 sm:gap-4" aria-hidden>
                {weekActivity.map((d) => (
                  <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <span className="text-xs font-semibold tabular-nums text-ink-3">{d.minutes || ""}</span>
                    <div
                      className={cn("w-full max-w-10 origin-bottom rounded-t-md border-2 border-ink", d.day === "Sat" ? "bg-coral-500" : d.minutes ? "bg-royal-200" : "bg-sunken")}
                      style={{ height: `${Math.max((d.minutes / maxMin) * 75, 3)}%`, animation: `bounce-in 700ms ${weekActivity.indexOf(d) * 80}ms var(--ease-spring) both` }}
                    />
                    <span className="text-xs font-semibold text-ink-2">{d.day}</span>
                  </div>
                ))}
              </div>
              <table className="sr-only">
                <caption>Minutes studied per day</caption>
                <tbody>
                  {weekActivity.map((d) => (
                    <tr key={d.day}>
                      <th scope="row">{d.day}</th>
                      <td>{d.minutes} minutes</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card className="p-5 sm:p-6">
              <h2 className="text-lg font-bold">Subject understanding</h2>
              <p className="text-sm text-ink-3">Based on quizzes in the last 30 days</p>
              <ul className="mt-4 space-y-3.5">
                {parent.mastery.map((m) => {
                  const s = subjectById(m.subject)!;
                  const Trend = m.trend > 0 ? TrendingUp : m.trend < 0 ? TrendingDown : Minus;
                  return (
                    <li key={m.subject} className="flex items-center gap-3">
                      <SubjectIcon subject={m.subject} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="font-semibold">{s.name}</span>
                          <span className="flex items-center gap-1 tabular-nums">
                            <strong>{m.score}%</strong>
                            <span className={cn("flex items-center text-xs font-semibold", m.trend >= 0 ? "text-mint-700" : "text-coral-700")}>
                              <Trend aria-hidden className="size-3.5" />
                              {m.trend > 0 ? "+" : ""}
                              {m.trend}
                            </span>
                          </span>
                        </div>
                        <ProgressBar value={m.score} hue={s.hue} size="sm" label={`${s.name} understanding`} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <section aria-labelledby="note-title" className="ruled rounded-lg border border-line-strong py-[14px] pl-16 pr-6 lg:col-span-1">
              <h2 id="note-title" className="font-display text-sm font-bold uppercase leading-8 tracking-wide text-coral-700">
                Note from school
              </h2>
              <p className="text-[17px] leading-8 text-ink">“{parent.teacherNote.text}”</p>
              <p className="text-sm leading-8 text-ink-3">
                {parent.teacherNote.from} · {parent.teacherNote.date}
              </p>
            </section>

            <Card className="p-5">
              <h2 className="text-lg font-bold">Recent activity</h2>
              <ol className="mt-3 space-y-3">
                {parent.recent.map((r) => (
                  <li key={r.text} className="flex gap-3">
                    <span aria-hidden className={cn("mt-1.5 size-2.5 shrink-0 rounded-full", hue[subjectById(r.subject)!.hue].fill)} />
                    <div>
                      <p className="text-sm font-semibold leading-snug">{r.text}</p>
                      <p className="text-xs text-ink-3">{r.when}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>

            <Card className="p-5">
              <h2 className="text-lg font-bold">Upcoming exams</h2>
              <ul className="mt-3 divide-y divide-line">
                {examTimetable.map((e) => (
                  <li key={e.date} className="flex items-center justify-between py-2 text-sm">
                    <span className="font-semibold">{e.name}</span>
                    <span className="text-ink-3">
                      {e.day}, {e.date}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card className="p-5 sm:p-6">
            <h2 className="text-lg font-bold">Notifications</h2>
            <div className="mt-2 divide-y divide-line">
              <Switch label="Weekly report on WhatsApp" description="Every Sunday at 7 pm" defaultOn />
              <Switch label="Missed-streak reminder" description="A gentle nudge if no study by 6 pm" />
              <Switch label="School announcements" description="Circulars and exam dates" defaultOn />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
