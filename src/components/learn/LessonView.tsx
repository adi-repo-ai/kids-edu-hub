"use client";

import { BookOpen, Calculator, ExternalLink, Network, Sparkles, Youtube } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { strings, useT } from "@/lib/i18n";
import { Simulation } from "../sims/Simulation";
import { buttonClass } from "../ui/Button";
import { MindMap, type MindMapSection } from "./MindMap";
import { ReadAloud } from "./ReadAloud";

const S = strings({
  en: {
    view: "Lesson view",
    lesson: "Lesson",
    map: "Mind map",
    formula: "Formula sheet",
    facts: "Key facts",
    videos: "Watch videos",
    videosNote: "YouTube search, opens in a new tab",
  },
  hi: {
    view: "पाठ का दृश्य",
    lesson: "पाठ",
    map: "माइंड मैप",
    formula: "सूत्र पत्रक",
    facts: "मुख्य तथ्य",
    videos: "वीडियो देखें",
    videosNote: "YouTube पर खोज, नए टैब में खुलेगा",
  },
});

export type LessonPart = { kind: "html"; html: string } | { kind: "sim"; id: string };

/**
 * The lesson body with its tools: a Lesson | Mind map toggle, read-aloud, and interactive
 * simulations rendered between the HTML parts wherever the lesson has a `::sim[id]` line.
 */
export function LessonView({ title, parts, outline, hindi }: { title: string; parts: LessonPart[]; outline: MindMapSection[]; hindi: boolean }) {
  const t = useT(S);
  const [tab, setTab] = useState<"lesson" | "map">("lesson");
  const article = useRef<HTMLElement>(null);

  // Table-of-contents links (outside this component) should bring the lesson back if the map is open.
  useEffect(() => {
    const on = () => setTab("lesson");
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  const jump = (sectionId: string, callout?: string) => {
    setTab("lesson");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const root = article.current;
        if (!root) return;
        let el: HTMLElement | null = sectionId ? document.getElementById(sectionId) : root;
        if (callout) {
          const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
          const hit = [...root.querySelectorAll<HTMLElement>(".callout-title")].find((n) => norm(n.textContent ?? "") === norm(callout));
          el = hit?.closest<HTMLElement>(".callout") ?? el;
        }
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: callout ? "center" : "start" });
        if (sectionId && !callout) history.replaceState(null, "", `#${sectionId}`);
        if (callout && el !== root) {
          el.classList.add("ring-4", "ring-brand-200");
          window.setTimeout(() => el?.classList.remove("ring-4", "ring-brand-200"), 1800);
        }
      }),
    );
  };

  const tabs = [
    { id: "lesson" as const, label: t.lesson, Icon: BookOpen },
    { id: "map" as const, label: t.map, Icon: Network },
  ];

  return (
    <>
      <div className="no-print mb-4 flex flex-wrap items-start justify-between gap-3">
        <div role="group" aria-label={t.view} className="inline-flex gap-1 rounded-2xl bg-surface-2 p-1">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={tab === id}
              onClick={() => setTab(id)}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-xl px-4 text-[15px] font-bold transition-colors",
                tab === id ? "bg-surface text-brand-700 shadow-sm" : "text-ink-2 hover:text-ink",
              )}
            >
              <Icon aria-hidden className="size-4" />
              {label}
            </button>
          ))}
        </div>
        {tab === "lesson" && <ReadAloud target={article} hindi={hindi} />}
      </div>

      <article ref={article} hidden={tab !== "lesson"} lang={hindi ? "hi" : undefined} className="card p-6 sm:p-9">
        {parts.map((p, i) =>
          p.kind === "html" ? (
            <div key={i} className="lesson" dangerouslySetInnerHTML={{ __html: p.html }} />
          ) : (
            <div key={i} data-sim-root lang="en" className="contents">
              <SimLang hindi={hindi}>
                <Simulation id={p.id} />
              </SimLang>
            </div>
          ),
        )}
      </article>

      {tab === "map" && <MindMap title={title} sections={outline} hindi={hindi} onJump={jump} />}
    </>
  );
}

/** Simulations follow the interface language, not the lesson's language. */
function SimLang({ children }: { hindi: boolean; children: React.ReactNode }) {
  return <>{children}</>;
}

/** Header links: the subject's formula / key-facts sheet and a YouTube search for the chapter. */
export function ChapterLinks({ sheetHref, sheetKind, videoQuery }: { sheetHref?: string; sheetKind: "formula" | "facts"; videoQuery: string }) {
  const t = useT(S);
  const SheetIcon = sheetKind === "formula" ? Calculator : Sparkles;
  return (
    <>
      {sheetHref && (
        <Link href={sheetHref} className={buttonClass("ghost", "md")}>
          <SheetIcon aria-hidden className="size-5" />
          {sheetKind === "formula" ? t.formula : t.facts}
        </Link>
      )}
      <a
        href={`https://www.youtube.com/results?${new URLSearchParams({ search_query: videoQuery })}`}
        target="_blank"
        rel="noopener noreferrer"
        title={t.videosNote}
        className={buttonClass("ghost", "md")}
      >
        <Youtube aria-hidden className="size-5" />
        {t.videos}
        <ExternalLink aria-hidden className="size-4 text-ink-3" />
        <span className="sr-only">({t.videosNote})</span>
      </a>
    </>
  );
}
