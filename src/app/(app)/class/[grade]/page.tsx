import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubjectProgress } from "@/components/learn/ProgressBits";
import { Crumbs, PageTitle } from "@/components/layout/PageTitle";
import { SubjectIcon } from "@/components/ui/SubjectIcon";
import { chaptersOf, getGrade, grades } from "@/lib/curriculum";
import { hasLesson } from "@/lib/lessons";
import { styleFor } from "@/lib/subjects";

export function generateStaticParams() {
  return grades.map((g) => ({ grade: String(g.grade) }));
}

export async function generateMetadata({ params }: { params: Promise<{ grade: string }> }): Promise<Metadata> {
  return { title: `Class ${(await params).grade}` };
}

export default async function ClassPage({ params }: { params: Promise<{ grade: string }> }) {
  const { grade: g } = await params;
  const grade = getGrade(g);
  if (!grade) notFound();
  return (
    <>
      <Crumbs items={[{ href: "/learn", label: "Learn" }, { href: `/class/${grade.grade}`, label: `Class ${grade.grade}` }]} />
      <PageTitle eyebrow={`${grade.stage} stage`} title={`Class ${grade.grade}`} sub={`Pick a subject. Each one is laid out as a learning path through every ${grade.structure === "topics" ? "topic" : "chapter"}.`} />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {grade.subjects.map((s) => {
          const list = chaptersOf(s);
          const lessons = list.filter((c) => hasLesson(grade.grade, s.id, c.id)).length;
          const st = styleFor(s.id);
          return (
            <li key={s.id}>
              <Link href={`/class/${grade.grade}/${s.id}`} className="card card-hover flex h-full flex-col p-5">
                <span className="flex items-start gap-4">
                  <SubjectIcon id={s.id} size="lg" solid />
                  <span className="min-w-0">
                    <span className="block text-lg font-extrabold leading-tight">{s.name}</span>
                    <span className="mt-0.5 block text-sm text-ink-3">{(s.books ?? []).join(" · ")}</span>
                  </span>
                </span>
                <span className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                  <span className="rounded-full bg-surface-2 px-2.5 py-1 text-ink-2">
                    {list.length} {grade.structure === "topics" ? "topics" : "chapters"}
                  </span>
                  {lessons > 0 && <span className="rounded-full bg-green-50 px-2.5 py-1 text-green-700">{lessons} concept lessons</span>}
                </span>
                <span className="mt-auto block pt-5">
                  <SubjectProgress grade={grade.grade} subject={s.id} chapterIds={list.map((c) => c.id)} color={st.bar} label={`${s.name} progress`} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
