import { ArrowRight, Info, Lock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/Progress";
import { SubjectIcon } from "@/components/ui/SubjectIcon";
import { chaptersFor, grades, subjectProgress, subjects } from "@/data/curriculum";
import { hue } from "@/lib/hue";

export function generateStaticParams() {
  return grades.map((g) => ({ grade: String(g.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ grade: string }> }): Promise<Metadata> {
  const { grade } = await params;
  return { title: `Class ${grade}` };
}

export default async function ClassPage({ params }: { params: Promise<{ grade: string }> }) {
  const { grade: raw } = await params;
  const grade = grades.find((g) => String(g.id) === raw);
  if (!grade) notFound();

  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/#classes", label: "Classes" },
    { href: `/class/${grade.id}`, label: grade.label },
  ];

  if (!grade.available) {
    return (
      <>
        <PageHeader tone="sun" crumbs={crumbs} eyebrow={`${grade.stage} stage`} title={grade.label} description="Science, Commerce and Humanities streams are being written with subject teachers now." />
        <Container className="py-12">
          <Card className="flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center">
            <Lock aria-hidden className="size-8 text-lavender-600" />
            <div className="flex-1">
              <p className="text-lg font-bold">Launching for the 2027–28 session</p>
              <p className="text-ink-2">Subjects planned: {grade.subjects.join(", ")}.</p>
            </div>
            <ButtonLink href="/class/10" variant="secondary">
              Explore Class 10
            </ButtonLink>
          </Card>
        </Container>
      </>
    );
  }

  const isPreview = grade.id === 8;
  return (
    <>
      <PageHeader tone="sun" crumbs={crumbs} eyebrow={`${grade.stage} stage`} title={`${grade.label} subjects`} description={`This year: ${grade.focus.toLowerCase()}. Pick a subject to see its chapters.`} />
      <Container className="py-10">
        {!isPreview && (
          <p className="mb-6 flex items-start gap-2 rounded-md border border-royal-200 bg-royal-50 px-4 py-3 text-sm text-royal-800">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
            This design preview has full chapter content for Class 8. Other classes show their subject list and open the Class 8 sample.
          </p>
        )}
        {isPreview ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((s) => {
              const list = chaptersFor(s.id);
              const p = subjectProgress(s.id);
              return (
                <li key={s.id}>
                  <Link href={`/learn/${s.id}`} className="block h-full rounded-lg focus-visible:outline-offset-4">
                    <Card interactive data-reveal style={{ ["--i" as string]: subjects.indexOf(s) }} className={`flex h-full flex-col overflow-hidden ${hue[s.hue].soft}`}>
                      <div className={`h-3 border-b-[2.5px] border-ink ${hue[s.hue].fill}`} aria-hidden />
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-start gap-3">
                          <SubjectIcon subject={s.id} size="lg" />
                          <div>
                            <h2 className="text-xl font-bold">{s.name}</h2>
                            <p className="text-sm text-ink-3">{s.book}</p>
                          </div>
                        </div>
                        <p className="mt-4 flex-1 text-ink-2">{s.blurb}</p>
                        <div className="mt-5">
                          <div className="mb-1.5 flex justify-between text-sm">
                            <span className="font-semibold">{list.filter((c) => c.progress === 100).length} of {list.length} chapters done</span>
                            <span className="tabular-nums text-ink-3">{p}%</span>
                          </div>
                          <ProgressBar value={p} hue={s.hue} label={`${s.name} progress`} />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </li>
              );
            })}
            <li>
              <Card className="flex h-full flex-col justify-center border-dashed p-5 text-ink-2">
                <p className="font-bold text-ink">Sanskrit</p>
                <p className="mt-1 text-sm">Deepakam textbook lessons arrive in November.</p>
              </Card>
            </li>
          </ul>
        ) : (
          <ul className="sticker divide-y-2 divide-ink/10 overflow-hidden bg-surface">
            {grade.subjects.map((name) => {
              const match = subjects.find((s) => s.name === name);
              return (
                <li key={name}>
                  <Link href={match ? `/learn/${match.id}` : "/class/8"} className="group flex items-center gap-4 px-5 py-4 hover:bg-paper">
                    {match ? <SubjectIcon subject={match.id} /> : <span className="grid size-10 place-items-center rounded-md bg-sunken font-bold text-ink-2">{name[0]}</span>}
                    <span className="flex-1 text-lg font-semibold">{name}</span>
                    <ArrowRight aria-hidden className="size-5 text-ink-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </>
  );
}
