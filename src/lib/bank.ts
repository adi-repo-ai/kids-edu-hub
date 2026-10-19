"use client";

import { asset } from "./asset";

/** Client-side access to the static question bank (/bank/<grade>/<subject>.json). */
export interface BankMcq {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}
export interface BankChapter {
  id: string;
  title: string;
  mcq: BankMcq[];
  written: { q: string; answer: string; marks: number }[];
  cards: { front: string; back: string; type: string }[];
}
export interface Bank {
  grade: number;
  subject: string;
  name: string;
  chapters: BankChapter[];
}

const cache = new Map<string, Promise<Bank | null>>();

export function loadBank(grade: number | string, subject: string): Promise<Bank | null> {
  const k = `${grade}/${subject}`;
  if (!cache.has(k))
    cache.set(
      k,
      fetch(asset(`/bank/${grade}/${subject}.json`))
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    );
  return cache.get(k)!;
}

/** Deterministic shuffle, so a seed (e.g. today's date) gives everyone the same order. */
export function seededShuffle<T>(arr: T[], seed: string): T[] {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const rand = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 100000) / 100000;
  };
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const shuffle = <T,>(arr: T[]) => seededShuffle(arr, String(Math.random()));
