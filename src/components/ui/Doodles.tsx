import { cn } from "@/lib/cn";

/*
 * Hand-drawn accents. All share one stroke language: 2.5px round-capped lines,
 * slightly wobbly paths, no fills except the sun-yellow highlighter.
 * Use at most one or two per view, always aria-hidden.
 */

type P = { className?: string };

export function Squiggle({ className, color = "var(--color-coral-500)" }: P & { color?: string }) {
  return (
    <svg viewBox="0 0 220 14" preserveAspectRatio="none" className={cn("pointer-events-none", className)} aria-hidden>
      <path
        d="M3 9c18-5 33-6 51-3 14 2 22 5 39 3 20-3 34-7 54-6 18 1 34 4 70 2"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Highlighter-marker swipe placed behind a word. */
export function Highlight({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("relative inline-block whitespace-nowrap", className)}>
      <span aria-hidden className="absolute inset-x-[-4px] bottom-[0.08em] top-[45%] -rotate-1 rounded-sm bg-sun-200" />
      <span className="relative">{children}</span>
    </span>
  );
}

export function StarDoodle({ className }: P) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 4.5l4.2 10 10.6.6-8.2 6.9 2.7 10.4L20 26.6l-9.3 5.8 2.7-10.4-8.2-6.9 10.6-.6z" />
    </svg>
  );
}

export function ArrowDoodle({ className }: P) {
  return (
    <svg viewBox="0 0 80 50" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8c14 22 34 32 66 30" />
      <path d="M60 28l11 10-13 7" />
    </svg>
  );
}

export function SparkDoodle({ className }: P) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M20 4v9M20 27v9M4 20h9M27 20h9M9 9l5 5M26 26l5 5M31 9l-5 5M14 26l-5 5" />
    </svg>
  );
}

export function AtomDoodle({ className }: P) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <ellipse cx="24" cy="24" rx="20" ry="8" />
      <ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(60 24 24)" />
      <ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(-60 24 24)" />
      <circle cx="24" cy="24" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function ProtractorDoodle({ className }: P) {
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M4 36h56M4 36a28 28 0 0 1 56 0" />
      <path d="M32 36a10 10 0 0 0-10-10" />
      <path d="M32 12v5M14 19l3 4M50 19l-3 4M8 30l4 1.5M56 30l-4 1.5" />
    </svg>
  );
}
