import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Hue } from "@/lib/types";
import { SparkDoodle, StarDoodle } from "../ui/Doodles";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

const tones: Record<Hue, { band: string; eyebrow: string; doodle: string }> = {
  royal: { band: "bg-royal-100", eyebrow: "text-royal-700", doodle: "text-royal-500" },
  coral: { band: "bg-coral-100", eyebrow: "text-coral-700", doodle: "text-coral-500" },
  sun: { band: "bg-sun-100", eyebrow: "text-sun-800", doodle: "text-sun-500" },
  mint: { band: "bg-mint-100", eyebrow: "text-mint-700", doodle: "text-mint-600" },
  lavender: { band: "bg-lavender-100", eyebrow: "text-lavender-700", doodle: "text-lavender-500" },
};

/** Colour-band page header: handwritten eyebrow, big display title, two floating doodles. */
export function PageHeader({
  crumbs,
  eyebrow,
  title,
  description,
  actions,
  children,
  tone = "sun",
}: {
  crumbs?: { href: string; label: string }[];
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  tone?: Hue;
}) {
  const t = tones[tone];
  return (
    <div className={cn("dots relative overflow-hidden border-b-[3px] border-ink", t.band)}>
      <StarDoodle className={cn("animate-float pointer-events-none absolute right-[8%] top-6 hidden w-12 md:block", t.doodle)} />
      <SparkDoodle className={cn("animate-spin-slow pointer-events-none absolute bottom-6 right-[22%] hidden w-10 opacity-70 lg:block", t.doodle)} />
      <Container className="relative py-9 sm:py-12">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1 text-sm font-semibold text-ink-2">
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight aria-hidden className="size-3.5" />}
                  <Link href={c.href} className="rounded-sm px-1 hover:bg-surface hover:text-ink">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {eyebrow && <p className={cn("hand animate-bounce-in mb-1 text-2xl sm:text-3xl", t.eyebrow)}>{eyebrow}</p>}
            <h1 className="animate-slide-up text-4xl font-extrabold leading-[1.05] sm:text-5xl">{title}</h1>
            {description && <p className="mt-3 text-base text-ink-2 sm:text-lg">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
        </div>
        {children}
      </Container>
    </div>
  );
}
