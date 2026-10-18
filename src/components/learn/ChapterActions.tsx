"use client";

import { Bookmark, BookmarkCheck, CheckCircle2, Circle, Download, FileText } from "lucide-react";
import Link from "next/link";
import { confettiFrom } from "@/lib/confetti";
import { cn } from "@/lib/cn";
import { actions, useHydrated, useStore } from "@/lib/store";
import { asset } from "@/lib/asset";
import { toast } from "@/lib/toast";
import { buttonClass } from "../ui/Button";

export function BookmarkToggle({ k, title, meta, href }: { k: string; title: string; meta: string; href: string }) {
  const saved = useStore((s) => s.bookmarks.some((b) => b.key === k));
  const Icon = saved ? BookmarkCheck : Bookmark;
  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={() => {
        actions.toggleBookmark({ key: k, title, meta, href });
        toast(saved ? "Removed from Saved" : "Saved for revision");
      }}
      className={buttonClass("secondary", "md", saved ? "text-brand-700" : "")}
    >
      <Icon aria-hidden className={cn("size-5", saved && "fill-brand-100")} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}

export function NotesButtons({ pdf, view }: { pdf: string; view: string }) {
  return (
    <>
      <a href={asset(pdf)} download className={buttonClass("secondary", "md")}>
        <Download aria-hidden className="size-5" />
        Notes PDF
      </a>
      <Link href={view} className={buttonClass("ghost", "md")} target="_blank">
        <FileText aria-hidden className="size-5" />
        Printable notes
      </Link>
    </>
  );
}

export function CompleteToggle({ k, label = "Mark lesson complete" }: { k: string; label?: string }) {
  const hydrated = useHydrated();
  const done = useStore((s) => !!s.lessons[k]);
  if (!hydrated) return <span className="h-13" />;
  return done ? (
    <button type="button" onClick={() => actions.uncompleteLesson(k)} className={buttonClass("secondary", "lg", "text-green-700")}>
      <CheckCircle2 aria-hidden className="size-5" />
      Completed · undo
    </button>
  ) : (
    <button
      type="button"
      onClick={(e) => {
        actions.completeLesson(k);
        confettiFrom(e.currentTarget, { count: 70 });
        toast("Lesson complete · +20 XP");
      }}
      className={buttonClass("success", "lg")}
    >
      <Circle aria-hidden className="size-5" />
      {label}
    </button>
  );
}
