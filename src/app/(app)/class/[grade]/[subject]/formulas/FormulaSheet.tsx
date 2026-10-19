"use client";

import { ArrowRight, Printer } from "lucide-react";
import Link from "next/link";
import { SubjectIcon } from "@/components/ui/SubjectIcon";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { strings, useT } from "@/lib/i18n";

const S = strings({
  en: {
    formula: "Formula sheet",
    facts: "Key facts",
    subFormula: (subject: string, grade: number) => `Every formula from the Class ${grade} ${subject} lessons, chapter by chapter. Print it or keep it open while you practise.`,
    subFacts: (subject: string, grade: number) => `The key ideas and "remember" points from every Class ${grade} ${subject} lesson, chapter by chapter.`,
    print: "Print",
    chapter: (n: number) => `Chapter ${n}`,
    open: "Open chapter",
    count: (n: number) => `${n} ${n === 1 ? "item" : "items"}`,
    emptyTitle: "Nothing here yet",
    emptyBody: "None of the lessons in this subject have formula or key-fact boxes yet.",
    back: "Back to the subject",
    types: { KEY: "Key idea", REMEMBER: "Remember", FORMULA: "Formula" } as Record<string, string>,
    footer: (subject: string, grade: number) => `Kaksha · Class ${grade} ${subject}`,
  },
  hi: {
    formula: "सूत्र पत्रक",
    facts: "मुख्य तथ्य",
    subFormula: (subject: string, grade: number) => `कक्षा ${grade} ${subject} के सभी पाठों के सूत्र, अध्याय के अनुसार। इसे प्रिंट करें या अभ्यास करते समय खुला रखें।`,
    subFacts: (subject: string, grade: number) => `कक्षा ${grade} ${subject} के हर पाठ की मुख्य बातें और "याद रखें" बिंदु, अध्याय के अनुसार।`,
    print: "प्रिंट करें",
    chapter: (n: number) => `अध्याय ${n}`,
    open: "अध्याय खोलें",
    count: (n: number) => `${n} बिंदु`,
    emptyTitle: "अभी यहाँ कुछ नहीं है",
    emptyBody: "इस विषय के पाठों में अभी सूत्र या मुख्य तथ्य के बॉक्स नहीं हैं।",
    back: "विषय पर वापस जाएँ",
    types: { KEY: "मुख्य बात", REMEMBER: "याद रखें", FORMULA: "सूत्र" } as Record<string, string>,
    footer: (subject: string, grade: number) => `Kaksha · कक्षा ${grade} ${subject}`,
  },
});

export interface SheetChapter {
  id: string;
  title: string;
  href: string;
  items: { type: string; title: string; body: string }[];
}

// While printing, show only the sheet: the app shell (sidebar, top bar, bottom nav) is hidden.
const PRINT_CSS = `@media print {
  body * { visibility: hidden !important; }
  #revision-sheet, #revision-sheet * { visibility: visible !important; }
  #revision-sheet { position: absolute; inset: 0 auto auto 0; width: 100%; padding: 0 12mm; }
  #revision-sheet .sheet-chapter { break-inside: avoid-page; }
  #revision-sheet .sheet-item { break-inside: avoid; }
}`;

export function FormulaSheet({
  grade,
  subjectId,
  subjectName,
  kind,
  chapters,
  subjectHref,
  hindi,
}: {
  grade: number;
  subjectId: string;
  subjectName: string;
  kind: "formula" | "facts";
  chapters: SheetChapter[];
  subjectHref: string;
  hindi: boolean;
}) {
  const t = useT(S);
  const title = kind === "formula" ? t.formula : t.facts;
  const lang = hindi ? "hi" : undefined;

  return (
    <>
      <style>{PRINT_CSS}</style>
      <div id="revision-sheet">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="no-print">
              <SubjectIcon id={subjectId} size="lg" solid />
            </span>
            <div>
              <p className="eyebrow">{t.footer(subjectName, grade)}</p>
              <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">{title}</h1>
              <p className="mt-2 max-w-2xl text-ink-2">{kind === "formula" ? t.subFormula(subjectName, grade) : t.subFacts(subjectName, grade)}</p>
            </div>
          </div>
          {chapters.length > 0 && (
            <button type="button" onClick={() => window.print()} className={buttonClass("primary", "md", "no-print shrink-0")}>
              <Printer aria-hidden className="size-5" />
              {t.print}
            </button>
          )}
        </header>

        {chapters.length === 0 ? (
          <EmptyState
            title={t.emptyTitle}
            body={t.emptyBody}
            action={
              <Link href={subjectHref} className={buttonClass("primary", "md")}>
                {t.back}
              </Link>
            }
          />
        ) : (
          <div className="space-y-6">
            {chapters.map((ch, n) => (
              <section key={ch.id} aria-labelledby={`sheet-${ch.id}`} className="sheet-chapter card p-5 sm:p-6">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="eyebrow">
                      {t.chapter(n + 1)} · {t.count(ch.items.length)}
                    </p>
                    <h2 id={`sheet-${ch.id}`} lang={lang} className="mt-0.5 text-xl font-extrabold">
                      {ch.title}
                    </h2>
                  </div>
                  <Link href={ch.href} className="no-print inline-flex h-9 items-center gap-1 rounded-lg px-2 text-sm font-bold text-brand-700 hover:bg-brand-50">
                    {t.open} <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </div>
                <ul className={cn("grid gap-3", kind === "formula" ? "sm:grid-cols-2" : "")}>
                  {ch.items.map((it, k) => (
                    <li
                      key={k}
                      className={cn(
                        "sheet-item min-w-0 rounded-xl border p-4",
                        it.type === "FORMULA" ? "border-violet-200 bg-violet-50" : it.type === "REMEMBER" ? "border-cyan-200 bg-cyan-50" : "border-brand-100 bg-brand-50",
                      )}
                    >
                      {kind === "facts" && (
                        <p className={cn("text-[11px] font-extrabold uppercase tracking-wider", it.type === "REMEMBER" ? "text-cyan-700" : "text-brand-700")}>{t.types[it.type] ?? it.type}</p>
                      )}
                      <p lang={lang} className="font-extrabold text-ink">
                        {it.title}
                      </p>
                      {it.body && (
                        <p lang={lang} className={cn("mt-1 whitespace-pre-line break-words text-ink-2", kind === "formula" && "font-semibold text-ink")}>
                          {it.body}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
