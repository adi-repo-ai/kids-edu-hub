import { ArrowRight, CalendarClock, Check, Flame, Lock, Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { TodayPlan } from "@/components/features/TodayPlan";
import { Container } from "@/components/layout/PageHeader";
import { BadgeMedal } from "@/components/ui/BadgeMedal";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StarDoodle } from "@/components/ui/Doodles";
import { ProgressBar, ProgressRing } from "@/components/ui/Progress";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SubjectIcon } from "@/components/ui/SubjectIcon";
import { chapterById, subjectProgress, subjects } from "@/data/curriculum";
import { badges, continueLearning, learningPath, student } from "@/data/student";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "My desk" };

export default function DashboardPage() {
  const chapter = chapterById(continueLearning.chapterId)!;
  const weekPct = Math.round((student.weeklyMinutes / student.weeklyGoalMinutes) * 100);

  return (
    <Container className="py-8 sm:py-10">
      {/* Greeting */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink-3">Saturday, 17 October</p>
          <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">Good morning, {student.firstName}</h1>
          <p className="mt-2 text-ink-2">
            Class {student.grade}-{student.section} · You&apos;re 2 lessons away from finishing this week&apos;s plan.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3">
          <CalendarClock aria-hidden className="size-6 text-coral-600" />
          <div>
            <p className="text-sm font-bold">{student.exam.name}</p>
            <p className="text-sm text-ink-2">
              Start {student.exam.startsOn} · <strong className="text-coral-700">{student.exam.daysLeft} days</strong> to go
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-6">
          {/* Continue learning */}
          <section aria-labelledby="continue-title" className="ruled relative overflow-hidden rounded-xl border border-line-strong shadow-card">
            <div className="py-6 pl-16 pr-6 sm:py-8 sm:pr-8">
              <p className="eyebrow !text-coral-700">Continue where you left off</p>
              <h2 id="continue-title" className="mt-2 text-2xl font-extrabold sm:text-3xl">
                {continueLearning.lessonTitle}
              </h2>
              <p className="mt-1 flex items-center gap-2 text-ink-2">
                <SubjectIcon subject="maths" size="sm" />
                Mathematics · Ch {chapter.number} {chapter.title}
              </p>
              <div className="mt-5 flex max-w-md items-center gap-3">
                <ProgressBar value={chapter.progress} label="Chapter progress" className="flex-1" showValue />
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <ButtonLink href={`/lesson/${continueLearning.lessonSlug}`} size="lg" iconRight={<ArrowRight className="size-5" aria-hidden />}>
                  Resume lesson
                </ButtonLink>
                <span className="text-sm text-ink-3">{continueLearning.minutesLeft} min left</span>
              </div>
            </div>
            <StarDoodle className="absolute right-6 top-6 hidden w-10 text-sun-500 sm:block" />
          </section>

          {/* On phones, today's plan sits right under "Continue" for one-thumb access */}
          <div className="space-y-6 lg:hidden">
            <QuickStats weekPct={weekPct} />
            <PlanCard />
          </div>

          {/* Learning path */}
          <section aria-labelledby="path-title">
            <Card className="p-5 sm:p-6">
              <SectionHeading id="path-title" eyebrow="Personalised for your half-yearlies" title="Your revision path" />
              <ol className="-mx-1 flex snap-x gap-0 overflow-x-auto px-1 pb-2">
                {learningPath.map((step, i) => {
                  const last = i === learningPath.length - 1;
                  return (
                    <li key={step.id} className="flex min-w-[148px] flex-1 snap-start flex-col">
                      <div className="flex items-center">
                        <span
                          className={cn(
                            "grid size-11 shrink-0 place-items-center rounded-full border-2",
                            step.state === "done" && "border-mint-500 bg-mint-500 text-white",
                            step.state === "current" && "border-royal-600 bg-royal-600 text-white shadow-[0_0_0_5px_var(--color-royal-100)]",
                            step.state === "next" && "border-royal-500 bg-surface text-royal-700",
                            step.state === "locked" && "border-line bg-sunken text-ink-3",
                          )}
                        >
                          {step.state === "done" ? <Check className="size-5" strokeWidth={3} aria-hidden /> : step.state === "locked" ? <Lock className="size-4" aria-hidden /> : <Star className="size-4" aria-hidden />}
                        </span>
                        {!last && <span aria-hidden className={cn("mx-2 h-0.5 flex-1 rounded", step.state === "done" ? "bg-mint-500" : "border-t-2 border-dashed border-line-strong")} />}
                      </div>
                      <Link href={step.href} className={cn("mt-3 pr-4 text-sm font-semibold leading-snug hover:underline", step.state === "locked" ? "text-ink-3" : "text-ink")}>
                        {step.title}
                      </Link>
                      <span className="mt-0.5 text-xs text-ink-3">
                        {{ done: "Completed", current: "In progress", next: "Up next", locked: "Unlocks after step " + i }[step.state]}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </Card>
          </section>

          {/* Subjects */}
          <section aria-labelledby="subj-title">
            <SectionHeading id="subj-title" title="Subjects" action={{ href: "/class/8", label: "All subjects" }} />
            <ul className="grid gap-3 sm:grid-cols-2">
              {subjects.map((s) => {
                const p = subjectProgress(s.id);
                return (
                  <li key={s.id}>
                    <Link href={`/learn/${s.id}`} className="block rounded-lg">
                      <Card interactive className="flex items-center gap-4 p-4">
                        <SubjectIcon subject={s.id} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between">
                            <p className="font-bold">{s.name}</p>
                            <span className="text-sm font-semibold tabular-nums text-ink-3">{p}%</span>
                          </div>
                          <ProgressBar value={p} hue={s.hue} size="sm" label={`${s.name} progress`} className="mt-2" />
                        </div>
                      </Card>
                    </Link>
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

          <Card className="p-5">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-lg font-bold">Badges</h2>
              <span className="text-sm text-ink-3">{badges.filter((b) => b.earned).length} earned</span>
            </div>
            <ul className="grid grid-cols-3 gap-x-2 gap-y-5">
              {badges.map((b) => (
                <li key={b.id}>
                  <BadgeMedal badge={b} size={56} />
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </Container>
  );
}

function QuickStats({ weekPct }: { weekPct: number }) {
  return (
    <Card className="grid grid-cols-3 divide-x divide-line">
      <div className="p-4 text-center">
        <Flame aria-hidden className="mx-auto size-6 text-coral-500" />
        <p className="mt-1 font-display text-2xl font-extrabold">{student.streak}</p>
        <p className="text-xs text-ink-3">day streak</p>
      </div>
      <div className="p-4 text-center">
        <Star aria-hidden className="mx-auto size-6 text-sun-500" />
        <p className="mt-1 font-display text-2xl font-extrabold">{student.xp.toLocaleString("en-IN")}</p>
        <p className="text-xs text-ink-3">XP earned</p>
      </div>
      <div className="grid place-items-center p-3">
        <ProgressRing value={weekPct} hue="mint" size={52} stroke={5} label="Weekly goal" />
        <p className="mt-1 text-xs text-ink-3">week goal</p>
      </div>
    </Card>
  );
}

function PlanCard() {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-lg font-bold">Today&apos;s plan</h2>
        <Link href="/planner" className="text-sm font-semibold text-royal-700 hover:underline">
          Planner
        </Link>
      </div>
      <TodayPlan />
    </Card>
  );
}
