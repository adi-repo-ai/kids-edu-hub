import type { Metadata } from "next";
import { PageTitle } from "@/components/layout/PageTitle";
import { Planner } from "@/components/progress/Planner";

export const metadata: Metadata = { title: "Study planner" };

export default function PlannerPage() {
  return (
    <>
      <PageTitle eyebrow="Plan your week" title="Study planner" sub="Small daily blocks beat last-minute marathons. Add tasks, tick them off, and earn XP." />
      <Planner />
    </>
  );
}
