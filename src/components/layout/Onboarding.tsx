"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { grades } from "@/lib/curriculum";
import { cn } from "@/lib/cn";
import { strings, useLang, useT } from "@/lib/i18n";
import { actions, useHydrated, useStore } from "@/lib/store";
import { Button } from "../ui/Button";
import { Mascot } from "../ui/Mascot";

const S = strings({
  en: {
    welcome: "Welcome to Kaksha!",
    intro: "Two quick questions and you're in.",
    nameQ: "What should we call you?",
    namePh: "Your first name",
    classQ: "Which class are you in?",
    classN: (g: number) => `Class ${g}`,
    skip: "Skip for now",
    start: "Start learning",
    language: "Language",
  },
  hi: {
    welcome: "कक्षा में आपका स्वागत है!",
    intro: "बस दो छोटे सवाल, फिर शुरू करते हैं।",
    nameQ: "हम आपको किस नाम से बुलाएँ?",
    namePh: "आपका पहला नाम",
    classQ: "आप किस कक्षा में हैं?",
    classN: (g: number) => `कक्षा ${g}`,
    skip: "अभी छोड़ें",
    start: "पढ़ाई शुरू करें",
    language: "भाषा",
  },
});

/** First-visit setup: name and class. Everything else adapts to the class chosen here. */
export function Onboarding() {
  const t = useT(S);
  const lang = useLang();
  const hydrated = useHydrated();
  const onboarded = useStore((s) => s.profile.onboarded);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<number | null>(null);
  if (!hydrated || onboarded) return null;

  const finish = (skip?: boolean) =>
    actions.setProfile({ onboarded: true, name: skip ? "" : name.trim(), grade: skip ? null : grade });

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="ob-title" className="fixed inset-0 z-[65] grid place-items-center bg-ink/50 p-4">
      <div className="animate-rise w-full max-w-lg rounded-3xl bg-surface p-6 shadow-float sm:p-8">
        <div className="flex items-center gap-4">
          <Mascot mood="wave" size={72} />
          <div className="min-w-0 flex-1">
            <h2 id="ob-title" className="text-2xl font-extrabold">
              {t.welcome}
            </h2>
            <p className="text-ink-2">{t.intro}</p>
          </div>
        </div>
        <div role="group" aria-label={t.language} className="mt-4 flex gap-1.5">
          {(
            [
              ["en", "English"],
              ["hi", "हिंदी"],
            ] as const
          ).map(([id, name]) => (
            <button
              key={id}
              type="button"
              lang={id === "hi" ? "hi" : "en"}
              aria-pressed={lang === id}
              onClick={() => actions.setSettings({ lang: id })}
              className={cn("h-9 rounded-full px-4 text-sm font-bold", lang === id ? "bg-brand-500 text-white" : "bg-surface-2 text-ink-2 hover:bg-brand-50 hover:text-brand-700")}
            >
              {name}
            </button>
          ))}
        </div>
        <form
          className="mt-6 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            finish();
          }}
        >
          <div>
            <label htmlFor="ob-name" className="text-sm font-bold">
              {t.nameQ}
            </label>
            <input
              id="ob-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePh}
              autoComplete="given-name"
              className="mt-1.5 h-12 w-full rounded-xl border-2 border-line bg-surface-2 px-4 text-base font-semibold outline-none focus:border-brand-400 focus:bg-surface"
            />
          </div>
          <fieldset>
            <legend className="text-sm font-bold">{t.classQ}</legend>
            <div className="mt-2 grid grid-cols-6 gap-2">
              {grades.map((g) => (
                <button
                  key={g.grade}
                  type="button"
                  aria-pressed={grade === g.grade}
                  aria-label={t.classN(g.grade)}
                  onClick={() => setGrade(g.grade)}
                  className={cn(
                    "h-12 rounded-xl border-2 border-b-4 text-lg font-extrabold transition-colors",
                    grade === g.grade ? "border-brand-700 bg-brand-500 text-white" : "border-line-strong bg-surface hover:bg-brand-50",
                  )}
                >
                  {g.grade}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={() => finish(true)} className="h-11 rounded-xl px-3 text-sm font-bold text-ink-3 hover:bg-surface-2">
              {t.skip}
            </button>
            <Button type="submit" size="lg" disabled={!grade} iconRight={<ArrowRight className="size-5" aria-hidden />}>
              {t.start}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
