import type { Metadata } from "next";
import { ParentView } from "@/components/features/ParentView";
import { Container, PageHeader } from "@/components/layout/PageHeader";
import { parent } from "@/data/student";

export const metadata: Metadata = { title: "Parent dashboard" };

export default function ParentPage() {
  return (
    <>
      <PageHeader eyebrow="Parent dashboard" title={`Namaste, ${parent.name.split(" ")[0]}`} description="A calm weekly picture of learning: effort, understanding and where a little encouragement will help." />
      <Container className="py-8">
        <ParentView />
      </Container>
    </>
  );
}
