"use client";

import { CircleCheck } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Bookmark } from "@/lib/types";

const STORAGE_KEY = "kaksha:bookmarks";

const seed: Bookmark[] = [
  { id: "chapter:square-and-cube", kind: "chapter", title: "A Square and A Cube", meta: "Mathematics · Ch 1", href: "/learn/maths/square-and-cube" },
  { id: "resource:r-matter-notes", kind: "resource", title: "States of matter: notes with diagrams", meta: "Science · Notes · 6 pages", href: "/library" },
  { id: "paper:p10-2025-041", kind: "paper", title: "Mathematics (Standard) 2025", meta: "Class 10 · Board · 041", href: "/papers" },
];

interface AppState {
  bookmarks: Bookmark[];
  isSaved: (id: string) => boolean;
  toggleBookmark: (b: Bookmark) => void;
  toast: (message: string) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(seed);
  const [toastMsg, setToastMsg] = useState<{ id: number; text: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setBookmarks(JSON.parse(raw));
    } catch {
      /* storage unavailable: keep the seed list */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch {
      /* ignore */
    }
  }, [bookmarks]);

  const toast = useCallback((text: string) => {
    clearTimeout(timer.current);
    setToastMsg({ id: Date.now(), text });
    timer.current = setTimeout(() => setToastMsg(null), 2600);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      bookmarks,
      isSaved: (id) => bookmarks.some((b) => b.id === id),
      toggleBookmark: (b) => {
        const exists = bookmarks.some((x) => x.id === b.id);
        setBookmarks(exists ? bookmarks.filter((x) => x.id !== b.id) : [b, ...bookmarks]);
        toast(exists ? "Removed from Saved" : "Saved for later");
      },
      toast,
    }),
    [bookmarks, toast],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 lg:bottom-8">
        {toastMsg && (
          <div key={toastMsg.id} className="animate-rise flex items-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-medium text-white shadow-lift">
            <CircleCheck aria-hidden className="size-4 text-mint-200" />
            {toastMsg.text}
          </div>
        )}
      </div>
    </Ctx.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
