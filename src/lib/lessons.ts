import "server-only";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Marked } from "marked";
import type { LessonDoc, QuizQuestion } from "./types";

/*
 * Lessons live in src/content/lessons/class-<g>/<subject>.md, one file per subject:
 *
 *   === chapter-id ===
 *   ## A section heading
 *   Markdown text…
 *   > [!KEY] Optional title
 *   > Callout body (KEY, EXAMPLE, TIP, FORMULA, REMEMBER, MISTAKE)
 *   --- quiz ---
 *   Q: Multiple-choice prompt
 *   - wrong option
 *   * correct option
 *   > explanation
 *
 *   W[3]: Written question worth 3 marks
 *   A: Model answer (may continue over several lines)
 */

const ROOT = join(process.cwd(), "src/content/lessons");

const calloutTitles: Record<string, string> = {
  KEY: "Key idea",
  EXAMPLE: "Worked example",
  TIP: "Tip",
  FORMULA: "Formula",
  REMEMBER: "Remember",
  MISTAKE: "Common mistake",
};

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");

/** Turns `> [!TYPE] title` blockquotes into styled callout boxes. */
function expandCallouts(md: string) {
  const out: string[] = [];
  const lines = md.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^>\s*\[!(\w+)\]\s*(.*)$/);
    if (!m) {
      out.push(lines[i]);
      continue;
    }
    const type = m[1].toUpperCase();
    const title = m[2].trim() || calloutTitles[type] || type;
    const body: string[] = [];
    while (i + 1 < lines.length && /^>/.test(lines[i + 1])) body.push(lines[++i].replace(/^>\s?/, ""));
    out.push(
      "",
      `<div class="callout callout-${type.toLowerCase()}">`,
      `<p class="callout-title">${title}</p>`,
      "",
      body.join("\n"),
      "",
      "</div>",
      "",
    );
  }
  return out.join("\n");
}

/** Simulations that can be embedded in a lesson with a `::sim[id]` line. */
export const SIM_IDS = ["lens", "ohm", "quadratic"] as const;
export type SimId = (typeof SIM_IDS)[number];

/** Turns `::sim[id]` lines into `<div data-sim="id"></div>` placeholders (unknown ids are dropped). */
function expandSims(md: string) {
  return md.replace(/^::sim\[([a-z0-9-]+)\]\s*$/gm, (_, id: string) =>
    (SIM_IDS as readonly string[]).includes(id) ? `\n<div data-sim="${id}"></div>\n` : "",
  );
}

const SIM_RE = /<div data-sim="([a-z0-9-]+)"><\/div>/g;

/** Splits lesson HTML at simulation placeholders: alternating HTML strings and sim ids. */
export function splitSims(html: string): ({ kind: "html"; html: string } | { kind: "sim"; id: SimId })[] {
  const out: ({ kind: "html"; html: string } | { kind: "sim"; id: SimId })[] = [];
  let last = 0;
  for (const m of html.matchAll(SIM_RE)) {
    out.push({ kind: "html", html: html.slice(last, m.index) });
    out.push({ kind: "sim", id: m[1] as SimId });
    last = (m.index ?? 0) + m[0].length;
  }
  out.push({ kind: "html", html: html.slice(last) });
  return out.filter((p) => p.kind === "sim" || p.html.trim());
}

/** Replaces simulation placeholders with a short note (or nothing), for print/PDF output. */
export function stripSims(html: string, note?: string) {
  return html.replace(SIM_RE, note ? `<p class="sim-note"><em>${note}</em></p>` : "");
}

function parseQuiz(src: string): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  const blocks = src.trim().split(/\n\s*\n/);
  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trimEnd());
    const head = lines[0] ?? "";
    const written = head.match(/^W\[(\d+)\]:\s*(.*)$/);
    if (written) {
      const ai = lines.findIndex((l) => l.startsWith("A:"));
      const prompt = [written[2], ...lines.slice(1, ai < 0 ? undefined : ai)].join(" ").trim();
      const answer = ai < 0 ? "" : [lines[ai].slice(2).trim(), ...lines.slice(ai + 1)].join("\n").trim();
      qs.push({ kind: "written", prompt, answer, marks: Number(written[1]) });
      continue;
    }
    const q = head.match(/^Q(?:\[(\d+)\])?:\s*(.*)$/);
    if (!q) continue;
    const options = lines.filter((l) => /^[-*]\s/.test(l)).map((l) => ({ text: l.slice(2).trim(), correct: l.startsWith("*") }));
    const explanation = lines
      .filter((l) => l.startsWith(">"))
      .map((l) => l.replace(/^>\s?/, ""))
      .join(" ")
      .trim();
    const promptExtra = lines.slice(1).filter((l) => !/^[-*>]\s?/.test(l));
    qs.push({ kind: "mcq", prompt: [q[2], ...promptExtra].join(" ").trim(), options, explanation: explanation || undefined, marks: q[1] ? Number(q[1]) : 1 });
  }
  return qs;
}

