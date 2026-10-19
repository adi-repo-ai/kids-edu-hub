"use client";

import { ArrowRight, BookOpen, CalendarClock, ClipboardCheck, Gauge as GaugeIcon, Pencil, Target } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { strings, useT } from "@/lib/i18n";
import { daysUntil, readinessOf, statusOf, subjectReadiness, topActions, type ReadinessAction, type ReadinessStatus, type SubjectReadiness } from "@/lib/readiness";
import { actions, today, useHydrated, useStore } from "@/lib/store";
import { Button } from "../ui/Button";
import { SubjectIcon } from "../ui/SubjectIcon";

const S = strings({
  en: {
    title: "Exam readiness",
    sub: "An estimate from your syllabus completed, chapter-quiz scores and mock tests. It's a guide, not a prediction of your marks.",
    overall: "Overall",
    status: { "on-track": "On track", "getting-there": "Getting there", attention: "Needs attention" } as Record<ReadinessStatus, string>,
    syllabus: "Syllabus",
    quizzes: "Quizzes",
    mocks: "Mocks",
    none: "none yet",
    chapters: (d: number, n: number) => `${d}/${n} chapters`,
    reweighted: "No mock yet, so this score uses 57% syllabus + 43% quizzes.",
    formula: "Score = 40% syllabus completed + 30% average quiz best + 30% mock-test average.",
    fastest: "Raise your score fastest",
    noActions: "Nothing big left to do. Keep revising to stay sharp!",
    gain: (n: number) => `≈ +${n} pts in this subject`,
    finish: (t: string) => `Finish “${t}”`,
    retake: (t: string, b: number, n: number) => `Retake the quiz on “${t}” (best ${b}/${n})`,
    firstQuiz: (t: string) => `Take the quiz on “${t}”`,
    mock: (t: string) => `Attempt ${t}`,
    countdown: "Exam countdown",
    daysLeft: (n: number) => (n === 0 ? "Exam day — all the best!" : n === 1 ? "1 day to go" : `${n} days to go`),
    passed: "Your exam date has passed. Set the next one?",
    on: (d: string) => `Exam starts ${d}`,
    setDate: "When does your exam start?",
    save: "Save date",
    change: "Change date",
    clear: "Clear",
    cancel: "Cancel",
    hint: "CBSE board exams usually start in mid-February; check the date sheet on cbse.gov.in.",
    weeks: (w: number) => `About ${w} weeks — plan ${w > 0 ? "one revision round per week" : "a final revision"}.`,
    summary: "Readiness",
    seeAll: "Details",
    subjectTitle: "Exam readiness",
    gaugeLabel: (name: string) => `${name} readiness`,
  },
  hi: {
    title: "परीक्षा की तैयारी",
    sub: "पूरा हुआ सिलेबस, अध्याय-क्विज़ के अंक और मॉक टेस्ट से निकाला गया अनुमान। यह एक दिशा-सूचक है, आपके अंकों की भविष्यवाणी नहीं।",
    overall: "कुल",
    status: { "on-track": "सही राह पर", "getting-there": "पहुँच रहे हैं", attention: "ध्यान चाहिए" } as Record<ReadinessStatus, string>,
    syllabus: "सिलेबस",
    quizzes: "क्विज़",
    mocks: "मॉक",
    none: "अभी नहीं",
    chapters: (d: number, n: number) => `${d}/${n} अध्याय`,
    reweighted: "अभी कोई मॉक नहीं दिया, इसलिए यह स्कोर 57% सिलेबस + 43% क्विज़ से बना है।",
    formula: "स्कोर = 40% पूरा सिलेबस + 30% क्विज़ का औसत सर्वश्रेष्ठ + 30% मॉक टेस्ट का औसत।",
    fastest: "स्कोर सबसे तेज़ी से बढ़ाएँ",
    noActions: "कोई बड़ा काम बाकी नहीं। तेज़ बने रहने के लिए दोहराते रहें!",
    gain: (n: number) => `इस विषय में ≈ +${n} अंक`,
    finish: (t: string) => `“${t}” पूरा करें`,
    retake: (t: string, b: number, n: number) => `“${t}” का क्विज़ फिर से दें (सर्वश्रेष्ठ ${b}/${n})`,
    firstQuiz: (t: string) => `“${t}” का क्विज़ दें`,
    mock: (t: string) => `${t} दें`,
    countdown: "परीक्षा उलटी गिनती",
    daysLeft: (n: number) => (n === 0 ? "आज परीक्षा है — शुभकामनाएँ!" : `${n} दिन बाकी`),
    passed: "आपकी परीक्षा की तारीख निकल चुकी है। अगली तारीख डालें?",
    on: (d: string) => `परीक्षा ${d} से शुरू`,
    setDate: "आपकी परीक्षा कब शुरू होगी?",
    save: "तारीख सेव करें",
    change: "तारीख बदलें",
    clear: "हटाएँ",
    cancel: "रद्द करें",
    hint: "CBSE बोर्ड परीक्षाएँ आमतौर पर फ़रवरी के मध्य में शुरू होती हैं; डेट शीट cbse.gov.in पर देखें।",
    weeks: (w: number) => `लगभग ${w} हफ़्ते — ${w > 0 ? "हर हफ़्ते एक बार दोहराने की योजना बनाएँ" : "अंतिम दोहराई करें"}।`,
    summary: "तैयारी",
    seeAll: "विवरण",
    subjectTitle: "परीक्षा की तैयारी",
    gaugeLabel: (name: string) => `${name} की तैयारी`,
  },
});

