"use client";

import { ArrowLeft, Award, Printer } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { strings, useLang, useT } from "@/lib/i18n";
import { findQuest } from "@/lib/quests";
import { actions, useHydrated, useStore } from "@/lib/store";
import { buttonClass } from "../ui/Button";
import { Mascot } from "../ui/Mascot";
import { MyMascot } from "../ui/MyMascot";

const S = strings({
  en: {
    back: "Back to quests",
    print: "Print / Save as PDF",
    tip: "Tip: choose “Save as PDF” as the printer to keep a copy.",
    heading: "Certificate of Achievement",
    presented: "This certificate is proudly presented to",
    forQuest: "for completing the Kaksha quest",
    date: "Date",
    signed: "Gyani, Kaksha's study owl",
    signedRole: "Signed",
    fallbackName: "A Kaksha learner",
    note: "Awarded for progress recorded in the Kaksha app.",
    addName: "Add your name to the certificate",
    namePlaceholder: "Your name",
    save: "Save",
    notTitle: "This certificate isn't unlocked yet",
    notBody: "Finish the quest and claim its reward first. Then you can print your certificate.",
    unknownTitle: "We couldn't find that quest",
    unknownBody: "Open a claimed quest from the Quests page and choose “Get certificate”.",
    seal: "Quest complete",
  },
  hi: {
    back: "क्वेस्ट पर लौटो",
    print: "प्रिंट करो / PDF सेव करो",
    tip: "सुझाव: कॉपी रखने के लिए प्रिंटर में “Save as PDF” चुनो।",
    heading: "उपलब्धि प्रमाणपत्र",
    presented: "यह प्रमाणपत्र गर्व से दिया जाता है",
    forQuest: "को, Kaksha का यह क्वेस्ट पूरा करने के लिए",
    date: "तारीख़",
    signed: "ज्ञानी, Kaksha का पढ़ाकू उल्लू",
    signedRole: "हस्ताक्षर",
    fallbackName: "एक Kaksha विद्यार्थी",
    note: "Kaksha ऐप में दर्ज प्रगति के लिए दिया गया।",
    addName: "प्रमाणपत्र पर अपना नाम जोड़ो",
    namePlaceholder: "तुम्हारा नाम",
    save: "सेव करो",
    notTitle: "यह प्रमाणपत्र अभी खुला नहीं है",
    notBody: "पहले क्वेस्ट पूरा करो और उसका इनाम लो। फिर प्रमाणपत्र प्रिंट कर सकोगे।",
    unknownTitle: "यह क्वेस्ट नहीं मिला",
    unknownBody: "क्वेस्ट पेज से कोई लिया हुआ क्वेस्ट खोलो और “प्रमाणपत्र लो” चुनो।",
    seal: "क्वेस्ट पूरा",
  },
});

/** Page size and print-only rules. Tokens are reset to light values so the sheet prints on white paper. */
const PRINT_CSS = `
@page { size: A4 landscape; margin: 0; }
.cert-sheet { container-type: inline-size; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
@media print {
  html, body { background: #fff !important; height: auto !important; }
  .cert-wrap { padding: 0 !important; max-width: none !important; }
  .cert-sheet {
    width: 297mm !important; height: 209mm !important; aspect-ratio: auto !important;
    border-radius: 0 !important; box-shadow: none !important; break-inside: avoid;
    --color-surface: #ffffff; --color-surface-2: #f0f3f9; --color-ink: #0f172a; --color-ink-2: #3f4a5e; --color-ink-3: #64748b; --color-line: #e3e7ef;
  }
}`;

