"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { strings, useT } from "@/lib/i18n";
import { num, SimFrame, SimSlider, Stat } from "./ui";

const S = strings({
  en: {
    title: "Quadratic explorer",
    intro: "Move the sliders for a, b and c. The graph of y = ax² + bx + c cuts the x-axis exactly at the roots of ax² + bx + c = 0.",
    presets: "Try",
    two: "Two roots",
    equal: "Equal roots",
    none: "No real roots",
    down: "Opens down",
    disc: "Discriminant D = b² − 4ac",
    nature: "Nature of roots",
    roots: "Roots",
    vertex: "Vertex",
    distinct: "D > 0: two distinct real roots. The parabola cuts the x-axis at two points.",
    equalR: "D = 0: two equal real roots. The parabola just touches the x-axis at its vertex.",
    noReal: "D < 0: no real roots. The parabola never meets the x-axis.",
    linear: "a = 0, so this is not a quadratic: the graph is a straight line.",
    linearRoot: (x: string) => `One root: x = ${x}`,
    noLinearRoot: "No root (the line is parallel to the x-axis).",
    allX: "Every x is a solution (0 = 0).",
    noneShort: "none (real)",
    working: "Working",
    offGraph: "Some of the action is outside the visible window (x and y from −10 to 10).",
  },
  hi: {
    title: "द्विघात समीकरण एक्सप्लोरर",
    intro: "a, b और c के स्लाइडर खिसकाएँ। y = ax² + bx + c का ग्राफ़ x-अक्ष को ठीक ax² + bx + c = 0 के मूलों पर काटता है।",
    presets: "आज़माएँ",
    two: "दो मूल",
    equal: "समान मूल",
    none: "कोई वास्तविक मूल नहीं",
    down: "नीचे की ओर खुला",
    disc: "विविक्तकर D = b² − 4ac",
    nature: "मूलों की प्रकृति",
    roots: "मूल",
    vertex: "शीर्ष",
    distinct: "D > 0: दो भिन्न वास्तविक मूल। परवलय x-अक्ष को दो बिंदुओं पर काटता है।",
    equalR: "D = 0: दो बराबर वास्तविक मूल। परवलय अपने शीर्ष पर x-अक्ष को केवल छूता है।",
    noReal: "D < 0: कोई वास्तविक मूल नहीं। परवलय x-अक्ष से कभी नहीं मिलता।",
    linear: "a = 0 है, इसलिए यह द्विघात नहीं है: ग्राफ़ एक सीधी रेखा है।",
    linearRoot: (x: string) => `एक मूल: x = ${x}`,
    noLinearRoot: "कोई मूल नहीं (रेखा x-अक्ष के समानांतर है)।",
    allX: "हर x एक हल है (0 = 0)।",
    noneShort: "कोई नहीं (वास्तविक)",
    working: "हल",
    offGraph: "कुछ हिस्सा दिखाई देने वाली खिड़की से बाहर है (x और y −10 से 10 तक)।",
  },
});

const SIZE = 400;
const SC = SIZE / 20;
const PX = (x: number) => SIZE / 2 + x * SC;
const PY = (y: number) => SIZE / 2 - y * SC;

function equation(a: number, b: number, c: number) {
  const parts: string[] = [];
  const term = (k: number, v: string) => {
    if (k === 0) return;
    const sign = k < 0 ? "−" : "+";
    const mag = Math.abs(k);
    const coef = v && mag === 1 ? "" : num(mag);
    parts.push(parts.length ? ` ${sign} ${coef}${v}` : `${k < 0 ? "−" : ""}${coef}${v}`);
  };
  term(a, "x²");
  term(b, "x");
  term(c, "");
  return `${parts.join("") || "0"} = 0`;
}

