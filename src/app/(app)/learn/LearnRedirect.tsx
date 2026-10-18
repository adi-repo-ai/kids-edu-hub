"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";

/** Shortcut back to the learner's own class at the top of the class list. */
export function LearnRedirect() {
  const grade = useStore((s) => s.profile.grade);
  if (!grade) return null;
  return (
    <Link href={`/class/${grade}`} className="mb-8 flex items-center justify-between rounded-2xl bg-brand-500 px-5 py-4 text-white shadow-glow transition-transform hover:-translate-y-0.5">
      <span>
        <span className="block text-sm font-semibold text-brand-100">Continue in your class</span>
        <span className="text-xl font-extrabold">Class {grade} subjects</span>
      </span>
      <ArrowRight aria-hidden className="size-6" />
    </Link>
  );
}
