"use client";

import { ArrowLeft, ArrowRight, Check, Lightbulb, RotateCcw, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fireConfetti } from "@/lib/confetti";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "../ui/Button";
import { Highlight } from "../ui/Doodles";
import { Mascot, MascotBubble } from "../ui/Mascot";
import { ProgressBar } from "../ui/Progress";
import { useAppState } from "./AppState";

/* ───────────────────────── Tile grid ───────────────────────── */

/** `frame` fixes the grid to a constant cell size so a growing square visibly grows. */
function TileGrid({ rows, cols, count, frame, highlightFrom, label }: { rows: number; cols: number; count?: number; frame: number; highlightFrom?: number; label: string }) {
  const size = Math.max(rows, cols, frame);
  return (
    <div
      role="img"
      aria-label={label}
      className="graph-paper grid aspect-square w-full max-w-[380px] place-items-center rounded-xl border-[3px] border-ink p-4 shadow-[6px_6px_0_0_var(--color-ink)]"
    >
      <div
        className="grid w-full gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`, aspectRatio: "1" }}
      >
        {Array.from({ length: count ?? rows * cols }).map((_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const isNew = highlightFrom !== undefined && (r >= highlightFrom || c >= highlightFrom);
          return (
            <span
              key={`${rows}-${cols}-${i}`}
              className={cn("animate-pop rounded-[3px] border", isNew ? "border-coral-600 bg-coral-200" : "border-royal-500 bg-royal-200")}
              style={{ gridRow: r + 1, gridColumn: c + 1, animationDelay: `${Math.min(i * 6, 300)}ms` }}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────────── Feedback ───────────────────────── */

function Feedback({ state, children }: { state: "correct" | "wrong" | null; children: React.ReactNode }) {
  return (
    <div aria-live="polite" className="min-h-[3.5rem]">
      {state && (
        <p
          className={cn(
            "animate-rise flex items-start gap-2 rounded-md border px-3.5 py-3 text-[15px]",
            state === "correct" ? "border-mint-200 bg-mint-50 text-mint-700" : "border-coral-200 bg-coral-50 text-coral-700",
          )}
        >
          {state === "correct" ? <Check aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={3} /> : <X aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={3} />}
          <span>{children}</span>
        </p>
      )}
    </div>
  );
}

/* ───────────────────────── Steps ───────────────────────── */

function StepBuild({ onSolved }: { onSolved: () => void }) {
  const [n, setN] = useState(3);
  const solved = n === 6;
  return (
    <Split
      text={
        <>
          <h2 className="text-2xl font-extrabold">A square number is an area</h2>
          <p>
            Arrange tiles in rows and columns. When the number of rows equals the number of columns, the tiles make a square, and the total is a <Highlight>square number</Highlight>.
          </p>
          <p className="font-semibold text-ink">Your turn: build a square using exactly 36 tiles.</p>
        </>
      }
      canvas={
        <>
          <TileGrid rows={n} cols={n} frame={10} label={`${n} by ${n} square of ${n * n} tiles`} />
          <div className="w-full max-w-[380px]">
            <label htmlFor="side" className="flex items-baseline justify-between text-sm font-semibold">
              Side length
              <span className="font-display text-2xl font-extrabold tabular-nums">
                {n} × {n} = <span className="text-royal-700">{n * n}</span>
              </span>
            </label>
            <input
              id="side"
              type="range"
              min={1}
              max={10}
              value={n}
              onChange={(e) => {
                const v = Number(e.target.value);
                setN(v);
                if (v === 6) onSolved();
              }}
              className="mt-2 h-11 w-full cursor-pointer accent-royal-600"
            />
          </div>
          <Feedback state={solved ? "correct" : null}>36 = 6 × 6, so 36 is a perfect square. We write it as 6², read as “six squared”.</Feedback>
        </>
      }
    />
  );
}

function StepGrow({ onSolved }: { onSolved: () => void }) {
  const [grown, setGrown] = useState(false);
  const [answer, setAnswer] = useState("");
  const [state, setState] = useState<"correct" | "wrong" | null>(null);
  const n = 4;
  return (
    <Split
      text={
        <>
          <h2 className="text-2xl font-extrabold">From one square to the next</h2>
          <p>
            To grow a 4 × 4 square into a 5 × 5 square, you add one new row and one new column. That is <strong className="text-ink">4 + 4 + 1 = 9</strong> tiles, an odd number.
          </p>
          <p>In general, going from n² to (n + 1)² always adds <Highlight>2n + 1</Highlight> tiles.</p>
          <form
            className="sticker bg-surface p-4"
            onSubmit={(e) => {
              e.preventDefault();
              const ok = answer.trim() === "15";
              setState(ok ? "correct" : "wrong");
              if (ok) onSolved();
            }}
          >
            <label htmlFor="grow-q" className="font-semibold text-ink">
              How many tiles do you add to go from 7² to 8²?
            </label>
            <div className="mt-3 flex gap-2">
              <input
                id="grow-q"
                inputMode="numeric"
                autoComplete="off"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setState(null);
                }}
                className="h-11 w-28 rounded-md border border-line-strong bg-paper px-3 font-display text-lg font-bold outline-none focus:border-royal-500"
              />
              <Button type="submit" variant="secondary">
                Check
              </Button>
            </div>
          </form>
          <Feedback state={state}>
            {state === "correct" ? "Yes: 2 × 7 + 1 = 15, and 49 + 15 = 64." : "Not quite. Use 2n + 1 with n = 7."}
          </Feedback>
        </>
      }
      canvas={
        <>
          <TileGrid rows={grown ? n + 1 : n} cols={grown ? n + 1 : n} frame={6} highlightFrom={grown ? n : undefined} label={grown ? "5 by 5 square with 9 new tiles highlighted" : "4 by 4 square"} />
          <Button variant="secondary" onClick={() => setGrown((g) => !g)} icon={grown ? <RotateCcw className="size-4" aria-hidden /> : <Sparkles className="size-4" aria-hidden />}>
            {grown ? "Back to 4 × 4" : "Grow to 5 × 5"}
          </Button>
          <p className="text-sm text-ink-2" aria-live="polite">
            {grown ? (
              <>
                16 + <span className="font-bold text-coral-700">9 new tiles</span> = 25
              </>
            ) : (
              "16 tiles"
            )}
          </p>
        </>
      }
    />
  );
}

const pickOptions = [49, 50, 64, 72];
function StepPick({ onSolved }: { onSolved: () => void }) {
  const [picked, setPicked] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const correct = [49, 64];
  const ok = checked && picked.length === 2 && correct.every((c) => picked.includes(c));
  const last = picked.at(-1) ?? 50;
  const side = Math.floor(Math.sqrt(last));
  const isSq = side * side === last;
  return (
    <Split
      text={
        <>
          <h2 className="text-2xl font-extrabold">Not every number makes a square</h2>
          <p>Try arranging 50 tiles: you get 7 full rows of 7 and one tile left over. So 50 is not a perfect square.</p>
          <fieldset className="sticker bg-surface p-4">
            <legend className="px-1 font-semibold text-ink">Select every perfect square</legend>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {pickOptions.map((v) => {
                const on = picked.includes(v);
                const showRight = checked && correct.includes(v);
                const showWrong = checked && on && !correct.includes(v);
                return (
                  <label
                    key={v}
                    className={cn(
                      "flex h-14 cursor-pointer items-center justify-center gap-2 rounded-md border-2 font-display text-xl font-extrabold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-royal-500",
                      showRight ? "border-mint-500 bg-mint-50" : showWrong ? "border-coral-500 bg-coral-50" : on ? "border-royal-500 bg-royal-50" : "border-line hover:border-line-strong",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={on}
                      onChange={() => {
                        setChecked(false);
                        setPicked(on ? picked.filter((p) => p !== v) : [...picked, v]);
                      }}
                    />
                    {v}
                  </label>
                );
              })}
            </div>
            <Button
              className="mt-3"
              variant="secondary"
              disabled={!picked.length}
              onClick={() => {
                setChecked(true);
                if (picked.length === 2 && correct.every((c) => picked.includes(c))) onSolved();
              }}
            >
              Check answer
            </Button>
          </fieldset>
          <Feedback state={checked ? (ok ? "correct" : "wrong") : null}>
            {ok ? "Exactly. 49 = 7² and 64 = 8². 50 and 72 leave tiles over." : "Look at the tile picture: a number is a square only when nothing is left over."}
          </Feedback>
        </>
      }
      canvas={
        <>
          <TileGrid
            rows={isSq ? side : side + 1}
            cols={side}
            count={last}
            frame={9}
            highlightFrom={isSq ? undefined : side}
            label={isSq ? `${last} tiles form a ${side} by ${side} square` : `${last} tiles: ${side} rows of ${side} with ${last - side * side} left over`}
          />
          <p className="text-sm text-ink-2">
            Showing <strong className="text-ink">{last}</strong> tiles:{" "}
            {isSq ? (
              <span className="font-semibold text-mint-700">a perfect {side} × {side} square</span>
            ) : (
              <span className="font-semibold text-coral-700">{last - side * side} left over</span>
            )}
          </p>
        </>
      }
    />
  );
}

function StepSummary() {
  return (
    <div className="mx-auto max-w-2xl py-4 text-center">
      <div className="mx-auto flex w-fit items-end gap-2">
        <Mascot mood="cheer" size={130} />
        <span className="animate-bounce-in mb-12 grid size-20 rotate-[-10deg] place-items-center rounded-full border-[3px] border-ink bg-sun-400 text-ink shadow-[4px_4px_0_0_var(--color-ink)]">
          <Sparkles className="size-9" aria-hidden />
        </span>
      </div>
      <h2 className="mt-5 text-4xl font-extrabold sm:text-5xl">Lesson complete!</h2>
      <p className="mt-2 text-ink-2">+40 XP · Your revision path moves to “Square roots by factorisation”.</p>
      <div className="ruled mx-auto mt-8 max-w-lg rounded-lg border border-line-strong py-[14px] pl-16 pr-6 text-left">
        <p className="font-display text-sm font-bold uppercase tracking-wide text-coral-700 leading-8">Key ideas</p>
        <ul className="list-disc pl-4 leading-8 text-ink">
          <li>n² is the number of tiles in an n × n square.</li>
          <li>(n + 1)² = n² + 2n + 1: each new square adds an odd number.</li>
          <li>Squares never end in 2, 3, 7 or 8.</li>
        </ul>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/practice/squares-quick-check" variant="accent" size="lg">
          Test yourself: 6 questions
        </ButtonLink>
        <ButtonLink href="/learn/maths/square-and-cube" variant="secondary" size="lg">
          Back to chapter
        </ButtonLink>
      </div>
    </div>
  );
}

function Split({ text, canvas }: { text: React.ReactNode; canvas: React.ReactNode }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="space-y-4 text-[17px] leading-relaxed text-ink-2 [&_h2]:text-ink">{text}</div>
      <div className="flex flex-col items-center gap-4">{canvas}</div>
    </div>
  );
}

/* ───────────────────────── Player ───────────────────────── */

const steps = [
  { title: "Build a square", hint: "Drag the slider until the label reads 36." },
  { title: "Grow the square", hint: "With n = 7, work out 2 × 7 + 1." },
  { title: "Spot the squares", hint: "7 × 7 = 49 and 8 × 8 = 64. What about the others?" },
  { title: "Wrap up", hint: "" },
];

export function LessonPlayer() {
  const { toast } = useAppState();
  const [step, setStep] = useState(0);
  const [solved, setSolved] = useState<boolean[]>([false, false, false, true]);
  const [showHint, setShowHint] = useState(false);
  const markSolved = (i: number) => {
    if (!solved[i]) fireConfetti({ x: window.innerWidth * 0.72, y: window.innerHeight * 0.45, count: 80, spread: 55 });
    setSolved((s) => s.map((v, j) => (j === i ? true : v)));
  };

  useEffect(() => {
    if (step !== steps.length - 1) return;
    fireConfetti({ count: 180, spread: 85, power: 1.4 });
    const t = setTimeout(() => fireConfetti({ x: window.innerWidth * 0.15, count: 90, spread: 35 }), 400);
    const u = setTimeout(() => fireConfetti({ x: window.innerWidth * 0.85, count: 90, spread: 35 }), 700);
    return () => {
      clearTimeout(t);
      clearTimeout(u);
    };
  }, [step]);

  const go = (i: number) => {
    setStep(i);
    setShowHint(false);
    if (i === steps.length - 1) toast("Lesson complete · +40 XP");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const progress = Math.round(((step + (solved[step] ? 1 : 0)) / steps.length) * 100);

  return (
    <div>
      {/* Lesson chrome */}
      <div className="sticky top-16 z-20 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/learn/maths/square-and-cube" className="grid size-10 shrink-0 place-items-center rounded-md hover:bg-sunken" aria-label="Exit lesson">
            <X className="size-5" aria-hidden />
          </Link>
          <ProgressBar value={progress} label="Lesson progress" className="flex-1" />
          <span className="shrink-0 text-sm font-semibold tabular-nums text-ink-3">
            {step + 1}/{steps.length}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <ol className="mb-8 hidden gap-2 md:flex" aria-label="Lesson steps">
          {steps.map((s, i) => (
            <li key={s.title} className={cn("flex items-center gap-2 text-sm font-semibold", i === step ? "text-ink" : "text-ink-3")}>
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-full text-xs",
                  i < step ? "bg-mint-500 text-white" : i === step ? "bg-ink text-white" : "bg-sunken",
                )}
              >
                {i < step ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : i + 1}
              </span>
              <span aria-current={i === step ? "step" : undefined}>{s.title}</span>
              {i < steps.length - 1 && <span aria-hidden className="mx-1 h-px w-8 bg-line-strong" />}
            </li>
          ))}
        </ol>

        <div key={step} className="animate-rise">
          {step === 0 && <StepBuild onSolved={() => markSolved(0)} />}
          {step === 1 && <StepGrow onSolved={() => markSolved(1)} />}
          {step === 2 && <StepPick onSolved={() => markSolved(2)} />}
          {step === 3 && <StepSummary />}
        </div>

        {step < steps.length - 1 && (
          <div className="mt-10 flex flex-col-reverse gap-4 border-t-[3px] border-dashed border-ink/20 pt-6 sm:flex-row sm:items-center">
            <Button variant="ghost" onClick={() => go(step - 1)} disabled={step === 0} icon={<ArrowLeft className="size-4" aria-hidden />}>
              Back
            </Button>
            <div className="flex flex-1 items-center gap-2" aria-live="polite">
              <Mascot key={`${step}-${solved[step]}`} mood={solved[step] ? "cheer" : showHint ? "think" : "happy"} size={64} />
              {solved[step] ? (
                <MascotBubble key="yay" className="text-lg">Brilliant! Hit Continue.</MascotBubble>
              ) : showHint ? (
                <MascotBubble key="hint" className="text-lg">{steps[step].hint}</MascotBubble>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-ink bg-sun-100 px-4 font-bold text-ink transition-transform hover:-rotate-2 hover:scale-105"
                >
                  <Lightbulb aria-hidden className="size-4 fill-sun-400" /> Ask Gyani for a hint
                </button>
              )}
            </div>
            <Button size="lg" className={solved[step] ? "shimmer animate-bounce-in" : ""} onClick={() => go(step + 1)} disabled={!solved[step]} iconRight={<ArrowRight className="size-5" aria-hidden />}>
              {solved[step] ? "Continue" : "Solve to continue"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
