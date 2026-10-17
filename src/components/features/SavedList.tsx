"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "../ui/Button";
import { Tag } from "../ui/Tag";
import { useAppState } from "./AppState";
import { BookmarkButton } from "./BookmarkButton";

const labels = { chapter: "Chapter", lesson: "Lesson", resource: "Notes", paper: "Past paper" } as const;

export function SavedList() {
  const { bookmarks } = useAppState();
  if (!bookmarks.length)
    return (
      <div className="rounded-lg border border-dashed border-line-strong p-12 text-center">
        <Bookmark aria-hidden className="mx-auto size-10 text-ink-3" />
        <p className="mt-4 text-lg font-bold">Nothing saved yet</p>
        <p className="mx-auto mt-1 max-w-sm text-ink-2">Tap the bookmark on any chapter, note or paper to keep it here for quick revision.</p>
        <ButtonLink href="/library" variant="secondary" className="mt-6">
          Browse notes
        </ButtonLink>
      </div>
    );
  return (
    <ul className="sticker divide-y-2 divide-ink/10 overflow-hidden bg-surface">
      {bookmarks.map((b) => (
        <li key={b.id} className="flex items-center gap-4 px-4 py-3 sm:px-5">
          <Tag hue={b.kind === "chapter" ? "royal" : b.kind === "paper" ? "coral" : "lavender"} className="hidden w-20 justify-center sm:inline-flex">
            {labels[b.kind]}
          </Tag>
          <Link href={b.href} className="min-w-0 flex-1 py-1">
            <p className="truncate font-semibold hover:underline">{b.title}</p>
            <p className="truncate text-sm text-ink-3">{b.meta}</p>
          </Link>
          <BookmarkButton item={b} />
        </li>
      ))}
    </ul>
  );
}
