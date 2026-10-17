import { BookOpenText, FlaskConical, Landmark, Languages, Pi } from "lucide-react";
import { cn } from "@/lib/cn";
import { hue } from "@/lib/hue";
import { subjectById } from "@/data/curriculum";
import type { SubjectId } from "@/lib/types";

const icons = { maths: Pi, science: FlaskConical, social: Landmark, english: BookOpenText, hindi: Languages };

export function SubjectIcon({ subject, size = "md", className }: { subject: SubjectId; size?: "sm" | "md" | "lg"; className?: string }) {
  const Icon = icons[subject];
  const s = subjectById(subject)!;
  const box = { sm: "size-8 rounded-sm", md: "size-10 rounded-md", lg: "size-14 rounded-lg" }[size];
  const glyph = { sm: "size-4", md: "size-5", lg: "size-7" }[size];
  return (
    <span className={cn("inline-grid shrink-0 place-items-center", hue[s.hue].chip, box, className)} aria-hidden>
      <Icon className={glyph} strokeWidth={2.2} />
    </span>
  );
}
