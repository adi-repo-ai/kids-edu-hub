"use client";

import { Check } from "lucide-react";
import { useRef, useState } from "react";
import { confettiFrom } from "@/lib/confetti";
import { subjectById } from "@/data/curriculum";
import { plannerTasks } from "@/data/student";
import { cn } from "@/lib/cn";
import { hue } from "@/lib/hue";
import { MascotBubble } from "../ui/Mascot";
import { ProgressBar } from "../ui/Progress";

/** Checkbox that throws a little confetti when ticked. */
export function TaskCheck({ done, onToggle, label }: { done: boolean; onToggle: () => void; label: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={done}
      aria-label={label}
      onClick={() => {
        if (!done) confettiFrom(ref.current, { count: 36, spread: 50, power: 0.6 });
        onToggle();
      }}
      className="group grid size-11 shrink-0 place-items-center rounded-md"
    >
      <span className={cn("grid size-7 place-items-center rounded-md border-[2.5px] transition-all duration-200", done ? "rotate-[-6deg] scale-110 border-ink bg-mint-500 text-ink" : "border-ink bg-surface group-hover:bg-sun-100 group-hover:scale-110")}>
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
      {done === tasks.length && (
        <MascotBubble className="mt-3 text-lg">All done for today! Gyani is proud of you.</MascotBubble>
      )}
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
