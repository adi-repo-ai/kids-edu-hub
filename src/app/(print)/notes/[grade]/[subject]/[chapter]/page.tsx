import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrintBar } from "@/components/practice/PrintBar";
import { allChapters, getChapter } from "@/lib/curriculum";
import { getLesson, hasLesson } from "@/lib/lessons";

type P = { grade: string; subject: string; chapter: string };

export function generateStaticParams() {
  return allChapters()
    .filter((c) => hasLesson(c.grade, c.subject.id, c.chapter.id))
    .map((c) => ({ grade: String(c.grade), subject: c.subject.id, chapter: c.chapter.id }));
}

export async function generateMetadata({ params }: { params: Promise<P> }): Promise<Metadata> {
  const { grade, subject, chapter } = await params;
  return { title: `${getChapter(grade, subject, chapter)?.chapter.title ?? "Notes"} · notes` };
}

export default async function NotesPrint({ params }: { params: Promise<P> }) {
  const { grade, subject, chapter } = await params;
  const found = getChapter(grade, subject, chapter);
  const lesson = getLesson(grade, subject, chapter);
  if (!found || !lesson) notFound();
  const hi = subject === "hindi";
  return (
    <>
      <PrintBar pdf={`/notes/${grade}-${subject}-${chapter}.pdf`} />
      <article className="mx-auto max-w-3xl px-8 py-10">
        <header className="mb-8 border-b-2 border-ink pb-4">
          <p className="text-sm font-bold uppercase tracking-widest text-ink-3">
            Kaksha notes · Class {grade} · {found.subject.name}
          </p>
          <h1 lang={hi ? "hi" : undefined} className="mt-1 text-3xl font-extrabold">
            {found.chapter.title}
          </h1>
        </header>
        <div lang={hi ? "hi" : undefined} className="lesson" dangerouslySetInnerHTML={{ __html: lesson.html }} />
        {lesson.quiz.length > 0 && (
          <section className="mt-10 border-t-2 border-dashed border-ink-3 pt-6" style={{ breakBefore: "page" }}>
            <h2 className="text-xl font-extrabold">Practice questions</h2>
            <ol className="mt-3 list-decimal space-y-3 pl-5">
              {lesson.quiz.map((q, i) => (
                <li key={i}>
                  {q.prompt}
                  {q.kind === "mcq" && (
                    <span className="mt-0.5 block text-sm text-ink-2">
                      {q.options.map((o, k) => `(${"abcd"[k]}) ${o.text}`).join("   ")}
                    </span>
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-ink-3">
              Answers:{" "}
              {lesson.quiz
                .map((q, i) => `${i + 1}. ${q.kind === "mcq" ? "abcd"[q.options.findIndex((o) => o.correct)] : "see notes"}`)
                .join("  ")}
            </p>
          </section>
        )}
      </article>
    </>
  );
}
