"use client";

import { ArrowLeft, ArrowRight, Check, Clock, Flag, ListChecks, RotateCcw, Send, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { fireConfetti } from "@/lib/confetti";
import { mocks } from "@/content/mocks";
import { cn } from "@/lib/cn";
import { actions } from "@/lib/store";
import { toast } from "@/lib/toast";
import type { QuizQuestion } from "@/lib/types";
import { Button } from "../ui/Button";
import { Mascot } from "../ui/Mascot";
import { ProgressRing } from "../ui/Progress";

export interface RunnerSection {
  title: string;
  marksEach: number;
  note: string;
  questions: QuizQuestion[];
}

type Flat = { q: QuizQuestion; section: number; n: number; marks: number };
type Answer = { choice?: number; text?: string };

const fmt = (s: number) => `${Math.floor(s / 3600) ? `${Math.floor(s / 3600)}:` : ""}${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export function MockRunner({ id, title, minutes, marks, sections, pattern }: { id: string; title: string; minutes: number; marks: number; sections: RunnerSection[]; pattern: string }) {
  const flat: Flat[] = useMemo(() => {
    let n = 0;
    return sections.flatMap((s, si) => s.questions.map((q) => ({ q, section: si, n: ++n, marks: q.kind === "written" ? q.marks : q.marks ?? s.marksEach })));
  }, [sections]);
  const total = flat.reduce((t, f) => t + f.marks, 0) || marks;

  const [phase, setPhase] = useState<"intro" | "exam" | "result">("intro");
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [review, setReview] = useState<Set<number>>(new Set());
  const [left, setLeft] = useState(minutes * 60);
  const [confirm, setConfirm] = useState(false);
  const [selfMarks, setSelfMarks] = useState<Record<number, number>>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const started = useRef(0);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== "exam") return;
    const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const mcqScore = flat.reduce((s, f, i) => (f.q.kind === "mcq" && answers[i]?.choice !== undefined && f.q.options[answers[i].choice!]?.correct ? s + f.marks : s), 0);
  const writtenScore = Object.values(selfMarks).reduce((a, b) => a + b, 0);
  const score = mcqScore + writtenScore;

  const submit = () => {
    setConfirm(false);
    setPhase("result");
    const mins = Math.round((Date.now() - started.current) / 60000);
    const at = actions.recordMock({ id, title, score: mcqScore, total, minutes: mins });
    // Wrong or skipped MCQs go to the mistake notebook, filed under this paper's class and subject.
    const def = mocks.find((m) => m.id === id);
    if (def)
      flat.forEach((f, i) => {
        if (f.q.kind !== "mcq") return;
        const answer = f.q.options.findIndex((o) => o.correct);
        const choice = answers[i]?.choice;
        if (answer >= 0 && choice !== answer) actions.addMistake({ key: `${def.grade}/${def.subject}/mock`, prompt: f.q.prompt, options: f.q.options.map((o) => o.text), answer, explanation: f.q.explanation });
      });
    setSavedAt(at);
    if (mcqScore / Math.max(1, flat.filter((f) => f.q.kind === "mcq").reduce((t, f) => t + f.marks, 0)) >= 0.7) fireConfetti({ count: 160 });
    toast("Mock test saved to your progress");
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    if (phase === "exam" && left === 0) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, phase]);

  useEffect(() => {
    if (savedAt) actions.updateMockScore(savedAt, score);
  }, [score, savedAt]);

  /* ───────── Intro ───────── */
  if (phase === "intro")
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="card p-6 sm:p-8">
          <h2 className="text-xl font-extrabold">Paper pattern</h2>
          <p className="mt-1 text-ink-2">{pattern}</p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-ink-3">
                <tr>
                  <th className="py-2 pr-4">Section</th>
                  <th className="py-2 pr-4">Questions</th>
                  <th className="py-2 pr-4">Marks each</th>
                  <th className="py-2">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {sections.map((s) => (
                  <tr key={s.title}>
                    <td className="py-2.5 pr-4 font-bold">{s.title}</td>
                    <td className="py-2.5 pr-4 tabular-nums">{s.questions.length}</td>
                    <td className="py-2.5 pr-4 tabular-nums">{s.marksEach}</td>
                    <td className="py-2.5 text-ink-2">{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="mt-6 font-extrabold">Instructions</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-ink-2">
            <li>The timer starts when you press Start and the paper submits itself when time runs out.</li>
            <li>Multiple-choice questions are marked automatically.</li>
            <li>Type your written answers. After submitting, compare each with the model answer and award yourself marks honestly.</li>
            <li>Use “Mark for review” to come back to a question. The palette shows what is answered.</li>
          </ul>
        </div>
        <div className="card flex flex-col items-center p-6 text-center">
          <Mascot mood="think" size={96} />
          <p className="mt-3 text-2xl font-extrabold">{total} marks</p>
          <p className="flex items-center gap-1.5 text-ink-2">
            <Clock aria-hidden className="size-4" /> {minutes} minutes · {flat.length} questions
          </p>
          <Button
            size="lg"
            className="mt-6 w-full"
            onClick={() => {
              started.current = Date.now();
              setPhase("exam");
            }}
          >
            Start test
          </Button>
        </div>
      </div>
    );

  /* ───────── Result ───────── */
  if (phase === "result") {
    const pct = Math.round((score / total) * 100);
    const written = flat.map((f, i) => ({ f, i })).filter((x) => x.f.q.kind === "written");
    return (
      <div className="space-y-6">
        <div className="card flex flex-col items-center gap-6 p-6 text-center sm:flex-row sm:p-8 sm:text-left">
          <ProgressRing value={pct} size={120} stroke={10} color={pct >= 75 ? "#22c55e" : pct >= 40 ? "#f59e0b" : "#ff6b3d"} label="Score">
            <span className="text-2xl">{score}</span>
          </ProgressRing>
          <div className="flex-1">
            <p className="text-2xl font-extrabold">
              {score} / {total} marks
            </p>
            <p className="mt-1 text-ink-2">
              Objective: {mcqScore} marks (auto-marked). Written: {writtenScore} marks (self-marked below{written.length ? `, ${written.length} answers` : ""}).
            </p>
            <p className="mt-1 text-sm font-semibold text-green-700">Saved to My progress. Your score updates as you mark written answers.</p>
          </div>
          <Button variant="secondary" onClick={() => location.reload()} icon={<RotateCcw className="size-4" aria-hidden />}>
            Retake
          </Button>
        </div>

        <ol className="space-y-4">
          {flat.map((f, i) => {
            const a = answers[i];
            return (
              <li key={i} className="card p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-3">
                  Q{f.n} · {sections[f.section].title} · {f.marks} mark{f.marks > 1 ? "s" : ""}
                </p>
                <p className="mt-1 whitespace-pre-line font-semibold">{f.q.prompt}</p>
                {f.q.kind === "mcq" ? (
                  <div className="mt-3 text-sm">
                    {(() => {
                      const ok = a?.choice !== undefined && f.q.options[a.choice]?.correct;
                      return (
                        <p className={cn("flex items-center gap-2 font-bold", ok ? "text-green-700" : "text-coral-700")}>
                          {ok ? <Check className="size-4" aria-hidden /> : <X className="size-4" aria-hidden />}
                          {a?.choice === undefined ? "Not answered" : `Your answer: ${f.q.options[a.choice].text}`}
                          {!ok && ` · Correct: ${f.q.options.find((o) => o.correct)?.text}`}
                        </p>
                      );
                    })()}
                    {f.q.explanation && <p className="mt-1 text-ink-2">{f.q.explanation}</p>}
                  </div>
                ) : (
                  <div className="mt-3 grid gap-3 lg:grid-cols-2">
                    <div className="rounded-xl bg-surface-2 p-4">
                      <p className="eyebrow mb-1">Your answer</p>
                      <p className="whitespace-pre-line text-sm">{a?.text?.trim() || "Not answered"}</p>
                    </div>
                    <div className="rounded-xl bg-green-50 p-4">
                      <p className="eyebrow mb-1 !text-green-700">Model answer</p>
                      <p className="whitespace-pre-line text-sm text-ink-2">{f.q.answer}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 lg:col-span-2" role="group" aria-label={`Marks for question ${f.n}`}>
                      <span className="text-sm font-bold">Award yourself:</span>
                      {Array.from({ length: f.marks + 1 }, (_, m) => (
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
  const f = flat[cur];
  const a = answers[cur] ?? {};
  const answered = (i: number) => answers[i]?.choice !== undefined || !!answers[i]?.text?.trim();
  const count = flat.filter((_, i) => answered(i)).length;
  const go = (i: number) => {
    setCur(i);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={top} className="scroll-mt-24">
      <div className="sticky top-16 z-10 -mx-4 mb-5 flex items-center gap-3 border-b border-line bg-canvas/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <span className={cn("flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-extrabold tabular-nums", left < 300 ? "bg-coral-100 text-coral-700" : "bg-surface text-ink")} aria-label={`Time left ${fmt(left)}`}>
          <Clock aria-hidden className="size-4" /> {fmt(left)}
        </span>
        <span className="text-sm font-bold text-ink-3">
          {count}/{flat.length} answered
        </span>
        <Button variant="danger" size="sm" className="ml-auto" onClick={() => setConfirm(true)} icon={<Send className="size-4" aria-hidden />}>
          Submit
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="card p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-ink-3">
            <span>Question {f.n} of {flat.length}</span>
            <span aria-hidden>·</span>
            <span>{sections[f.section].title}</span>
            <span aria-hidden>·</span>
            <span>
              {f.marks} mark{f.marks > 1 ? "s" : ""}
            </span>
          </div>
          <p id="mq" className="mt-2 whitespace-pre-line text-lg font-bold leading-relaxed">
            {f.q.prompt}
          </p>
          {f.q.kind === "mcq" ? (
            <div role="radiogroup" aria-labelledby="mq" className="mt-5 grid gap-3">
              {f.q.options.map((o, k) => (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={a.choice === k}
                  onClick={() => setAnswers((s) => ({ ...s, [cur]: { choice: k } }))}
                  className={cn("flex min-h-12 items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left font-semibold", a.choice === k ? "border-brand-500 bg-brand-50" : "border-line hover:bg-surface-2")}
                >
                  <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg text-xs font-extrabold", a.choice === k ? "bg-brand-500 text-white" : "bg-surface-2 text-ink-3")}>{"abcd"[k]}</span>
                  {o.text}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-5">
              <label htmlFor={`ans-${cur}`} className="text-sm font-bold text-ink-2">
                Your answer
              </label>
              <textarea
                id={`ans-${cur}`}
                rows={f.marks >= 4 ? 10 : 5}
                value={a.text ?? ""}
                onChange={(e) => setAnswers((s) => ({ ...s, [cur]: { text: e.target.value } }))}
                className="mt-1.5 w-full rounded-xl border-2 border-line bg-surface-2 p-3 text-[15px] leading-relaxed outline-none focus:border-brand-400 focus:bg-surface"
                placeholder="Write your working and answer here…"
              />
            </div>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button variant="secondary" disabled={cur === 0} onClick={() => go(cur - 1)} icon={<ArrowLeft className="size-4" aria-hidden />}>
              Previous
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
              <Flag aria-hidden className="size-4" /> {review.has(cur) ? "Marked for review" : "Mark for review"}
            </button>
            {cur < flat.length - 1 ? (
              <Button className="ml-auto" onClick={() => go(cur + 1)} iconRight={<ArrowRight className="size-4" aria-hidden />}>
                Save & next
              </Button>
            ) : (
              <Button className="ml-auto" variant="success" onClick={() => setConfirm(true)} icon={<Send className="size-4" aria-hidden />}>
                Finish
              </Button>
            )}
          </div>
        </div>

        <aside className="card self-start p-5 lg:sticky lg:top-36">
          <p className="mb-3 flex items-center gap-2 font-extrabold">
            <ListChecks aria-hidden className="size-5 text-brand-600" /> Question palette
          </p>
          {sections.map((s, si) => (
            <div key={s.title} className="mb-4">
              <p className="mb-1.5 text-xs font-bold text-ink-3">{s.title}</p>
              <div className="grid grid-cols-6 gap-1.5">
                {flat.map((x, i) =>
                  x.section !== si ? null : (
                    <button
                      key={i}
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`Question ${x.n}${answered(i) ? ", answered" : ""}${review.has(i) ? ", marked for review" : ""}`}
                      aria-current={i === cur ? "true" : undefined}
                      className={cn(
                        "h-9 rounded-lg text-xs font-extrabold tabular-nums",
                        review.has(i) ? "bg-violet-500 text-white" : answered(i) ? "bg-green-500 text-white" : "bg-surface-2 text-ink-2",
                        i === cur && "ring-2 ring-brand-500 ring-offset-2",
                      )}
                    >
                      {x.n}
                    </button>
                  ),
                )}
              </div>
            </div>
          ))}
          <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold text-ink-3">
            <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-green-500" />Answered</span>
            <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-violet-500" />Review</span>
            <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-surface-2 ring-1 ring-line" />Not answered</span>
          </div>
        </aside>
      </div>

      {confirm && (
        <div role="dialog" aria-modal="true" aria-labelledby="confirm-t" className="fixed inset-0 z-[60] grid place-items-center bg-ink/50 p-4">
          <div className="animate-rise w-full max-w-md rounded-3xl bg-surface p-6 text-center shadow-float">
            <Mascot mood="think" size={80} className="mx-auto" />
            <p id="confirm-t" className="mt-3 text-xl font-extrabold">Submit your test?</p>
            <p className="mt-1 text-ink-2">
              You have answered {count} of {flat.length} questions{review.size ? ` and marked ${review.size} for review` : ""}.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="secondary" onClick={() => setConfirm(false)}>
                Keep working
              </Button>
              <Button variant="success" onClick={submit}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
