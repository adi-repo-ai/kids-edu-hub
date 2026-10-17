import type { Metadata } from "next";
import { NewsList } from "@/components/features/NewsList";
import { Container, PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "CBSE news & announcements" };

export default function NewsPage() {
  return (
    <>
      <PageHeader eyebrow="Notice board" title="CBSE news & announcements" description="Board circulars, exam dates and school notices, explained in plain words." />
      <Container className="py-10">
        <NewsList />
      </Container>
    </>
  );
}