function render(md: string) {
  const toc: LessonDoc["toc"] = [];
  const marked = new Marked({ gfm: true, breaks: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const id = slugify(text);
        if (depth === 2) toc.push({ id, title: text.replace(/<[^>]+>/g, "") });
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
    },
  });
  const html = marked.parse(expandCallouts(expandSims(md))) as string;
  return { html, toc };
}

const cache = new Map<string, Map<string, string>>();

function chaptersInFile(grade: number | string, subject: string) {
  const file = join(ROOT, `class-${String(grade).padStart(2, "0")}`, `${subject}.md`);
  if (cache.has(file)) return cache.get(file)!;
  const map = new Map<string, string>();
  if (existsSync(file)) {
    const src = readFileSync(file, "utf8");
    const parts = src.split(/^===\s*([a-z0-9-]+)\s*===\s*$/m);
    for (let i = 1; i < parts.length; i += 2) map.set(parts[i], parts[i + 1]);
  }
  cache.set(file, map);
  return map;
}

export function getLesson(grade: number | string, subject: string, chapter: string): LessonDoc | null {
  const raw = chaptersInFile(grade, subject).get(chapter);
  if (!raw) return null;
  const [body, quizSrc = ""] = raw.split(/^---\s*quiz\s*---\s*$/m);
  const { html, toc } = render(body.trim());
  const words = body.split(/\s+/).length;
  return { html, toc, quiz: parseQuiz(quizSrc), minutes: Math.max(5, Math.round(words / 160)) };
}

/** Plain text from a little Markdown: drops emphasis markers, links and HTML. */
const plain = (md: string) =>
  md
    .replace(/<[^>]+>/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]+/g, "")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .trim();

export interface Callout {
  type: string;
  title: string;
  body: string;
}

/** Every titled callout in a chapter, as plain text. Feeds flashcards, formula sheets and mind maps. */
export function getCallouts(grade: number | string, subject: string, chapter: string): Callout[] {
  const raw = chaptersInFile(grade, subject).get(chapter);
  if (!raw) return [];
  const [body] = raw.split(/^---\s*quiz\s*---\s*$/m);
  const out: Callout[] = [];
  const lines = body.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^>\s*\[!(\w+)\]\s*(.*)$/);
    if (!m) continue;
    const text: string[] = [];
    while (i + 1 < lines.length && /^>/.test(lines[i + 1])) text.push(lines[++i].replace(/^>\s?/, ""));
    const title = plain(m[2]);
    if (title) out.push({ type: m[1].toUpperCase(), title, body: plain(text.join("\n")) });
  }
  return out;
}

/** Flashcards for a chapter: key ideas, formulas and "remember" boxes become front/back cards. */
export function getCards(grade: number | string, subject: string, chapter: string) {
  return getCallouts(grade, subject, chapter)
    .filter((c) => ["KEY", "FORMULA", "REMEMBER"].includes(c.type) && c.body.length > 0 && c.body.length < 600)
    .map((c) => ({ front: c.title, back: c.body, type: c.type }));
}

/** Raw lesson headings (## level) for mind maps, without rendering. */
export function getHeadings(grade: number | string, subject: string, chapter: string) {
  const raw = chaptersInFile(grade, subject).get(chapter);
  if (!raw) return [];
  const [body] = raw.split(/^---\s*quiz\s*---\s*$/m);
  return [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => plain(m[1]));
}

export interface OutlineSection {
  id: string;
  title: string;
  callouts: { type: string; title: string }[];
}

/** Lesson sections (## headings, with their anchor ids) and the titled callouts inside each. Feeds the mind map. */
export function getOutline(grade: number | string, subject: string, chapter: string): OutlineSection[] {
  const raw = chaptersInFile(grade, subject).get(chapter);
  if (!raw) return [];
  const [body] = raw.split(/^---\s*quiz\s*---\s*$/m);
  const marked = new Marked({ gfm: true });
  const out: OutlineSection[] = [];
  for (const line of body.split("\n")) {
    const h = line.match(/^##\s+(.+)$/);
    if (h) {
      // Same id the lesson renderer gives the heading (slug of the rendered inline HTML).
      const htmlText = marked.parseInline(h[1].trim()) as string;
      out.push({ id: slugify(htmlText), title: plain(h[1]), callouts: [] });
      continue;
    }
    const c = line.match(/^>\s*\[!(\w+)\]\s*(.*)$/);
    if (c && out.length) {
      const title = plain(c[2]);
      if (title) out[out.length - 1].callouts.push({ type: c[1].toUpperCase(), title });
    }
  }
  return out;
}

export const hasLesson = (grade: number | string, subject: string, chapter: string) => chaptersInFile(grade, subject).has(chapter);


export { parseQuiz };
