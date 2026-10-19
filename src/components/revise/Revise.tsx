"use client";

import { ArrowLeft, ArrowRight, BookOpen, CalendarCheck, Check, History, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { loadBank, shuffle, type BankMcq } from "@/lib/bank";
import { confettiFrom } from "@/lib/confetti";
import { cn } from "@/lib/cn";
import { getGrade } from "@/lib/curriculum";
import { strings, useLang, useT } from "@/lib/i18n";
import { ratingFromScore, revisionItems, upcomingRevisions, type RevisionItem } from "@/lib/revision";
import { actions, schedule, useHydrated, useStore } from "@/lib/store";
import { toast } from "@/lib/toast";
import { PageTitle } from "../layout/PageTitle";
import { Button, ButtonLink } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { Mascot } from "../ui/Mascot";
import { ProgressRing } from "../ui/Progress";
import { SubjectIcon } from "../ui/SubjectIcon";
import { useReasonText } from "./reasons";
import { Rich } from "./Rich";

const S = strings({
  en: {
    eyebrow: "Revise smart",
    title: "Revision path",
    sub: "Chapters come back just before you'd forget them. Each revision is a quick 5-question quiz; the better you do, the longer until the next one.",
    pickClass: "Choose your class first",
    pickClassBody: "Your revision path is built from the chapters you finish in your class.",
    chooseClass: "Choose class",
    soon: (g: number) => `Revision for Class ${g} is coming soon`,
    soonBody: "Lessons and quizzes for this class aren't ready yet — try Class 9 or 10.",
    dueTitle: (n: number) => (n === 1 ? "1 chapter to revise" : `${n} chapters to revise`),
    allCaught: "All caught up!",
    allCaughtBody: "Nothing is due right now. Finish a new chapter, or come back when a revision is due.",
    learn: "Go to lessons",
    revise: "Revise",
    upcoming: "Coming up",
    noUpcoming: "Revise a chapter and its next date will show here.",
    on: (d: string) => d,
    back: "Back to revision list",
    loading: "Loading questions…",
    question: (i: number, n: number) => `Question ${i} of ${n}`,
    check: "Check",
    next: "Next",
    finish: "See result",
    correct: "Correct!",
    wrong: (a: string) => `Not quite. Answer: ${a}`,
    noQs: "This chapter has no quiz questions yet.",
    noQsBody: "Re-read the lesson's key ideas, then rate how well you remember them.",
    readLesson: "Read the lesson",
    rateHow: "How well do you remember it?",
    again: "Shaky",
    good: "Mostly",
    easy: "Solid",
    result: (s: number, n: number) => `You scored ${s}/${n}`,
    resultMsg: ["Let's see it again soon — re-read the lesson first.", "Good recall. A little more practice will lock it in.", "Excellent! This chapter is sticking."],
    nextDate: (d: string, n: number) => `Next revision: ${d} (in ${n} day${n === 1 ? "" : "s"})`,
    saved: "Revision saved · +10 XP",
    intervals: "Intervals grow as you remember: about 1 → 3 → 7 → 21 days.",
  },
  hi: {
    eyebrow: "समझदारी से दोहराएँ",
    title: "दोहराई का रास्ता",
    sub: "अध्याय ठीक तब लौटते हैं जब आप उन्हें भूलने वाले हों। हर दोहराई 5 सवालों का छोटा क्विज़ है; जितना अच्छा करेंगे, अगली बार उतनी देर से आएगा।",
    pickClass: "पहले अपनी कक्षा चुनें",
    pickClassBody: "आपका दोहराई का रास्ता आपकी कक्षा में पूरे किए गए अध्यायों से बनता है।",
    chooseClass: "कक्षा चुनें",
    soon: (g: number) => `कक्षा ${g} के लिए दोहराई जल्द आ रही है`,
    soonBody: "इस कक्षा के पाठ और क्विज़ अभी तैयार नहीं हैं — कक्षा 9 या 10 आज़माएँ।",
    dueTitle: (n: number) => `${n} अध्याय दोहराने हैं`,
    allCaught: "सब कुछ पूरा!",
    allCaughtBody: "अभी कुछ भी दोहराना नहीं है। नया अध्याय पूरा करें, या दोहराई का समय आने पर लौटें।",
    learn: "पाठों पर जाएँ",
    revise: "दोहराएँ",
    upcoming: "आगे आने वाले",
    noUpcoming: "कोई अध्याय दोहराएँ, उसकी अगली तारीख यहाँ दिखेगी।",
    on: (d: string) => d,
    back: "दोहराई सूची पर लौटें",
    loading: "सवाल लोड हो रहे हैं…",
    question: (i: number, n: number) => `सवाल ${i} / ${n}`,
    check: "जाँचें",
    next: "अगला",
    finish: "नतीजा देखें",
    correct: "सही!",
    wrong: (a: string) => `सही नहीं। उत्तर: ${a}`,
    noQs: "इस अध्याय में अभी क्विज़ के सवाल नहीं हैं।",
    noQsBody: "पाठ के मुख्य विचार फिर से पढ़ें, फिर बताएँ कि आपको कितना याद है।",
    readLesson: "पाठ पढ़ें",
    rateHow: "आपको कितना याद है?",
    again: "कमज़ोर",
    good: "ज़्यादातर",
    easy: "पक्का",
    result: (s: number, n: number) => `आपके ${s}/${n} सही`,
    resultMsg: ["इसे जल्द फिर देखेंगे — पहले पाठ दोबारा पढ़ें।", "अच्छी याददाश्त। थोड़ा और अभ्यास इसे पक्का कर देगा।", "शानदार! यह अध्याय याद रह रहा है।"],
    nextDate: (d: string, n: number) => `अगली दोहराई: ${d} (${n} दिन में)`,
    saved: "दोहराई सेव हुई · +10 XP",
    intervals: "जितना याद रहे, अंतराल उतना बढ़े: लगभग 1 → 3 → 7 → 21 दिन।",
  },
});

const fmt = (d: string, lang: string) => new Date(`${d}T12:00:00`).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { weekday: "short", day: "numeric", month: "short" });

