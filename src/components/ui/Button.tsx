import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "success" | "secondary" | "ghost" | "danger" | "white";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl font-bold transition-[transform,background-color,border-color,box-shadow] duration-150 disabled:pointer-events-none disabled:opacity-50";

// App-style "pressable" buttons: a darker bottom edge that collapses on press.
const variants: Record<Variant, string> = {
  primary: "bg-brand-500 text-white border-b-4 border-brand-700 hover:bg-brand-400 active:translate-y-[2px] active:border-b-2",
  success: "bg-green-500 text-white border-b-4 border-green-700 hover:bg-green-400 active:translate-y-[2px] active:border-b-2",
  danger: "bg-coral-500 text-white border-b-4 border-coral-700 hover:bg-coral-600 active:translate-y-[2px] active:border-b-2",
  secondary: "bg-surface text-ink border-2 border-b-4 border-line-strong hover:bg-surface-2 active:translate-y-[2px] active:border-b-2",
  white: "bg-white text-brand-700 border-b-4 border-brand-200 hover:bg-brand-50 active:translate-y-[2px] active:border-b-2",
  ghost: "text-ink-2 hover:bg-surface-2 hover:text-ink",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-base",
};

type Common = { variant?: Variant; size?: Size; icon?: ReactNode; iconRight?: ReactNode; className?: string; children?: ReactNode };

export const buttonClass = (variant: Variant = "primary", size: Size = "md", className?: string) => cn(base, variants[variant], sizes[size], className);

export function Button({ variant, size, icon, iconRight, className, children, type = "button", ...rest }: Common & ComponentProps<"button">) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...rest}>
      {icon}
      {children}
      {iconRight}
    </button>
  );
}

export function ButtonLink({ variant, size, icon, iconRight, className, children, ...rest }: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClass(variant, size, className)} {...rest}>
      {icon}
      {children}
      {iconRight}
    </Link>
  );
}
