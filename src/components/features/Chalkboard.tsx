import { ArrowRight } from "lucide-react";
import { ButtonLink } from "../ui/Button";

/** "Fact of the day" written on a classroom blackboard; chalk strokes draw in on reveal. */
export function Chalkboard() {
  return (
    <div data-reveal className="rounded-[20px] border-[14px] border-wood shadow-[0_18px_40px_-16px_rgb(26_29_58/0.55)]">
      <div className="chalkboard relative overflow-hidden rounded-[6px] px-6 pb-16 pt-8 sm:px-12 sm:pt-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="chalk text-2xl text-chalk-yellow sm:text-3xl">Fact of the day · 17 Oct</p>
            <p className="chalk mt-2 text-[64px] font-bold leading-none sm:text-[96px]">1729</p>
            <div className="chalk mt-3 space-y-1 text-3xl sm:text-4xl">
              <p>
                = 1<sup>3</sup> + 12<sup>3</sup>
              </p>
              <p>
                = 9<sup>3</sup> + 10<sup>3</sup>
              </p>
            </div>
            <svg viewBox="0 0 300 20" className="draw mt-2 w-64 overflow-visible" aria-hidden>
              <path pathLength={1} d="M4 12 C70 4 140 18 296 8" fill="none" stroke="var(--color-chalk-pink)" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <p className="chalk mt-4 max-w-md text-2xl leading-snug opacity-90">
              The smallest number you can write as the sum of two cubes in two different ways. Ramanujan spotted it from a taxi number!
            </p>
          </div>

          {/* chalk cube, drawn stroke by stroke */}
          <svg viewBox="0 0 220 220" className="draw mx-auto w-48 sm:w-60" aria-hidden fill="none" stroke="var(--color-chalk)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path pathLength={1} style={{ ["--d" as string]: 0 }} d="M40 80 L130 80 L130 170 L40 170 Z" />
            <path pathLength={1} style={{ ["--d" as string]: 1 }} d="M40 80 L90 40 L180 40 L130 80" />
            <path pathLength={1} style={{ ["--d" as string]: 2 }} d="M180 40 L180 130 L130 170" />
            <path pathLength={1} style={{ ["--d" as string]: 3 }} d="M60 196 q20 -10 40 0 t40 0" stroke="var(--color-chalk-yellow)" />
            <path pathLength={1} style={{ ["--d" as string]: 3 }} d="M150 104 l18 0 M159 95 l0 18" stroke="var(--color-chalk-pink)" />
          </svg>
        </div>

        <div className="mt-6">
          <ButtonLink href="/practice/squares-quick-check" variant="accent" iconRight={<ArrowRight className="size-4" aria-hidden />}>
            Try 6 cube & square puzzles
          </ButtonLink>
        </div>

        {/* chalk ledge */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-8 bg-wood/90">
          <span className="absolute bottom-3 left-[12%] h-2.5 w-12 rotate-3 rounded-full bg-chalk" />
          <span className="absolute bottom-3 left-[22%] h-2.5 w-8 -rotate-2 rounded-full bg-chalk-yellow" />
          <span className="absolute bottom-2.5 right-[14%] h-4 w-20 rounded-sm bg-[#3b2a1f]">
            <span className="absolute inset-x-0 top-0 h-1.5 rounded-t-sm bg-[#c9b8a6]" />
          </span>
        </div>
      </div>
    </div>
  );
}
