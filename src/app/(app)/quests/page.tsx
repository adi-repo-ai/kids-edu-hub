import type { Metadata } from "next";
import { Quests } from "@/components/motivate/Quests";

export const metadata: Metadata = { title: "Quests" };

export default function QuestsPage() {
  return <Quests />;
}
