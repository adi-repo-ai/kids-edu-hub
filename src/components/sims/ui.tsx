"use client";

import { FlaskConical } from "lucide-react";
import { useEffect, useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { strings, useT } from "@/lib/i18n";

const S = strings({
  en: { interactive: "Interactive simulation" },
  hi: { interactive: "इंटरैक्टिव सिमुलेशन" },
});

/** Card that frames every simulation inside a lesson. */
export function SimFrame({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  const t = useT(S);
  return (
    <section aria-label={title} className="my-8 rounded-2xl border-2 border-brand-100 bg-surface p-4 text-base leading-normal text-ink sm:p-6">
      <p className="eyebrow flex items-center gap-1.5 text-brand-700">
        <FlaskConical aria-hidden className="size-4" /> {t.interactive}
      </p>
      <h3 className="mt-1 text-xl font-extrabold text-ink">{title}</h3>
      {intro && <p className="mt-1 text-[15px] text-ink-2">{intro}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** A big, touch-friendly range slider with a label and live value. */
export function SimSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  const id = useId();
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-bold text-ink-2">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-sm font-extrabold tabular-nums text-ink">
          {format ? format(value) : value}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 h-8 w-full cursor-pointer accent-brand-500"
      />
    </div>
  );
}

/** Small labelled number in the readout grid. */
export function Stat({ label, value, tone }: { label: string; value: ReactNode; tone?: "brand" | "green" | "coral" | "amber" }) {
  return (
    <div className="min-w-0 rounded-xl bg-surface-2 px-3 py-2">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-3">{label}</p>
      <p
        className={cn(
          "mt-0.5 truncate font-mono text-lg font-extrabold tabular-nums",
          tone === "brand" && "text-brand-700",
          tone === "green" && "text-green-700",
          tone === "coral" && "text-coral-700",
          tone === "amber" && "text-amber-700",
          !tone && "text-ink",
        )}
      >
        {value}
      </p>
    </div>
  );
}

/** Segmented buttons (aria-pressed). */
export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-xl bg-surface-2 p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "min-h-9 rounded-lg px-3 text-sm font-bold transition-colors",
            value === o.id ? "bg-surface text-brand-700 shadow-sm" : "text-ink-2 hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** True when the user prefers reduced motion. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Formats a number with up to `d` decimals, using a real minus sign. */
export const num = (v: number, d = 2) => {
  if (!Number.isFinite(v)) return "∞";
  const r = Number(v.toFixed(d));
  return (Object.is(r, -0) ? 0 : r).toString().replace("-", "−");
};
