import { ArrowRight, Clock, FileCheck2, Flame, ListChecks, Target } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/Progress";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SubjectIcon } from "@/components/ui/SubjectIcon";
import { Tag } from "@/components/ui/Tag";
import { chapterById, subjectById } from "@/data/curriculum";
import { mockExams, quizzes } from "@/data/practice";
import { student } from "@/data/student";

export const metadata: Metadata = { title: "Practice & mock exams" };

const weakSpots = [
  { topic: "Cube roots by estimation", subject: "maths" as const, accuracy: 48 },
  { topic: "Latent heat and change of state", subject: "science" as const, accuracy: 55 },
  { topic: "Maratha administration terms", subject: "social" as const, accuracy: 60 },
];

// Every runner in this preview uses the quiz player; subjects without a quiz fall back to Maths.
const quizFor = (subject: string) => `/practice/${(quizzes.find((q) => q.subject === subject) ?? quizzes[0]).id}`;

export default function PracticePage() {
  return (
    <>
      <PageHeader
        eyebrow={`Half-yearly exams in ${student.exam.daysLeft} days`}
        title="Practice & mock exams"
        description="Short quizzes for every chapter, full-length mocks in the CBSE paper pattern, and a list of the topics you keep missing."
        actions={
          <div className="flex items-center gap-3 rounded-lg border border-coral-200 bg-coral-50 px-4 py-3">
            <Flame aria-hidden className="size-6 text-coral-600" />
            <div>
              <p className="font-bold">{student.streak}-day streak</p>
              <p className="text-sm text-ink-2">One quiz today keeps it going</p>
            </div>
          </div>
        }
      />

      <Container className="space-y-14 py-10">
        <section aria-labelledby="quick-title">
          <SectionHeading id="quick-title" eyebrow="5–10 minutes" title="Quick quizzes" />
          <ul className="grid gap-4 md:grid-cols-2">
            {quizzes.map((q) => {
              const s = subjectById(q.subject)!;
              const ch = chapterById(q.chapterId);
              return (
                <li key={q.id}>
                  <Card interactive className="relative flex h-full gap-4 p-5">
                    <SubjectIcon subject={q.subject} size="lg" />
                    <div className="flex-1">
                      <p className="text-sm text-ink-3">
                        {s.name} · {ch?.title}
                      </p>
                      <h3 className="mt-0.5 text-lg font-bold">
                        <Link href={`/practice/${q.id}`} className="after:absolute after:inset-0">
                          {q.title}
                        </Link>
                      </h3>
                      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-2">
                        <span className="inline-flex items-center gap-1">
                          <ListChecks aria-hidden className="size-4" /> {q.questions.length} questions
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock aria-hidden className="size-4" /> {q.minutes} min
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Target aria-hidden className="size-4" /> Instant feedback
                        </span>
                      </p>
                    </div>
                    <ArrowRight aria-hidden className="size-5 self-center text-ink-3" />
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="mock-title">
          <SectionHeading id="mock-title" eyebrow="Exam conditions" title="Mock exams" />
          <div className="overflow-hidden rounded-lg border border-line bg-surface">
            <table className="w-full text-left">
              <caption className="sr-only">Full-length mock exams</caption>
              <thead className="hidden border-b border-line bg-paper text-xs font-bold uppercase tracking-wide text-ink-3 md:table-header-group">
                <tr>
                  <th scope="col" className="px-5 py-3">Paper</th>
                  <th scope="col" className="px-5 py-3">Format</th>
                  <th scope="col" className="px-5 py-3">Your best</th>
                  <th scope="col" className="px-5 py-3"><span className="sr-only">Action</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {mockExams.map((m) => (
                  <tr key={m.id} className="grid grid-cols-[1fr_auto] gap-2 px-4 py-4 md:table-row md:px-0">
                    <td className="md:px-5 md:py-4">
                      <div className="flex items-center gap-3">
                        <SubjectIcon subject={m.subject} size="sm" />
                        <span className="font-semibold">{m.title}</span>
                      </div>
                    </td>
                    <td className="col-span-2 row-start-2 text-sm text-ink-2 md:px-5 md:py-4">
                      {m.marks} marks · {m.minutes / 60} hours · {m.sections}
                    </td>
                    <td className="col-span-2 row-start-3 md:px-5 md:py-4">
                      {m.attempted ? (
                        <div className="flex max-w-[220px] items-center gap-3">
                          <ProgressBar value={Math.round((m.attempted.score / m.marks) * 100)} hue="mint" size="sm" label={`${m.title} best score`} className="flex-1" />
                          <span className="text-sm font-semibold tabular-nums">
                            {m.attempted.score}/{m.marks}
                          </span>
                        </div>
                      ) : (
                        <Tag>Not attempted</Tag>
                      )}
                    </td>
                    <td className="row-start-1 text-right md:px-5 md:py-4">
                      <ButtonLink href={quizFor(m.subject)} size="sm" variant={m.attempted ? "secondary" : "primary"}>
                        {m.attempted ? "Retake" : "Start"}
                      </ButtonLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 flex items-center gap-2 text-sm text-ink-3">
            <FileCheck2 aria-hidden className="size-4" /> Mocks are auto-marked for objective sections. Long answers are scored against the CBSE marking scheme.
          </p>
        </section>

        <section aria-labelledby="weak-title">
          <SectionHeading id="weak-title" eyebrow="From your last 20 quizzes" title="Topics to revisit" />
          <ul className="grid gap-4 md:grid-cols-3">
            {weakSpots.map((w) => (
              <li key={w.topic}>
                <Card className="h-full p-5">
                  <div className="flex items-center gap-2">
                    <SubjectIcon subject={w.subject} size="sm" />
                    <span className="text-sm text-ink-3">{subjectById(w.subject)!.name}</span>
                  </div>
                  <p className="mt-3 font-bold">{w.topic}</p>
                  <div className="mt-3 flex items-center gap-3 text-sm">
                    <ProgressBar value={w.accuracy} hue="coral" size="sm" label={`${w.topic} accuracy`} className="flex-1" />
                    <span className="font-semibold tabular-nums text-coral-700">{w.accuracy}%</span>
                  </div>
                  <ButtonLink href={quizFor(w.subject)} variant="ghost" size="sm" className="-ml-3 mt-3 text-royal-700">
                    Practise 5 questions →
                  </ButtonLink>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
