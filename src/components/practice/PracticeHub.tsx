"use client";

import { ArrowRight, CalendarCheck, NotebookPen, Star, Swords, Target, Wand2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { strings, useLang, useT } from "@/lib/i18n";
import { today, useHydrated, useStore } from "@/lib/store";
import { SubjectIcon } from "../ui/SubjectIcon";

export interface PracticeGrade {
  grade: number;
  subjects: { id: string; name: string; chapters: { id: string; title: string; questions: number }[] }[];
}

const S = strings({
  en: {
    tools: "Practice tools",
    daily: "Daily challenge",
    dailyBody: "5 questions, same for your whole class today.",
    dailyDone: (s: number, n: number) => `Done today · ${s}/${n}`,
    dailyNew: "New set ready",
    builder: "Test builder",
    builderBody: "Pick chapters, length and timer. Get a fresh paper.",
    builderMeta: (n: number) => (n ? `${n} test${n === 1 ? "" : "s"} taken` : "Make your first test"),
    mistakes: "Mistake notebook",
    mistakesBody: "Fix every question you got wrong.",
    mistakesMeta: (n: number) => (n ? `${n} to fix` : "All clear"),
    battle: "Quiz battle",
    battleBody: "7 fast rounds against Gyani Bot.",
    battleMeta: (w: number, p: number) => (p ? `${w} won of ${p}` : "Play your first battle"),
  },
  hi: {
    tools: "अभ्यास के साधन",
    daily: "दैनिक चुनौती",
    dailyBody: "5 प्रश्न, आज पूरी कक्षा के लिए एक जैसे।",
    dailyDone: (s: number, n: number) => `आज पूरा · ${s}/${n}`,
    dailyNew: "नया सेट तैयार",
    builder: "टेस्ट बिल्डर",
    builderBody: "अध्याय, लंबाई और टाइमर चुनें। नया पेपर पाएँ।",
    builderMeta: (n: number) => (n ? `${n} टेस्ट दिए` : "अपना पहला टेस्ट बनाएँ"),
    mistakes: "गलतियों की कॉपी",
    mistakesBody: "हर गलत प्रश्न को सुधारें।",
    mistakesMeta: (n: number) => (n ? `${n} सुधारने हैं` : "सब ठीक है"),
    battle: "क्विज़ बैटल",
    battleBody: "ज्ञानी बॉट से 7 तेज़ राउंड।",
    battleMeta: (w: number, p: number) => (p ? `${p} में से ${w} जीते` : "पहला बैटल खेलें"),
  },
});

const stars = (r: number) => (r >= 1 ? 3 : r >= 0.8 ? 2 : r >= 0.5 ? 1 : 0);

export function PracticeHub({ data }: { data: PracticeGrade[] }) {
  const hydrated = useHydrated();
  const mine = useStore((s) => s.profile.grade);
  const quizzes = useStore((s) => s.quizzes);
  const dailyToday = useStore((s) => s.daily[today()]);
  const testsTaken = useStore((s) => s.tests.length);
  const mistakeCount = useStore((s) => s.mistakes.length);
  const battles = useStore((s) => s.battles);
  const t = useT(S);
  const lang = useLang();
  const [grade, setGrade] = useState<number>(data[0]?.grade ?? 10);
  useEffect(() => {
    if (mine && data.some((d) => d.grade === mine)) setGrade(mine);
  }, [mine, data]);
  const g = data.find((d) => d.grade === grade);
  const weak = hydrated
    ? Object.entries(quizzes)
        .filter(([, q]) => q.best / q.total < 0.6)
        .map(([k, q]) => {
          const [gr, sub, ch] = k.split("/");
          const title = data.find((d) => d.grade === Number(gr))?.subjects.find((s) => s.id === sub)?.chapters.find((c) => c.id === ch)?.title;
          return title ? { k, gr, sub, ch, title, q } : null;
        })
        .filter((x): x is NonNullable<typeof x> => !!x)
    : [];

  return (
    <div className="space-y-8">
      <section aria-labelledby="tools" lang={lang === "hi" ? "hi" : undefined}>
        <h2 id="tools" className="sr-only">
          {t.tools}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/daily", title: t.daily, body: t.dailyBody, meta: !hydrated ? "" : dailyToday ? t.dailyDone(dailyToday.score, dailyToday.total) : t.dailyNew, icon: CalendarCheck, tile: "bg-coral-500", glow: "from-coral-50", hot: hydrated && !dailyToday },
            { href: "/practice/builder", title: t.builder, body: t.builderBody, meta: hydrated ? t.builderMeta(testsTaken) : "", icon: Wand2, tile: "bg-brand-500", glow: "from-brand-50", hot: false },
            { href: "/mistakes", title: t.mistakes, body: t.mistakesBody, meta: hydrated ? t.mistakesMeta(mistakeCount) : "", icon: NotebookPen, tile: "bg-amber-500", glow: "from-amber-50", hot: false },
            { href: "/battle", title: t.battle, body: t.battleBody, meta: hydrated ? t.battleMeta(battles.won, battles.played) : "", icon: Swords, tile: "bg-violet-500", glow: "from-violet-50", hot: false },
          ].map((c) => (
            <li key={c.href}>
              <Link href={c.href} className={cn("card card-hover group relative flex h-full flex-col overflow-hidden bg-gradient-to-br to-surface p-5", c.glow)}>
                <span className="flex items-center gap-3">
                  <span className={cn("relative grid size-12 shrink-0 place-items-center rounded-2xl text-white shadow-float transition-transform group-hover:-rotate-6 group-hover:scale-105", c.tile)}>
                    <c.icon aria-hidden className="size-6" />
                    {c.hot && <span aria-hidden className="absolute -right-1 -top-1 size-3.5 animate-pulse-ring rounded-full bg-coral-500 ring-2 ring-surface" />}
                  </span>
                  <span className="min-w-0 flex-1 font-extrabold leading-tight">{c.title}</span>
                  <ArrowRight aria-hidden className="size-5 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="mt-3 text-sm text-ink-2">{c.body}</span>
                <span className="mt-auto pt-3 text-xs font-bold text-ink-3">{c.meta}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {weak.length > 0 && (
        <section className="card p-5" aria-labelledby="weak">
          <h2 id="weak" className="flex items-center gap-2 text-lg font-extrabold">
            <Target aria-hidden className="size-5 text-coral-600" /> Topics to strengthen
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {weak.map((w) => (
              <li key={w.k}>
                <Link href={`/class/${w.gr}/${w.sub}/${w.ch}#quiz`} className="flex items-center gap-3 rounded-xl bg-coral-50 p-3 hover:bg-coral-100">
                  <SubjectIcon id={w.sub} size="sm" />
                  <span className="flex-1 truncate font-bold">{w.title}</span>
                  <span className="text-sm font-extrabold text-coral-700">
                    {w.q.best}/{w.q.total}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div role="tablist" aria-label="Class" className="flex flex-wrap gap-2">
        {data.map((d) => (
          <button
            key={d.grade}
            role="tab"
            aria-selected={grade === d.grade}
            onClick={() => setGrade(d.grade)}
            className={cn("h-10 rounded-full px-4 text-sm font-extrabold", grade === d.grade ? "bg-ink text-white" : "bg-surface text-ink-2 ring-1 ring-line hover:bg-surface-2")}
          >
            Class {d.grade}
          </button>
        ))}
      </div>

      {g?.subjects.map((s) => (
        <section key={s.id} aria-labelledby={`ps-${s.id}`}>
          <h2 id={`ps-${s.id}`} className="mb-3 flex items-center gap-3 text-xl font-extrabold">
            <SubjectIcon id={s.id} size="sm" solid /> {s.name}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {s.chapters.map((c) => {
              const q = hydrated ? quizzes[`${grade}/${s.id}/${c.id}`] : undefined;
              const st = q ? stars(q.best / q.total) : 0;
              return (
                <li key={c.id}>
                  <Link href={`/class/${grade}/${s.id}/${c.id}#quiz`} className="card card-hover flex h-full items-center gap-3 p-4">
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold leading-snug">{c.title}</span>
                      <span className="mt-1 flex items-center gap-2 text-xs font-semibold text-ink-3">
                        {c.questions} questions
                        {q && (
                          <span className="text-green-700">
                            · best {q.best}/{q.total}
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="flex shrink-0 gap-0.5" aria-label={`${st} of 3 stars`}>
                      {[0, 1, 2].map((i) => (
                        <Star key={i} aria-hidden className={cn("size-4", i < st ? "fill-amber-400 text-amber-400" : "text-line-strong")} />
                      ))}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <Link href="/mock" className="card card-hover flex items-center gap-4 p-5">
        <span className="grid size-12 place-items-center rounded-2xl bg-violet-500 font-extrabold text-white">80</span>
        <span className="flex-1">
          <span className="block font-extrabold">Ready for a full paper?</span>
          <span className="text-sm text-ink-3">Timed mock tests in the CBSE board pattern.</span>
        </span>
        <ArrowRight aria-hidden className="size-5 text-ink-3" />
      </Link>
    </div>
  );
}
