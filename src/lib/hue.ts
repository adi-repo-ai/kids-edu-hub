import type { Hue } from "./types";

/**
 * Hue → utility classes. Kept as literal strings so Tailwind can see them.
 *  chip:  tinted background + accessible foreground (icon chips, tags)
 *  fill:  solid fill for bars, dots and illustration
 *  text:  accessible foreground on white/paper
 *  soft:  very light wash for large surfaces
 *  ring:  border colour for selected/active states
 */
export const hue: Record<Hue, { chip: string; fill: string; text: string; soft: string; ring: string; hex: string }> = {
  royal: { chip: "bg-royal-100 text-royal-700", fill: "bg-royal-500", text: "text-royal-700", soft: "bg-royal-50", ring: "border-royal-500", hex: "#4361ee" },
  coral: { chip: "bg-coral-100 text-coral-700", fill: "bg-coral-500", text: "text-coral-700", soft: "bg-coral-50", ring: "border-coral-500", hex: "#f26b45" },
  sun: { chip: "bg-sun-100 text-sun-800", fill: "bg-sun-400", text: "text-sun-800", soft: "bg-sun-50", ring: "border-sun-500", hex: "#ffc93c" },
  mint: { chip: "bg-mint-100 text-mint-700", fill: "bg-mint-500", text: "text-mint-700", soft: "bg-mint-50", ring: "border-mint-500", hex: "#2db88c" },
  lavender: { chip: "bg-lavender-100 text-lavender-700", fill: "bg-lavender-500", text: "text-lavender-700", soft: "bg-lavender-50", ring: "border-lavender-500", hex: "#8f7cf2" },
};
