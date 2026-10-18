import { chaptersOf, grades } from "./curriculum";

export interface SearchEntry {
  id: string;
  title: string;
  meta: string;
  href: string;
  grade?: number;
  hay: string;
  kind: "chapter" | "subject" | "class" | "page";
}

const pages: [string, string, string][] = [
  ["Home", "/dashboard", "dashboard today streak"],
  ["Mock tests", "/mock", "exam practice paper timed"],
  ["Past papers", "/papers", "previous year question papers sample papers pyq board"],
  ["Notes & downloads", "/library", "pdf notes download worksheets"],
  ["My progress", "/progress", "xp level streak report"],
  ["Study planner", "/planner", "timetable schedule tasks"],
  ["Parent view", "/parent", "parents report"],
  ["Saved", "/saved", "bookmarks"],
  ["CBSE news", "/news", "circulars announcements"],
];

let index: SearchEntry[] | null = null;

export function searchIndex() {
  if (index) return index;
  const out: SearchEntry[] = pages.map(([title, href, kw]) => ({ id: href, title, meta: "Page", href, hay: `${title} ${kw}`.toLowerCase(), kind: "page" }));
  for (const g of grades) {
    out.push({ id: `c${g.grade}`, title: `Class ${g.grade}`, meta: `${g.subjects.length} subjects`, href: `/class/${g.grade}`, grade: g.grade, hay: `class ${g.grade} grade ${g.grade} ${g.stage}`.toLowerCase(), kind: "class" });
    for (const s of g.subjects) {
      out.push({ id: `s${g.grade}${s.id}`, title: s.name, meta: `Class ${g.grade}`, href: `/class/${g.grade}/${s.id}`, grade: g.grade, hay: `${s.name} class ${g.grade} ${(s.books ?? []).join(" ")}`.toLowerCase(), kind: "subject" });
      for (const c of chaptersOf(s)) {
        out.push({
          id: `${g.grade}/${s.id}/${c.id}`,
          title: c.title,
          meta: `Class ${g.grade} · ${s.name}`,
          href: `/class/${g.grade}/${s.id}/${c.id}`,
          grade: g.grade,
          hay: `${c.title} ${s.name} class ${g.grade} ${(c.topics ?? []).join(" ")}`.toLowerCase(),
          kind: "chapter",
        });
      }
    }
  }
  return (index = out);
}

/** All words must match. Title hits rank first, then the learner's own class. */
export function search(q: string, grade?: number | null, limit = 10) {
  const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return searchIndex()
    .map((e) => {
      if (!words.every((w) => e.hay.includes(w))) return null;
      const t = e.title.toLowerCase();
      let score = words.reduce((n, w) => n + (t.startsWith(w) ? 4 : t.includes(w) ? 2 : 0), 0);
      if (grade && e.grade === grade) score += 3;
      if (e.kind === "page") score += 1;
      return { e, score };
    })
    .filter((x): x is { e: SearchEntry; score: number } => !!x)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.e);
}
