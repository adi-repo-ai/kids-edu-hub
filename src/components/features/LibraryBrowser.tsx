"use client";

import { FileText, Map, NotebookPen, Sigma } from "lucide-react";
import { useState } from "react";
import { subjectById, subjects } from "@/data/curriculum";
import { resources } from "@/data/library";
import { cn } from "@/lib/cn";
import { hue } from "@/lib/hue";
import type { ResourceKind, SubjectId } from "@/lib/types";
import { FilterChips } from "../ui/FilterChips";
import { BookmarkButton } from "./BookmarkButton";
import { DownloadButton } from "./DownloadButton";

const kindIcon: Record<ResourceKind, typeof FileText> = { Notes: NotebookPen, Worksheet: FileText, "Mind map": Map, "Formula sheet": Sigma };

export function LibraryBrowser() {
  const [subject, setSubject] = useState<SubjectId | "all">("all");
  const [kind, setKind] = useState<ResourceKind | "all">("all");
  const list = resources.filter((r) => (subject === "all" || r.subject === subject) && (kind === "all" || r.kind === kind));

  return (
    <div>
      <div className="space-y-3">
        <FilterChips label="Subject" value={subject} onChange={setSubject} options={[{ value: "all", label: "All subjects" }, ...subjects.map((s) => ({ value: s.id, label: s.name }))]} />
        <FilterChips
          label="Type"
          value={kind}
          onChange={setKind}
          options={[{ value: "all", label: "All types" }, ...(["Notes", "Worksheet", "Mind map", "Formula sheet"] as const).map((k) => ({ value: k, label: k }))]}
        />
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {list.map((r) => {
          const s = subjectById(r.subject)!;
          const Icon = kindIcon[r.kind];
          return (
            <li key={r.id} className="flex flex-col rounded-lg border border-line bg-surface">
              {/* Paper-like preview strip */}
              <div className={cn("relative h-28 overflow-hidden rounded-t-lg border-b border-line", r.kind === "Worksheet" ? "ruled" : r.kind === "Formula sheet" ? "graph-paper" : hue[s.hue].soft)}>
                <span className={cn("absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-bold", hue[s.hue].chip)}>
                  <Icon aria-hidden className="size-3.5" />
                  {r.kind}
                </span>
                <span aria-hidden className="absolute -bottom-3 right-4 font-display text-6xl font-extrabold text-ink/5">
                  {r.pages}p
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-sm text-ink-3">{s.name}</p>
                <p className="mt-0.5 flex-1 font-bold leading-snug">{r.title}</p>
                <p className="mt-2 text-xs text-ink-3">
                  {r.pages} page{r.pages > 1 ? "s" : ""} · Updated {r.updated}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <DownloadButton label={r.title} sizeKb={r.sizeKb} />
                  <BookmarkButton item={{ id: `resource:${r.id}`, kind: "resource", title: r.title, meta: `${s.name} · ${r.kind} · ${r.pages} pages`, href: "/library" }} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {list.length === 0 && <p className="mt-8 rounded-lg border border-dashed border-line-strong p-10 text-center text-ink-2">Nothing here yet for this combination. Try “All types”.</p>}
    </div>
  );
}
