"use client";

import { CircleCheck, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { onToast } from "@/lib/toast";

export function Toaster() {
  const [msg, setMsg] = useState<{ id: number; text: string; tone: "success" | "info" } | null>(null);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const off = onToast((m) => {
      setMsg(m);
      clearTimeout(t);
      t = setTimeout(() => setMsg(null), 2800);
    });
    return () => {
      off();
      clearTimeout(t);
    };
  }, []);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 lg:bottom-8">
      {msg && (
        <div key={msg.id} className="animate-rise flex items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-float">
          {msg.tone === "success" ? <CircleCheck aria-hidden className="size-4 text-green-400" /> : <Info aria-hidden className="size-4 text-brand-300" />}
          {msg.text}
        </div>
      )}
    </div>
  );
}
