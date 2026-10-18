import {
  Atom,
  BookOpenText,
  Briefcase,
  Calculator,
  Cpu,
  FlaskConical,
  Globe2,
  Landmark,
  Languages,
  Leaf,
  type LucideIcon,
  Map,
  Microscope,
  Palette,
  PiggyBank,
  Pi,
  Scale,
  ScrollText,
  Sprout,
  TrendingUp,
} from "lucide-react";

export interface SubjectStyle {
  icon: LucideIcon;
  /** Solid tile background + its text colour. */
  solid: string;
  /** Soft tinted background + accessible text. */
  soft: string;
  text: string;
  bar: string;
  hex: string;
}

const s = (icon: LucideIcon, solid: string, soft: string, text: string, bar: string, hex: string): SubjectStyle => ({ icon, solid, soft, text, bar, hex });

/** Subject ids are shared across classes, so one table styles every class. */
export const subjectStyles: Record<string, SubjectStyle> = {
  maths: s(Pi, "bg-brand-500 text-white", "bg-brand-50 text-brand-700", "text-brand-700", "bg-brand-500", "#2e5bff"),
  science: s(FlaskConical, "bg-green-500 text-white", "bg-green-50 text-green-700", "text-green-700", "bg-green-500", "#22c55e"),
  "social-science": s(Landmark, "bg-amber-500 text-white", "bg-amber-50 text-amber-700", "text-amber-700", "bg-amber-500", "#f59e0b"),
  english: s(BookOpenText, "bg-violet-500 text-white", "bg-violet-50 text-violet-700", "text-violet-700", "bg-violet-500", "#8b5cf6"),
  hindi: s(Languages, "bg-coral-500 text-white", "bg-coral-50 text-coral-700", "text-coral-700", "bg-coral-500", "#ff6b3d"),
  sanskrit: s(ScrollText, "bg-rose-500 text-white", "bg-rose-50 text-rose-700", "text-rose-700", "bg-rose-500", "#f43f5e"),
  evs: s(Sprout, "bg-emerald-500 text-white", "bg-emerald-50 text-emerald-700", "text-emerald-700", "bg-emerald-500", "#10b981"),
  "arts": s(Palette, "bg-pink-500 text-white", "bg-pink-50 text-pink-700", "text-pink-700", "bg-pink-500", "#ec4899"),
  physics: s(Atom, "bg-sky-500 text-white", "bg-sky-50 text-sky-700", "text-sky-700", "bg-sky-500", "#0ea5e9"),
  chemistry: s(FlaskConical, "bg-violet-500 text-white", "bg-violet-50 text-violet-700", "text-violet-700", "bg-violet-500", "#8b5cf6"),
  biology: s(Microscope, "bg-green-500 text-white", "bg-green-50 text-green-700", "text-green-700", "bg-green-500", "#22c55e"),
  accountancy: s(Calculator, "bg-amber-500 text-white", "bg-amber-50 text-amber-700", "text-amber-700", "bg-amber-500", "#f59e0b"),
  "business-studies": s(Briefcase, "bg-pink-500 text-white", "bg-pink-50 text-pink-700", "text-pink-700", "bg-pink-500", "#ec4899"),
  economics: s(TrendingUp, "bg-coral-500 text-white", "bg-coral-50 text-coral-700", "text-coral-700", "bg-coral-500", "#ff6b3d"),
  history: s(ScrollText, "bg-amber-500 text-white", "bg-amber-50 text-amber-700", "text-amber-700", "bg-amber-500", "#f59e0b"),
  geography: s(Map, "bg-sky-500 text-white", "bg-sky-50 text-sky-700", "text-sky-700", "bg-sky-500", "#0ea5e9"),
  "political-science": s(Scale, "bg-pink-500 text-white", "bg-pink-50 text-pink-700", "text-pink-700", "bg-pink-500", "#ec4899"),
  "computer-science": s(Cpu, "bg-brand-500 text-white", "bg-brand-50 text-brand-700", "text-brand-700", "bg-brand-500", "#2e5bff"),
  "information-technology": s(Cpu, "bg-brand-500 text-white", "bg-brand-50 text-brand-700", "text-brand-700", "bg-brand-500", "#2e5bff"),
  "financial-literacy": s(PiggyBank, "bg-emerald-500 text-white", "bg-emerald-50 text-emerald-700", "text-emerald-700", "bg-emerald-500", "#10b981"),
  environment: s(Leaf, "bg-emerald-500 text-white", "bg-emerald-50 text-emerald-700", "text-emerald-700", "bg-emerald-500", "#10b981"),
  world: s(Globe2, "bg-sky-500 text-white", "bg-sky-50 text-sky-700", "text-sky-700", "bg-sky-500", "#0ea5e9"),
};

export const styleFor = (id: string) => subjectStyles[id] ?? subjectStyles.maths;
