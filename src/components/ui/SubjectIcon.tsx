import { cn } from "@/lib/cn";
import { styleFor } from "@/lib/subjects";

export function SubjectIcon({ id, size = "md", solid, className }: { id: string; size?: "sm" | "md" | "lg" | "xl"; solid?: boolean; className?: string }) {
  const st = styleFor(id);
  const Icon = st.icon;
  const box = { sm: "size-8 rounded-lg", md: "size-11 rounded-xl", lg: "size-14 rounded-2xl", xl: "size-20 rounded-3xl" }[size];
  const glyph = { sm: "size-4", md: "size-5", lg: "size-7", xl: "size-10" }[size];
  return (
    <span className={cn("inline-grid shrink-0 place-items-center", solid ? st.solid : st.soft, box, className)} aria-hidden>
      <Icon className={glyph} strokeWidth={2.2} />
    </span>
  );
}
