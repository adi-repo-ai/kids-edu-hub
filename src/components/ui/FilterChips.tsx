"use client";

import { cn } from "@/lib/cn";

/** Single-select filter group. Pills are used only here, so they always mean "filter". */
export function FilterChips<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "min-h-10 rounded-full border-2 border-ink px-4 text-sm font-bold transition-all duration-200 ease-[var(--ease-spring)]",
              on ? "animate-bounce-in -rotate-2 bg-ink text-white shadow-[3px_3px_0_0_var(--color-coral-500)]" : "bg-surface text-ink-2 hover:-translate-y-0.5 hover:bg-sun-100 hover:text-ink",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
