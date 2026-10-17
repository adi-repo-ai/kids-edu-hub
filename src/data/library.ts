import type { NewsItem, Paper, Resource } from "@/lib/types";

const paperSubjects10 = [
  { subject: "Mathematics (Standard)", code: "041" },
  { subject: "Mathematics (Basic)", code: "241" },
  { subject: "Science", code: "086" },
  { subject: "Social Science", code: "087" },
  { subject: "English Language & Literature", code: "184" },
  { subject: "Hindi Course A", code: "002" },
];
const paperSubjects12 = [
  { subject: "Physics", code: "042" },
  { subject: "Chemistry", code: "043" },
  { subject: "Mathematics", code: "041" },
  { subject: "Accountancy", code: "055" },
];

export const papers: Paper[] = [
  ...[2025, 2024, 2023].flatMap((year) =>
    paperSubjects10.map((s, i) => ({
      id: `p10-${year}-${s.code}`,
      year,
      grade: 10 as const,
      subject: s.subject,
      code: s.code,
      set: `30/${(i % 5) + 1}/1`,
      kind: "Board" as const,
      marks: 80,
      hasSolutions: year !== 2025 || i < 3,
      hasMarkingScheme: true,
    })),
  ),
  ...paperSubjects10.slice(0, 4).map((s) => ({
    id: `sqp10-2026-${s.code}`,
    year: 2026,
    grade: 10 as const,
    subject: s.subject,
    code: s.code,
    set: "SQP",
    kind: "Sample paper" as const,
    marks: 80,
    hasSolutions: true,
    hasMarkingScheme: true,
  })),
  ...[2025, 2024].flatMap((year) =>
    paperSubjects12.map((s, i) => ({
      id: `p12-${year}-${s.code}`,
      year,
      grade: 12 as const,
      subject: s.subject,
      code: s.code,
      set: `55/${i + 1}/1`,
      kind: "Board" as const,
      marks: s.code === "055" ? 80 : 70,
      hasSolutions: year === 2024,
      hasMarkingScheme: true,
    })),
  ),
];

export const resources: Resource[] = [
  { id: "r-sq-notes", title: "Squares & cubes: one-page revision notes", kind: "Notes", subject: "maths", chapterId: "square-and-cube", pages: 4, sizeKb: 640, updated: "12 Oct" },
  { id: "r-sq-ws", title: "Worksheet: perfect squares by prime factorisation", kind: "Worksheet", subject: "maths", chapterId: "square-and-cube", pages: 3, sizeKb: 410, updated: "10 Oct" },
  { id: "r-exp-fs", title: "Laws of exponents formula sheet", kind: "Formula sheet", subject: "maths", chapterId: "power-play", pages: 1, sizeKb: 180, updated: "2 Oct" },
  { id: "r-quad-mm", title: "Family tree of quadrilaterals", kind: "Mind map", subject: "maths", chapterId: "quadrilaterals", pages: 1, sizeKb: 920, updated: "28 Sep" },
  { id: "r-matter-notes", title: "States of matter: notes with diagrams", kind: "Notes", subject: "science", chapterId: "particulate-matter", pages: 6, sizeKb: 1240, updated: "14 Oct" },
  { id: "r-forces-ws", title: "Worksheet: friction in everyday life", kind: "Worksheet", subject: "science", chapterId: "exploring-forces", pages: 2, sizeKb: 350, updated: "9 Oct" },
  { id: "r-micro-mm", title: "Microorganisms: friend or foe?", kind: "Mind map", subject: "science", chapterId: "invisible-living-world", pages: 1, sizeKb: 780, updated: "20 Sep" },
  { id: "r-maratha-notes", title: "Rise of the Marathas: timeline notes", kind: "Notes", subject: "social", chapterId: "rise-of-marathas", pages: 5, sizeKb: 890, updated: "11 Oct" },
  { id: "r-res-ws", title: "Map work: natural resources of India", kind: "Worksheet", subject: "social", chapterId: "natural-resources", pages: 2, sizeKb: 1520, updated: "18 Sep" },
  { id: "r-rs-ws", title: "Reported speech practice set", kind: "Worksheet", subject: "english", chapterId: "en-unit-2", pages: 3, sizeKb: 300, updated: "13 Oct" },
  { id: "r-diary-notes", title: "Formats: diary entry, notice and letter", kind: "Notes", subject: "english", pages: 4, sizeKb: 420, updated: "6 Oct" },
  { id: "r-sandhi-fs", title: "संधि के नियम: एक पृष्ठ में", kind: "Formula sheet", subject: "hindi", chapterId: "hi-vyakaran", pages: 1, sizeKb: 260, updated: "8 Oct" },
];

export const news: NewsItem[] = [
  {
    id: "n1",
    date: "2026-10-15",
    category: "Exams",
    title: "Half-yearly examinations begin 27 October",
    summary: "Your school has shared the half-yearly timetable for Classes 6–9. Mathematics is on 27 Oct and Science on 29 Oct. Full timetable is in the planner.",
    pinned: true,
  },
  {
    id: "n2",
    date: "2026-10-09",
    category: "Exams",
    title: "Board exams 2027: two-exam structure for Class 10 continues",
    summary: "Class 10 students take the main examination in February, with an optional second attempt in May to improve scores in up to three subjects.",
  },
  {
    id: "n3",
    date: "2026-10-03",
    category: "Curriculum",
    title: "Sample question papers released for 2026–27",
    summary: "New sample papers and marking schemes for Classes 10 and 12 are now available. We've added them to Previous Papers with step-by-step solutions.",
  },
  {
    id: "n4",
    date: "2026-09-26",
    category: "Circular",
    title: "Registration window for private candidates",
    summary: "Private candidates appearing in 2027 should complete registration within the notified window. Fees vary for candidates outside India.",
  },
  {
    id: "n5",
    date: "2026-09-18",
    category: "School",
    title: "Inter-school science exhibition: entries open",
    summary: "Theme this year is ‘Science for sustainable living’. Teams of up to three students from Classes 6–9 can submit a one-page proposal.",
  },
  {
    id: "n6",
    date: "2026-09-02",
    category: "Results",
    title: "Supplementary exam results declared",
    summary: "Results of the July supplementary examinations are available on the official results portal and DigiLocker.",
  },
];
