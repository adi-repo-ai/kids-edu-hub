"use client";

import { useSyncExternalStore } from "react";

/**
 * Learner progress, saved in this browser (localStorage). Every page that shows
 * progress reads from here, so finishing a lesson immediately updates the
 * dashboard, the subject path, the progress page and the parent view.
 */

export interface QuizRecord {
  best: number;
  total: number;
  attempts: number;
  last: string;
}

export interface MockRecord {
  id: string;
  title: string;
  score: number;
  total: number;
  date: string;
  minutes: number;
}

export interface Bookmark {
  key: string;
  title: string;
  meta: string;
  href: string;
}

export interface PlanTask {
  id: string;
  title: string;
  date: string; // yyyy-mm-dd
  subject?: string;
  minutes: number;
  done: boolean;
}

export interface Settings {
  theme: "system" | "light" | "dark";
  textSize: "md" | "lg" | "xl";
  /** "readable" switches to the Lexend face, designed for easier reading (helps many dyslexic readers). */
  font: "default" | "readable";
  spacing: "normal" | "relaxed";
  /** Look and tone by age. "auto" picks from the class. */
  mode: "auto" | "junior" | "middle" | "senior";
  lang: "en" | "hi";
  /** yyyy-mm-dd, set by the learner; empty means "not set". */
  examDate: string;
  readAloudRate: number;
}

/** Spaced-repetition record for one flashcard or chapter. */
export interface SrsItem {
  due: string; // yyyy-mm-dd
  interval: number; // days
  ease: number;
  reps: number;
}

/** A question answered wrong in a quiz, mock, test or challenge. */
export interface Mistake {
  id: string;
  key: string; // chapter key, e.g. "10/maths/real-numbers"
  prompt: string;
  options: string[];
  answer: number;
  explanation?: string;
  at: string;
  /** Correct retries in a row; cleared from the notebook at 2. */
  streak: number;
}

export interface State {
  v: 3;
  profile: { name: string; grade: number | null; onboarded: boolean; dailyGoal: number };
  lessons: Record<string, string>; // "10/maths/real-numbers" -> ISO date completed
  quizzes: Record<string, QuizRecord>;
  mocks: MockRecord[];
  bookmarks: Bookmark[];
  tasks: PlanTask[];
  activity: Record<string, number>; // yyyy-mm-dd -> XP earned that day
  xp: number;
  settings: Settings;
  /** Flashcard id ("10/maths/real-numbers#3") -> schedule. */
  cards: Record<string, SrsItem>;
  /** Chapter key -> revision schedule (adaptive revision path). */
  revision: Record<string, SrsItem>;
  mistakes: Mistake[];
  /** yyyy-mm-dd -> daily challenge result. */
  daily: Record<string, { score: number; total: number }>;
  battles: { played: number; won: number };
  /** Coins spent in the shop; coins earned = floor(xp / 10). */
  spent: number;
  owned: string[];
  equipped: Record<string, string>; // slot -> item id
  /** Quest id -> ISO date the reward was claimed. */
  quests: Record<string, string>;
  /** Custom tests taken from the test builder. */
  tests: { title: string; score: number; total: number; date: string }[];
}

const KEY = "kaksha:v3";

export const emptyState: State = {
  v: 3,
  profile: { name: "", grade: null, onboarded: false, dailyGoal: 30 },
  lessons: {},
  quizzes: {},
  mocks: [],
  bookmarks: [],
  tasks: [],
  activity: {},
  xp: 0,
  settings: { theme: "system", textSize: "md", font: "default", spacing: "normal", mode: "auto", lang: "en", examDate: "", readAloudRate: 1 },
  cards: {},
  revision: {},
  mistakes: [],
  daily: {},
  battles: { played: 0, won: 0 },
  spent: 0,
  owned: [],
  equipped: {},
  quests: {},
  tests: [],
};

export const today = (d = new Date()) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};

let state: State = emptyState;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.v === 3) state = { ...emptyState, ...parsed, profile: { ...emptyState.profile, ...parsed.profile }, settings: { ...emptyState.settings, ...parsed.settings } };
    }
  } catch {
    /* private mode or corrupt data: start fresh */
  }
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or unavailable: keep in memory */
  }
}

