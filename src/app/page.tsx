import { ArrowRight, BookOpen, Check, FileText, MousePointerClick, Target } from "lucide-react";
import Link from "next/link";
import { HeroIllustration } from "@/components/features/HeroIllustration";
import { SearchBox } from "@/components/features/SearchBox";
import { Container } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Highlight, Squiggle, SparkDoodle } from "@/components/ui/Doodles";
import { SubjectIcon } from "@/components/ui/SubjectIcon";
import { Tag } from "@/components/ui/Tag";
import { grades, subjects } from "@/data/curriculum";
import { news, papers } from "@/data/library";
import { cn } from "@/lib/cn";
import type { Grade, Hue } from "@/lib/types";

const stages: { name: Grade["stage"]; hue: Hue; note: string }[] = [
  { name: "Foundational", hue: "sun", note: "Play, stories and first sums" },
  { name: "Preparatory", hue: "mint", note: "Reading, numbers and the world around us" },
  { name: "Middle", hue: "royal", note: "New subjects, deeper thinking" },
  { name: "Secondary", hue: "coral", note: "Board-ready, chapter by chapter" },
  { name: "Senior Secondary", hue: "lavender", note: "Streams launching in 2027" },
];

const stageStyles: Record<Hue, { num: string; bar: string; hover: string }> = {
  sun: { num: "text-sun-800", bar: "bg-sun-400", hover: "hover:border-sun-500" },
  mint: { num: "text-mint-700", bar: "bg-mint-500", hover: "hover:border-mint-500" },
  royal: { num: "text-royal-700", bar: "bg-royal-500", hover: "hover:border-royal-500" },
  coral: { num: "text-coral-700", bar: "bg-coral-500", hover: "hover:border-coral-500" },
  lavender: { num: "text-lavender-700", bar: "bg-lavender-500", hover: "hover:border-lavender-500" },
};

