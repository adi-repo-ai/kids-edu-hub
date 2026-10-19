import { mocks } from "@/content/mocks";
import { chaptersOf, getGrade, getSubject } from "./curriculum";
import type { State } from "./store";

/*
 * Board-exam readiness per subject:
 *   40% syllabus completed + 30% average chapter-quiz best + 30% mock-test average.
 * With no mock attempted for a subject the first two are re-weighted to 57% / 43%.
 */

export interface SubjectReadiness {
  grade: number;
  subject: string;
  name: string;
  chapters: number;
  done: number;
  syllabusPct: number;
  quizPct: number; // 0 when no quiz attempted
  quizCount: number;
  mockPct: number | null;
  mockCount: number;
  reweighted: boolean;
  score: number;
}

export type ReadinessStatus = "on-track" | "getting-there" | "attention";
export const statusOf = (score: number): ReadinessStatus => (score >= 75 ? "on-track" : score >= 50 ? "getting-there" : "attention");

/** Does a mock record id belong to this class and subject? */
export function mockMatches(id: string, grade: number, subject: string) {
  const def = mocks.find((m) => m.id === id);
  if (def) return def.grade === grade && def.subject === subject;
  // Anchored so "science" doesn't match "social-science".
  return new RegExp(`^class-0?${grade}-${subject}-mock`).test(id);
}

const combine = (syl: number, quiz: number, mock: number | null) =>
  mock === null ? 0.57 * syl + 0.43 * quiz : 0.4 * syl + 0.3 * quiz + 0.3 * mock;

export function subjectReadiness(s: State, grade: number, subjectId: string): SubjectReadiness | null {
  const subject = getSubject(grade, subjectId);
  if (!subject) return null;
  const list = chaptersOf(subject);
  const keys = list.map((c) => `${grade}/${subject.id}/${c.id}`);
  const done = keys.filter((k) => s.lessons[k]).length;
  const quizzes = keys.map((k) => s.quizzes[k]).filter((q) => q && q.total > 0);
  const quizPct = quizzes.length ? (quizzes.reduce((n, q) => n + q.best / q.total, 0) / quizzes.length) * 100 : 0;
  const ms = s.mocks.filter((m) => m.total > 0 && mockMatches(m.id, grade, subject.id));
  const mockPct = ms.length ? (ms.reduce((n, m) => n + m.score / m.total, 0) / ms.length) * 100 : null;
  const syllabusPct = list.length ? (done / list.length) * 100 : 0;
  return {
    grade,
    subject: subject.id,
    name: subject.name,
    chapters: list.length,
    done,
    syllabusPct,
    quizPct,
    quizCount: quizzes.length,
    mockPct,
    mockCount: ms.length,
    reweighted: mockPct === null,
    score: Math.round(combine(syllabusPct, quizPct, mockPct)),
  };
}

export function readinessOf(s: State, grade: number) {
  const g = getGrade(grade);
  const subjects = (g?.subjects ?? []).map((x) => subjectReadiness(s, grade, x.id)).filter((x): x is SubjectReadiness => !!x);
  const overall = subjects.length ? Math.round(subjects.reduce((n, x) => n + x.score, 0) / subjects.length) : 0;
  return { subjects, overall, status: statusOf(overall) };
}

export type ReadinessAction =
  | { kind: "finish"; subject: string; subjectName: string; chapter: string; title: string; href: string; gain: number }
  | { kind: "quiz"; subject: string; subjectName: string; chapter: string; title: string; best: number | null; total: number | null; href: string; gain: number }
  | { kind: "mock"; subject: string; subjectName: string; mockTitle: string; href: string; gain: number };

/**
 * The actions with the biggest estimated gain in a subject's score. Estimates assume a
 * realistic result (quiz retake → 90%, first quiz → 70%, mock in line with current preparation), not a perfect one.
 */
export function topActions(s: State, grade: number, n = 3): ReadinessAction[] {
  const g = getGrade(grade);
  if (!g) return [];
  const out: ReadinessAction[] = [];
  for (const sub of g.subjects) {
    const r = subjectReadiness(s, grade, sub.id)!;
    const list = chaptersOf(sub);
    const key = (c: string) => `${grade}/${sub.id}/${c}`;
    const base = r.score;
    const scoreWith = (syl: number, quiz: number, mock: number | null) => combine(syl, quiz, mock);

    // 1. Finish the next unfinished chapter.
    const next = list.find((c) => !s.lessons[key(c.id)]);
    if (next) {
      const gain = scoreWith(((r.done + 1) / r.chapters) * 100, r.quizPct, r.mockPct) - base;
      out.push({ kind: "finish", subject: sub.id, subjectName: sub.name, chapter: next.id, title: next.title, href: `/class/${grade}/${sub.id}/${next.id}`, gain });
    }

    // 2. Retake the weakest quiz, or take a first quiz on a completed chapter.
    const sum = (r.quizPct / 100) * r.quizCount;
    const weakest = list
      .map((c) => ({ c, q: s.quizzes[key(c.id)] }))
      .filter((x) => x.q && x.q.total > 0 && x.q.best / x.q.total < 0.9)
      .sort((a, b) => a.q.best / a.q.total - b.q.best / b.q.total)[0];
    if (weakest) {
      const newAvg = ((sum - weakest.q.best / weakest.q.total + 0.9) / r.quizCount) * 100;
      out.push({ kind: "quiz", subject: sub.id, subjectName: sub.name, chapter: weakest.c.id, title: weakest.c.title, best: weakest.q.best, total: weakest.q.total, href: `/class/${grade}/${sub.id}/${weakest.c.id}#quiz`, gain: scoreWith(r.syllabusPct, newAvg, r.mockPct) - base });
    }
    const untested = list.find((c) => s.lessons[key(c.id)] && !s.quizzes[key(c.id)]);
    if (untested) {
      const newAvg = ((sum + 0.7) / (r.quizCount + 1)) * 100;
      out.push({ kind: "quiz", subject: sub.id, subjectName: sub.name, chapter: untested.id, title: untested.title, best: null, total: null, href: `/class/${grade}/${sub.id}/${untested.id}#quiz`, gain: scoreWith(r.syllabusPct, newAvg, r.mockPct) - base });
    }

    // 3. Attempt a mock test, when one exists for this subject.
    const mock = mocks.find((m) => m.grade === grade && m.subject === sub.id);
    if (mock) {
      // Expect a mock result in line with current preparation (30% floor, up to ~80%).
      const expected = 30 + 0.5 * combine(r.syllabusPct, r.quizPct, null);
      const newMock = r.mockPct === null ? expected : (r.mockPct * r.mockCount + expected) / (r.mockCount + 1);
      out.push({ kind: "mock", subject: sub.id, subjectName: sub.name, mockTitle: mock.title, href: `/mock/${mock.id}`, gain: scoreWith(r.syllabusPct, r.quizPct, newMock) - base });
    }
  }
  return out
    .filter((a) => a.gain >= 0.5)
    .map((a) => ({ ...a, gain: Math.round(a.gain) || 1 }))
    .sort((a, b) => b.gain - a.gain)
    .slice(0, n);
}

/** Days from today until a yyyy-mm-dd date (negative once it has passed). */
export function daysUntil(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const t = new Date();
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(t.getFullYear(), t.getMonth(), t.getDate())) / 86400000);
}
