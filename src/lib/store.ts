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
      if (parsed?.v === 3) state = { ...emptyState, ...parsed, profile: { ...emptyState.profile, ...parsed.profile } };
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
  recordMock(m: Omit<MockRecord, "date">) {
    set((s) => addXp({ ...s, mocks: [{ ...m, date: new Date().toISOString() }, ...s.mocks].slice(0, 50) }, 50));
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
    set(() => ({ ...emptyState, profile: state.profile }));
  },
};

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
