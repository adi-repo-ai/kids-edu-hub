"use client";

import { Check, Coins, Eye, PartyPopper, RotateCcw, Shirt, ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { confettiFrom } from "@/lib/confetti";
import { strings, useLang, useT } from "@/lib/i18n";
import { SLOTS, itemById, outfitOf, shopItems, type ShopItem, type Slot } from "@/lib/shop";
import { LEVEL_XP, actions, coinsOf, levelOf, useHydrated, useStore } from "@/lib/store";
import { toast } from "@/lib/toast";
import { PageTitle } from "../layout/PageTitle";
import { Button, ButtonLink } from "../ui/Button";
import { Mascot, type MascotOutfit } from "../ui/Mascot";
import { ProgressBar } from "../ui/Progress";

const S = strings({
  en: {
    eyebrow: "Dress up Gyani",
    title: "Gyani's shop",
    sub: "Spend coins you earn by learning on outfits for Gyani. You get 1 coin for every 10 XP. Coins can never be bought with money.",
    coins: "Your coins",
    level: (l: number) => `Level ${l}`,
    toNext: (n: number) => `${n} XP to the next level`,
    earnMore: "Earn more coins",
    preview: "Live preview",
    trying: (name: string) => `Trying on: ${name}`,
    wearing: "This is Gyani's outfit now.",
    backToMine: "Back to my outfit",
    slots: { hat: "Hats", glasses: "Glasses", neck: "Neckwear", color: "Feather colour", extra: "Festive extras" } as Record<Slot, string>,
    classicBlue: "Classic blue",
    free: "Free",
    owned: "Owned",
    wearingNow: "Wearing",
    price: (n: number) => `${n} coins`,
    buy: (n: number) => `Buy · ${n}`,
    wear: "Wear",
    takeOff: "Take off",
    tryOn: "Try on",
    tryOnLabel: (name: string) => `Try on ${name}`,
    need: (n: number) => `${n} more coin${n === 1 ? "" : "s"} needed`,
    notEnough: (n: number, name: string) => `You need ${n} more coin${n === 1 ? "" : "s"} for the ${name}. Keep learning!`,
    bought: (name: string) => `You bought the ${name}! Gyani is wearing it.`,
    festival: "Festival special",
  },
  hi: {
    eyebrow: "ज्ञानी को सजाओ",
    title: "ज्ञानी की दुकान",
    sub: "पढ़ाई से कमाए सिक्कों से ज्ञानी के लिए कपड़े और चीज़ें लो। हर 10 XP पर 1 सिक्का मिलता है। सिक्के कभी पैसे से नहीं ख़रीदे जा सकते।",
    coins: "तुम्हारे सिक्के",
    level: (l: number) => `लेवल ${l}`,
    toNext: (n: number) => `अगले लेवल तक ${n} XP`,
    earnMore: "और सिक्के कमाओ",
    preview: "लाइव झलक",
    trying: (name: string) => `पहनकर देख रहे हो: ${name}`,
    wearing: "यह ज्ञानी का अभी का पहनावा है।",
    backToMine: "मेरे पहनावे पर लौटो",
    slots: { hat: "टोपियाँ", glasses: "चश्मे", neck: "गले के लिए", color: "पंखों का रंग", extra: "त्योहार की चीज़ें" } as Record<Slot, string>,
    classicBlue: "क्लासिक नीला",
    free: "मुफ़्त",
    owned: "तुम्हारा है",
    wearingNow: "पहना है",
    price: (n: number) => `${n} सिक्के`,
    buy: (n: number) => `ख़रीदो · ${n}`,
    wear: "पहनाओ",
    takeOff: "उतारो",
    tryOn: "पहनकर देखो",
    tryOnLabel: (name: string) => `${name} पहनकर देखो`,
    need: (n: number) => `${n} सिक्के और चाहिए`,
    notEnough: (n: number, name: string) => `${name} के लिए ${n} सिक्के और चाहिए। पढ़ते रहो!`,
    bought: (name: string) => `तुमने ${name} ख़रीद लिया! ज्ञानी ने इसे पहन लिया है।`,
    festival: "त्योहार स्पेशल",
  },
});

/** Mascot props for a single item (used for thumbnails and try-on). */
const propsFor = (item: ShopItem): MascotOutfit => ({ [item.slot]: item.id }) as MascotOutfit;

export function Shop() {
  const hydrated = useHydrated();
  const t = useT(S);
  const lang = useLang();
  const xp = useStore((s) => s.xp);
  const coins = useStore(coinsOf);
  const owned = useStore((s) => s.owned);
  const equipped = useStore((s) => s.equipped);
  // Try-on overrides per slot: an item id, or null for "nothing / classic blue".
  const [tryOn, setTryOn] = useState<Partial<Record<Slot, string | null>>>({});
  if (!hydrated) return <div className="h-96" />;

  const mine = outfitOf(equipped, owned);
  const outfit: MascotOutfit = { ...mine };
  const trying: string[] = [];
  SLOTS.forEach((slot) => {
    const v = tryOn[slot];
    if (v === undefined || (v ?? undefined) === mine[slot]) return;
    (outfit as Record<string, string | undefined>)[slot] = v ?? undefined;
    trying.push(v ? (itemById(v)?.name[lang] ?? v) : t.classicBlue);
  });
  /** Set or clear a try-on override (undefined = show what Gyani is wearing). */
  const setTry = (slot: Slot, v: string | null | undefined) =>
    setTryOn((p) => {
      const n = { ...p };
      if (v === undefined) delete n[slot];
      else n[slot] = v;
      return n;
    });
  const lv = levelOf(xp);

  const buy = (item: ShopItem, el: HTMLElement) => {
    const name = item.name[lang];
    if (!actions.buy(item.id, item.price)) {
      toast(t.notEnough(Math.max(0, item.price - coins), name), "info");
      return;
    }
    actions.equip(item.slot, item.id);
    setTry(item.slot, undefined);
    confettiFrom(el, { count: 70 });
    toast(t.bought(name));
  };

  const wear = (slot: Slot, id: string | null) => {
    actions.equip(slot, id);
    setTry(slot, undefined);
  };

  return (
    <div lang={lang}>
      <PageTitle eyebrow={t.eyebrow} title={t.title} sub={t.sub} />
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="min-w-0">
          <div className="card space-y-4 p-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow">{t.coins}</p>
                <p className="flex items-center gap-1.5 text-3xl font-extrabold tabular-nums text-amber-700">
                  <Coins aria-hidden className="size-7 text-amber-500" />
                  {coins.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-brand-700">{t.level(lv.level)}</p>
                <p className="text-xs font-semibold text-ink-3">{t.toNext(LEVEL_XP - lv.into)}</p>
              </div>
            </div>
            <ProgressBar value={lv.pct} label={t.level(lv.level)} color="bg-brand-500" size="sm" />

            <div className="rounded-2xl bg-surface-2 p-4">
              <p className="eyebrow mb-2 flex items-center gap-1.5">
                <Eye aria-hidden className="size-3.5" />
                {t.preview}
              </p>
              <div className="grid place-items-center pb-2 pt-6">
                <Mascot mood={trying.length ? "cheer" : "happy"} size={170} {...outfit} />
              </div>
              <p aria-live="polite" className="text-center text-sm font-semibold text-ink-2">{trying.length ? t.trying(trying.join(", ")) : t.wearing}</p>
              {trying.length > 0 && (
                <Button variant="secondary" size="sm" className="mt-3 w-full" icon={<RotateCcw aria-hidden className="size-4" />} onClick={() => setTryOn({})}>
                  {t.backToMine}
                </Button>
              )}
            </div>
            <ButtonLink href="/quests" variant="ghost" size="sm" className="w-full" icon={<Sparkles aria-hidden className="size-4" />}>
              {t.earnMore}
            </ButtonLink>
          </div>
        </aside>

        <div className="min-w-0 space-y-8">
          {SLOTS.map((slot) => {
            const items = shopItems.filter((i) => i.slot === slot);
            return (
              <section key={slot} aria-labelledby={`slot-${slot}`}>
                <h2 id={`slot-${slot}`} className="mb-3 text-xl font-extrabold">
                  {t.slots[slot]}
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {slot === "color" && (
                    <ClassicBlue
                      wearing={!mine.color}
                      previewing={tryOn.color === null}
                      onTry={() => setTry("color", tryOn.color === null ? undefined : null)}
                      onWear={() => wear("color", null)}
                    />
                  )}
                  {items.map((item) => {
                    const has = owned.includes(item.id);
                    const on = mine[slot] === item.id;
                    const previewing = tryOn[slot] === item.id;
                    const name = item.name[lang];
                    const short = item.price - coins;
                    return (
                      <article key={item.id} className={cn("card flex min-w-0 flex-col p-3", on && "ring-2 ring-green-400", previewing && !on && "ring-2 ring-brand-300")}>
                        <button
                          type="button"
                          aria-pressed={previewing}
                          aria-label={t.tryOnLabel(name)}
                          onClick={() => setTry(slot, previewing ? undefined : item.id)}
                          className="grid place-items-center rounded-xl bg-surface-2 pb-2 pt-4 hover:bg-brand-50"
                        >
                          <Mascot still size={72} mood="happy" {...propsFor(item)} />
                        </button>
                        <p className="mt-2 text-sm font-extrabold leading-tight">{name}</p>
                        {item.festival && (
                          <p className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-coral-50 px-2 py-0.5 text-[11px] font-bold text-coral-700">
                            <PartyPopper aria-hidden className="size-3" />
                            {item.festival[lang]}
                          </p>
                        )}
                        <p className="mt-1 text-xs font-bold text-ink-3">
                          {on ? (
                            <span className="text-green-700">{t.wearingNow}</span>
                          ) : has ? (
                            t.owned
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-700">
                              <Coins aria-hidden className="size-3.5" />
                              {t.price(item.price)}
                            </span>
                          )}
                        </p>
                        {!has && short > 0 && <p className="mt-0.5 text-[11px] font-semibold text-ink-3">{t.need(short)}</p>}
                        <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
                          {has ? (
                            on ? (
                              <Button variant="secondary" size="sm" className="flex-1" onClick={() => wear(slot, null)}>
                                {t.takeOff}
                              </Button>
                            ) : (
                              <Button variant="success" size="sm" className="flex-1" icon={<Shirt aria-hidden className="size-4" />} onClick={() => wear(slot, item.id)}>
                                {t.wear}
                              </Button>
                            )
                          ) : (
                            <Button variant={short > 0 ? "secondary" : "primary"} size="sm" className="flex-1" icon={<ShoppingBag aria-hidden className="size-4" />} onClick={(e) => buy(item, e.currentTarget)}>
                              {t.buy(item.price)}
                            </Button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ClassicBlue({ wearing, previewing, onTry, onWear }: { wearing: boolean; previewing: boolean; onTry: () => void; onWear: () => void }) {
  const t = useT(S);
  return (
    <article className={cn("card flex min-w-0 flex-col p-3", wearing && "ring-2 ring-green-400", previewing && !wearing && "ring-2 ring-brand-300")}>
      <button type="button" aria-pressed={previewing} aria-label={t.tryOnLabel(t.classicBlue)} onClick={onTry} className="grid place-items-center rounded-xl bg-surface-2 pb-2 pt-4 hover:bg-brand-50">
        <Mascot still size={72} mood="happy" />
      </button>
      <p className="mt-2 text-sm font-extrabold leading-tight">{t.classicBlue}</p>
      <p className="mt-1 text-xs font-bold text-ink-3">{wearing ? <span className="text-green-700">{t.wearingNow}</span> : t.free}</p>
      <div className="mt-auto pt-3">
        {wearing ? (
          <p className="flex h-9 items-center justify-center gap-1 text-sm font-bold text-green-700">
            <Check aria-hidden className="size-4" />
            {t.wearingNow}
          </p>
        ) : (
          <Button variant="success" size="sm" className="w-full" icon={<Shirt aria-hidden className="size-4" />} onClick={onWear}>
            {t.wear}
          </Button>
        )}
      </div>
    </article>
  );
}
