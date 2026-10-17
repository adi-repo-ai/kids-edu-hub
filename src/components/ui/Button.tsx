import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "accent" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap select-none rounded-md transition-[transform,box-shadow,background-color,color] duration-150 ease-out disabled:opacity-50 disabled:pointer-events-none";

// Primary/accent buttons sit on a solid "key" shadow and press down on click —
// a tactile detail that replaces glows and gradients.
const variants: Record<Variant, string> = {
  primary:
    "bg-royal-600 text-white shadow-[0_3px_0_0_var(--color-royal-800)] hover:bg-royal-700 active:translate-y-[3px] active:shadow-none",
  accent:
    "bg-coral-500 text-ink shadow-[0_3px_0_0_var(--color-coral-700)] hover:bg-coral-600 active:translate-y-[3px] active:shadow-none",
  secondary:
    "bg-surface text-ink border border-line-strong shadow-[0_2px_0_0_var(--color-line-strong)] hover:border-ink-3 active:translate-y-[2px] active:shadow-none",
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
