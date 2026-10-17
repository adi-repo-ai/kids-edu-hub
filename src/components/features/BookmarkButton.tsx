"use client";

import { Bookmark as BookmarkIcon, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Bookmark } from "@/lib/types";
import { useAppState } from "./AppState";

export function BookmarkButton({ item, className, withLabel }: { item: Bookmark; className?: string; withLabel?: boolean }) {
  const { isSaved, toggleBookmark } = useAppState();
  const saved = isSaved(item.id);
  const Icon = saved ? BookmarkCheck : BookmarkIcon;
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={withLabel ? undefined : saved ? `Remove ${item.title} from Saved` : `Save ${item.title}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(item);
      }}
      className={cn(
        "inline-flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-md text-sm font-semibold transition-colors",
        saved ? "text-coral-700 hover:bg-coral-50" : "text-ink-3 hover:bg-sunken hover:text-ink",
        withLabel && "px-3",
        className,
      )}
    >
      <Icon aria-hidden className={cn("size-5", saved && "animate-pop fill-coral-100")} />
      {withLabel && (saved ? "Saved" : "Save")}
    </button>
  );
}
