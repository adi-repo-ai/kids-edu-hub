export type Hue = "royal" | "coral" | "sun" | "mint" | "lavender";

export type SubjectId = "maths" | "science" | "social" | "english" | "hindi";

export interface Subject {
  id: SubjectId;
  name: string;
  book: string;
  hue: Hue;
  blurb: string;
}

export type LessonKind = "interactive" | "video" | "reading" | "activity";

export interface Lesson {
  id: string;
  title: string;
  kind: LessonKind;
  minutes: number;
  done: boolean;
  /** Only lessons with a slug have a fully built interactive page in this preview. */
  slug?: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subject: SubjectId;
  progress: number; // 0–100
  summary: string;
  lessons: Lesson[];
  quizId?: string;
}

export interface Grade {
  id: number;
  label: string;
  stage: "Foundational" | "Preparatory" | "Middle" | "Secondary" | "Senior Secondary";
  focus: string;
  subjects: string[];
  available: boolean;
}

export type QuestionType = "mcq" | "truefalse" | "numeric";

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  answer: string;
  explanation: string;
  hint?: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: SubjectId;
  chapterId: string;
  minutes: number;
  questions: Question[];
}

export interface MockExam {
  id: string;
  title: string;
  subject: SubjectId;
  marks: number;
  minutes: number;
  sections: string;
  attempted?: { score: number; date: string };
}

export interface Paper {
  id: string;
  year: number;
  grade: 10 | 12;
  subject: string;
  code: string;
  set: string;
  kind: "Board" | "Compartment" | "Sample paper";
  marks: number;
  hasSolutions: boolean;
  hasMarkingScheme: boolean;
}

export type ResourceKind = "Notes" | "Worksheet" | "Mind map" | "Formula sheet";

export interface Resource {
  id: string;
  title: string;
  kind: ResourceKind;
  subject: SubjectId;
  chapterId?: string;
  pages: number;
  sizeKb: number;
  updated: string;
}

export interface NewsItem {
  id: string;
  date: string;
  category: "Circular" | "Exams" | "Results" | "Curriculum" | "School";
  title: string;
  summary: string;
  pinned?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  hue: Hue;
  earned?: string;
  progress?: number; // for locked badges, 0–100
}

export type BookmarkKind = "chapter" | "lesson" | "resource" | "paper";

export interface Bookmark {
  id: string;
  kind: BookmarkKind;
  title: string;
  meta: string;
  href: string;
}
