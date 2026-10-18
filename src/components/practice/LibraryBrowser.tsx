"use client";

import { Download, FileText, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { toast } from "@/lib/toast";
import { SubjectIcon } from "../ui/SubjectIcon";

export interface LibItem {
  kind: "notes" | "paper";
  grade: number;
  subject: string;
  subjectName: string;
  title: string;
  pdf: string;
  view: string;
}

export function LibraryBrowser({ items }: { items: LibItem[] }) {
  const params = useSearchParams();
  const grades = [...new Set(items.map((i) => i.grade))].sort((a, b) => a - b);
  const [grade, setGrade] = useState<number | "all">(params.get("class") ? Number(params.get("class")) : "all");
  const [subject, setSubject] = useState<string>(params.get("subject") ?? "all");
  const [kind, setKind] = useState<"all" | "notes" | "paper">("all");
  const [q, setQ] = useState("");
  const subjects = [...new Map(items.filter((i) => grade === "all" || i.grade === grade).map((i) => [i.subject, i.subjectName])).entries()];
  const list = items.filter(
    (i) => (grade === "all" || i.grade === grade) && (subject === "all" || i.subject === subject) && (kind === "all" || i.kind === kind) && i.title.toLowerCase().includes(q.toLowerCase().trim()),
  );

  const chip = (on: boolean) => cn("h-9 rounded-full px-3.5 text-sm font-bold", on ? "bg-ink text-white" : "bg-surface text-ink-2 ring-1 ring-line hover:bg-surface-2");

  return (
    <div>
      <div className="card space-y-3 p-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Class">
          <button type="button" aria-pressed={grade === "all"} className={chip(grade === "all")} onClick={() => setGrade("all")}>
            All classes
          </button>
          {grades.map((g) => (
            <button key={g} type="button" aria-pressed={grade === g} className={chip(grade === g)} onClick={() => { setGrade(g); setSubject("all"); }}>
              Class {g}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Subject">
          <button type="button" aria-pressed={subject === "all"} className={chip(subject === "all")} onClick={() => setSubject("all")}>
            All subjects
          </button>
          {subjects.map(([id, name]) => (
            <button key={id} type="button" aria-pressed={subject === id} className={chip(subject === id)} onClick={() => setSubject(id)}>
              {name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "notes", "paper"] as const).map((k) => (
            <button key={k} type="button" aria-pressed={kind === k} className={chip(kind === k)} onClick={() => setKind(k)}>
              {k === "all" ? "Everything" : k === "notes" ? "Chapter notes" : "Practice papers"}
            </button>
          ))}
          <label className="ml-auto flex h-10 items-center gap-2 rounded-xl border-2 border-line bg-surface-2 px-3 focus-within:border-brand-400 sm:w-64">
            <Search aria-hidden className="size-4 text-ink-3" />
            <span className="sr-only">Filter by title</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by title" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          </label>
        </div>
      </div>

      <p className="mb-3 mt-6 text-sm font-semibold text-ink-3" aria-live="polite">
        {list.length} file{list.length === 1 ? "" : "s"}
      </p>
      {list.length === 0 ? (
        <p className="card p-8 text-center text-ink-2">Nothing matches. Try “All classes” or clear the filter.</p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {list.map((i) => (
            <li key={i.pdf} className="card flex items-center gap-4 p-4">
              <SubjectIcon id={i.subject} />
              <div className="min-w-0 flex-1">
                <p lang={i.subject === "hindi" ? "hi" : undefined} className="truncate font-bold">
                  {i.title}
                </p>
                <p className="text-xs font-semibold text-ink-3">
                  Class {i.grade} · {i.subjectName} · {i.kind === "notes" ? "Notes" : "Practice paper"} · PDF
                </p>
              </div>
              <Link href={i.view} target="_blank" className="hidden h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-bold text-ink-2 hover:bg-surface-2 sm:inline-flex">
                <FileText aria-hidden className="size-4" /> View
              </Link>
              <a href={i.pdf} download onClick={() => toast("Download started")} className="inline-flex h-10 items-center gap-1.5 rounded-xl border-b-4 border-green-700 bg-green-500 px-3 text-sm font-bold text-white hover:bg-green-400">
                <Download aria-hidden className="size-4" /> PDF
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
