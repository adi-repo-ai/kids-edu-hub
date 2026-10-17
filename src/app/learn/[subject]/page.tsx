import { ArrowRight, Clock, Target } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookmarkButton } from "@/components/features/BookmarkButton";
import { ChapterStatus } from "@/components/features/ChapterStatus";
import { DownloadButton } from "@/components/features/DownloadButton";
import { Container, PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar, ProgressRing } from "@/components/ui/Progress";
import { SubjectIcon } from "@/components/ui/SubjectIcon";
import { chaptersFor, subjectById, subjectProgress, subjects } from "@/data/curriculum";
import { resources } from "@/data/library";
import { quizzes } from "@/data/practice";
import { cn } from "@/lib/cn";
import { hue } from "@/lib/hue";

export function generateStaticParams() {
  return subjects.map((s) => ({ subject: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }): Promise<Metadata> {
  const { subject } = await params;
  return { title: `${subjectById(subject)?.name ?? "Subject"} · Class 8` };
}

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: id } = await params;
  const subject = subjectById(id);
  if (!subject) notFound();

  const list = chaptersFor(subject.id);
  const progress = subjectProgress(subject.id);
  const upNext = list.find((c) => c.progress > 0 && c.progress < 100) ?? list.find((c) => c.progress < 100);
  const subjectResources = resources.filter((r) => r.subject === subject.id).slice(0, 3);
  const quiz = quizzes.find((q) => q.subject === subject.id);

  return (
    <>
      <PageHeader
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/class/8", label: "Class 8" },
          { href: `/learn/${subject.id}`, label: subject.name },
        ]}
        title={
          <span className="flex items-center gap-4">
            <SubjectIcon subject={subject.id} size="lg" />
            {subject.name}
          </span>
        }
        description={
          <>
            Textbook: <strong className="text-ink">{subject.book}</strong> · {list.length} chapters in this preview
          </>
        }
        actions={
          <div className="flex items-center gap-4 rounded-lg border border-line bg-paper px-4 py-3">
            <ProgressRing value={progress} hue={subject.hue} label={`${subject.name} complete`} />
            <div>
              <p className="text-sm font-bold">Overall progress</p>
              <p className="text-sm text-ink-3">{list.filter((c) => c.progress === 100).length} chapters completed</p>
            </div>
          </div>
        }
      />

      <Container className="grid gap-10 py-10 lg:grid-cols-[1fr_320px] [&>*]:min-w-0">
        <section aria-labelledby="chapters-title">
          <h2 id="chapters-title" className="sr-only">
            Chapters
          </h2>
          <ol className="space-y-3">
            {list.map((c) => {
              const current = c.id === upNext?.id;
              return (
                <li key={c.id}>
                  <Card interactive className={cn("relative flex items-stretch gap-4 p-4 sm:p-5", current && `border-2 ${hue[subject.hue].ring}`)}>
                    <span
                      className={cn(
                        "grid w-12 shrink-0 place-items-center self-start rounded-md py-2 font-display text-2xl font-extrabold",
                        c.progress === 100 ? `${hue[subject.hue].chip}` : "bg-sunken text-ink-2",
                      )}
                    >
                      {c.number}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <ChapterStatus progress={c.progress} />
                        {current && <span className="text-xs font-bold uppercase tracking-wide text-coral-700">Up next</span>}
                      </div>
                      <h3 className="mt-1.5 text-lg font-bold leading-snug">
                        <Link href={`/learn/${subject.id}/${c.id}`} className="after:absolute after:inset-0 hover:underline">
                          {c.title}
                        </Link>
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-ink-2">{c.summary}</p>
                      <div className="mt-3 flex items-center gap-4">
                        <ProgressBar value={c.progress} hue={subject.hue} size="sm" label={`${c.title} progress`} className="max-w-xs flex-1" showValue />
                        <span className="hidden items-center gap-1 text-xs text-ink-3 sm:flex">
                          <Clock aria-hidden className="size-3.5" />
                          {c.lessons.reduce((n, l) => n + l.minutes, 0)} min · {c.lessons.length} lessons
                        </span>
                      </div>
                    </div>
                    <div className="relative z-10 self-start">
                      <BookmarkButton item={{ id: `chapter:${c.id}`, kind: "chapter", title: c.title, meta: `${subject.name} · Ch ${c.number}`, href: `/learn/${subject.id}/${c.id}` }} />
                    </div>
                  </Card>
                </li>
              );
            })}
          </ol>
        </section>

        <aside className="space-y-6">
          {upNext && (
            <Card className={cn("p-5", hue[subject.hue].soft)}>
              <p className="eyebrow">Continue</p>
              <p className="mt-1 text-lg font-bold">{upNext.title}</p>
              <p className="mt-1 text-sm text-ink-2">{upNext.lessons.find((l) => !l.done)?.title ?? "Review the chapter"}</p>
              <ButtonLink href={`/learn/${subject.id}/${upNext.id}`} className="mt-4 w-full" iconRight={<ArrowRight className="size-4" aria-hidden />}>
                Resume chapter
              </ButtonLink>
            </Card>
          )}
          {quiz && (
            <Card className="p-5">
              <p className="flex items-center gap-2 font-bold">
                <Target aria-hidden className="size-5 text-coral-600" />
                Quick check
              </p>
              <p className="mt-1 text-sm text-ink-2">
                {quiz.title} · {quiz.questions.length} questions · {quiz.minutes} min
              </p>
              <ButtonLink href={`/practice/${quiz.id}`} variant="secondary" size="sm" className="mt-4">
                Start quiz
              </ButtonLink>
            </Card>
          )}
          {subjectResources.length > 0 && (
            <div>
              <h2 className="eyebrow mb-3">Notes & worksheets</h2>
              <ul className="space-y-2">
                {subjectResources.map((r) => (
                  <li key={r.id} className="flex items-center gap-3 rounded-md border border-line bg-surface p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{r.title}</p>
                      <p className="text-xs text-ink-3">
                        {r.kind} · {r.pages} pp
                      </p>
                    </div>
                    <DownloadButton label={r.title} compact />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </Container>
    </>
  );
}
