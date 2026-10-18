import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Crumbs, PageTitle } from "@/components/layout/PageTitle";
import { MockRunner } from "@/components/practice/MockRunner";
import { mocks } from "@/content/mocks";
import { loadMock } from "@/lib/mocks";

export function generateStaticParams() {
  return mocks.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: mocks.find((m) => m.id === id)?.title ?? "Mock test" };
}

export default async function MockPage({ params }: { params: Promise<{ id: string }> }) {
  const data = loadMock((await params).id);
  if (!data) notFound();
  const { def, sections } = data;
  return (
    <>
      <Crumbs items={[{ href: "/mock", label: "Mock tests" }, { href: `/mock/${def.id}`, label: def.title }]} />
      <PageTitle eyebrow={`Class ${def.grade} · ${def.marks} marks · ${def.minutes} minutes`} title={def.title} />
      <MockRunner id={def.id} title={def.title} minutes={def.minutes} marks={def.marks} sections={sections} pattern={def.pattern} />
    </>
  );
}
