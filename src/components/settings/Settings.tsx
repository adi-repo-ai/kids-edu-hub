"use client";

import { BookOpenText, CalendarDays, Languages, Monitor, Moon, Palette, RotateCcw, Sun, UserRound, Volume2 } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { grades } from "@/lib/curriculum";
import { cn } from "@/lib/cn";
import { strings, useT } from "@/lib/i18n";
import { actions, modeOf, today, useHydrated, useStore, type Settings as SettingsT } from "@/lib/store";
import { toast } from "@/lib/toast";
import { PageTitle } from "../layout/PageTitle";
import { Button } from "../ui/Button";
import { Mascot } from "../ui/Mascot";
import { ProgressBar } from "../ui/Progress";
import { useResolvedTheme } from "./SettingsSync";

const S = strings({
  en: {
    eyebrow: "Make it yours",
    title: "Settings",
    sub: "Change how Kaksha looks, reads and speaks. Changes apply straight away and are saved on this device.",
    profile: "Profile",
    name: "Your name",
    namePh: "Your first name",
    yourClass: "Your class",
    classN: (g: number) => `Class ${g}`,
    noClass: "Not set",
    appearance: "Appearance",
    theme: "Theme",
    system: "System",
    light: "Light",
    dark: "Dark",
    systemNow: (d: boolean) => `Following your device: ${d ? "dark" : "light"} right now.`,
    look: "Look by age",
    lookHint: "Junior is bigger and more playful; Senior is calmer and a little denser.",
    auto: "Auto",
    autoFrom: (m: string) => `From your class: ${m}`,
    junior: "Junior",
    middle: "Middle",
    senior: "Senior",
    juniorSub: "Classes 1–5",
    middleSub: "Classes 6–8",
    seniorSub: "Classes 9–12",
    reading: "Reading",
    textSize: "Text size",
    normal: "Normal",
    large: "Large",
    xlarge: "Extra large",
    font: "Font",
    fontDefault: "Default",
    fontReadable: "Easy-read (Lexend)",
    fontHint: "Lexend has wider letters and spacing, which many readers (including many with dyslexia) find easier.",
    spacing: "Line spacing",
    relaxed: "Relaxed",
    speed: "Read-aloud speed",
    speedValue: (r: number) => `${r.toFixed(1)}×`,
    slow: "Slower",
    fast: "Faster",
    test: "Test voice",
    stop: "Stop",
    noVoice: "Read-aloud isn't available in this browser.",
    language: "Language",
    languageHint: "Menus and buttons switch language. Lessons stay in the language they are written in.",
    exam: "Exam date",
    examHint: "Used for your countdown and revision plan.",
    examLabel: "Date of your next big exam",
    clear: "Clear",
    daysLeft: (n: number) => (n === 0 ? "That's today. All the best!" : n === 1 ? "1 day to go" : `${n} days to go`),
    past: "This date has passed. Pick your next exam.",
    examSaved: "Exam date saved",
    reset: "Reset display settings",
    resetDone: "Display settings reset",
    preview: "Live preview",
    previewTitle: "Light travels in straight lines",
    previewBody: "When light meets an object it cannot pass through, a shadow forms behind it. The shadow's shape depends on where the light comes from.",
    previewKey: "Key idea",
    previewCallout: "Shadows form because light cannot bend around opaque objects.",
    previewProgress: "Chapter progress",
    readAloud: "Read aloud",
  },
  hi: {
    eyebrow: "अपने हिसाब से बनाएँ",
    title: "सेटिंग्स",
    sub: "कक्षा कैसी दिखे, कैसे पढ़ी जाए और कैसे बोले, यह बदलें। बदलाव तुरंत लागू होते हैं और इसी डिवाइस पर सहेजे जाते हैं।",
    profile: "प्रोफ़ाइल",
    name: "आपका नाम",
    namePh: "आपका पहला नाम",
    yourClass: "आपकी कक्षा",
    classN: (g: number) => `कक्षा ${g}`,
    noClass: "नहीं चुनी",
    appearance: "रूप-रंग",
    theme: "थीम",
    system: "डिवाइस जैसा",
    light: "लाइट",
    dark: "डार्क",
    systemNow: (d: boolean) => `आपके डिवाइस के हिसाब से: अभी ${d ? "डार्क" : "लाइट"}।`,
    look: "उम्र के हिसाब से रूप",
    lookHint: "जूनियर में बड़े अक्षर और ज़्यादा मज़ेदार रूप; सीनियर में शांत और थोड़ा सघन रूप।",
    auto: "अपने-आप",
    autoFrom: (m: string) => `आपकी कक्षा से: ${m}`,
    junior: "जूनियर",
    middle: "मिडिल",
    senior: "सीनियर",
    juniorSub: "कक्षा 1–5",
    middleSub: "कक्षा 6–8",
    seniorSub: "कक्षा 9–12",
    reading: "पढ़ना",
    textSize: "अक्षरों का आकार",
    normal: "सामान्य",
    large: "बड़ा",
    xlarge: "बहुत बड़ा",
    font: "फ़ॉन्ट",
    fontDefault: "सामान्य",
    fontReadable: "आसान पढ़ाई (Lexend)",
    fontHint: "Lexend के अक्षर और उनके बीच की जगह चौड़ी है, जिससे कई पाठकों (डिस्लेक्सिया वाले कई बच्चों समेत) को पढ़ना आसान लगता है।",
    spacing: "पंक्तियों के बीच की जगह",
    relaxed: "खुली-खुली",
    speed: "पढ़कर सुनाने की गति",
    speedValue: (r: number) => `${r.toFixed(1)}×`,
    slow: "धीमा",
    fast: "तेज़",
    test: "आवाज़ सुनें",
    stop: "रोकें",
    noVoice: "इस ब्राउज़र में पढ़कर सुनाने की सुविधा नहीं है।",
    language: "भाषा",
    languageHint: "मेन्यू और बटन की भाषा बदलती है। पाठ उसी भाषा में रहते हैं जिसमें वे लिखे गए हैं।",
    exam: "परीक्षा की तारीख़",
    examHint: "उलटी गिनती और दोहराई की योजना के लिए।",
    examLabel: "आपकी अगली बड़ी परीक्षा की तारीख़",
    clear: "हटाएँ",
    daysLeft: (n: number) => (n === 0 ? "परीक्षा आज है। शुभकामनाएँ!" : `${n} दिन बाकी`),
    past: "यह तारीख़ निकल चुकी है। अगली परीक्षा की तारीख़ चुनें।",
    examSaved: "परीक्षा की तारीख़ सहेज ली",
    reset: "दिखावट की सेटिंग्स पहले जैसी करें",
    resetDone: "दिखावट की सेटिंग्स पहले जैसी हो गईं",
    preview: "लाइव झलक",
    previewTitle: "प्रकाश सीधी रेखा में चलता है",
    previewBody: "जब प्रकाश किसी ऐसी वस्तु से टकराता है जिसके आर-पार वह नहीं जा सकता, तो उसके पीछे छाया बनती है। छाया का आकार इस पर निर्भर करता है कि प्रकाश किधर से आ रहा है।",
    previewKey: "मुख्य बात",
    previewCallout: "छाया इसलिए बनती है क्योंकि प्रकाश अपारदर्शी वस्तुओं के चारों ओर मुड़ नहीं सकता।",
    previewProgress: "अध्याय की प्रगति",
    readAloud: "पढ़कर सुनाएँ",
  },
});

