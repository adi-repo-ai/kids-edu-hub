"use client";

import { CheckCircle2, Circle, Target } from "lucide-react";
import { useId, useRef, useState, type PointerEvent } from "react";
import { cn } from "@/lib/cn";
import { strings, useT } from "@/lib/i18n";
import { num, SimFrame, SimSlider, Stat } from "./ui";

const S = strings({
  en: {
    title: "Convex lens: ray diagram",
    intro: "Drag the blue object along the axis (or use the slider). The lens formula updates the image live, using the New Cartesian sign convention.",
    object: "Object distance u",
    focal: "Focal length f",
    image: "Image distance v",
    mag: "Magnification m",
    real: "Real",
    virtual: "Virtual",
    inverted: "inverted",
    erect: "erect",
    magnified: "magnified",
    diminished: "diminished",
    same: "same size",
    infinity: "Object at F: rays emerge parallel, so the image is at infinity (highly enlarged).",
    sameSide: "Image is on the same side as the object.",
    otherSide: "Image is on the other side of the lens.",
    offscreen: "The image is beyond the edge of the diagram.",
    nature: "Nature of image",
    working: "Working",
    dragHint: "Drag the object",
    objLabel: "Object",
    imgLabel: "Image",
    challenges: "Challenges",
    allDone: "All three done. You have mapped every case of a convex lens!",
    c1: "Make the image virtual and erect",
    c1why: "When the object is between F and the lens, the refracted rays spread out. They only seem to meet behind the lens, so the image is virtual, erect and magnified, like a magnifying glass.",
    c2: "Make a real image the same size as the object",
    c2why: "At 2F₁ the image forms at 2F₂: real, inverted and the same size (m = −1).",
    c3: "Make a real, inverted, magnified image",
    c3why: "Between F₁ and 2F₁ the image forms beyond 2F₂ and is magnified, which is how a projector works.",
    done: "Done",
    cm: "cm",
    signNote: "Distances are measured from the optical centre O: left of the lens is negative, right is positive. Heights above the axis are positive.",
  },
  hi: {
    title: "उत्तल लेंस: किरण आरेख",
    intro: "नीली वस्तु को अक्ष पर खींचें (या स्लाइडर का उपयोग करें)। लेंस सूत्र नई कार्तीय चिह्न परिपाटी से प्रतिबिंब तुरंत बदलता है।",
    object: "वस्तु दूरी u",
    focal: "फोकस दूरी f",
    image: "प्रतिबिंब दूरी v",
    mag: "आवर्धन m",
    real: "वास्तविक",
    virtual: "आभासी",
    inverted: "उल्टा",
    erect: "सीधा",
    magnified: "आवर्धित",
    diminished: "छोटा",
    same: "समान आकार",
    infinity: "वस्तु F पर है: किरणें समानांतर निकलती हैं, इसलिए प्रतिबिंब अनंत पर बनता है (बहुत बड़ा)।",
    sameSide: "प्रतिबिंब वस्तु की ओर ही बनता है।",
    otherSide: "प्रतिबिंब लेंस के दूसरी ओर बनता है।",
    offscreen: "प्रतिबिंब आरेख के किनारे से बाहर है।",
    nature: "प्रतिबिंब की प्रकृति",
    working: "हल",
    dragHint: "वस्तु को खींचें",
    objLabel: "वस्तु",
    imgLabel: "प्रतिबिंब",
    challenges: "चुनौतियाँ",
    allDone: "तीनों पूरी! आपने उत्तल लेंस के सभी मामले देख लिए।",
    c1: "प्रतिबिंब को आभासी और सीधा बनाइए",
    c1why: "जब वस्तु F और लेंस के बीच होती है, तो अपवर्तित किरणें फैल जाती हैं। वे केवल लेंस के पीछे मिलती प्रतीत होती हैं, इसलिए प्रतिबिंब आभासी, सीधा और आवर्धित होता है, जैसे आवर्धक लेंस में।",
    c2: "वस्तु के समान आकार का वास्तविक प्रतिबिंब बनाइए",
    c2why: "2F₁ पर रखी वस्तु का प्रतिबिंब 2F₂ पर बनता है: वास्तविक, उल्टा और समान आकार का (m = −1)।",
    c3: "वास्तविक, उल्टा और आवर्धित प्रतिबिंब बनाइए",
    c3why: "F₁ और 2F₁ के बीच रखी वस्तु का प्रतिबिंब 2F₂ से आगे बनता है और बड़ा होता है, जैसे प्रोजेक्टर में।",
    done: "पूरा",
    cm: "सेमी",
    signNote: "दूरियाँ प्रकाशिक केंद्र O से मापी जाती हैं: लेंस के बाईं ओर ऋणात्मक, दाईं ओर धनात्मक। अक्ष के ऊपर की ऊँचाई धनात्मक है।",
  },
});

