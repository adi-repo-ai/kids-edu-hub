"use client";

type Listener = (msg: { id: number; text: string; tone: "success" | "info" }) => void;
const listeners = new Set<Listener>();

export function toast(text: string, tone: "success" | "info" = "success") {
  const msg = { id: Date.now(), text, tone };
  listeners.forEach((l) => l(msg));
}

export function onToast(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
