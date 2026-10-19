import type { Metadata } from "next";
import { Suspense } from "react";
import { Revise } from "@/components/revise/Revise";

export const metadata: Metadata = { title: "Revision path" };

export default function RevisePage() {
  return (
    <Suspense fallback={<div className="h-96" />}>
      <Revise />
    </Suspense>
  );
}
