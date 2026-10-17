import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";
import { hue } from "@/lib/hue";
import type { Badge } from "@/lib/types";

/** Scalloped "school stamp" outline, generated once. */
const scallop = (() => {
  const n = 14;
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n;
    const r = i % 2 === 0 ? 30 : 27;
    pts.push(`${(32 + r * Math.cos(a)).toFixed(2)},${(32 + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
})();

export function BadgeMedal({ badge, size = 64 }: { badge: Badge; size?: number }) {
  const locked = !badge.earned;
  return (
    <div className="group flex flex-col items-center text-center">
      <div
        className={cn("relative transition-transform duration-700 ease-[var(--ease-spring)]", locked ? "group-hover:animate-wiggle" : "group-hover:rotate-[360deg] group-hover:scale-110")}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 64 64" className="size-full" aria-hidden>
          <polygon points={scallop} fill={locked ? "var(--color-sunken)" : hue[badge.hue].hex} stroke={locked ? "var(--color-line-strong)" : "var(--color-ink)"} strokeWidth="1.5" strokeDasharray={locked ? "3 3" : undefined} />
          <circle cx="32" cy="32" r="19" fill={locked ? "var(--color-surface)" : "var(--color-surface)"} stroke={locked ? "var(--color-line-strong)" : "var(--color-ink)"} strokeWidth="1.5" />
        </svg>
        <span className={cn("absolute inset-0 grid place-items-center font-display font-extrabold tracking-tight", locked ? "text-ink-3" : hue[badge.hue].text)} style={{ fontSize: size * 0.24 }}>
          {locked ? <Lock className="size-4" aria-hidden /> : badge.name.split(" ").map((w) => w[0]).join("")}
        </span>
      </div>
      <p className="mt-2 text-sm font-bold leading-tight">{badge.name}</p>
      <p className="mt-0.5 text-xs text-ink-3">{locked ? `${badge.progress}% there` : badge.earned}</p>
      <span className="sr-only">{badge.description}</span>
    </div>
  );
}
