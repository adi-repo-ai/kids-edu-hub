"use client";

import { BookmarkX } from "lucide-react";
import Link from "next/link";
import { strings, useT } from "@/lib/i18n";
import { actions, useHydrated, useStore } from "@/lib/store";
import { EmptyState } from "../ui/EmptyState";

const S = strings({
  en: {
    emptyTitle: "Nothing saved yet",
    emptyBody: "Press Save on any chapter to keep it here for quick revision.",
    browse: "Browse chapters →",
    remove: (t: string) => `Remove ${t}`,
  },
  hi: {
    emptyTitle: "अभी कुछ सहेजा नहीं गया",
    emptyBody: "किसी भी अध्याय पर “सहेजें” दबाएँ, वह जल्दी दोहराने के लिए यहाँ आ जाएगा।",
    browse: "अध्याय देखें →",
    remove: (t: string) => `${t} हटाएँ`,
  },
});

export function SavedList() {
  const t = useT(S);
  const hydrated = useHydrated();
  const list = useStore((s) => s.bookmarks);
  if (!hydrated) return null;
  if (!list.length)
    return <EmptyState mood="happy" title={t.emptyTitle} body={t.emptyBody} action={<Link href="/learn" className="font-bold text-brand-600 hover:underline">{t.browse}</Link>} />;
  return (
    <ul className="card divide-y divide-line">
      {list.map((b) => (
        <li key={b.key} className="flex items-center gap-3 px-5 py-3">
          <Link href={b.href} className="min-w-0 flex-1">
            <span className="block truncate font-bold hover:underline">{b.title}</span>
            <span className="text-sm text-ink-3">{b.meta}</span>
          </Link>
          <button type="button" aria-label={t.remove(b.title)} onClick={() => actions.toggleBookmark(b)} className="grid size-10 place-items-center rounded-xl text-ink-3 hover:bg-coral-50 hover:text-coral-700">
            <BookmarkX className="size-5" aria-hidden />
          </button>
        </li>
      ))}
    </ul>
  );
}
