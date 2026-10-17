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
              "min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors",
              on ? "border-ink bg-ink text-white" : "border-line-strong bg-surface text-ink-2 hover:border-ink-3 hover:text-ink",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
