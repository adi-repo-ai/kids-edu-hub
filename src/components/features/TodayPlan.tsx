"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { subjectById } from "@/data/curriculum";
import { plannerTasks } from "@/data/student";
import { cn } from "@/lib/cn";
import { hue } from "@/lib/hue";
import { ProgressBar } from "../ui/Progress";

export function TaskCheck({ done, onToggle, label }: { done: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      aria-label={label}
      onClick={onToggle}
      className="grid size-11 shrink-0 place-items-center rounded-md"
    >
      <span className={cn("grid size-6 place-items-center rounded-md border-2 transition-colors", done ? "border-mint-500 bg-mint-500 text-white" : "border-line-strong bg-surface hover:border-ink-3")}>
        {done && <Check className="animate-pop size-4" strokeWidth={3} aria-hidden />}
      </span>
    </button>
  );
}

export function TodayPlan() {
  const [tasks, setTasks] = useState(plannerTasks.filter((t) => t.day === "Sat"));
  const done = tasks.filter((t) => t.done).length;
  return (
    <div>
      <ProgressBar value={Math.round((done / tasks.length) * 100)} hue="mint" label="Today's plan completed" size="sm" />
      <p className="mt-1.5 text-xs font-semibold text-ink-3" aria-live="polite">
        {done} of {tasks.length} done
      </p>
      <ul className="mt-3 space-y-1">
        {tasks.map((t) => {
          const s = subjectById(t.subject)!;
          return (
            <li key={t.id} className="-ml-2 flex items-center gap-1">
              <TaskCheck done={t.done} label={t.title} onToggle={() => setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))} />
              <div className="min-w-0 flex-1">
                <p className={cn("truncate text-[15px] font-semibold transition-colors", t.done && "text-ink-3 line-through")}>{t.title}</p>
                <p className="flex items-center gap-1.5 text-xs text-ink-3">
                  <span aria-hidden className={cn("size-2 rounded-full", hue[s.hue].fill)} />
                  {s.name} · {t.minutes} min
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
