import type { Metadata } from "next";
import { Suspense } from "react";
import { PapersBrowser } from "@/components/features/PapersBrowser";
import { Container, PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Previous year CBSE papers" };

export default function PapersPage() {
  return (
    <>
      <PageHeader tone="royal"
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/papers", label: "Past papers" },
        ]}
        eyebrow="Board examinations"
        title="Previous CBSE question papers"
        description="Class 10 and 12 board papers with the official marking scheme and step-by-step solutions written by our teachers."
      />
      <Container className="py-8">
        <Suspense>
          <PapersBrowser />
        </Suspense>
      </Container>
    </>
  );
}
