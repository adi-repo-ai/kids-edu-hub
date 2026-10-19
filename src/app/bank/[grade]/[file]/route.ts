import { allChapters, chaptersOf, getGrade } from "@/lib/curriculum";
import { getCards, getLesson } from "@/lib/lessons";

/*
 * Question bank per class and subject, served as static JSON at /bank/<grade>/<subject>.json.
 * Built at build time from the lesson files, so client features (flashcards, test builder,
 * daily challenge, battles, mistake retries) work on a static host.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  const seen = new Set<string>();
  for (const c of allChapters()) if (getLesson(c.grade, c.subject.id, c.chapter.id)) seen.add(`${c.grade}|${c.subject.id}`);
  return [...seen].map((k) => {
    const [grade, subject] = k.split("|");
    return { grade, file: `${subject}.json` };
  });
}

export async function GET(_: Request, { params }: { params: Promise<{ grade: string; file: string }> }) {
  const { grade, file } = await params;
  const subjectId = file.replace(/\.json$/, "");
  const subject = getGrade(grade)?.subjects.find((s) => s.id === subjectId);
  if (!subject) return new Response("Not found", { status: 404 });
  const chapters = chaptersOf(subject).flatMap((ch) => {
    const lesson = getLesson(grade, subject.id, ch.id);
    if (!lesson) return [];
    return [
      {
        id: ch.id,
        title: ch.title,
        mcq: lesson.quiz.flatMap((q) =>
          q.kind === "mcq" ? [{ q: q.prompt, options: q.options.map((o) => o.text), answer: q.options.findIndex((o) => o.correct), explanation: q.explanation ?? "" }] : [],
        ),
        written: lesson.quiz.flatMap((q) => (q.kind === "written" ? [{ q: q.prompt, answer: q.answer, marks: q.marks }] : [])),
        cards: getCards(grade, subject.id, ch.id),
      },
    ];
  });
  return Response.json({ grade: Number(grade), subject: subject.id, name: subject.name, chapters });
}
