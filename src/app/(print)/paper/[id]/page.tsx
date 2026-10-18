import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrintBar } from "@/components/practice/PrintBar";
import { mocks } from "@/content/mocks";
import { loadMock } from "@/lib/mocks";

export function generateStaticParams() {
  return mocks.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `${mocks.find((m) => m.id === id)?.title ?? "Paper"} (printable)` };
}

export default async function PaperPrint({ params }: { params: Promise<{ id: string }> }) {
  const data = loadMock((await params).id);
  if (!data) notFound();
  const { def, sections } = data;
  let n = 0;
  return (
    <>
      <PrintBar pdf={`/papers/${def.id}.pdf`} />
      <article className="mx-auto max-w-3xl px-8 py-10 text-[15px] leading-relaxed text-ink">
        <header className="border-b-2 border-ink pb-4 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-ink-3">Kaksha practice paper · Class {def.grade}</p>
          <h1 className="mt-1 text-2xl font-extrabold">{def.title}</h1>
          <p className="mt-1 flex justify-between text-sm font-semibold">
            <span>Time allowed: {Math.floor(def.minutes / 60) ? `${def.minutes / 60} hours` : `${def.minutes} minutes`}</span>
            <span>Maximum marks: {def.marks}</span>
          </p>
        </header>
        <p className="mt-4 text-sm text-ink-2">{def.pattern}</p>
        {sections.map((s) => (
          <section key={s.title} className="mt-8">
            <h2 className="text-lg font-extrabold">{s.title}</h2>
            <p className="text-sm italic text-ink-3">{s.note}</p>
            <ol className="mt-3 space-y-4">
              {s.questions.map((q) => {
                n++;
                return (
                  <li key={n} className="break-inside-avoid">
                    <p className="whitespace-pre-line">
                      <strong>{n}.</strong> {q.prompt} <span className="float-right font-bold">[{q.kind === "written" ? q.marks : s.marksEach}]</span>
                    </p>
                    {q.kind === "mcq" && (
                      <ol className="mt-1 grid grid-cols-2 gap-x-6 pl-5 text-ink-2">
                        {q.options.map((o, k) => (
                          <li key={k}>
                            ({"abcd"[k]}) {o.text}
                          </li>
                        ))}
                      </ol>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
        <section className="mt-12 border-t-2 border-dashed border-ink-3 pt-6" style={{ breakBefore: "page" }}>
          <h2 className="text-lg font-extrabold">Answer key and marking points</h2>
          {(() => {
            let k = 0;
            return sections.map((s) =>
              s.questions.map((q) => {
                k++;
                return (
                  <p key={k} className="mt-2 whitespace-pre-line text-sm">
                    <strong>{k}.</strong> {q.kind === "mcq" ? `(${"abcd"[q.options.findIndex((o) => o.correct)]}) ${q.options.find((o) => o.correct)?.text ?? ""}` : q.answer}
                  </p>
                );
              }),
            );
          })()}
        </section>
      </article>
    </>
  );
}