export const statusTone: Record<ReadinessStatus, { stroke: string; text: string; soft: string }> = {
  "on-track": { stroke: "stroke-green-500", text: "text-green-700", soft: "bg-green-50 text-green-700" },
  "getting-there": { stroke: "stroke-amber-500", text: "text-amber-700", soft: "bg-amber-50 text-amber-700" },
  attention: { stroke: "stroke-coral-500", text: "text-coral-700", soft: "bg-coral-50 text-coral-700" },
};

function useAnimated(value: number) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setV(value));
    return () => cancelAnimationFrame(id);
  }, [value]);
  return v;
}

/** Half-circle gauge, 0–100, coloured by readiness status. */
export function Gauge({ value, size = 120, label, className }: { value: number; size?: number; label: string; className?: string }) {
  const v = useAnimated(Math.max(0, Math.min(100, value)));
  const stroke = Math.max(8, Math.round(size / 10));
  const r = (size - stroke) / 2;
  const h = size / 2 + stroke / 2;
  const d = `M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}`;
  return (
    <div className={cn("relative inline-block shrink-0", className)} style={{ width: size, height: h }} role="img" aria-label={`${label}: ${Math.round(value)}/100`}>
      <svg width={size} height={h} aria-hidden>
        <path d={d} fill="none" className="stroke-surface-2" strokeWidth={stroke} strokeLinecap="round" />
        <path d={d} fill="none" className={statusTone[statusOf(value)].stroke} strokeWidth={stroke} strokeLinecap="round" pathLength={100} strokeDasharray="100" strokeDashoffset={100 - v} style={{ transition: "stroke-dashoffset 800ms var(--ease-out)" }} />
      </svg>
      <span className="absolute inset-x-0 bottom-0 text-center font-extrabold tabular-nums leading-none" style={{ fontSize: Math.max(14, size / 5) }} aria-hidden>
        {Math.round(value)}
      </span>
    </div>
  );
}

export function StatusPill({ score }: { score: number }) {
  const t = useT(S);
  const st = statusOf(score);
  return <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-extrabold", statusTone[st].soft)}>{t.status[st]}</span>;
}

