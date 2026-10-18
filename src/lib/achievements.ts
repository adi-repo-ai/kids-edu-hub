import { streakOf, type State } from "./store";

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  earned: boolean;
  progress: number; // 0–100
}

export function achievements(s: State): Achievement[] {
  const lessons = Object.keys(s.lessons).length;
  const quizzes = Object.values(s.quizzes);
  const perfect = quizzes.filter((q) => q.best === q.total && q.total > 0).length;
  const streak = streakOf(s.activity);
  const days = Object.keys(s.activity).length;
  const a = (id: string, name: string, desc: string, have: number, need: number): Achievement => ({ id, name, desc, earned: have >= need, progress: Math.min(100, Math.round((have / need) * 100)) });
  return [
    a("first-lesson", "First Step", "Complete your first lesson", lessons, 1),
    a("ten-lessons", "Bookworm", "Complete 10 lessons", lessons, 10),
    a("fifty-lessons", "Scholar", "Complete 50 lessons", lessons, 50),
    a("quiz-ace", "Quiz Ace", "Score 100% on a chapter quiz", perfect, 1),
    a("five-aces", "Sharp Shooter", "Score 100% on 5 quizzes", perfect, 5),
    a("streak-3", "On a Roll", "Study 3 days in a row", streak, 3),
    a("streak-7", "Week Warrior", "Study 7 days in a row", streak, 7),
    a("mock-1", "Exam Ready", "Finish a full mock test", s.mocks.length, 1),
    a("days-30", "Habit Builder", "Study on 30 different days", days, 30),
  ];
}
