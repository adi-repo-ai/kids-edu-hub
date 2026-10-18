import { ClipboardCheck, Download, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContinueButton, LearningPath, SubjectStats } from "@/components/learn/LearningPath";
import { Crumbs } from "@/components/layout/PageTitle";
import { SubjectIcon } from "@/components/ui/SubjectIcon";
import { chaptersOf, getGrade, getSubject, grades } from "@/lib/curriculum";
import { hasLesson } from "@/lib/lessons";
import { mocks } from "@/content/mocks";
import { styleFor } from "@/lib/subjects";

export function generateStaticParams() {
  return grades.flatMap((g) => g.subjects.map((s) => ({ grade: String(g.grade), subject: s.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ grade: string; subject: string }> }): Promise<Metadata> {
  const { grade, subject } = await params;
  return { title: `${getSubject(grade, subject)?.name ?? "Subject"} · Class ${grade}` };
}

export default async function SubjectPage({ params }: { params: Promise<{ grade: string; subject: string }> }) {
  const { grade: g, subject: s } = await params;
  const grade = getGrade(g);
  const subject = getSubject(g, s);
  if (!grade || !subject) notFound();
  const st = styleFor(subject.id);
  const chapters = chaptersOf(subject);
  const units = subject.units.map((u) => ({ title: u.title, chapters: u.chapters.map((c) => ({ id: c.id, title: c.title, lesson: hasLesson(grade.grade, subject.id, c.id) })) }));
  const lessonCount = units.reduce((n, u) => n + u.chapters.filter((c) => c.lesson).length, 0);
  const subjectMocks = mocks.filter((m) => m.grade === grade.grade && m.subject === subject.id);

  return (
    <>
      <Crumbs items={[{ href: "/learn", label: "Learn" }, { href: `/class/${grade.grade}`, label: `Class ${grade.grade}` }, { href: `/class/${grade.grade}/${subject.id}`, label: subject.name }]} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <div className="mb-8 flex items-center gap-4">
            <SubjectIcon id={subject.id} size="xl" solid />
            <div>
              <h1 className="text-3xl font-extrabold sm:text-4xl">{subject.name}</h1>
              <p className="mt-1 text-ink-2">
                Class {grade.grade} · {chapters.length} {grade.structure === "topics" ? "topics" : "chapters"} · {lessonCount} concept lessons
              </p>
            </div>
          </div>
          <LearningPath grade={grade.grade} subject={subject.id} units={units} solid={st.solid} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <ContinueButton grade={grade.grade} subject={subject.id} chapters={chapters.map((c) => ({ id: c.id, title: c.title }))} />
          <div className="card p-5">
            <p className="mb-3 font-extrabold">Your progress</p>
            <SubjectStats grade={grade.grade} subject={subject.id} chapterIds={chapters.map((c) => c.id)} />
          </div>
          <div className="card divide-y divide-line">
            {subjectMocks.map((m) => (
              <Link key={m.id} href={`/mock/${m.id}`} className="flex items-center gap-3 p-4 hover:bg-surface-2">
                <ClipboardCheck aria-hidden className="size-5 text-brand-600" />
                <span className="flex-1">
                  <span className="block font-bold">{m.title}</span>
                  <span className="text-xs text-ink-3">
                    {m.marks} marks · {m.minutes} min
                  </span>
                </span>
              </Link>
            ))}
            {lessonCount > 0 && (
              <Link href={`/library?class=${grade.grade}&subject=${subject.id}`} className="flex items-center gap-3 p-4 hover:bg-surface-2">
                <Download aria-hidden className="size-5 text-green-600" />
                <span className="flex-1 font-bold">Download chapter notes (PDF)</span>
              </Link>
            )}
            <a href="https://ncert.nic.in/textbook.php" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 hover:bg-surface-2">
              <ExternalLink aria-hidden className="size-5 text-ink-3" />
              <span className="flex-1">
                <span className="block font-bold">NCERT textbooks</span>
                <span className="text-xs text-ink-3">{(subject.books ?? []).join(", ")} · opens ncert.nic.in</span>
              </span>
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
