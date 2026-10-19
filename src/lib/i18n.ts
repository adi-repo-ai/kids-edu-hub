"use client";

import { useStore } from "./store";

/*
 * Tiny translation helper for the Hindi interface. Each component or page keeps its own strings
 * next to its code, so features never edit a shared dictionary:
 *
 *   const S = strings({
 *     en: { start: "Start quiz", score: (n: number) => `Score: ${n}` },
 *     hi: { start: "क्विज़ शुरू करें", score: (n: number) => `स्कोर: ${n}` },
 *   });
 *   const t = useT(S);  t.start;  t.score(3)
 *
 * The Hindi table must have the same keys as English (TypeScript checks this).
 */
export type Lang = "en" | "hi";

export function strings<T extends Record<string, unknown>>(table: { en: T; hi: T }) {
  return table;
}

export function useLang(): Lang {
  return useStore((s) => s.settings.lang);
}

export function useT<T extends Record<string, unknown>>(table: { en: T; hi: T }): T {
  return table[useLang()] ?? table.en;
}
