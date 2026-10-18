import type { Metadata } from "next";
import { PageTitle } from "@/components/layout/PageTitle";
import { ProgressView } from "@/components/progress/ProgressView";

export const metadata: Metadata = { title: "My progress" };

export default function ProgressPage() {
  return (
    <>
      <PageTitle eyebrow="Your learning" title="My progress" sub="XP, streaks, badges and how far you've come in each subject." />
      <ProgressView />
    </>
  );
}
