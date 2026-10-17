import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, interactive, ...rest }: ComponentProps<"div"> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-surface shadow-card",
        interactive && "transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift",
        className,
      )}
      {...rest}
    />
  );
}
