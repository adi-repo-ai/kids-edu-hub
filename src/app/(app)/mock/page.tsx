import { ArrowRight, ClipboardCheck, Clock, Download } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/layout/PageTitle";
import { MockBest } from "@/components/practice/MockBest";
import { SubjectIcon } from "@/components/ui/SubjectIcon";
import { mocks } from "@/content/mocks";
import { loadMock } from "@/lib/mocks";
import { asset } from "@/lib/asset";

export const metadata: Metadata = { title: "Mock tests" };

export default function MockList() {
  const byGrade = [...new Set(mocks.map((m) => m.grade))].sort((a, b) => b - a);
  return (
    <>
      <PageTitle eyebrow="Exam practice" title="Mock tests" sub="Full-length, timed papers in the CBSE pattern. Multiple-choice questions are marked instantly; written answers come with model answers for self-marking." />
      {byGrade.map((g) => (
        <section key={g} className="mb-10" aria-labelledby={`mg-${g}`}>
          <h2 id={`mg-${g}`} className="mb-4 text-xl font-extrabold">
            Class {g}
          </h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {mocks
              .filter((m) => m.grade === g)
              .map((m) => {
                const qs = loadMock(m.id)?.sections.reduce((n, s) => n + s.questions.length, 0) ?? 0;
                return (
                  <li key={m.id} className="card flex flex-col p-5">
                    <div className="flex items-start gap-4">
                      <SubjectIcon id={m.subject} size="lg" solid />
                      <div className="min-w-0 flex-1">
                        <p className="text-lg font-extrabold leading-tight">{m.title}</p>
                        <p className="mt-1 flex flex-wrap gap-x-3 text-sm text-ink-3">
                          <span>{m.marks} marks</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock aria-hidden className="size-3.5" /> {m.minutes} min
                          </span>
                          <span>{qs} questions</span>
                        </p>
                        <div className="mt-2">
                          <MockBest id={m.id} />
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Link href={`/mock/${m.id}`} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border-b-4 border-brand-700 bg-brand-500 px-4 font-bold text-white hover:bg-brand-400">
                        <ClipboardCheck aria-hidden className="size-5" /> Take test
                      </Link>
                      <a href={asset(`/papers/${m.id}.pdf`)} download className="inline-flex h-11 items-center gap-2 rounded-xl border-2 border-b-4 border-line-strong bg-surface px-4 font-bold hover:bg-surface-2">
                        <Download aria-hidden className="size-5" /> PDF
                      </a>
                    </div>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
      <Link href="/papers" className="card card-hover flex items-center justify-between p-5">
        <span>
          <span className="block font-extrabold">Looking for official CBSE papers?</span>
          <span className="text-sm text-ink-3">Previous year board papers and sample papers with marking schemes.</span>
        </span>
        <ArrowRight aria-hidden className="size-5 text-ink-3" />
      </Link>
    </>
  );
}
