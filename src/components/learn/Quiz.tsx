"use client";

import { ArrowRight, Check, NotebookPen, RotateCcw, Trophy, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { confettiFrom, fireConfetti } from "@/lib/confetti";
import { cn } from "@/lib/cn";
import { strings, useLang, useT } from "@/lib/i18n";
import { actions, useStore } from "@/lib/store";
import { toast } from "@/lib/toast";
import type { QuizQuestion } from "@/lib/types";
import { Button } from "../ui/Button";
import { Mascot } from "../ui/Mascot";
import { ProgressRing } from "../ui/Progress";

type Mcq = Extract<QuizQuestion, { kind: "mcq" }>;
const praise = ["Correct!", "Nailed it!", "Shabash!", "Brilliant!", "Spot on!"];
const S = strings({
  en: { saved: "Saved to your Mistake notebook", open: "Review later" },
  hi: { saved: "आपकी गलतियों की कॉपी में सहेजा गया", open: "बाद में दोहराएँ" },
});

/** Chapter quiz: one question at a time, instant feedback, saves your best score. */
export function Quiz({ questions, storeKey, title }: { questions: QuizQuestion[]; storeKey: string; title: string }) {
  const qs = questions.filter((q): q is Mcq => q.kind === "mcq");
  const best = useStore((s) => s.quizzes[storeKey]);
  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  const t = useT(S);
  const lang = useLang();
  if (!qs.length) return null;

  const q = qs[i];
  const correct = pick !== null && q.options[pick]?.correct;

  const check = () => {
    if (pick === null) return;
    setChecked(true);
    if (q.options[pick].correct) {
      setScore((s) => s + 1);
      confettiFrom(card.current?.querySelector("[aria-checked=true]"), { count: 40, spread: 50, power: 0.7 });
    } else {
      // Wrong answers go to the mistake notebook for spaced retries.
      actions.addMistake({ key: storeKey, prompt: q.prompt, options: q.options.map((o) => o.text), answer: q.options.findIndex((o) => o.correct), explanation: q.explanation });
    }
  };

  const next = () => {
    if (i + 1 >= qs.length) {
      const final = score;
      actions.recordQuiz(storeKey, final, qs.length);
      setDone(true);
      if (final / qs.length >= 0.8) fireConfetti({ count: 150, power: 1.2 });
      toast(`Quiz saved · ${final}/${qs.length}`);
      return;
    }
    setI(i + 1);
    setPick(null);
    setChecked(false);
  };

  const restart = () => {
    setI(0);
    setPick(null);
    setChecked(false);
    setScore(0);
    setDone(false);
    setStarted(true);
  };

  if (!started)
    return (
      <div className="card flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
        <Mascot mood="think" size={84} />
        <div className="flex-1">
          <p className="text-xl font-extrabold">{title}</p>
          <p className="text-ink-2">
            {qs.length} questions with explanations.{" "}
            {best ? (
              <>
                Your best: <strong className="text-ink">{best.best}/{best.total}</strong>
              </>
            ) : (
              "Earn XP and stars on your learning path."
            )}
          </p>
        </div>
        <Button size="lg" onClick={() => setStarted(true)}>
          {best ? "Try again" : "Start quiz"}
        </Button>
      </div>
    );

  if (done) {
    const pct = Math.round((score / qs.length) * 100);
    return (
      <div className="card flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:text-left">
        <ProgressRing value={pct} size={96} stroke={9} color={pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ff6b3d"} label="Score">
          <span className="text-xl">
            {score}/{qs.length}
          </span>
        </ProgressRing>
        <div className="flex-1">
          <p className="text-xl font-extrabold">{pct >= 80 ? "Excellent work!" : pct >= 50 ? "Good effort!" : "Keep practising!"}</p>
          <p className="text-ink-2">{pct >= 80 ? "You've earned stars on your path." : "Re-read the sections above, then try again for more stars."}</p>
        </div>
        {pct === 100 && <Trophy aria-hidden className="size-12 text-amber-400" />}
        <Button variant="secondary" onClick={restart} icon={<RotateCcw className="size-4" aria-hidden />}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div ref={card} className="card p-5 sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex flex-1 gap-1.5" aria-hidden>
          {qs.map((_, k) => (
            <span key={k} className={cn("h-2.5 flex-1 rounded-full", k < i ? "bg-green-500" : k === i ? "bg-brand-500" : "bg-surface-2")} />
          ))}
        </div>
        <span className="text-sm font-bold tabular-nums text-ink-3">
          {i + 1}/{qs.length}
        </span>
      </div>
      <p id={`${storeKey}-q`} className="text-xl font-extrabold leading-snug">
        {q.prompt}
      </p>
      <div role="radiogroup" aria-labelledby={`${storeKey}-q`} className="mt-5 grid gap-3 sm:grid-cols-2">
        {q.options.map((o, k) => {
          const selected = pick === k;
          const right = checked && o.correct;
          const wrong = checked && selected && !o.correct;
          return (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={checked}
              onClick={() => setPick(k)}
              className={cn(
                "flex min-h-14 items-center gap-3 rounded-xl border-2 border-b-4 px-4 py-3 text-left font-semibold transition-colors",
                right ? "border-green-500 bg-green-50" : wrong ? "animate-[shake_300ms] border-coral-500 bg-coral-50" : selected ? "border-brand-400 bg-brand-50" : "border-line hover:bg-surface-2",
                checked && !right && !wrong && "opacity-60",
              )}
            >
              <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg text-xs font-extrabold", right ? "bg-green-500 text-white" : wrong ? "bg-coral-500 text-white" : selected ? "bg-brand-500 text-white" : "bg-surface-2 text-ink-3")}>
                {right ? <Check className="size-4" strokeWidth={3} /> : wrong ? <X className="size-4" strokeWidth={3} /> : "ABCD"[k]}
              </span>
              {o.text}
            </button>
          );
        })}
      </div>
      <div aria-live="polite">
        {checked && (
          <div className={cn("animate-rise mt-5 rounded-xl p-4", correct ? "bg-green-50" : "bg-coral-50")}>
            <p className={cn("font-extrabold", correct ? "text-green-700" : "text-coral-700")}>{correct ? praise[i % praise.length] : `Not quite. Answer: ${q.options.find((o) => o.correct)?.text}`}</p>
            {q.explanation && <p className="mt-1 text-ink-2">{q.explanation}</p>}
            {!correct && (
              <p className="mt-2 flex flex-wrap items-center gap-x-2 text-sm font-semibold text-ink-3" lang={lang === "hi" ? "hi" : undefined}>
                <NotebookPen aria-hidden className="size-4" /> {t.saved} ·{" "}
                <Link href="/mistakes" className="font-bold text-brand-600 hover:underline">
                  {t.open}
                </Link>
              </p>
            )}
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end">
        {checked ? (
          <Button size="lg" variant={correct ? "success" : "primary"} onClick={next} iconRight={<ArrowRight className="size-5" aria-hidden />}>
            {i + 1 >= qs.length ? "See result" : "Continue"}
          </Button>
        ) : (
          <Button size="lg" onClick={check} disabled={pick === null}>
            Check
          </Button>
        )}
      </div>
    </div>
  );
}