function set(fn: (s: State) => State) {
  load();
  state = fn(state);
  persist();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    loaded = false;
    load();
    l();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}

/** Read the whole store (re-renders on change). Server render sees the empty state. */
export function useStore<T>(select: (s: State) => T): T {
  return select(useSyncExternalStore(subscribe, getSnapshot, () => emptyState));
}

/** True after hydration, so client-only numbers don't flash wrong on first paint. */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function addXp(s: State, amount: number): State {
  if (amount <= 0) return s;
  const d = today();
  return { ...s, xp: s.xp + amount, activity: { ...s.activity, [d]: (s.activity[d] ?? 0) + amount } };
}

export const actions = {
  setProfile(p: Partial<State["profile"]>) {
    set((s) => ({ ...s, profile: { ...s.profile, ...p } }));
  },
  completeLesson(key: string) {
    set((s) => (s.lessons[key] ? s : addXp({ ...s, lessons: { ...s.lessons, [key]: new Date().toISOString() } }, 20)));
  },
  uncompleteLesson(key: string) {
    set((s) => {
      const lessons = { ...s.lessons };
      delete lessons[key];
      return { ...s, lessons };
    });
  },
  /** Saves a quiz attempt. XP: 5 per correct answer, only for improvements on your best. */
  recordQuiz(key: string, score: number, total: number) {
    set((s) => {
      const prev = s.quizzes[key];
      const best = Math.max(prev?.best ?? 0, score);
      const gained = Math.max(0, score - (prev?.best ?? 0)) * 5;
      const next = { ...s, quizzes: { ...s.quizzes, [key]: { best, total, attempts: (prev?.attempts ?? 0) + 1, last: new Date().toISOString() } } };
      return addXp(next, gained + 5);
    });
  },
  /** Saves a finished mock and returns its timestamp, used to update self-marked scores later. */
  recordMock(m: Omit<MockRecord, "date">) {
    const date = new Date().toISOString();
    set((s) => addXp({ ...s, mocks: [{ ...m, date }, ...s.mocks].slice(0, 50) }, 50));
    return date;
  },
  updateMockScore(date: string, score: number) {
    set((s) => ({ ...s, mocks: s.mocks.map((m) => (m.date === date ? { ...m, score } : m)) }));
  },
  toggleBookmark(b: Bookmark) {
    set((s) => ({
      ...s,
      bookmarks: s.bookmarks.some((x) => x.key === b.key) ? s.bookmarks.filter((x) => x.key !== b.key) : [b, ...s.bookmarks],
    }));
  },
  addTask(t: Omit<PlanTask, "id" | "done">) {
    set((s) => ({ ...s, tasks: [...s.tasks, { ...t, id: `t${Date.now()}${Math.random().toString(36).slice(2, 6)}`, done: false }] }));
  },
  toggleTask(id: string) {
    set((s) => {
      const t = s.tasks.find((x) => x.id === id);
      const tasks = s.tasks.map((x) => (x.id === id ? { ...x, done: !x.done } : x));
      return t && !t.done ? addXp({ ...s, tasks }, 10) : { ...s, tasks };
    });
  },
  removeTask(id: string) {
    set((s) => ({ ...s, tasks: s.tasks.filter((x) => x.id !== id) }));
  },
  reset() {
    set(() => ({ ...emptyState, profile: state.profile, settings: state.settings }));
  },

  setSettings(p: Partial<Settings>) {
    set((s) => ({ ...s, settings: { ...s.settings, ...p } }));
  },

  /** Rate a flashcard: 0 = again, 1 = good, 2 = easy. */
  reviewCard(id: string, rating: 0 | 1 | 2) {
    set((s) => addXp({ ...s, cards: { ...s.cards, [id]: schedule(s.cards[id], rating) } }, 2));
  },
  /** Mark a chapter as revised; quality 0–2 from the revision quiz. */
  reviseChapter(key: string, rating: 0 | 1 | 2) {
    set((s) => addXp({ ...s, revision: { ...s.revision, [key]: schedule(s.revision[key], rating) } }, 10));
  },

  addMistake(m: Omit<Mistake, "id" | "at" | "streak">) {
    set((s) => {
      const id = `${m.key}|${m.prompt}`;
      const rest = s.mistakes.filter((x) => x.id !== id);
      return { ...s, mistakes: [{ ...m, id, at: new Date().toISOString(), streak: 0 }, ...rest].slice(0, 300) };
    });
  },
  /** A retry from the notebook. Two correct in a row clears it. */
  retryMistake(id: string, correct: boolean) {
    set((s) => {
      const mistakes = s.mistakes
        .map((m) => (m.id === id ? { ...m, streak: correct ? m.streak + 1 : 0 } : m))
        .filter((m) => m.streak < 2);
      return correct ? addXp({ ...s, mistakes }, 3) : { ...s, mistakes };
    });
  },
  removeMistake(id: string) {
    set((s) => ({ ...s, mistakes: s.mistakes.filter((m) => m.id !== id) }));
  },

  recordDaily(date: string, score: number, total: number) {
    set((s) => (s.daily[date] ? s : addXp({ ...s, daily: { ...s.daily, [date]: { score, total } } }, 10 + score * 2)));
  },
  recordBattle(won: boolean) {
    set((s) => addXp({ ...s, battles: { played: s.battles.played + 1, won: s.battles.won + (won ? 1 : 0) } }, won ? 20 : 10));
  },
  recordTest(t: { title: string; score: number; total: number }) {
    set((s) => addXp({ ...s, tests: [{ ...t, date: new Date().toISOString() }, ...s.tests].slice(0, 50) }, 15 + t.score));
  },

  /** Buy an item if affordable. Returns false when there aren't enough coins. */
  buy(item: string, price: number) {
    load();
    if (coinsOf(state) < price || state.owned.includes(item)) return false;
    set((s) => ({ ...s, spent: s.spent + price, owned: [...s.owned, item] }));
    return true;
  },
  equip(slot: string, item: string | null) {
    set((s) => {
      const equipped = { ...s.equipped };
      if (item) equipped[slot] = item;
      else delete equipped[slot];
      return { ...s, equipped };
    });
  },
  claimQuest(id: string, xp: number) {
    set((s) => (s.quests[id] ? s : addXp({ ...s, quests: { ...s.quests, [id]: new Date().toISOString() } }, xp)));
  },
};

