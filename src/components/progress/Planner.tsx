"use client";

import { Check, ChevronLeft, ChevronRight, Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { chaptersOf, getGrade } from "@/lib/curriculum";
import { cn } from "@/lib/cn";
import { actions, today, useHydrated, useStore } from "@/lib/store";
import { toast } from "@/lib/toast";
import { Button } from "../ui/Button";
import { SubjectIcon } from "../ui/SubjectIcon";

const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export function Planner() {
  const hydrated = useHydrated();
  const tasks = useStore((s) => s.tasks);
  const lessons = useStore((s) => s.lessons);
  const gradeNo = useStore((s) => s.profile.grade);
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState(today());
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [minutes, setMinutes] = useState(30);
  if (!hydrated) return <div className="h-96" />;

  const grade = gradeNo ? getGrade(gradeNo) : undefined;
  const monday = addDays(new Date(), -((new Date().getDay() + 6) % 7) + offset * 7);
  const week = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const dayTasks = tasks.filter((t) => t.date === selected);
  const weekKeys = week.map((d) => today(d));
  const weekTasks = tasks.filter((t) => weekKeys.includes(t.date));
  const doneMin = weekTasks.filter((t) => t.done).reduce((n, t) => n + t.minutes, 0);
  const planMin = weekTasks.reduce((n, t) => n + t.minutes, 0);

  // Suggest the next unfinished chapter of each subject.
  const suggestions = grade
    ? grade.subjects
        .map((s) => ({ s, c: chaptersOf(s).find((c) => !lessons[`${grade.grade}/${s.id}/${c.id}`]) }))
        .filter((x) => x.c)
        .slice(0, 4)
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setOffset((o) => o - 1)} icon={<ChevronLeft className="size-4" aria-hidden />}>
            Previous
          </Button>
          <p className="font-extrabold">
            {week[0].toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – {week[6].toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </p>
          <Button variant="ghost" size="sm" onClick={() => setOffset((o) => o + 1)} iconRight={<ChevronRight className="size-4" aria-hidden />}>
            Next
          </Button>
        </div>
        <div role="tablist" aria-label="Days" className="grid grid-cols-7 gap-1.5">
          {week.map((d) => {
            const key = today(d);
            const list = tasks.filter((t) => t.date === key);
            const on = key === selected;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={on}
                onClick={() => setSelected(key)}
                className={cn("flex flex-col items-center rounded-2xl border-2 py-2.5 transition-colors", on ? "border-brand-500 bg-brand-500 text-white" : "border-line bg-surface hover:bg-surface-2")}
              >
                <span className={cn("text-xs font-bold", on ? "text-brand-100" : "text-ink-3")}>{d.toLocaleDateString("en-IN", { weekday: "short" })}</span>
                <span className="text-xl font-extrabold">{d.getDate()}</span>
                <span className="mt-1 flex h-1.5 gap-0.5">
                  {list.slice(0, 4).map((t) => (
                    <span key={t.id} className={cn("size-1.5 rounded-full", t.done ? "bg-green-400" : on ? "bg-white/60" : "bg-line-strong")} />
                  ))}
                </span>
                {key === today() && <span className={cn("mt-0.5 text-[10px] font-extrabold uppercase", on ? "text-white" : "text-brand-600")}>Today</span>}
              </button>
            );
          })}
        </div>

        <div role="tabpanel" className="card p-5 sm:p-6">
          <h2 className="text-lg font-extrabold">{new Date(selected + "T00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</h2>
          {dayTasks.length ? (
            <ul className="mt-3 divide-y divide-line">
              {dayTasks.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-2">
                  <button type="button" role="checkbox" aria-checked={t.done} aria-label={t.title} onClick={() => actions.toggleTask(t.id)} className="grid size-10 shrink-0 place-items-center">
                    <span className={cn("grid size-6 place-items-center rounded-lg border-2", t.done ? "border-green-500 bg-green-500 text-white" : "border-line-strong")}>{t.done && <Check className="size-4" strokeWidth={3} aria-hidden />}</span>
                  </button>
                  {t.subject && <SubjectIcon id={t.subject} size="sm" />}
                  <span className="min-w-0 flex-1">
                    <span className={cn("block font-semibold", t.done && "text-ink-3 line-through")}>{t.title}</span>
                    <span className="text-xs text-ink-3">{t.minutes} min</span>
                  </span>
                  <button type="button" aria-label={`Delete ${t.title}`} onClick={() => actions.removeTask(t.id)} className="grid size-9 place-items-center rounded-lg text-ink-3 hover:bg-coral-50 hover:text-coral-700">
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-ink-2">No tasks for this day yet.</p>
          )}

          <form
            className="mt-5 grid gap-2 border-t border-line pt-5 sm:grid-cols-[1fr_auto_auto_auto]"
            onSubmit={(e) => {
              e.preventDefault();
              if (!title.trim()) return;
              actions.addTask({ title: title.trim(), date: selected, subject: subject || undefined, minutes });
              setTitle("");
              toast("Task added");
            }}
          >
            <label className="sr-only" htmlFor="pl-title">Task</label>
            <input id="pl-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What will you study?" className="h-11 rounded-xl border-2 border-line bg-surface-2 px-3 outline-none focus:border-brand-400 focus:bg-surface" />
            <label className="sr-only" htmlFor="pl-subject">Subject</label>
            <select id="pl-subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="h-11 rounded-xl border-2 border-line bg-surface-2 px-3 outline-none focus:border-brand-400">
              <option value="">Any subject</option>
              {(grade?.subjects ?? []).map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="pl-min">Minutes</label>
            <select id="pl-min" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="h-11 rounded-xl border-2 border-line bg-surface-2 px-3 outline-none focus:border-brand-400">
              {[15, 20, 30, 45, 60, 90].map((m) => (
                <option key={m} value={m}>{m} min</option>
              ))}
            </select>
            <Button type="submit" icon={<Plus className="size-4" aria-hidden />}>Add</Button>
          </form>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="card p-5">
          <p className="font-extrabold">This week</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums">
            {Math.round(doneMin / 6) / 10}h <span className="text-base font-bold text-ink-3">of {Math.round(planMin / 6) / 10}h planned</span>
          </p>
          <p className="text-sm text-ink-3">{weekTasks.filter((t) => t.done).length} of {weekTasks.length} tasks done · +10 XP each</p>
        </div>
        {suggestions.length > 0 && (
          <div className="card p-5">
            <p className="flex items-center gap-2 font-extrabold">
              <Sparkles aria-hidden className="size-5 text-amber-500" /> Suggested next
            </p>
            <ul className="mt-3 space-y-2">
              {suggestions.map(({ s, c }) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => {
                      actions.addTask({ title: `${s.name}: ${c!.title}`, date: selected, subject: s.id, minutes: 30 });
                      toast("Added to plan");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-surface-2"
                  >
                    <SubjectIcon id={s.id} size="sm" />
                    <span className="min-w-0 flex-1 truncate text-sm font-bold">{c!.title}</span>
                    <Plus aria-hidden className="size-4 text-brand-600" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}
