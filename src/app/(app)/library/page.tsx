import type { Metadata } from "next";
import { Suspense } from "react";
import { PageTitle } from "@/components/layout/PageTitle";
import { LibraryBrowser, type LibItem } from "@/components/practice/LibraryBrowser";
import { mocks } from "@/content/mocks";
import { allChapters, getSubject } from "@/lib/curriculum";
import { hasLesson } from "@/lib/lessons";

export const metadata: Metadata = { title: "Notes & downloads" };

export default function LibraryPage() {
  const notes: LibItem[] = allChapters()
    .filter((c) => hasLesson(c.grade, c.subject.id, c.chapter.id))
    .map((c) => ({
      kind: "notes",
      grade: c.grade,
      subject: c.subject.id,
      subjectName: c.subject.name,
      title: c.chapter.title,
      pdf: `/notes/${c.grade}-${c.subject.id}-${c.chapter.id}.pdf`,
      view: `/notes/${c.grade}/${c.subject.id}/${c.chapter.id}`,
    }));
  const papers: LibItem[] = mocks.map((m) => ({
    kind: "paper",
    grade: m.grade,
    subject: m.subject,
    subjectName: getSubject(m.grade, m.subject)?.name ?? m.subject,
    title: `${m.title} (with answer key)`,
    pdf: `/papers/${m.id}.pdf`,
    view: `/paper/${m.id}`,
  }));
  return (
    <>
      <PageTitle eyebrow="Downloads" title="Notes & practice papers" sub="Printable PDF notes for every concept lesson, and full practice papers with answer keys. Free to download and print." />
      <Suspense>
        <LibraryBrowser items={[...papers, ...notes]} />
      </Suspense>
    </>
  );
}
