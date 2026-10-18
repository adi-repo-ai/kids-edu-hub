"use client";

import { CornerDownLeft, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { search } from "@/lib/search";
import { useStore } from "@/lib/store";

const suggestions = ["Quadratic equations", "Photosynthesis", "Nationalism in India", "Electricity", "Trigonometry"];

export function SearchBox({ autoFocus, onDone, large, className }: { autoFocus?: boolean; onDone?: () => void; large?: boolean; className?: string }) {
  const router = useRouter();
  const grade = useStore((s) => s.profile.grade);
  const listId = useId();
  const input = useRef<HTMLInputElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const results = useMemo(() => search(q, grade), [q, grade]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, []);

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    input.current?.blur();
    onDone?.();
    router.push(href);
  };

  return (
    <div ref={wrap} className={cn("relative", className)}>
      <div className={cn("flex items-center gap-2 rounded-xl border-2 border-line bg-surface-2 px-3 transition-colors focus-within:border-brand-400 focus-within:bg-surface", large ? "h-14" : "h-11")}>
        <Search aria-hidden className="size-4 shrink-0 text-ink-3" />
        <input
          ref={input}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && results[active] ? `${listId}-${active}` : undefined}
          aria-label="Search any chapter or topic, Class 1 to 12"
          placeholder="Search any chapter or topic…"
          autoFocus={autoFocus}
          value={q}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter" && results[active]) {
              e.preventDefault();
              go(results[active].href);
            } else if (e.key === "Escape") setOpen(false);
          }}
          className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-ink-3 [&::-webkit-search-cancel-button]:hidden"
        />
        {q ? (
          <button type="button" aria-label="Clear search" onClick={() => setQ("")} className="grid size-7 place-items-center rounded-md text-ink-3 hover:bg-line">
            <X className="size-4" aria-hidden />
          </button>
        ) : (
          <kbd className="hidden rounded-md border border-line bg-surface px-1.5 text-xs font-semibold text-ink-3 sm:block" aria-hidden>
            /
          </kbd>
        )}
      </div>
      {open && (
        <div className="animate-rise absolute inset-x-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-2xl border border-line bg-surface shadow-float">
          {!q.trim() ? (
            <div className="p-4">
              <p className="eyebrow mb-2">Popular topics</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button key={s} type="button" onClick={() => setQ(s)} className="rounded-full bg-surface-2 px-3 py-1.5 text-sm font-semibold text-ink-2 hover:bg-brand-50 hover:text-brand-700">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="p-4 text-sm text-ink-2">
              No match for <strong>“{q}”</strong>. Try a chapter name like “Motion” or a subject like “Physics”.
            </p>
          ) : (
            <ul id={listId} role="listbox" aria-label="Search results" className="max-h-[60vh] overflow-y-auto p-1.5">
              {results.map((r, i) => (
                <li
                  key={r.id}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onPointerMove={() => setActive(i)}
                  onClick={() => go(r.href)}
                  className={cn("flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5", i === active && "bg-brand-50")}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{r.title}</span>
                    <span className="block truncate text-xs text-ink-3">{r.meta}</span>
                  </span>
                  {i === active && <CornerDownLeft aria-hidden className="size-4 text-brand-600" />}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
