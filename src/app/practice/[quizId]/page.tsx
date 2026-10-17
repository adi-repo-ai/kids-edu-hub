import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizPlayer } from "@/components/features/QuizPlayer";
import { Container } from "@/components/layout/PageHeader";
import { SubjectIcon } from "@/components/ui/SubjectIcon";
import { subjectById } from "@/data/curriculum";
import { quizById, quizzes } from "@/data/practice";

export function generateStaticParams() {
  return quizzes.map((q) => ({ quizId: q.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ quizId: string }> }): Promise<Metadata> {
  const { quizId } = await params;
  return { title: quizById(quizId)?.title ?? "Quiz" };
}

export default async function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;
  const quiz = quizById(quizId);
  if (!quiz) notFound();
  const subject = subjectById(quiz.subject)!;
  return (
    <div className="dots bg-coral-50">
    <Container className="py-8 sm:py-12">
      <div className="mx-auto mb-8 flex max-w-3xl items-center gap-3">
        <SubjectIcon subject={quiz.subject} />
        <div>
          <p className="text-sm text-ink-3">{subject.name} · Practice quiz</p>
          <h1 className="text-2xl font-extrabold sm:text-3xl">{quiz.title}</h1>
        </div>
      </div>
      <QuizPlayer quiz={quiz} />
    </Container>
    </div>
  );
}
