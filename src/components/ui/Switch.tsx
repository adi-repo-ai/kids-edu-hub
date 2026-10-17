"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export function Switch({ label, description, defaultOn = false }: { label: string; description?: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="font-semibold">{label}</p>
        {description && <p className="text-sm text-ink-3">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn(!on)}
        className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200", on ? "bg-mint-600" : "bg-line-strong")}
      >
        <span className={cn("absolute top-1 size-5 rounded-full bg-white shadow transition-[left] duration-200 ease-out", on ? "left-6" : "left-1")} />
      </button>
    </div>
  );
}
