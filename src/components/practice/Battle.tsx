"use client";

import { ArrowRight, Bot, Check, Info, RotateCcw, Swords, Timer, Trophy, User, X, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadBank, shuffle, type Bank } from "@/lib/bank";
import { fireConfetti } from "@/lib/confetti";
import { cn } from "@/lib/cn";
import { strings, useLang, useT } from "@/lib/i18n";
import { actions, useHydrated, useStore } from "@/lib/store";
import { PageTitle } from "../layout/PageTitle";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { Mascot } from "../ui/Mascot";
import { SubjectIcon } from "../ui/SubjectIcon";
import type { BankedGrade } from "./TestRunner";

const ROUNDS = 7;
const SECONDS = 15;
const BASE = 100;
const BONUS = 50;

type Level = "easy" | "medium" | "hard";
/** Gyani Bot's accuracy and answer time (seconds) per level. */
const BOT: Record<Level, { acc: number; min: number; max: number }> = {
  easy: { acc: 0.55, min: 7, max: 13 },
  medium: { acc: 0.7, min: 5, max: 10 },
  hard: { acc: 0.85, min: 3, max: 7 },
};

const S = strings({
  en: {
    bot: "Gyani Bot",
    botTag: "Bot",
    you: "You",
    soonTitle: (n: number) => `Battles for Class ${n} are coming soon`,
    soonBody: "Questions are ready for Class 9 and 10. Battle with one of those for now.",
    tryClass: (n: number) => `Class ${n}`,
    subject: "Subject",
    chapter: "Chapter (optional)",
    allChapters: "All chapters",
    level: "Gyani Bot's level",
    levels: { easy: "Easy", medium: "Medium", hard: "Hard" } as Record<Level, string>,
    levelHint: { easy: "Gets about 55% right, answers slowly", medium: "Gets about 70% right, answers steadily", hard: "Gets about 85% right, answers fast" } as Record<Level, string>,
    rules: `${ROUNDS} rounds · ${SECONDS} seconds each · ${BASE} points for a right answer + up to ${BONUS} speed bonus`,
    start: "Start battle",
    loading: "Loading questions…",
    failed: "Couldn't load questions. Check your connection and try again.",
    few: "Not enough questions here — pick all chapters or another subject.",
    friends: "Live battles with friends need accounts — coming later. For now you play against Gyani Bot, a computer player.",
    record: (w: number, p: number) => `Your record: ${w} won of ${p}`,
    round: (i: number, n: number) => `Round ${i} of ${n}`,
    secondsLeft: (s: number) => `${s} seconds left`,
    thinking: "thinking…",
    answered: "answered!",
    timeUp: "Time's up!",
    youGot: (p: number) => `You +${p}`,
    botGot: (p: number) => `Gyani Bot +${p}`,
    right: "Right",
    wrong: "Wrong",
    noAnswer: "No answer",
    in: (s: string) => `in ${s}s`,
    answerWas: (a: string) => `Answer: ${a}`,
    next: "Next round",
    results: "See results",
    won: "You won the battle!",
    lost: "Gyani Bot wins this time",
    tie: "It's a tie!",
    wonSub: "Brilliant speed and accuracy. Try a harder level next!",
    lostSub: "Your wrong answers are in the Mistake notebook. Review them and ask for a rematch.",
    tieSub: "So close! One more round of revision and you'll take it.",
    rematch: "Rematch",
    change: "Change settings",
    correctOf: (c: number, n: number) => `${c}/${n} correct`,
    points: "points",
  },
  hi: {
    bot: "ज्ञानी बॉट",
    botTag: "बॉट",
    you: "आप",
    soonTitle: (n: number) => `कक्षा ${n} के लिए बैटल जल्द आ रहे हैं`,
    soonBody: "कक्षा 9 और 10 के प्रश्न तैयार हैं। अभी उनमें से किसी के साथ बैटल खेलें।",
    tryClass: (n: number) => `कक्षा ${n}`,
    subject: "विषय",
    chapter: "अध्याय (वैकल्पिक)",
    allChapters: "सभी अध्याय",
    level: "ज्ञानी बॉट का स्तर",
    levels: { easy: "आसान", medium: "मध्यम", hard: "कठिन" } as Record<Level, string>,
    levelHint: { easy: "लगभग 55% सही, धीरे जवाब देता है", medium: "लगभग 70% सही, सामान्य गति से जवाब देता है", hard: "लगभग 85% सही, तेज़ी से जवाब देता है" } as Record<Level, string>,
    rules: `${ROUNDS} राउंड · हर राउंड ${SECONDS} सेकंड · सही उत्तर पर ${BASE} अंक + तेज़ी के लिए ${BONUS} तक बोनस`,
    start: "बैटल शुरू करें",
    loading: "प्रश्न लोड हो रहे हैं…",
    failed: "प्रश्न लोड नहीं हो सके। इंटरनेट जाँचें और फिर कोशिश करें।",
    few: "यहाँ पर्याप्त प्रश्न नहीं हैं — सभी अध्याय या कोई और विषय चुनें।",
    friends: "दोस्तों के साथ लाइव बैटल के लिए खाते चाहिए — यह बाद में आएगा। अभी आप ज्ञानी बॉट (एक कंप्यूटर खिलाड़ी) से खेलते हैं।",
    record: (w: number, p: number) => `आपका रिकॉर्ड: ${p} में से ${w} जीते`,
    round: (i: number, n: number) => `राउंड ${i} / ${n}`,
    secondsLeft: (s: number) => `${s} सेकंड बचे`,
    thinking: "सोच रहा है…",
    answered: "जवाब दे दिया!",
    timeUp: "समय समाप्त!",
    youGot: (p: number) => `आप +${p}`,
    botGot: (p: number) => `ज्ञानी बॉट +${p}`,
    right: "सही",
    wrong: "गलत",
    noAnswer: "जवाब नहीं",
    in: (s: string) => `${s} सेकंड में`,
    answerWas: (a: string) => `उत्तर: ${a}`,
    next: "अगला राउंड",
    results: "परिणाम देखें",
    won: "आप बैटल जीत गए!",
    lost: "इस बार ज्ञानी बॉट जीता",
    tie: "मुकाबला बराबर!",
    wonSub: "शानदार गति और सटीकता। अगली बार कठिन स्तर आज़माएँ!",
    lostSub: "आपके गलत उत्तर गलतियों की कॉपी में हैं। उन्हें दोहराएँ और फिर से खेलें।",
    tieSub: "बहुत करीब! थोड़ा और दोहराएँ, अगली बार जीत आपकी।",
    rematch: "फिर से खेलें",
    change: "सेटिंग बदलें",
    correctOf: (c: number, n: number) => `${n} में से ${c} सही`,
    points: "अंक",
  },
});

