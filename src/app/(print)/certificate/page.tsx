import type { Metadata } from "next";
import { Suspense } from "react";
import { Certificate } from "@/components/motivate/Certificate";

export const metadata: Metadata = { title: "Certificate", robots: { index: false } };

export default function CertificatePage() {
  return (
    <Suspense fallback={<div className="h-dvh" />}>
      <Certificate />
    </Suspense>
  );
}
