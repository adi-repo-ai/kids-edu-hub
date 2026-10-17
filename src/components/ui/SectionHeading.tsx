import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  action,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  action?: { href: string; label: string };
  id?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        <h2 id={id} className="text-xl font-bold sm:text-2xl">
          {title}
        </h2>
      </div>
      {action && (
        <Link href={action.href} className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-royal-700 hover:underline">
          {action.label}
          <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
