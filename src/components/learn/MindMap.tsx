"use client";

import { strings, useT } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const S = strings({
  en: {
    label: (title: string) => `Mind map of ${title}`,
    hint: "Tap any box to jump to that part of the lesson. Scroll sideways on small screens.",
    empty: "This lesson has no sections to map yet.",
    types: { KEY: "Key idea", EXAMPLE: "Example", TIP: "Tip", FORMULA: "Formula", REMEMBER: "Remember", MISTAKE: "Mistake" } as Record<string, string>,
  },
  hi: {
    label: (title: string) => `${title} का माइंड मैप`,
    hint: "पाठ के उस हिस्से पर जाने के लिए किसी भी बॉक्स पर टैप करें। छोटी स्क्रीन पर बगल में स्क्रॉल करें।",
    empty: "इस पाठ में अभी मैप करने के लिए कोई भाग नहीं है।",
    types: { KEY: "मुख्य बात", EXAMPLE: "उदाहरण", TIP: "सुझाव", FORMULA: "सूत्र", REMEMBER: "याद रखें", MISTAKE: "आम गलती" } as Record<string, string>,
  },
});

export interface MindMapSection {
  id: string;
  title: string;
  callouts: { type: string; title: string }[];
}

const tone: Record<string, { box: string; tag: string; line: string }> = {
  KEY: { box: "border-brand-200 bg-brand-50", tag: "text-brand-700", line: "stroke-brand-300" },
  FORMULA: { box: "border-violet-200 bg-violet-50", tag: "text-violet-700", line: "stroke-violet-300" },
  EXAMPLE: { box: "border-green-200 bg-green-50", tag: "text-green-700", line: "stroke-green-300" },
  TIP: { box: "border-amber-200 bg-amber-50", tag: "text-amber-700", line: "stroke-amber-300" },
  REMEMBER: { box: "border-cyan-200 bg-cyan-50", tag: "text-cyan-700", line: "stroke-cyan-300" },
  MISTAKE: { box: "border-coral-100 bg-coral-50", tag: "text-coral-700", line: "stroke-coral-500/40" },
};
const toneOf = (type: string) => tone[type] ?? tone.KEY;

// Tree layout: chapter on the left, sections in the middle, callouts on the right.
const ROW = 64;
const ROOT_W = 170;
const SEC_X = 220;
const SEC_W = 220;
const LEAF_X = 490;
const LEAF_W = 250;
const WIDTH = LEAF_X + LEAF_W;
const NODE_H = 52;

/**
 * Chapter mind map built from the lesson's sections and callout titles. Every node is a button that
 * jumps to its section (or callout) in the lesson.
 */
export function MindMap({ title, sections, hindi, onJump }: { title: string; sections: MindMapSection[]; hindi: boolean; onJump: (sectionId: string, callout?: string) => void }) {
  const t = useT(S);
  if (!sections.length) return <p className="card p-6 text-ink-2">{t.empty}</p>;

  // Each section takes as many rows as it has callouts (at least one).
  let row = 0;
  const laid = sections.map((s) => {
    const rows = Math.max(1, s.callouts.length);
    const top = row * ROW;
    row += rows;
    const leaves = s.callouts.map((c, k) => ({ ...c, y: top + k * ROW + ROW / 2 }));
    return { ...s, y: top + (rows * ROW) / 2, leaves };
  });
  const height = Math.max(row * ROW, ROW * 2);
  const rootY = height / 2;
  const lang = hindi ? "hi" : undefined;

  const curve = (x1: number, y1: number, x2: number, y2: number) => {
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  };

  return (
    <div className="card p-3 sm:p-5">
      <p className="mb-3 px-1 text-sm font-semibold text-ink-3">{t.hint}</p>
      <div className="overflow-x-auto pb-2" role="region" aria-label={t.label(title)} tabIndex={0}>
        <div className="relative" style={{ width: WIDTH, height }}>
          <svg width={WIDTH} height={height} className="absolute inset-0" aria-hidden>
            {laid.map((s) => (
              <g key={s.id} fill="none" strokeWidth={2.5}>
                <path d={curve(ROOT_W, rootY, SEC_X, s.y)} className="stroke-brand-200" />
                {s.leaves.map((l, k) => (
                  <path key={k} d={curve(SEC_X + SEC_W, s.y, LEAF_X, l.y)} className={toneOf(l.type).line} strokeWidth={2} />
                ))}
              </g>
            ))}
          </svg>

          <button
            type="button"
            onClick={() => onJump("")}
            lang={lang}
            className="absolute flex items-center rounded-2xl border-b-4 border-brand-700 bg-brand-500 px-4 text-left text-[15px] font-extrabold leading-snug text-white hover:bg-brand-400"
            style={{ left: 0, top: rootY - 44, width: ROOT_W, height: 88 }}
          >
            <span className="line-clamp-3">{title}</span>
          </button>

          {laid.map((s, i) => (
            <div key={s.id}>
              <button
                type="button"
                onClick={() => onJump(s.id)}
                lang={lang}
                title={s.title}
                className="absolute flex items-center gap-2 rounded-xl border-2 border-line-strong bg-surface px-3 text-left text-sm font-bold leading-snug text-ink hover:border-brand-400 hover:text-brand-700"
                style={{ left: SEC_X, top: s.y - NODE_H / 2, width: SEC_W, height: NODE_H }}
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-brand-100 text-xs font-extrabold text-brand-700">{i + 1}</span>
                <span className="line-clamp-2 min-w-0">{s.title}</span>
              </button>
              {s.leaves.map((l, k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => onJump(s.id, l.title)}
                  title={l.title}
                  className={cn("absolute flex flex-col justify-center rounded-xl border px-3 text-left hover:shadow-card", toneOf(l.type).box)}
                  style={{ left: LEAF_X, top: l.y - NODE_H / 2 + 2, width: LEAF_W, height: NODE_H - 4 }}
                >
                  <span className={cn("text-[10px] font-extrabold uppercase tracking-wider", toneOf(l.type).tag)}>{t.types[l.type] ?? l.type}</span>
                  <span lang={lang} className="truncate text-[13px] font-semibold text-ink">
                    {l.title}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
