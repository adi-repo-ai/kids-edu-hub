import type { Metadata } from "next";
import { PageTitle } from "@/components/layout/PageTitle";
import { PracticeHub, type PracticeGrade } from "@/components/practice/PracticeHub";
import { chaptersOf, grades } from "@/lib/curriculum";
import { getLesson } from "@/lib/lessons";

export const metadata: Metadata = { title: "Practice" };

export default function PracticePage() {
  const data: PracticeGrade[] = grades
    .map((g) => ({
      grade: g.grade,
      subjects: g.subjects
        .map((s) => ({
          id: s.id,
          name: s.name,
          chapters: chaptersOf(s)
            .map((c) => ({ id: c.id, title: c.title, questions: getLesson(g.grade, s.id, c.id)?.quiz.length ?? 0 }))
            .filter((c) => c.questions > 0),
        }))
        .filter((s) => s.chapters.length),
    }))
    .filter((g) => g.subjects.length)
    .sort((a, b) => b.grade - a.grade);
  return (
    <>
      <PageTitle eyebrow="Practice" title="Practice" sub="Daily challenge, custom tests, quiz battles and chapter quizzes with explanations." />
      <PracticeHub data={data} />
    </>
  );
}
