import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { StarDoodle } from "./Doodles";

/** Endless scrolling strip. The track is duplicated so the loop is seamless; the copy is hidden from AT. */
export function Marquee({ items, className, tilt = -1.5 }: { items: ReactNode[]; className?: string; tilt?: number }) {
  const row = (hidden?: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-8 whitespace-nowrap">
          {it}
          <StarDoodle className="size-6 shrink-0 opacity-80" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("relative overflow-hidden border-y-[3px] border-ink py-3.5 [contain:inline-size]", className)} style={{ transform: `rotate(${tilt}deg)` }}>
      <div className="animate-marquee flex w-max hover:[animation-play-state:paused]">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
