"use client";

import { ArrowRight, Award, CalendarDays, Check, ClipboardCheck, Flame, Lock, Target, Zap } from "lucide-react";
import Link from "next/link";
import { achievements } from "@/lib/achievements";
import { chaptersOf, getGrade } from "@/lib/curriculum";
import { cn } from "@/lib/cn";
import { actions, levelOf, LEVEL_XP, streakOf, today, useHydrated, useStore } from "@/lib/store";
import { styleFor } from "@/lib/subjects";
import { DailyChallengeCard, FlashcardsDueCard } from "../revise/DueCards";
import { ReadinessSummary } from "../revise/Readiness";
import { ReviseToday } from "../revise/ReviseToday";
import { ButtonLink } from "../ui/Button";
import { Mascot } from "../ui/Mascot";
import { ProgressBar, ProgressRing } from "../ui/Progress";
import { SubjectIcon } from "../ui/SubjectIcon";

export function Dashboard() {
  const hydrated = useHydrated();
  const s = useStore((x) => x);
  if (!hydrated) return <div className="h-96" />;

  const grade = s.profile.grade ? getGrade(s.profile.grade) : undefined;
  const streak = streakOf(s.activity);
  const lvl = levelOf(s.xp);
  const todayXp = s.activity[today()] ?? 0;
  const goalPct = Math.min(100, Math.round((todayXp / s.profile.dailyGoal) * 100));
  const hour = new Date().getHours();
  const hello = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Most recently completed lesson decides what to continue; otherwise first subject.
  const recent = Object.entries(s.lessons).sort((a, b) => b[1].localeCompare(a[1]))[0]?.[0];
  const subjects = grade?.subjects ?? [];
  const contSubject = subjects.find((x) => recent?.startsWith(`${grade?.grade}/${x.id}/`)) ?? subjects[0];
  const contChapter = contSubject && chaptersOf(contSubject).find((c) => !s.lessons[`${grade!.grade}/${contSubject.id}/${c.id}`]);
  const todays = s.tasks.filter((t) => t.date === today());
  const badges = achievements(s);

  return (
    <div className="space-y-8">
      {/* Greeting + stats */}
      <section className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
        <div className="relative flex-1 overflow-hidden rounded-3xl bg-brand-500 p-6 text-white sm:p-8">
          <div className="relative z-10 max-w-lg">
            <p className="font-semibold text-brand-100">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
            <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">
              {hello}
              {s.profile.name ? `, ${s.profile.name}` : ""}!
            </h1>
            {grade && contSubject && contChapter ? (
              <>
                <p className="mt-2 text-brand-100">
                  Up next in {contSubject.name}: <strong className="text-white">{contChapter.title}</strong>
                </p>
                <ButtonLink href={`/class/${grade.grade}/${contSubject.id}/${contChapter.id}`} variant="white" size="lg" className="mt-6" iconRight={<ArrowRight className="size-5" aria-hidden />}>
                  {Object.keys(s.lessons).length ? "Continue learning" : "Start your first lesson"}
                </ButtonLink>
              </>
            ) : (
              <>
                <p className="mt-2 text-brand-100">Choose your class to get a personalised learning path.</p>
                <ButtonLink href="/learn" variant="white" size="lg" className="mt-6" iconRight={<ArrowRight className="size-5" aria-hidden />}>
                  Choose class
                </ButtonLink>
              </>
            )}
          </div>
          <Mascot mood="wave" size={150} className="absolute -bottom-3 right-4 hidden opacity-95 sm:block" />
        </div>

        <div className="grid grid-cols-3 gap-3 lg:w-[380px] lg:grid-cols-1">
          <div className="card flex flex-col items-center justify-center gap-1 p-4 lg:flex-row lg:justify-start lg:gap-4">
            <Flame aria-hidden className={cn("size-9", streak ? "fill-coral-500 text-coral-600" : "text-line-strong")} />
            <div className="text-center lg:text-left">
              <p className="text-2xl font-extrabold tabular-nums">{streak}</p>
              <p className="text-xs font-bold text-ink-3">day streak</p>
            </div>
          </div>
          <div className="card flex flex-col items-center justify-center gap-1 p-4 lg:flex-row lg:justify-start lg:gap-4">
            <span className="grid size-9 place-items-center rounded-xl bg-amber-400 text-sm font-extrabold text-white">L{lvl.level}</span>
            <div className="w-full text-center lg:text-left">
              <p className="text-2xl font-extrabold tabular-nums">{s.xp.toLocaleString("en-IN")} XP</p>
              <p className="text-xs font-bold text-ink-3">{LEVEL_XP - lvl.into} XP to level {lvl.level + 1}</p>
              <ProgressBar value={lvl.pct} label="Level progress" color="bg-amber-400" size="sm" className="mt-1.5 hidden lg:block" />
            </div>
          </div>
          <div className="card flex flex-col items-center justify-center gap-1 p-4 lg:flex-row lg:justify-start lg:gap-4">
            <ProgressRing value={goalPct} size={44} stroke={5} color="#22c55e" label="Daily goal">
              <Target className="size-4 text-green-600" aria-hidden />
            </ProgressRing>
            <div className="text-center lg:text-left">
              <p className="text-2xl font-extrabold tabular-nums">
                {todayXp}/{s.profile.dailyGoal}
              </p>
              <p className="text-xs font-bold text-ink-3">daily XP goal</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Subjects */}
        <section aria-labelledby="subj">
          <div className="mb-4 flex items-end justify-between">
            <h2 id="subj" className="text-2xl font-extrabold">
              {grade ? `Class ${grade.grade} subjects` : "Your subjects"}
            </h2>
            <Link href={grade ? `/class/${grade.grade}` : "/learn"} className="text-sm font-bold text-brand-600 hover:underline">
              View all
            </Link>
          </div>
          {grade ? (
            <ul className="grid gap-4 sm:grid-cols-2">
              {subjects.map((sub) => {
                const list = chaptersOf(sub);
                const done = list.filter((c) => s.lessons[`${grade.grade}/${sub.id}/${c.id}`]).length;
                const nextCh = list.find((c) => !s.lessons[`${grade.grade}/${sub.id}/${c.id}`]);
                return (
                  <li key={sub.id}>
                    <Link href={`/class/${grade.grade}/${sub.id}`} className="card card-hover block p-5">
                      <span className="flex items-center gap-3">
                        <SubjectIcon id={sub.id} solid />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-extrabold">{sub.name}</span>
                          <span className="block truncate text-xs font-semibold text-ink-3">{nextCh ? `Next: ${nextCh.title}` : "All done! Time to revise"}</span>
                        </span>
                      </span>
                      <span className="mt-4 flex items-center gap-3">
                        <ProgressBar value={(done / list.length) * 100} label={`${sub.name} progress`} color={styleFor(sub.id).bar} className="flex-1" />
                        <span className="text-xs font-extrabold tabular-nums text-ink-3">
                          {done}/{list.length}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="card p-6 text-ink-2">Pick your class from the top bar or the Learn page.</div>
          )}

          {grade && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <FlashcardsDueCard grade={grade.grade} />
              <DailyChallengeCard />
            </div>
          )}

          {grade && grade.grade >= 9 && (
            <Link href="/mock" className="card card-hover mt-6 flex items-center gap-4 p-5">
              <span className="grid size-12 place-items-center rounded-2xl bg-violet-500 text-white">
                <ClipboardCheck aria-hidden className="size-6" />
              </span>
              <span className="flex-1">
                <span className="block font-extrabold">Full-length mock tests</span>
                <span className="text-sm text-ink-3">Timed papers in the CBSE board pattern, marked instantly.</span>
              </span>
              <ArrowRight aria-hidden className="size-5 text-ink-3" />
            </Link>
          )}
        </section>

        {/* Right rail */}
        <aside className="space-y-6">
          {grade && <ReviseToday grade={grade.grade} />}
          {grade && grade.grade >= 9 && <ReadinessSummary grade={grade.grade} />}

          <section className="card p-5" aria-labelledby="today">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="today" className="flex items-center gap-2 font-extrabold">
                <CalendarDays aria-hidden className="size-5 text-brand-600" /> Today&apos;s plan
              </h2>
              <Link href="/planner" className="text-sm font-bold text-brand-600 hover:underline">
                Planner
              </Link>
            </div>
            {todays.length ? (
              <ul className="space-y-1">
                {todays.map((t) => (
                  <li key={t.id}>
                    <button type="button" onClick={() => actions.toggleTask(t.id)} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-surface-2">
                      <span className={cn("grid size-6 shrink-0 place-items-center rounded-lg border-2", t.done ? "border-green-500 bg-green-500 text-white" : "border-line-strong")}>
                        {t.done && <Check className="size-4" strokeWidth={3} aria-hidden />}
                      </span>
                      <span className={cn("text-sm font-semibold", t.done && "text-ink-3 line-through")}>{t.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-2">
                Nothing planned for today.{" "}
                <Link href="/planner" className="font-bold text-brand-600 hover:underline">
                  Add a task
                </Link>
              </p>
            )}
          </section>

          <section className="card p-5" aria-labelledby="badges">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="badges" className="flex items-center gap-2 font-extrabold">
                <Award aria-hidden className="size-5 text-amber-500" /> Badges
              </h2>
              <span className="text-sm font-bold text-ink-3">{badges.filter((b) => b.earned).length} earned</span>
            </div>
            <ul className="grid grid-cols-3 gap-3">
              {badges.slice(0, 6).map((b) => (
                <li key={b.id} className="text-center" title={b.desc}>
                  <span className={cn("mx-auto grid size-14 place-items-center rounded-2xl border-b-4", b.earned ? "border-amber-600 bg-amber-400 text-white" : "border-line-strong bg-surface-2 text-ink-3")}>
                    {b.earned ? <Award aria-hidden className="size-7" /> : <Lock aria-hidden className="size-5" />}
                  </span>
                  <span className="mt-1.5 block text-xs font-bold leading-tight">{b.name}</span>
                  <span className="sr-only">{b.earned ? "earned" : `${b.progress}% there`}</span>
                </li>
              ))}
            </ul>
            <Link href="/progress" className="mt-4 block text-center text-sm font-bold text-brand-600 hover:underline">
              See all badges
            </Link>
          </section>

          <div className="flex items-center gap-3 rounded-2xl bg-amber-50 p-4">
            <Zap aria-hidden className="size-6 shrink-0 fill-amber-400 text-amber-500" />
            <p className="text-sm text-ink-2">
              Earn XP: <strong className="text-ink">20</strong> per lesson, <strong className="text-ink">5</strong> per quiz plus 5 for every new correct answer, <strong className="text-ink">50</strong> per mock test.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
