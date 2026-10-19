"use client";

import { useEffect, useRef, useState } from "react";
import { strings, useT } from "@/lib/i18n";
import { num, Segmented, SimFrame, SimSlider, Stat, useReducedMotion } from "./ui";

const S = strings({
  en: {
    title: "Ohm's law circuit",
    intro: "Change the battery voltage and the resistance. Watch the current (and the electron flow) respond, and see the point move along the V–I graph.",
    voltage: "Battery voltage V",
    r1: "Resistance R₁",
    r2: "Resistance R₂",
    mode: "Circuit",
    single: "One resistor",
    series: "Series",
    parallel: "Parallel",
    req: "Total R",
    current: "Current I",
    power: "Power P",
    branch: (n: number) => `I through R${n === 1 ? "₁" : "₂"}`,
    vAcross: (n: number) => `V across R${n === 1 ? "₁" : "₂"}`,
    graph: "V–I graph (slope = resistance)",
    offScale: "Point is off the graph (current above 6 A)",
    electrons: "Dots are electrons: they flow from − to +, opposite to conventional current. Their speed here shows the size of the current; real electrons drift only about a millimetre per second.",
    still: "Animation is paused because your device asks for reduced motion.",
    seriesNote: "Series: the same current flows through both resistors and their voltages add up to V.",
    parallelNote: "Parallel: both resistors get the full voltage and the currents add. Total R is less than the smaller resistor.",
    singleNote: "Double V and the current doubles: I = V / R.",
    ammeter: "Ammeter",
  },
  hi: {
    title: "ओम का नियम: परिपथ",
    intro: "बैटरी की वोल्टता और प्रतिरोध बदलें। देखें कि धारा (और इलेक्ट्रॉनों का प्रवाह) कैसे बदलती है, और V–I ग्राफ़ पर बिंदु कैसे खिसकता है।",
    voltage: "बैटरी वोल्टता V",
    r1: "प्रतिरोध R₁",
    r2: "प्रतिरोध R₂",
    mode: "परिपथ",
    single: "एक प्रतिरोधक",
    series: "श्रेणीक्रम",
    parallel: "पार्श्वक्रम",
    req: "कुल R",
    current: "धारा I",
    power: "शक्ति P",
    branch: (n: number) => `R${n === 1 ? "₁" : "₂"} में धारा`,
    vAcross: (n: number) => `R${n === 1 ? "₁" : "₂"} पर V`,
    graph: "V–I ग्राफ़ (ढाल = प्रतिरोध)",
    offScale: "बिंदु ग्राफ़ से बाहर है (धारा 6 A से अधिक)",
    electrons: "बिंदु इलेक्ट्रॉन हैं: ये − से + की ओर बहते हैं, परंपरागत धारा के विपरीत। यहाँ इनकी गति धारा का आकार दिखाती है; असली इलेक्ट्रॉन लगभग एक मिलीमीटर प्रति सेकंड ही खिसकते हैं।",
    still: "आपके डिवाइस में कम एनिमेशन की सेटिंग है, इसलिए एनिमेशन रुका है।",
    seriesNote: "श्रेणीक्रम: दोनों प्रतिरोधकों में समान धारा बहती है और उनकी वोल्टताएँ जुड़कर V बनती हैं।",
    parallelNote: "पार्श्वक्रम: दोनों प्रतिरोधकों पर पूरी वोल्टता होती है और धाराएँ जुड़ती हैं। कुल R छोटे प्रतिरोधक से भी कम होता है।",
    singleNote: "V दोगुना करें तो धारा भी दोगुनी: I = V / R।",
    ammeter: "अमीटर",
  },
});

type Mode = "single" | "series" | "parallel";
type Pt = [number, number];

// Circuit geometry (viewBox 480 × 280). Polylines run in the conventional-current direction.
const L = 50;
const R = 430;
const T = 70;
const B = 230;
const J1 = 150;
const J2 = 330;
const UP = 34;
const DOWN = 106;
const loop: Pt[] = [[L, T], [R, T], [R, B], [L, B], [L, T]];
const mainPar: Pt[] = [[J2, T], [R, T], [R, B], [L, B], [L, T], [J1, T]];
const upper: Pt[] = [[J1, T], [J1, UP], [J2, UP], [J2, T]];
const lower: Pt[] = [[J1, T], [J1, DOWN], [J2, DOWN], [J2, T]];

const lengthOf = (p: Pt[]) => p.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - p[i][0], q[1] - p[i][1]), 0);
function pointAt(p: Pt[], d: number): Pt {
  for (let i = 1; i < p.length; i++) {
    const seg = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
    if (d <= seg) return [p[i - 1][0] + ((p[i][0] - p[i - 1][0]) * d) / seg, p[i - 1][1] + ((p[i][1] - p[i - 1][1]) * d) / seg];
    d -= seg;
  }
  return p[p.length - 1];
}

