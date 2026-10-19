"use client";

import { Bookmark, BookmarkCheck, CheckCircle2, Circle, Download, FileText } from "lucide-react";
import Link from "next/link";
import { confettiFrom } from "@/lib/confetti";
import { cn } from "@/lib/cn";
import { strings, useT } from "@/lib/i18n";
import { actions, useHydrated, useStore } from "@/lib/store";
import { asset } from "@/lib/asset";
import { toast } from "@/lib/toast";
import { buttonClass } from "../ui/Button";

const S = strings({
  en: {
    removed: "Removed from Saved",
    savedToast: "Saved for revision",
    saved: "Saved",
    save: "Save",
    notesPdf: "Notes PDF",
    printable: "Printable notes",
    markComplete: "Mark lesson complete",
    markStudied: "Mark as studied",
    completedUndo: "Completed · undo",
    completeToast: "Lesson complete · +20 XP",
  },
  hi: {
    removed: "सहेजे गए से हटा दिया",
    savedToast: "दोहराने के लिए सहेज लिया",
    saved: "सहेजा गया",
    save: "सहेजें",
    notesPdf: "नोट्स PDF",
    printable: "प्रिंट करने लायक नोट्स",
    markComplete: "पाठ पूरा हुआ",
    markStudied: "पढ़ लिया",
    completedUndo: "पूरा हुआ · वापस लें",
    completeToast: "पाठ पूरा · +20 XP",
  },
});

export function BookmarkToggle({ k, title, meta, href }: { k: string; title: string; meta: string; href: string }) {
  const t = useT(S);
  const saved = useStore((s) => s.bookmarks.some((b) => b.key === k));
  const Icon = saved ? BookmarkCheck : Bookmark;
  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={() => {
        actions.toggleBookmark({ key: k, title, meta, href });
        toast(saved ? t.removed : t.savedToast);
      }}
      className={buttonClass("secondary", "md", saved ? "text-brand-700" : "")}
    >
      <Icon aria-hidden className={cn("size-5", saved && "fill-brand-100")} />
      {saved ? t.saved : t.save}
    </button>
  );
}

export function NotesButtons({ pdf, view }: { pdf: string; view: string }) {
  const t = useT(S);
  return (
    <>
      <a href={asset(pdf)} download className={buttonClass("secondary", "md")}>
        <Download aria-hidden className="size-5" />
        {t.notesPdf}
      </a>
      <Link href={view} className={buttonClass("ghost", "md")} target="_blank">
        <FileText aria-hidden className="size-5" />
        {t.printable}
      </Link>
    </>
  );
}

export function CompleteToggle({ k, label }: { k: string; label?: string }) {
  const t = useT(S);
  // Pages pass English labels; the known ones are translated, anything else is shown as given.
  const text = !label || label === S.en.markComplete ? t.markComplete : label === S.en.markStudied ? t.markStudied : label;
  const hydrated = useHydrated();
  const done = useStore((s) => !!s.lessons[k]);
  if (!hydrated) return <span className="h-13" />;
  return done ? (
    <button type="button" onClick={() => actions.uncompleteLesson(k)} className={buttonClass("secondary", "lg", "text-green-700")}>
      <CheckCircle2 aria-hidden className="size-5" />
      {t.completedUndo}
    </button>
  ) : (
    <button
      type="button"
      onClick={(e) => {
        actions.completeLesson(k);
        confettiFrom(e.currentTarget, { count: 70 });
        toast(t.completeToast);
      }}
      className={buttonClass("success", "lg")}
    >
      <Circle aria-hidden className="size-5" />
      {text}
    </button>
  );
}
