import "server-only";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { mocks, type MockDef } from "@/content/mocks";
import { parseQuiz } from "./lessons";
import type { QuizQuestion } from "./types";

export interface MockSection {
  title: string;
  marksEach: number;
  note: string;
  questions: QuizQuestion[];
}

/** "## Section A | 1 | Note" headings split a mock file into sections. */
export function loadMock(id: string): { def: MockDef; sections: MockSection[] } | null {
  const def = mocks.find((m) => m.id === id);
  if (!def) return null;
  const file = join(process.cwd(), "src/content/mocks", def.file);
  if (!existsSync(file)) return { def, sections: [] };
  const src = readFileSync(file, "utf8");
  const parts = src.split(/^##\s+/m).slice(1);
  const sections = parts.map((p) => {
    const nl = p.indexOf("\n");
    const [title, marks, note = ""] = p.slice(0, nl).split("|").map((x) => x.trim());
    const marksEach = Number(marks) || 1;
    const questions = parseQuiz(p.slice(nl + 1)).map((q) => (q.kind === "mcq" ? { ...q, marks: marksEach } : q));
    return { title, marksEach, note, questions };
  });
  return { def, sections };
}
