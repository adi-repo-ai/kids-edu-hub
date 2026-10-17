"use client";

import { CornerDownLeft, Search, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useNavigate } from "@/lib/navigate";
import { search, suggestedQueries, type SearchEntry } from "@/lib/search";

function Mark({ text, query }: { text: string; query: string }) {
  const word = query.trim().split(/\s+/)[0]?.toLowerCase();
  const i = word ? text.toLowerCase().indexOf(word) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-[3px] bg-sun-200 px-0.5 text-ink">{text.slice(i, i + word.length)}</mark>
      {text.slice(i + word.length)}
    </>
  );
}

/**
 * Accessible combobox search (WAI-ARIA 1.2 pattern).
 * ↑/↓ moves through results, Enter opens, Esc closes, "/" focuses the header instance.
 */
export function SearchBox({
  size = "md",
  shortcut,
  autoFocus,
  onNavigate,
  className,
}: {
  size?: "md" | "lg";
  shortcut?: boolean;
  autoFocus?: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  const navigate = useNavigate();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const results = useMemo(() => search(query), [query]);

  useEffect(() => {
    if (!shortcut) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(t.tagName) && !t.isContentEditable) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcut]);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  const go = (entry: SearchEntry) => {
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
    onNavigate?.();
    navigate(entry.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showPanel = open;
  const lg = size === "lg";

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border bg-surface transition-[border-color,box-shadow]",
          "border-line-strong focus-within:border-royal-500 focus-within:shadow-[0_0_0_3px_var(--color-royal-100)]",
          lg ? "h-14 px-4" : "h-10 px-3",
        )}
      >
        <Search aria-hidden className={cn("shrink-0 text-ink-3", lg ? "size-5" : "size-4")} />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showPanel && results[active] ? `${listId}-${active}` : undefined}
          aria-label="Search chapters, lessons, papers and notes"
          placeholder={lg ? "Search a chapter, topic or past paper…" : "Search"}
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={cn("min-w-0 flex-1 bg-transparent outline-none placeholder:text-ink-3 [&::-webkit-search-cancel-button]:hidden", lg ? "text-base" : "text-sm")}
        />
        {query ? (
          <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="grid size-7 place-items-center rounded-sm text-ink-3 hover:bg-sunken">
            <X className="size-4" aria-hidden />
          </button>
        ) : (
          shortcut && (
            <kbd className="hidden rounded-sm border border-line bg-sunken px-1.5 font-sans text-xs text-ink-3 sm:inline-block" aria-hidden>
              /
            </kbd>
          )
        )}
      </div>

      {showPanel && (
        <div className="animate-rise absolute inset-x-0 top-[calc(100%+6px)] z-40 overflow-hidden rounded-xl border-[2.5px] border-ink bg-surface shadow-[5px_5px_0_0_var(--color-ink)]">
          {query.trim() === "" ? (
            <div className="p-4">
              <p className="eyebrow mb-2">Try searching for</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setQuery(q);
                      inputRef.current?.focus();
                    }}
                    className="rounded-full border border-line bg-paper px-3 py-1.5 text-sm text-ink-2 hover:border-royal-500 hover:text-royal-700"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="p-4 text-sm text-ink-2">
              No matches for <strong>“{query}”</strong>. Try a chapter name, a subject, or a year like “2024”.
            </p>
          ) : (
            <ul id={listId} role="listbox" aria-label="Search results" className="max-h-[60vh] overflow-y-auto py-1">
              {results.map((r, i) => {
                const newGroup = i === 0 || results[i - 1].group !== r.group;
                return (
                  <li key={r.id} role="presentation">
                    {newGroup && <p className="eyebrow px-4 pb-1 pt-3">{r.group}</p>}
                    <div
                      id={`${listId}-${i}`}
                      role="option"
                      aria-selected={i === active}
                      onPointerMove={() => setActive(i)}
                      onClick={() => go(r)}
                      className={cn("mx-1 flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5", i === active && "bg-royal-50")}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold">
                          <Mark text={r.title} query={query} />
                        </p>
                        <p className="truncate text-xs text-ink-3">{r.meta}</p>
                      </div>
                      {i === active && <CornerDownLeft aria-hidden className="size-4 shrink-0 text-royal-700" />}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
