import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 rounded-lg" aria-label="Kaksha home">
      <svg viewBox="0 0 36 36" className="size-9" aria-hidden>
        <rect width="36" height="36" rx="10" fill="var(--color-brand-500)" />
        <path d="M11.5 9v18M24 9.5 13.2 19.3M17 16.6 25 27" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" fill="none" />
        <circle cx="27" cy="9" r="3" fill="#fbbf24" />
      </svg>
      <span className="text-xl font-extrabold tracking-tight">Kaksha</span>
    </Link>
  );
}
