import type { Metadata } from "next";
import { PageTitle } from "@/components/layout/PageTitle";
import { SavedList } from "@/components/progress/SavedList";

export const metadata: Metadata = { title: "Saved" };

export default function SavedPage() {
  return (
    <>
      <PageTitle eyebrow="Revision list" title="Saved chapters" sub="Chapters you've bookmarked, saved on this device." />
      <div className="max-w-3xl">
        <SavedList />
      </div>
    </>
  );
}
