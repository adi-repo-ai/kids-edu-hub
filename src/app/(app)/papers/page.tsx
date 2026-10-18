import { ClipboardCheck, Download, ExternalLink, FileText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/layout/PageTitle";
import { SubjectIcon } from "@/components/ui/SubjectIcon";
import { mocks } from "@/content/mocks";

export const metadata: Metadata = { title: "Past papers" };

const official = [
  {
    title: "Previous year board question papers",
    body: "Class 10 and 12 board papers for every subject, published by CBSE year by year.",
    href: "https://www.cbse.gov.in/cbsenew/question-paper.html",
    site: "cbse.gov.in",
  },
  {
    title: "Sample question papers & marking schemes",
    body: "The official sample papers CBSE releases for the current session, with marking schemes.",
    href: "https://cbseacademic.nic.in/",
    site: "cbseacademic.nic.in → Sample Question Papers",
  },
  {
    title: "Syllabus and curriculum",
    body: "The current CBSE curriculum documents for Classes 9–12, subject by subject.",
    href: "https://cbseacademic.nic.in/",
    site: "cbseacademic.nic.in → Curriculum",
  },
  {
    title: "NCERT textbooks (free PDFs)",
    body: "Every NCERT textbook from Class 1 to 12, chapter by chapter.",
    href: "https://ncert.nic.in/textbook.php",
    site: "ncert.nic.in",
  },
];

const boardSubjects10 = [
  ["Mathematics Standard (041)", "maths"],
  ["Mathematics Basic (241)", "maths"],
  ["Science (086)", "science"],
  ["Social Science (087)", "social-science"],
  ["English Language & Literature (184)", "english"],
  ["Hindi Course A (002)", "hindi"],
];

export default function PapersPage() {
  return (
    <>
      <PageTitle eyebrow="Board exam preparation" title="Past papers" sub="Official CBSE papers open on the CBSE website. Our full-length practice papers can be taken online or downloaded as PDFs with answer keys." />

      <section aria-labelledby="ours" className="mb-10">
        <h2 id="ours" className="mb-4 text-xl font-extrabold">
          Kaksha practice papers
        </h2>
        <ul className="grid gap-3 md:grid-cols-2">
          {mocks.map((m) => (
            <li key={m.id} className="card flex items-center gap-4 p-4">
              <SubjectIcon id={m.subject} solid />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{m.title}</p>
                <p className="text-xs font-semibold text-ink-3">
                  Class {m.grade} · {m.marks} marks · {m.minutes} min · answer key included
                </p>
              </div>
              <Link href={`/mock/${m.id}`} className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-bold text-brand-700 hover:bg-brand-50" aria-label={`Take ${m.title} online`}>
                <ClipboardCheck aria-hidden className="size-4" /> Take
              </Link>
              <a href={`/papers/${m.id}.pdf`} download className="inline-flex h-10 items-center gap-1.5 rounded-xl border-b-4 border-green-700 bg-green-500 px-3 text-sm font-bold text-white hover:bg-green-400" aria-label={`Download ${m.title} PDF`}>
                <Download aria-hidden className="size-4" /> PDF
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="official" className="mb-10">
        <h2 id="official" className="mb-4 text-xl font-extrabold">
          Official CBSE & NCERT resources
        </h2>
        <ul className="grid gap-3 md:grid-cols-2">
          {official.map((o) => (
            <li key={o.title}>
              <a href={o.href} target="_blank" rel="noreferrer" className="card card-hover flex h-full gap-4 p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700">
                  <FileText aria-hidden className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 font-extrabold">
                    {o.title} <ExternalLink aria-hidden className="size-4 text-ink-3" />
                  </span>
                  <span className="mt-1 block text-sm text-ink-2">{o.body}</span>
                  <span className="mt-2 block text-xs font-bold text-ink-3">Opens {o.site}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how" className="card p-6">
        <h2 id="how" className="text-lg font-extrabold">
          Finding a specific board paper on cbse.gov.in
        </h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-ink-2">
          <li>Open “Previous year board question papers” above.</li>
          <li>Choose the year (for example 2025), then Class X or Class XII.</li>
          <li>Download the subject file. Papers come in several sets (for example 30/1/1), all at the same level.</li>
          <li>Time yourself: 3 hours for 80-mark papers. Then check against the marking scheme.</li>
        </ol>
        <p className="mt-4 text-sm font-semibold text-ink-3">Class 10 subjects with board papers:</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {boardSubjects10.map(([n, id]) => (
            <li key={n} className="flex items-center gap-2 rounded-full bg-surface-2 py-1 pl-1 pr-3 text-sm font-semibold">
              <SubjectIcon id={id} size="sm" /> {n}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
