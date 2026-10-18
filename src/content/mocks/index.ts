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

const science = "Five sections A–E. Section A: 20 one-mark questions (16 MCQs and 4 assertion–reason). Section B: six 2-mark very short answer questions. Section C: seven 3-mark short answer questions. Section D: three 5-mark long answer questions. Section E: three case-based questions of 4 marks.";

const socialScience10 = "Five sections A–E. Section A: 20 one-mark MCQs. Section B: four 2-mark very short answer questions. Section C: five 3-mark short answer questions. Section D: five 5-mark long answer questions (including a name-and-locate map question). Section E: three case-based questions of 4 marks.";

export const mocks: MockDef[] = [
  { id: "class-10-maths-mock-1", title: "Mathematics (Standard) Mock Test 1", grade: 10, subject: "maths", minutes: 180, marks: 80, file: "class-10-maths.md", pattern: board10 },
  { id: "class-10-science-mock-1", title: "Science Mock Test 1", grade: 10, subject: "science", minutes: 180, marks: 80, file: "class-10-science.md", pattern: science },
  { id: "class-10-social-science-mock-1", title: "Social Science Mock Test 1", grade: 10, subject: "social-science", minutes: 180, marks: 80, file: "class-10-social-science.md", pattern: socialScience10 },
  { id: "class-09-maths-mock-1", title: "Mathematics Mock Test 1", grade: 9, subject: "maths", minutes: 180, marks: 80, file: "class-09-maths.md", pattern: board10 },
  { id: "class-09-science-mock-1", title: "Science Mock Test 1", grade: 9, subject: "science", minutes: 180, marks: 80, file: "class-09-science.md", pattern: science },
];
