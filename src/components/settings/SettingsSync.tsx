"use client";

import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { modeOf, useStore } from "@/lib/store";
import { PRINT_PATH, THEME_COLORS } from "./boot";

const DARK_QUERY = "(prefers-color-scheme: dark)";

function subscribeSystem(cb: () => void) {
  const mq = window.matchMedia(DARK_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** The operating system's colour scheme (light on the server). */
export function useSystemDark() {
  return useSyncExternalStore(
    subscribeSystem,
    () => window.matchMedia(DARK_QUERY).matches,
    () => false,
  );
}

/** The theme actually shown: the learner's choice, or the system's when set to "system". */
export function useResolvedTheme(): "light" | "dark" {
  const theme = useStore((s) => s.settings.theme);
  const systemDark = useSystemDark();
  return theme === "system" ? (systemDark ? "dark" : "light") : theme;
}

/**
 * Mirrors the saved settings onto <html> (data-theme, data-mode, data-text, data-font, data-spacing, lang)
 * so globals.css can restyle the whole app. The inline boot script sets the same attributes before first paint.
 */
export function SettingsSync() {
  const path = usePathname();
  const settings = useStore((s) => s.settings);
  const mode = useStore(modeOf);
  const resolved = useResolvedTheme();
  const theme = PRINT_PATH.test(path + "/") ? "light" : resolved;

  useEffect(() => {
    const d = document.documentElement;
    d.dataset.theme = theme;
    d.dataset.mode = mode;
    d.dataset.text = settings.textSize;
    d.dataset.font = settings.font;
    d.dataset.spacing = settings.spacing;
    d.lang = settings.lang === "hi" ? "hi" : "en-IN";
    // Browser UI colour: follow the shown theme; with "system", leave each media-specific tag as authored.
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
      const media = m.getAttribute("media") ?? "";
      const own = media.includes("dark") ? THEME_COLORS.dark : THEME_COLORS.light;
      m.content = settings.theme === "system" ? own : THEME_COLORS[theme];
    });
  }, [theme, mode, settings.textSize, settings.font, settings.spacing, settings.lang, settings.theme]);

  return null;
}
