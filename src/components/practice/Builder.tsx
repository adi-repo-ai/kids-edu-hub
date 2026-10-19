"use client";

import { CheckSquare, Clock, FileQuestion, PenLine, Sparkles, Square, Wand2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { loadBank, shuffle, type Bank } from "@/lib/bank";
import { cn } from "@/lib/cn";
import { strings, useLang, useT } from "@/lib/i18n";
import { useHydrated, useStore } from "@/lib/store";
import { Crumbs, PageTitle } from "../layout/PageTitle";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { SubjectIcon } from "../ui/SubjectIcon";
import { TestRunner, type BankedGrade, type TestQuestion } from "./TestRunner";

const S = strings({
  en: {
    cls: "Class",
    classN: (n: number) => `Class ${n}`,
    soon: "soon",
    comingSoon: (n: number) => `Practice for Class ${n} is coming soon`,
    comingSoonBody: "Questions are ready for Class 9 and 10. Pick one of those classes to build a test.",
    subject: "Subject",
    chapters: "Chapters",
    selectAll: "Select all",
    clearAll: "Clear all",
    chapterCount: (s: number, n: number) => `${s} of ${n} selected`,
    mcqs: (n: number) => `${n} MCQs`,
    howMany: "Number of MCQs",
    available: (n: number) => `${n} available in the chapters you picked`,
    fewer: (n: number) => `Only ${n} MCQs in these chapters — pick more chapters for a longer test.`,
    written: "Include written questions",
    writtenHint: (n: number) => (n ? `Adds up to ${Math.min(3, n)} written questions with model answers. You mark these yourself.` : "No written questions in the chapters you picked."),
    timer: "Timer",
    timerHint: "The test submits itself when time runs out.",
    minutes: "Minutes",
    fewerMin: "Fewer minutes",
    moreMin: "More minutes",
    on: "On",
    off: "Off",
    create: "Create test",
    loading: "Loading questions…",
    failed: "Couldn't load questions for this subject. Check your connection and try again.",
    pickChapter: "Pick at least one chapter.",
    summary: (m: number, w: number, min: number | null) => `${m} MCQs${w ? ` + ${w} written` : ""} · ${min ? `${min} min` : "no timer"}`,
    title: (subject: string) => `${subject} custom test`,
    note: "Questions come from the chapter quizzes in Kaksha's lessons. Every test is a fresh random mix.",
  },
  hi: {
    cls: "कक्षा",
    classN: (n: number) => `कक्षा ${n}`,
    soon: "जल्द",
    comingSoon: (n: number) => `कक्षा ${n} का अभ्यास जल्द आ रहा है`,
    comingSoonBody: "कक्षा 9 और 10 के प्रश्न तैयार हैं। टेस्ट बनाने के लिए इनमें से कोई कक्षा चुनें।",
    subject: "विषय",
    chapters: "अध्याय",
    selectAll: "सभी चुनें",
    clearAll: "सभी हटाएँ",
    chapterCount: (s: number, n: number) => `${n} में से ${s} चुने`,
    mcqs: (n: number) => `${n} बहुविकल्पीय प्रश्न`,
    howMany: "बहुविकल्पीय प्रश्नों की संख्या",
    available: (n: number) => `चुने गए अध्यायों में ${n} प्रश्न उपलब्ध`,
    fewer: (n: number) => `इन अध्यायों में केवल ${n} प्रश्न हैं — लंबे टेस्ट के लिए और अध्याय चुनें।`,
    written: "लिखित प्रश्न भी जोड़ें",
    writtenHint: (n: number) => (n ? `आदर्श उत्तरों के साथ ${Math.min(3, n)} तक लिखित प्रश्न जुड़ेंगे। इनके अंक आप स्वयं देंगे।` : "चुने गए अध्यायों में कोई लिखित प्रश्न नहीं है।"),
    timer: "टाइमर",
    timerHint: "समय खत्म होने पर टेस्ट अपने आप जमा हो जाएगा।",
    minutes: "मिनट",
    fewerMin: "कम मिनट",
    moreMin: "ज़्यादा मिनट",
    on: "चालू",
    off: "बंद",
    create: "टेस्ट बनाएँ",
    loading: "प्रश्न लोड हो रहे हैं…",
    failed: "इस विषय के प्रश्न लोड नहीं हो सके। इंटरनेट जाँचें और फिर कोशिश करें।",
    pickChapter: "कम से कम एक अध्याय चुनें।",
    summary: (m: number, w: number, min: number | null) => `${m} बहुविकल्पीय${w ? ` + ${w} लिखित` : ""} · ${min ? `${min} मिनट` : "बिना टाइमर"}`,
    title: (subject: string) => `${subject} कस्टम टेस्ट`,
    note: "प्रश्न कक्षा के पाठों की अध्याय-क्विज़ से लिए जाते हैं। हर टेस्ट नया और अलग मिश्रण होता है।",
  },
});

type Running = { id: number; title: string; questions: TestQuestion[]; minutes: number | null };

/** Custom test builder: choose class, subject, chapters and length, then take it in the TestRunner. */
function BuilderBody({ classes }: { classes: BankedGrade[] }) {
  const t = useT(S);
  const lang = useLang();
  const hydrated = useHydrated();
  const mine = useStore((s) => s.profile.grade);
  const firstBanked = classes.filter((c) => c.subjects.length).at(-1)?.grade ?? 10;
  const [grade, setGrade] = useState<number>(firstBanked);
  const [subject, setSubject] = useState<string>("");
  const [bank, setBank] = useState<Bank | null | "loading">("loading");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [count, setCount] = useState(10);
  const [written, setWritten] = useState(false);
  const [timer, setTimer] = useState(true);
  const [minutes, setMinutes] = useState(15);
  const [run, setRun] = useState<Running | null>(null);

  useEffect(() => {
    if (hydrated && mine) setGrade(mine);
  }, [hydrated, mine]);

  const g = classes.find((c) => c.grade === grade);
  const subjects = g?.subjects ?? [];
  const sub = subjects.find((s) => s.id === subject) ?? subjects[0];

  useEffect(() => {
    if (!sub) return;
    let live = true;
    setBank("loading");
    loadBank(grade, sub.id).then((b) => {
      if (!live) return;
      setBank(b);
      setPicked(new Set(b?.chapters.filter((c) => c.mcq.length).map((c) => c.id) ?? []));
    });
    return () => {
      live = false;
    };
  }, [grade, sub]);

  const chapters = useMemo(() => (bank && bank !== "loading" ? bank.chapters.filter((c) => c.mcq.length || c.written.length) : []), [bank]);
  const chosen = chapters.filter((c) => picked.has(c.id));
  const mcqPool = chosen.reduce((n, c) => n + c.mcq.length, 0);
  const writtenPool = chosen.reduce((n, c) => n + c.written.length, 0);
  const maxCount = Math.min(40, mcqPool);
  const nMcq = Math.min(count, maxCount);
  const nWritten = written ? Math.min(3, writtenPool) : 0;

  const build = (): Running | null => {
    if (!bank || bank === "loading" || !sub || !chosen.length) return null;
    const mcq: TestQuestion[] = shuffle(chosen.flatMap((c) => c.mcq.map((m) => ({ kind: "mcq" as const, key: `${grade}/${sub.id}/${c.id}`, chapter: c.title, q: m.q, options: m.options, answer: m.answer, explanation: m.explanation })))).slice(0, nMcq);
    const wr: TestQuestion[] = shuffle(chosen.flatMap((c) => c.written.map((w) => ({ kind: "written" as const, key: `${grade}/${sub.id}/${c.id}`, chapter: c.title, q: w.q, answer: w.answer, marks: w.marks })))).slice(0, nWritten);
    return { id: Date.now(), title: t.title(sub.name), questions: [...mcq, ...wr], minutes: timer ? minutes : null };
  };

  if (run)
    return (
      <TestRunner
        key={run.id}
        title={run.title}
        questions={run.questions}
        minutes={run.minutes}
        onExit={() => setRun(null)}
        onNew={() => {
          const next = build();
          if (next) setRun(next);
          else setRun(null);
        }}
      />
    );

  const toggle = (id: string) =>
    setPicked((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]" lang={lang === "hi" ? "hi" : undefined}>
      <div className="min-w-0 space-y-6">
        <section className="card p-5" aria-labelledby="b-class">
          <h2 id="b-class" className="eyebrow mb-3">
            {t.cls}
          </h2>
          <div className="flex flex-wrap gap-2">
            {classes.map((c) => (
              <button
                key={c.grade}
                type="button"
                aria-pressed={grade === c.grade}
                onClick={() => {
                  setGrade(c.grade);
                  setSubject("");
                }}
                className={cn(
                  "inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-extrabold",
                  grade === c.grade ? "bg-ink text-canvas" : "bg-surface text-ink-2 ring-1 ring-line hover:bg-surface-2",
                  !c.subjects.length && grade !== c.grade && "text-ink-3",
                )}
              >
                {c.grade}
                {!c.subjects.length && <span className="text-[10px] font-bold uppercase opacity-70">{t.soon}</span>}
              </button>
            ))}
          </div>
        </section>

        {!subjects.length ? (
          <EmptyState title={t.comingSoon(grade)} body={t.comingSoonBody} action={<div className="flex flex-wrap justify-center gap-2">{[10, 9].filter((n) => classes.some((c) => c.grade === n && c.subjects.length)).map((n) => <Button key={n} variant="secondary" onClick={() => setGrade(n)}>{t.classN(n)}</Button>)}</div>} />
        ) : (
          <>
            <section className="card p-5" aria-labelledby="b-sub">
              <h2 id="b-sub" className="eyebrow mb-3">
                {t.subject}
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {subjects.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={sub?.id === s.id}
                    onClick={() => setSubject(s.id)}
                    className={cn("flex items-center gap-3 rounded-xl border-2 p-3 text-left font-bold", sub?.id === s.id ? "border-brand-500 bg-brand-50" : "border-line hover:bg-surface-2")}
                  >
                    <SubjectIcon id={s.id} size="sm" solid={sub?.id === s.id} />
                    <span className="min-w-0 flex-1 truncate">{s.name}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="card p-5" aria-labelledby="b-ch">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h2 id="b-ch" className="eyebrow">
                  {t.chapters}
                </h2>
                {chapters.length > 0 && <span className="text-xs font-semibold text-ink-3">{t.chapterCount(chosen.length, chapters.length)}</span>}
                {chapters.length > 0 && (
                  <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setPicked(chosen.length === chapters.length ? new Set() : new Set(chapters.map((c) => c.id)))}>
                    {chosen.length === chapters.length ? t.clearAll : t.selectAll}
                  </Button>
                )}
              </div>
              {bank === "loading" ? (
                <p className="text-ink-3" role="status">
                  {t.loading}
                </p>
              ) : !bank ? (
                <p className="text-coral-700" role="alert">
                  {t.failed}
                </p>
              ) : (
                <ul className="grid gap-2 sm:grid-cols-2">
                  {chapters.map((c) => {
                    const on = picked.has(c.id);
                    return (
                      <li key={c.id}>
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={on}
                          onClick={() => toggle(c.id)}
                          className={cn("flex w-full items-start gap-2.5 rounded-xl border-2 p-3 text-left", on ? "border-brand-400 bg-brand-50" : "border-line hover:bg-surface-2")}
                        >
                          {on ? <CheckSquare aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-600" /> : <Square aria-hidden className="mt-0.5 size-5 shrink-0 text-ink-3" />}
                          <span className="min-w-0">
                            <span className="block font-bold leading-snug">{c.title}</span>
                            <span className="text-xs font-semibold text-ink-3">{t.mcqs(c.mcq.length)}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <section className="card space-y-6 p-5" aria-label={t.howMany}>
              <div>
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="b-count" className="flex items-center gap-2 font-extrabold">
                    <FileQuestion aria-hidden className="size-5 text-brand-600" /> {t.howMany}
                  </label>
                  <span className="rounded-lg bg-brand-50 px-2.5 py-1 font-extrabold tabular-nums text-brand-700">{nMcq}</span>
                </div>
                <input
                  id="b-count"
                  type="range"
                  min={Math.min(5, maxCount)}
                  max={Math.max(maxCount, 1)}
                  value={nMcq}
                  disabled={maxCount <= 5}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="mt-3 w-full accent-brand-500"
                />
                <p className="mt-1 text-sm text-ink-3">{mcqPool > 0 && mcqPool < 5 ? t.fewer(mcqPool) : t.available(mcqPool)}</p>
              </div>

              <div className="flex items-start gap-3">
                <PenLine aria-hidden className="mt-0.5 size-5 shrink-0 text-violet-600" />
                <div className="min-w-0 flex-1">
                  <p id="b-wr" className="font-extrabold">
                    {t.written}
                  </p>
                  <p className="text-sm text-ink-3">{t.writtenHint(writtenPool)}</p>
                </div>
                <Toggle on={written && writtenPool > 0} disabled={!writtenPool} onClick={() => setWritten((w) => !w)} labelledBy="b-wr" t={t} />
              </div>

              <div className="flex flex-wrap items-start gap-3">
                <Clock aria-hidden className="mt-0.5 size-5 shrink-0 text-amber-600" />
                <div className="min-w-0 flex-1">
                  <p id="b-tm" className="font-extrabold">
                    {t.timer}
                  </p>
                  <p className="text-sm text-ink-3">{t.timerHint}</p>
                </div>
                <Toggle on={timer} onClick={() => setTimer((v) => !v)} labelledBy="b-tm" t={t} />
                {timer && (
                  <div className="flex w-full items-center gap-2 pl-8">
                    <Button variant="secondary" size="sm" aria-label={t.fewerMin} onClick={() => setMinutes((m) => Math.max(5, m - 5))} disabled={minutes <= 5}>
                      −
                    </Button>
                    <label htmlFor="b-min" className="sr-only">
                      {t.minutes}
                    </label>
                    <input
                      id="b-min"
                      type="number"
                      min={1}
                      max={180}
                      value={minutes}
                      onChange={(e) => setMinutes(Math.max(1, Math.min(180, Number(e.target.value) || 1)))}
                      className="h-9 w-20 rounded-lg border-2 border-line bg-surface-2 px-2 text-center font-extrabold tabular-nums outline-none focus:border-brand-400"
                    />
                    <span className="text-sm font-bold text-ink-3">{t.minutes}</span>
                    <Button variant="secondary" size="sm" aria-label={t.moreMin} onClick={() => setMinutes((m) => Math.min(180, m + 5))} disabled={minutes >= 180}>
                      +
                    </Button>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>

      {subjects.length > 0 && (
        <aside className="card flex flex-col items-center self-start p-6 text-center lg:sticky lg:top-24">
          <span className="grid size-16 place-items-center rounded-2xl bg-brand-500 text-white shadow-float">
            <Wand2 aria-hidden className="size-8" />
          </span>
          <p className="mt-4 text-lg font-extrabold">{sub?.name}</p>
          <p className="text-ink-2">{t.summary(nMcq, nWritten, timer ? minutes : null)}</p>
          <Button
            size="lg"
            className="mt-5 w-full"
            disabled={!chosen.length || nMcq < 1}
            onClick={() => {
              const r = build();
              if (r) {
                setRun(r);
                window.scrollTo({ top: 0 });
              }
            }}
            icon={<Sparkles className="size-5" aria-hidden />}
          >
            {t.create}
          </Button>
          {bank && bank !== "loading" && !chosen.length && <p className="mt-2 text-sm font-semibold text-coral-700">{t.pickChapter}</p>}
          <p className="mt-4 text-xs text-ink-3">{t.note}</p>
        </aside>
      )}
    </div>
  );
}

function Toggle({ on, onClick, disabled, labelledBy, t }: { on: boolean; onClick: () => void; disabled?: boolean; labelledBy: string; t: { on: string; off: string } }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-labelledby={labelledBy}
      disabled={disabled}
      onClick={onClick}
      className={cn("relative h-8 w-14 shrink-0 rounded-full transition-colors disabled:opacity-50", on ? "bg-green-500" : "bg-line-strong")}
    >
      <span className="sr-only">{on ? t.on : t.off}</span>
      <span aria-hidden className={cn("absolute top-1 size-6 rounded-full bg-surface shadow transition-[left]", on ? "left-7" : "left-1")} />
    </button>
  );
}

const H = strings({
  en: { eyebrow: "Practice", title: "Build your own test", sub: "Choose chapters, length and a timer. Get a fresh random paper with answers and explanations.", crumb: "Test builder", practice: "Practice" },
  hi: { eyebrow: "अभ्यास", title: "अपना टेस्ट बनाएँ", sub: "अध्याय, लंबाई और टाइमर चुनें। उत्तर और व्याख्या के साथ हर बार नया पेपर पाएँ।", crumb: "टेस्ट बिल्डर", practice: "अभ्यास" },
});

export function Builder({ classes }: { classes: BankedGrade[] }) {
  const h = useT(H);
  const lang = useLang();
  return (
    <div lang={lang === "hi" ? "hi" : undefined}>
      <Crumbs items={[{ href: "/practice", label: h.practice }, { href: "/practice/builder", label: h.crumb }]} />
      <PageTitle eyebrow={h.eyebrow} title={h.title} sub={h.sub} />
      <BuilderBody classes={classes} />
    </div>
  );
}
