"use client";

import { ArrowRight, Check, NotebookPen, RotateCcw, Trash2, X } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import { shuffle } from "@/lib/bank";
import { confettiFrom } from "@/lib/confetti";
import { cn } from "@/lib/cn";
import { strings, useLang, useT } from "@/lib/i18n";
import { actions, useHydrated, useStore, type Mistake } from "@/lib/store";
import { toast } from "@/lib/toast";
import { Button, ButtonLink } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { SubjectIcon } from "../ui/SubjectIcon";

const S = strings({
  en: {
    rule: "Answer a mistake correctly 2 times in a row and it leaves the notebook. A wrong answer resets its count.",
    total: (n: number) => `${n} question${n === 1 ? "" : "s"} to fix`,
    classN: (n: string) => `Class ${n}`,
    other: "Other questions",
    mocks: "Mock tests",
    retry: "Retry",
    retryAll: (n: number) => `Retry all ${n}`,
    delete: "Delete",
    deleteLabel: (q: string) => `Delete mistake: ${q}`,
    streak: (n: number) => `${n}/2 correct in a row`,
    added: (d: string) => `Added ${d}`,
    check: "Check",
    cancel: "Cancel",
    done: "Done",
    next: "Next",
    finish: "Finish",
    progress: (i: number, n: number) => `${i} of ${n}`,
    right1: "Correct! Get it right once more to clear it.",
    cleared: "Correct twice in a row — cleared from your notebook!",
    clearedToast: "Mistake cleared",
    wrong: (a: string) => `Not quite. Answer: ${a}. The count starts again.`,
    deleted: "Removed from notebook",
    emptyTitle: "Your notebook is empty",
    emptyBody: "Questions you get wrong in chapter quizzes, mock tests, custom tests, the daily challenge and battles show up here, so you can fix them.",
    emptyCta: "Go to practice",
  },
  hi: {
    rule: "किसी गलती का लगातार 2 बार सही उत्तर दें, तो वह कॉपी से हट जाएगी। गलत उत्तर पर गिनती फिर से शुरू होती है।",
    total: (n: number) => `सुधारने के लिए ${n} प्रश्न`,
    classN: (n: string) => `कक्षा ${n}`,
    other: "अन्य प्रश्न",
    mocks: "मॉक टेस्ट",
    retry: "फिर से करें",
    retryAll: (n: number) => `सभी ${n} फिर से करें`,
    delete: "हटाएँ",
    deleteLabel: (q: string) => `गलती हटाएँ: ${q}`,
    streak: (n: number) => `लगातार ${n}/2 सही`,
    added: (d: string) => `${d} को जुड़ा`,
    check: "जाँचें",
    cancel: "रद्द करें",
    done: "हो गया",
    next: "आगे",
    finish: "पूरा करें",
    progress: (i: number, n: number) => `${n} में से ${i}`,
    right1: "सही! इसे हटाने के लिए एक बार और सही करें।",
    cleared: "लगातार दो बार सही — कॉपी से हट गया!",
    clearedToast: "गलती सुधर गई",
    wrong: (a: string) => `सही नहीं। उत्तर: ${a}। गिनती फिर से शुरू होगी।`,
    deleted: "कॉपी से हटा दिया",
    emptyTitle: "आपकी कॉपी खाली है",
    emptyBody: "अध्याय क्विज़, मॉक टेस्ट, कस्टम टेस्ट, दैनिक चुनौती और बैटल में गलत हुए प्रश्न यहाँ दिखेंगे, ताकि आप उन्हें सुधार सकें।",
    emptyCta: "अभ्यास पर जाएँ",
  },
});
type T = (typeof S)["en"];

type Names = Record<string, { subject: string; chapter: string }>;

