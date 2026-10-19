"use client";

import { ArrowRight, Check, History } from "lucide-react";
import Link from "next/link";
import { strings, useLang, useT } from "@/lib/i18n";
import { revisionItems, upcomingRevisions } from "@/lib/revision";
import { today as todayOf, useHydrated, useStore } from "@/lib/store";
import { ButtonLink } from "../ui/Button";
import { SubjectIcon } from "../ui/SubjectIcon";
import { useReasonText } from "./reasons";

const S = strings({
  en: {
    title: "Revise today",
    all: "See all",
    count: (n: number) => (n === 1 ? "1 chapter is due" : `${n} chapters are due`),
    start: "Start revising",
    caught: "All caught up — nothing to revise today.",
    next: (d: string) => `Next revision: ${d}`,
    empty: "Finish a chapter and it will come back here for a quick revision.",
  },
  hi: {
    title: "आज दोहराएँ",
    all: "सब देखें",
    count: (n: number) => `${n} अध्याय दोहराने हैं`,
    start: "दोहराना शुरू करें",
    caught: "सब पूरा — आज कुछ दोहराना नहीं।",
    next: (d: string) => `अगली दोहराई: ${d}`,
    empty: "कोई अध्याय पूरा करें, वह छोटी दोहराई के लिए यहाँ लौटेगा।",
  },
});

/** Compact "what to revise today" card for the dashboard. */
export function ReviseToday({ grade, className }: { grade?: number | null; className?: string }) {
  const t = useT(S);
  const lang = useLang();
  const reason = useReasonText();
  const hydrated = useHydrated();
  const s = useStore((x) => x);
  if (!hydrated) return null;
  const items = revisionItems(s, grade);
  const upcoming = upcomingRevisions(s, grade)[0];

  return (
    <section className={`card p-5 ${className ?? ""}`} aria-labelledby="rev-today">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="rev-today" className="flex items-center gap-2 font-extrabold">
          <History aria-hidden className="size-5 text-violet-600" /> {t.title}
        </h2>
        <Link href="/revise" className="text-sm font-bold text-brand-600 hover:underline">
          {t.all}
        </Link>
      </div>
      {items.length ? (
        <>
          <p className="mb-2 text-sm font-bold text-ink-2">{t.count(items.length)}</p>
          <ul className="space-y-1">
            {items.slice(0, 3).map((it) => (
              <li key={it.key}>
                <Link href={`/revise?chapter=${encodeURIComponent(it.key)}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-surface-2">
                  <SubjectIcon id={it.subject} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{it.title}</span>
                    <span className="block truncate text-xs font-semibold text-coral-700">{reason(it.reasons[0])}</span>
                  </span>
                  <ArrowRight aria-hidden className="size-4 shrink-0 text-ink-3" />
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink href={`/revise?chapter=${encodeURIComponent(items[0].key)}`} size="sm" className="mt-3 w-full">
            {t.start}
          </ButtonLink>
        </>
      ) : (
        <p className="flex items-start gap-2 text-sm text-ink-2">
          <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-green-600" />
          <span>
            {Object.keys(s.lessons).length ? t.caught : t.empty}
            {upcoming && (
              <span className="mt-1 block font-semibold text-ink-3">
                {t.next(new Date(`${upcoming.due}T12:00:00`).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "short" }))}
              </span>
            )}
          </span>
        </p>
      )}
    </section>
  );
}

const P = strings({
  en: {
    title: "Revision due",
    count: (n: number) => (n === 1 ? "chapter due for revision" : "chapters due for revision"),
    flash: (n: number) => `${n} flashcard${n === 1 ? "" : "s"} due today`,
    none: "Nothing is due for revision right now.",
  },
  hi: {
    title: "दोहराई बाकी",
    count: () => "अध्याय दोहराने हैं",
    flash: (n: number) => `आज ${n} फ़्लैशकार्ड दोहराने हैं`,
    none: "अभी कुछ भी दोहराना बाकी नहीं है।",
  },
});

/** Parent-facing summary of what's due for revision (no action buttons for the parent). */
export function RevisionDueSummary({ grade }: { grade?: number | null }) {
  const t = useT(P);
  const reason = useReasonText();
  const s = useStore((x) => x);
  const items = revisionItems(s, grade);
  const now = new Date();
  const cardsDue = Object.entries(s.cards).filter(([id, c]) => c.due <= todayOf(now) && (!grade || id.startsWith(`${grade}/`))).length;
  return (
    <section className="card p-5 sm:p-6" aria-labelledby="rev-due">
      <h2 id="rev-due" className="flex items-center gap-2 text-lg font-extrabold">
        <History aria-hidden className="size-5 text-violet-600" /> {t.title}
      </h2>
      <p className="mt-3">
        <span className="text-3xl font-extrabold tabular-nums">{items.length}</span> <span className="font-bold text-ink-3">{t.count(items.length)}</span>
      </p>
      <p className="text-sm font-semibold text-ink-3">{t.flash(cardsDue)}</p>
      {items.length ? (
        <ul className="mt-3 divide-y divide-line">
          {items.slice(0, 4).map((it) => (
            <li key={it.key} className="flex items-center gap-3 py-2 text-sm">
              <SubjectIcon id={it.subject} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold">{it.title}</span>
                <span className="block truncate text-xs text-ink-3">{it.reasons.map(reason).join(" · ")}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-ink-2">{t.none}</p>
      )}
    </section>
  );
}
