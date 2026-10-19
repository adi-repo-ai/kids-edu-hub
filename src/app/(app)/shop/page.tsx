import type { Metadata } from "next";
import { Shop } from "@/components/motivate/Shop";

export const metadata: Metadata = { title: "Gyani's shop" };

export default function ShopPage() {
  return <Shop />;
}
