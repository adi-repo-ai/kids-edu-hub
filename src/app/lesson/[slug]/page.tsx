import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/features/LessonPlayer";

const lessons = { "perfect-squares-as-areas": "Perfect squares as areas" } as const;

export function generateStaticParams() {
  return Object.keys(lessons).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: lessons[slug as keyof typeof lessons] ?? "Lesson" };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in lessons)) notFound();
  return (
    <>
      <h1 className="sr-only">Lesson: Perfect squares as areas</h1>
      <LessonPlayer />
    </>
  );
}
