import type { MascotColor, MascotExtra, MascotGlasses, MascotHat, MascotNeck } from "@/components/ui/Mascot";

/**
 * Gyani's shop. Everything is bought with coins earned from XP (1 coin per 10 XP),
 * never with money. Item ids are stored in progress (`owned`, `equipped`), so never rename one.
 */
export type Slot = "hat" | "glasses" | "neck" | "color" | "extra";

export interface ShopItem {
  id: string;
  slot: Slot;
  price: number;
  name: { en: string; hi: string };
  /** Festival special, shown with a badge. */
  festival?: { en: string; hi: string };
}

export const SLOTS: Slot[] = ["hat", "glasses", "neck", "color", "extra"];

export const shopItems: ShopItem[] = [
  { id: "grad-cap", slot: "hat", price: 40, name: { en: "Graduation cap", hi: "दीक्षांत टोपी" } },
  { id: "cricket-cap", slot: "hat", price: 30, name: { en: "Cricket cap", hi: "क्रिकेट कैप" } },
  { id: "party-hat", slot: "hat", price: 20, name: { en: "Party hat", hi: "पार्टी टोपी" } },
  { id: "crown", slot: "hat", price: 120, name: { en: "Golden crown", hi: "सुनहरा मुकुट" } },
  { id: "safa", slot: "hat", price: 80, name: { en: "Festive safa", hi: "उत्सव का साफ़ा" }, festival: { en: "Weddings & festivals", hi: "शादी और त्योहार" } },
  { id: "round-specs", slot: "glasses", price: 25, name: { en: "Round specs", hi: "गोल चश्मा" } },
  { id: "sunglasses", slot: "glasses", price: 50, name: { en: "Cool sunglasses", hi: "धूप का चश्मा" } },
  { id: "scarf", slot: "neck", price: 30, name: { en: "Winter scarf", hi: "ऊनी मफ़लर" } },
  { id: "bow-tie", slot: "neck", price: 35, name: { en: "Bow tie", hi: "बो टाई" } },
  { id: "medal", slot: "neck", price: 100, name: { en: "Gold medal", hi: "स्वर्ण पदक" } },
  { id: "marigold", slot: "neck", price: 60, name: { en: "Marigold garland", hi: "गेंदे की माला" }, festival: { en: "Diwali & Dussehra", hi: "दीवाली और दशहरा" } },
  { id: "green", slot: "color", price: 60, name: { en: "Parrot green", hi: "तोता हरा" } },
  { id: "purple", slot: "color", price: 60, name: { en: "Jamun purple", hi: "जामुनी" } },
  { id: "orange", slot: "color", price: 60, name: { en: "Mango orange", hi: "आम नारंगी" } },
  { id: "pink", slot: "color", price: 60, name: { en: "Gulabi pink", hi: "गुलाबी" } },
  { id: "diya", slot: "extra", price: 45, name: { en: "Diwali diya", hi: "दीवाली का दीया" }, festival: { en: "Diwali", hi: "दीवाली" } },
];

export const itemById = (id: string | undefined) => (id ? shopItems.find((i) => i.id === id) : undefined);

/** Props for <Mascot> from an `equipped` map. Unknown or unowned ids are ignored. */
export function outfitOf(equipped: Record<string, string>, owned: string[]) {
  const pick = (slot: Slot) => {
    const it = itemById(equipped[slot]);
    return it && it.slot === slot && owned.includes(it.id) ? it.id : undefined;
  };
  return {
    hat: pick("hat") as MascotHat | undefined,
    glasses: pick("glasses") as MascotGlasses | undefined,
    neck: pick("neck") as MascotNeck | undefined,
    color: pick("color") as MascotColor | undefined,
    extra: pick("extra") as MascotExtra | undefined,
  };
}
