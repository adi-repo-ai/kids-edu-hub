import type { Metadata } from "next";
import { Daily } from "@/components/practice/Daily";
import type { BankedGrade } from "@/components/practice/TestRunner";
import { chaptersOf, grades } from "@/lib/curriculum";
import { hasLesson } from "@/lib/lessons";

export const metadata: Metadata = { title: "Daily challenge" };

export default function DailyPage() {
  const classes: BankedGrade[] = grades.map((g) => ({
    grade: g.grade,
    subjects: g.subjects.filter((s) => chaptersOf(s).some((c) => hasLesson(g.grade, s.id, c.id))).map((s) => ({ id: s.id, name: s.name })),
  }));
  return <Daily classes={classes} />;
}
