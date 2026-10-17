import type { Metadata } from "next";
import { SavedList } from "@/components/features/SavedList";
import { Container, PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Saved" };

export default function SavedPage() {
  return (
    <>
      <PageHeader tone="lavender" eyebrow="Your bookmarks" title="Saved for revision" description="Chapters, notes and papers you've bookmarked. Stored on this device." />
      <Container className="py-8">
        <div className="max-w-3xl">
          <SavedList />
        </div>
      </Container>
    </>
  );
}