export default function HomePage() {
  const latestPapers = papers.filter((p) => p.grade === 10 && p.year === 2025).slice(0, 4);
  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section className="relative overflow-hidden border-b border-line">
        <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-20">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-sm bg-surface px-2.5 py-1 text-sm font-semibold text-ink-2 ring-1 ring-line">
              <span className="size-2 rounded-full bg-mint-500" aria-hidden />
              CBSE · Classes 1 to 10 · Follows NCERT textbooks
            </p>
            <h1 className="text-[2.6rem] font-extrabold leading-[1.04] sm:text-6xl">
              School subjects, explained the way a <Highlight>good teacher</Highlight> would.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-2">
              Short interactive lessons, practice that tells you <em>why</em> an answer is right, and past board papers with marking schemes, all in one calm place.
            </p>

            <SearchBox size="lg" className="mt-8 max-w-xl" />

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <ButtonLink href="#classes" size="lg" iconRight={<ArrowRight className="size-5" aria-hidden />}>
                Choose your class
              </ButtonLink>
              <ButtonLink href="/lesson/perfect-squares-as-areas" size="lg" variant="secondary">
                Try a sample lesson
              </ButtonLink>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-2">
              {["English & हिंदी medium", "No ads, ever", "Works on low data"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check aria-hidden className="size-4 text-mint-600" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <HeroIllustration />
        </Container>
      </section>

      {/* ───────────── Class selection ───────────── */}
      <section id="classes" aria-labelledby="classes-title" className="scroll-mt-16">
        <Container className="py-16 sm:py-20">
          <div className="mb-10 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="eyebrow mb-2">Step one</p>
              <h2 id="classes-title" className="text-3xl font-extrabold sm:text-4xl">
                Which class are you in?
              </h2>
            </div>
            <p className="max-w-sm text-ink-2">Grouped by the NEP school stages, so each class gets lessons pitched at the right level.</p>
          </div>

          <div className="space-y-6">
            {stages.map((stage) => {
              const list = grades.filter((g) => g.stage === stage.name);
              const st = stageStyles[stage.hue];
              return (
                <div key={stage.name} className="grid gap-3 border-t border-line pt-5 md:grid-cols-[220px_1fr] md:gap-8">
                  <div className="flex items-baseline gap-3 md:block">
                    <h3 className="text-lg font-bold">
                      <span className={cn("mr-2 inline-block h-3 w-3 rounded-sm align-middle", st.bar)} aria-hidden />
                      {stage.name}
                    </h3>
                    <p className="text-sm text-ink-3 md:mt-1">{stage.note}</p>
                  </div>
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {list.map((g) =>
                      g.available ? (
                        <li key={g.id}>
                          <Link
                            href={`/class/${g.id}`}
                            className={cn(
                              "group flex h-full flex-col rounded-lg border-2 border-line bg-surface p-4 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lift",
                              st.hover,
                            )}
                          >
                            <span className="flex items-baseline justify-between">
                              <span className={cn("font-display text-5xl font-extrabold leading-none", st.num)}>{g.id}</span>
                              <ArrowRight aria-hidden className="size-5 -translate-x-1 text-ink-3 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                            </span>
                            <span className="mt-3 font-semibold">Class {g.id}</span>
                            <span className="mt-0.5 text-sm text-ink-3">{g.focus}</span>
                          </Link>
                        </li>
                      ) : (
                        <li key={g.id} className="flex flex-col rounded-lg border-2 border-dashed border-line-strong p-4 text-ink-3">
                          <span className="font-display text-5xl font-extrabold leading-none text-line-strong">{g.id}</span>
                          <span className="mt-3 font-semibold text-ink-2">Class {g.id}</span>
                          <span className="mt-0.5 text-sm">Coming in 2027</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ───────────── How it works ───────────── */}
      <section aria-labelledby="how-title" className="border-y border-line bg-surface">
        <Container className="py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow mb-2">How every chapter works</p>
            <h2 id="how-title" className="text-3xl font-extrabold sm:text-4xl">
              Learn it. Practise it.{" "}
              <span className="relative inline-block">
                Keep it.
                <Squiggle className="absolute -bottom-2 left-0 h-3 w-full" />
              </span>
            </h2>
          </div>

          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {[
              {
                icon: MousePointerClick,
                hue: "royal" as Hue,
                title: "Learn by doing",
                body: "10-minute lessons where you drag, build and try things. Every idea is shown before it is named.",
                sample: "Drag the slider to build 5²",
              },
              {
                icon: Target,
                hue: "coral" as Hue,
                title: "Practise with feedback",
                body: "Quizzes explain each answer and give a hint before you give up. Mistakes become a revision list.",
                sample: "Not quite. Squares never end in 7.",
              },
              {
                icon: FileText,
                hue: "mint" as Hue,
                title: "Revise for the exam",
                body: "One-page notes, worksheets and ten years of board papers with the official marking scheme.",
                sample: "2025 · Science 086 · Set 30/3/1",
              },
            ].map((step, i) => (
              <li key={step.title} className="relative">
                <span className="font-display text-sm font-extrabold text-ink-3">0{i + 1}</span>
                <h3 className="mt-1 flex items-center gap-2 text-xl font-bold">
                  <step.icon aria-hidden className={cn("size-5", { royal: "text-royal-600", coral: "text-coral-600", mint: "text-mint-600" }[step.hue as "royal"])} />
                  {step.title}
                </h3>
                <p className="mt-2 text-ink-2">{step.body}</p>
                <p className="mt-4 inline-block rounded-md border border-dashed border-line-strong bg-paper px-3 py-2 font-display text-sm font-semibold text-ink-2">{step.sample}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ───────────── Subjects ───────────── */}
      <section aria-labelledby="subjects-title">
        <Container className="py-16 sm:py-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Class 8 preview</p>
              <h2 id="subjects-title" className="text-3xl font-extrabold sm:text-4xl">
                Built around your textbooks
              </h2>
            </div>
            <Link href="/class/8" className="hidden text-sm font-semibold text-royal-700 hover:underline sm:inline">
              All Class 8 subjects →
            </Link>
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {subjects.map((s) => (
              <li key={s.id}>
                <Link href={`/learn/${s.id}`} className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-4 sm:grid-cols-[auto_220px_1fr_auto] sm:gap-6">
                  <SubjectIcon subject={s.id} />
                  <span className="text-lg font-bold group-hover:underline">{s.name}</span>
                  <span className="col-span-3 -mt-2 text-ink-2 sm:col-span-1 sm:mt-0">
                    <span className="font-semibold text-ink">{s.book}</span> · {s.blurb}
                  </span>
                  <ArrowRight aria-hidden className="row-start-1 hidden size-5 text-ink-3 transition-transform group-hover:translate-x-1 sm:col-start-4 sm:block" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ───────────── Papers + News ───────────── */}
      <section aria-label="Past papers and news" className="bg-sunken/60">
        <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.2fr_1fr] [&>*]:min-w-0">
          <div>
            <p className="eyebrow mb-2">Board exam season</p>
            <h2 className="text-3xl font-extrabold">Past papers, with the marking scheme beside them</h2>
            <p className="mt-3 max-w-lg text-ink-2">Practise the way examiners mark. Class 10 and 12 papers from recent years, filterable by subject, code and set.</p>
            <ul className="mt-6 overflow-hidden rounded-lg border border-line bg-surface">
              {latestPapers.map((p) => (
                <li key={p.id} className="flex items-center gap-4 border-b border-line px-4 py-3.5 last:border-0">
                  <span className="grid size-10 shrink-0 place-items-center rounded-md bg-coral-50 font-display text-sm font-extrabold text-coral-700">{p.code}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {p.subject} · {p.year}
                    </p>
                    <p className="text-sm text-ink-3">
                      Class {p.grade} · Set {p.set} · {p.marks} marks
                    </p>
                  </div>
                  {p.hasMarkingScheme && <Tag hue="mint">Marking scheme</Tag>}
                </li>
              ))}
            </ul>
            <ButtonLink href="/papers" variant="secondary" className="mt-5" iconRight={<ArrowRight className="size-4" aria-hidden />}>
              Browse all papers
            </ButtonLink>
          </div>

          <div>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-2xl font-extrabold">From the notice board</h2>
              <Link href="/news" className="text-sm font-semibold text-royal-700 hover:underline">
                All news
              </Link>
            </div>
            <ul className="space-y-3">
              {news.slice(0, 3).map((n) => (
                <li key={n.id} className="rounded-lg border border-line bg-surface p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-ink-3">
                    <Tag hue={n.category === "Exams" ? "coral" : n.category === "Curriculum" ? "royal" : undefined}>{n.category}</Tag>
                    <time dateTime={n.date}>{new Date(n.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</time>
                  </div>
                  <p className="mt-2 font-semibold leading-snug">{n.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ───────────── Parents ───────────── */}
      <section aria-labelledby="parents-title">
        <Container className="py-16 sm:py-20">
          <div className="relative grid items-center gap-10 overflow-hidden rounded-xl bg-royal-700 px-6 py-10 text-white sm:px-10 lg:grid-cols-2 lg:px-14 lg:py-14">
            <SparkDoodle className="absolute right-6 top-6 w-10 text-sun-400" />
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-royal-100">For parents</p>
              <h2 id="parents-title" className="text-3xl font-extrabold sm:text-4xl">
                A weekly picture of how your child is doing. Not a surveillance feed.
              </h2>
              <p className="mt-4 max-w-md text-royal-100">See time spent, chapters finished and where a little help would go far, alongside notes from teachers.</p>
              <ButtonLink href="/parent" variant="accent" size="lg" className="mt-7" iconRight={<ArrowRight className="size-5" aria-hidden />}>
                See the parent view
              </ButtonLink>
            </div>
            <div className="rounded-lg bg-surface p-5 text-ink shadow-lift">
              <div className="flex items-center justify-between">
                <p className="font-bold">Ananya · this week</p>
                <Tag hue="mint">On track</Tag>
              </div>
              <div className="mt-5 flex h-28 items-end gap-2" aria-hidden>
                {[35, 42, 20, 48, 31, 38, 8].map((m, i) => (
                  <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                    <div className={cn("w-full rounded-t-sm", i === 5 ? "bg-royal-500" : "bg-royal-200")} style={{ height: `${(m / 48) * 80}%` }} />
                    <span className="text-[11px] font-semibold text-ink-3">{"MTWTFSS"[i]}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4 text-center">
                {[
                  ["3h 34m", "Studied"],
                  ["6", "Lessons"],
                  ["83%", "Quiz avg"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <p className="font-display text-xl font-extrabold">{v}</p>
                    <p className="text-xs text-ink-3">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-ink-3">
            <BookOpen aria-hidden className="size-4" /> Lessons are reviewed by practising CBSE teachers before they go live.
          </p>
        </Container>
      </section>
    </>
  );
}
