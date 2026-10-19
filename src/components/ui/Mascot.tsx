import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type MascotMood = "happy" | "cheer" | "think" | "oops" | "wave";
export type MascotHat = "grad-cap" | "cricket-cap" | "party-hat" | "crown" | "safa";
export type MascotGlasses = "round-specs" | "sunglasses";
export type MascotNeck = "scarf" | "bow-tie" | "medal" | "marigold";
export type MascotColor = "green" | "purple" | "orange" | "pink";
export type MascotExtra = "diya";

/** Optional outfit from Gyani's shop. Without it Gyani is drawn exactly as before. */
export interface MascotOutfit {
  hat?: MascotHat;
  glasses?: MascotGlasses;
  neck?: MascotNeck;
  color?: MascotColor;
  extra?: MascotExtra;
}

const INK = "#1a1d3a";
const COLORS: Record<MascotColor | "blue", { body: string; wing: string }> = {
  blue: { body: "#4361ee", wing: "#2f4bdb" },
  green: { body: "#2fb36d", wing: "#1f8a52" },
  purple: { body: "#8b5cf6", wing: "#6d3fd6" },
  orange: { body: "#fb8c2b", wing: "#dc6a0c" },
  pink: { body: "#f472b6", wing: "#d9468f" },
};

/**
 * Gyani, the Kaksha owl. One original vector character used for encouragement:
 * greetings, hints and celebrations. Never used for errors that block the user.
 */
export function Mascot({
  mood = "happy",
  size = 120,
  className,
  still,
  hat,
  glasses,
  neck,
  color,
  extra,
}: { mood?: MascotMood; size?: number; className?: string; still?: boolean } & MascotOutfit) {
  const fur = COLORS[color ?? "blue"] ?? COLORS.blue;
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
          fill={fur.wing}
          stroke="#1a1d3a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>
      {/* right wing */}
      <g style={{ transformOrigin: "94px 62px", transformBox: "view-box" }} className={cn(wingsUp && !still && "animate-wiggle-loop")}>
        <path
          d={wingsUp || mood === "wave" ? "M92 66 C112 50 114 30 106 22 C98 34 90 46 84 60 Z" : "M90 58 C106 66 108 88 98 100 C92 90 86 76 84 64 Z"}
          fill={fur.wing}
          stroke="#1a1d3a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>
      {/* body */}
      <path d="M60 18 C30 18 24 44 26 70 C28 98 42 114 60 114 C78 114 92 98 94 70 C96 44 90 18 60 18 Z" fill={fur.body} stroke="#1a1d3a" strokeWidth="2.5" />
      {/* ear tufts */}
      <path d="M34 30 L28 10 L46 24 Z M86 30 L92 10 L74 24 Z" fill={fur.body} stroke="#1a1d3a" strokeWidth="2.5" strokeLinejoin="round" />
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
      {glasses && <Glasses kind={glasses} />}
      {neck && <Neck kind={neck} />}
      {extra && <Extra kind={extra} />}
      {hat && <Hat kind={hat} />}
    </svg>
  );
}

/* ───────── Outfit pieces, drawn in the owl's 120×130 coordinate space ───────── */

function Hat({ kind }: { kind: MascotHat }) {
  switch (kind) {
    case "grad-cap":
      return (
        <g>
          <path d="M43 26 L44 12 L76 12 L77 26 Q60 20 43 26 Z" fill="#23264d" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M60 0 L94 9 L60 18 L26 9 Z" fill="#2c3060" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M60 9 L88 12 L88 24" fill="none" stroke="#f5b400" strokeWidth="2" strokeLinecap="round" />
          <path d="M85 23 h6 l1 7 h-8 Z" fill="#f5b400" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
          <circle cx="60" cy="9" r="2.2" fill="#f5b400" />
        </g>
      );
    case "cricket-cap":
      return (
        <g>
          <path d="M80 22 Q98 21 104 28 Q92 31 78 27 Z" fill="#1d4ed8" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M36 26 C34 4 86 4 84 26 Q60 19 36 26 Z" fill="#5ac8fa" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M60 8 C58 14 58 18 60 22 M47 11 C45 16 45 20 46 24 M73 11 C75 16 75 20 74 24" fill="none" stroke="#1d4ed8" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="60" cy="7.5" r="2.4" fill="#1d4ed8" stroke={INK} strokeWidth="1.2" />
        </g>
      );
    case "party-hat":
      return (
        <g transform="rotate(-12 60 24)">
          <path d="M47 25 L60 -10 L73 25 Q60 29 47 25 Z" fill="#ff6b9a" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M51 14 L68 11 M55 3 L64 1 M49 21 L71 19" stroke="#ffe08a" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="60" cy="-11" r="4.5" fill="#ffc93c" stroke={INK} strokeWidth="1.8" />
        </g>
      );
    case "crown":
      return (
        <g>
          <path d="M40 27 L37 5 L49 15 L60 0 L71 15 L83 5 L80 27 Q60 22 40 27 Z" fill="#ffc93c" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M41 21 Q60 16 79 21" fill="none" stroke="#e0a100" strokeWidth="1.6" />
          <circle cx="60" cy="16" r="3" fill="#f2545b" stroke={INK} strokeWidth="1.2" />
          <circle cx="48" cy="19.5" r="2.3" fill="#3ccf91" stroke={INK} strokeWidth="1.1" />
          <circle cx="72" cy="19.5" r="2.3" fill="#5ac8fa" stroke={INK} strokeWidth="1.1" />
          <circle cx="37" cy="5" r="2" fill="#fff4c2" stroke={INK} strokeWidth="1" />
          <circle cx="60" cy="0" r="2" fill="#fff4c2" stroke={INK} strokeWidth="1" />
          <circle cx="83" cy="5" r="2" fill="#fff4c2" stroke={INK} strokeWidth="1" />
        </g>
      );
    case "safa":
      return (
        <g>
          <path d="M86 24 C98 36 100 54 94 66 C90 54 88 42 80 30 Z" fill="#ff9933" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <path d="M27 30 C23 8 46 -3 60 -3 C74 -3 97 8 93 30 C80 22 40 22 27 30 Z" fill="#ff9933" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M30 22 C44 8 76 6 90 20 M34 13 C48 3 74 3 86 12 M33 27 C48 14 70 12 88 25" fill="none" stroke="#e0611a" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M64 0 C64 -12 78 -16 82 -8 C76 -8 70 -4 68 2 Z" fill="#ffd166" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="60" cy="19" r="3.4" fill="#f2545b" stroke={INK} strokeWidth="1.4" />
          <circle cx="60" cy="19" r="1.2" fill="#fff4c2" />
        </g>
      );
  }
}