/** SM-2-style scheduling, simplified for kids: again = tomorrow, good = grow, easy = grow faster. */
export function schedule(prev: SrsItem | undefined, rating: 0 | 1 | 2): SrsItem {
  const p = prev ?? { due: today(), interval: 0, ease: 2.3, reps: 0 };
  const ease = Math.max(1.3, Math.min(3, p.ease + (rating === 0 ? -0.2 : rating === 2 ? 0.15 : 0)));
  const interval = rating === 0 ? 1 : p.reps === 0 ? (rating === 2 ? 3 : 1) : p.reps === 1 ? (rating === 2 ? 7 : 3) : Math.round(p.interval * ease * (rating === 2 ? 1.3 : 1));
  const d = new Date();
  d.setDate(d.getDate() + interval);
  return { due: today(d), interval, ease, reps: rating === 0 ? 0 : p.reps + 1 };
}

export const coinsOf = (s: State) => Math.floor(s.xp / 10) - s.spent;

/** "junior" (1–5), "middle" (6–8) or "senior" (9–12), unless the learner chose one. */
export function modeOf(s: State): "junior" | "middle" | "senior" {
  if (s.settings.mode !== "auto") return s.settings.mode;
  const g = s.profile.grade ?? 10;
  return g <= 5 ? "junior" : g <= 8 ? "middle" : "senior";
}

/* ───────── Derived values ───────── */

export function streakOf(activity: State["activity"]) {
  let n = 0;
  const d = new Date();
  // today counts if active; otherwise the streak survives until the end of today
  if (!activity[today(d)]) d.setDate(d.getDate() - 1);
  while (activity[today(d)]) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export const LEVEL_XP = 250;
export const levelOf = (xp: number) => ({ level: Math.floor(xp / LEVEL_XP) + 1, into: xp % LEVEL_XP, pct: Math.round(((xp % LEVEL_XP) / LEVEL_XP) * 100) });

/** Last 7 days of XP, oldest first. */
export function weekOf(activity: State["activity"]) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = today(d);
    return { key, day: d.toLocaleDateString("en-IN", { weekday: "short" }), xp: activity[key] ?? 0 };
  });
}
