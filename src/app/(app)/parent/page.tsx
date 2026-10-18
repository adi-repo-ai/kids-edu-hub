import type { Metadata } from "next";
import { PageTitle } from "@/components/layout/PageTitle";
import { ParentView } from "@/components/progress/ParentView";

export const metadata: Metadata = { title: "Parent view" };

export default function ParentPage() {
  return (
    <>
      <PageTitle eyebrow="For parents" title="Parent view" sub="A calm weekly summary of effort, understanding and progress in each subject." />
      <ParentView />
    </>
  );
}
