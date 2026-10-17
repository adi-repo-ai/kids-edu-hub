import { chapters, grades, subjectById } from "@/data/curriculum";
import { papers, resources } from "@/data/library";
import { quizzes } from "@/data/practice";

export interface SearchEntry {
  id: string;
  title: string;
  group: "Chapters" | "Lessons" | "Practice" | "Papers" | "Notes & worksheets" | "Pages";
  meta: string;
  href: string;
  keywords: string;
}

const pages: SearchEntry[] = [
  ["Dashboard", "/dashboard", "home progress streak"],
  ["Study planner", "/planner", "timetable schedule exam"],
  ["Parent dashboard", "/parent", "parents report"],
  ["CBSE news & circulars", "/news", "announcements board"],
  ["Saved items", "/saved", "bookmarks"],
  ["Design system", "/design-system", "tokens components"],
].map(([title, href, keywords]) => ({ id: `page:${href}`, title, group: "Pages" as const, meta: "Page", href, keywords }));

export const searchIndex: SearchEntry[] = [
  ...chapters.map((c) => {
    const s = subjectById(c.subject)!;
    return {
      id: `ch:${c.id}`,
      title: c.title,
      group: "Chapters" as const,
      meta: `${s.name} · Class 8 · Ch ${c.number}`,
      href: `/learn/${c.subject}/${c.id}`,
      keywords: `${s.name} ${s.book} ${c.summary}`,
    };
  }),
  ...chapters.flatMap((c) =>
    c.lessons.map((l) => ({
      id: `ls:${l.id}`,
      title: l.title,
      group: "Lessons" as const,
      meta: `${c.title} · ${l.minutes} min ${l.kind}`,
      href: l.slug ? `/lesson/${l.slug}` : `/learn/${c.subject}/${c.id}`,
      keywords: `${subjectById(c.subject)!.name} ${l.kind}`,
    })),
  ),
  ...quizzes.map((q) => ({ id: `qz:${q.id}`, title: q.title, group: "Practice" as const, meta: `Quiz · ${q.questions.length} questions`, href: `/practice/${q.id}`, keywords: "quiz test mcq" })),
  ...papers.map((p) => ({
    id: `pp:${p.id}`,
    title: `${p.subject} ${p.year}`,
    group: "Papers" as const,
    meta: `Class ${p.grade} · ${p.kind} · Code ${p.code}`,
    href: `/papers?grade=${p.grade}&q=${encodeURIComponent(p.subject)}`,
    keywords: `previous year question paper pyq class ${p.grade} ${p.kind}`,
  })),
  ...resources.map((r) => ({ id: `rs:${r.id}`, title: r.title, group: "Notes & worksheets" as const, meta: `${subjectById(r.subject)!.name} · ${r.kind}`, href: "/library", keywords: `${r.kind} pdf download` })),
  ...grades.map((g) => ({ id: `gr:${g.id}`, title: g.label, group: "Pages" as const, meta: g.focus, href: `/class/${g.id}`, keywords: `class ${g.id} grade ${g.stage}` })),
  ...pages,
];

export const suggestedQueries = ["Square roots", "Class 10 Science 2025", "Diffusion", "Marathas notes", "Mock exam"];

/** Every word typed must appear in the title, meta or keywords. Title matches rank first. */
export function search(query: string, limit = 8): SearchEntry[] {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return searchIndex
    .map((e) => {
      const title = e.title.toLowerCase();
      const hay = `${title} ${e.meta} ${e.keywords}`.toLowerCase();
      if (!words.every((w) => hay.includes(w))) return null;
      const score = words.reduce((n, w) => n + (title.startsWith(w) ? 3 : title.includes(w) ? 2 : 0), 0);
      return { e, score };
    })
    .filter((x): x is { e: SearchEntry; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.e);
}