export function Certificate() {
  const hydrated = useHydrated();
  const params = useSearchParams();
  const t = useT(S);
  const lang = useLang();
  const state = useStore((s) => s);
  const [name, setName] = useState("");
  if (!hydrated) return <div className="h-dvh" />;

  const id = params.get("quest") ?? "";
  const quest = id ? findQuest(state, id) : undefined;
  const claimedAt = id ? state.quests[id] : undefined;

  const bar = (
    <div className="no-print sticky top-0 z-10 border-b border-line bg-surface/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
        <Link href="/quests" className={buttonClass("ghost", "sm")}>
          <ArrowLeft aria-hidden className="size-4" />
          {t.back}
        </Link>
        {quest && claimedAt && (
          <button type="button" onClick={() => window.print()} className={buttonClass("primary", "sm")}>
            <Printer aria-hidden className="size-4" />
            {t.print}
          </button>
        )}
      </div>
    </div>
  );

  if (!quest || !claimedAt) {
    return (
      <div lang={lang} className="min-h-dvh bg-canvas text-ink">
        {bar}
        <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
          <Mascot mood="think" size={110} />
          <h1 className="mt-5 text-2xl font-extrabold">{quest ? t.notTitle : t.unknownTitle}</h1>
          <p className="mt-2 text-ink-2">{quest ? t.notBody : t.unknownBody}</p>
          <Link href="/quests" className={buttonClass("primary", "md", "mt-6")}>
            <ArrowLeft aria-hidden className="size-4" />
            {t.back}
          </Link>
        </div>
      </div>
    );
  }

  const learner = state.profile.name.trim() || t.fallbackName;
  const date = new Date(claimedAt).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div lang={lang} className="min-h-dvh bg-canvas text-ink print:min-h-0 print:bg-transparent">
      <style>{PRINT_CSS}</style>
      {bar}
      <div className="cert-wrap mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        {!state.profile.name.trim() && (
          <form
            className="no-print card mb-5 flex flex-wrap items-end gap-2 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) actions.setProfile({ name: name.trim() });
            }}
          >
            <label className="min-w-0 flex-1 text-sm font-bold">
              {t.addName}
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                placeholder={t.namePlaceholder}
                className="mt-1 block h-10 w-full rounded-xl border-2 border-line bg-surface px-3 font-semibold focus:border-brand-500 focus:outline-none"
              />
            </label>
            <button type="submit" className={buttonClass("secondary", "sm", "h-10")} disabled={!name.trim()}>
              {t.save}
            </button>
          </form>
        )}

        <article className="cert-sheet relative mx-auto aspect-[297/210] w-full overflow-hidden rounded-xl bg-surface text-ink shadow-[var(--shadow-float)]" aria-label={t.heading}>
          {/* frame: outer brand band, inner hairline in gold */}
          <div aria-hidden className="absolute inset-[2.2cqw] rounded-[1cqw] border-[0.7cqw] border-brand-600" />
          <div aria-hidden className="absolute inset-[3.6cqw] rounded-[0.6cqw] border-[0.18cqw] border-amber-400" />
          <Corner className="left-[2.9cqw] top-[2.9cqw]" />
          <Corner className="right-[2.9cqw] top-[2.9cqw] rotate-90" />
          <Corner className="bottom-[2.9cqw] right-[2.9cqw] rotate-180" />
          <Corner className="bottom-[2.9cqw] left-[2.9cqw] -rotate-90" />

          <div className="absolute inset-[5.5cqw] flex flex-col items-center text-center">
            <div className="flex items-center gap-[1cqw]">
              <svg viewBox="0 0 36 36" className="size-[3.6cqw]" aria-hidden>
                <rect width="36" height="36" rx="10" fill="var(--color-brand-500)" />
                <path d="M11.5 9v18M24 9.5 13.2 19.3M17 16.6 25 27" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" fill="none" />
                <circle cx="27" cy="9" r="3" fill="#fbbf24" />
              </svg>
              <span className="text-[2.4cqw] font-extrabold tracking-tight">Kaksha</span>
            </div>

            <h1 className="mt-[2.2cqw] font-serif text-[4.4cqw] font-bold leading-none tracking-wide text-brand-800">{t.heading}</h1>
            <div aria-hidden className="mt-[1.2cqw] h-[0.25cqw] w-[14cqw] rounded-full bg-amber-400" />

            <p className="mt-[2.4cqw] text-[1.6cqw] text-ink-2">{t.presented}</p>
            <p className="mt-[0.8cqw] max-w-full truncate border-b-[0.15cqw] border-line px-[3cqw] pb-[0.6cqw] font-serif text-[4.6cqw] font-bold italic leading-tight text-ink">{learner}</p>
            <p className="mt-[1.6cqw] text-[1.6cqw] text-ink-2">{t.forQuest}</p>
            <p className="mt-[0.6cqw] text-[3cqw] font-extrabold leading-tight text-brand-700">“{quest.title[lang]}”</p>
            <p className="mt-[0.4cqw] text-[1.5cqw] text-ink-3">{quest.desc[lang]}</p>

            <div className="mt-auto grid w-full grid-cols-3 items-end gap-[2cqw]">
              <div className="text-left">
                <p className="text-[1.8cqw] font-bold">{date}</p>
                <div className="mt-[0.4cqw] h-[0.12cqw] w-[18cqw] bg-ink-3" />
                <p className="mt-[0.4cqw] text-[1.2cqw] font-semibold uppercase tracking-widest text-ink-3">{t.date}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="grid size-[11cqw] place-items-center rounded-full border-[0.35cqw] border-dashed border-amber-500 bg-amber-50 text-amber-700">
                  <div className="flex flex-col items-center">
                    <Award aria-hidden className="size-[4cqw]" strokeWidth={1.8} />
                    <span className="text-[1.05cqw] font-extrabold uppercase tracking-wide">{t.seal}</span>
                    <span className="text-[1.3cqw] font-extrabold">+{quest.xp} XP</span>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-end gap-[1cqw] text-right">
                <div>
                  <p className="font-serif text-[2.2cqw] italic text-brand-700">Gyani</p>
                  <div className="mt-[0.4cqw] ml-auto h-[0.12cqw] w-[18cqw] bg-ink-3" />
                  <p className="mt-[0.4cqw] text-[1.2cqw] font-semibold text-ink-3">
                    {t.signedRole} · {t.signed}
                  </p>
                </div>
                <MyMascot still mood="cheer" size={80} className="h-auto w-[8cqw]" />
              </div>
            </div>
            <p className="mt-[1.2cqw] text-[1cqw] text-ink-3">{t.note}</p>
          </div>
        </article>
        <p className="no-print mt-4 text-center text-sm text-ink-3">{t.tip}</p>
      </div>
    </div>
  );
}

/** A small rangoli-style corner ornament. */
function Corner({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 40 40" className={`absolute size-[5.5cqw] ${className}`}>
      <path d="M2 2 H24 M2 2 V24" stroke="var(--color-brand-600)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M8 8 C20 8 22 14 22 22 C14 22 8 20 8 8 Z" fill="#fbbf24" opacity="0.9" />
      <circle cx="8" cy="8" r="3" fill="var(--color-brand-600)" />
      <circle cx="28" cy="4" r="1.6" fill="#fbbf24" />
      <circle cx="4" cy="28" r="1.6" fill="#fbbf24" />
    </svg>
  );
}