const GAP = 26;
const speedFor = (amps: number) => Math.min(260, amps * 40);

function Dots({ path, phase }: { path: Pt[]; phase: number }) {
  const len = lengthOf(path);
  const n = Math.floor(len / GAP);
  const pts = Array.from({ length: n }, (_, k) => pointAt(path, (((k * GAP - phase) % len) + len) % len));
  return (
    <g className="fill-brand-500">
      {pts.map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r={3.6} />
      ))}
    </g>
  );
}

function Resistor({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect x={x - 34} y={y - 11} width={68} height={22} rx={4} className="fill-amber-100 stroke-amber-600" strokeWidth={2.5} />
      <text x={x} y={y + 5} textAnchor="middle" className="fill-amber-800 text-[13px] font-extrabold">
        {label}
      </text>
    </g>
  );
}

export function OhmSim() {
  const t = useT(S);
  const [mode, setMode] = useState<Mode>("single");
  const [v, setV] = useState(6);
  const [r1, setR1] = useState(4);
  const [r2, setR2] = useState(6);
  const reduced = useReducedMotion();

  const req = mode === "single" ? r1 : mode === "series" ? r1 + r2 : (r1 * r2) / (r1 + r2);
  const i = v / req;
  const i1 = mode === "parallel" ? v / r1 : i;
  const i2 = mode === "parallel" ? v / r2 : i;

  // Electron animation: phases advance with current; electrons move against the polyline direction.
  const phases = useRef({ main: 0, up: 0, down: 0 });
  const amps = useRef({ i, i1, i2 });
  amps.current = { i, i1, i2 };
  const [, setTick] = useState(0);
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const p = phases.current;
      p.main += speedFor(amps.current.i) * dt;
      p.up += speedFor(amps.current.i1) * dt;
      p.down += speedFor(amps.current.i2) * dt;
      setTick((n) => (n + 1) % 1e6);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);
  const ph = phases.current;

  // V–I graph: I on x (0–6 A), V on y (0–12 V).
  const GW = 300;
  const GH = 220;
  const gx = (a: number) => 40 + (a / 6) * (GW - 56);
  const gy = (volts: number) => GH - 30 - (volts / 12) * (GH - 50);
  const lineEndI = Math.min(6, 12 / req);
  const off = i > 6;

  const note = mode === "single" ? t.singleNote : mode === "series" ? t.seriesNote : t.parallelNote;

  return (
    <SimFrame title={t.title} intro={t.intro}>
      <Segmented
        label={t.mode}
        value={mode}
        onChange={setMode}
        options={[
          { id: "single", label: t.single },
          { id: "series", label: t.series },
          { id: "parallel", label: t.parallel },
        ]}
      />

      <div className="mt-3 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-xl border border-line bg-canvas">
          <svg viewBox="0 0 480 280" className="block h-auto w-full" role="img" aria-label={`${t.title}: V = ${v} V, R = ${num(req)} Ω, I = ${num(i)} A`}>
            <g fill="none" strokeWidth={3} strokeLinejoin="round" className="stroke-ink-2">
              {mode === "parallel" ? (
                <>
                  <polyline points={mainPar.map((p) => p.join(",")).join(" ")} />
                  <polyline points={upper.map((p) => p.join(",")).join(" ")} />
                  <polyline points={lower.map((p) => p.join(",")).join(" ")} />
                </>
              ) : (
                <polyline points={loop.map((p) => p.join(",")).join(" ")} />
              )}
            </g>

            {v > 0 &&
              (mode === "parallel" ? (
                <>
                  <Dots path={mainPar} phase={ph.main} />
                  <Dots path={upper} phase={ph.up} />
                  <Dots path={lower} phase={ph.down} />
                </>
              ) : (
                <Dots path={loop} phase={ph.main} />
              ))}

            {mode === "single" && <Resistor x={240} y={T} label={`R₁ ${r1} Ω`} />}
            {mode === "series" && (
              <>
                <Resistor x={170} y={T} label={`R₁ ${r1} Ω`} />
                <Resistor x={310} y={T} label={`R₂ ${r2} Ω`} />
              </>
            )}
            {mode === "parallel" && (
              <>
                <Resistor x={240} y={UP} label={`R₁ ${r1} Ω`} />
                <Resistor x={240} y={DOWN} label={`R₂ ${r2} Ω`} />
                <circle cx={J1} cy={T} r={4.5} className="fill-ink-2" />
                <circle cx={J2} cy={T} r={4.5} className="fill-ink-2" />
              </>
            )}

            {/* battery on the left wire: long plate (+) on top */}
            <rect x={L - 24} y={132} width={48} height={32} className="fill-canvas" />
            <line x1={L - 22} y1={138} x2={L + 22} y2={138} strokeWidth={4} className="stroke-ink" />
            <line x1={L - 12} y1={156} x2={L + 12} y2={156} strokeWidth={7} className="stroke-ink" />
            <text x={L + 30} y={136} className="fill-coral-600 text-[18px] font-extrabold">
              +
            </text>
            <text x={L + 30} y={166} className="fill-brand-700 text-[18px] font-extrabold">
              −
            </text>
            <text x={L + 30} y={190} className="fill-ink-2 text-[14px] font-extrabold">
              {num(v, 1)} V
            </text>

            {/* ammeter on the bottom wire */}
            <circle cx={240} cy={B} r={19} className="fill-surface stroke-green-600" strokeWidth={3} />
            <text x={240} y={B + 6} textAnchor="middle" className="fill-green-700 text-[16px] font-extrabold">
              A
            </text>
            <text x={240} y={B + 40} textAnchor="middle" className="fill-green-700 text-[15px] font-extrabold">
              {t.ammeter}: {num(i)} A
            </text>
          </svg>
        </div>

        <div className="overflow-hidden rounded-xl border border-line bg-canvas">
          <p className="px-3 pt-2 text-xs font-bold uppercase tracking-wide text-ink-3">{t.graph}</p>
          <svg viewBox={`0 0 ${GW} ${GH}`} className="block h-auto w-full" role="img" aria-label={`${t.graph}: R = ${num(req)} Ω`}>
            {[0, 2, 4, 6].map((a) => (
              <g key={`i${a}`}>
                <line x1={gx(a)} y1={gy(0)} x2={gx(a)} y2={gy(12)} className="stroke-line" strokeWidth={1} />
                <text x={gx(a)} y={gy(0) + 16} textAnchor="middle" className="fill-ink-3 text-[11px] font-semibold">
                  {a}
                </text>
              </g>
            ))}
            {[0, 4, 8, 12].map((vv) => (
              <g key={`v${vv}`}>
                <line x1={gx(0)} y1={gy(vv)} x2={gx(6)} y2={gy(vv)} className="stroke-line" strokeWidth={1} />
                <text x={gx(0) - 8} y={gy(vv) + 4} textAnchor="end" className="fill-ink-3 text-[11px] font-semibold">
                  {vv}
                </text>
              </g>
            ))}
            <text x={gx(6)} y={gy(0) + 28} textAnchor="end" className="fill-ink-2 text-[11px] font-bold">
              I (A) →
            </text>
            <text x={gx(0) + 4} y={gy(12) - 6} className="fill-ink-2 text-[11px] font-bold">
              ↑ V (V)
            </text>
            <line x1={gx(0)} y1={gy(0)} x2={gx(lineEndI)} y2={gy(lineEndI * req)} className="stroke-brand-500" strokeWidth={3} strokeLinecap="round" />
            {!off && <circle cx={gx(i)} cy={gy(v)} r={7} className="fill-coral-500 stroke-surface" strokeWidth={2.5} />}
          </svg>
          {off && <p className="px-3 pb-2 text-xs font-bold text-coral-700">{t.offScale}</p>}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <SimSlider label={t.voltage} value={v} min={0} max={12} step={0.5} onChange={setV} format={(x) => `${num(x, 1)} V`} />
        <SimSlider label={t.r1} value={r1} min={1} max={20} step={1} onChange={setR1} format={(x) => `${x} Ω`} />
        {mode !== "single" && <SimSlider label={t.r2} value={r2} min={1} max={20} step={1} onChange={setR2} format={(x) => `${x} Ω`} />}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat label={t.req} value={`${num(req)} Ω`} tone="amber" />
        <Stat label={t.current} value={`${num(i)} A`} tone="green" />
        <Stat label={t.power} value={`${num(v * i, 1)} W`} />
        {mode === "series" && (
          <>
            <Stat label={t.vAcross(1)} value={`${num(i * r1)} V`} />
            <Stat label={t.vAcross(2)} value={`${num(i * r2)} V`} />
          </>
        )}
        {mode === "parallel" && (
          <>
            <Stat label={t.branch(1)} value={`${num(i1)} A`} />
            <Stat label={t.branch(2)} value={`${num(i2)} A`} />
          </>
        )}
      </div>

      <p className="mt-3 rounded-xl bg-brand-50 p-3 text-[15px] font-semibold text-brand-800">{note}</p>
      <p className="mt-2 text-xs text-ink-3">{reduced ? t.still : t.electrons}</p>
    </SimFrame>
  );
}
