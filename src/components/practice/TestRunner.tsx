"use client";

import { ArrowLeft, ArrowRight, Check, Clock, Flag, ListChecks, RotateCcw, Send, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { fireConfetti } from "@/lib/confetti";
import { cn } from "@/lib/cn";
import { strings, useLang, useT } from "@/lib/i18n";
import { actions } from "@/lib/store";
import { toast } from "@/lib/toast";
import { Button } from "../ui/Button";
import { Mascot } from "../ui/Mascot";
import { ProgressRing } from "../ui/Progress";

/** A question in a custom test. `key` is the chapter key, used for the mistake notebook. */
export type TestQuestion =
  | { kind: "mcq"; key: string; chapter: string; q: string; options: string[]; answer: number; explanation: string }
  | { kind: "written"; key: string; chapter: string; q: string; answer: string; marks: number };

/** A class and the subjects that have a question bank (built on the server from the lessons). */
export interface BankedGrade {
  grade: number;
  subjects: { id: string; name: string }[];
}

type Answer = { choice?: number; text?: string };

const S = strings({
  en: {
    timeLeft: (t: string) => `Time left ${t}`,
    noTimer: "No timer",
    answered: (a: number, n: number) => `${a}/${n} answered`,
    submit: "Submit",
    question: (i: number, n: number) => `Question ${i} of ${n}`,
    mcq: "Multiple choice",
    written: (m: number) => `Written · ${m} mark${m > 1 ? "s" : ""}`,
    yourAnswer: "Your answer",
    placeholder: "Write your answer here…",
    previous: "Previous",
    next: "Save & next",
    finish: "Finish",
    mark: "Mark for review",
    marked: "Marked for review",
    palette: "Question palette",
    qLabel: (n: number, a: boolean, r: boolean) => `Question ${n}${a ? ", answered" : ""}${r ? ", marked for review" : ""}`,
    legendAnswered: "Answered",
    legendReview: "Review",
    legendNot: "Not answered",
    confirmTitle: "Submit your test?",
    confirmBody: (a: number, n: number, r: number) => `You have answered ${a} of ${n} questions${r ? ` and marked ${r} for review` : ""}.`,
    keep: "Keep working",
    timeUp: "Time's up! Your test was submitted.",
    saved: "Test saved to your progress",
    score: "Score",
    mcqResult: (s: number, n: number) => `${s} / ${n} correct`,
    writtenResult: (s: number, n: number) => `Written: ${s} / ${n} marks (self-marked below)`,
    savedNote: "Saved to My progress. Wrong answers were added to your Mistake notebook.",
    retake: "New test",
    exit: "Back to builder",
    notAnswered: "Not answered",
    yours: (t: string) => `Your answer: ${t}`,
    correct: (t: string) => `Correct: ${t}`,
    model: "Model answer",
    award: "Award yourself:",
    awardLabel: (n: number) => `Marks for question ${n}`,
    great: "Excellent work!",
    good: "Good effort!",
    keepGoing: "Keep practising!",
  },
  hi: {
    timeLeft: (t: string) => `बचा समय ${t}`,
    noTimer: "बिना टाइमर",
    answered: (a: number, n: number) => `${a}/${n} हल किए`,
    submit: "जमा करें",
    question: (i: number, n: number) => `प्रश्न ${i} / ${n}`,
    mcq: "बहुविकल्पीय",
    written: (m: number) => `लिखित · ${m} अंक`,
    yourAnswer: "आपका उत्तर",
    placeholder: "अपना उत्तर यहाँ लिखें…",
    previous: "पिछला",
    next: "सहेजें और आगे",
    finish: "पूरा करें",
    mark: "समीक्षा के लिए चिह्नित करें",
    marked: "समीक्षा के लिए चिह्नित",
    palette: "प्रश्न सूची",
    qLabel: (n: number, a: boolean, r: boolean) => `प्रश्न ${n}${a ? ", हल किया" : ""}${r ? ", समीक्षा के लिए चिह्नित" : ""}`,
    legendAnswered: "हल किया",
    legendReview: "समीक्षा",
    legendNot: "हल नहीं किया",
    confirmTitle: "टेस्ट जमा करें?",
    confirmBody: (a: number, n: number, r: number) => `आपने ${n} में से ${a} प्रश्न हल किए हैं${r ? ` और ${r} समीक्षा के लिए चिह्नित किए हैं` : ""}।`,
    keep: "जारी रखें",
    timeUp: "समय समाप्त! आपका टेस्ट जमा हो गया।",
    saved: "टेस्ट आपकी प्रगति में सहेजा गया",
    score: "स्कोर",
    mcqResult: (s: number, n: number) => `${n} में से ${s} सही`,
    writtenResult: (s: number, n: number) => `लिखित: ${n} में से ${s} अंक (नीचे स्वयं जाँचें)`,
    savedNote: "मेरी प्रगति में सहेजा गया। गलत उत्तर आपकी गलतियों की कॉपी में जोड़े गए।",
    retake: "नया टेस्ट",
    exit: "बिल्डर पर वापस",
    notAnswered: "उत्तर नहीं दिया",
    yours: (t: string) => `आपका उत्तर: ${t}`,
    correct: (t: string) => `सही उत्तर: ${t}`,
    model: "आदर्श उत्तर",
    award: "स्वयं अंक दें:",
    awardLabel: (n: number) => `प्रश्न ${n} के अंक`,
    great: "बहुत बढ़िया!",
    good: "अच्छी कोशिश!",
    keepGoing: "अभ्यास जारी रखें!",
  },
});

const fmt = (s: number) => `${Math.floor(s / 3600) ? `${Math.floor(s / 3600)}:` : ""}${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/**
 * Reusable runner for custom tests: one question per screen with a palette, optional timer,
 * in-page submit confirmation, then a review with explanations and self-marking for written answers.
 */
export function TestRunner({ title, questions, minutes, onExit, onNew }: { title: string; questions: TestQuestion[]; minutes: number | null; onExit: () => void; onNew?: () => void }) {
  const t = useT(S);
  const lang = useLang();
  const [phase, setPhase] = useState<"exam" | "result">("exam");
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [review, setReview] = useState<Set<number>>(new Set());
  const [left, setLeft] = useState(minutes ? minutes * 60 : 0);
  const [confirm, setConfirm] = useState(false);
  const [selfMarks, setSelfMarks] = useState<Record<number, number>>({});
  const top = useRef<HTMLDivElement>(null);
  const submitted = useRef(false);

  const mcqs = questions.filter((q) => q.kind === "mcq").length;
  const writtenTotal = questions.reduce((n, q) => (q.kind === "written" ? n + q.marks : n), 0);
  const mcqScore = questions.reduce((s, q, i) => (q.kind === "mcq" && answers[i]?.choice === q.answer ? s + 1 : s), 0);
  const writtenScore = Object.values(selfMarks).reduce((a, b) => a + b, 0);

  const submit = useCallback(
    (auto = false) => {
      if (submitted.current) return;
      submitted.current = true;
      setConfirm(false);
      setPhase("result");
      const score = questions.reduce((s, q, i) => (q.kind === "mcq" && answers[i]?.choice === q.answer ? s + 1 : s), 0);
      questions.forEach((q, i) => {
        if (q.kind === "mcq" && answers[i]?.choice !== q.answer) actions.addMistake({ key: q.key, prompt: q.q, options: q.options, answer: q.answer, explanation: q.explanation || undefined });
      });
      actions.recordTest({ title, score, total: mcqs });
      if (mcqs && score / mcqs >= 0.8) fireConfetti({ count: 150 });
      toast(auto ? t.timeUp : t.saved, auto ? "info" : "success");
      window.scrollTo({ top: 0 });
    },
    [answers, questions, mcqs, title, t],
  );

  useEffect(() => {
    if (phase !== "exam" || !minutes) return;
    const id = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(id);
  }, [phase, minutes]);

  useEffect(() => {
    if (phase === "exam" && minutes && left === 0) submit(true);
  }, [left, phase, minutes, submit]);

  /* ───────── Result ───────── */
  if (phase === "result") {
    const pct = mcqs ? Math.round((mcqScore / mcqs) * 100) : 0;
    return (
      <div className="space-y-6" lang={lang === "hi" ? "hi" : undefined}>
        <div className="card flex flex-col items-center gap-6 p-6 text-center sm:flex-row sm:p-8 sm:text-left">
          <ProgressRing value={pct} size={120} stroke={10} color={pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ff6b3d"} label={t.score}>
            <span className="text-2xl">{pct}%</span>
          </ProgressRing>
          <div className="min-w-0 flex-1">
            <p className="text-2xl font-extrabold">{pct >= 80 ? t.great : pct >= 50 ? t.good : t.keepGoing}</p>
            <p className="mt-1 font-bold">{t.mcqResult(mcqScore, mcqs)}</p>
            {writtenTotal > 0 && <p className="text-ink-2">{t.writtenResult(writtenScore, writtenTotal)}</p>}
            <p className="mt-1 text-sm font-semibold text-green-700">{t.savedNote}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {onNew && (
              <Button variant="secondary" onClick={onNew} icon={<RotateCcw className="size-4" aria-hidden />}>
                {t.retake}
              </Button>
            )}
            <Button variant="ghost" onClick={onExit} icon={<ArrowLeft className="size-4" aria-hidden />}>
              {t.exit}
            </Button>
          </div>
        </div>

        <ol className="space-y-4">
          {questions.map((q, i) => {
            const a = answers[i];
            return (
              <li key={i} className="card p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-3">
                  Q{i + 1} · {q.chapter}
                </p>
                <p className="mt-1 whitespace-pre-line font-semibold">{q.q}</p>
                {q.kind === "mcq" ? (
                  <div className="mt-3 text-sm">
                    <p className={cn("flex flex-wrap items-center gap-x-2 font-bold", a?.choice === q.answer ? "text-green-700" : "text-coral-700")}>
                      {a?.choice === q.answer ? <Check className="size-4" aria-hidden /> : <X className="size-4" aria-hidden />}
                      {a?.choice === undefined ? t.notAnswered : t.yours(q.options[a.choice])}
                      {a?.choice !== q.answer && <span>· {t.correct(q.options[q.answer])}</span>}
                    </p>
                    {q.explanation && <p className="mt-1 text-ink-2">{q.explanation}</p>}
                  </div>
                ) : (
                  <div className="mt-3 grid gap-3 lg:grid-cols-2">
                    <div className="rounded-xl bg-surface-2 p-4">
                      <p className="eyebrow mb-1">{t.yourAnswer}</p>
                      <p className="whitespace-pre-line text-sm">{a?.text?.trim() || t.notAnswered}</p>
                    </div>
                    <div className="rounded-xl bg-green-50 p-4">
                      <p className="eyebrow mb-1 !text-green-700">{t.model}</p>
                      <p className="whitespace-pre-line text-sm text-ink-2">{q.answer}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 lg:col-span-2" role="group" aria-label={t.awardLabel(i + 1)}>
                      <span className="text-sm font-bold">{t.award}</span>
                      {Array.from({ length: q.marks + 1 }, (_, m) => (
                        <button
                          key={m}
                          type="button"
                          aria-pressed={selfMarks[i] === m}
                          onClick={() => setSelfMarks((s) => ({ ...s, [i]: m }))}
                          className={cn("h-9 min-w-9 rounded-lg border-2 px-2 text-sm font-extrabold", selfMarks[i] === m ? "border-brand-600 bg-brand-500 text-white" : "border-line bg-surface hover:bg-surface-2")}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  /* ───────── Exam ───────── */
  const q = questions[cur];
  const a = answers[cur] ?? {};
  const answered = (i: number) => answers[i]?.choice !== undefined || !!answers[i]?.text?.trim();
  const count = questions.filter((_, i) => answered(i)).length;
  const go = (i: number) => {
    setCur(i);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={top} className="scroll-mt-24" lang={lang === "hi" ? "hi" : undefined}>
      <div className="sticky top-16 z-10 -mx-4 mb-5 flex flex-wrap items-center gap-3 border-b border-line bg-canvas/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {minutes ? (
          <span className={cn("flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-extrabold tabular-nums", left < 60 ? "bg-coral-100 text-coral-700" : "bg-surface text-ink")} aria-label={t.timeLeft(fmt(left))}>
            <Clock aria-hidden className="size-4" /> {fmt(left)}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-xl bg-surface px-3 py-1.5 text-sm font-bold text-ink-3">
            <Clock aria-hidden className="size-4" /> {t.noTimer}
          </span>
        )}
        <span className="text-sm font-bold text-ink-3">{t.answered(count, questions.length)}</span>
        <Button variant="danger" size="sm" className="ml-auto" onClick={() => setConfirm(true)} icon={<Send className="size-4" aria-hidden />}>
          {t.submit}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="card min-w-0 p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-ink-3">
            <span>{t.question(cur + 1, questions.length)}</span>
            <span aria-hidden>·</span>
            <span>{q.kind === "mcq" ? t.mcq : t.written(q.marks)}</span>
            <span aria-hidden>·</span>
            <span className="truncate">{q.chapter}</span>
          </div>
          <p id="tq" className="mt-2 whitespace-pre-line text-lg font-bold leading-relaxed">
            {q.q}
          </p>
          {q.kind === "mcq" ? (
            <div role="radiogroup" aria-labelledby="tq" className="mt-5 grid gap-3">
              {q.options.map((o, k) => (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={a.choice === k}
                  onClick={() => setAnswers((s) => ({ ...s, [cur]: { choice: k } }))}
                  className={cn("flex min-h-12 items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left font-semibold", a.choice === k ? "border-brand-500 bg-brand-50" : "border-line hover:bg-surface-2")}
                >
                  <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg text-xs font-extrabold", a.choice === k ? "bg-brand-500 text-white" : "bg-surface-2 text-ink-3")}>{"abcdef"[k]}</span>
                  <span className="min-w-0">{o}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-5">
              <label htmlFor={`tans-${cur}`} className="text-sm font-bold text-ink-2">
                {t.yourAnswer}
              </label>
              <textarea
                id={`tans-${cur}`}
                rows={q.marks >= 4 ? 10 : 5}
                value={a.text ?? ""}
                onChange={(e) => setAnswers((s) => ({ ...s, [cur]: { text: e.target.value } }))}
                className="mt-1.5 w-full rounded-xl border-2 border-line bg-surface-2 p-3 text-[15px] leading-relaxed outline-none focus:border-brand-400 focus:bg-surface"
                placeholder={t.placeholder}
              />
            </div>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button variant="secondary" disabled={cur === 0} onClick={() => go(cur - 1)} icon={<ArrowLeft className="size-4" aria-hidden />}>
              {t.previous}
            </Button>
            <button
              type="button"
              aria-pressed={review.has(cur)}
              onClick={() =>
                setReview((r) => {
                  const n = new Set(r);
                  if (n.has(cur)) n.delete(cur);
                  else n.add(cur);
                  return n;
                })
              }
              className={cn("inline-flex h-11 items-center gap-2 rounded-xl px-4 font-bold", review.has(cur) ? "bg-violet-100 text-violet-700" : "text-ink-2 hover:bg-surface-2")}
            >
              <Flag aria-hidden className="size-4" /> {review.has(cur) ? t.marked : t.mark}
            </button>
            {cur < questions.length - 1 ? (
              <Button className="ml-auto" onClick={() => go(cur + 1)} iconRight={<ArrowRight className="size-4" aria-hidden />}>
                {t.next}
              </Button>
            ) : (
              <Button className="ml-auto" variant="success" onClick={() => setConfirm(true)} icon={<Send className="size-4" aria-hidden />}>
                {t.finish}
              </Button>
            )}
          </div>
        </div>

        <aside className="card self-start p-5 lg:sticky lg:top-36">
          <p className="mb-3 flex items-center gap-2 font-extrabold">
            <ListChecks aria-hidden className="size-5 text-brand-600" /> {t.palette}
          </p>
          <div className="grid grid-cols-6 gap-1.5">
            {questions.map((x, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={t.qLabel(i + 1, answered(i), review.has(i))}
                aria-current={i === cur ? "true" : undefined}
                className={cn(
                  "h-9 rounded-lg text-xs font-extrabold tabular-nums",
                  review.has(i) ? "bg-violet-500 text-white" : answered(i) ? "bg-green-500 text-white" : "bg-surface-2 text-ink-2",
                  x.kind === "written" && !review.has(i) && !answered(i) && "ring-1 ring-line-strong",
                  i === cur && "ring-2 ring-brand-500 ring-offset-2",
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-ink-3">
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded bg-green-500" />
              {t.legendAnswered}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded bg-violet-500" />
              {t.legendReview}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded bg-surface-2 ring-1 ring-line" />
              {t.legendNot}
            </span>
          </div>
        </aside>
      </div>

      {confirm && (
        <div role="dialog" aria-modal="true" aria-labelledby="tconfirm-t" className="fixed inset-0 z-[60] grid place-items-center bg-ink/50 p-4" onKeyDown={(e) => e.key === "Escape" && setConfirm(false)}>
          <div className="animate-rise w-full max-w-md rounded-3xl bg-surface p-6 text-center shadow-float">
            <Mascot mood="think" size={80} className="mx-auto" />
            <p id="tconfirm-t" className="mt-3 text-xl font-extrabold">
              {t.confirmTitle}
            </p>
            <p className="mt-1 text-ink-2">{t.confirmBody(count, questions.length, review.size)}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button variant="secondary" onClick={() => setConfirm(false)} autoFocus>
                {t.keep}
              </Button>
              <Button variant="success" onClick={() => submit()}>
                {t.submit}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
