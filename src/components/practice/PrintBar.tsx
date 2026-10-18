"use client";

import { asset } from "@/lib/asset";
import { Printer } from "lucide-react";

export function PrintBar({ pdf }: { pdf?: string }) {
  return (
    <div className="no-print sticky top-0 z-10 flex items-center justify-end gap-2 border-b border-line bg-surface/95 px-6 py-3 backdrop-blur">
      {pdf && (
        <a href={asset(pdf)} download className="inline-flex h-10 items-center rounded-xl border-2 border-b-4 border-line-strong px-4 text-sm font-bold hover:bg-surface-2">
          Download PDF
        </a>
      )}
      <button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-xl border-b-4 border-brand-700 bg-brand-500 px-4 text-sm font-bold text-white">
        <Printer aria-hidden className="size-4" /> Print
      </button>
    </div>
  );
}
