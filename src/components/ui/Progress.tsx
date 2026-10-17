"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { hue as hues } from "@/lib/hue";
import type { Hue } from "@/lib/types";

/** Fills from 0 on mount and eases to new values when they change (700 ms, ease-out). */
function useAnimatedValue(value: number) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(id);
  }, [value]);
  return shown;
}

export function ProgressBar({
  value,
  hue = "royal",
  label,
  size = "md",
  showValue,
  striped = size === "md",
  className,
}: {
  value: number;
  hue?: Hue;
  label: string;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  /** Animated candy stripes; on by default for md/lg bars. */
  striped?: boolean;
  className?: string;
}) {
  const shown = useAnimatedValue(value);
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        className={cn("relative flex-1 overflow-hidden rounded-full bg-sunken", { sm: "h-1.5", md: "h-3", lg: "h-5 border-2 border-ink" }[size])}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-1000 ease-[var(--ease-spring)]", hues[hue].fill, striped && "stripes")}
          style={{ width: `${shown}%` }}
        />
      </div>
      {showValue && <span className="w-9 text-right text-sm font-semibold tabular-nums text-ink-2">{value}%</span>}
    </div>
  );
}

export function ProgressRing({
  value,
  hue = "royal",
  size = 56,
  stroke = 6,
  label,
  children,
}: {
  value: number;
  hue?: Hue;
  size?: number;
  stroke?: number;
  label: string;
  children?: React.ReactNode;
}) {
  const shown = useAnimatedValue(value);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-grid shrink-0 place-items-center" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${value}%`}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-sunken)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={hues[hue].hex}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (shown / 100) * c}
          style={{ transition: "stroke-dashoffset 800ms var(--ease-out)" }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm font-bold tabular-nums">{children ?? `${value}%`}</span>
    </div>
  );
}
