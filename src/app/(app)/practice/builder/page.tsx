import type { Metadata } from "next";
import { Crumbs, PageTitle } from "@/components/layout/PageTitle";
import { Builder } from "@/components/practice/Builder";
import type { BankedGrade } from "@/components/practice/TestRunner";
import { chaptersOf, grades } from "@/lib/curriculum";
import { hasLesson } from "@/lib/lessons";

export const metadata: Metadata = { title: "Custom test builder" };

export default function BuilderPage() {
  const classes: BankedGrade[] = grades.map((g) => ({
    grade: g.grade,
    subjects: g.subjects.filter((s) => chaptersOf(s).some((c) => hasLesson(g.grade, s.id, c.id))).map((s) => ({ id: s.id, name: s.name })),
  }));
  return (
    <>
      <Crumbs items={[{ href: "/practice", label: "Practice" }, { href: "/practice/builder", label: "Test builder" }]} />
      <PageTitle eyebrow="Practice" title="Build your own test" sub="Choose chapters, length and a timer. Get a fresh random paper with answers and explanations." />
      <Builder classes={classes} />
    </>
  );
}