const DISPLAY_DEFAULTS: Partial<SettingsT> = { theme: "system", textSize: "md", font: "default", spacing: "normal", mode: "auto", readAloudRate: 1 };

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="card p-5 sm:p-6">
      <h2 id={id} className="flex items-center gap-2 text-lg font-extrabold">
        <span className="grid size-9 place-items-center rounded-xl bg-brand-50 text-brand-600" aria-hidden>
          {icon}
        </span>
        {title}
      </h2>
      <div className="mt-5 space-y-6">{children}</div>
    </section>
  );
}

interface Opt<T extends string> {
  id: T;
  label: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  lang?: string;
  className?: string;
}

function Choice<T extends string>({ label, hint, value, options, onChange, cols = 3 }: { label: string; hint?: ReactNode; value: T; options: Opt<T>[]; onChange: (v: T) => void; cols?: 2 | 3 | 4 }) {
  const id = useId();
  return (
    <div>
      <p id={id} className="text-sm font-bold">
        {label}
      </p>
      <div role="group" aria-labelledby={id} className={cn("mt-2 grid gap-2", cols === 2 ? "grid-cols-2" : cols === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1 min-[420px]:grid-cols-3")}>
        {options.map((o) => {
          const on = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              lang={o.lang}
              aria-pressed={on}
              onClick={() => onChange(o.id)}
              className={cn(
                "flex min-h-12 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl border-2 px-3 py-2 text-center font-bold transition-colors",
                on ? "border-brand-500 bg-brand-50 text-brand-700" : "border-line bg-surface text-ink-2 hover:border-line-strong hover:bg-surface-2",
                o.className,
              )}
            >
              <span className="flex items-center gap-1.5">
                {o.icon}
                {o.label}
              </span>
              {o.sub && <span className={cn("text-xs font-semibold", on ? "text-brand-600" : "text-ink-3")}>{o.sub}</span>}
            </button>
          );
        })}
      </div>
      {hint && <p className="mt-2 text-sm text-ink-3">{hint}</p>}
    </div>
  );
}

const daysUntil = (date: string) => Math.round((new Date(`${date}T00:00`).getTime() - new Date(`${today()}T00:00`).getTime()) / 86_400_000);

function speak(text: string, rate: number, lang: "en" | "hi", onEnd: () => void) {
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate;
  u.lang = lang === "hi" ? "hi-IN" : "en-IN";
  u.onend = onEnd;
  u.onerror = onEnd;
  synth.speak(u);
}

export function Settings() {
  const t = useT(S);
  const hydrated = useHydrated();
  const settings = useStore((s) => s.settings);
  const profile = useStore((s) => s.profile);
  const autoMode = useStore((s) => modeOf({ ...s, settings: { ...s.settings, mode: "auto" } }));
  const shownTheme = useResolvedTheme();
  const [speaking, setSpeaking] = useState(false);
  const nameId = useId();
  const examId = useId();

  if (!hydrated)
    return (
      <>
        <PageTitle eyebrow={t.eyebrow} title={t.title} sub={t.sub} />
        <div className="h-[60vh]" />
      </>
    );

  const set = (p: Partial<SettingsT>) => actions.setSettings(p);
  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;
  const modeName = { junior: t.junior, middle: t.middle, senior: t.senior };
  const left = settings.examDate ? daysUntil(settings.examDate) : null;

  const toggleSpeak = (text: string) => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    speak(text, settings.readAloudRate, settings.lang, () => setSpeaking(false));
  };

  return (
    <>
      <PageTitle
        eyebrow={t.eyebrow}
        title={t.title}
        sub={t.sub}
        actions={
          <Button
            variant="secondary"
            size="sm"
            icon={<RotateCcw className="size-4" aria-hidden />}
            onClick={() => {
              set(DISPLAY_DEFAULTS);
              toast(t.resetDone);
            }}
          >
            {t.reset}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <Section icon={<UserRound className="size-5" />} title={t.profile}>
            <div>
              <label htmlFor={nameId} className="text-sm font-bold">
                {t.name}
              </label>
              <input
                id={nameId}
                value={profile.name}
                maxLength={40}
                autoComplete="given-name"
                placeholder={t.namePh}
                onChange={(e) => actions.setProfile({ name: e.target.value })}
                className="mt-2 h-12 w-full max-w-sm rounded-xl border-2 border-line bg-surface-2 px-4 text-base font-semibold outline-none focus:border-brand-400 focus:bg-surface"
              />
            </div>
            <Choice
              label={t.yourClass}
              value={profile.grade ? String(profile.grade) : ""}
              cols={4}
              options={grades.map((g) => ({ id: String(g.grade), label: t.classN(g.grade) }))}
              onChange={(v) => actions.setProfile({ grade: Number(v) })}
            />
          </Section>

          <Section icon={<Palette className="size-5" />} title={t.appearance}>
            <Choice
              label={t.theme}
              value={settings.theme}
              onChange={(theme) => set({ theme })}
              hint={settings.theme === "system" ? t.systemNow(shownTheme === "dark") : undefined}
              options={[
                { id: "system", label: t.system, icon: <Monitor className="size-4" aria-hidden /> },
                { id: "light", label: t.light, icon: <Sun className="size-4" aria-hidden /> },
                { id: "dark", label: t.dark, icon: <Moon className="size-4" aria-hidden /> },
              ]}
            />
            <Choice
              label={t.look}
              hint={t.lookHint}
              cols={4}
              value={settings.mode}
              onChange={(mode) => set({ mode })}
              options={[
                { id: "auto", label: t.auto, sub: t.autoFrom(modeName[autoMode]) },
                { id: "junior", label: t.junior, sub: t.juniorSub },
                { id: "middle", label: t.middle, sub: t.middleSub },
                { id: "senior", label: t.senior, sub: t.seniorSub },
              ]}
            />
          </Section>

          <Section icon={<BookOpenText className="size-5" />} title={t.reading}>
            <Choice
              label={t.textSize}
              value={settings.textSize}
              onChange={(textSize) => set({ textSize })}
              options={[
                { id: "md", label: t.normal, icon: <span aria-hidden className="text-sm font-extrabold">Aa</span> },
                { id: "lg", label: t.large, icon: <span aria-hidden className="text-base font-extrabold">Aa</span> },
                { id: "xl", label: t.xlarge, icon: <span aria-hidden className="text-lg font-extrabold">Aa</span> },
              ]}
            />
            <Choice
              label={t.font}
              hint={t.fontHint}
              cols={2}
              value={settings.font}
              onChange={(font) => set({ font })}
              options={[
                { id: "default", label: t.fontDefault, className: "[font-family:'Plus_Jakarta_Sans_Variable',sans-serif]" },
                { id: "readable", label: t.fontReadable, className: "[font-family:'Lexend_Variable',sans-serif]" },
              ]}
            />
            <Choice
              label={t.spacing}
              cols={2}
              value={settings.spacing}
              onChange={(spacing) => set({ spacing })}
              options={[
                { id: "normal", label: t.normal },
                { id: "relaxed", label: t.relaxed },
              ]}
            />
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor="st-rate" className="text-sm font-bold">
                  {t.speed}
                </label>
                <span className="rounded-lg bg-surface-2 px-2 py-0.5 text-sm font-extrabold tabular-nums">{t.speedValue(settings.readAloudRate)}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-ink-3" aria-hidden>
                  {t.slow}
                </span>
                <input
                  id="st-rate"
                  type="range"
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  value={settings.readAloudRate}
                  aria-valuetext={t.speedValue(settings.readAloudRate)}
                  onChange={(e) => set({ readAloudRate: Number(e.target.value) })}
                  className="h-10 min-w-0 flex-1 accent-brand-500"
                />
                <span className="text-xs font-bold text-ink-3" aria-hidden>
                  {t.fast}
                </span>
              </div>
              {canSpeak ? (
                <Button variant="secondary" size="sm" className="mt-3" aria-pressed={speaking} icon={<Volume2 className="size-4" aria-hidden />} onClick={() => toggleSpeak(t.previewBody)}>
                  {speaking ? t.stop : t.test}
                </Button>
              ) : (
                <p className="mt-2 text-sm text-ink-3">{t.noVoice}</p>
              )}
            </div>
          </Section>

          <Section icon={<Languages className="size-5" />} title={t.language}>
            <Choice
              label={t.language}
              hint={t.languageHint}
              cols={2}
              value={settings.lang}
              onChange={(lang) => set({ lang })}
              options={[
                { id: "en", label: "English", lang: "en" },
                { id: "hi", label: "हिंदी", lang: "hi" },
              ]}
            />
          </Section>

          <Section icon={<CalendarDays className="size-5" />} title={t.exam}>
            <div>
              <label htmlFor={examId} className="text-sm font-bold">
                {t.examLabel}
              </label>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <input
                  id={examId}
                  type="date"
                  min={today()}
                  value={settings.examDate}
                  onChange={(e) => {
                    set({ examDate: e.target.value });
                    if (e.target.value) toast(t.examSaved);
                  }}
                  className="h-12 min-w-0 rounded-xl border-2 border-line bg-surface-2 px-3 font-semibold outline-none focus:border-brand-400 focus:bg-surface"
                />
                {settings.examDate && (
                  <Button variant="ghost" size="sm" onClick={() => set({ examDate: "" })}>
                    {t.clear}
                  </Button>
                )}
              </div>
              <p className="mt-2 text-sm text-ink-3" aria-live="polite">
                {left === null ? t.examHint : left < 0 ? t.past : <strong className="text-ink">{t.daysLeft(left)}</strong>}
              </p>
            </div>
          </Section>
        </div>

        <aside aria-label={t.preview} className="min-w-0">
          <div className="space-y-3 lg:sticky lg:top-24">
            <p className="eyebrow">{t.preview}</p>
            <div className="card overflow-hidden">
              <div className="flex items-center gap-3 border-b border-line bg-surface-2 px-5 py-4">
                <Mascot mood="wave" size={52} />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-ink-3">{profile.grade ? t.classN(profile.grade) : `${t.yourClass}: ${t.noClass}`}</p>
                  <p className="truncate font-extrabold">{profile.name || t.namePh}</p>
                </div>
              </div>
              <div className="space-y-4 p-5">
                <h3 className="text-xl font-extrabold">{t.previewTitle}</h3>
                <div className="lesson">
                  <p>{t.previewBody}</p>
                  <div className="callout callout-key">
                    <p className="callout-title">{t.previewKey}</p>
                    <p>{t.previewCallout}</p>
                  </div>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-bold text-ink-3">{t.previewProgress}</p>
                  <ProgressBar value={60} label={t.previewProgress} color="bg-green-500" />
                </div>
                {canSpeak && (
                  <Button variant="primary" size="sm" aria-pressed={speaking} icon={<Volume2 className="size-4" aria-hidden />} onClick={() => toggleSpeak(`${t.previewTitle}. ${t.previewBody}`)}>
                    {speaking ? t.stop : t.readAloud}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
