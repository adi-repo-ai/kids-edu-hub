"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { subjectById, subjects } from "@/data/curriculum";
import { plannerTasks, type PlannerTask } from "@/data/student";
import { cn } from "@/lib/cn";
import { hue } from "@/lib/hue";
import type { SubjectId } from "@/lib/types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { ProgressBar, ProgressRing } from "../ui/Progress";
import { TaskCheck } from "./TodayPlan";

const days = [
  { day: "Mon", date: 12 },
  { day: "Tue", date: 13 },
  { day: "Wed", date: 14 },
  { day: "Thu", date: 15 },
  { day: "Fri", date: 16 },
  { day: "Sat", date: 17 },
  { day: "Sun", date: 18 },
];
const TODAY = "Sat";

export function WeekPlanner() {
  const [tasks, setTasks] = useState<PlannerTask[]>(plannerTasks);
  const [selected, setSelected] = useState(TODAY);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<SubjectId>("maths");

  const dayTasks = tasks.filter((t) => t.day === selected);
  const doneMin = tasks.filter((t) => t.done).reduce((n, t) => n + t.minutes, 0);
  const planMin = tasks.reduce((n, t) => n + t.minutes, 0);
  const bySubject = subjects
    .map((s) => ({ s, minutes: tasks.filter((t) => t.subject === s.id && t.done).reduce((n, t) => n + t.minutes, 0) }))
    .sort((a, b) => b.minutes - a.minutes);
  const maxSub = Math.max(...bySubject.map((b) => b.minutes), 1);
  const selDate = days.find((d) => d.day === selected)!.date;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0">
        {/* Week strip */}
        <div role="tablist" aria-label="Days of the week" className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {days.map((d) => {
            const list = tasks.filter((t) => t.day === d.day);
            const allDone = list.length > 0 && list.every((t) => t.done);
            const on = d.day === selected;
            return (
              <button
                key={d.day}
                role="tab"
                aria-selected={on}
                aria-controls="day-panel"
                onClick={() => setSelected(d.day)}
                className={cn(
                  "flex flex-col items-center rounded-lg border-2 py-2.5 transition-colors sm:py-3",
                  on ? "border-ink bg-ink text-white" : "border-line bg-surface hover:border-line-strong",
                )}
              >
                <span className={cn("text-xs font-semibold", on ? "text-white/70" : "text-ink-3")}>{d.day}</span>
                <span className="font-display text-xl font-extrabold sm:text-2xl">{d.date}</span>
                <span className="mt-1 flex h-2 gap-0.5" aria-hidden>
                  {list.map((t) => (
                    <span key={t.id} className={cn("size-1.5 rounded-full", t.done ? "bg-mint-500" : on ? "bg-white/40" : "bg-line-strong")} />
                  ))}
                </span>
                {d.day === TODAY && <span className={cn("mt-1 text-[10px] font-bold uppercase", on ? "text-sun-400" : "text-coral-700")}>Today</span>}
                {allDone && d.day !== TODAY && <span className="sr-only">All done</span>}
              </button>
            );
          })}
        </div>

        {/* Day panel */}
        <Card id="day-panel" role="tabpanel" className="mt-4 p-5 sm:p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold">
              {selected === TODAY ? "Today" : selected}, {selDate} October
            </h2>
            <span className="text-sm text-ink-3">{dayTasks.reduce((n, t) => n + t.minutes, 0)} min planned</span>
          </div>

          {dayTasks.length === 0 ? (
            <p className="mt-4 rounded-md border border-dashed border-line-strong p-6 text-center text-ink-2">A free day. Add something small, or rest. Both count.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {dayTasks.map((t) => {
                const s = subjectById(t.subject)!;
                return (
                  <li key={t.id} className="-ml-2 flex items-center gap-2 py-1.5">
                    <TaskCheck done={t.done} label={t.title} onToggle={() => setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))} />
                    <span aria-hidden className={cn("h-8 w-1 rounded-full", hue[s.hue].fill)} />
                    <div className="min-w-0 flex-1">
                      <p className={cn("font-semibold", t.done && "text-ink-3 line-through")}>{t.title}</p>
                      <p className="text-sm text-ink-3">
                        {s.name} · {t.minutes} min
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <form
            className="mt-5 flex flex-col gap-2 border-t border-line pt-5 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (!title.trim()) return;
              setTasks((ts) => [...ts, { id: `n${Date.now()}`, day: selected, date: selDate, subject, title: title.trim(), minutes: 20, done: false }]);
              setTitle("");
            }}
          >
            <label className="sr-only" htmlFor="new-task">
              New task
            </label>
            <input
              id="new-task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a 20-minute task…"
              className="h-11 flex-1 rounded-md border border-line-strong bg-paper px-3 outline-none focus:border-royal-500"
            />
            <label className="sr-only" htmlFor="new-subject">
              Subject
            </label>
            <select
              id="new-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value as SubjectId)}
              className="h-11 rounded-md border border-line-strong bg-paper px-3 outline-none focus:border-royal-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <Button type="submit" variant="secondary" icon={<Plus className="size-4" aria-hidden />}>
              Add
            </Button>
          </form>
        </Card>
      </div>

      <aside className="space-y-6">
        <Card className="flex items-center gap-4 p-5">
          <ProgressRing value={Math.round((doneMin / planMin) * 100)} hue="mint" size={76} stroke={8} label="Week plan completed" />
          <div>
            <p className="font-bold">This week</p>
            <p className="text-sm text-ink-2" aria-live="polite">
              {Math.floor(doneMin / 60)}h {doneMin % 60}m of {Math.floor(planMin / 60)}h {planMin % 60}m done
            </p>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-bold">Time by subject</h2>
          <ul className="mt-4 space-y-3">
            {bySubject.map(({ s, minutes }) => (
              <li key={s.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold">{s.name}</span>
                  <span className="tabular-nums text-ink-3">{minutes} min</span>
                </div>
                <ProgressBar value={Math.round((minutes / maxSub) * 100)} hue={s.hue} size="sm" label={`${s.name}: ${minutes} minutes`} />
              </li>
            ))}
          </ul>
        </Card>
      </aside>
    </div>
  );
}
