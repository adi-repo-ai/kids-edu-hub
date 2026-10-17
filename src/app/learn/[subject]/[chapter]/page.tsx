import { BookOpen, Check, CirclePlay, Hand, MousePointerClick, Target } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookmarkButton } from "@/components/features/BookmarkButton";
import { ChapterStatus } from "@/components/features/ChapterStatus";
import { DownloadButton } from "@/components/features/DownloadButton";
import { Container, PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/Progress";
import { Tag } from "@/components/ui/Tag";
import { chapterById, chapters, subjectById } from "@/data/curriculum";
import { resources } from "@/data/library";
import { quizById } from "@/data/practice";
import { cn } from "@/lib/cn";
import { hue } from "@/lib/hue";
import type { LessonKind } from "@/lib/types";

const kindMeta: Record<LessonKind, { label: string; icon: typeof BookOpen }> = {
  interactive: { label: "Interactive", icon: MousePointerClick },
  video: { label: "Video", icon: CirclePlay },
  reading: { label: "Reading", icon: BookOpen },
  activity: { label: "Activity", icon: Hand },
};

export function generateStaticParams() {
  return chapters.map((c) => ({ subject: c.subject, chapter: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ chapter: string }> }): Promise<Metadata> {
  const { chapter } = await params;
  return { title: chapterById(chapter)?.title ?? "Chapter" };
}

export default async function ChapterPage({ params }: { params: Promise<{ subject: string; chapter: string }> }) {
  const { subject: sid, chapter: cid } = await params;
  const chapter = chapterById(cid);
  const subject = subjectById(sid);
  if (!chapter || !subject || chapter.subject !== subject.id) notFound();

  const nextLesson = chapter.lessons.find((l) => !l.done);
  const quiz = chapter.quizId ? quizById(chapter.quizId) : undefined;
  const chapterResources = resources.filter((r) => r.chapterId === chapter.id);
  const h = hue[subject.hue];

  return (
    <>
      <PageHeader
        crumbs={[
          { href: "/class/8", label: "Class 8" },
          { href: `/learn/${subject.id}`, label: subject.name },
          { href: `/learn/${subject.id}/${chapter.id}`, label: `Chapter ${chapter.number}` },
        ]}
        eyebrow={`${subject.book} · Chapter ${chapter.number}`}
        title={chapter.title}
        description={chapter.summary}
        actions={
          <>
            <BookmarkButton
              withLabel
              className="border border-line-strong bg-surface"
              item={{ id: `chapter:${chapter.id}`, kind: "chapter", title: chapter.title, meta: `${subject.name} · Ch ${chapter.number}`, href: `/learn/${subject.id}/${chapter.id}` }}
            />
            {nextLesson && (
              <ButtonLink href={nextLesson.slug ? `/lesson/${nextLesson.slug}` : "/lesson/perfect-squares-as-areas"}>
                {chapter.progress > 0 ? "Continue" : "Start"}: {nextLesson.title}
              </ButtonLink>
            )}
          </>
        }
      />

      <Container className="grid gap-10 py-10 lg:grid-cols-[1fr_320px] [&>*]:min-w-0">
        <section aria-labelledby="lessons-title">
          <div className="mb-5 flex items-center justify-between">
            <h2 id="lessons-title" className="text-xl font-bold">
              Lessons
            </h2>
            <ChapterStatus progress={chapter.progress} />
          </div>

          {/* A vertical "learning thread": done lessons are filled, the next one is highlighted. */}
          <ol className="relative">
            {chapter.lessons.map((l, i) => {
              const K = kindMeta[l.kind];
              const isNext = l.id === nextLesson?.id;
              const href = l.slug ? `/lesson/${l.slug}` : undefined;
              return (
                <li key={l.id} className="relative grid grid-cols-[40px_1fr] gap-4 pb-4 last:pb-0">
                  {i < chapter.lessons.length - 1 && (
                    <span aria-hidden className={cn("absolute left-[19px] top-10 h-[calc(100%-40px)] w-0.5", l.done ? h.fill : "bg-line")} />
                  )}
                  <span
                    className={cn(
                      "z-10 grid size-10 place-items-center rounded-full border-2",
                      l.done ? `${h.fill} border-transparent text-white` : isNext ? `${h.ring} bg-surface ${h.text}` : "border-line bg-surface text-ink-3",
                    )}
                  >
                    {l.done ? <Check aria-hidden className="size-5" strokeWidth={3} /> : <K.icon aria-hidden className="size-4.5" />}
                    <span className="sr-only">{l.done ? "Completed" : isNext ? "Up next" : "Not started"}</span>
                  </span>
                  <div className={cn("rounded-lg border bg-surface p-4", isNext ? `border-2 ${h.ring} shadow-lift` : "border-line")}>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-ink-3">
                      <span className="inline-flex items-center gap-1">
                        <K.icon aria-hidden className="size-3.5" /> {K.label}
                      </span>
                      <span aria-hidden>·</span>
                      <span>{l.minutes} min</span>
                      {l.slug && <Tag hue="royal">Try it</Tag>}
                    </div>
                    <p className="mt-1 font-bold">
                      {href ? (
                        <Link href={href} className="hover:underline">
                          {l.title}
                        </Link>
                      ) : (
                        l.title
                      )}
                    </p>
                    {isNext && (
                      <ButtonLink href={href ?? "/lesson/perfect-squares-as-areas"} size="sm" className="mt-3">
                        Start lesson
                      </ButtonLink>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <aside className="space-y-6">
          <Card className="flex items-center gap-4 p-5">
            <ProgressRing value={chapter.progress} hue={subject.hue} size={72} stroke={8} label="Chapter progress" />
            <div>
              <p className="font-bold">
                {chapter.lessons.filter((l) => l.done).length} of {chapter.lessons.length} lessons
              </p>
              <p className="text-sm text-ink-3">{chapter.lessons.filter((l) => !l.done).reduce((n, l) => n + l.minutes, 0)} min left</p>
            </div>
          </Card>

          {quiz && (
            <Card className="p-5">
              <p className="flex items-center gap-2 font-bold">
                <Target aria-hidden className="size-5 text-coral-600" /> Chapter quiz
              </p>
              <p className="mt-1 text-sm text-ink-2">
                {quiz.questions.length} questions with explanations. Best score so far: <strong className="text-ink">5/6</strong>
              </p>
              <ButtonLink href={`/practice/${quiz.id}`} variant="accent" size="sm" className="mt-4">
                Take the quiz
              </ButtonLink>
            </Card>
          )}

          <div>
            <h2 className="eyebrow mb-3">Revise this chapter</h2>
            {chapterResources.length ? (
              <ul className="space-y-2">
                {chapterResources.map((r) => (
                  <li key={r.id} className="flex items-center gap-3 rounded-md border border-line bg-surface p-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-snug">{r.title}</p>
                      <p className="text-xs text-ink-3">
                        {r.kind} · {r.pages} pages
                      </p>
                    </div>
                    <DownloadButton label={r.title} compact />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-md border border-dashed border-line-strong p-4 text-sm text-ink-3">Notes for this chapter are being reviewed by our teachers and will appear here soon.</p>
            )}
          </div>
        </aside>
      </Container>
    </>
  );
}
