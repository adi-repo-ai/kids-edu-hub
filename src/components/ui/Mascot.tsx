import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type MascotMood = "happy" | "cheer" | "think" | "oops" | "wave";

/**
 * Gyani, the Kaksha owl. One original vector character used for encouragement:
 * greetings, hints and celebrations. Never used for errors that block the user.
 */
export function Mascot({ mood = "happy", size = 120, className, still }: { mood?: MascotMood; size?: number; className?: string; still?: boolean }) {
  const look = mood === "think" ? { x: 2.5, y: -3 } : mood === "oops" ? { x: 0, y: 2 } : { x: 1, y: 0 };
  const wingsUp = mood === "cheer";
  return (
    <svg
      viewBox="0 0 120 130"
      width={size}
      height={(size * 130) / 120}
      className={cn("shrink-0 overflow-visible", !still && "animate-float", className)}
      role="img"
      aria-label={`Gyani the owl looks ${mood === "oops" ? "surprised" : mood === "think" ? "thoughtful" : "happy"}`}
    >
      {/* shadow */}
      <ellipse cx="60" cy="125" rx="30" ry="4" fill="rgb(26 29 58 / 0.12)" />
      {/* feet */}
      <path d="M46 112 l-4 8 M50 112 v9 M54 112 l4 8 M66 112 l-4 8 M70 112 v9 M74 112 l4 8" stroke="#f5b400" strokeWidth="3.4" strokeLinecap="round" />
      {/* left wing */}
      <g style={{ transformOrigin: "26px 62px", transformBox: "view-box" }} className={cn(wingsUp && !still && "animate-wiggle-loop", mood === "wave" && !still && "animate-wiggle-loop")}>
        <path
          d={wingsUp ? "M28 66 C8 50 6 30 14 22 C22 34 30 46 36 60 Z" : "M30 58 C14 66 12 88 22 100 C28 90 34 76 36 64 Z"}
          fill="#2f4bdb"
          stroke="#1a1d3a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>
      {/* right wing */}
      <g style={{ transformOrigin: "94px 62px", transformBox: "view-box" }} className={cn(wingsUp && !still && "animate-wiggle-loop")}>
        <path
          d={wingsUp || mood === "wave" ? "M92 66 C112 50 114 30 106 22 C98 34 90 46 84 60 Z" : "M90 58 C106 66 108 88 98 100 C92 90 86 76 84 64 Z"}
          fill="#2f4bdb"
          stroke="#1a1d3a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>
      {/* body */}
      <path d="M60 18 C30 18 24 44 26 70 C28 98 42 114 60 114 C78 114 92 98 94 70 C96 44 90 18 60 18 Z" fill="#4361ee" stroke="#1a1d3a" strokeWidth="2.5" />
      {/* ear tufts */}
      <path d="M34 30 L28 10 L46 24 Z M86 30 L92 10 L74 24 Z" fill="#4361ee" stroke="#1a1d3a" strokeWidth="2.5" strokeLinejoin="round" />
      {/* belly with feather scallops */}
      <path d="M60 58 C44 58 38 74 40 90 C42 104 50 110 60 110 C70 110 78 104 80 90 C82 74 76 58 60 58 Z" fill="#fff0bf" stroke="#1a1d3a" strokeWidth="2" />
      <path d="M48 76 q3 4 6 0 q3 4 6 0 q3 4 6 0 q3 4 6 0 M46 88 q3 4 6 0 q3 4 6 0 q3 4 6 0 q3 4 6 0 q3 4 6 0 M50 100 q3 4 6 0 q3 4 6 0 q3 4 6 0 q3 4 6 0" fill="none" stroke="#f5b400" strokeWidth="2" strokeLinecap="round" />
      {/* eyes */}
      <circle cx="45" cy="44" r="14" fill="#fff" stroke="#1a1d3a" strokeWidth="2.5" />
      <circle cx="75" cy="44" r="14" fill="#fff" stroke="#1a1d3a" strokeWidth="2.5" />
      {mood === "cheer" ? (
        <path d="M37 47 q8 -10 16 0 M67 47 q8 -10 16 0" fill="none" stroke="#1a1d3a" strokeWidth="3.4" strokeLinecap="round" />
      ) : (
        <g style={{ transformOrigin: "60px 44px", transformBox: "view-box" }} className={cn(!still && "animate-blink")}>
          <circle cx={45 + look.x} cy={44 + look.y} r={mood === "oops" ? 4 : 6} fill="#1a1d3a" />
          <circle cx={75 + look.x} cy={44 + look.y} r={mood === "oops" ? 4 : 6} fill="#1a1d3a" />
          <circle cx={47 + look.x} cy={41 + look.y} r="1.8" fill="#fff" />
          <circle cx={77 + look.x} cy={41 + look.y} r="1.8" fill="#fff" />
        </g>
      )}
      {/* spectacles bridge, Gyani's trademark */}
      <path d="M59 42 q1 -3 2 0" fill="none" stroke="#1a1d3a" strokeWidth="2.5" strokeLinecap="round" />
      {mood === "think" && <path d="M64 26 q10 -6 20 0" fill="none" stroke="#1a1d3a" strokeWidth="2.5" strokeLinecap="round" />}
      {/* beak */}
      {mood === "oops" ? (
        <ellipse cx="60" cy="60" rx="4" ry="5" fill="#f26b45" stroke="#1a1d3a" strokeWidth="2" />
      ) : (
        <path d="M54 56 L66 56 L60 66 Z" fill="#ffc93c" stroke="#1a1d3a" strokeWidth="2" strokeLinejoin="round" />
      )}
      {/* cheeks */}
      <circle cx="35" cy="60" r="4" fill="#ff8fab" opacity="0.7" />
      <circle cx="85" cy="60" r="4" fill="#ff8fab" opacity="0.7" />
      {mood === "oops" && <path d="M92 30 q4 6 0 9 q-4 -3 0 -9 Z" fill="#9ce6c7" stroke="#1a1d3a" strokeWidth="1.5" />}
    </svg>
  );
}

/** Speech bubble in Gyani's handwriting. `side` is where the tail points. */
export function MascotBubble({ children, side = "left", className }: { children: ReactNode; side?: "left" | "bottom"; className?: string }) {
  return (
    <div
      className={cn(
        "animate-bounce-in relative rounded-xl border-2 border-ink bg-surface px-4 py-2.5 font-hand text-xl leading-tight text-ink shadow-[3px_3px_0_0_var(--color-ink)]",
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          "absolute size-3.5 rotate-45 border-ink bg-surface",
          side === "left" ? "-left-[9px] top-1/2 -mt-[7px] border-b-2 border-l-2" : "-bottom-[9px] left-8 border-b-2 border-r-2",
        )}
      />
    </div>
  );
}