export function QuadraticSim() {
  const t = useT(S);
  const [a, setA] = useState(1);
  const [b, setB] = useState(-3);
  const [c, setC] = useState(2);
  const clipId = `quad-clip-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  const D = b * b - 4 * a * c;
  const quad = a !== 0;
  const roots = !quad ? (b !== 0 ? [-c / b] : []) : D > 0 ? [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)].sort((p, q) => p - q) : D === 0 ? [-b / (2 * a)] : [];
  const vx = quad ? -b / (2 * a) : 0;
  const vy = quad ? a * vx * vx + b * vx + c : 0;
  const f = (x: number) => a * x * x + b * x + c;

  const pts: string[] = [];
  for (let x = -10; x <= 10.0001; x += 0.05) {
    const y = Math.max(-60, Math.min(60, f(x)));
    pts.push(`${PX(x).toFixed(1)},${PY(y).toFixed(1)}`);
  }
  const outside = roots.some((r) => Math.abs(r) > 10) || (quad && (Math.abs(vx) > 10 || Math.abs(vy) > 10));

  const tone = !quad ? undefined : D > 0 ? "green" : D === 0 ? "amber" : "coral";
  const nature = !quad ? t.linear : D > 0 ? t.distinct : D === 0 ? t.equalR : t.noReal;
  const presets: { label: string; v: [number, number, number] }[] = [
    { label: t.two, v: [1, -3, 2] },
    { label: t.equal, v: [1, -4, 4] },
    { label: t.none, v: [1, 1, 1] },
    { label: t.down, v: [-1, 2, 3] },
  ];

  return (
    <SimFrame title={t.title} intro={t.intro}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-ink-3">{t.presets}:</span>
        {presets.map((p) => {
          const on = p.v[0] === a && p.v[1] === b && p.v[2] === c;
          return (
            <button
              key={p.label}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setA(p.v[0]);
                setB(p.v[1]);
                setC(p.v[2]);
              }}
              className={cn(
                "min-h-9 rounded-lg border-2 px-3 text-sm font-bold transition-colors",
                on ? "border-brand-400 bg-brand-50 text-brand-700" : "border-line bg-surface text-ink-2 hover:border-line-strong",
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <p className="mt-3 rounded-xl bg-surface-2 px-3 py-2 text-center font-mono text-lg font-extrabold text-ink">{equation(a, b, c)}</p>

      <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="mx-auto w-full max-w-sm overflow-hidden rounded-xl border border-line bg-canvas">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="block h-auto w-full" role="img" aria-label={`${t.title}: ${equation(a, b, c)}, D = ${num(D)}`}>
            <defs>
              <clipPath id={clipId}>
                <rect x={0} y={0} width={SIZE} height={SIZE} />
              </clipPath>
            </defs>
            {Array.from({ length: 21 }, (_, k) => k - 10).map((g) => (
              <g key={g}>
                <line x1={PX(g)} y1={0} x2={PX(g)} y2={SIZE} className={g === 0 ? "stroke-ink-3" : "stroke-line"} strokeWidth={g === 0 ? 2 : 1} />
                <line x1={0} y1={PY(g)} x2={SIZE} y2={PY(g)} className={g === 0 ? "stroke-ink-3" : "stroke-line"} strokeWidth={g === 0 ? 2 : 1} />
              </g>
            ))}
            {[-10, -5, 5, 10].map((g) => (
              <g key={`l${g}`} className="fill-ink-3 text-[11px] font-semibold">
                <text x={PX(g)} y={PY(0) + 14} textAnchor="middle">
                  {num(g)}
                </text>
                <text x={PX(0) + 5} y={PY(g) + 4}>
                  {num(g)}
                </text>
              </g>
            ))}
            <g clipPath={`url(#${clipId})`}>
              {quad && <line x1={PX(vx)} y1={0} x2={PX(vx)} y2={SIZE} className="stroke-violet-400" strokeWidth={1.5} strokeDasharray="5 5" />}
              <polyline points={pts.join(" ")} fill="none" className="stroke-brand-500" strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />
              {quad && <circle cx={PX(vx)} cy={PY(vy)} r={5.5} className="fill-violet-500 stroke-surface" strokeWidth={2} />}
              {roots.map((r) => (
                <circle key={r} cx={PX(r)} cy={PY(0)} r={7} className="fill-coral-500 stroke-surface" strokeWidth={2.5} />
              ))}
            </g>
          </svg>
        </div>

        <div className="min-w-0 space-y-4">
          <SimSlider label="a" value={a} min={-5} max={5} step={0.5} onChange={setA} format={(x) => num(x)} />
          <SimSlider label="b" value={b} min={-10} max={10} step={0.5} onChange={setB} format={(x) => num(x)} />
          <SimSlider label="c" value={c} min={-10} max={10} step={0.5} onChange={setC} format={(x) => num(x)} />
          <div className="grid grid-cols-2 gap-2">
            <Stat label="D" value={num(D)} tone={tone} />
            <Stat label={t.vertex} value={quad ? `(${num(vx)}, ${num(vy)})` : "–"} />
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2 rounded-xl bg-surface-2 p-3 text-[15px]" aria-live="polite">
        <p className="font-bold">
          {t.nature}:{" "}
          <span className={cn(tone === "green" && "text-green-700", tone === "amber" && "text-amber-700", tone === "coral" && "text-coral-700")}>{nature}</span>
        </p>
        {quad ? (
          <>
            <p className="font-mono text-sm text-ink-2">
              {t.working}: D = ({num(b)})² − 4 × ({num(a)}) × ({num(c)}) = {num(D)}
            </p>
            <p className="font-bold">
              {t.roots}:{" "}
              <span className="font-mono">
                {roots.length === 2 ? `x = ${num(roots[0])}, x = ${num(roots[1])}` : roots.length === 1 ? `x = ${num(roots[0])} (×2)` : t.noneShort}
              </span>
            </p>
          </>
        ) : (
          <p className="font-bold">{b !== 0 ? t.linearRoot(num(roots[0])) : c === 0 ? t.allX : t.noLinearRoot}</p>
        )}
        {outside && <p className="text-xs text-ink-3">{t.offGraph}</p>}
      </div>
    </SimFrame>
  );
}
