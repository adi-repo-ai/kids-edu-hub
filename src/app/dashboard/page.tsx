import { ArrowRight, CalendarClock, Check, Flame, Lock, Star, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { TodayPlan } from "@/components/features/TodayPlan";
import { Container } from "@/components/layout/PageHeader";
import { BadgeMedal } from "@/components/ui/BadgeMedal";
import { ButtonLink } from "@/components/ui/Button";
import { StarDoodle } from "@/components/ui/Doodles";
import { Mascot, MascotBubble } from "@/components/ui/Mascot";
import { CountUp, Tilt } from "@/components/ui/Motion";
import { ProgressBar, ProgressRing } from "@/components/ui/Progress";
import { SubjectIcon } from "@/components/ui/SubjectIcon";
import { chapterById, subjectProgress, subjects } from "@/data/curriculum";
import { badges, continueLearning, learningPath, student } from "@/data/student";
import { cn } from "@/lib/cn";
import { hue } from "@/lib/hue";

export const metadata: Metadata = { title: "My desk" };

const LEVEL_XP = 400;

export default function DashboardPage() {
  const chapter = chapterById(continueLearning.chapterId)!;
  const weekPct = Math.round((student.weeklyMinutes / student.weeklyGoalMinutes) * 100);
  const level = Math.floor(student.xp / LEVEL_XP) + 1;
  const levelPct = Math.round(((student.xp % LEVEL_XP) / LEVEL_XP) * 100);

  return (
    <div className="dots">
      <Container className="py-8 sm:py-10">
        {/* Greeting */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Mascot mood="wave" size={84} className="hidden sm:block" />
            <div>
              <p className="hand text-2xl text-coral-700">Saturday, 17 October</p>
              <h1 className="text-4xl font-extrabold sm:text-5xl">
                Good morning, {student.firstName}!
              </h1>
              <p className="mt-1 text-ink-2">
                Class {student.grade}-{student.section} · You&apos;re 2 lessons away from finishing this week&apos;s plan.
              </p>
            </div>
          </div>
          <div className="sticker flex -rotate-1 items-center gap-3 bg-coral-100 px-4 py-3">
            <CalendarClock aria-hidden className="size-7 animate-wiggle-loop text-coral-700" />
            <div>
              <p className="font-extrabold">{student.exam.name}</p>
              <p className="text-sm text-ink-2">
                Start {student.exam.startsOn} ·{" "}
                <strong className="font-display text-lg text-coral-700">
                  <CountUp value={student.exam.daysLeft} /> days
                </strong>{" "}
                to go
              </p>
            </div>
          </div>
        </div>

        {/* Level bar */}
        <div data-reveal className="sticker mt-8 flex flex-col gap-3 bg-surface p-4 sm:flex-row sm:items-center sm:gap-5">
          <span className="grid size-14 shrink-0 rotate-[-8deg] place-items-center rounded-lg border-[2.5px] border-ink bg-sun-400 font-display text-2xl font-extrabold shadow-[3px_3px_0_0_var(--color-ink)]">
            L{level}
          </span>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-extrabold">
                Level {level} · Square Shooter
              </p>
              <p className="text-sm font-semibold text-ink-2">
                <Zap aria-hidden className="mr-1 inline size-4 fill-sun-400 text-sun-800" />
                {LEVEL_XP - (student.xp % LEVEL_XP)} XP to Level {level + 1}
              </p>
            </div>
            <ProgressBar value={levelPct} hue="sun" size="lg" label="Progress to next level" />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0 space-y-6">
            {/* Continue learning */}
            <section aria-labelledby="continue-title" data-reveal className="ruled tape relative rounded-xl border-[3px] border-ink shadow-[7px_7px_0_0_var(--color-ink)]">
              <div className="py-7 pl-16 pr-6 sm:py-9 sm:pr-48">
                <p className="hand text-2xl text-coral-700">Continue where you left off</p>
                <h2 id="continue-title" className="text-3xl font-extrabold sm:text-4xl">
                  {continueLearning.lessonTitle}
                </h2>
                <p className="mt-1 flex items-center gap-2 font-semibold text-ink-2">
                  <SubjectIcon subject="maths" size="sm" />
                  Mathematics · Ch {chapter.number} {chapter.title}
                </p>
                <div className="mt-5 flex max-w-md items-center gap-3">
                  <ProgressBar value={chapter.progress} label="Chapter progress" className="flex-1" showValue />
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <ButtonLink href={`/lesson/${continueLearning.lessonSlug}`} size="lg" className="shimmer" iconRight={<ArrowRight className="size-5" aria-hidden />}>
                    Resume lesson
                  </ButtonLink>
                  <span className="hand text-xl text-ink-2">only {continueLearning.minutesLeft} min left!</span>
                </div>
              </div>
              <div className="absolute -right-3 bottom-4 hidden flex-col items-end sm:flex">
                <MascotBubble side="bottom" className="mb-3 mr-10 max-w-[170px] -rotate-2 text-lg">
                  Squares are fun. I promise!
                </MascotBubble>
                <Mascot mood="happy" size={100} />
              </div>
              <StarDoodle className="animate-spin-slow absolute right-6 top-6 w-10 text-sun-500 sm:hidden" />
            </section>

            {/* On phones, today's plan sits right under "Continue" for one-thumb access */}
            <div className="space-y-6 lg:hidden">
              <QuickStats weekPct={weekPct} />
              <PlanCard />
            </div>

            {/* Learning path */}
            <section aria-labelledby="path-title" data-reveal className="sticker bg-royal-700 p-5 text-white sm:p-6">
              <p className="hand text-2xl text-sun-400">Personalised for your half-yearlies</p>
              <h2 id="path-title" className="mb-6 text-2xl font-extrabold sm:text-3xl">
                Your revision path
              </h2>
              <ol className="-mx-1 flex snap-x overflow-x-auto px-1 pb-2 pt-2">
                {learningPath.map((step, i) => {
                  const last = i === learningPath.length - 1;
                  return (
                    <li key={step.id} className="flex min-w-[150px] flex-1 snap-start flex-col">
                      <div className="flex items-center">
                        <span className="relative">
                          {step.state === "current" && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-sun-400/70" />}
                          <span
                            className={cn(
                              "relative grid size-12 shrink-0 place-items-center rounded-full border-[2.5px] border-ink",
                              step.state === "done" && "bg-mint-500 text-ink",
                              step.state === "current" && "scale-110 bg-sun-400 text-ink",
                              step.state === "next" && "bg-surface text-royal-700",
                              step.state === "locked" && "border-dashed border-white/50 bg-royal-800 text-white/60",
                            )}
                          >
                            {step.state === "done" ? <Check className="size-6" strokeWidth={3.5} aria-hidden /> : step.state === "locked" ? <Lock className="size-4" aria-hidden /> : <Star className={cn("size-5", step.state === "current" && "fill-ink animate-wiggle-loop")} aria-hidden />}
                          </span>
                        </span>
                        {!last && <span aria-hidden className={cn("mx-2 h-1 flex-1 rounded-full", step.state === "done" ? "bg-mint-500" : "border-t-[3px] border-dashed border-white/40 bg-transparent")} />}
                      </div>
                      <Link href={step.href} className={cn("mt-3 pr-4 text-sm font-bold leading-snug hover:underline", step.state === "locked" ? "text-white/60" : "text-white")}>
                        {step.title}
                      </Link>
                      <span className={cn("mt-0.5 text-xs", step.state === "current" ? "font-bold text-sun-400" : "text-royal-100")}>
                        {{ done: "Completed", current: "You are here!", next: "Up next", locked: "Unlocks after step " + i }[step.state]}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>

            {/* Subjects */}
            <section aria-labelledby="subj-title">
              <div className="mb-4 flex items-end justify-between">
                <h2 id="subj-title" className="text-2xl font-extrabold sm:text-3xl">
                  Subjects
                </h2>
                <Link href="/class/8" className="font-bold text-royal-700 hover:underline">
                  All subjects →
                </Link>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2">
                {subjects.map((s, i) => {
                  const p = subjectProgress(s.id);
                  return (
                    <li key={s.id} data-reveal style={{ ["--i" as string]: i }}>
                      <Tilt className={cn("sticker h-full", hue[s.hue].soft)}>
                        <Link href={`/learn/${s.id}`} className="flex items-center gap-4 p-4">
                          <SubjectIcon subject={s.id} size="lg" className="border-2 border-ink transition-transform group-hover/tilt:-rotate-12 group-hover/tilt:scale-110" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between">
                              <p className="text-lg font-extrabold">{s.name}</p>
                              <span className="font-display text-xl font-extrabold">
                                <CountUp value={p} suffix="%" />
                              </span>
                            </div>
                            <ProgressBar value={p} hue={s.hue} label={`${s.name} progress`} className="mt-2" />
                          </div>
                        </Link>
                      </Tilt>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>

          {/* Right rail */}
          <aside className="space-y-6">
            <div className="hidden space-y-6 lg:block">
              <QuickStats weekPct={weekPct} />
              <PlanCard />
            </div>

            <div data-reveal className="sticker tape tape-pink bg-lavender-50 p-5">
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="text-xl font-extrabold">Badges</h2>
                <span className="hand text-xl text-lavender-700">{badges.filter((b) => b.earned).length} earned!</span>
              </div>
              <ul className="grid grid-cols-3 gap-x-2 gap-y-5">
                {badges.map((b) => (
                  <li key={b.id}>
                    <BadgeMedal badge={b} size={60} />
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}

function QuickStats({ weekPct }: { weekPct: number }) {
  return (
    <div className="sticker grid grid-cols-3 divide-x-2 divide-ink/10 overflow-hidden bg-surface">
      <div className="bg-coral-50 p-4 text-center">
        <Flame aria-hidden className="animate-flicker mx-auto size-8 fill-sun-400 text-coral-600" />
        <p className="mt-1 font-display text-3xl font-extrabold">
          <CountUp value={student.streak} />
        </p>
        <p className="text-xs font-semibold text-ink-3">day streak</p>
      </div>
      <div className="bg-sun-50 p-4 text-center">
        <Star aria-hidden className="mx-auto size-8 animate-spin-slow fill-sun-400 text-sun-800" />
        <p className="mt-1 font-display text-3xl font-extrabold">
          <CountUp value={student.xp} />
        </p>
        <p className="text-xs font-semibold text-ink-3">XP earned</p>
      </div>
      <div className="grid place-items-center bg-mint-50 p-3">
        <ProgressRing value={weekPct} hue="mint" size={60} stroke={7} label="Weekly goal" />
        <p className="mt-1 text-xs font-semibold text-ink-3">week goal</p>
      </div>
    </div>
  );
}

function PlanCard() {
  return (
    <div className="sticker tape bg-surface p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-xl font-extrabold">Today&apos;s plan</h2>
        <Link href="/planner" className="font-bold text-royal-700 hover:underline">
          Planner
        </Link>
      </div>
      <TodayPlan />
    </div>
  );
}
