import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "accent" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-2 font-bold whitespace-nowrap select-none rounded-md transition-[transform,box-shadow,background-color,color] duration-200 ease-[var(--ease-spring)] disabled:opacity-50 disabled:pointer-events-none [&_svg:last-child]:transition-transform hover:[&_svg:last-child]:translate-x-1";

// Primary/accent buttons sit on a solid "key" shadow and press down on click —
// a tactile detail that replaces glows and gradients.
const variants: Record<Variant, string> = {
  primary:
    "bg-royal-600 text-white shadow-[0_4px_0_0_var(--color-ink)] border-2 border-ink hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--color-ink)] hover:bg-royal-500 active:translate-y-[4px] active:shadow-none",
  accent:
    "bg-coral-500 text-ink shadow-[0_4px_0_0_var(--color-ink)] border-2 border-ink hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--color-ink)] hover:bg-sun-400 active:translate-y-[4px] active:shadow-none",
  secondary:
    "bg-surface text-ink border-2 border-ink shadow-[0_4px_0_0_var(--color-ink)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--color-ink)] hover:bg-sun-50 active:translate-y-[4px] active:shadow-none",
  ghost: "text-ink-2 hover:bg-sunken hover:text-ink",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-[15px]",
  lg: "h-13 px-6 text-base",
};

interface Common {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function Button({ variant = "primary", size = "md", icon, iconRight, className, children, ...rest }: Common & ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {icon}
      {children}
      {iconRight}
    </button>
  );
}

export function ButtonLink({ variant = "primary", size = "md", icon, iconRight, className, children, ...rest }: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {icon}
      {children}
      {iconRight}
    </Link>
  );
}
