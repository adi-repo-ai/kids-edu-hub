import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { hue as hues } from "@/lib/hue";
import type { Hue } from "@/lib/types";

/** Small rectangular label. Deliberately not a pill: pills are reserved for filter chips. */
export function Tag({ hue, children, className }: { hue?: Hue; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs font-semibold leading-5",
        hue ? hues[hue].chip : "bg-sunken text-ink-2",
        className,
      )}
    >
      {children}
    </span>
  );
}
