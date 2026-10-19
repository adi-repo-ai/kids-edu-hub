"use client";

import { ArrowLeft, Check, ChevronRight, Layers, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadBank, type Bank } from "@/lib/bank";
import { fireConfetti } from "@/lib/confetti";
import { cn } from "@/lib/cn";
import { getGrade } from "@/lib/curriculum";
import { strings, useLang, useT } from "@/lib/i18n";
import { actions, schedule, today, useHydrated, useStore, type State } from "@/lib/store";
import { PageTitle } from "../layout/PageTitle";
import { Button, ButtonLink } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { Mascot } from "../ui/Mascot";
import { ProgressBar } from "../ui/Progress";
import { SubjectIcon } from "../ui/SubjectIcon";
import { Rich } from "./Rich";

const S = strings({
  en: {
    eyebrow: "Remember more",
    title: "Flashcards",
    sub: "Key ideas, formulas and must-remember facts from your lessons. Rate each card and it comes back just before you'd forget it.",
    pickClass: "Choose your class first",
    pickClassBody: "Flashcards are made from the lessons in your class.",
    chooseClass: "Choose class",
    soon: (g: number) => `Flashcards for Class ${g} are coming soon`,
    soonBody: "Lessons for this class aren't ready yet — try Class 9 or 10.",
    loading: "Loading your cards…",
    todayDeck: "Today's deck",
    dueCount: (n: number) => (n === 1 ? "1 card due" : `${n} cards due`),
    newCount: (n: number) => (n === 1 ? "1 new card" : `${n} new cards`),
    newFrom: "New cards come from chapters you've completed (up to 10 a day).",
    newFromAny: "Finish a chapter to get new cards from it; until then we pick from the start of each subject.",
    start: "Start today's deck",
    doneToday: "You're done for today! Come back tomorrow, or browse a deck below.",
    browse: "Browse by subject",
    cards: (n: number) => (n === 1 ? "1 card" : `${n} cards`),
    due: (n: number) => `${n} due`,
    noCards: "No cards yet",
    backDecks: "All decks",
    studyAll: "Study whole subject",
    study: "Study",
    completed: "Completed",
    progress: (i: number, n: number) => `Card ${i} of ${n}`,
    question: "Question",
    answer: "Answer",
    flip: "Show answer",
    isNew: "New",
    tryClass: "Explore Class 10",
    tapHint: "Tap the card or press Space to flip",
    keyHint: "Keys: Space flips · 1 Again · 2 Good · 3 Easy",
    again: "Again",
    good: "Good",
    easy: "Easy",
    inDays: (n: number) => (n === 1 ? "1 day" : n < 60 ? `${n} days` : `${Math.round(n / 30)} months`),
    type: { KEY: "Key idea", FORMULA: "Formula", REMEMBER: "Remember" } as Record<string, string>,
    summary: "Deck complete!",
    summaryBody: (n: number) => `You reviewed ${n} card${n === 1 ? "" : "s"}.`,
    xp: (n: number) => `+${n} XP`,
    tally: "How it went",
    endSession: "End session",
  },
  hi: {
    eyebrow: "ज़्यादा याद रखें",
    title: "फ़्लैशकार्ड",
    sub: "आपके पाठों के मुख्य विचार, सूत्र और ज़रूरी बातें। हर कार्ड को रेट करें, वह ठीक तब लौटेगा जब आप उसे भूलने वाले हों।",
    pickClass: "पहले अपनी कक्षा चुनें",
    pickClassBody: "फ़्लैशकार्ड आपकी कक्षा के पाठों से बनते हैं।",
    chooseClass: "कक्षा चुनें",
    soon: (g: number) => `कक्षा ${g} के फ़्लैशकार्ड जल्द आ रहे हैं`,
    soonBody: "इस कक्षा के पाठ अभी तैयार नहीं हैं — कक्षा 9 या 10 आज़माएँ।",
    loading: "आपके कार्ड लोड हो रहे हैं…",
    todayDeck: "आज का डेक",
    dueCount: (n: number) => `${n} कार्ड बाकी`,
    newCount: (n: number) => `${n} नए कार्ड`,
    newFrom: "नए कार्ड आपके पूरे किए गए अध्यायों से आते हैं (रोज़ 10 तक)।",
    newFromAny: "किसी अध्याय को पूरा करें तो उसके नए कार्ड मिलेंगे; तब तक हम हर विषय की शुरुआत से चुनते हैं।",
    start: "आज का डेक शुरू करें",
    doneToday: "आज का काम पूरा! कल फिर आएँ, या नीचे कोई डेक देखें।",
    browse: "विषय के अनुसार देखें",
    cards: (n: number) => `${n} कार्ड`,
    due: (n: number) => `${n} बाकी`,
    noCards: "अभी कोई कार्ड नहीं",
    backDecks: "सभी डेक",
    studyAll: "पूरा विषय पढ़ें",
    study: "पढ़ें",
    completed: "पूरा",
    progress: (i: number, n: number) => `कार्ड ${i} / ${n}`,
    question: "सवाल",
    answer: "उत्तर",
    flip: "उत्तर देखें",
    isNew: "नया",
    tryClass: "कक्षा 10 देखें",
    tapHint: "पलटने के लिए कार्ड पर टैप करें या Space दबाएँ",
    keyHint: "कुंजियाँ: Space पलटे · 1 फिर से · 2 ठीक · 3 आसान",
    again: "फिर से",
    good: "ठीक",
    easy: "आसान",
    inDays: (n: number) => (n < 60 ? `${n} दिन` : `${Math.round(n / 30)} महीने`),
    type: { KEY: "मुख्य विचार", FORMULA: "सूत्र", REMEMBER: "याद रखें" } as Record<string, string>,
    summary: "डेक पूरा!",
    summaryBody: (n: number) => `आपने ${n} कार्ड दोहराए।`,
    xp: (n: number) => `+${n} XP`,
    tally: "कैसा रहा",
    endSession: "सत्र खत्म करें",
  },
});

