import { ArrowRight, BookOpen, Check, FileText, MousePointerClick, Pin, Target } from "lucide-react";
import Link from "next/link";
import { Chalkboard } from "@/components/features/Chalkboard";
import { ConfettiButton } from "@/components/features/ConfettiButton";
import { HeroIllustration } from "@/components/features/HeroIllustration";
import { HeroStickers } from "@/components/features/HeroStickers";
import { SearchBox } from "@/components/features/SearchBox";
import { Container } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Highlight, Squiggle, SparkDoodle, StarDoodle } from "@/components/ui/Doodles";
import { Marquee } from "@/components/ui/Marquee";
import { Mascot, MascotBubble } from "@/components/ui/Mascot";
import { CountUp, RotatingWord, Tilt } from "@/components/ui/Motion";
import { SubjectIcon } from "@/components/ui/SubjectIcon";
import { Tag } from "@/components/ui/Tag";
import { chaptersFor, grades, subjects } from "@/data/curriculum";
import { news, papers } from "@/data/library";
import { cn } from "@/lib/cn";
import type { Grade, Hue, SubjectId } from "@/lib/types";

const stages: { name: Grade["stage"]; hue: Hue; note: string }[] = [
  { name: "Foundational", hue: "sun", note: "Play, stories and first sums" },
  { name: "Preparatory", hue: "mint", note: "Reading, numbers and the world around us" },
  { name: "Middle", hue: "royal", note: "New subjects, deeper thinking" },
  { name: "Secondary", hue: "coral", note: "Board-ready, chapter by chapter" },
  { name: "Senior Secondary", hue: "lavender", note: "Streams launching in 2027" },
];

const stageStyles: Record<Hue, { num: string; card: string; dot: string }> = {
  sun: { num: "text-sun-800", card: "bg-sun-100", dot: "bg-sun-400" },
  mint: { num: "text-mint-700", card: "bg-mint-100", dot: "bg-mint-500" },
  royal: { num: "text-royal-700", card: "bg-royal-100", dot: "bg-royal-500" },
  coral: { num: "text-coral-700", card: "bg-coral-100", dot: "bg-coral-500" },
  lavender: { num: "text-lavender-700", card: "bg-lavender-100", dot: "bg-lavender-500" },
};

/** Bento tiles: each subject wears its colour at full strength. */
const subjectTiles: Record<SubjectId, { tile: string; text: string; sub: string; span: string }> = {
  maths: { tile: "bg-royal-600", text: "text-white", sub: "text-royal-100", span: "sm:col-span-2 sm:row-span-2" },
  science: { tile: "bg-mint-500", text: "text-ink", sub: "text-ink/75", span: "" },
  social: { tile: "bg-coral-500", text: "text-ink", sub: "text-ink/75", span: "" },
  english: { tile: "bg-lavender-600", text: "text-white", sub: "text-lavender-100", span: "" },
  hindi: { tile: "bg-sun-400", text: "text-ink", sub: "text-ink/75", span: "" },
};

const topics = ["Squares & cubes", "Microorganisms", "The Marathas", "Reported speech", "संधि और समास", "Light & lenses", "Board papers 2025", "Exploring forces", "Ganita Prakash", "Universal franchise"];

