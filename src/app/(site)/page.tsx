import { ArrowRight, BookOpenCheck, Check, ClipboardCheck, Download, FileText, Flame, LineChart, Map, Sparkles, Star, Target, Zap } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { SearchBox } from "@/components/layout/SearchBox";
import { ButtonLink } from "@/components/ui/Button";
import { Mascot } from "@/components/ui/Mascot";
import { SubjectIcon } from "@/components/ui/SubjectIcon";
import { allChapters, grades } from "@/lib/curriculum";
import { getLesson } from "@/lib/lessons";

function stats() {
  const chapters = allChapters();
  let lessons = 0;
  let questions = 0;
  for (const c of chapters) {
    const l = getLesson(c.grade, c.subject.id, c.chapter.id);
    if (l) {
      lessons++;
      questions += l.quiz.length;
    }
  }
  const subjects = new Set(grades.flatMap((g) => g.subjects.map((s) => s.id))).size;
  return { chapters: chapters.length, lessons, questions, subjects };
}

const features = [
  { icon: BookOpenCheck, color: "bg-brand-500", title: "Concept lessons", body: "Every idea explained step by step with worked examples, formula boxes and common mistakes, so you don't need other sites." },
  { icon: Map, color: "bg-green-500", title: "A learning path for every subject", body: "Chapters laid out like a game. Finish lessons, earn stars on quizzes and keep your streak alive." },
  { icon: ClipboardCheck, color: "bg-violet-500", title: "Full mock tests", body: "Timed papers in the CBSE board pattern with a question palette, instant marking and model answers." },
  { icon: FileText, color: "bg-amber-500", title: "Past papers & notes", body: "Board and sample papers from CBSE, plus printable PDF notes for every lesson." },
];

