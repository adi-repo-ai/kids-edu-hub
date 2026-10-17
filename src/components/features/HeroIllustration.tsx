import { Check } from "lucide-react";
import { ArrowDoodle, ProtractorDoodle, StarDoodle } from "../ui/Doodles";

/**
 * An original "open exercise book" composition: a ruled page with a worked
 * example, a sticky note and a progress slip. Built from HTML + SVG so it
 * stays crisp, themeable and lightweight (no raster images).
 */
export function HeroIllustration() {
  return (
    <div className="relative mx-auto aspect-[5/4.6] w-full max-w-[520px] select-none" aria-hidden>
      {/* back page */}
      <div className="absolute inset-[6%_4%_4%_10%] rotate-[4deg] rounded-lg border border-line bg-lavender-50" />

      {/* main ruled page */}
      <div className="ruled absolute inset-[2%_8%_8%_4%] -rotate-[2deg] overflow-hidden rounded-lg border border-line-strong shadow-lift">
        <div className="pl-16 pr-6 pt-[30px] font-display leading-8 text-ink">
          <p className="text-sm font-bold text-coral-700">17 Oct · Revision</p>
          <p className="text-[22px] font-extrabold leading-8">A Square and A Cube</p>
          <div className="mt-2 flex items-start gap-5">
            <svg viewBox="0 0 96 96" className="w-[34%] max-w-[120px] shrink-0">
              {Array.from({ length: 16 }).map((_, i) => (
                <rect
                  key={i}
                  x={4 + (i % 4) * 22}
                  y={4 + Math.floor(i / 4) * 22}
                  width="20"
                  height="20"
                  rx="3"
                  fill={i % 4 === 3 || i >= 12 ? "var(--color-sun-200)" : "var(--color-royal-100)"}
                  stroke={i % 4 === 3 || i >= 12 ? "var(--color-sun-500)" : "var(--color-royal-500)"}
                  strokeWidth="1.5"
                />
              ))}
            </svg>
            <div className="space-y-0 text-[17px] font-semibold">
              <p>3² = 9</p>
              <p>
                3² + <span className="text-sun-800">7</span> = 4²
              </p>
              <p className="text-royal-700">4 × 4 = 16 ✓</p>
              <p className="text-ink-3">next: 5² = ?</p>
            </div>
          </div>
        </div>
        <ProtractorDoodle className="absolute bottom-5 right-6 w-20 text-royal-500/70" />
      </div>

      {/* sticky note */}
      <div className="absolute right-0 top-[4%] w-[38%] rotate-[5deg] rounded-sm bg-sun-400 p-4 shadow-[0_8px_16px_-6px_rgb(26_29_58/0.3)]">
        <p className="font-display text-[15px] font-bold leading-snug text-ink">
          Half-yearly
          <br />
          in 10 days!
        </p>
        <p className="mt-1 text-xs font-semibold text-ink/70">Maths on Tue 27th</p>
      </div>

      {/* progress slip */}
      <div className="absolute bottom-0 left-0 w-[58%] rounded-lg border border-line bg-surface p-4 shadow-lift">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">Chapter progress</p>
          <span className="rounded-sm bg-mint-100 px-1.5 text-xs font-bold text-mint-700">+12%</span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-sunken">
          <div className="h-full w-[60%] rounded-full bg-royal-500" />
        </div>
        <ul className="mt-3 space-y-1.5 text-[13px] text-ink-2">
          {["Square patterns", "Locker puzzle"].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="grid size-4 place-items-center rounded-full bg-mint-500 text-white">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>

      <StarDoodle className="absolute -left-2 top-[18%] w-9 text-coral-500" />
      <ArrowDoodle className="absolute bottom-[26%] right-[6%] w-16 rotate-[160deg] text-ink-3" />
    </div>
  );
}
