import { ArrowRight, Check, X } from "lucide-react";
import type { Metadata } from "next";
import { BookmarkButton } from "@/components/features/BookmarkButton";
import { DownloadButton } from "@/components/features/DownloadButton";
import { Container, PageHeader } from "@/components/layout/PageHeader";
import { BadgeMedal } from "@/components/ui/BadgeMedal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowDoodle, AtomDoodle, Highlight, ProtractorDoodle, SparkDoodle, Squiggle, StarDoodle } from "@/components/ui/Doodles";
import { Marquee } from "@/components/ui/Marquee";
import { Mascot, MascotBubble } from "@/components/ui/Mascot";
import { ProgressBar, ProgressRing } from "@/components/ui/Progress";
import { SubjectIcon } from "@/components/ui/SubjectIcon";
import { Switch } from "@/components/ui/Switch";
import { Tag } from "@/components/ui/Tag";
import { badges } from "@/data/student";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Design system" };

/* WCAG 2.x relative-luminance contrast, computed at build time so the table can't drift from the tokens. */
function lum(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

const palette = [
  { name: "Royal blue", role: "Primary actions, links, Mathematics", swatches: [["50", "#eef1ff"], ["100", "#dde3ff"], ["200", "#bcc7ff"], ["500", "#4361ee"], ["600", "#2f4bdb"], ["700", "#2338b0"], ["800", "#1c2c86"]] },
  { name: "Coral orange", role: "Streaks, urgency, wrong answers, Social Science", swatches: [["50", "#fff2ed"], ["100", "#ffe1d6"], ["200", "#ffc2ad"], ["500", "#f26b45"], ["600", "#dd5530"], ["700", "#b23f1f"]] },
  { name: "Sunshine yellow", role: "Achievements, highlights, Hindi (never text)", swatches: [["50", "#fff9e6"], ["100", "#fff0bf"], ["200", "#ffe38a"], ["400", "#ffc93c"], ["500", "#f5b400"], ["800", "#7a4f00"]] },
  { name: "Mint green", role: "Success, correct answers, Science", swatches: [["50", "#e9faf3"], ["100", "#cdf3e3"], ["200", "#9ce6c7"], ["500", "#2db88c"], ["600", "#1b9a72"], ["700", "#0f7553"]] },
  { name: "Lavender", role: "Notes, reflection, English", swatches: [["50", "#f3f0ff"], ["100", "#e7e1ff"], ["200", "#cfc4ff"], ["500", "#8f7cf2"], ["600", "#6f5ae0"], ["700", "#5440bd"]] },
  { name: "Neutrals", role: "Paper, surfaces, lines and ink", swatches: [["paper", "#fffbf3"], ["sunken", "#f6f1e6"], ["line", "#ebe4d4"], ["line-strong", "#d9cfb9"], ["ink-3", "#6b6f86"], ["ink-2", "#474b66"], ["ink", "#1a1d3a"]] },
];

const textPairs = [
  ["ink on paper", "#1a1d3a", "#fffbf3"],
  ["ink-2 on white", "#474b66", "#ffffff"],
  ["ink-3 on white", "#6b6f86", "#ffffff"],
  ["royal-700 on royal-50", "#2338b0", "#eef1ff"],
  ["white on royal-600", "#ffffff", "#2f4bdb"],
  ["coral-700 on coral-100", "#b23f1f", "#ffe1d6"],
  ["ink on coral-500", "#1a1d3a", "#f26b45"],
  ["mint-700 on mint-100", "#0f7553", "#cdf3e3"],
  ["lavender-700 on lavender-100", "#5440bd", "#e7e1ff"],
  ["sun-800 on sun-100", "#7a4f00", "#fff0bf"],
  ["ink on sun-400", "#1a1d3a", "#ffc93c"],
] as const;

const typeScale = [
  ["Display", "font-display text-6xl font-extrabold", "56–60 / 1.04 · Bricolage 800 · −2%", "Hero headlines only"],
  ["H1", "font-display text-4xl font-extrabold", "36 / 1.1 · Bricolage 800", "Page titles"],
  ["H2", "font-display text-2xl font-bold", "24 / 1.25 · Bricolage 700", "Section titles"],
  ["H3", "font-display text-lg font-bold", "18 / 1.35 · Bricolage 700", "Card titles"],
  ["Body L", "text-lg", "18 / 1.6 · Figtree 400", "Lesson text, intros"],
  ["Body", "text-base", "16 / 1.6 · Figtree 400", "Default"],
  ["Small", "text-sm", "14 / 1.5 · Figtree 400–600", "Meta, helper text"],
  ["Eyebrow", "eyebrow", "12 / 1.4 · Figtree 700 · +8% caps", "Section labels"],
] as const;

const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80];

