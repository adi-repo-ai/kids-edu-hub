"use client";

import type { ComponentProps } from "react";
import { outfitOf } from "@/lib/shop";
import { useStore } from "@/lib/store";
import { Mascot } from "./Mascot";

/** The learner's own Gyani, wearing what they equipped in the shop. */
export function MyMascot(props: Omit<ComponentProps<typeof Mascot>, "hat" | "glasses" | "neck" | "color" | "extra">) {
  const equipped = useStore((s) => s.equipped);
  const owned = useStore((s) => s.owned);
  return <Mascot {...props} {...outfitOf(equipped, owned)} />;
}
