import type { Metadata } from "next";
import { PageTitle } from "@/components/layout/PageTitle";
import { Mistakes } from "@/components/practice/Mistakes";
import { mocks } from "@/content/mocks";
import { grades } from "@/lib/curriculum";
import { hasLesson } from "@/lib/lessons";

export const metadata: Metadata = { title: "Mistake notebook" };

export default function MistakesPage() {
  // Chapter key -> names, so the notebook can group mistakes without shipping the whole curriculum.
  const names: Record<string, { subject: string; chapter: string }> = {};
  for (const g of grades)
    for (const s of g.subjects) {
      // Only chapters with lessons have quizzes, so only they can produce mistakes; keeps the map small.
      for (const u of s.units) for (const c of u.chapters) if (hasLesson(g.grade, s.id, c.id)) names[`${g.grade}/${s.id}/${c.id}`] = { subject: s.name, chapter: c.title };
    }
  for (const m of mocks) {
    const s = grades.find((g) => g.grade === m.grade)?.subjects.find((x) => x.id === m.subject);
    names[`${m.grade}/${m.subject}/mock`] = { subject: s?.name ?? m.subject, chapter: "Mock tests" };
  }
  return (
    <>
      <PageTitle eyebrow="Practice" title="Mistake notebook" sub="Every question you got wrong, in one place. Answer one right twice in a row and it leaves the notebook." />
      <Mistakes names={names} />
    </>
  );
}
