"use client";

import { Coins } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { strings, useT } from "@/lib/i18n";
import { coinsOf, levelOf, useHydrated, useStore } from "@/lib/store";

const S = strings({
  en: { label: (c: number, l: number) => `${c} coins, level ${l}. Open Gyani's shop`, lvl: "Lv" },
  hi: { label: (c: number, l: number) => `${c} सिक्के, लेवल ${l}। ज्ञानी की दुकान खोलो`, lvl: "लेवल" },
});

/** Coins and level for the top bar; links to Gyani's shop. */
export function CoinBadge({ className }: { className?: string }) {
  const hydrated = useHydrated();
  const t = useT(S);
  const coins = useStore(coinsOf);
  const level = useStore((s) => levelOf(s.xp).level);
  if (!hydrated) return null;
  return (
    <Link href="/shop" aria-label={t.label(coins, level)} className={cn("flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-sm font-extrabold text-amber-700 hover:bg-amber-50", className)}>
      <Coins aria-hidden className="size-5 text-amber-500" />
      <span className="tabular-nums">{coins.toLocaleString("en-IN")}</span>
      <span aria-hidden className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[11px] font-extrabold text-brand-700">
        {t.lvl} {level}
      </span>
    </Link>
  );
}
