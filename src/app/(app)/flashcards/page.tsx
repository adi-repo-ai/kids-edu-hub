import type { Metadata } from "next";
import { Suspense } from "react";
import { Flashcards } from "@/components/revise/Flashcards";

export const metadata: Metadata = { title: "Flashcards" };

export default function FlashcardsPage() {
  return (
    <Suspense fallback={<div className="h-96" />}>
      <Flashcards />
    </Suspense>
  );
}
