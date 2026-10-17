"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

const stickers = [
  { label: "A+", pos: "left-[2%] top-[4%]", look: "size-16 rounded-full bg-coral-500 text-2xl text-ink", depth: 22, r: -12 },
  { label: "π", pos: "right-[4%] bottom-[30%]", look: "size-14 rounded-lg bg-royal-600 text-3xl text-white", depth: 34, r: 10 },
  { label: "H₂O", pos: "-left-[2%] bottom-[32%]", look: "h-11 rounded-full bg-mint-500 px-4 text-lg text-ink", depth: 16, r: 6 },
  { label: "शाबाश!", pos: "-right-[1%] top-[38%]", look: "h-12 rounded-md bg-lavender-600 px-3 text-lg text-white", depth: 28, r: -8 },
  { label: "1729", pos: "left-[38%] -top-[4%]", look: "h-10 rounded-sm bg-surface px-3 text-lg text-ink", depth: 12, r: 4 },
];

/** Floating stickers that drift against the pointer for a parallax effect. */
export function HeroStickers() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current?.closest("section");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      ref.current?.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => {
        const d = Number(el.dataset.depth);
        el.style.translate = `${-x * d}px ${-y * d}px`;
      });
    };
    root.addEventListener("pointermove", onMove);
    return () => root.removeEventListener("pointermove", onMove);
  }, []);
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-20 hidden sm:block">
      {stickers.map((s, i) => (
        <span key={s.label} data-depth={s.depth} className={cn("absolute transition-[translate] duration-300 ease-out", s.pos)}>
          <span
            className={cn("animate-float grid place-items-center border-[2.5px] border-ink font-display font-extrabold shadow-[3px_3px_0_0_var(--color-ink)]", s.look)}
            style={{ ["--r" as string]: `${s.r}deg`, animationDelay: `${i * -1.3}s` }}
          >
            {s.label}
          </span>
        </span>
      ))}
    </div>
  );
}
