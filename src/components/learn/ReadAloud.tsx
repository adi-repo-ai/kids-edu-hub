"use client";

import { Pause, Play, SkipBack, SkipForward, Square, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/cn";
import { strings, useT } from "@/lib/i18n";
import { actions, useStore } from "@/lib/store";
import { buttonClass } from "../ui/Button";

const S = strings({
  en: {
    listen: "Listen",
    listenHint: "Read this lesson aloud",
    player: "Read aloud",
    play: "Play",
    pause: "Pause",
    stop: "Stop reading",
    prev: "Previous sentence",
    next: "Next sentence",
    speed: "Reading speed",
    progress: (i: number, n: number) => `Sentence ${i} of ${n}`,
    noHindi: "This device has no Hindi voice, so the reading may sound wrong. Add a Hindi (India) voice in your phone or computer's text-to-speech settings.",
    failed: "Your browser could not read this aloud. Try again, or check its text-to-speech settings.",
    finished: "Finished reading the lesson.",
  },
  hi: {
    listen: "सुनें",
    listenHint: "यह पाठ पढ़कर सुनाएँ",
    player: "पढ़कर सुनाना",
    play: "चलाएँ",
    pause: "रोकें",
    stop: "पढ़ना बंद करें",
    prev: "पिछला वाक्य",
    next: "अगला वाक्य",
    speed: "पढ़ने की गति",
    progress: (i: number, n: number) => `वाक्य ${i} / ${n}`,
    noHindi: "इस डिवाइस में हिंदी आवाज़ नहीं है, इसलिए उच्चारण गलत हो सकता है। फ़ोन या कंप्यूटर की टेक्स्ट-टू-स्पीच सेटिंग में हिंदी (भारत) आवाज़ जोड़ें।",
    failed: "आपका ब्राउज़र इसे पढ़कर नहीं सुना सका। फिर से कोशिश करें या टेक्स्ट-टू-स्पीच सेटिंग देखें।",
    finished: "पूरा पाठ पढ़ लिया गया।",
  },
});

const RATES = [0.75, 1, 1.25, 1.5];
const BLOCKS = "h2,h3,h4,p,li,th,td";
const HIGHLIGHT = "kaksha-read";
const BLOCK_CLASSES = ["bg-brand-50", "rounded-lg", "ring-4", "ring-brand-50"];

type Sentence = { block: Element; text: string; range: Range };

/** Splits the lesson's readable blocks into sentences, each with a DOM Range for highlighting. */
function collect(root: HTMLElement): Sentence[] {
  const groups = new Map<Element, Text[]>();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const parent = n.parentElement;
    if (!parent || parent.closest("[data-sim-root],[data-no-read]")) continue;
    const block = parent.closest(BLOCKS);
    if (!block || !root.contains(block)) continue;
    const list = groups.get(block) ?? [];
    list.push(n as Text);
    groups.set(block, list);
  }
  const out: Sentence[] = [];
  for (const [block, nodes] of groups) {
    const starts: number[] = [];
    let full = "";
    for (const node of nodes) {
      starts.push(full.length);
      full += node.data;
    }
    const locate = (pos: number, end: boolean): [Text, number] => {
      for (let i = nodes.length - 1; i >= 0; i--) {
        if (end ? starts[i] < pos : starts[i] <= pos) return [nodes[i], Math.min(pos - starts[i], nodes[i].data.length)];
      }
      return [nodes[0], 0];
    };
    for (const m of full.matchAll(/[^]*?(?:[.!?।]+["'”’)\]]*(?=\s|$)|$)/g)) {
      const raw = m[0];
      if (!raw || !/[\p{L}\p{N}]/u.test(raw)) continue;
      const lead = raw.length - raw.trimStart().length;
      const s = (m.index ?? 0) + lead;
      const e = (m.index ?? 0) + raw.trimEnd().length;
      const range = document.createRange();
      const [sn, so] = locate(s, false);
      const [en, eo] = locate(e, true);
      range.setStart(sn, so);
      range.setEnd(en, eo);
      out.push({ block, text: raw.trim().replace(/\s+/g, " "), range });
    }
  }
  return out;
}

type HighlightApi = { highlights?: Map<string, unknown> };
declare const Highlight: { new (...ranges: Range[]): unknown } | undefined;

function paint(s: Sentence | null, prev: Element | null) {
  if (prev) prev.classList.remove(...BLOCK_CLASSES);
  const reg = (globalThis.CSS as unknown as HighlightApi | undefined)?.highlights;
  if (!s) {
    reg?.delete(HIGHLIGHT);
    return null;
  }
  s.block.classList.add(...BLOCK_CLASSES);
  if (reg && typeof Highlight !== "undefined") reg.set(HIGHLIGHT, new Highlight(s.range));
  const r = s.block.getBoundingClientRect();
  if (r.top < 80 || r.bottom > window.innerHeight - 120) s.block.scrollIntoView({ block: "center", behavior: "smooth" });
  return s.block;
}

/**
 * "Listen" control: reads the lesson sentence by sentence with the Web Speech API, highlighting the
 * current sentence and paragraph. Renders nothing where speech synthesis is unavailable.
 */
export function ReadAloud({ target, hindi, onActiveChange }: { target: RefObject<HTMLElement | null>; hindi: boolean; onActiveChange?: (active: boolean) => void }) {
  const t = useT(S);
  const rate = useStore((s) => s.settings.readAloudRate) || 1;
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");
  const [idx, setIdx] = useState(0);
  const [total, setTotal] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [error, setError] = useState("");

  const sentences = useRef<Sentence[]>([]);
  const run = useRef(0);
  const current = useRef(0);
  const lit = useRef<Element | null>(null);
  const rateRef = useRef(rate);
  rateRef.current = rate;

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return;
    setSupported(true);
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      run.current++;
      window.speechSynthesis.cancel();
      lit.current = paint(null, lit.current);
    };
  }, []);

  const norm = (l: string) => l.toLowerCase().replace("_", "-");
  const voice = hindi
    ? voices.find((v) => norm(v.lang).startsWith("hi"))
    : (voices.find((v) => norm(v.lang) === "en-in") ?? voices.find((v) => norm(v.lang).startsWith("en") && v.localService) ?? voices.find((v) => norm(v.lang).startsWith("en")));
  const voiceRef = useRef(voice);
  voiceRef.current = voice;
  const noHindiVoice = hindi && voices.length > 0 && !voice;

  const halt = useCallback(() => {
    run.current++;
    window.speechSynthesis.cancel();
  }, []);

  const stop = useCallback(() => {
    halt();
    lit.current = paint(null, lit.current);
    setStatus("idle");
    onActiveChange?.(false);
  }, [halt, onActiveChange]);

  const speakFrom = useCallback(
    (i: number) => {
      halt();
      const token = run.current;
      const list = sentences.current;
      if (i >= list.length) {
        lit.current = paint(null, lit.current);
        setStatus("idle");
        onActiveChange?.(false);
        setError(list.length ? t.finished : "");
        return;
      }
      const at = Math.max(0, i);
      current.current = at;
      setIdx(at);
      setStatus("playing");
      lit.current = paint(list[at], lit.current);
      // A short delay after cancel() avoids a Chrome bug where the next utterance is silently dropped.
      window.setTimeout(() => {
        if (token !== run.current) return;
        const u = new SpeechSynthesisUtterance(list[at].text);
        u.rate = rateRef.current;
        u.lang = hindi ? "hi-IN" : "en-IN";
        if (voiceRef.current) u.voice = voiceRef.current;
        u.onend = () => {
          if (token === run.current) speakFrom(at + 1);
        };
        u.onerror = (e) => {
          if (token !== run.current || e.error === "interrupted" || e.error === "canceled") return;
          stop();
          setError(t.failed);
        };
        window.speechSynthesis.speak(u);
      }, 60);
    },
    [halt, hindi, onActiveChange, stop, t.failed, t.finished],
  );

  const start = () => {
    const root = target.current;
    if (!root) return;
    const list = collect(root);
    sentences.current = list;
    setTotal(list.length);
    setError("");
    if (!list.length) return;
    // Start from the first sentence on screen, so scrolling down then pressing Listen does what you expect.
    const first = list.findIndex((s) => s.block.getBoundingClientRect().bottom > 90);
    onActiveChange?.(true);
    speakFrom(first > 0 ? first : 0);
  };

  const pause = () => {
    halt();
    setStatus("paused");
  };

  const setRate = (r: number) => {
    actions.setSettings({ readAloudRate: r });
    rateRef.current = r;
    if (status === "playing") speakFrom(current.current);
  };

  if (!supported) return null;

  const active = status !== "idle";
  const iconBtn = "grid size-11 shrink-0 place-items-center rounded-xl text-ink-2 hover:bg-surface-2 hover:text-ink disabled:opacity-40";

  return (
    <>
      <style>{`::highlight(${HIGHLIGHT}){background-color:color-mix(in srgb, var(--color-amber-400, #fbbf24) 45%, transparent);}`}</style>
      {!active && (
        <div className="flex flex-col items-end gap-1">
          <button type="button" onClick={start} className={buttonClass("secondary", "md")} title={t.listenHint}>
            <Volume2 aria-hidden className="size-5" />
            {t.listen}
          </button>
          {error && (
            <p role="status" className="max-w-xs text-right text-xs font-semibold text-ink-3">
              {error}
            </p>
          )}
        </div>
      )}
      {active && (
        <div className="no-print fixed inset-x-3 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-40 lg:bottom-6 lg:left-[calc(16rem+1.5rem)] lg:right-6">
          <div role="region" aria-label={t.player} className="animate-rise mx-auto max-w-2xl rounded-2xl border border-line bg-surface p-2 shadow-float">
            <div className="flex flex-wrap items-center gap-1">
              {status === "playing" ? (
                <button type="button" onClick={pause} aria-label={t.pause} className={cn(buttonClass("primary", "md"), "w-11 px-0")}>
                  <Pause aria-hidden className="size-5" />
                </button>
              ) : (
                <button type="button" onClick={() => speakFrom(current.current)} aria-label={t.play} className={cn(buttonClass("primary", "md"), "w-11 px-0")}>
                  <Play aria-hidden className="size-5" />
                </button>
              )}
              <button type="button" onClick={() => speakFrom(Math.max(0, idx - 1))} disabled={idx === 0} aria-label={t.prev} className={iconBtn}>
                <SkipBack aria-hidden className="size-5" />
              </button>
              <button type="button" onClick={() => speakFrom(idx + 1)} disabled={idx + 1 >= total} aria-label={t.next} className={iconBtn}>
                <SkipForward aria-hidden className="size-5" />
              </button>
              <button type="button" onClick={stop} aria-label={t.stop} className={iconBtn}>
                <Square aria-hidden className="size-5" />
              </button>
              <div role="group" aria-label={t.speed} className="ml-auto flex gap-0.5 rounded-xl bg-surface-2 p-1">
                {RATES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={rate === r}
                    onClick={() => setRate(r)}
                    className={cn("h-9 min-w-11 rounded-lg px-1.5 text-sm font-bold tabular-nums", rate === r ? "bg-surface text-brand-700 shadow-sm" : "text-ink-2 hover:text-ink")}
                  >
                    {r}×
                  </button>
                ))}
              </div>
            </div>
            <p className="px-1 pt-1 text-xs font-semibold text-ink-3" aria-live="polite">
              {t.progress(idx + 1, total)}
            </p>
            {noHindiVoice && <p className="px-1 pt-1 text-xs font-semibold text-coral-700">{t.noHindi}</p>}
          </div>
        </div>
      )}
    </>
  );
}