function Glasses({ kind }: { kind: MascotGlasses }) {
  if (kind === "sunglasses")
    return (
      <g>
        <path d="M28 36 H60 V41 Q60 56 44 56 Q28 56 28 41 Z M60 36 H92 V41 Q92 56 76 56 Q60 56 60 41 Z" fill="#1a1d3a" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <path d="M28 37 L22 34 M92 37 L98 34" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M34 41 l6 -3 M66 41 l6 -3" stroke="#fff" strokeOpacity="0.7" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    );
  return (
    <g fill="rgb(160 210 255 / 0.18)" stroke="#b07a12" strokeWidth="2.6">
      <circle cx="45" cy="44" r="16.5" />
      <circle cx="75" cy="44" r="16.5" />
      <path d="M28.5 41 L22 37 M91.5 41 L98 37 M58 39 q2 -3 4 0" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Points along the garland curve (a quadratic Bézier across the chest). */
const GARLAND = Array.from({ length: 15 }, (_, i) => {
  const t = i / 14;
  const u = 1 - t;
  return { x: u * u * 29 + 2 * t * u * 60 + t * t * 91, y: u * u * 64 + 2 * t * u * 118 + t * t * 64 };
});

function Neck({ kind }: { kind: MascotNeck }) {
  switch (kind) {
    case "scarf":
      return (
        <g stroke={INK} strokeWidth="2" strokeLinejoin="round">
          <path d="M37 76 L31 102 L44 101 L47 80 Z" fill="#e63946" />
          <path d="M33 92 L45 92" stroke="#ffd166" strokeWidth="2.4" />
          <path d="M31 102 l-1 4 M35 102 l0 4 M39 101.5 l0 4 M43 101 l1 4" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M27 66 Q60 80 93 66 L93 76 Q60 90 27 76 Z" fill="#e63946" />
          <path d="M28 71 Q60 85 92 71" fill="none" stroke="#ffd166" strokeWidth="2.4" />
        </g>
      );
    case "bow-tie":
      return (
        <g stroke={INK} strokeWidth="2" strokeLinejoin="round">
          <path d="M60 74 L46 66 L46 82 Z M60 74 L74 66 L74 82 Z" fill="#e63946" />
          <circle cx="60" cy="74" r="4" fill="#c22a36" />
          <circle cx="51" cy="72" r="1.2" fill="#fff" stroke="none" />
          <circle cx="69" cy="72" r="1.2" fill="#fff" stroke="none" />
        </g>
      );
    case "medal":
      return (
        <g stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
          <path d="M42 64 L49 64 L62 88 L55 88 Z" fill="#2e5bff" />
          <path d="M78 64 L71 64 L58 88 L65 88 Z" fill="#f2545b" />
          <circle cx="60" cy="94" r="9" fill="#ffc93c" strokeWidth="2.2" />
          <path d="M60 88.5 l1.7 3.5 3.8 .5 -2.8 2.6 .7 3.8 -3.4 -1.8 -3.4 1.8 .7 -3.8 -2.8 -2.6 3.8 -.5 Z" fill="#fff4c2" strokeWidth="1" />
        </g>
      );
    case "marigold":
      return (
        <g stroke="#b45309" strokeWidth="1">
          {GARLAND.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4.3" fill={i % 2 ? "#ffc93c" : "#ff8c1a"} />
          ))}
          <path d="M57 95 L54 106 M63 95 L66 106" stroke="#2f9e44" strokeWidth="2" strokeLinecap="round" />
          <circle cx="54" cy="107" r="2.6" fill="#ff8c1a" />
          <circle cx="66" cy="107" r="2.6" fill="#ffc93c" />
        </g>
      );
  }
}

function Extra({ kind }: { kind: MascotExtra }) {
  if (kind !== "diya") return null;
  return (
    <g>
      <circle cx="98" cy="108" r="9" fill="#ffd166" opacity="0.35" />
      <path d="M98 113 C93 107 97 101 98 97 C100 101 103 107 98 113 Z" fill="#ffb703" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M98 112 C96.5 109 98 106 98 104.5 C99 106 100 109 98 112 Z" fill="#fff4c2" />
      <path d="M84 113 Q98 128 112 113 Q98 117 84 113 Z" fill="#c2410c" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M90 118 q3 2 6 0 q3 2 6 0" fill="none" stroke="#ffd166" strokeWidth="1.4" strokeLinecap="round" />
    </g>
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