/** Mistake notebook: wrong answers grouped by subject and chapter, with inline retries. */
export function Mistakes({ names }: { names: Names }) {
  const t = useT(S);
  const lang = useLang();
  const hydrated = useHydrated();
  const mistakes = useStore((s) => s.mistakes);
  const [single, setSingle] = useState<string | null>(null);
  const [session, setSession] = useState<{ key: string; items: Mistake[]; i: number } | null>(null);

  const groups = useMemo(() => {
    const bySubject = new Map<string, { id: string; grade: string; subject: string; chapters: Map<string, Mistake[]> }>();
    for (const m of mistakes) {
      const [grade, subject] = m.key.split("/");
      const sk = `${grade}/${subject}`;
      if (!bySubject.has(sk)) bySubject.set(sk, { id: subject, grade, subject: names[m.key]?.subject ?? subject, chapters: new Map() });
      const g = bySubject.get(sk)!;
      if (!g.chapters.has(m.key)) g.chapters.set(m.key, []);
      g.chapters.get(m.key)!.push(m);
    }
    return [...bySubject.values()];
  }, [mistakes, names]);

  if (!hydrated) return <div className="h-96" />;

  if (!mistakes.length)
    return (
      <div lang={lang === "hi" ? "hi" : undefined}>
        <EmptyState mood="happy" title={t.emptyTitle} body={t.emptyBody} action={<ButtonLink href="/practice">{t.emptyCta}</ButtonLink>} />
      </div>
    );

  return (
    <div className="space-y-8" lang={lang === "hi" ? "hi" : undefined}>
      <div className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-coral-500 text-white">
          <NotebookPen aria-hidden className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-extrabold">{t.total(mistakes.length)}</p>
          <p className="text-sm text-ink-2">{t.rule}</p>
        </div>
      </div>

      {groups.map((g) => (
        <section key={`${g.grade}/${g.id}`} aria-labelledby={`mg-${g.grade}-${g.id}`}>
          <h2 id={`mg-${g.grade}-${g.id}`} className="mb-3 flex items-center gap-3 text-xl font-extrabold">
            <SubjectIcon id={g.id} size="sm" solid /> <span className="min-w-0">{g.subject}</span>
            <span className="text-sm font-bold text-ink-3">{t.classN(g.grade)}</span>
          </h2>
          <div className="space-y-4">
            {[...g.chapters.entries()].map(([key, items]) => (
              <div key={key} className="card p-4 sm:p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <h3 className="min-w-0 flex-1 font-extrabold">{key.endsWith("/mock") ? t.mocks : (names[key]?.chapter ?? t.other)}</h3>
                  {session?.key !== key && (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<RotateCcw className="size-4" aria-hidden />}
                      onClick={() => {
                        setSingle(null);
                        setSession({ key, items: [...items], i: 0 });
                      }}
                    >
                      {t.retryAll(items.length)}
                    </Button>
                  )}
                </div>

                {session?.key === key ? (
                  <RetryCard
                    key={session.items[session.i].id + session.i}
                    m={session.items[session.i]}
                    t={t}
                    progress={t.progress(session.i + 1, session.items.length)}
                    last={session.i + 1 >= session.items.length}
                    onCancel={() => setSession(null)}
                    onDone={() => setSession((s) => (s && s.i + 1 < s.items.length ? { ...s, i: s.i + 1 } : null))}
                  />
                ) : (
                  <ul className="divide-y divide-line">
                    {items.map((m) =>
                      single === m.id ? (
                        <li key={m.id} className="py-3">
                          <RetryCard m={m} t={t} last onCancel={() => setSingle(null)} onDone={() => setSingle(null)} />
                        </li>
                      ) : (
                        <li key={m.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center">
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 whitespace-pre-line font-semibold">{m.prompt}</p>
                            <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs font-semibold text-ink-3">
                              <span className="flex items-center gap-1" aria-label={t.streak(m.streak)}>
                                {[0, 1].map((k) => (
                                  <span key={k} aria-hidden className={cn("size-2.5 rounded-full", k < m.streak ? "bg-green-500" : "bg-line-strong")} />
                                ))}
                                <span className="ml-1">{t.streak(m.streak)}</span>
                              </span>
                              <span>{t.added(new Date(m.at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }))}</span>
                            </p>
                          </div>
                          <div className="flex shrink-0 gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSession(null);
                                setSingle(m.id);
                              }}
                            >
                              {t.retry}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label={t.deleteLabel(m.prompt.slice(0, 60))}
                              onClick={() => {
                                actions.removeMistake(m.id);
                                toast(t.deleted, "info");
                              }}
                            >
                              <Trash2 className="size-4" aria-hidden />
                            </Button>
                          </div>
                        </li>
                      ),
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/**
 * One retry. The result is saved when the learner presses Done/Next, so the feedback stays on screen
 * even when a second correct answer clears the mistake from the store.
 */
function RetryCard({ m, t, progress, last, onCancel, onDone }: { m: Mistake; t: T; progress?: string; last: boolean; onCancel: () => void; onDone: () => void }) {
  const order = useMemo(() => shuffle(m.options.map((_, k) => k)), [m]);
  const [pick, setPick] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const correct = pick === m.answer;
  const clears = correct && m.streak + 1 >= 2;
  const qid = useId();

  const check = () => {
    if (pick === null) return;
    setChecked(true);
    if (pick === m.answer) confettiFrom(box.current?.querySelector("[aria-checked=true]"), { count: clears ? 60 : 30, spread: 50, power: 0.7 });
  };
  const done = () => {
    actions.retryMistake(m.id, correct);
    if (clears) toast(t.clearedToast);
    onDone();
  };

  return (
    <div ref={box} className="animate-rise rounded-2xl bg-surface-2 p-4">
      {progress && <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-3">{progress}</p>}
      <p id={qid} className="whitespace-pre-line font-bold">
        {m.prompt}
      </p>
      <div role="radiogroup" aria-labelledby={qid} className="mt-3 grid gap-2 sm:grid-cols-2">
        {order.map((k, pos) => {
          const selected = pick === k;
          const right = checked && k === m.answer;
          const wrong = checked && selected && k !== m.answer;
          return (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={checked}
              onClick={() => setPick(k)}
              className={cn(
                "flex min-h-12 items-center gap-3 rounded-xl border-2 bg-surface px-3 py-2 text-left font-semibold",
                right ? "border-green-500 bg-green-50" : wrong ? "border-coral-500 bg-coral-50" : selected ? "border-brand-400 bg-brand-50" : "border-line hover:bg-surface-2",
                checked && !right && !wrong && "opacity-60",
              )}
            >
              <span className={cn("grid size-6 shrink-0 place-items-center rounded-md text-xs font-extrabold", right ? "bg-green-500 text-white" : wrong ? "bg-coral-500 text-white" : selected ? "bg-brand-500 text-white" : "bg-surface-2 text-ink-3")}>
                {right ? <Check className="size-3.5" strokeWidth={3} /> : wrong ? <X className="size-3.5" strokeWidth={3} /> : "ABCDEF"[pos]}
              </span>
              <span className="min-w-0">{m.options[k]}</span>
            </button>
          );
        })}
      </div>
      <div aria-live="polite">
        {checked && (
          <div className={cn("mt-3 rounded-xl p-3", correct ? "bg-green-50" : "bg-coral-50")}>
            <p className={cn("font-extrabold", correct ? "text-green-700" : "text-coral-700")}>{correct ? (clears ? t.cleared : t.right1) : t.wrong(m.options[m.answer] ?? "")}</p>
            {m.explanation && <p className="mt-1 text-sm text-ink-2">{m.explanation}</p>}
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-wrap justify-end gap-2">
        {!checked && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            {t.cancel}
          </Button>
        )}
        {checked ? (
          <Button size="sm" variant={correct ? "success" : "primary"} onClick={done} iconRight={<ArrowRight className="size-4" aria-hidden />}>
            {last ? (progress ? t.finish : t.done) : t.next}
          </Button>
        ) : (
          <Button size="sm" onClick={check} disabled={pick === null}>
            {t.check}
          </Button>
        )}
      </div>
    </div>
  );
}
