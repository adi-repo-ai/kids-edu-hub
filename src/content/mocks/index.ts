export interface MockDef {
  id: string;
  title: string;
  grade: number;
  subject: string;
  minutes: number;
  marks: number;
  /** Markdown file under src/content/mocks with "## Section …" headings. */
  file: string;
  pattern: string;
}

const board10 = "Five sections A–E. Section A: 20 one-mark questions (MCQs and assertion–reason). Section B: 2 marks each. Section C: 3 marks each. Section D: 5 marks each. Section E: three case-study questions of 4 marks.";

export const mocks: MockDef[] = [
  { id: "class-10-maths-mock-1", title: "Mathematics (Standard) Mock Test 1", grade: 10, subject: "maths", minutes: 180, marks: 80, file: "class-10-maths.md", pattern: board10 },
];
