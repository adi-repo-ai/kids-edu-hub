import type { Metadata } from "next";
import { LibraryBrowser } from "@/components/features/LibraryBrowser";
import { Container, PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Notes & worksheets" };

export default function LibraryPage() {
  return (
    <>
      <PageHeader tone="lavender"
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/library", label: "Notes" },
        ]}
        eyebrow="Class 8 · Study material"
        title="Notes, worksheets & downloads"
        description="Printable, teacher-checked material for every chapter. Each file is a light PDF that opens well on a phone."
      />
      <Container className="py-8">
        <LibraryBrowser />
      </Container>
    </>
  );
}
