import type { Metadata } from "next";
import { WeekPlanner } from "@/components/features/WeekPlanner";
import { Container, PageHeader } from "@/components/layout/PageHeader";
import { SubjectIcon } from "@/components/ui/SubjectIcon";
import { examTimetable } from "@/data/student";

export const metadata: Metadata = { title: "Study planner" };

export default function PlannerPage() {
  return (
    <>
      <PageHeader eyebrow="12 – 18 October" title="Study planner" description="Small, daily blocks beat last-minute marathons. Tick tasks off as you go and watch the week fill up.">
        <div className="mt-8">
          <p className="eyebrow mb-3">Half-yearly timetable</p>
          <ol className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {examTimetable.map((e, i) => (
              <li key={e.date} className="flex min-w-[170px] items-center gap-3 rounded-lg border border-line bg-paper p-3">
                <SubjectIcon subject={e.subject} size="sm" />
                <div>
                  <p className="text-sm font-bold">{e.name}</p>
                  <p className="text-xs text-ink-3">
                    {e.day}, {e.date}
                    {i === 0 && <span className="font-semibold text-coral-700"> · in 10 days</span>}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </PageHeader>
      <Container className="py-8">
        <WeekPlanner />
      </Container>
    </>
  );
}