// Drawing scale: x in cm from −50 to 50 across 640 px, heights 10 px per cm.
const W = 640;
const H = 300;
const AX = H / 2;
const SX = 6.4;
const SY = 10;
const X = (cm: number) => W / 2 + cm * SX;
const Y = (cm: number) => AX - cm * SY;
const OBJ_H = 4;

function Arrow({ x, h, className, dashed }: { x: number; h: number; className: string; dashed?: boolean }) {
  const tip = Y(h);
  const dir = h >= 0 ? 1 : -1;
  return (
    <g className={className}>
      <line x1={X(x)} y1={AX} x2={X(x)} y2={tip} strokeWidth={4} stroke="currentColor" strokeDasharray={dashed ? "6 5" : undefined} strokeLinecap="round" />
      <path d={`M ${X(x)} ${tip - dir * 2} l -8 ${dir * 13} l 16 0 z`} fill="currentColor" />
    </g>
  );
}

export function LensSim() {
  const t = useT(S);
  const [u, setU] = useState(-30);
  const [f, setF] = useState(10);
  const [done, setDone] = useState<boolean[]>([false, false, false]);
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const clipId = `lens-clip-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  const atF = Math.abs(u + f) < 0.25;
  const v = atF ? Infinity : (u * f) / (u + f);
  const m = atF ? Infinity : v / u;
  const imgH = m * OBJ_H;
  const real = v > 0;
  const size = !Number.isFinite(m) ? t.magnified : Math.abs(m) > 1.04 ? t.magnified : Math.abs(m) < 0.96 ? t.diminished : t.same;
  const offscreen = Number.isFinite(v) && (Math.abs(v) > 50 || Math.abs(imgH) > 14.5);

  // Challenge checks run on every change.
  const checks = [
    Number.isFinite(v) && v < 0,
    Number.isFinite(v) && v > 0 && Math.abs(m + 1) < 0.05,
    Number.isFinite(v) && v > 0 && m < -1.04,
  ];
  if (checks.some((c, i) => c && !done[i])) setDone(done.map((d, i) => d || checks[i]));

  const challenges = [
    { title: t.c1, why: t.c1why },
    { title: t.c2, why: t.c2why },
    { title: t.c3, why: t.c3why },
  ];
  const current = done.findIndex((d) => !d);

  const setObject = (cm: number) => setU(Math.max(-48, Math.min(-1, Math.round(cm * 2) / 2)));

  const toWorld = (e: PointerEvent) => {
    const el = svg.current;
    const ctm = el?.getScreenCTM();
    if (!el || !ctm) return null;
    const pt = el.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(ctm.inverse());
    return (p.x - W / 2) / SX;
  };

  // Ray 1: parallel to axis, then through F₂. Ray 2: straight through the optical centre O.
  const edge = 52;
  const r1y = (x: number) => OBJ_H - (OBJ_H * x) / f;
  const r2y = (x: number) => (OBJ_H * x) / u;

  const marks = [
    { x: -2 * f, l: "2F₁" },
    { x: -f, l: "F₁" },
    { x: 0, l: "O" },
    { x: f, l: "F₂" },
    { x: 2 * f, l: "2F₂" },
  ];

  return (
    <SimFrame title={t.title} intro={t.intro}>
      <div className="overflow-hidden rounded-xl border border-line bg-canvas">
        <svg
          ref={svg}
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full touch-none select-none"
          role="img"
          aria-label={`${t.title}. u = ${num(u, 1)} ${t.cm}, f = ${f} ${t.cm}, v = ${num(v, 1)} ${t.cm}`}
          onPointerMove={(e) => {
            if (!dragging.current) return;
            const x = toWorld(e);
            if (x !== null) setObject(x);
          }}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
        >
          <defs>
            <clipPath id={clipId}>
              <rect x={0} y={0} width={W} height={H} />
            </clipPath>
          </defs>
          {/* principal axis and marks */}
          <line x1={0} y1={AX} x2={W} y2={AX} className="stroke-line-strong" strokeWidth={2} />
          {marks.map((k) => (
            <g key={k.l}>
              <circle cx={X(k.x)} cy={AX} r={3.5} className="fill-ink-3" />
              <text x={X(k.x)} y={AX + 22} textAnchor="middle" className="fill-ink-3 text-[13px] font-bold">
                {k.l}
              </text>
            </g>
          ))}
          {/* lens */}
          <ellipse cx={X(0)} cy={AX} rx={11} ry={120} className="fill-brand-100 stroke-brand-400" strokeWidth={2} opacity={0.85} />

          <g clipPath={`url(#${clipId})`} strokeWidth={2.5} fill="none" strokeLinecap="round">
            {/* ray 1 */}
            <polyline points={`${X(u)},${Y(OBJ_H)} ${X(0)},${Y(OBJ_H)} ${X(edge)},${Y(r1y(edge))}`} className="stroke-amber-500" />
            {/* ray 2 */}
            <polyline points={`${X(u)},${Y(OBJ_H)} ${X(edge)},${Y(r2y(edge))}`} className="stroke-green-600" />
            {/* virtual image: dashed back-extensions */}
            {Number.isFinite(v) && !real && (
              <g strokeDasharray="5 6" strokeWidth={1.8}>
                <line x1={X(0)} y1={Y(OBJ_H)} x2={X(v)} y2={Y(imgH)} className="stroke-amber-500" />
                <line x1={X(0)} y1={Y(0)} x2={X(v)} y2={Y(imgH)} className="stroke-green-600" />
              </g>
            )}
            {/* image */}
            {Number.isFinite(v) && <Arrow x={v} h={imgH} className="text-coral-500" dashed={!real} />}
          </g>
          {Number.isFinite(v) && !offscreen && (
            <text x={X(v)} y={imgH >= 0 ? Y(imgH) - 10 : Y(imgH) + 22} textAnchor="middle" className="fill-coral-700 text-[13px] font-extrabold">
              {t.imgLabel}
            </text>
          )}

          {/* object (draggable) */}
          <Arrow x={u} h={OBJ_H} className="text-brand-600" />
          <text x={X(u)} y={Y(OBJ_H) - 12} textAnchor="middle" className="fill-brand-700 text-[13px] font-extrabold">
            {t.objLabel}
          </text>
          <rect
            x={X(u) - 22}
            y={Y(OBJ_H) - 30}
            width={44}
            height={OBJ_H * SY + 44}
            fill="transparent"
            className="cursor-grab active:cursor-grabbing"
            aria-hidden
            onPointerDown={(e) => {
              dragging.current = true;
              e.currentTarget.ownerSVGElement?.setPointerCapture(e.pointerId);
            }}
          />
          <text x={X(u)} y={AX + 44} textAnchor="middle" className="fill-ink-3 text-[11px] font-semibold">
            ⇆ {t.dragHint}
          </text>
        </svg>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <SimSlider label={t.object} value={u} min={-48} max={-1} step={0.5} onChange={setObject} format={(x) => `${num(x, 1)} ${t.cm}`} />
        <SimSlider label={t.focal} value={f} min={5} max={15} step={1} onChange={setF} format={(x) => `+${x} ${t.cm}`} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="u" value={`${num(u, 1)}`} tone="brand" />
        <Stat label="f" value={`+${f}`} />
        <Stat label="v" value={num(v, 1)} tone="coral" />
        <Stat label="m" value={num(m, 2)} tone="amber" />
      </div>

      <div className="mt-3 rounded-xl bg-surface-2 p-3 text-[15px]">
        <p className="font-bold">
          {t.nature}:{" "}
          {Number.isFinite(v) ? (
            <span className={real ? "text-coral-700" : "text-brand-700"}>
              {real ? t.real : t.virtual}, {m < 0 ? t.inverted : t.erect}, {size}
            </span>
          ) : (
            <span className="text-ink-2">{t.infinity}</span>
          )}
        </p>
        {Number.isFinite(v) && (
          <p className="mt-1 text-ink-2">
            {real ? t.otherSide : t.sameSide} {offscreen && t.offscreen}
          </p>
        )}
        <p className="mt-2 font-mono text-sm text-ink-2">
          {t.working}: 1/v = 1/f + 1/u = 1/{f} + 1/({num(u, 1)}) ⇒ v = {num(v, 1)} {t.cm}; m = v/u = {num(m, 2)}
        </p>
        <p className="mt-2 text-xs text-ink-3">{t.signNote}</p>
      </div>

      <div className="mt-4">
        <p className="eyebrow mb-2 flex items-center gap-1.5">
          <Target aria-hidden className="size-4" /> {t.challenges}
        </p>
        <ol className="space-y-2">
          {challenges.map((c, i) => (
            <li
              key={c.title}
              className={cn(
                "rounded-xl border-2 p-3",
                done[i] ? "border-green-200 bg-green-50" : i === current ? "border-brand-200 bg-brand-50" : "border-line bg-surface",
              )}
            >
              <p className="flex items-start gap-2 font-bold">
                {done[i] ? <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-green-600" /> : <Circle aria-hidden className="mt-0.5 size-5 shrink-0 text-ink-3" />}
                <span>
                  {c.title}
                  {done[i] && <span className="sr-only"> ({t.done})</span>}
                </span>
              </p>
              {done[i] && <p className="mt-1 pl-7 text-sm text-ink-2">{c.why}</p>}
            </li>
          ))}
        </ol>
        {current === -1 && <p className="mt-3 font-bold text-green-700" role="status">{t.allDone}</p>}
      </div>
    </SimFrame>
  );
}
