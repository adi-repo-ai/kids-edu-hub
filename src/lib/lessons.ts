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

const slugify = (s: string) =>
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
  const html = marked.parse(expandCallouts(md)) as string;
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

export const hasLesson = (grade: number | string, subject: string, chapter: string) => chaptersInFile(grade, subject).has(chapter);


export { parseQuiz };
