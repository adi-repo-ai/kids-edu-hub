import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Sticker-style card: ink outline + hard shadow. `interactive` adds a springy lift on hover. */
export function Card({ className, interactive, ...rest }: ComponentProps<"div"> & { interactive?: boolean }) {
  return <div className={cn("sticker bg-surface", interactive && "sticker-hover", className)} {...rest} />;
}
