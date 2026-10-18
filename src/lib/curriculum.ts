import { class1, class2, class3, class4, class5 } from "@/content/curriculum/class-01-05";
import { class6, class7, class8 } from "@/content/curriculum/class-06-08";
import { class9 } from "@/content/curriculum/class-09";
import { class10 } from "@/content/curriculum/class-10";
import { class11 } from "@/content/curriculum/class-11";
import { class12 } from "@/content/curriculum/class-12";
import type { ChapterDef, GradeDef, SubjectDef } from "./types";

export const grades: GradeDef[] = [class1, class2, class3, class4, class5, class6, class7, class8, class9, class10, class11, class12];

export const getGrade = (g: number | string) => grades.find((x) => x.grade === Number(g));
export const getSubject = (g: number | string, s: string) => getGrade(g)?.subjects.find((x) => x.id === s);
export const chaptersOf = (subject: SubjectDef) => subject.units.flatMap((u) => u.chapters);
export const chapterKey = (g: number | string, s: string, c: string) => `${g}/${s}/${c}`;
export const chapterHref = (g: number | string, s: string, c: string) => `/class/${g}/${s}/${c}`;

export function getChapter(g: number | string, s: string, c: string) {
  const subject = getSubject(g, s);
  if (!subject) return undefined;
  const list = chaptersOf(subject);
  const index = list.findIndex((x) => x.id === c);
  if (index < 0) return undefined;
  const unit = subject.units.find((u) => u.chapters.some((x) => x.id === c))!;
  return { subject, chapter: list[index] as ChapterDef, unit, index, prev: list[index - 1], next: list[index + 1] };
}

export const allChapters = () =>
  grades.flatMap((g) => g.subjects.flatMap((s) => chaptersOf(s).map((c) => ({ grade: g.grade, subject: s, chapter: c }))));

export const stageOf = (g: number) => getGrade(g)?.stage ?? "";