type BQ = { key: string; q: string; options: string[]; answer: number; explanation: string };
type Turn = { pick: number | null; time: number; points: number };
type Round = { you: Turn; bot: Turn };

const pointsFor = (correct: boolean, time: number) => (correct ? BASE + Math.round((BONUS * Math.max(0, SECONDS - time)) / SECONDS) : 0);

function planBot(q: BQ, level: Level): Turn {
  const b = BOT[level];
  const time = Math.round((b.min + Math.random() * (b.max - b.min)) * 10) / 10;
  const right = Math.random() < b.acc;
  const wrongs = q.options.map((_, k) => k).filter((k) => k !== q.answer);
  const pick = right || !wrongs.length ? q.answer : wrongs[Math.floor(Math.random() * wrongs.length)];
  return { pick, time, points: pointsFor(pick === q.answer, time) };
}

/** Quiz battle against a clearly labelled computer player, Gyani Bot. */
function BattleBody({ classes }: { classes: BankedGrade[] }) {
  const t = useT(S);
  const lang = useLang();
  const hydrated = useHydrated();
  const mine = useStore((s) => s.profile.grade);
  const record = useStore((s) => s.battles);
  const [override, setOverride] = useState<number | null>(null);
  const grade = override ?? mine ?? 10;
  const cls = classes.find((c) => c.grade === grade);
  const [subject, setSubject] = useState("");
  const sub = cls?.subjects.find((s) => s.id === subject) ?? cls?.subjects[0];
  const [bank, setBank] = useState<Bank | null | "loading">("loading");
  const [chapter, setChapter] = useState("");
  const [level, setLevel] = useState<Level>("medium");

  const [phase, setPhase] = useState<"setup" | "round" | "reveal" | "result">("setup");
  const [qs, setQs] = useState<BQ[]>([]);
  const [r, setR] = useState(0);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [bot, setBot] = useState<Turn | null>(null);
  const [start, setStart] = useState(0);
  const [now, setNow] = useState(0);
  const saved = useRef(false);

  useEffect(() => {
    if (!hydrated || !sub) return;
    let live = true;
    setBank("loading");
    setChapter("");
    loadBank(grade, sub.id).then((b) => live && setBank(b));
    return () => {
      live = false;
    };
  }, [hydrated, grade, sub]);

  const pool: BQ[] =
    bank && bank !== "loading" && sub
      ? bank.chapters
          .filter((c) => !chapter || c.id === chapter)
          .flatMap((c) => c.mcq.filter((m) => m.answer >= 0).map((m) => ({ key: `${grade}/${sub.id}/${c.id}`, q: m.q, options: m.options, answer: m.answer, explanation: m.explanation })))
      : [];

  const beginRound = useCallback(
    (i: number, list: BQ[]) => {
      setR(i);
      setBot(planBot(list[i], level));
      const s = Date.now();
      setStart(s);
      setNow(s);
      setPhase("round");
    },
    [level],
  );

  const startBattle = () => {
    const list = shuffle(pool).slice(0, ROUNDS);
    if (list.length < 3) return;
    saved.current = false;
    setQs(list);
    setRounds([]);
    beginRound(0, list);
    window.scrollTo({ top: 0 });
  };

  const elapsed = Math.min(SECONDS, (now - start) / 1000);

  const answer = useCallback(
    (pick: number | null) => {
      if (phase !== "round" || !bot) return;
      const q = qs[r];
      const time = pick === null ? SECONDS : Math.round(((Date.now() - start) / 1000) * 10) / 10;
      const you: Turn = { pick, time, points: pointsFor(pick === q.answer, time) };
      if (pick !== q.answer) actions.addMistake({ key: q.key, prompt: q.q, options: q.options, answer: q.answer, explanation: q.explanation || undefined });
      setRounds((rs) => [...rs, { you, bot }]);
      setPhase("reveal");
    },
    [phase, bot, qs, r, start],
  );

  useEffect(() => {
    if (phase !== "round") return;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "round" && elapsed >= SECONDS) answer(null);
  }, [phase, elapsed, answer]);

  const you = rounds.reduce((n, x) => n + x.you.points, 0);
  const them = rounds.reduce((n, x) => n + x.bot.points, 0);

  useEffect(() => {
    if (phase !== "result" || saved.current) return;
    saved.current = true;
    actions.recordBattle(you > them);
    if (you > them) fireConfetti({ count: 180, power: 1.2 });
  }, [phase, you, them]);

  if (!hydrated) return <div className="h-96" />;

  const wrap = (children: React.ReactNode) => (
    <div className="space-y-6" lang={lang === "hi" ? "hi" : undefined}>
      {children}
    </div>
  );

  /* ───────── Setup ───────── */
  if (phase === "setup") {
    if (!cls?.subjects.length)
      return wrap(
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
        />,
      );
    const chapters = bank && bank !== "loading" ? bank.chapters.filter((c) => c.mcq.length) : [];
    return wrap(
      <>
        <div className="card relative overflow-hidden p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            <Fighter name={t.you} icon={<User className="size-8" aria-hidden />} tone="brand" />
            <span className="grid size-14 place-items-center rounded-full bg-coral-500 text-white shadow-float">
              <Swords aria-hidden className="size-7" />
            </span>
            <Fighter name={t.bot} tag={t.botTag} icon={<Bot className="size-8" aria-hidden />} tone="violet" />
          </div>
          <p className="mt-5 text-center text-sm font-semibold text-ink-2">{t.rules}</p>
          {record.played > 0 && <p className="mt-1 text-center text-sm font-bold text-ink-3">{t.record(record.won, record.played)}</p>}
        </div>

        <section className="card p-5" aria-labelledby="bt-sub">
          <h2 id="bt-sub" className="eyebrow mb-3">
            {t.subject}
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {cls.subjects.map((s) => (
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
          <label htmlFor="bt-ch" className="eyebrow mb-2 mt-5 block">
            {t.chapter}
          </label>
          {bank === "loading" ? (
            <p className="text-ink-3" role="status">
              {t.loading}
            </p>
          ) : !bank ? (
            <p className="text-coral-700" role="alert">
              {t.failed}
            </p>
          ) : (
            <select id="bt-ch" value={chapter} onChange={(e) => setChapter(e.target.value)} className="h-11 w-full max-w-full rounded-xl border-2 border-line bg-surface px-3 font-semibold outline-none focus:border-brand-400">
              <option value="">{t.allChapters}</option>
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.mcq.length})
                </option>
              ))}
            </select>
          )}
        </section>

        <section className="card p-5" aria-labelledby="bt-lv">
          <h2 id="bt-lv" className="eyebrow mb-3">
            {t.level}
          </h2>
          <div className="grid gap-2 sm:grid-cols-3">
            {(["easy", "medium", "hard"] as Level[]).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={level === l}
                onClick={() => setLevel(l)}
                className={cn("rounded-xl border-2 p-3 text-left", level === l ? "border-violet-500 bg-violet-50" : "border-line hover:bg-surface-2")}
              >
                <span className="block font-extrabold">{t.levels[l]}</span>
                <span className="text-xs font-semibold text-ink-3">{t.levelHint[l]}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="flex flex-col items-center gap-3">
          <Button size="lg" onClick={startBattle} disabled={pool.length < 3} icon={<Swords className="size-5" aria-hidden />}>
            {t.start}
          </Button>
          {bank && bank !== "loading" && pool.length < 3 && <p className="text-sm font-semibold text-coral-700">{t.few}</p>}
          <p className="flex max-w-xl items-start gap-2 rounded-xl bg-surface-2 p-3 text-sm text-ink-2">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-600" /> {t.friends}
          </p>
        </div>
      </>,
    );
  }

  const board = <Scoreboard you={you} them={them} total={qs.length} t={t} />;

  /* ───────── Result ───────── */
  if (phase === "result") {
    const outcome = you > them ? "won" : you < them ? "lost" : "tie";
    const yc = rounds.filter((x, k) => x.you.pick === qs[k].answer).length;
    const bc = rounds.filter((x, k) => x.bot.pick === qs[k].answer).length;
    return wrap(
      <>
        <div className="card flex flex-col items-center gap-4 p-6 text-center sm:p-8">
          {outcome === "won" ? <Trophy aria-hidden className="animate-pop size-16 text-amber-400" /> : <Mascot mood={outcome === "tie" ? "think" : "oops"} size={96} />}
          <p className="text-3xl font-extrabold">{outcome === "won" ? t.won : outcome === "lost" ? t.lost : t.tie}</p>
          <p className="max-w-md text-ink-2">{outcome === "won" ? t.wonSub : outcome === "lost" ? t.lostSub : t.tieSub}</p>
          <p className="text-sm font-bold text-ink-3">
            {t.you}: {t.correctOf(yc, qs.length)} · {t.bot}: {t.correctOf(bc, qs.length)}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={startBattle} icon={<RotateCcw className="size-4" aria-hidden />}>
              {t.rematch}
            </Button>
            <Button variant="secondary" onClick={() => setPhase("setup")}>
              {t.change}
            </Button>
          </div>
        </div>
        {board}
      </>,
    );
  }

  /* ───────── Round / reveal ───────── */
  const q = qs[r];
  const res = phase === "reveal" ? rounds[r] : null;
  const left = Math.max(0, Math.ceil(SECONDS - elapsed));
  const botDone = !!bot && (phase === "reveal" || elapsed >= bot.time);
  return wrap(
    <>
      {board}
      <div className="card p-5 sm:p-7">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-extrabold text-ink-3">{t.round(r + 1, qs.length)}</span>
          <span className={cn("ml-auto flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-extrabold tabular-nums", left <= 5 && phase === "round" ? "bg-coral-100 text-coral-700" : "bg-surface-2")} role="timer" aria-label={t.secondsLeft(left)}>
            <Timer aria-hidden className="size-4" /> {phase === "round" ? left : "–"}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden>
          <div className={cn("h-full rounded-full transition-[width] duration-100 ease-linear", left <= 5 ? "bg-coral-500" : "bg-brand-500")} style={{ width: `${phase === "round" ? 100 - (elapsed / SECONDS) * 100 : res ? 100 - (res.you.time / SECONDS) * 100 : 0}%` }} />
        </div>
        <p className="mt-3 flex items-center gap-2 text-sm font-bold text-violet-700" aria-live="polite">
          <Bot aria-hidden className="size-4" /> {t.bot}: {botDone ? t.answered : t.thinking}
        </p>
        <p id="bq" className="mt-3 whitespace-pre-line text-xl font-extrabold leading-snug">
          {q.q}
        </p>
        <div role="radiogroup" aria-labelledby="bq" className="mt-5 grid gap-3 sm:grid-cols-2">
          {q.options.map((o, k) => {
            const mineHere = res?.you.pick === k;
            const botHere = res?.bot.pick === k;
            const right = !!res && k === q.answer;
            const wrong = !!res && mineHere && k !== q.answer;
            return (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={mineHere}
                disabled={phase !== "round"}
                onClick={() => answer(k)}
                className={cn(
                  "relative flex min-h-14 items-center gap-3 rounded-xl border-2 border-b-4 px-4 py-3 text-left font-semibold transition-colors",
                  right ? "border-green-500 bg-green-50" : wrong ? "animate-[shake_300ms] border-coral-500 bg-coral-50" : "border-line hover:bg-surface-2",
                  res && !right && !wrong && "opacity-60",
                )}
              >
                <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg text-xs font-extrabold", right ? "bg-green-500 text-white" : wrong ? "bg-coral-500 text-white" : "bg-surface-2 text-ink-3")}>
                  {right ? <Check className="size-4" strokeWidth={3} /> : wrong ? <X className="size-4" strokeWidth={3} /> : "ABCDEF"[k]}
                </span>
                <span className="min-w-0 flex-1">{o}</span>
                {res && (mineHere || botHere) && (
                  <span className="flex shrink-0 gap-1">
                    {mineHere && (
                      <span className="grid size-6 place-items-center rounded-full bg-brand-500 text-white" title={t.you}>
                        <User aria-hidden className="size-3.5" />
                      </span>
                    )}
                    {botHere && (
                      <span className="grid size-6 place-items-center rounded-full bg-violet-500 text-white" title={t.bot}>
                        <Bot aria-hidden className="size-3.5" />
                      </span>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div aria-live="polite">
          {res && (
            <div className="animate-rise mt-5 space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <TurnResult name={t.you} turn={res.you} correct={res.you.pick === q.answer} tone="brand" t={t} />
                <TurnResult name={t.bot} turn={res.bot} correct={res.bot.pick === q.answer} tone="violet" t={t} />
              </div>
              <div className="rounded-xl bg-surface-2 p-4">
                <p className="font-extrabold text-green-700">{t.answerWas(q.options[q.answer])}</p>
                {q.explanation && <p className="mt-1 text-sm text-ink-2">{q.explanation}</p>}
              </div>
              <div className="flex justify-end">
                <Button size="lg" autoFocus onClick={() => (r + 1 >= qs.length ? setPhase("result") : beginRound(r + 1, qs))} iconRight={<ArrowRight className="size-5" aria-hidden />}>
                  {r + 1 >= qs.length ? t.results : t.next}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>,
  );
}

type T = (typeof S)["en"];

function Fighter({ name, tag, icon, tone }: { name: string; tag?: string; icon: React.ReactNode; tone: "brand" | "violet" }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className={cn("grid size-16 place-items-center rounded-2xl text-white shadow-float", tone === "brand" ? "bg-brand-500" : "bg-violet-500")}>{icon}</span>
      <span className="flex items-center gap-1.5 font-extrabold">
        {name}
        {tag && <span className="rounded-md bg-violet-100 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-violet-700">{tag}</span>}
      </span>
    </div>
  );
}

function TurnResult({ name, turn, correct, tone, t }: { name: string; turn: Turn; correct: boolean; tone: "brand" | "violet"; t: T }) {
  return (
    <div className={cn("flex items-center gap-3 rounded-xl border-2 p-3", correct ? "border-green-200 bg-green-50" : "border-line bg-surface")}>
      <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl text-white", tone === "brand" ? "bg-brand-500" : "bg-violet-500")}>{tone === "brand" ? <User aria-hidden className="size-5" /> : <Bot aria-hidden className="size-5" />}</span>
      <div className="min-w-0 flex-1">
        <p className="font-extrabold">{name}</p>
        <p className="text-xs font-semibold text-ink-3">
          {turn.pick === null ? t.noAnswer : `${correct ? t.right : t.wrong} · ${t.in(turn.time.toFixed(1))}`}
        </p>
      </div>
      <span className={cn("animate-pop flex items-center gap-1 text-lg font-extrabold tabular-nums", turn.points ? "text-green-700" : "text-ink-3")}>
        {turn.points > BASE && <Zap aria-hidden className="size-4 text-amber-500" />}+{turn.points}
      </span>
    </div>
  );
}

function Scoreboard({ you, them, total, t }: { you: number; them: number; total: number; t: T }) {
  const max = Math.max(1, total * (BASE + BONUS));
  return (
    <div className="card sticky top-16 z-10 space-y-2 p-4" aria-label={`${t.you} ${you}, ${t.bot} ${them} ${t.points}`}>
      {[
        { name: t.you, score: you, bar: "bg-brand-500", icon: <User aria-hidden className="size-4" />, lead: you > them },
        { name: t.bot, score: them, bar: "bg-violet-500", icon: <Bot aria-hidden className="size-4" />, lead: them > you },
      ].map((p) => (
        <div key={p.name} className="flex items-center gap-3">
          <span className="flex w-28 shrink-0 items-center gap-1.5 truncate text-sm font-extrabold sm:w-32">
            {p.icon} {p.name}
          </span>
          <div className="h-4 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div className={cn("h-full rounded-full transition-[width] duration-700 ease-out", p.bar)} style={{ width: `${(p.score / max) * 100}%` }} />
          </div>
          <span className={cn("w-14 shrink-0 text-right font-extrabold tabular-nums", p.lead && "text-green-700")}>
            <CountUp value={p.score} />
          </span>
        </div>
      ))}
    </div>
  );
}

/** Animates a number towards its new value (skipped when the user prefers reduced motion). */
function CountUp({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    if (start === value || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = value;
      setShown(value);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / 700);
      const v = Math.round(start + (value - start) * (1 - (1 - k) ** 3));
      setShown(v);
      from.current = v;
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{shown}</>;
}

const H = strings({
  en: { eyebrow: "Practice", title: "Quiz battle", sub: "Seven quick rounds against Gyani Bot, a computer player. Answer right and fast to win." },
  hi: { eyebrow: "अभ्यास", title: "क्विज़ बैटल", sub: "ज्ञानी बॉट (एक कंप्यूटर खिलाड़ी) से सात तेज़ राउंड। जीतने के लिए सही और जल्दी जवाब दें।" },
});

export function Battle({ classes }: { classes: BankedGrade[] }) {
  const h = useT(H);
  const lang = useLang();
  return (
    <div lang={lang === "hi" ? "hi" : undefined}>
      <PageTitle eyebrow={h.eyebrow} title={h.title} sub={h.sub} />
      <BattleBody classes={classes} />
    </div>
  );
}
