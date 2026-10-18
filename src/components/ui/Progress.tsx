"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

function useAnimated(value: number) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setV(value));
    return () => cancelAnimationFrame(id);
  }, [value]);
  return v;
}

export function ProgressBar({ value, label, color = "bg-brand-500", size = "md", className, track = "bg-surface-2" }: { value: number; label: string; color?: string; size?: "sm" | "md" | "lg"; className?: string; track?: string }) {
  const v = useAnimated(Math.max(0, Math.min(100, value)));
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)} className={cn("overflow-hidden rounded-full", track, { sm: "h-1.5", md: "h-2.5", lg: "h-4" }[size], className)}>
      <div className={cn("h-full rounded-full transition-[width] duration-700 ease-out", color, size === "lg" && "stripes")} style={{ width: `${v}%` }} />
    </div>
  );
}

export function ProgressRing({ value, size = 56, stroke = 6, color = "#2e5bff", label, children }: { value: number; size?: number; stroke?: number; color?: string; label: string; children?: React.ReactNode }) {
  const v = useAnimated(Math.max(0, Math.min(100, value)));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-grid shrink-0 place-items-center" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${Math.round(value)}%`}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface-2)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (v / 100) * c} style={{ transition: "stroke-dashoffset 800ms var(--ease-out)" }} />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm font-extrabold tabular-nums">{children ?? `${Math.round(value)}%`}</span>
    </div>
  );
}
