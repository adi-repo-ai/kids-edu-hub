import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 rounded-md" aria-label="Kaksha home">
      <svg viewBox="0 0 36 36" className="size-9" aria-hidden>
        <rect x="1" y="1" width="34" height="34" rx="9" fill="var(--color-royal-600)" />
        <path d="M12 9v18M24 9.5l-10.5 9.8M16.5 16.5L25 27" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        <path d="M9 30.5c5-1.6 12-1.8 18-.4" stroke="var(--color-sun-400)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      </svg>
      <span className="font-display text-[22px] font-extrabold tracking-tight">
        Kaksha<span className="text-coral-500">.</span>
      </span>
    </Link>
  );
}
