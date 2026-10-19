import { ArrowLeft, ArrowRight, BookOpenCheck, Clock, ExternalLink, ListChecks } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookmarkToggle, CompleteToggle, NotesButtons } from "@/components/learn/ChapterActions";
import { ChapterLinks, LessonView } from "@/components/learn/LessonView";
import { Quiz } from "@/components/learn/Quiz";
import { Crumbs } from "@/components/layout/PageTitle";
import { Mascot } from "@/components/ui/Mascot";
import { SubjectIcon } from "@/components/ui/SubjectIcon";
import { allChapters, chapterKey, getChapter, getGrade } from "@/lib/curriculum";
import { getLesson, getOutline, sheetKindOf, splitSims, subjectHasLessons } from "@/lib/lessons";

type P = { grade: string; subject: string; chapter: string };

export function generateStaticParams() {
  return allChapters().map((c) => ({ grade: String(c.grade), subject: c.subject.id, chapter: c.chapter.id }));
}

export async function generateMetadata({ params }: { params: Promise<P> }): Promise<Metadata> {
  const { grade, subject, chapter } = await params;
  const found = getChapter(grade, subject, chapter);
  return { title: found ? `${found.chapter.title} · ${found.subject.name} Class ${grade}` : "Chapter" };
}

export default async function ChapterPage({ params }: { params: Promise<P> }) {
  const { grade: g, subject: s, chapter: c } = await params;
  const grade = getGrade(g);
  const found = getChapter(g, s, c);
  if (!grade || !found) notFound();
  const { subject, chapter, unit, index, prev, next } = found;
  const lesson = getLesson(grade.grade, subject.id, chapter.id);
  const key = chapterKey(grade.grade, subject.id, chapter.id);
  const base = `/class/${grade.grade}/${subject.id}`;
  const isHindi = subject.id === "hindi" || subject.id === "sanskrit";
  const hasSheet = subjectHasLessons(grade.grade, subject.id);

  return (
    <>
      <Crumbs
        items={[
          { href: "/learn", label: "Learn" },
          { href: `/class/${grade.grade}`, label: `Class ${grade.grade}` },
          { href: base, label: subject.name },
          { href: `${base}/${chapter.id}`, label: grade.structure === "topics" ? "Topic" : `Chapter ${index + 1}` },
        ]}
      />

      <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="flex items-start gap-4">
          <SubjectIcon id={subject.id} size="lg" solid />
          <div>
            <p className="eyebrow">{unit.title}</p>
            <h1 lang={isHindi ? "hi" : undefined} className="mt-1 text-3xl font-extrabold sm:text-4xl">
              {chapter.title}
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-ink-3">
              <span>
                Class {grade.grade} · {subject.name}
              </span>
              {lesson && (
                <>
                  <span className="inline-flex items-center gap-1">
                    <Clock aria-hidden className="size-4" /> {lesson.minutes} min read
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ListChecks aria-hidden className="size-4" /> {lesson.quiz.filter((q) => q.kind === "mcq").length}-question quiz
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <BookmarkToggle k={key} title={chapter.title} meta={`Class ${grade.grade} · ${subject.name}`} href={`${base}/${chapter.id}`} />
          {lesson && <NotesButtons pdf={`/notes/${grade.grade}-${subject.id}-${chapter.id}.pdf`} view={`/notes/${grade.grade}/${subject.id}/${chapter.id}`} />}
          <ChapterLinks
            sheetHref={hasSheet ? `${base}/formulas` : undefined}
            sheetKind={sheetKindOf(subject.id)}
            videoQuery={`NCERT Class ${grade.grade} ${subject.name} ${chapter.title}`}
          />
        </div>
      </header>

      {lesson ? (
        <div className="grid gap-10 xl:grid-cols-[220px_1fr]">
          <nav aria-label="In this lesson" className="hidden xl:block">
            <div className="sticky top-24">
              <p className="eyebrow mb-3">In this lesson</p>
              <ol className="space-y-1 border-l-2 border-line">
                {lesson.toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="-ml-0.5 block border-l-2 border-transparent py-1.5 pl-4 text-sm font-semibold text-ink-2 hover:border-brand-500 hover:text-brand-700">
                      {t.title}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#quiz" className="-ml-0.5 block border-l-2 border-transparent py-1.5 pl-4 text-sm font-semibold text-brand-700 hover:border-brand-500">
                    Chapter quiz
                  </a>
                </li>
              </ol>
            </div>
          </nav>

          <div className="min-w-0 max-w-3xl">
            {chapter.topics && chapter.topics.length > 0 && (
              <div className="card mb-8 p-5">
                <p className="eyebrow mb-3">What you&apos;ll learn</p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {chapter.topics.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-[15px] font-semibold">
                      <BookOpenCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-green-600" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <LessonView title={chapter.title} parts={splitSims(lesson.html)} outline={getOutline(grade.grade, subject.id, chapter.id)} hindi={isHindi} />

            <section id="quiz" aria-label="Chapter quiz" className="mt-10 scroll-mt-24">
              <h2 className="mb-4 text-2xl font-extrabold">Check your understanding</h2>
              <Quiz questions={lesson.quiz} storeKey={key} title={`${chapter.title}: chapter quiz`} />
            </section>

            <div className="mt-10 flex flex-col items-start gap-6 rounded-2xl bg-green-50 p-6 sm:flex-row sm:items-center">
              <Mascot mood="happy" size={72} />
              <div className="flex-1">
                <p className="text-lg font-extrabold">Finished reading?</p>
                <p className="text-ink-2">Mark it complete to fill in this chapter on your learning path and earn 20 XP.</p>
              </div>
              <CompleteToggle k={key} />
            </div>

            <ChapterNav base={base} prev={prev} next={next} />
          </div>
        </div>
      ) : (
        <div className="max-w-3xl">
          <div className="card p-6 sm:p-8">
            <p className="eyebrow mb-3">{grade.structure === "topics" ? "What this topic covers" : "Key topics in this chapter"}</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {(chapter.topics?.length ? chapter.topics : [chapter.title]).map((t, k) => (
                <li key={t} className="flex items-start gap-3 rounded-xl bg-surface-2 p-4">
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand-500 text-sm font-extrabold text-white">{k + 1}</span>
                  <span lang={isHindi ? "hi" : undefined} className="font-semibold">
                    {t}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl border border-dashed border-line-strong p-4 text-ink-2">
              The full concept lesson for this {grade.structure === "topics" ? "topic" : "chapter"} is being written. Concept lessons are already live for every Class 9 and 10 chapter. Meanwhile, read it in your NCERT textbook and mark it as studied below to keep your path up to date.
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <CompleteToggle k={key} label="Mark as studied" />
              <a href="https://ncert.nic.in/textbook.php" target="_blank" rel="noreferrer" className="inline-flex h-13 items-center gap-2 rounded-xl px-4 font-bold text-ink-2 hover:bg-surface-2">
                <ExternalLink aria-hidden className="size-5" /> Open NCERT textbooks
              </a>
            </div>
          </div>
          <ChapterNav base={base} prev={prev} next={next} />
        </div>
      )}
    </>
  );
}

function ChapterNav({ base, prev, next }: { base: string; prev?: { id: string; title: string }; next?: { id: string; title: string } }) {
  return (
    <nav aria-label="Chapters" className="mt-10 grid gap-3 sm:grid-cols-2">
      {prev ? (
        <Link href={`${base}/${prev.id}`} className="card card-hover flex items-center gap-3 p-4">
          <ArrowLeft aria-hidden className="size-5 shrink-0 text-ink-3" />
          <span className="min-w-0">
            <span className="block text-xs font-bold text-ink-3">Previous</span>
            <span className="block truncate font-bold">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={`${base}/${next.id}`} className="card card-hover flex items-center justify-end gap-3 p-4 text-right">
          <span className="min-w-0">
            <span className="block text-xs font-bold text-ink-3">Next</span>
            <span className="block truncate font-bold">{next.title}</span>
          </span>
          <ArrowRight aria-hidden className="size-5 shrink-0 text-brand-600" />
        </Link>
      )}
    </nav>
  );
}