export default function HomePage() {
  const latestPapers = papers.filter((p) => p.grade === 10 && p.year === 2025).slice(0, 4);
  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section className="dots relative overflow-hidden border-b-[3px] border-ink bg-paper">
        <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-20">
          <div className="relative z-10">
            <p className="animate-bounce-in mb-5 inline-flex -rotate-1 items-center gap-2 rounded-md border-2 border-ink bg-sun-400 px-3 py-1 text-sm font-bold text-ink shadow-[3px_3px_0_0_var(--color-ink)]">
              <span className="size-2 animate-ping rounded-full bg-coral-600" aria-hidden />
              CBSE · Classes 1 to 10 · Follows NCERT textbooks
            </p>
            <h1 className="text-[2.6rem] font-extrabold leading-[1.02] sm:text-6xl xl:text-7xl">
              School subjects, explained like a{" "}
              <Highlight>
                <RotatingWord words={["good teacher", "best friend", "storyteller", "cricket coach"]} />
              </Highlight>{" "}
              would.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-2">
              Short interactive lessons, practice that tells you <em className="hand text-2xl not-italic text-coral-700">why</em> an answer is right, and past board papers with marking schemes. All in one happy place.
            </p>

            <SearchBox size="lg" className="mt-8 max-w-xl" />

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <ButtonLink href="#classes" size="lg" className="shimmer" iconRight={<ArrowRight className="size-5" aria-hidden />}>
                Choose your class
              </ButtonLink>
              <ButtonLink href="/lesson/perfect-squares-as-areas" size="lg" variant="secondary">
                Try a sample lesson
              </ButtonLink>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink-2">
              {["English & हिंदी medium", "No ads, ever", "Works on low data"].map((t, i) => (
                <li key={t} className="animate-bounce-in flex items-center gap-1.5" style={{ animationDelay: `${300 + i * 120}ms` }}>
                  <span className="grid size-5 place-items-center rounded-full bg-mint-500 text-white">
                    <Check aria-hidden className="size-3.5" strokeWidth={3.5} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <HeroStickers />
            <HeroIllustration />
            <div className="absolute -bottom-6 -right-2 hidden items-end gap-1 sm:flex lg:-right-8">
              <MascotBubble side="left" className="order-2 mb-16 -ml-1 max-w-[180px]">
                Namaste! I&apos;m Gyani. Let&apos;s learn!
              </MascotBubble>
              <Mascot mood="wave" size={110} />
            </div>
          </div>
        </Container>
      </section>

      {/* ───────────── Marquee ───────────── */}
      <div className="relative z-10 -mt-1 py-6">
        <Marquee
          className="bg-coral-500 font-display text-xl font-extrabold text-ink sm:text-2xl"
          items={topics.map((t) => (
            <span key={t}>{t}</span>
          ))}
        />
      </div>

      {/* ───────────── Class selection ───────────── */}
      <section id="classes" aria-labelledby="classes-title" className="scroll-mt-16">
        <Container className="py-14 sm:py-20">
          <div data-reveal className="mb-10 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="hand text-3xl text-coral-700">Step one…</p>
              <h2 id="classes-title" className="text-4xl font-extrabold sm:text-5xl">
                Which class are you in?
              </h2>
            </div>
            <p className="max-w-sm text-ink-2">Grouped by the NEP school stages, so each class gets lessons pitched at the right level.</p>
          </div>

          <div className="space-y-8">
            {stages.map((stage, si) => {
              const list = grades.filter((g) => g.stage === stage.name);
              const st = stageStyles[stage.hue];
              return (
                <div key={stage.name} data-reveal style={{ ["--i" as string]: si }} className="grid gap-4 md:grid-cols-[220px_1fr] md:gap-8">
                  <div className="flex items-baseline gap-3 md:block md:pt-3">
                    <h3 className="flex items-center gap-2 text-xl font-extrabold">
                      <span className={cn("inline-block size-4 rotate-12 rounded-sm border-2 border-ink", st.dot)} aria-hidden />
                      {stage.name}
                    </h3>
                    <p className="text-sm text-ink-3 md:mt-1">{stage.note}</p>
                  </div>
                  <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {list.map((g, i) =>
                      g.available ? (
                        <li key={g.id}>
                          <Link
                            href={`/class/${g.id}`}
                            style={{ ["--hover-r" as string]: i % 2 ? "1.2deg" : "-1.2deg" }}
                            className={cn("sticker sticker-hover group flex h-full flex-col p-4", st.card)}
                          >
                            <span className="flex items-start justify-between">
                              <span className={cn("font-display text-6xl font-extrabold leading-none transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6", st.num)}>{g.id}</span>
                              <span className="grid size-8 place-items-center rounded-full border-2 border-ink bg-surface transition-transform group-hover:rotate-[-45deg]">
                                <ArrowRight aria-hidden className="size-4" />
                              </span>
                            </span>
                            <span className="mt-3 font-bold">Class {g.id}</span>
                            <span className="mt-0.5 text-sm text-ink-2">{g.focus}</span>
                          </Link>
                        </li>
                      ) : (
                        <li key={g.id} className="flex flex-col rounded-lg border-[2.5px] border-dashed border-ink-3 p-4 text-ink-3">
                          <span className="font-display text-6xl font-extrabold leading-none text-line-strong">{g.id}</span>
                          <span className="mt-3 font-bold text-ink-2">Class {g.id}</span>
                          <span className="hand mt-0.5 text-lg">Coming in 2027!</span>
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

      {/* ───────────── Chalkboard ───────────── */}
      <section aria-label="Fact of the day" className="bg-sunken/70 py-14 sm:py-20">
        <Container>
          <Chalkboard />
        </Container>
      </section>

      {/* ───────────── How it works ───────────── */}
      <section aria-labelledby="how-title">
        <Container className="py-14 sm:py-20">
          <div data-reveal className="max-w-2xl">
            <p className="hand text-3xl text-royal-700">How every chapter works</p>
            <h2 id="how-title" className="text-4xl font-extrabold sm:text-5xl">
              Learn it. Practise it.{" "}
              <span className="relative inline-block">
                Keep it.
                <Squiggle className="absolute -bottom-2 left-0 h-3 w-full" />
              </span>
            </h2>
          </div>

          <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-7">
            {[
              { icon: MousePointerClick, tape: "", bg: "bg-royal-50", title: "Learn by doing", body: "10-minute lessons where you drag, build and try things. Every idea is shown before it is named.", demo: "tiles" },
              { icon: Target, tape: "tape-pink", bg: "bg-coral-50", title: "Practise with feedback", body: "Quizzes explain each answer and give a hint before you give up. Mistakes become a revision list.", demo: "quiz" },
              { icon: FileText, tape: "tape-mint", bg: "bg-mint-50", title: "Revise for the exam", body: "One-page notes, worksheets and ten years of board papers with the official marking scheme.", demo: "paper" },
            ].map((step, i) => (
              <li key={step.title} data-reveal style={{ ["--i" as string]: i, ["--hover-r" as string]: i === 1 ? "1deg" : "-1deg" }} className={cn("sticker sticker-hover tape p-6", step.tape, step.bg, i === 1 ? "md:mt-8" : "")}>
                <span className="font-display text-5xl font-extrabold text-ink/15">0{i + 1}</span>
                <h3 className="-mt-3 flex items-center gap-2 text-xl font-extrabold">
                  <step.icon aria-hidden className="size-6 text-coral-600" />
                  {step.title}
                </h3>
                <p className="mt-2 text-ink-2">{step.body}</p>
                <div aria-hidden className="mt-5 grid h-24 place-items-center rounded-md border-2 border-dashed border-ink/25 bg-surface">
                  {step.demo === "tiles" && (
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({ length: 16 }).map((_, t) => (
                        <span key={t} className={cn("size-4 rounded-[3px] border", t % 4 === 3 || t >= 12 ? "border-coral-600 bg-coral-200" : "border-royal-500 bg-royal-200")} style={{ animation: `pop 2.6s ${t * 70}ms var(--ease-spring) infinite` }} />
                      ))}
                    </div>
                  )}
                  {step.demo === "quiz" && (
                    <div className="flex gap-2">
                      {["49", "50", "64"].map((o, t) => (
                        <span key={o} className={cn("grid h-10 w-14 place-items-center rounded-md border-2 font-display font-extrabold", t === 1 ? "border-coral-500 bg-coral-50" : "border-mint-500 bg-mint-50")}>
                          {t === 1 ? o : <span className="animate-bounce-in flex items-center gap-1" style={{ animationDelay: `${t * 300}ms` }}><Check className="size-4 text-mint-700" strokeWidth={3} />{o}</span>}
                        </span>
                      ))}
                    </div>
                  )}
                  {step.demo === "paper" && (
                    <div className="group/paper relative h-16 w-28">
                      {[-8, 4, 0].map((r, t) => (
                        <span key={t} className="absolute inset-0 rounded-sm border-2 border-ink bg-surface transition-transform duration-500" style={{ transform: `rotate(${r}deg) translateX(${(t - 1) * 6}px)` }}>
                          {t === 2 && <span className="hand block p-1 text-sm leading-tight">Science 086<br />2025 · Set 3</span>}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ───────────── Subjects bento ───────────── */}
      <section aria-labelledby="subjects-title" className="border-y-[3px] border-ink bg-ink py-14 text-white sm:py-20">
        <Container>
          <div data-reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="hand text-3xl text-sun-400">Class 8 preview</p>
              <h2 id="subjects-title" className="text-4xl font-extrabold sm:text-5xl">
                Built around your textbooks
              </h2>
            </div>
            <ButtonLink href="/class/8" variant="accent" iconRight={<ArrowRight className="size-4" aria-hidden />}>
              All Class 8 subjects
            </ButtonLink>
          </div>
          <ul className="grid auto-rows-[minmax(180px,auto)] gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {subjects.map((s, i) => {
              const t = subjectTiles[s.id];
              return (
                <li key={s.id} data-reveal style={{ ["--i" as string]: i }} className={t.span}>
                  <Tilt className={cn("h-full rounded-xl border-[3px] border-white/90", t.tile)}>
                    <Link href={`/learn/${s.id}`} className={cn("flex h-full flex-col justify-between gap-6 p-6", t.text)}>
                      <span className="flex items-start justify-between">
                        <SubjectIcon subject={s.id} size="lg" className="animate-float border-2 border-ink" />
                        <span className={cn("font-display text-sm font-bold", t.sub)}>{chaptersFor(s.id).length} chapters</span>
                      </span>
                      <span>
                        <span className={cn("block font-display font-extrabold leading-tight", i === 0 ? "text-4xl sm:text-5xl" : "text-2xl")}>{s.name}</span>
                        <span className={cn("mt-1 block text-sm font-semibold", t.sub)}>{s.book}</span>
                        {i === 0 && <span className={cn("mt-3 block max-w-xs", t.sub)}>{s.blurb}</span>}
                      </span>
                    </Link>
                  </Tilt>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* ───────────── Papers + Notice board ───────────── */}
      <section aria-label="Past papers and news">
        <Container className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] [&>*]:min-w-0">
          <div data-reveal>
            <p className="hand text-3xl text-coral-700">Board exam season</p>
            <h2 className="text-4xl font-extrabold">Past papers, with the marking scheme beside them</h2>
            <p className="mt-3 max-w-lg text-ink-2">Practise the way examiners mark. Class 10 and 12 papers from recent years, filterable by subject, code and set.</p>
            <ul className="sticker mt-6 overflow-hidden bg-surface">
              {latestPapers.map((p, i) => (
                <li key={p.id} className="group flex items-center gap-4 border-b-2 border-ink/10 px-4 py-3.5 transition-colors last:border-0 hover:bg-sun-50">
                  <span className={cn("grid size-11 shrink-0 place-items-center rounded-md border-2 border-ink font-display text-sm font-extrabold transition-transform group-hover:-rotate-6 group-hover:scale-110", ["bg-coral-100", "bg-royal-100", "bg-mint-100", "bg-lavender-100"][i])}>{p.code}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">
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
            <ButtonLink href="/papers" variant="secondary" className="mt-6" iconRight={<ArrowRight className="size-4" aria-hidden />}>
              Browse all papers
            </ButtonLink>
          </div>

          <div data-reveal style={{ ["--i" as string]: 1 }}>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-3xl font-extrabold">Notice board</h2>
              <Link href="/news" className="font-bold text-royal-700 hover:underline">
                All news →
              </Link>
            </div>
            <div className="cork rounded-xl border-[10px] border-wood p-5 shadow-[inset_0_2px_10px_rgb(0_0_0/0.25)] sm:p-7">
              <ul className="grid gap-5 sm:grid-cols-2">
                {news.slice(0, 3).map((n, i) => (
                  <li
                    key={n.id}
                    className={cn(
                      "relative p-4 pt-6 shadow-[2px_6px_12px_-4px_rgb(0_0_0/0.4)] transition-transform duration-300 hover:z-10 hover:rotate-0 hover:scale-105",
                      ["bg-sun-100 -rotate-2", "bg-surface rotate-2", "bg-mint-100 -rotate-1 sm:col-span-2"][i],
                    )}
                  >
                    <Pin aria-hidden className={cn("absolute -top-2 left-1/2 size-6 -translate-x-1/2 rotate-12 drop-shadow", ["fill-coral-500 text-coral-700", "fill-royal-500 text-royal-700", "fill-mint-500 text-mint-700"][i])} />
                    <p className="text-xs font-bold uppercase tracking-wide text-ink-3">
                      {n.category} · {new Date(n.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                    <p className="hand mt-1 text-2xl leading-tight text-ink">{n.title}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ───────────── Parents ───────────── */}
      <section aria-labelledby="parents-title">
        <Container className="pb-14 sm:pb-20">
          <div data-reveal className="dots-light relative grid items-center gap-10 overflow-hidden rounded-[28px] border-[3px] border-ink bg-royal-700 px-6 py-10 text-white shadow-[8px_8px_0_0_var(--color-ink)] sm:px-10 lg:grid-cols-2 lg:px-14 lg:py-14">
            <SparkDoodle className="animate-spin-slow absolute right-6 top-6 w-12 text-sun-400" />
            <StarDoodle className="animate-float absolute bottom-8 left-[45%] hidden w-8 text-coral-500 lg:block" />
            <div>
              <p className="hand text-3xl text-sun-400">For parents</p>
              <h2 id="parents-title" className="text-3xl font-extrabold sm:text-4xl">
                A weekly picture of how your child is doing. Not a surveillance feed.
              </h2>
              <p className="mt-4 max-w-md text-royal-100">See time spent, chapters finished and where a little help would go far, alongside notes from teachers.</p>
              <ButtonLink href="/parent" variant="accent" size="lg" className="mt-7" iconRight={<ArrowRight className="size-5" aria-hidden />}>
                See the parent view
              </ButtonLink>
            </div>
            <div className="-rotate-1 rounded-xl border-[3px] border-ink bg-surface p-5 text-ink shadow-[6px_6px_0_0_var(--color-sun-400)] transition-transform duration-500 hover:rotate-0">
              <div className="flex items-center justify-between">
                <p className="font-extrabold">Ananya · this week</p>
                <Tag hue="mint">On track</Tag>
              </div>
              <div className="mt-5 flex h-28 items-end gap-2" aria-hidden>
                {[35, 42, 20, 48, 31, 38, 8].map((m, i) => (
                  <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                    <div
                      className={cn("w-full origin-bottom rounded-t-md border-2 border-ink", i === 5 ? "bg-coral-500" : "bg-royal-200")}
                      style={{ height: `${(m / 48) * 80}%`, animation: `bounce-in 700ms ${i * 80}ms var(--ease-spring) both` }}
                    />
                    <span className="text-[11px] font-bold text-ink-3">{"MTWTFSS"[i]}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t-2 border-ink/10 pt-4 text-center">
                <div>
                  <p className="font-display text-2xl font-extrabold">
                    <CountUp value={214} suffix=" min" />
                  </p>
                  <p className="text-xs text-ink-3">Studied</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold">
                    <CountUp value={6} />
                  </p>
                  <p className="text-xs text-ink-3">Lessons</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold">
                    <CountUp value={83} suffix="%" />
                  </p>
                  <p className="text-xs text-ink-3">Quiz avg</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ───────────── Final CTA ───────────── */}
      <section className="dots border-t-[3px] border-ink bg-sun-400">
        <Container className="flex flex-col items-center gap-6 py-14 text-center sm:flex-row sm:text-left">
          <Mascot mood="cheer" size={120} />
          <div className="flex-1">
            <h2 className="text-4xl font-extrabold sm:text-5xl">Your next chapter starts today.</h2>
            <p className="mt-2 flex items-center justify-center gap-2 text-lg font-semibold text-ink/80 sm:justify-start">
              <BookOpen aria-hidden className="size-5" /> Lessons are reviewed by practising CBSE teachers.
            </p>
          </div>
          <ConfettiButton label="Let's go!" scrollTo="#classes" />
        </Container>
      </section>
    </>
  );
}
