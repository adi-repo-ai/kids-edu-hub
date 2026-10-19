import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Crumbs } from "@/components/layout/PageTitle";
import { chapterHref, chaptersOf, getGrade, getSubject, grades } from "@/lib/curriculum";
import { getCallouts, sheetKindOf, sheetTypes, subjectHasLessons } from "@/lib/lessons";
import { FormulaSheet, type SheetChapter } from "./FormulaSheet";

type P = { grade: string; subject: string };

export function generateStaticParams() {
  return grades.flatMap((g) => g.subjects.filter((s) => subjectHasLessons(g.grade, s.id)).map((s) => ({ grade: String(g.grade), subject: s.id })));
}

export async function generateMetadata({ params }: { params: Promise<P> }): Promise<Metadata> {
  const { grade, subject } = await params;
  const s = getSubject(grade, subject);
  return { title: s ? `${sheetKindOf(subject) === "formula" ? "Formula sheet" : "Key facts"} · ${s.name} Class ${grade}` : "Formula sheet" };
}

export default async function FormulasPage({ params }: { params: Promise<P> }) {
  const { grade: g, subject: s } = await params;
  const grade = getGrade(g);
  const subject = getSubject(g, s);
  if (!grade || !subject || !subjectHasLessons(grade.grade, subject.id)) notFound();

  const collect = (types: string[]): SheetChapter[] =>
    chaptersOf(subject)
      .map((ch) => ({
        id: ch.id,
        title: ch.title,
        href: chapterHref(grade.grade, subject.id, ch.id),
        items: getCallouts(grade.grade, subject.id, ch.id)
          .filter((c) => types.includes(c.type))
          .map((c) => ({ type: c.type, title: c.title, body: c.body })),
      }))
      .filter((ch) => ch.items.length > 0);

  let kind = sheetKindOf(subject.id);
  let chapters = collect(sheetTypes(kind));
  // A formula subject without any formula boxes yet still gets a useful key-facts sheet.
  if (kind === "formula" && chapters.length === 0) {
    kind = "facts";
    chapters = collect(sheetTypes(kind));
  }
  const base = `/class/${grade.grade}/${subject.id}`;

  return (
    <>
      <div className="no-print">
        <Crumbs
          items={[
            { href: "/learn", label: "Learn" },
            { href: `/class/${grade.grade}`, label: `Class ${grade.grade}` },
            { href: base, label: subject.name },
            { href: `${base}/formulas`, label: kind === "formula" ? "Formula sheet" : "Key facts" },
          ]}
        />
      </div>
      <FormulaSheet
        grade={grade.grade}
        subjectId={subject.id}
        subjectName={subject.name}
        kind={kind}
        chapters={chapters}
        subjectHref={base}
        hindi={subject.id === "hindi" || subject.id === "sanskrit"}
      />
    </>
  );
}