/** Exam date countdown; the learner sets the date (we don't guess the official one). */
export function ExamCountdown({ grade, className }: { grade?: number | null; className?: string }) {
  const t = useT(S);
  const examDate = useStore((s) => s.settings.examDate);
  const lang = useStore((s) => s.settings.lang);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const left = examDate ? daysUntil(examDate) : null;
  const showForm = editing || !examDate || (left !== null && left < 0);
  const board = grade === 10 || grade === 12;

  return (
    <section className={cn("card p-5", className)} aria-labelledby="exam-cd">
      <h3 id="exam-cd" className="flex items-center gap-2 font-extrabold">
        <CalendarClock aria-hidden className="size-5 text-coral-600" /> {t.countdown}
      </h3>
      {examDate && left !== null && left >= 0 && !editing && (
        <div className="mt-3">
          <p className="text-3xl font-extrabold tabular-nums">{t.daysLeft(left)}</p>
          <p className="text-sm text-ink-3">
            {t.on(new Date(`${examDate}T12:00:00`).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "long", year: "numeric" }))}
          </p>
          {left > 6 && <p className="mt-1 text-sm text-ink-2">{t.weeks(Math.floor(left / 7))}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" icon={<Pencil className="size-4" aria-hidden />} onClick={() => { setDraft(examDate); setEditing(true); }}>
              {t.change}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => actions.setSettings({ examDate: "" })}>
              {t.clear}
            </Button>
          </div>
        </div>
      )}
      {showForm && (
        <form
          className="mt-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft) return;
            actions.setSettings({ examDate: draft });
            setEditing(false);
          }}
        >
          {left !== null && left < 0 && !editing && <p className="mb-2 text-sm text-ink-2">{t.passed}</p>}
          <label htmlFor="exam-date" className="block text-sm font-bold">
            {t.setDate}
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            <input id="exam-date" type="date" min={today()} value={draft} onChange={(e) => setDraft(e.target.value)} className="h-9 min-w-0 rounded-xl border-2 border-line bg-surface px-3 text-sm font-semibold text-ink" />
            <Button size="sm" type="submit" disabled={!draft}>
              {t.save}
            </Button>
            {editing && (
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                {t.cancel}
              </Button>
            )}
          </div>
        </form>
      )}
      {board && <p className="mt-3 text-xs text-ink-3">{t.hint}</p>}
    </section>
  );
}

function ActionRow({ a }: { a: ReadinessAction }) {
  const t = useT(S);
  const Icon = a.kind === "finish" ? BookOpen : a.kind === "quiz" ? Target : ClipboardCheck;
  const label = a.kind === "finish" ? t.finish(a.title) : a.kind === "quiz" ? (a.best === null ? t.firstQuiz(a.title) : t.retake(a.title, a.best, a.total ?? 0)) : t.mock(a.mockTitle);
  return (
    <li>
      <Link href={a.href} className="flex items-center gap-3 rounded-xl p-3 hover:bg-surface-2">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
          <Icon aria-hidden className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold">{label}</span>
          <span className="block text-xs font-semibold text-ink-3">
            {a.subjectName} · <span className="text-green-700">{t.gain(a.gain)}</span>
          </span>
        </span>
        <ArrowRight aria-hidden className="size-4 shrink-0 text-ink-3" />
      </Link>
    </li>
  );
}

function SubjectRow({ r }: { r: SubjectReadiness }) {
  const t = useT(S);
  return (
    <li className="card flex flex-col p-4">
      <div className="flex items-center gap-3">
        <SubjectIcon id={r.subject} size="sm" />
        <Link href={`/class/${r.grade}/${r.subject}`} className="min-w-0 flex-1 truncate font-extrabold hover:underline">
          {r.name}
        </Link>
        <StatusPill score={r.score} />
      </div>
      <Gauge value={r.score} size={128} label={t.gaugeLabel(r.name)} className="mx-auto mt-3" />
      <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <dt className="font-bold text-ink-3">{t.syllabus}</dt>
          <dd className="font-extrabold tabular-nums">{Math.round(r.syllabusPct)}%</dd>
          <dd className="text-ink-3">{t.chapters(r.done, r.chapters)}</dd>
        </div>
        <div>
          <dt className="font-bold text-ink-3">{t.quizzes}</dt>
          <dd className="font-extrabold tabular-nums">{r.quizCount ? `${Math.round(r.quizPct)}%` : "–"}</dd>
          {!r.quizCount && <dd className="text-ink-3">{t.none}</dd>}
        </div>
        <div>
          <dt className="font-bold text-ink-3">{t.mocks}</dt>
          <dd className="font-extrabold tabular-nums">{r.mockPct === null ? "–" : `${Math.round(r.mockPct)}%`}</dd>
          {r.mockPct === null && <dd className="text-ink-3">{t.none}</dd>}
        </div>
      </dl>
      {r.reweighted && <p className="mt-2 text-xs text-ink-3">{t.reweighted}</p>}
    </li>
  );
}

