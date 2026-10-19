import type { Metadata } from "next";
import { PageTitle } from "@/components/layout/PageTitle";
import { Battle } from "@/components/practice/Battle";
import type { BankedGrade } from "@/components/practice/TestRunner";
import { chaptersOf, grades } from "@/lib/curriculum";
import { hasLesson } from "@/lib/lessons";

export const metadata: Metadata = { title: "Quiz battle" };

export default function BattlePage() {
  const classes: BankedGrade[] = grades.map((g) => ({
    grade: g.grade,
    subjects: g.subjects.filter((s) => chaptersOf(s).some((c) => hasLesson(g.grade, s.id, c.id))).map((s) => ({ id: s.id, name: s.name })),
  }));
  return (
    <>
      <PageTitle eyebrow="Practice" title="Quiz battle" sub="Seven quick rounds against Gyani Bot. Answer right and fast to win." />
      <Battle classes={classes} />
    </>
  );
}
