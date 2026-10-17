import type { Badge, SubjectId } from "@/lib/types";

export const student = {
  firstName: "Ananya",
  fullName: "Ananya Iyer",
  initials: "AI",
  grade: 8,
  section: "B",
  school: "Sunrise Public School, Pune",
  streak: 12,
  xp: 2340,
  weeklyGoalMinutes: 300,
  weeklyMinutes: 214,
  exam: { name: "Half-yearly exams", startsOn: "27 Oct", daysLeft: 10 },
};

export const continueLearning = {
  subject: "maths" as SubjectId,
  chapterId: "square-and-cube",
  lessonTitle: "Perfect squares as areas",
  lessonSlug: "perfect-squares-as-areas",
  minutesLeft: 12,
};

/** The personalised revision path the student is on before half-yearlies. */
export const learningPath = [
  { id: "lp1", title: "Square numbers & patterns", state: "done" as const, href: "/learn/maths/square-and-cube" },
  { id: "lp2", title: "Perfect squares as areas", state: "current" as const, href: "/lesson/perfect-squares-as-areas" },
  { id: "lp3", title: "Square roots by factorisation", state: "next" as const, href: "/learn/maths/square-and-cube" },
  { id: "lp4", title: "Cubes & cube roots", state: "locked" as const, href: "/learn/maths/square-and-cube" },
  { id: "lp5", title: "Chapter check: 15 questions", state: "locked" as const, href: "/practice/squares-quick-check" },
];

export const badges: Badge[] = [
  { id: "b1", name: "Week Warrior", description: "Studied 7 days in a row", hue: "coral", earned: "11 Oct" },
  { id: "b2", name: "Square Shooter", description: "Scored 100% on a squares quiz", hue: "royal", earned: "8 Oct" },
  { id: "b3", name: "Curious Mind", description: "Asked 10 doubts in Science", hue: "mint", earned: "29 Sep" },
  { id: "b4", name: "Early Bird", description: "Five sessions before 8 am", hue: "sun", earned: "21 Sep" },
  { id: "b5", name: "Paper Pro", description: "Finish 3 full mock exams", hue: "lavender", progress: 67 },
  { id: "b6", name: "Century", description: "Complete 100 quizzes", hue: "royal", progress: 42 },
];

export const weekActivity = [
  { day: "Mon", minutes: 35 },
  { day: "Tue", minutes: 42 },
  { day: "Wed", minutes: 20 },
  { day: "Thu", minutes: 48 },
  { day: "Fri", minutes: 31 },
  { day: "Sat", minutes: 38 },
  { day: "Sun", minutes: 0 },
];

export type PlannerTask = {
  id: string;
  day: string;
  date: number;
  subject: SubjectId;
  title: string;
  minutes: number;
  done: boolean;
};

/** Week of 12–18 October 2026. "Today" in this preview is Saturday 17 Oct. */
export const plannerTasks: PlannerTask[] = [
  { id: "t1", day: "Mon", date: 12, subject: "maths", title: "Revise: square number patterns", minutes: 30, done: true },
  { id: "t2", day: "Mon", date: 12, subject: "english", title: "Unit 1 diary entry draft", minutes: 20, done: true },
  { id: "t3", day: "Tue", date: 13, subject: "science", title: "Notes: states of matter", minutes: 35, done: true },
  { id: "t4", day: "Wed", date: 14, subject: "social", title: "Marathas timeline flashcards", minutes: 25, done: true },
  { id: "t5", day: "Thu", date: 15, subject: "maths", title: "Quadrilaterals worksheet", minutes: 40, done: true },
  { id: "t6", day: "Fri", date: 16, subject: "hindi", title: "संधि अभ्यास: 20 प्रश्न", minutes: 20, done: false },
  { id: "t7", day: "Sat", date: 17, subject: "maths", title: "Lesson: perfect squares as areas", minutes: 12, done: false },
  { id: "t8", day: "Sat", date: 17, subject: "science", title: "Quiz: particulate nature of matter", minutes: 6, done: false },
  { id: "t9", day: "Sat", date: 17, subject: "english", title: "Reported speech worksheet", minutes: 20, done: false },
  { id: "t10", day: "Sun", date: 18, subject: "maths", title: "Half-yearly mock: Mathematics", minutes: 90, done: false },
  { id: "t11", day: "Sun", date: 18, subject: "social", title: "Map practice: resources", minutes: 20, done: false },
];

export const examTimetable = [
  { date: "27 Oct", day: "Tue", subject: "maths" as SubjectId, name: "Mathematics" },
  { date: "29 Oct", day: "Thu", subject: "science" as SubjectId, name: "Science" },
  { date: "31 Oct", day: "Sat", subject: "english" as SubjectId, name: "English" },
  { date: "3 Nov", day: "Tue", subject: "social" as SubjectId, name: "Social Science" },
  { date: "5 Nov", day: "Thu", subject: "hindi" as SubjectId, name: "Hindi" },
];

export const parent = {
  name: "Lakshmi Iyer",
  children: [
    { id: "ananya", name: "Ananya", grade: "Class 8-B", initials: "AI", hue: "royal" as const },
    { id: "kabir", name: "Kabir", grade: "Class 4-A", initials: "KI", hue: "coral" as const },
  ],
  mastery: [
    { subject: "maths" as SubjectId, score: 78, trend: +6 },
    { subject: "science" as SubjectId, score: 71, trend: +3 },
    { subject: "social" as SubjectId, score: 64, trend: -2 },
    { subject: "english" as SubjectId, score: 82, trend: +1 },
    { subject: "hindi" as SubjectId, score: 69, trend: +4 },
  ],
  recent: [
    { when: "Today, 7:40 am", text: "Scored 5/6 on Squares & Cubes: Quick Check", subject: "maths" as SubjectId },
    { when: "Yesterday", text: "Completed lesson ‘Dissolving sugar in water’", subject: "science" as SubjectId },
    { when: "Thu, 15 Oct", text: "Downloaded Rise of the Marathas notes", subject: "social" as SubjectId },
    { when: "Wed, 14 Oct", text: "Earned the Week Warrior badge", subject: "english" as SubjectId },
  ],
  teacherNote: {
    from: "Mrs. Deshpande, Class Teacher",
    date: "14 Oct",
    text: "Ananya is participating well in Maths and asks thoughtful questions. Please encourage daily map practice for Social Science before the half-yearly exams.",
  },
};