/** Full readiness section: overall score, gauges per subject, quickest wins and the exam countdown. */
export function Readiness({ grade }: { grade: number }) {
  const t = useT(S);
  const s = useStore((x) => x);
  const hydrated = useHydrated();
  if (!hydrated) return <div className="h-64" />;
  const r = readinessOf(s, grade);
  const top = topActions(s, grade, 3);
  return (
    <section aria-labelledby="ready-h" className="space-y-4">
      <div>
        <h2 id="ready-h" className="flex items-center gap-2 text-xl font-extrabold">
          <GaugeIcon aria-hidden className="size-6 text-brand-600" /> {t.title}
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-ink-2">{t.sub}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card flex flex-col items-center p-5 text-center">
          <p className="eyebrow">{t.overall}</p>
          <Gauge value={r.overall} size={180} label={t.overall} className="mt-3" />
          <div className="mt-3">
            <StatusPill score={r.overall} />
          </div>
          <p className="mt-3 text-xs text-ink-3">{t.formula}</p>
        </div>
        <div className="card p-5 lg:col-span-2">
          <h3 className="mb-2 font-extrabold">{t.fastest}</h3>
          {top.length ? <ul className="space-y-1">{top.map((a, i) => <ActionRow key={i} a={a} />)}</ul> : <p className="text-sm text-ink-2">{t.noActions}</p>}
        </div>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {r.subjects.map((x) => (
          <SubjectRow key={x.subject} r={x} />
        ))}
      </ul>
      <ExamCountdown grade={grade} />
    </section>
  );
}

/** Compact card for the dashboard and parent view. */
export function ReadinessSummary({ grade, href = "/progress#readiness", showActions = true }: { grade: number; href?: string; showActions?: boolean }) {
  const t = useT(S);
  const s = useStore((x) => x);
  const r = readinessOf(s, grade);
  const top = showActions ? topActions(s, grade, 1) : [];
  const examDate = s.settings.examDate;
  const left = examDate ? daysUntil(examDate) : null;
  return (
    <section className="card p-5" aria-labelledby="ready-sum">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 id="ready-sum" className="flex items-center gap-2 font-extrabold">
          <GaugeIcon aria-hidden className="size-5 text-brand-600" /> {t.title}
        </h2>
        <Link href={href} className="text-sm font-bold text-brand-600 hover:underline">
          {t.seeAll}
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Gauge value={r.overall} size={110} label={t.overall} />
        <div className="min-w-0 flex-1 space-y-1">
          <StatusPill score={r.overall} />
          {left !== null && left >= 0 && <p className="text-sm font-bold text-coral-700">{t.daysLeft(left)}</p>}
        </div>
      </div>
      <ul className="mt-4 space-y-1.5">
        {r.subjects.map((x) => (
          <li key={x.subject} className="flex items-center gap-2 text-sm">
            <span className="min-w-0 flex-1 truncate font-semibold">{x.name}</span>
            <span className={cn("font-extrabold tabular-nums", statusTone[statusOf(x.score)].text)}>{x.score}</span>
          </li>
        ))}
      </ul>
      {top[0] && (
        <div className="mt-3 border-t border-line pt-2">
          <p className="eyebrow mt-1">{t.fastest}</p>
          <ul>
            <ActionRow a={top[0]} />
          </ul>
        </div>
      )}
    </section>
  );
}

/** One subject's gauge, for the subject page sidebar. */
export function SubjectReadinessCard({ grade, subject }: { grade: number; subject: string }) {
  const t = useT(S);
  const s = useStore((x) => x);
  const hydrated = useHydrated();
  if (!hydrated || grade < 9) return null;
  const r = subjectReadiness(s, grade, subject);
  if (!r) return null;
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="font-extrabold">{t.subjectTitle}</p>
        <StatusPill score={r.score} />
      </div>
      <Gauge value={r.score} size={140} label={t.gaugeLabel(r.name)} className="mx-auto mt-3 block" />
      <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <dt className="font-bold text-ink-3">{t.syllabus}</dt>
          <dd className="font-extrabold tabular-nums">{Math.round(r.syllabusPct)}%</dd>
        </div>
        <div>
          <dt className="font-bold text-ink-3">{t.quizzes}</dt>
          <dd className="font-extrabold tabular-nums">{r.quizCount ? `${Math.round(r.quizPct)}%` : "–"}</dd>
        </div>
        <div>
          <dt className="font-bold text-ink-3">{t.mocks}</dt>
          <dd className="font-extrabold tabular-nums">{r.mockPct === null ? "–" : `${Math.round(r.mockPct)}%`}</dd>
        </div>
      </dl>
      {r.reweighted && <p className="mt-2 text-xs text-ink-3">{t.reweighted}</p>}
      <Link href="/progress#readiness" className="mt-3 block text-sm font-bold text-brand-600 hover:underline">
        {t.fastest} →
      </Link>
    </div>
  );
}
