"use client";

import { ExternalLink, Pin } from "lucide-react";
import { useState } from "react";
import { news } from "@/data/library";
import type { Hue, NewsItem } from "@/lib/types";
import { FilterChips } from "../ui/FilterChips";
import { Tag } from "../ui/Tag";

const catHue: Record<NewsItem["category"], Hue | undefined> = { Exams: "coral", Curriculum: "royal", Results: "mint", Circular: "lavender", School: "sun" };
const fmt = (d: string, opts: Intl.DateTimeFormatOptions) => new Date(d).toLocaleDateString("en-IN", opts);

export function NewsList() {
  const [cat, setCat] = useState<NewsItem["category"] | "all">("all");
  const pinned = news.find((n) => n.pinned)!;
  const list = news.filter((n) => !n.pinned && (cat === "all" || n.category === cat));

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
      <div>
        <article className="relative rounded-lg border-2 border-coral-500 bg-surface p-6">
          <p className="flex items-center gap-2 text-sm font-bold text-coral-700">
            <Pin aria-hidden className="size-4" /> Pinned by your school
          </p>
          <h2 className="mt-2 text-2xl font-extrabold">{pinned.title}</h2>
          <p className="mt-2 text-ink-2">{pinned.summary}</p>
          <p className="mt-4 text-sm text-ink-3">
            <time dateTime={pinned.date}>{fmt(pinned.date, { day: "numeric", month: "long", year: "numeric" })}</time>
          </p>
        </article>

        <div className="mb-4 mt-10">
          <FilterChips
            label="Category"
            value={cat}
            onChange={setCat}
            options={[{ value: "all", label: "Everything" }, ...(["Exams", "Curriculum", "Circular", "Results", "School"] as const).map((c) => ({ value: c, label: c }))]}
          />
        </div>

        <ol className="relative border-l-2 border-line pl-6" aria-live="polite">
          {list.map((n) => (
            <li key={n.id} className="relative pb-8 last:pb-0">
              <span aria-hidden className="absolute -left-[33px] top-1.5 size-4 rounded-full border-[3px] border-paper bg-line-strong" />
              <div className="flex flex-wrap items-center gap-2 text-sm text-ink-3">
                <time dateTime={n.date} className="font-semibold text-ink-2">
                  {fmt(n.date, { day: "numeric", month: "short", year: "numeric" })}
                </time>
                <Tag hue={catHue[n.category]}>{n.category}</Tag>
              </div>
              <h3 className="mt-1.5 text-lg font-bold">{n.title}</h3>
              <p className="mt-1 max-w-2xl text-ink-2">{n.summary}</p>
            </li>
          ))}
          {list.length === 0 && <li className="text-ink-2">No announcements in this category yet.</li>}
        </ol>
      </div>

      <aside className="space-y-4">
        <div className="sticker tape bg-surface p-5">
          <h2 className="font-bold">Important links</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ["CBSE official website", "https://www.cbse.gov.in"],
              ["CBSE Academic (syllabus & SQPs)", "https://cbseacademic.nic.in"],
              ["NCERT textbooks", "https://ncert.nic.in/textbook.php"],
            ].map(([label, href]) => (
              <li key={href}>
                <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-royal-700 hover:underline">
                  {label}
                  <ExternalLink aria-hidden className="size-3.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="rounded-lg bg-sunken p-4 text-sm text-ink-2">
          We summarise circulars in plain language. Announcements shown here are illustrative; always confirm dates on the official CBSE website.
        </p>
      </aside>
    </div>
  );
}
