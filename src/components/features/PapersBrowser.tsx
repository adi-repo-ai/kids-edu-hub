"use client";

import { FileText, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { papers } from "@/data/library";
import { FilterChips } from "../ui/FilterChips";
import { Tag } from "../ui/Tag";
import { BookmarkButton } from "./BookmarkButton";
import { DownloadButton } from "./DownloadButton";

export function PapersBrowser() {
  const params = useSearchParams();
  const [grade, setGrade] = useState<10 | 12>(params.get("grade") === "12" ? 12 : 10);
  const [year, setYear] = useState<number | "all">("all");
  const [q, setQ] = useState(params.get("q") ?? "");

  const years = useMemo(() => [...new Set(papers.filter((p) => p.grade === grade).map((p) => p.year))].sort((a, b) => b - a), [grade]);
  const list = papers.filter(
    (p) => p.grade === grade && (year === "all" || p.year === year) && `${p.subject} ${p.code}`.toLowerCase().includes(q.toLowerCase().trim()),
  );

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-4 lg:flex-row lg:items-center">
        <FilterChips
          label="Class"
          value={grade}
          onChange={(g) => {
            setGrade(g);
            setYear("all");
          }}
          options={[
            { value: 10, label: "Class 10" },
            { value: 12, label: "Class 12" },
          ]}
        />
        <span aria-hidden className="hidden h-6 w-px bg-line lg:block" />
        <FilterChips label="Year" value={year} onChange={setYear} options={[{ value: "all", label: "All years" }, ...years.map((y) => ({ value: y, label: String(y) }))]} />
        <label className="flex h-10 items-center gap-2 rounded-md border border-line-strong px-3 focus-within:border-royal-500 lg:ml-auto lg:w-60">
          <Search aria-hidden className="size-4 text-ink-3" />
          <span className="sr-only">Filter by subject or code</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Subject or code" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
        </label>
      </div>

      <p className="mb-3 mt-6 text-sm text-ink-3" aria-live="polite">
        {list.length} paper{list.length === 1 ? "" : "s"}
      </p>

      {list.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line-strong p-10 text-center">
          <FileText aria-hidden className="mx-auto size-8 text-ink-3" />
          <p className="mt-3 font-semibold">No papers match “{q}”</p>
          <p className="text-sm text-ink-3">Try a subject name like “Science” or a code like “086”.</p>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {list.map((p) => (
            <li key={p.id} className="flex gap-4 rounded-lg border border-line bg-surface p-4 transition-shadow hover:shadow-lift">
              <div className="grid w-16 shrink-0 place-items-center rounded-md border border-line bg-paper py-2 text-center">
                <span className="font-display text-xl font-extrabold leading-none">{p.year}</span>
                <span className="mt-1 text-[11px] font-semibold text-ink-3">{p.code}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold leading-snug">{p.subject}</p>
                    <p className="text-sm text-ink-3">
                      {p.kind === "Sample paper" ? "Sample question paper" : `Set ${p.set}`} · {p.marks} marks
                    </p>
                  </div>
                  <BookmarkButton
                    className="-mr-2 -mt-2"
                    item={{ id: `paper:${p.id}`, kind: "paper", title: `${p.subject} ${p.year}`, meta: `Class ${p.grade} · ${p.kind} · ${p.code}`, href: "/papers" }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {p.kind === "Sample paper" && <Tag hue="lavender">SQP 2026–27</Tag>}
                  {p.hasMarkingScheme && <Tag hue="mint">Marking scheme</Tag>}
                  {p.hasSolutions ? <Tag hue="royal">Solutions</Tag> : <Tag>Solutions soon</Tag>}
                  <span className="ml-auto">
                    <DownloadButton label={`${p.subject} ${p.year}`} sizeKb={900 + p.marks * 9} />
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