export function Revise() {
  const t = useT(S);
  const lang = useLang();
  const hydrated = useHydrated();
  const s = useStore((x) => x);
  const params = useSearchParams();
  const [active, setActive] = useState<string | null>(params.get("chapter"));
  const [hasBank, setHasBank] = useState<boolean | null>(null);
  const grade = s.profile.grade;

  useEffect(() => {
    if (!grade) return;
    const sub = getGrade(grade)?.subjects[0];
    if (!sub) return;
    let live = true;
    loadBank(grade, sub.id).then((b) => live && setHasBank(!!b));
    return () => {
      live = false;
    };
  }, [grade]);

  if (!hydrated) return <div className="h-96" />;

  const header = <PageTitle eyebrow={t.eyebrow} title={t.title} sub={t.sub} />;
  if (!grade)
    return (
      <>
        {header}
        <EmptyState title={t.pickClass} body={t.pickClassBody} action={<ButtonLink href="/learn">{t.chooseClass}</ButtonLink>} />
      </>
    );

  const items = revisionItems(s, grade);
  const activeItem = active ? (items.find((i) => i.key === active) ?? itemFor(active, grade)) : null;
  if (activeItem)
    return (
      <>
        {header}
        <RevisionSession key={activeItem.key} item={activeItem} onBack={() => setActive(null)} />
      </>
    );

  const upcoming = upcomingRevisions(s, grade);
  return (
    <>
      {header}
      {hasBank === false && !items.length ? (
        <EmptyState title={t.soon(grade)} body={t.soonBody} action={<ButtonLink href="/learn">{t.learn}</ButtonLink>} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section aria-labelledby="due-h" className="min-w-0">
            {items.length ? (
              <>
                <h2 id="due-h" className="mb-4 text-xl font-extrabold">
                  {t.dueTitle(items.length)}
                </h2>
                <ol className="space-y-3">
                  {items.map((it, i) => (
                    <DueRow key={it.key} item={it} rank={i + 1} onRevise={() => setActive(it.key)} />
                  ))}
                </ol>
              </>
            ) : (
              <EmptyState mood="happy" title={t.allCaught} body={t.allCaughtBody} action={<ButtonLink href={`/class/${grade}`}>{t.learn}</ButtonLink>} />
            )}
          </section>
          <aside className="space-y-4">
            <section className="card p-5" aria-labelledby="up-h">
              <h2 id="up-h" className="mb-3 flex items-center gap-2 font-extrabold">
                <CalendarCheck aria-hidden className="size-5 text-brand-600" /> {t.upcoming}
              </h2>
              {upcoming.length ? (
                <ul className="divide-y divide-line">
                  {upcoming.slice(0, 8).map((u) => (
                    <li key={u.key} className="flex items-center gap-2 py-2 text-sm">
                      <SubjectIcon id={u.subject} size="sm" />
                      <span className="min-w-0 flex-1 truncate font-semibold">{u.title}</span>
                      <span className="shrink-0 font-bold text-ink-3">{fmt(u.due, lang)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-2">{t.noUpcoming}</p>
              )}
            </section>
            <p className="flex gap-2 rounded-2xl bg-brand-50 p-4 text-sm text-brand-800">
              <History aria-hidden className="size-5 shrink-0" /> {t.intervals}
            </p>
          </aside>
        </div>
      )}
    </>
  );
}

/** A chapter opened directly (e.g. from a link) that isn't currently due. */
function itemFor(key: string, grade: number): RevisionItem | null {
  const [g, subject, chapter] = key.split("/");
  if (Number(g) !== grade || !chapter) return null;
  const info = getGrade(g)?.subjects.find((x) => x.id === subject)?.units.flatMap((u) => u.chapters).find((c) => c.id === chapter);
  const sub = getGrade(g)?.subjects.find((x) => x.id === subject);
  if (!info || !sub) return null;
  return { key, grade, subject, chapter, title: info.title, subjectName: sub.name, urgency: 0, reasons: [] };
}

function DueRow({ item, rank, onRevise }: { item: RevisionItem; rank: number; onRevise: () => void }) {
  const t = useT(S);
  const reason = useReasonText();
  return (
    <li className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="relative">
          <SubjectIcon id={item.subject} />
          <span className="absolute -left-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-ink text-[10px] font-extrabold text-canvas" aria-hidden>
            {rank}
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-extrabold">{item.title}</p>
          <p className="text-xs font-semibold text-ink-3">{item.subjectName}</p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {item.reasons.map((r, i) => (
              <li key={i} className={cn("rounded-full px-2 py-0.5 text-xs font-bold", r.kind === "quiz" || r.kind === "mistakes" ? "bg-coral-50 text-coral-700" : "bg-amber-50 text-amber-700")}>
                {reason(r)}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Button onClick={onRevise} iconRight={<ArrowRight className="size-4" aria-hidden />} className="shrink-0">
        {t.revise}
      </Button>
    </li>
  );
}

type Phase = "loading" | "quiz" | "self" | "done";

function RevisionSession({ item, onBack }: { item: RevisionItem; onBack: () => void }) {
  const t = useT(S);
  const lang = useLang();
  const [phase, setPhase] = useState<Phase>("loading");
  const [qs, setQs] = useState<BankMcq[]>([]);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<{ score: number; total: number; rating: 0 | 1 | 2; due: string; interval: number } | null>(null);
  const card = useRef<HTMLDivElement>(null);
  const prev = useStore((s) => s.revision[item.key]);
  const hi = item.subject === "hindi";

  useEffect(() => {
    let live = true;
    loadBank(item.grade, item.subject).then((b) => {
      if (!live) return;
      const ch = b?.chapters.find((c) => c.id === item.chapter);
      const pool = (ch?.mcq ?? []).filter((q) => q.options.length > 1 && q.answer >= 0);
      if (pool.length) {
        setQs(shuffle(pool).slice(0, 5));
        setPhase("quiz");
      } else setPhase("self");
    });
    return () => {
      live = false;
    };
  }, [item.grade, item.subject, item.chapter]);

  const save = (sc: number, total: number, rating: 0 | 1 | 2) => {
    const next = schedule(prev, rating);
    actions.reviseChapter(item.key, rating);
    setResult({ score: sc, total, rating, due: next.due, interval: next.interval });
    setPhase("done");
    toast(t.saved);
  };

  const lessonHref = `/class/${item.grade}/${item.subject}/${item.chapter}`;
  const top = (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <Button variant="ghost" size="sm" onClick={onBack} icon={<ArrowLeft className="size-4" aria-hidden />}>
        {t.back}
      </Button>
      <span className="flex min-w-0 items-center gap-2">
        <SubjectIcon id={item.subject} size="sm" />
        <span className="truncate font-extrabold">{item.title}</span>
      </span>
    </div>
  );

  if (phase === "loading")
    return (
      <div>
        {top}
        <div className="card flex items-center gap-3 p-6 text-ink-2" role="status">
          <Loader2 aria-hidden className="size-5 animate-spin" /> {t.loading}
        </div>
      </div>
    );

  if (phase === "self")
    return (
      <div>
        {top}
        <div className="card flex flex-col items-center gap-4 p-6 text-center">
          <Mascot mood="think" size={84} />
          <p className="text-lg font-extrabold">{t.noQs}</p>
          <p className="text-ink-2">{t.noQsBody}</p>
          <ButtonLink href={lessonHref} variant="secondary" icon={<BookOpen className="size-4" aria-hidden />}>
            {t.readLesson}
          </ButtonLink>
          <p className="mt-2 font-bold">{t.rateHow}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="danger" onClick={() => save(0, 0, 0)}>{t.again}</Button>
            <Button variant="primary" onClick={() => save(0, 0, 1)}>{t.good}</Button>
            <Button variant="success" onClick={() => save(0, 0, 2)}>{t.easy}</Button>
          </div>
        </div>
      </div>
    );

  if (phase === "done" && result) {
    const pct = result.total ? Math.round((result.score / result.total) * 100) : [30, 75, 100][result.rating];
    return (
      <div>
        {top}
        <div className="card flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:text-left">
          {result.total > 0 && (
            <ProgressRing value={pct} size={96} stroke={9} color={pct >= 90 ? "#22c55e" : pct >= 60 ? "#f59e0b" : "#ff6b3d"} label="Score">
              <span className="text-xl">
                {result.score}/{result.total}
              </span>
            </ProgressRing>
          )}
          <div className="flex-1">
            {result.total > 0 && <p className="text-xl font-extrabold">{t.result(result.score, result.total)}</p>}
            <p className="text-ink-2">{t.resultMsg[result.rating]}</p>
            <p className="mt-2 flex items-center justify-center gap-2 font-bold text-brand-700 sm:justify-start">
              <CalendarCheck aria-hidden className="size-5" /> {t.nextDate(fmt(result.due, lang), result.interval)}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={onBack} icon={<ArrowLeft className="size-4" aria-hidden />}>
            {t.back}
          </Button>
          <ButtonLink href={lessonHref} variant="secondary" icon={<BookOpen className="size-4" aria-hidden />}>
            {t.readLesson}
          </ButtonLink>
        </div>
      </div>
    );
  }

  const q = qs[i];
  if (!q) return null;
  const correct = pick !== null && pick === q.answer;
  const check = () => {
    if (pick === null) return;
    setChecked(true);
    if (pick === q.answer) {
      setScore((x) => x + 1);
      confettiFrom(card.current?.querySelector("[aria-checked=true]"), { count: 30, spread: 50, power: 0.6 });
    } else {
      actions.addMistake({ key: item.key, prompt: q.q, options: q.options, answer: q.answer, explanation: q.explanation || undefined });
    }
  };
  const next = () => {
    if (i + 1 >= qs.length) {
      save(score, qs.length, ratingFromScore(score, qs.length));
      return;
    }
    setI(i + 1);
    setPick(null);
    setChecked(false);
  };

  return (
    <div>
      {top}
      <div ref={card} className="card p-5 sm:p-7" lang={hi ? "hi" : undefined}>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex flex-1 gap-1.5" aria-hidden>
            {qs.map((_, k) => (
              <span key={k} className={cn("h-2.5 flex-1 rounded-full", k < i ? "bg-green-500" : k === i ? "bg-brand-500" : "bg-surface-2")} />
            ))}
          </div>
          <span className="text-sm font-bold tabular-nums text-ink-3" lang={lang}>
            {t.question(i + 1, qs.length)}
          </span>
        </div>
        <p id="rev-q" className="text-xl font-extrabold leading-snug">
          {q.q}
        </p>
        <div role="radiogroup" aria-labelledby="rev-q" className="mt-5 grid gap-3 sm:grid-cols-2">
          {q.options.map((o, k) => {
            const selected = pick === k;
            const right = checked && k === q.answer;
            const wrong = checked && selected && k !== q.answer;
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
                  {right ? <Check className="size-4" strokeWidth={3} /> : wrong ? <X className="size-4" strokeWidth={3} /> : "ABCDEF"[k]}
                </span>
                {o}
              </button>
            );
          })}
        </div>
        <div aria-live="polite">
          {checked && (
            <div className={cn("animate-rise mt-5 rounded-xl p-4", correct ? "bg-green-50" : "bg-coral-50")}>
              <p className={cn("font-extrabold", correct ? "text-green-700" : "text-coral-700")} lang={lang}>
                {correct ? t.correct : t.wrong(q.options[q.answer])}
              </p>
              {q.explanation && <Rich text={q.explanation} className="mt-1 text-ink-2" />}
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end" lang={lang}>
          {checked ? (
            <Button size="lg" variant={correct ? "success" : "primary"} onClick={next} iconRight={<ArrowRight className="size-5" aria-hidden />}>
              {i + 1 >= qs.length ? t.finish : t.next}
            </Button>
          ) : (
            <Button size="lg" onClick={check} disabled={pick === null}>
              {t.check}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