export default function Landing() {
  const st = stats();
  return (
    <div className="bg-surface">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {[
              ["Classes", "/learn"],
              ["Mock tests", "/mock"],
              ["Past papers", "/papers"],
              ["Notes", "/library"],
              ["Parents", "/parent"],
            ].map(([l, h]) => (
              <Link key={h} href={h} className="rounded-lg px-3 py-2 text-[15px] font-bold text-ink-2 hover:bg-surface-2 hover:text-ink">
                {l}
              </Link>
            ))}
          </nav>
          <ButtonLink href="/dashboard" size="sm" className="ml-auto">
            Start learning
          </ButtonLink>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-surface">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-20">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-sm font-bold text-brand-700 shadow-card">
                <Sparkles aria-hidden className="size-4" /> Free for every CBSE student
              </p>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] sm:text-6xl">
                Everything you need for CBSE, <span className="text-brand-500">Class 1 to 12</span>.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-ink-2">
                Clear concept lessons for every topic, a game-like learning path, chapter quizzes, full mock tests and past papers, all in one place.
              </p>
              <SearchBox large className="mt-8 max-w-xl" />
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <ButtonLink href="/dashboard" size="lg" iconRight={<ArrowRight className="size-5" aria-hidden />}>
                  Start learning free
                </ButtonLink>
                <ButtonLink href="/class/10/maths/real-numbers" size="lg" variant="secondary">
                  See a sample lesson
                </ButtonLink>
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-ink-2">
                {["No sign-up needed", "Progress saves automatically", "English & हिंदी"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check aria-hidden className="size-4 text-green-600" strokeWidth={3} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* App preview */}
            <div className="relative mx-auto w-full max-w-sm" aria-hidden>
              <div className="rounded-[2rem] border-8 border-ink bg-canvas p-4 shadow-float">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold">Class 10 · Maths</span>
                  <span className="flex items-center gap-2 text-sm font-extrabold">
                    <span className="flex items-center gap-0.5 text-coral-600">
                      <Flame className="size-4 fill-coral-500" />7
                    </span>
                    <span className="flex items-center gap-0.5 text-amber-600">
                      <Zap className="size-4 fill-amber-400" />
                      640
                    </span>
                  </span>
                </div>
                <div className="mt-3 rounded-2xl bg-brand-500 px-4 py-3 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Unit 1</p>
                  <p className="font-extrabold">Number systems & algebra</p>
                </div>
                <div className="mt-6 flex flex-col items-center gap-5 pb-2">
                  {[
                    { x: 0, s: "done" },
                    { x: 44, s: "done" },
                    { x: 64, s: "current" },
                    { x: 32, s: "todo" },
                    { x: -24, s: "todo" },
                  ].map((n, i) => (
                    <div key={i} className="flex flex-col items-center" style={{ transform: `translateX(${n.x}px)` }}>
                      <span
                        className={
                          n.s === "done"
                            ? "grid size-14 place-items-center rounded-full border-b-[5px] border-green-700 bg-green-500 text-white"
                            : n.s === "current"
                              ? "animate-pulse-ring grid size-14 place-items-center rounded-full border-b-[5px] border-brand-700 bg-brand-500 text-white"
                              : "grid size-14 place-items-center rounded-full border-b-[5px] border-line-strong bg-surface-2 text-ink-3"
                        }
                      >
                        {n.s === "done" ? <Check className="size-7" strokeWidth={3.5} /> : <Star className={n.s === "current" ? "size-6 fill-white" : "size-6"} />}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <Mascot mood="wave" size={110} className="absolute -bottom-8 -left-10" />
            </div>
          </div>
        </section>

        {/* Numbers */}
        <section aria-label="What's inside" className="border-y border-line">
          <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-5">
            {[
              ["12", "classes"],
              [String(st.subjects), "subjects"],
              [st.chapters.toLocaleString("en-IN"), "chapters & topics"],
              [String(st.lessons), "concept lessons"],
              [st.questions.toLocaleString("en-IN"), "quiz questions"],
            ].map(([n, l]) => (
              <div key={l} className="text-center">
                <dt className="text-3xl font-extrabold text-brand-600 sm:text-4xl">{n}</dt>
                <dd className="mt-1 text-sm font-semibold text-ink-3">{l}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Classes */}
        <section aria-labelledby="classes" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 id="classes" className="text-3xl font-extrabold sm:text-4xl">
            Pick your class
          </h2>
          <p className="mt-2 text-ink-2">Every subject and chapter in the CBSE syllabus, organised the way you study it.</p>
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {grades.map((g) => (
              <li key={g.grade}>
                <Link href={`/class/${g.grade}`} className="card card-hover flex h-full flex-col p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-3">{g.stage}</span>
                  <span className="mt-1 text-2xl font-extrabold">Class {g.grade}</span>
                  <span className="mt-3 flex flex-wrap gap-1">
                    {g.subjects.slice(0, 6).map((s) => (
                      <SubjectIcon key={s.id} id={s.id} size="sm" />
                    ))}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Features */}
        <section aria-labelledby="features" className="bg-canvas py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 id="features" className="max-w-2xl text-3xl font-extrabold sm:text-4xl">
              One place for learning, practice and revision
            </h2>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2">
              {features.map((f) => (
                <li key={f.title} className="card flex gap-4 p-6">
                  <span className={`grid size-12 shrink-0 place-items-center rounded-2xl text-white ${f.color}`}>
                    <f.icon aria-hidden className="size-6" />
                  </span>
                  <span>
                    <span className="block text-lg font-extrabold">{f.title}</span>
                    <span className="mt-1 block text-ink-2">{f.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section aria-labelledby="how" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 id="how" className="text-3xl font-extrabold sm:text-4xl">
            How a chapter works
          </h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { icon: BookOpenCheck, t: "Understand the concept", b: "Read a focused lesson with examples, tips and the exact points examiners look for." },
              { icon: Target, t: "Check yourself", b: "Take the chapter quiz. Every answer comes with an explanation, and stars go on your path." },
              { icon: LineChart, t: "Track and revise", b: "Download notes, attempt mock tests and watch your progress, streak and level grow." },
            ].map((s, i) => (
              <li key={s.t} className="card p-6">
                <span className="text-sm font-extrabold text-brand-600">Step {i + 1}</span>
                <s.icon aria-hidden className="mt-3 size-8 text-brand-500" />
                <p className="mt-3 text-lg font-extrabold">{s.t}</p>
                <p className="mt-1 text-ink-2">{s.b}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-ink px-6 py-12 text-center text-white sm:px-12 md:flex-row md:text-left">
            <Mascot mood="cheer" size={120} />
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold">Ready when you are.</h2>
              <p className="mt-2 text-white/70">No account needed. Pick your class and start your first lesson in under a minute.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/dashboard" size="lg" iconRight={<ArrowRight className="size-5" aria-hidden />}>
                Start learning
              </ButtonLink>
              <ButtonLink href="/library" size="lg" variant="secondary" icon={<Download className="size-5" aria-hidden />}>
                Notes
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-ink-3 sm:px-6 md:flex-row md:items-center md:justify-between">
          <Logo />
          <p>Kaksha is an independent study platform, not affiliated with CBSE or NCERT. Always verify exam notices on cbse.gov.in.</p>
        </div>
      </footer>
    </div>
  );
}
