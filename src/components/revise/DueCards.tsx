"use client";

import { ArrowRight, Check, Layers, Swords } from "lucide-react";
import Link from "next/link";
import { strings, useT } from "@/lib/i18n";
import { today, useStore } from "@/lib/store";

const S = strings({
  en: {
    cards: "Flashcards",
    due: (n: number) => (n === 1 ? "1 card due today" : `${n} cards due today`),
    none: "No cards due — learn a few new ones",
    daily: "Daily challenge",
    dailyTodo: "A fresh set of questions every day",
    dailyDone: (s: number, n: number) => `Done today: ${s}/${n}`,
  },
  hi: {
    cards: "फ़्लैशकार्ड",
    due: (n: number) => `आज ${n} कार्ड दोहराने हैं`,
    none: "आज कोई कार्ड बाकी नहीं — कुछ नए सीखें",
    daily: "रोज़ की चुनौती",
    dailyTodo: "हर दिन सवालों का नया सेट",
    dailyDone: (s: number, n: number) => `आज पूरा: ${s}/${n}`,
  },
});

/** Count of flashcards due today for the learner's class. */
export function useCardsDue(grade?: number | null) {
  return useStore((s) => {
    const now = today();
    return Object.entries(s.cards).filter(([id, c]) => c.due <= now && (!grade || id.startsWith(`${grade}/`))).length;
  });
}

export function FlashcardsDueCard({ grade }: { grade?: number | null }) {
  const t = useT(S);
  const n = useCardsDue(grade);
  return (
    <Link href="/flashcards" className="card card-hover flex items-center gap-3 p-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-violet-500 text-white">
        <Layers aria-hidden className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-extrabold">{t.cards}</span>
        <span className={n ? "block text-sm font-bold text-amber-700" : "block text-sm text-ink-3"}>{n ? t.due(n) : t.none}</span>
      </span>
      <ArrowRight aria-hidden className="size-5 shrink-0 text-ink-3" />
    </Link>
  );
}

export function DailyChallengeCard() {
  const t = useT(S);
  const res = useStore((s) => s.daily[today()]);
  return (
    <Link href="/daily" className="card card-hover flex items-center gap-3 p-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-coral-500 text-white">
        {res ? <Check aria-hidden className="size-5" strokeWidth={3} /> : <Swords aria-hidden className="size-5" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-extrabold">{t.daily}</span>
        <span className={res ? "block text-sm font-bold text-green-700" : "block text-sm text-ink-3"}>{res ? t.dailyDone(res.score, res.total) : t.dailyTodo}</span>
      </span>
      <ArrowRight aria-hidden className="size-5 shrink-0 text-ink-3" />
    </Link>
  );
}

const L = strings({
  en: { link: "Flashcards for this subject", sub: (n: number) => (n ? `${n} due today` : "Key ideas and formulas to remember") },
  hi: { link: "इस विषय के फ़्लैशकार्ड", sub: (n: number) => (n ? `आज ${n} बाकी` : "याद रखने वाले मुख्य विचार और सूत्र") },
});

/** Sidebar link on a subject page, opening that subject's flashcard decks. */
export function SubjectFlashcardsLink({ grade, subject }: { grade: number; subject: string }) {
  const t = useT(L);
  const n = useStore((s) => {
    const now = today();
    return Object.entries(s.cards).filter(([id, c]) => c.due <= now && id.startsWith(`${grade}/${subject}/`)).length;
  });
  return (
    <Link href={`/flashcards?subject=${subject}`} className="flex items-center gap-3 p-4 hover:bg-surface-2">
      <Layers aria-hidden className="size-5 text-violet-600" />
      <span className="flex-1">
        <span className="block font-bold">{t.link}</span>
        <span className="text-xs text-ink-3">{t.sub(n)}</span>
      </span>
    </Link>
  );
}