const motion = [
  ["Page curtain", "transform", "560ms ×3, staggered 90ms", "cubic(.7,0,.3,1)", "Royal, sun and coral panels lift off each new page"],
  ["Scroll reveal", "opacity, transform", "650ms, stagger 90ms", "ease-out", "[data-reveal] sections rise in; visible by default without JS"],
  ["Sticker hover", "transform, shadow", "220ms", "spring (1.56 overshoot)", "Lifts −3px, tilts ±0.6–1.2°, shadow grows 4→7px"],
  ["3D tilt", "transform", "300ms", "ease-out", "Pointer-driven ±8° with glare; mouse only"],
  ["Button press", "transform, shadow", "200ms", "spring", "Lifts on hover, drops 4px onto its key shadow"],
  ["Progress fill", "width + stripes", "1000ms + 900ms loop", "spring", "Fills from 0; candy stripes scroll on md/lg bars"],
  ["Count-up", "text", "1200ms", "ease-out cubic", "Numbers count from 0 when scrolled into view"],
  ["Confetti", "canvas", "2.1s", "gravity + drag", "Correct answers, finished lessons, ticked tasks, CTA"],
  ["Mascot", "transform", "5s float · 4.5s blink", "ease-in-out", "Gyani bobs and blinks; wings flap when cheering"],
  ["Ambient loops", "transform", "2.4–32s", "linear / ease", "Marquee, floating stickers, flame flicker, slow spins"],
  ["Answer feedback", "opacity, transform", "320ms + 300ms shake", "ease-out", "Wrong answers shake once, horizontally"],
  ["Badge / check pop", "scale", "420ms", "overshoot to 1.08", "Only on user-earned moments"],
  ["Toast", "opacity, transform", "320ms in · 2.6s hold", "ease-out", "Announced via aria-live=polite"],
] as const;

