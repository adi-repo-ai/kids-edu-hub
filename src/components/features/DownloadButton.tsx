"use client";

import { Check, Download } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { useAppState } from "./AppState";

/** Three states: idle → preparing (spinner bar) → done. Files are not attached in this preview. */
export function DownloadButton({ label, sizeKb, compact }: { label: string; sizeKb?: number; compact?: boolean }) {
  const { toast } = useAppState();
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const size = sizeKb ? (sizeKb > 1000 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`) : null;
  return (
    <button
      type="button"
      aria-label={`Download ${label}${size ? `, PDF ${size}` : ""}`}
      disabled={state === "busy"}
      onClick={() => {
        setState("busy");
        setTimeout(() => {
          setState("done");
          toast(`“${label}” saved to Downloads`);
        }, 700);
      }}
      className={cn(
        "relative inline-flex min-h-10 items-center gap-1.5 overflow-hidden rounded-md border text-sm font-semibold transition-colors",
        compact ? "px-2.5" : "px-3",
        state === "done" ? "border-mint-200 bg-mint-50 text-mint-700" : "border-line-strong bg-surface text-ink hover:border-ink-3",
      )}
    >
      {state === "done" ? <Check aria-hidden className="size-4" strokeWidth={3} /> : <Download aria-hidden className="size-4" />}
      {!compact && (state === "done" ? "Downloaded" : "PDF")}
      {!compact && size && state !== "done" && <span className="font-normal text-ink-3">{size}</span>}
      {state === "busy" && <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 origin-left animate-[grow_700ms_ease-out_forwards] bg-royal-500" />}
    </button>
  );
}
