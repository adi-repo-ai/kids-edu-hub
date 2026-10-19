"use client";

import { ArrowRight, CalendarCheck, Check, Copy, Flame, Timer, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { loadBank, seededShuffle } from "@/lib/bank";
import { confettiFrom, fireConfetti } from "@/lib/confetti";
import { cn } from "@/lib/cn";
import { strings, useLang, useT } from "@/lib/i18n";
import { actions, today, useHydrated, useStore } from "@/lib/store";
import { toast } from "@/lib/toast";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { Mascot } from "../ui/Mascot";
import type { BankedGrade } from "./TestRunner";

const S = strings({
  en: {
    loading: "Getting today's questions…",
    failed: "Couldn't load today's questions. Check your connection and refresh.",
    soonTitle: (n: number) => `The daily challenge for Class ${n} is coming soon`,
    soonBody: "Questions are ready for Class 9 and 10. Try one of those sets today.",
    tryClass: (n: number) => `Try Class ${n}`,
    introTitle: (n: number) => `Today's 5 for Class ${n}`,
    introBody: "Everyone in your class gets the same five questions today, mixed from all subjects. Only your first attempt counts, so read carefully.",
    start: "Start challenge",
    q: (i: number, n: number) => `Question ${i} of ${n}`,
    check: "Check",
    next: "Next",
    finish: "See result",
    right: "Correct!",
    wrongAns: (a: string) => `Not quite. Answer: ${a}`,
    scoreTitle: (s: number, n: number) => `You scored ${s}/${n} today`,
    perfect: "Perfect score! Gyani is impressed.",
    good: "Nice work. Come back tomorrow for a new set.",
    low: "Every mistake is in your notebook now — review them and beat tomorrow's set.",
    copy: "Copy result",
    copied: "Result copied — share it with friends!",
    copyManual: "Copy this text:",
    next24: "Next challenge in",
    answers: "Today's answers",
    yours: (a: string) => `Your answer: ${a}`,
    correct: (a: string) => `Correct: ${a}`,
    week: "Last 7 days",
    done: (s: number, n: number) => `done, ${s} of ${n}`,
    missed: "missed",
    todayLeft: "today, not done yet",
    streakNote: (n: number) => (n > 1 ? `${n} days in a row!` : n === 1 ? "1 day — keep it going tomorrow!" : "Start a streak today."),
    subjectChapter: (s: string, c: string) => `${s} · ${c}`,
  },
  hi: {
    loading: "आज के प्रश्न लाए जा रहे हैं…",
    failed: "आज के प्रश्न लोड नहीं हो सके। इंटरनेट जाँचें और पेज फिर से खोलें।",
    soonTitle: (n: number) => `कक्षा ${n} की दैनिक चुनौती जल्द आ रही है`,
    soonBody: "कक्षा 9 और 10 के प्रश्न तैयार हैं। आज उनमें से कोई सेट आज़माएँ।",
    tryClass: (n: number) => `कक्षा ${n} आज़माएँ`,
    introTitle: (n: number) => `कक्षा ${n} के आज के 5 प्रश्न`,
    introBody: "आज आपकी कक्षा के सभी विद्यार्थियों को सभी विषयों से मिले-जुले यही पाँच प्रश्न मिलेंगे। केवल पहला प्रयास गिना जाता है, इसलिए ध्यान से पढ़ें।",
    start: "चुनौती शुरू करें",
    q: (i: number, n: number) => `प्रश्न ${i} / ${n}`,
    check: "जाँचें",
    next: "आगे",
    finish: "परिणाम देखें",
    right: "सही!",
    wrongAns: (a: string) => `सही नहीं। उत्तर: ${a}`,
    scoreTitle: (s: number, n: number) => `आज आपका स्कोर ${s}/${n} है`,
    perfect: "पूरे अंक! ज्ञानी बहुत खुश है।",
    good: "बढ़िया! कल नए सेट के लिए फिर आइए।",
    low: "हर गलती आपकी कॉपी में जुड़ गई है — उन्हें दोहराएँ और कल बेहतर करें।",
    copy: "परिणाम कॉपी करें",
    copied: "परिणाम कॉपी हो गया — दोस्तों से साझा करें!",
    copyManual: "यह टेक्स्ट कॉपी करें:",
    next24: "अगली चुनौती",
    answers: "आज के उत्तर",
    yours: (a: string) => `आपका उत्तर: ${a}`,
    correct: (a: string) => `सही उत्तर: ${a}`,
    week: "पिछले 7 दिन",
    done: (s: number, n: number) => `पूरा, ${n} में से ${s}`,
    missed: "छूट गया",
    todayLeft: "आज, अभी बाकी",
    streakNote: (n: number) => (n > 1 ? `लगातार ${n} दिन!` : n === 1 ? "1 दिन — कल भी जारी रखें!" : "आज से सिलसिला शुरू करें।"),
    subjectChapter: (s: string, c: string) => `${s} · ${c}`,
  },
});

type DailyQ = { key: string; subject: string; chapter: string; q: string; options: string[]; answer: number; explanation: string };

const PICKS_KEY = "kaksha:daily-picks";
const TOTAL = 5;

function readPicks(date: string, grade: number): number[] | null {
  try {
    const raw = JSON.parse(localStorage.getItem(PICKS_KEY) ?? "null");
    return raw?.date === date && raw?.grade === grade && Array.isArray(raw.picks) ? raw.picks : null;
  } catch {
    return null;
  }
}
function savePicks(date: string, grade: number, picks: number[]) {
  try {
    localStorage.setItem(PICKS_KEY, JSON.stringify({ date, grade, picks }));
  } catch {
    /* storage unavailable: the score is still saved in progress */
  }
}

const dayLabel = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/** Daily challenge: 5 MCQs per class per day, seeded by the date so everyone gets the same set. */
export function Daily({ classes }: { classes: BankedGrade[] }) {
  const t = useT(S);
  const lang = useLang();
  const hydrated = useHydrated();
  const mine = useStore((s) => s.profile.grade);
  const daily = useStore((s) => s.daily);
  const [override, setOverride] = useState<number | null>(null);
  const [date, setDate] = useState(() => today());
  const grade = override ?? mine ?? 10;
  const cls = classes.find((c) => c.grade === grade);
  const [qs, setQs] = useState<DailyQ[] | null | "loading">("loading");
  const [phase, setPhase] = useState<"intro" | "play">("intro");
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [picks, setPicks] = useState<number[]>([]);
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hydrated || !cls?.subjects.length) return;
    let live = true;
    setQs("loading");
    Promise.all(cls.subjects.map((s) => loadBank(grade, s.id))).then((banks) => {
      if (!live) return;
      const pool: DailyQ[] = banks.flatMap((b) =>
        b ? b.chapters.flatMap((c) => c.mcq.map((m) => ({ key: `${grade}/${b.subject}/${c.id}`, subject: b.name, chapter: c.title, q: m.q, options: m.options, answer: m.answer, explanation: m.explanation }))) : [],
      );
      setQs(pool.length ? seededShuffle(pool, date).slice(0, TOTAL) : null);
    });
    return () => {
      live = false;
    };
  }, [hydrated, cls, grade, date]);

  if (!hydrated) return <div className="h-96" />;

  const strip = <WeekStrip daily={daily} date={date} t={t} />;

  if (!cls?.subjects.length)
    return (
      <div className="space-y-6" lang={lang === "hi" ? "hi" : undefined}>
        <EmptyState
          title={t.soonTitle(grade)}
          body={t.soonBody}
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {[10, 9]
                .filter((n) => classes.some((c) => c.grade === n && c.subjects.length))
                .map((n) => (
                  <Button key={n} variant="secondary" onClick={() => setOverride(n)}>
                    {t.tryClass(n)}
                  </Button>
                ))}
            </div>
          }
        />
        {strip}
      </div>
    );

  if (qs === "loading")
    return (
      <p className="card p-6 text-ink-3" role="status">
        {t.loading}
      </p>
    );
  if (!qs)
    return (
      <p className="card p-6 text-coral-700" role="alert">
        {t.failed}
      </p>
    );

  const result = daily[date];

  /* ───────── Result (one attempt per day) ───────── */
  if (result) {
    const saved = picks.length === qs.length ? picks : readPicks(date, grade);
    const emojis = saved ? saved.map((p, k) => (p === qs[k].answer ? "🟩" : "🟥")).join("") : "";
    const share = `Kaksha Daily ${dayLabel(new Date())} · ${result.score}/${result.total}${emojis ? ` ${emojis}` : ""}`;
    return (
      <div className="space-y-6" lang={lang === "hi" ? "hi" : undefined}>
        <div className="card flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:p-8 sm:text-left">
          <Mascot mood={result.score === result.total ? "cheer" : result.score >= 3 ? "happy" : "think"} size={96} />
          <div className="min-w-0 flex-1">
            <p className="text-2xl font-extrabold">{t.scoreTitle(result.score, result.total)}</p>
            <p className="mt-1 text-ink-2">{result.score === result.total ? t.perfect : result.score >= 3 ? t.good : t.low}</p>
            {emojis && (
              <p className="mt-3 text-2xl tracking-widest" aria-hidden>
                {emojis}
              </p>
            )}
            <ShareBox text={share} t={t} />
          </div>
          <Countdown onRollover={() => setDate(today())} t={t} />
        </div>

        {strip}

        <section aria-labelledby="d-ans">
          <h2 id="d-ans" className="mb-3 text-xl font-extrabold">
            {t.answers}
          </h2>
          <ol className="space-y-3">
            {qs.map((q, k) => {
              const p = saved?.[k];
              const ok = p === q.answer;
              return (
                <li key={k} className="card p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-3">
                    Q{k + 1} · {t.subjectChapter(q.subject, q.chapter)}
                  </p>
                  <p className="mt-1 whitespace-pre-line font-semibold">{q.q}</p>
                  <p className={cn("mt-2 flex flex-wrap items-center gap-x-2 text-sm font-bold", p === undefined ? "text-green-700" : ok ? "text-green-700" : "text-coral-700")}>
                    {p !== undefined && (ok ? <Check className="size-4" aria-hidden /> : <X className="size-4" aria-hidden />)}
                    {p !== undefined && !ok && <span>{t.yours(q.options[p])} ·</span>}
                    <span>{t.correct(q.options[q.answer])}</span>
                  </p>
                  {q.explanation && <p className="mt-1 text-sm text-ink-2">{q.explanation}</p>}
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    );
  }

  /* ───────── Intro ───────── */
  if (phase === "intro")
    return (
      <div className="space-y-6" lang={lang === "hi" ? "hi" : undefined}>
        <div className="card flex flex-col items-center gap-5 overflow-hidden p-6 text-center sm:flex-row sm:p-8 sm:text-left">
          <span className="grid size-20 shrink-0 place-items-center rounded-3xl bg-coral-500 text-white shadow-float">
            <CalendarCheck aria-hidden className="size-10" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="eyebrow">{dayLabel(new Date())}</p>
            <p className="text-2xl font-extrabold">{t.introTitle(grade)}</p>
            <p className="mt-1 text-ink-2">{t.introBody}</p>
          </div>
          <Button size="lg" onClick={() => setPhase("play")} iconRight={<ArrowRight className="size-5" aria-hidden />}>
            {t.start}
          </Button>
        </div>
        {strip}
      </div>
    );

  /* ───────── Play ───────── */
  const q = qs[i];
  const correct = pick === q.answer;
  const check = () => {
    if (pick === null) return;
    setChecked(true);
    if (pick === q.answer) confettiFrom(card.current?.querySelector("[aria-checked=true]"), { count: 40, spread: 50, power: 0.7 });
    else actions.addMistake({ key: q.key, prompt: q.q, options: q.options, answer: q.answer, explanation: q.explanation || undefined });
  };
  const next = () => {
    const all = [...picks, pick!];
    setPicks(all);
    if (i + 1 >= qs.length) {
      const score = all.filter((p, k) => p === qs[k].answer).length;
      savePicks(date, grade, all);
      actions.recordDaily(date, score, qs.length);
      if (score === qs.length) fireConfetti({ count: 160, power: 1.2 });
      window.scrollTo({ top: 0 });
      return;
    }
    setI(i + 1);
    setPick(null);
    setChecked(false);
  };

  return (
    <div ref={card} className="card p-5 sm:p-7" lang={lang === "hi" ? "hi" : undefined}>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex flex-1 gap-1.5" aria-hidden>
          {qs.map((_, k) => (
            <span key={k} className={cn("h-2.5 flex-1 rounded-full", k < i ? (picks[k] === qs[k].answer ? "bg-green-500" : "bg-coral-500") : k === i ? "bg-brand-500" : "bg-surface-2")} />
          ))}
        </div>
        <span className="text-sm font-bold tabular-nums text-ink-3">{t.q(i + 1, qs.length)}</span>
      </div>
      <p className="text-xs font-bold uppercase tracking-wide text-ink-3">{t.subjectChapter(q.subject, q.chapter)}</p>
      <p id="dq" className="mt-1 whitespace-pre-line text-xl font-extrabold leading-snug">
        {q.q}
      </p>
      <div role="radiogroup" aria-labelledby="dq" className="mt-5 grid gap-3 sm:grid-cols-2">
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
              <span className="min-w-0">{o}</span>
            </button>
          );
        })}
      </div>
      <div aria-live="polite">
        {checked && (
          <div className={cn("animate-rise mt-5 rounded-xl p-4", correct ? "bg-green-50" : "bg-coral-50")}>
            <p className={cn("font-extrabold", correct ? "text-green-700" : "text-coral-700")}>{correct ? t.right : t.wrongAns(q.options[q.answer])}</p>
            {q.explanation && <p className="mt-1 text-ink-2">{q.explanation}</p>}
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end">
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
  );
}

type T = (typeof S)["en"];

function ShareBox({ text, t }: { text: string; t: T }) {
  const [manual, setManual] = useState(false);
  return (
    <div className="mt-4">
      <Button
        variant="secondary"
        size="sm"
        icon={<Copy className="size-4" aria-hidden />}
        onClick={async () => {
          if (await copyText(text)) toast(t.copied);
          else setManual(true);
        }}
      >
        {t.copy}
      </Button>
      {manual && (
        <div className="mt-3">
          <label htmlFor="d-share" className="text-sm font-bold text-ink-2">
            {t.copyManual}
          </label>
          <textarea id="d-share" readOnly rows={2} value={text} onFocus={(e) => e.currentTarget.select()} autoFocus className="mt-1 w-full rounded-xl border-2 border-line bg-surface-2 p-2 text-sm" />
        </div>
      )}
    </div>
  );
}

function Countdown({ onRollover, t }: { onRollover: () => void; t: T }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const left = Math.max(0, Math.floor((midnight.getTime() - now) / 1000));
  const day = today(new Date(now));
  const seen = useRef(day);
  useEffect(() => {
    if (day === seen.current) return;
    seen.current = day;
    onRollover();
  }, [day, onRollover]);
  const hh = String(Math.floor(left / 3600)).padStart(2, "0");
  const mm = String(Math.floor((left % 3600) / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <div className="shrink-0 rounded-2xl bg-surface-2 px-5 py-4 text-center">
      <p className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-3">
        <Timer aria-hidden className="size-4" /> {t.next24}
      </p>
      <p className="mt-1 text-3xl font-extrabold tabular-nums" role="timer" aria-live="off">
        {hh}:{mm}:{ss}
      </p>
    </div>
  );
}

function WeekStrip({ daily, date, t }: { daily: Record<string, { score: number; total: number }>; date: string; t: T }) {
  const days = Array.from({ length: 7 }, (_, k) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - k));
    return { d, key: today(d) };
  });
  let streak = 0;
  for (let k = days.length - 1; k >= 0; k--) {
    if (daily[days[k].key]) streak++;
    else if (days[k].key !== date) break;
  }
  return (
    <section className="card p-5" aria-labelledby="d-week">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 id="d-week" className="font-extrabold">
          {t.week}
        </h2>
        <span className="ml-auto flex items-center gap-1 text-sm font-bold text-coral-600">
          <Flame aria-hidden className="size-4" /> {t.streakNote(streak)}
        </span>
      </div>
      <ol className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map(({ d, key }) => {
          const r = daily[key];
          const isToday = key === date;
          const label = `${d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}: ${r ? t.done(r.score, r.total) : isToday ? t.todayLeft : t.missed}`;
          return (
            <li key={key} className="flex flex-col items-center gap-1" aria-label={label}>
              <span className="text-[11px] font-bold text-ink-3" aria-hidden>
                {d.toLocaleDateString("en-IN", { weekday: "narrow" })}
              </span>
              <span
                aria-hidden
                className={cn(
                  "grid size-9 place-items-center rounded-xl text-xs font-extrabold sm:size-11",
                  r ? (r.score === r.total ? "bg-green-500 text-white" : "bg-green-100 text-green-700") : isToday ? "border-2 border-dashed border-brand-400 text-brand-600" : "bg-coral-50 text-coral-600",
                )}
              >
                {r ? `${r.score}/${r.total}` : isToday ? "?" : <X className="size-4" />}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
