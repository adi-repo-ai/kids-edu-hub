import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function PageHeader({
  crumbs,
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  crumbs?: { href: string; label: string }[];
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-line bg-surface">
      <Container className="py-8 sm:py-10">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-ink-3">
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight aria-hidden className="size-3.5" />}
                  <Link href={c.href} className="hover:text-ink hover:underline">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
            <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
            {description && <p className="mt-3 text-base text-ink-2 sm:text-lg">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
        </div>
        {children}
      </Container>
    </div>
  );
}
