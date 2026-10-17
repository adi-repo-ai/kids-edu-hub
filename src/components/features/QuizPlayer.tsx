"use client";

import { ArrowRight, Check, Flame, Lightbulb, RotateCcw, Timer, Trophy, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { confettiFrom, fireConfetti } from "@/lib/confetti";
import { cn } from "@/lib/cn";
import type { Quiz } from "@/lib/types";
import { Button, ButtonLink } from "../ui/Button";
import { Mascot, MascotBubble } from "../ui/Mascot";
import { ProgressRing } from "../ui/Progress";
import { useAppState } from "./AppState";

type Result = { given: string; correct: boolean; usedHint: boolean };

const letters = ["A", "B", "C", "D"];
const praise = ["Shabash!", "Brilliant!", "Nailed it!", "Super!", "Ekdum sahi!"];
const nudges = ["Nearly! Read why below.", "Oops! Let's learn this one.", "Close one. Check the explanation."];

function useCountdown(seconds: number, running: boolean) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);
  return left;
}

export function QuizPlayer({ quiz }: { quiz: Quiz }) {
  const { toast } = useAppState();
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState("");
  const [checked, setChecked] = useState(false);
  const [hint, setHint] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [attempt, setAttempt] = useState(0);
  const finished = index >= quiz.questions.length;
  const timeLeft = useCountdown(quiz.minutes * 60, !finished);

  const cardRef = useRef<HTMLDivElement>(null);

  const q = quiz.questions[index];
  // consecutive correct answers ending at the latest result
  let combo = 0;
  for (let i = results.length - 1; i >= 0 && results[i].correct; i--) combo++;

  useEffect(() => {
    if (!finished || !results.length) return;
    const pct = results.filter((r) => r.correct).length / quiz.questions.length;
    if (pct < 0.7) return;
    fireConfetti({ count: 160, spread: 80, power: 1.3 });
    const t = setTimeout(() => fireConfetti({ x: window.innerWidth * 0.2, count: 80, spread: 40 }), 350);
    const u = setTimeout(() => fireConfetti({ x: window.innerWidth * 0.8, count: 80, spread: 40 }), 650);
    return () => {
      clearTimeout(t);
      clearTimeout(u);
    };
  }, [finished, results, quiz.questions.length]);
  const isCorrect = checked && q && choice.trim().toLowerCase() === q.answer.toLowerCase();

  const check = () => {
    if (!choice.trim()) return;
    setChecked(true);
    const correct = choice.trim().toLowerCase() === q.answer.toLowerCase();
    if (correct) confettiFrom(cardRef.current?.querySelector("[aria-checked=true], #numeric") ?? cardRef.current, { count: 70, spread: 60, power: 0.9 });
    setResults((r) => [...r, { given: choice.trim(), correct, usedHint: hint }]);
  };

  const next = () => {
    setChecked(false);
    setChoice("");
    setHint(false);
    const ni = index + 1;
    setIndex(ni);
    if (ni >= quiz.questions.length) {
      const score = results.filter((r) => r.correct).length;
      if (score === quiz.questions.length) toast("Perfect score! Badge progress updated");
    }
  };

  const restart = () => {
    setIndex(0);
    setChoice("");
    setChecked(false);
    setHint(false);
    setResults([]);
    setAttempt((a) => a + 1);
  };

  const mm = String(Math.floor(timeLeft / 60)).padStart(1, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  /* ─────────── Results ─────────── */
  if (finished) {
    const score = results.filter((r) => r.correct).length;
    const pct = Math.round((score / quiz.questions.length) * 100);
    const message = pct === 100 ? "Flawless. You've really got this." : pct >= 70 ? "Strong work. Review the ones you missed." : "Good effort. The explanations below will help.";
    return (
      <div key={`r-${attempt}`} className="animate-rise mx-auto max-w-3xl">
        <div className="sticker flex flex-col items-center gap-6 bg-sun-50 p-8 text-center sm:flex-row sm:text-left">
          <Mascot mood={pct >= 70 ? "cheer" : "think"} size={110} />
          <ProgressRing value={pct} hue={pct >= 70 ? "mint" : "coral"} size={112} stroke={10} label="Score">
            <span className="font-display text-2xl font-extrabold">
              {score}/{quiz.questions.length}
            </span>
          </ProgressRing>
          <div className="flex-1">
            <p className="eyebrow">Quiz complete</p>
            <h2 className="mt-1 text-2xl font-extrabold">{message}</h2>
            <p className="mt-2 text-ink-2">
              {results.filter((r) => r.usedHint).length} hints used · +{score * 10} XP earned
            </p>
          </div>
          {pct === 100 && (
            <span className="animate-bounce-in grid size-20 rotate-[-8deg] place-items-center rounded-full border-[3px] border-ink bg-sun-400 shadow-[4px_4px_0_0_var(--color-ink)]" aria-label="Trophy earned">
              <Trophy className="size-8" aria-hidden />
            </span>
          )}
        </div>

        <h3 className="mb-3 mt-10 text-lg font-bold">Review your answers</h3>
        <ol className="space-y-3">
          {quiz.questions.map((qq, i) => {
            const r = results[i];
            return (
              <li key={qq.id} className={cn("rounded-lg border bg-surface p-4", r.correct ? "border-line" : "border-coral-200")}>
                <div className="flex items-start gap-3">
                  <span className={cn("mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-white", r.correct ? "bg-mint-500" : "bg-coral-500")}>
                    {r.correct ? <Check className="size-3.5" strokeWidth={3} aria-label="Correct" /> : <X className="size-3.5" strokeWidth={3} aria-label="Incorrect" />}
                  </span>
                  <div>
                    <p className="font-semibold">{qq.prompt}</p>
                    <p className="mt-1 text-sm text-ink-2">
                      Your answer: <strong className={r.correct ? "text-mint-700" : "text-coral-700"}>{r.given}</strong>
                      {!r.correct && (
                        <>
                          {" "}
                          · Correct: <strong className="text-mint-700">{qq.answer}</strong>
                        </>
                      )}
                    </p>
                    {!r.correct && <p className="mt-2 text-sm text-ink-2">{qq.explanation}</p>}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={restart} variant="secondary" icon={<RotateCcw className="size-4" aria-hidden />}>
            Try again
          </Button>
          <ButtonLink href="/practice" iconRight={<ArrowRight className="size-4" aria-hidden />}>
            More practice
          </ButtonLink>
        </div>
      </div>
    );
  }

  /* ─────────── Question ─────────── */
  const options = q.options ?? [];
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <ol className="flex flex-1 gap-1.5" aria-label="Question progress">
          {quiz.questions.map((qq, i) => {
            const r = results[i];
            return (
              <li
                key={qq.id}
                aria-label={`Question ${i + 1}: ${r ? (r.correct ? "correct" : "incorrect") : i === index ? "current" : "not answered"}`}
                className={cn(
                  "h-3 flex-1 rounded-full border-2 border-ink transition-all duration-500 ease-[var(--ease-spring)]",
                  r ? (r.correct ? "bg-mint-500" : "bg-coral-500") : i === index ? "stripes scale-y-125 bg-royal-500" : "bg-surface",
                )}
              />
            );
          })}
        </ol>
        <span className={cn("flex items-center gap-1 text-sm font-semibold tabular-nums", timeLeft < 60 ? "text-coral-700" : "text-ink-2")} aria-label={`Time left ${mm} minutes ${ss} seconds`}>
          <Timer aria-hidden className="size-4" />
          {mm}:{ss}
        </span>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_170px]">
      <div ref={cardRef} key={`${attempt}-${index}`} className="animate-slide-up relative rounded-xl border-[3px] border-ink bg-surface p-5 shadow-[7px_7px_0_0_var(--color-ink)] sm:p-8">
        {combo >= 2 && checked && isCorrect && (
          <span className="animate-bounce-in absolute -right-3 -top-4 flex rotate-6 items-center gap-1 rounded-full border-[2.5px] border-ink bg-coral-500 px-3 py-1 font-display font-extrabold text-ink shadow-[3px_3px_0_0_var(--color-ink)]">
            <Flame aria-hidden className="animate-flicker size-5 fill-sun-400" /> {combo} in a row!
          </span>
        )}
        <p className="eyebrow">
          Question {index + 1} of {quiz.questions.length}
        </p>
        <h2 id="q-prompt" className="mt-2 text-2xl font-bold leading-snug">
          {q.prompt}
        </h2>

        {q.type === "numeric" ? (
          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (!checked) check();
            }}
          >
            <label htmlFor="numeric" className="text-sm font-semibold text-ink-2">
              Type your answer
            </label>
            <input
              id="numeric"
              inputMode="numeric"
              autoComplete="off"
              disabled={checked}
              value={choice}
              onChange={(e) => setChoice(e.target.value)}
              className={cn(
                "mt-2 block h-14 w-full max-w-xs rounded-md border-2 bg-paper px-4 font-display text-2xl font-extrabold outline-none transition-colors focus:border-royal-500",
                checked ? (isCorrect ? "border-mint-500 bg-mint-50" : "border-coral-500 bg-coral-50") : "border-line-strong",
              )}
            />
          </form>
        ) : (
          <div role="radiogroup" aria-labelledby="q-prompt" className={cn("mt-6 grid gap-3", q.type === "truefalse" ? "grid-cols-2" : "sm:grid-cols-2")}>
            {options.map((opt, i) => {
              const selected = choice === opt;
              const right = checked && opt === q.answer;
              const wrong = checked && selected && opt !== q.answer;
              return (
                <button
                  key={opt}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={checked}
                  onClick={() => setChoice(opt)}
                  className={cn(
                    "flex min-h-14 items-center gap-3 rounded-lg border-[2.5px] px-4 py-3 text-left text-[17px] font-bold transition-[border-color,background-color,transform,box-shadow] duration-200 ease-[var(--ease-spring)]",
                    right
                      ? "border-mint-500 bg-mint-50"
                      : wrong
                        ? "animate-[shake_300ms_ease-in-out] border-coral-500 bg-coral-50"
                        : selected
                          ? "-translate-y-1 border-ink bg-royal-100 shadow-[3px_3px_0_0_var(--color-ink)]"
                          : "border-ink/25 hover:-translate-y-1 hover:border-ink hover:bg-sun-50 hover:shadow-[3px_3px_0_0_var(--color-ink)] disabled:hover:translate-y-0 disabled:hover:shadow-none",
                    checked && !right && !wrong && "opacity-60",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-md font-display text-sm font-extrabold",
                      right ? "bg-mint-500 text-white" : wrong ? "bg-coral-500 text-white" : selected ? "bg-royal-600 text-white" : "bg-sunken text-ink-2",
                    )}
                  >
                    {right ? <Check className="size-4" strokeWidth={3} aria-hidden /> : wrong ? <X className="size-4" strokeWidth={3} aria-hidden /> : letters[i]}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        <div aria-live="polite">
          {checked && (
            <div className={cn("animate-rise mt-6 rounded-lg border p-4", isCorrect ? "border-mint-200 bg-mint-50" : "border-coral-200 bg-coral-50")}>
              <p className={cn("flex items-center gap-2 font-bold", isCorrect ? "text-mint-700" : "text-coral-700")}>
                {isCorrect ? <Check aria-hidden className="size-5" strokeWidth={3} /> : <X aria-hidden className="size-5" strokeWidth={3} />}
                {isCorrect ? "Correct!" : `Not quite. The answer is ${q.answer}.`}
              </p>
              <p className="mt-1.5 text-ink-2">{q.explanation}</p>
            </div>
          )}
          {!checked && hint && q.hint && (
            <p className="animate-rise mt-6 flex items-start gap-2 rounded-lg border border-sun-200 bg-sun-50 p-4 text-ink-2">
              <Lightbulb aria-hidden className="mt-0.5 size-5 shrink-0 text-sun-500" />
              {q.hint}
            </p>
          )}
        </div>

        <div className="mt-8 flex items-center gap-3">
          {!checked && q.hint && !hint && (
            <Button variant="ghost" onClick={() => setHint(true)} icon={<Lightbulb className="size-4" aria-hidden />}>
              Hint
            </Button>
          )}
          <div className="ml-auto">
            {checked ? (
              <Button size="lg" onClick={next} iconRight={<ArrowRight className="size-5" aria-hidden />}>
                {index + 1 === quiz.questions.length ? "See results" : "Next question"}
              </Button>
            ) : (
              <Button size="lg" onClick={check} disabled={!choice.trim()}>
                Check answer
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="hidden flex-col items-center gap-3 lg:flex" aria-live="polite">
        <MascotBubble key={`${index}-${checked}`} side="bottom" className="text-lg">
          {!checked ? (hint ? "Use the hint, you've got this!" : "Take your time. Think it through!") : isCorrect ? praise[index % praise.length] : nudges[index % nudges.length]}
        </MascotBubble>
        <Mascot key={`m-${index}-${checked}`} mood={!checked ? "think" : isCorrect ? "cheer" : "oops"} size={130} className={checked && !isCorrect ? "animate-[shake_400ms_ease-in-out]" : ""} />
      </div>
      </div>
      <p className="mt-4 text-center text-sm text-ink-3">
        Stuck? <Link href={`/learn/${quiz.subject}/${quiz.chapterId}`} className="font-semibold text-royal-700 hover:underline">Revisit the chapter</Link>
      </p>
    </div>
  );
}
