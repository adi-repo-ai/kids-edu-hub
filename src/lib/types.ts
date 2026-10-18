export interface ChapterDef {
  id: string;
  title: string;
  /** Key ideas covered, shown on the chapter page even before a full lesson exists. */
  topics?: string[];
}

export interface UnitDef {
  /** Book or strand, e.g. "First Flight" or "History". */
  title: string;
  chapters: ChapterDef[];
}

export interface SubjectDef {
  id: string;
  name: string;
  books?: string[];
  units: UnitDef[];
}

export interface GradeDef {
  grade: number;
  stage: "Foundational" | "Preparatory" | "Middle" | "Secondary" | "Senior Secondary";
  /** "Topics" for classes whose NCERT chapter names we don't list verbatim. */
  structure: "chapters" | "topics";
  subjects: SubjectDef[];
}

export type QuizOption = { text: string; correct: boolean };

export type QuizQuestion =
  | { kind: "mcq"; prompt: string; options: QuizOption[]; explanation?: string; marks?: number }
  | { kind: "written"; prompt: string; answer: string; marks: number };

export interface LessonDoc {
  /** Rendered HTML of the concept lesson. */
  html: string;
  /** Section headings for the table of contents. */
  toc: { id: string; title: string }[];
  quiz: QuizQuestion[];
  minutes: number;
}