interface CardInfo {
  id: string;
  subject: string;
  chapter: string;
  chapterTitle: string;
  front: string;
  back: string;
  type: string;
}

const NEW_PER_DAY = 10;
const NEW_KEY = "kaksha:flash-new";

/** Ids of cards first studied today (per browser), so new cards are capped at 10 a day. */
function readIntroduced(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(NEW_KEY) ?? "null");
    return raw?.date === today() && Array.isArray(raw.ids) ? raw.ids : [];
  } catch {
    return [];
  }
}
function writeIntroduced(ids: string[]) {
  try {
    localStorage.setItem(NEW_KEY, JSON.stringify({ date: today(), ids }));
  } catch {
    /* storage unavailable: the cap just resets */
  }
}

type View = { kind: "home" } | { kind: "subject"; subject: string } | { kind: "session"; ids: string[]; back: View };

export function Flashcards() {
  const t = useT(S);
  const hydrated = useHydrated();
  const s = useStore((x) => x);
  const params = useSearchParams();
  const grade = s.profile.grade;
  const [banks, setBanks] = useState<Record<string, Bank | null> | null>(null);
  const [view, setView] = useState<View>(() => (params.get("subject") ? { kind: "subject", subject: params.get("subject")! } : { kind: "home" }));
  const [introduced, setIntroduced] = useState<string[]>([]);

  useEffect(() => {
    setIntroduced(readIntroduced());
  }, []);

  useEffect(() => {
    const g = grade ? getGrade(grade) : undefined;
    if (!g) return;
    let live = true;
    Promise.all(g.subjects.map((x) => loadBank(g.grade, x.id).then((b) => [x.id, b] as const))).then((pairs) => live && setBanks(Object.fromEntries(pairs)));
    return () => {
      live = false;
    };
  }, [grade]);

  const all = useMemo(() => {
    const map = new Map<string, CardInfo>();
    if (!banks || !grade) return map;
    for (const [subject, b] of Object.entries(banks))
      for (const ch of b?.chapters ?? [])
        ch.cards.forEach((c, i) => {
          const id = `${grade}/${subject}/${ch.id}#${i}`;
          map.set(id, { id, subject, chapter: ch.id, chapterTitle: ch.title, front: c.front, back: c.back, type: c.type });
        });
    return map;
  }, [banks, grade]);

  const markIntroduced = useCallback((id: string) => {
    setIntroduced((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      writeIntroduced(next);
      return next;
    });
  }, []);

  if (!hydrated) return <div className="h-96" />;
  const header = <PageTitle eyebrow={t.eyebrow} title={t.title} sub={t.sub} />;

  if (!grade)
    return (
      <>
        {header}
        <EmptyState title={t.pickClass} body={t.pickClassBody} action={<ButtonLink href="/learn">{t.chooseClass}</ButtonLink>} />
      </>
    );
  if (!banks)
    return (
      <>
        {header}
        <div className="card flex items-center gap-3 p-6 text-ink-2" role="status">
          <Loader2 aria-hidden className="size-5 animate-spin" /> {t.loading}
        </div>
      </>
    );
  if (!all.size)
    return (
      <>
        {header}
        <EmptyState title={t.soon(grade)} body={t.soonBody} action={<ButtonLink href="/class/10">{t.tryClass}</ButtonLink>} />
      </>
    );

  if (view.kind === "session")
    return (
      <>
        {header}
        <Session key={view.ids.join("|")} ids={view.ids} all={all} onExit={() => setView(view.back)} onIntroduce={markIntroduced} />
      </>
    );

  if (view.kind === "subject" && banks[view.subject])
    return (
      <>
        {header}
        <SubjectDeck grade={grade} subject={view.subject} bank={banks[view.subject]!} s={s} onBack={() => setView({ kind: "home" })} onStudy={(ids) => setView({ kind: "session", ids, back: view })} />
      </>
    );

  const deck = todaysDeck(s, grade, all, banks, introduced);
  return (
    <>
      {header}
      <div className="space-y-8">
        <section className="card flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6" aria-labelledby="today-deck">
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-violet-500 text-white">
            <Layers aria-hidden className="size-8" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="today-deck" className="text-xl font-extrabold">
              {t.todayDeck}
            </h2>
            <p className="mt-1 flex flex-wrap gap-2 text-sm font-bold">
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-amber-700">{t.dueCount(deck.due.length)}</span>
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-brand-700">{t.newCount(deck.fresh.length)}</span>
            </p>
            <p className="mt-2 text-sm text-ink-3">{deck.fromCompleted ? t.newFrom : t.newFromAny}</p>
          </div>
          {deck.due.length + deck.fresh.length > 0 ? (
            <Button size="lg" onClick={() => setView({ kind: "session", ids: [...deck.due, ...deck.fresh], back: { kind: "home" } })}>
              {t.start}
            </Button>
          ) : (
            <p className="flex items-center gap-2 text-sm font-bold text-green-700 sm:max-w-56">
              <Check aria-hidden className="size-5 shrink-0" /> {t.doneToday}
            </p>
          )}
        </section>

        <section aria-labelledby="browse-h">
          <h2 id="browse-h" className="mb-4 text-xl font-extrabold">
            {t.browse}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {getGrade(grade)!.subjects.map((sub) => {
              const b = banks[sub.id];
              const ids = [...all.values()].filter((c) => c.subject === sub.id).map((c) => c.id);
              const dueN = ids.filter((id) => s.cards[id] && s.cards[id].due <= today()).length;
              if (!b || !ids.length)
                return (
                  <li key={sub.id} className="card flex items-center gap-3 p-5 opacity-70">
                    <SubjectIcon id={sub.id} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-extrabold">{sub.name}</span>
                      <span className="text-xs font-semibold text-ink-3">{t.noCards}</span>
                    </span>
                  </li>
                );
              return (
                <li key={sub.id}>
                  <button type="button" onClick={() => setView({ kind: "subject", subject: sub.id })} className="card card-hover flex w-full items-center gap-3 p-5 text-left">
                    <SubjectIcon id={sub.id} solid />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-extrabold">{sub.name}</span>
                      <span className="text-xs font-semibold text-ink-3">
                        {t.cards(ids.length)}
                        {dueN > 0 && <span className="text-amber-700"> · {t.due(dueN)}</span>}
                      </span>
                    </span>
                    <ChevronRight aria-hidden className="size-5 text-ink-3" />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
}

/** Due cards across the class, plus up to 10 new cards a day from completed chapters. */
export function todaysDeck(s: State, grade: number, all: Map<string, CardInfo>, banks: Record<string, Bank | null>, introduced: string[]) {
  const now = today();
  const due = Object.entries(s.cards)
    .filter(([id, c]) => c.due <= now && all.has(id) && id.startsWith(`${grade}/`))
    .sort((a, b) => a[1].due.localeCompare(b[1].due))
    .map(([id]) => id);
  const quota = Math.max(0, NEW_PER_DAY - introduced.length);
  const unseen = (ch: string, subject: string) => [...all.values()].filter((c) => c.subject === subject && c.chapter === ch && !s.cards[c.id]).map((c) => c.id);
  const chapters = Object.entries(banks).flatMap(([subject, b]) => (b?.chapters ?? []).map((ch) => ({ subject, ch: ch.id })));
  const completed = chapters.filter((x) => s.lessons[`${grade}/${x.subject}/${x.ch}`]);
  const fromCompleted = completed.length > 0;
  let pool: string[];
  if (fromCompleted) pool = completed.flatMap((x) => unseen(x.ch, x.subject));
  else {
    // Nothing completed yet: take from each subject's first chapter in turn.
    const per = Object.keys(banks).map((subject) => chapters.filter((x) => x.subject === subject).flatMap((x) => unseen(x.ch, x.subject)));
    pool = [];
    for (let i = 0; pool.length < quota && per.some((p) => p.length > i); i++) for (const p of per) if (p[i]) pool.push(p[i]);
  }
  return { due, fresh: pool.slice(0, quota), fromCompleted };
}

function SubjectDeck({ grade, subject, bank, s, onBack, onStudy }: { grade: number; subject: string; bank: Bank; s: State; onBack: () => void; onStudy: (ids: string[]) => void }) {
  const t = useT(S);
  const now = today();
  const order = (ids: string[]) => {
    const due = ids.filter((id) => s.cards[id] && s.cards[id].due <= now);
    const fresh = ids.filter((id) => !s.cards[id]);
    const later = ids.filter((id) => s.cards[id] && s.cards[id].due > now);
    return [...due, ...fresh, ...later];
  };
  const chapters = bank.chapters.filter((c) => c.cards.length);
  const allIds = chapters.flatMap((ch) => ch.cards.map((_, i) => `${grade}/${subject}/${ch.id}#${i}`));
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} icon={<ArrowLeft className="size-4" aria-hidden />}>
          {t.backDecks}
        </Button>
        {allIds.length > 0 && (
          <Button variant="secondary" size="sm" onClick={() => onStudy(order(allIds))}>
            {t.studyAll}
          </Button>
        )}
      </div>
      <div className="mb-5 flex items-center gap-3">
        <SubjectIcon id={subject} size="lg" solid />
        <div>
          <h2 className="text-2xl font-extrabold">{bank.name}</h2>
          <p className="text-sm font-semibold text-ink-3">{t.cards(allIds.length)}</p>
        </div>
      </div>
      {chapters.length ? (
        <ul className="card divide-y divide-line">
          {chapters.map((ch) => {
            const ids = ch.cards.map((_, i) => `${grade}/${subject}/${ch.id}#${i}`);
            const dueN = ids.filter((id) => s.cards[id] && s.cards[id].due <= now).length;
            const seen = ids.filter((id) => s.cards[id]).length;
            const done = s.lessons[`${grade}/${subject}/${ch.id}`];
            return (
              <li key={ch.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-bold">
                    <span lang={subject === "hindi" ? "hi" : undefined}>{ch.title}</span>
                    {done && <span className="ml-2 rounded-full bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700">{t.completed}</span>}
                  </p>
                  <p className="text-xs font-semibold text-ink-3">
                    {t.cards(ids.length)}
                    {dueN > 0 && <span className="text-amber-700"> · {t.due(dueN)}</span>}
                  </p>
                  <ProgressBar value={(seen / ids.length) * 100} label={ch.title} size="sm" color="bg-violet-500" className="mt-2 max-w-60" />
                </div>
                <Button size="sm" onClick={() => onStudy(order(ids))}>
                  {t.study}
                </Button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="card p-5 text-ink-2">{t.noCards}</p>
      )}
    </div>
  );
}

function Session({ ids, all, onExit, onIntroduce }: { ids: string[]; all: Map<string, CardInfo>; onExit: () => void; onIntroduce: (id: string) => void }) {
  const t = useT(S);
  const lang = useLang();
  const cards = useStore((s) => s.cards);
  const [queue, setQueue] = useState(ids);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [tally, setTally] = useState<[number, number, number]>([0, 0, 0]);
  const [requeued, setRequeued] = useState<Set<string>>(() => new Set());
  const [reviews, setReviews] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const done = pos >= queue.length;
  const id = queue[pos];
  const card = id ? all.get(id) : undefined;

  const rate = useCallback(
    (r: 0 | 1 | 2) => {
      if (!id) return;
      if (!cards[id]) onIntroduce(id);
      actions.reviewCard(id, r);
      setTally((x) => {
        const n: [number, number, number] = [...x];
        n[r]++;
        return n;
      });
      setReviews((n) => n + 1);
      if (r === 0 && !requeued.has(id)) {
        setQueue((q) => [...q, id]);
        setRequeued((set) => new Set(set).add(id));
      }
      setFlipped(false);
      setPos((p) => p + 1);
    },
    [id, cards, requeued, onIntroduce],
  );

  useEffect(() => {
    if (done) {
      if (reviews >= 5) fireConfetti({ count: 100 });
      return;
    }
    cardRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, done]);

  useEffect(() => {
    if (done) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest("input, textarea, select, [contenteditable=true]")) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === " " || e.code === "Space") {
        if (el?.closest("button, a")) return; // let the focused control handle it
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped && (e.key === "1" || e.key === "2" || e.key === "3")) {
        e.preventDefault();
        rate((Number(e.key) - 1) as 0 | 1 | 2);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done, flipped, rate]);

  if (done || !card) {
    return (
      <div className="card flex flex-col items-center gap-4 p-6 text-center sm:p-8">
        <Mascot mood="cheer" size={110} />
        <h2 className="text-2xl font-extrabold">{t.summary}</h2>
        <p className="text-ink-2">
          {t.summaryBody(reviews)} <strong className="text-amber-600">{t.xp(reviews * 2)}</strong>
        </p>
        <div className="w-full max-w-sm">
          <p className="eyebrow mb-2">{t.tally}</p>
          <ul className="grid grid-cols-3 gap-2">
            {[
              { l: t.again, n: tally[0], c: "bg-coral-50 text-coral-700" },
              { l: t.good, n: tally[1], c: "bg-brand-50 text-brand-700" },
              { l: t.easy, n: tally[2], c: "bg-green-50 text-green-700" },
            ].map((x) => (
              <li key={x.l} className={cn("rounded-xl p-3", x.c)}>
                <p className="text-2xl font-extrabold tabular-nums">{x.n}</p>
                <p className="text-xs font-bold">{x.l}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={onExit} icon={<ArrowLeft className="size-4" aria-hidden />}>
            {t.backDecks}
          </Button>
        </div>
      </div>
    );
  }

  const hi = card.subject === "hindi";
  const preview = ([0, 1, 2] as const).map((r) => schedule(cards[card.id], r).interval);
  const face = "col-start-1 row-start-1 flex min-h-64 flex-col rounded-3xl border border-line border-b-4 p-6 [backface-visibility:hidden] sm:p-8";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onExit} icon={<ArrowLeft className="size-4" aria-hidden />}>
          {t.endSession}
        </Button>
        <ProgressBar value={(pos / queue.length) * 100} label={t.progress(pos + 1, queue.length)} className="flex-1" color="bg-violet-500" />
        <span className="text-sm font-bold tabular-nums text-ink-3">
          {pos + 1}/{queue.length}
        </span>
      </div>
      <p className="mb-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-ink-3">
        <SubjectIcon id={card.subject} size="sm" />
        <span className="min-w-0 truncate" lang={hi ? "hi" : undefined}>
          {card.chapterTitle}
        </span>
        <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-bold text-violet-700">{t.type[card.type] ?? card.type}</span>
        {!cards[card.id] && (
          <span className="flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
            <Sparkles aria-hidden className="size-3" /> {t.isNew}
          </span>
        )}
      </p>

      {/* Mouse/touch flip on the card; keyboard users have Space and the button below. */}
      <div
        ref={cardRef}
        tabIndex={-1}
        onClick={() => setFlipped((f) => !f)}
        className="cursor-pointer outline-none [perspective:1200px]"
        aria-label={t.progress(pos + 1, queue.length)}
        role="group"
      >
        <div className={cn("grid transition-transform duration-500 ease-out [transform-style:preserve-3d] motion-reduce:transition-none", flipped && "[transform:rotateY(180deg)]")}>
          <div className={cn(face, "bg-surface")} aria-hidden={flipped}>
            <p className="eyebrow">{t.question}</p>
            <div className="grid flex-1 place-items-center py-4 text-center">
              <p className="text-2xl font-extrabold leading-snug" lang={hi ? "hi" : undefined}>
                {card.front}
              </p>
            </div>
            <p className="text-center text-xs font-semibold text-ink-3">{t.tapHint}</p>
          </div>
          <div className={cn(face, "bg-violet-50 [transform:rotateY(180deg)]")} aria-hidden={!flipped}>
            <p className="eyebrow">{t.answer}</p>
            <p className="mt-1 font-extrabold" lang={hi ? "hi" : undefined}>
              {card.front}
            </p>
            <div className="flex-1 py-3" aria-live="polite">
              {flipped && <Rich text={card.back} className="space-y-1.5 text-lg leading-relaxed text-ink-2" />}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5" lang={lang}>
        {flipped ? (
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {([
              { r: 0, l: t.again, v: "danger" },
              { r: 1, l: t.good, v: "primary" },
              { r: 2, l: t.easy, v: "success" },
            ] as const).map((b) => (
              <Button key={b.r} variant={b.v} onClick={() => rate(b.r)} className="h-auto flex-col gap-0 whitespace-normal py-2" aria-keyshortcuts={String(b.r + 1)}>
                <span>{b.l}</span>
                <span className="text-xs font-semibold opacity-90">{t.inDays(preview[b.r])}</span>
              </Button>
            ))}
          </div>
        ) : (
          <Button size="lg" variant="secondary" className="w-full" onClick={() => setFlipped(true)} icon={<RefreshCw className="size-4" aria-hidden />} aria-keyshortcuts="Space">
            {t.flip}
          </Button>
        )}
        <p className="mt-3 hidden text-center text-xs font-semibold text-ink-3 sm:block">{t.keyHint}</p>
      </div>
    </div>
  );
}
