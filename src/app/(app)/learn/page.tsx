import type { Metadata } from "next";
import Link from "next/link";
import { YourClassBadge } from "@/components/learn/ProgressBits";
import { PageTitle } from "@/components/layout/PageTitle";
import { SubjectIcon } from "@/components/ui/SubjectIcon";
import { chaptersOf, grades } from "@/lib/curriculum";
import { LearnRedirect } from "./LearnRedirect";

export const metadata: Metadata = { title: "Learn" };

const stageInfo: Record<string, string> = {
  Foundational: "Play-based learning: numbers, letters and stories",
  Preparatory: "Reading, numbers and the world around us",
  Middle: "New subjects and deeper thinking",
  Secondary: "Board-ready, chapter by chapter",
  "Senior Secondary": "Science, Commerce and Humanities streams",
};

export default function LearnPage() {
  const stages = [...new Set(grades.map((g) => g.stage))];
  return (
    <>
      <LearnRedirect />
      <PageTitle eyebrow="Classes 1 to 12" title="Choose a class" sub="Every subject and chapter in the CBSE syllabus, with concept lessons, quizzes and notes." />
      <div className="space-y-10">
        {stages.map((stage) => (
          <section key={stage} aria-labelledby={`st-${stage}`}>
            <div className="mb-4 flex items-baseline gap-3">
              <h2 id={`st-${stage}`} className="text-xl font-extrabold">
                {stage}
              </h2>
              <p className="text-sm text-ink-3">{stageInfo[stage]}</p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {grades
                .filter((g) => g.stage === stage)
                .map((g) => {
                  const chapters = g.subjects.reduce((n, s) => n + chaptersOf(s).length, 0);
                  return (
                    <li key={g.grade}>
                      <Link href={`/class/${g.grade}`} className="card card-hover flex h-full flex-col p-5">
                        <span className="flex items-center justify-between">
                          <span className="text-3xl font-extrabold">Class {g.grade}</span>
                          <YourClassBadge grade={g.grade} />
                        </span>
                        <span className="mt-1 text-sm text-ink-3">
                          {g.subjects.length} subjects · {chapters} {g.structure === "topics" ? "topics" : "chapters"}
                        </span>
                        <span className="mt-4 flex flex-wrap gap-1.5">
                          {g.subjects.map((s) => (
                            <SubjectIcon key={s.id} id={s.id} size="sm" />
                          ))}
                        </span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