function Section({ id, title, kicker, children }: { id: string; title: string; kicker: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-t`} className="scroll-mt-20 border-t border-line py-12">
      <div className="mb-8 grid gap-2 md:grid-cols-[240px_1fr]">
        <h2 id={`${id}-t`} className="text-2xl font-extrabold">
          {title}
        </h2>
        <p className="max-w-2xl text-ink-2">{kicker}</p>
      </div>
      {children}
    </section>
  );
}

function StateLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-3">{children}</p>;
}

export default function DesignSystemPage() {
  const toc = ["colour", "type", "space", "components", "states", "motion", "layout", "principles"];
  return (
    <>
      <PageHeader tone="lavender"
        eyebrow="Kaksha design system · v2.0"
        title="Bold, bouncy, and still easy to read."
        description="Tokens, components and interaction rules behind every Kaksha screen. Built for React, Next.js, TypeScript and Tailwind CSS v4; every value below is a CSS variable in globals.css."
      >
        <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2">
          {toc.map((t) => (
            <a key={t} href={`#${t}`} className="rounded-sm border border-line bg-paper px-2.5 py-1 text-sm font-semibold capitalize text-ink-2 hover:border-ink-3 hover:text-ink">
              {t}
            </a>
          ))}
        </nav>
      </PageHeader>

      <Container>
        {/* ───────── Colour ───────── */}
        <Section id="colour" title="Colour" kicker="Five accents on warm paper. 500s are for fills and illustration; 700s are the only accent shades allowed for text. Yellow never carries text.">
          <div className="grid gap-6 lg:grid-cols-2">
            {palette.map((p) => (
              <div key={p.name}>
                <p className="font-bold">{p.name}</p>
                <p className="mb-3 text-sm text-ink-3">{p.role}</p>
                <ul className="flex overflow-hidden rounded-md border border-line">
                  {p.swatches.map(([k, hex]) => (
                    <li key={k} className="flex-1">
                      <div className="h-14" style={{ background: hex }} />
                      <div className="bg-surface px-1.5 py-1.5">
                        <p className="text-xs font-bold">{k}</p>
                        <p className="font-mono text-[10px] uppercase text-ink-3">{hex.slice(1)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="mb-3 mt-10 text-lg font-bold">Text contrast (WCAG 2.2)</h3>
          <div className="overflow-x-auto rounded-lg border border-line bg-surface">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="border-b border-line bg-paper text-left text-xs uppercase tracking-wide text-ink-3">
                <tr>
                  <th className="px-4 py-2.5">Pair</th>
                  <th className="px-4 py-2.5">Sample</th>
                  <th className="px-4 py-2.5">Ratio</th>
                  <th className="px-4 py-2.5">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {textPairs.map(([name, fg, bg]) => {
                  const r = contrast(fg, bg);
                  return (
                    <tr key={name}>
                      <td className="px-4 py-2.5 font-semibold">{name}</td>
                      <td className="px-4 py-2.5">
                        <span className="rounded-sm px-2 py-1 font-semibold" style={{ color: fg, background: bg }}>
                          Chapter 4 · 72%
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-mono tabular-nums">{r.toFixed(2)}:1</td>
                      <td className="px-4 py-2.5">
                        <Tag hue={r >= 7 ? "mint" : r >= 4.5 ? "royal" : "coral"}>{r >= 7 ? "AAA" : r >= 4.5 ? "AA" : "Large only"}</Tag>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <h3 className="mb-3 mt-10 text-lg font-bold">Subject colour mapping</h3>
          <div className="flex flex-wrap gap-4">
            {(["maths", "science", "social", "english", "hindi"] as const).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <SubjectIcon subject={s} />
                <span className="text-sm font-semibold capitalize">{s === "social" ? "Social Science" : s}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ───────── Type ───────── */}
        <Section id="type" title="Typography" kicker="Bricolage Grotesque gives headings a hand-set, slightly quirky character; Figtree keeps body text friendly and highly legible at small sizes. Devanagari falls back to the system font (Noto Sans Devanagari on Android).">
          <ul className="divide-y divide-line">
            {typeScale.map(([name, cls, spec, use]) => (
              <li key={name} className="grid gap-2 py-4 md:grid-cols-[120px_1fr_260px] md:items-baseline">
                <span className="text-sm font-bold text-ink-3">{name}</span>
                <span className={cn(cls, "truncate")}>{name === "Eyebrow" ? "Half-yearly revision" : "Squares & cubes"}</span>
                <span className="text-sm text-ink-3">
                  {spec}
                  <br />
                  {use}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        {/* ───────── Space ───────── */}
        <Section id="space" title="Spacing, radius & elevation" kicker="A 4px base grid. Components use 8–24px internally; sections are separated by 48–80px. Corners stay modest: 6px controls, 10px buttons and inputs, 16px cards, 24px only for hero panels.">
          <div className="grid gap-10 lg:grid-cols-2">
            <ul className="space-y-2">
              {spacing.map((s) => (
                <li key={s} className="flex items-center gap-4">
                  <span className="w-12 text-right font-mono text-sm text-ink-3">{s}px</span>
                  <span className="h-4 rounded-sm bg-royal-200" style={{ width: s * 3 }} />
                  <span className="text-xs text-ink-3">{s / 4 === Math.floor(s / 4) ? `space-${s / 4}` : ""}</span>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["radius-sm · 6px", "rounded-sm", ""],
                ["radius-md · 10px", "rounded-md", ""],
                ["radius-lg · 16px · card", "rounded-lg", "shadow-card"],
                ["radius-xl · 24px · lift", "rounded-xl", "shadow-lift"],
              ].map(([label, r, sh]) => (
                <div key={label} className={cn("grid h-24 place-items-center border border-line bg-surface p-3 text-center text-sm font-semibold", r, sh)}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ───────── Components ───────── */}
        <Section id="components" title="Components" kicker="Every component lives in src/components/ui or /features and is reused across pages. Icons are Lucide at 2–2.4 stroke, matching the hand-drawn doodles' line weight.">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <StateLabel>Buttons: primary · accent · secondary · ghost</StateLabel>
              <div className="flex flex-wrap items-center gap-3">
                <Button>Start lesson</Button>
                <Button variant="accent">Take the quiz</Button>
                <Button variant="secondary">Browse papers</Button>
                <Button variant="ghost">Skip</Button>
              </div>
              <StateLabel>
                <span className="mt-6 block">Sizes: sm 36 · md 44 · lg 52 (mobile primary)</span>
              </StateLabel>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button>Medium</Button>
                <Button size="lg" iconRight={<ArrowRight className="size-5" aria-hidden />}>
                  Large
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <StateLabel>Tags, filter chips, subject chips</StateLabel>
              <div className="flex flex-wrap gap-2">
                <Tag hue="mint">Completed</Tag>
                <Tag hue="sun">In progress</Tag>
                <Tag>Not started</Tag>
                <Tag hue="royal">Solutions</Tag>
                <Tag hue="lavender">SQP 2026–27</Tag>
                <Tag hue="coral">Exams</Tag>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-ink bg-ink px-4 py-2 text-sm font-semibold text-white">Selected</span>
                <span className="rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-semibold text-ink-2">Default</span>
              </div>
              <div className="mt-4 flex gap-2">
                {(["maths", "science", "social", "english", "hindi"] as const).map((s) => (
                  <SubjectIcon key={s} subject={s} size="sm" />
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <StateLabel>Progress: bar · ring (animate on mount)</StateLabel>
              <div className="space-y-4">
                <ProgressBar value={72} label="Demo" showValue />
                <ProgressBar value={45} hue="mint" label="Demo" size="sm" showValue />
                <div className="flex gap-4">
                  <ProgressRing value={60} label="Demo" />
                  <ProgressRing value={85} hue="coral" label="Demo" />
                  <ProgressRing value={100} hue="mint" label="Demo" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <StateLabel>Bookmark · download · switch (live)</StateLabel>
              <div className="flex flex-wrap items-center gap-3">
                <BookmarkButton withLabel className="border border-line-strong" item={{ id: "demo:ds", kind: "chapter", title: "Design system demo", meta: "Demo", href: "/design-system" }} />
                <DownloadButton label="Demo worksheet" sizeKb={410} />
              </div>
              <div className="mt-2 max-w-sm">
                <Switch label="Weekly report" description="Toggle me" defaultOn />
              </div>
            </Card>

            <Card className="p-6 lg:col-span-2">
              <StateLabel>Achievement badges: earned · locked with progress</StateLabel>
              <ul className="grid grid-cols-3 gap-4 sm:grid-cols-6">
                {badges.map((b) => (
                  <li key={b.id}>
                    <BadgeMedal badge={b} />
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 lg:col-span-2">
              <StateLabel>Illustration kit: one stroke language for every doodle</StateLabel>
              <div className="flex flex-wrap items-center gap-8 text-ink-2">
                <StarDoodle className="w-10 text-coral-500" />
                <SparkDoodle className="w-10 text-sun-500" />
                <AtomDoodle className="w-12 text-mint-600" />
                <ProtractorDoodle className="w-16 text-royal-500" />
                <ArrowDoodle className="w-16" />
                <span className="relative inline-block font-display text-2xl font-extrabold">
                  Keep it.
                  <Squiggle className="absolute -bottom-2 left-0 h-3 w-full" />
                </span>
                <span className="font-display text-2xl font-extrabold">
                  <Highlight>good teacher</Highlight>
                </span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="ruled h-24 rounded-md border border-line" />
                <div className="graph-paper h-24 rounded-md border border-line" />
              </div>
              <p className="mt-2 text-sm text-ink-3">Textures: ruled exercise-book paper (lessons, notes, teacher notes) and graph paper (manipulatives, formula sheets).</p>
            </Card>

            <Card className="p-6 lg:col-span-2">
              <StateLabel>Gyani the owl: five moods</StateLabel>
              <ul className="flex flex-wrap items-end gap-6">
                {(["happy", "wave", "think", "cheer", "oops"] as const).map((m) => (
                  <li key={m} className="flex flex-col items-center gap-2">
                    <Mascot mood={m} size={88} />
                    <span className="hand text-xl">{m}</span>
                  </li>
                ))}
                <li className="self-center">
                  <MascotBubble>Speech bubbles use the handwriting face.</MascotBubble>
                </li>
              </ul>
            </Card>

            <Card className="p-6 lg:col-span-2">
              <StateLabel>Surfaces: sticker, taped, chalkboard, cork</StateLabel>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="sticker sticker-hover grid h-28 place-items-center bg-royal-100 font-bold">.sticker</div>
                <div className="sticker tape tape-pink grid h-28 place-items-center bg-coral-50 font-bold">.tape</div>
                <div className="chalkboard grid h-28 place-items-center rounded-lg border-[6px] border-wood">
                  <span className="chalk text-3xl">.chalkboard</span>
                </div>
                <div className="cork grid h-28 place-items-center rounded-lg border-[6px] border-wood">
                  <span className="hand -rotate-3 bg-sun-100 px-3 py-1 text-xl shadow">.cork</span>
                </div>
              </div>
              <Marquee className="mt-6 bg-sun-400 font-display text-lg font-extrabold" tilt={0} items={["Marquee strip", "Pauses on hover", "Duplicated for a seamless loop"].map((t) => <span key={t}>{t}</span>)} />
            </Card>
          </div>
        </Section>

        {/* ───────── States ───────── */}
        <Section id="states" title="Component states" kicker="Every interactive element has five designed states. Focus is always a 3px royal-500 ring offset by 2px. It is never removed, only restyled.">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <StateLabel>Primary button</StateLabel>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {[
                  ["Default", ""],
                  ["Hover", "-translate-y-0.5 !bg-royal-500 !shadow-[0_6px_0_0_var(--color-ink)]"],
                  ["Focus", "outline outline-3 outline-offset-2 outline-royal-500"],
                  ["Pressed", "translate-y-[4px] !shadow-none"],
                  ["Disabled", "opacity-50"],
                ].map(([l, c]) => (
                  <div key={l}>
                    <p className="mb-2 text-xs text-ink-3">{l}</p>
                    <span className={cn("inline-flex h-11 items-center rounded-md border-2 border-ink bg-royal-600 px-4 font-bold text-white shadow-[0_4px_0_0_var(--color-ink)]", c)}>Start</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <StateLabel>Text input</StateLabel>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Default", "border-line-strong", ""],
                  ["Focus", "border-royal-500 shadow-[0_0_0_3px_var(--color-royal-100)]", ""],
                  ["Error", "border-danger-600 bg-danger-50", "Enter a number"],
                ].map(([l, c, err]) => (
                  <div key={l}>
                    <p className="mb-2 text-xs text-ink-3">{l}</p>
                    <div className={cn("flex h-11 items-center rounded-md border bg-surface px-3 text-ink-3", c)}>1728</div>
                    {err && <p className="mt-1 text-xs font-semibold text-danger-600">{err}</p>}
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6 lg:col-span-2">
              <StateLabel>Quiz answer option</StateLabel>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  ["Default", "border-line", "bg-sunken text-ink-2", "A"],
                  ["Selected", "border-royal-500 bg-royal-50", "bg-royal-600 text-white", "B"],
                  ["Correct", "border-mint-500 bg-mint-50", "bg-mint-500 text-white", "check"],
                  ["Incorrect", "border-coral-500 bg-coral-50", "bg-coral-500 text-white", "x"],
                  ["Dimmed", "border-line opacity-60", "bg-sunken text-ink-2", "D"],
                ].map(([l, c, k, glyph]) => (
                  <div key={l}>
                    <p className="mb-2 text-xs text-ink-3">{l}</p>
                    <div className={cn("flex min-h-14 items-center gap-3 rounded-lg border-2 px-3 font-semibold", c)}>
                      <span className={cn("grid size-8 place-items-center rounded-md font-display text-sm font-extrabold", k)}>
                        {glyph === "check" ? <Check className="size-4" strokeWidth={3} /> : glyph === "x" ? <X className="size-4" strokeWidth={3} /> : glyph}
                      </span>
                      1296
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6 lg:col-span-2">
              <StateLabel>Empty, loading and feedback states</StateLabel>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-dashed border-line-strong p-5 text-center text-sm text-ink-2">
                  <p className="font-bold text-ink">Nothing saved yet</p>
                  Tap the bookmark on any chapter to keep it here.
                </div>
                <div className="space-y-2 rounded-lg border border-line p-5" aria-hidden>
                  <div className="h-4 w-2/3 animate-pulse rounded-sm bg-sunken" />
                  <div className="h-3 w-full animate-pulse rounded-sm bg-sunken" />
                  <div className="h-3 w-5/6 animate-pulse rounded-sm bg-sunken" />
                </div>
                <p className="flex items-start gap-2 rounded-md border border-mint-200 bg-mint-50 p-4 text-sm text-mint-700">
                  <Check className="mt-0.5 size-4 shrink-0" strokeWidth={3} /> Correct! 36 = 6 × 6, so 36 is a perfect square.
                </p>
              </div>
            </Card>
          </div>
        </Section>

        {/* ───────── Motion ───────── */}
        <Section id="motion" title="Motion" kicker="Lively and celebratory: things bounce, float and burst into confetti when a child earns it. Under prefers-reduced-motion every animation, loop and confetti burst is switched off and the UI stays fully usable.">
          <div className="overflow-x-auto rounded-lg border border-line bg-surface">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-line bg-paper text-left text-xs uppercase tracking-wide text-ink-3">
                <tr>
                  {["Interaction", "Properties", "Duration", "Easing", "Notes"].map((h) => (
                    <th key={h} className="px-4 py-2.5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {motion.map((row) => (
                  <tr key={row[0]}>
                    {row.map((c, i) => (
                      <td key={i} className={cn("px-4 py-2.5", i === 0 && "font-semibold")}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ───────── Layout ───────── */}
        <Section id="layout" title="Layout & responsive" kicker="One 12-column fluid grid, max 1280px. Content-first breakpoints follow Tailwind defaults.">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Mobile · < 768px", "4 columns, 16px gutters. Bottom tab bar (Home, Learn, Practice, Saved, Planner) in the thumb zone; 56–64px targets; search opens full-screen; sidebars stack below content."],
              ["Tablet · 768–1023px", "8 columns, 24px gutters. Inline search in the header, bottom tab bar kept for one-handed use; two-column card grids."],
              ["Desktop · ≥ 1024px", "12 columns, 32px gutters. Top navigation with active underline; content + 320px right rail; tab bar hidden."],
            ].map(([t, d]) => (
              <Card key={t} className="p-5">
                <p className="font-bold">{t}</p>
                <p className="mt-2 text-sm text-ink-2">{d}</p>
              </Card>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-4 gap-2 md:grid-cols-8 lg:grid-cols-12" aria-hidden>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={cn("h-16 rounded-sm bg-coral-100", i >= 4 && "hidden md:block", i >= 8 && "md:hidden lg:block")} />
            ))}
          </div>
        </Section>

        {/* ───────── Principles ───────── */}
        <Section id="principles" title="Do & don't" kicker="Bold and playful, but always readable and never in the way of learning.">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-mint-200 p-6">
              <p className="flex items-center gap-2 font-bold text-mint-700">
                <Check className="size-5" strokeWidth={3} aria-hidden /> Do
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-2">
                <li>Use thick ink outlines and hard shadows to make things feel touchable</li>
                <li>Celebrate real effort: confetti, Gyani cheering, combo streaks</li>
                <li>Reference the real school world: blackboards, exercise books, notice boards, stamps</li>
                <li>Keep text on solid colour, at AA contrast or better</li>
                <li>Write in plain, warm language a 12-year-old can read</li>
              </ul>
            </Card>
            <Card className="border-coral-200 p-6">
              <p className="flex items-center gap-2 font-bold text-coral-700">
                <X className="size-5" strokeWidth={3} aria-hidden /> Don&apos;t
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-2">
                <li>Glassmorphism, neon glows, abstract 3D blobs or stock-AI photos</li>
                <li>Motion that hides content or blocks input (curtains are pointer-transparent)</li>
                <li>Confetti for things the child didn&apos;t do</li>
                <li>Mascot speech for errors that block progress</li>
                <li>Ignoring prefers-reduced-motion</li>
              </ul>
            </Card>
          </div>
        </Section>
      </Container>
    </>
  );
}
