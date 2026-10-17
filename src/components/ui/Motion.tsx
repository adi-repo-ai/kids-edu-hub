"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Activates every `[data-reveal]` element on the page: anything below the fold is
 * hidden until scrolled into view, then rises in with a stagger from `--i`.
 * Content is visible without JS and under reduced motion.
 */
export function RevealController() {
  useEffect(() => {
    if (reduced()) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal=shown])"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.reveal = "shown";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) el.dataset.reveal = "shown";
      else {
        el.dataset.reveal = "pending";
        io.observe(el);
      }
    }
    return () => io.disconnect();
  }, []);
  return null;
}

/** Counts up to `value` the first time it scrolls into view. */
export function CountUp({ value, duration = 1200, prefix = "", suffix = "", className }: { value: number; duration?: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (reduced()) return;
    setShown(0);
    const el = ref.current!;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);
  return (
    <span ref={ref} className={cn("tabular-nums", className)} aria-label={`${prefix}${value.toLocaleString("en-IN")}${suffix}`}>
      <span aria-hidden>
        {prefix}
        {shown.toLocaleString("en-IN")}
        {suffix}
      </span>
    </span>
  );
}

/** Pointer-driven 3D tilt with a soft glare. Fine pointers only. */
export function Tilt({ children, className, max = 8, style }: { children: ReactNode; className?: string; max?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || reduced()) return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateY(-4px)`;
    el.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={style}
      className={cn(
        "group/tilt relative transition-transform duration-300 ease-out will-change-transform [transform-style:preserve-3d]",
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        style={{ background: "radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgb(255 255 255 / 0.35), transparent 55%)" }}
      />
    </div>
  );
}

/** Cycles through words with a little drop-in, e.g. in a headline. */
export function RotatingWord({ words, interval = 2200, className }: { words: string[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced()) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);
  return (
    <span className={cn("relative inline-grid", className)}>
      {/* reserve the width of the longest word so the line doesn't jump */}
      <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {words.reduce((a, b) => (b.length > a.length ? b : a))}
      </span>
      <span key={i} className="col-start-1 row-start-1 whitespace-nowrap [animation:word-in_450ms_var(--ease-spring)_both]">
        {words[i]}
      </span>
      <span className="sr-only">{words.join(", ")}</span>
    </span>
  );
}

/** Coloured curtain that lifts off every page on arrival. */
export function PageCurtain() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (reduced()) return setGone(true);
    const t = setTimeout(() => setGone(true), 900);
    return () => clearTimeout(t);
  }, []);
  if (gone) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[80]">
      {["bg-royal-600", "bg-sun-400", "bg-coral-500"].map((c, i) => (
        <div key={c} className={cn("absolute inset-0", c)} style={{ animation: `curtain 560ms ${i * 90}ms cubic-bezier(.7,0,.3,1) both`, zIndex: 3 - i }} />
      ))}
    </div>
  );
}
