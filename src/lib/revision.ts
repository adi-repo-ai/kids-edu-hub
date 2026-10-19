import { getChapter } from "./curriculum";
import { today, type State } from "./store";

/*
 * Adaptive revision path. A chapter shows up for revision when:
 *  (a) it was completed, has never been revised and at least a day has passed,
 *  (b) its revision schedule says it is due,
 *  (c) its chapter-quiz best is under 60% (until it has been revised after that quiz), or
 *  (d) it has 2+ mistakes in the notebook (made after the day of its last revision).
 * Items are ranked by urgency and carry the reasons, so the UI can say WHY.
 */

export type RevisionReason =
  | { kind: "new"; days: number } // completed N days ago, never revised
  | { kind: "due"; days: number; overdue: number } // last revised N days ago, overdue by M days
  | { kind: "quiz"; best: number; total: number }
  | { kind: "mistakes"; count: number };

export interface RevisionItem {
  key: string;
  grade: number;
  subject: string;
  chapter: string;
  title: string;
  subjectName: string;
  urgency: number;
  reasons: RevisionReason[];
}

const DAY = 86400000;
/** Whole days between two yyyy-mm-dd (or ISO) dates, b − a. */
export function daysBetween(a: string, b: string) {
  const d = (x: string) => Date.UTC(+x.slice(0, 4), +x.slice(5, 7) - 1, +x.slice(8, 10));
  return Math.round((d(b) - d(a)) / DAY);
}

/** Local yyyy-mm-dd of an ISO timestamp. */
const localDay = (iso: string) => today(new Date(iso));

/** The day a chapter was last revised, from its schedule (due − interval). */
export function lastRevised(s: State, key: string): string | null {
  const r = s.revision[key];
  if (!r) return null;
  const d = new Date(`${r.due}T12:00:00`);
  d.setDate(d.getDate() - r.interval);
  return today(d);
}

export function revisionItems(s: State, grade?: number | null): RevisionItem[] {
  const now = today();
  const mistakesBy = new Map<string, string[]>();
  for (const m of s.mistakes) mistakesBy.set(m.key, [...(mistakesBy.get(m.key) ?? []), m.at]);
  const keys = new Set([...Object.keys(s.lessons), ...Object.keys(s.revision), ...Object.keys(s.quizzes), ...mistakesBy.keys()]);

  const out: RevisionItem[] = [];
  for (const key of keys) {
    const [g, subject, chapter] = key.split("/");
    if (!chapter || (grade && Number(g) !== grade)) continue;
    const info = getChapter(g, subject, chapter);
    if (!info) continue;
    const reasons: RevisionReason[] = [];
    let urgency = 0;
    const rev = s.revision[key];
    const last = lastRevised(s, key);

    const done = s.lessons[key];
    if (done && !rev) {
      const days = daysBetween(localDay(done), now);
      if (days >= 1) {
        reasons.push({ kind: "new", days });
        urgency += 10 + Math.min(days, 30);
      }
    }
    if (rev && rev.due <= now) {
      const overdue = daysBetween(rev.due, now);
      reasons.push({ kind: "due", days: last ? daysBetween(last, now) : rev.interval, overdue });
      urgency += 15 + Math.min(overdue, 30) * 2;
    }
    const q = s.quizzes[key];
    if (q && q.total > 0 && q.best / q.total < 0.6 && (!last || last < localDay(q.last))) {
      reasons.push({ kind: "quiz", best: q.best, total: q.total });
      urgency += 12 + Math.round((0.6 - q.best / q.total) * 40);
    }
    const fresh = (mistakesBy.get(key) ?? []).filter((at) => !last || localDay(at) > last).length;
    if (fresh >= 2) {
      reasons.push({ kind: "mistakes", count: fresh });
      urgency += 8 + fresh * 3;
    }
    if (reasons.length) out.push({ key, grade: Number(g), subject, chapter, title: info.chapter.title, subjectName: info.subject.name, urgency, reasons });
  }
  return out.sort((a, b) => b.urgency - a.urgency || a.key.localeCompare(b.key));
}

/** Quality for the revision schedule from a quick-quiz score. */
export const ratingFromScore = (score: number, total: number): 0 | 1 | 2 => {
  const p = total ? score / total : 0;
  return p < 0.6 ? 0 : p < 0.9 ? 1 : 2;
};

/** Chapters with a revision scheduled after today, soonest first. */
export function upcomingRevisions(s: State, grade?: number | null) {
  const now = today();
  return Object.entries(s.revision)
    .filter(([k, r]) => r.due > now && (!grade || k.startsWith(`${grade}/`)))
    .map(([key, r]) => {
      const [g, subject, chapter] = key.split("/");
      return { key, due: r.due, subject, title: getChapter(g, subject, chapter)?.chapter.title ?? chapter };
    })
    .sort((a, b) => a.due.localeCompare(b.due));
}
