import { ExternalLink, Info } from "lucide-react";
import type { Metadata } from "next";
import { PageTitle } from "@/components/layout/PageTitle";

export const metadata: Metadata = { title: "CBSE news" };

const links = [
  { t: "CBSE official website", d: "Circulars, notices, date sheets and results", h: "https://www.cbse.gov.in" },
  { t: "CBSE Academic", d: "Curriculum, sample question papers and teacher resources", h: "https://cbseacademic.nic.in" },
  { t: "CBSE results", d: "Board exam results (opens during results season)", h: "https://results.cbse.nic.in" },
  { t: "NCERT", d: "Textbooks and supplementary material", h: "https://ncert.nic.in" },
  { t: "DigiLocker", d: "Digital marksheets and certificates", h: "https://www.digilocker.gov.in" },
];

const tips = [
  { t: "Class 10: two board exams", d: "From 2026, Class 10 students take a main board exam in February and can optionally appear again in May to improve scores. Check the latest circular on cbse.gov.in for the current session's dates." },
  { t: "Sample papers come first", d: "CBSE usually releases sample question papers and marking schemes for the next board exams early in the session. They show the exact paper pattern." },
  { t: "Read the marking scheme", d: "Board answers are marked step by step. Showing working earns marks even when the final answer slips." },
];

export default function NewsPage() {
  return (
    <>
      <PageTitle eyebrow="Stay informed" title="CBSE news & official links" sub="The official sources for every notice, plus what students should know this session." />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section aria-labelledby="know" className="space-y-3">
          <h2 id="know" className="text-xl font-extrabold">
            Good to know
          </h2>
          {tips.map((x) => (
            <article key={x.t} className="card p-5">
              <h3 className="font-extrabold">{x.t}</h3>
              <p className="mt-1 text-ink-2">{x.d}</p>
            </article>
          ))}
          <p className="flex items-start gap-2 rounded-xl bg-amber-50 p-4 text-sm text-ink-2">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-600" /> Dates and rules change every session. Always confirm on the official CBSE website before an exam.
          </p>
        </section>
        <section aria-labelledby="off">
          <h2 id="off" className="mb-3 text-xl font-extrabold">
            Official websites
          </h2>
          <ul className="card divide-y divide-line">
            {links.map((l) => (
              <li key={l.h}>
                <a href={l.h} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 hover:bg-surface-2">
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{l.t}</span>
                    <span className="text-sm text-ink-3">{l.d}</span>
                  </span>
                  <ExternalLink aria-hidden className="size-4 text-ink-3" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
