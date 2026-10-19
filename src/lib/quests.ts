import { chaptersOf, getGrade, getSubject } from "./curriculum";
import type { State } from "./store";

/**
 * Quests: goals computed only from progress the app really records. Quest ids are stored in
 * `state.quests` when a reward is claimed, so never rename one.
 *
 * Subject quests are generated per class: `subject:<grade>:<subject>` = finish every chapter.
 */
type Text = { en: string; hi: string };

export interface Quest {
  id: string;
  title: Text;
  desc: Text;
  xp: number;
  have: number;
  need: number;
  /** Where to make progress on it. */
  href: string;
  kind: "general" | "subject";
  subject?: string;
}

const dayMs = 86400000;

/** Longest run of consecutive active days ever (so the quest can't "un-complete"). */
export function longestStreak(activity: State["activity"]) {
  const days = Object.keys(activity)
    .filter((d) => activity[d] > 0)
    .map((d) => Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10)))
    .sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  days.forEach((d, i) => {
    run = i > 0 && d - days[i - 1] === dayMs ? run + 1 : 1;
    best = Math.max(best, run);
  });
  return best;
}

const SUBJECT_HI: Record<string, string> = {
  maths: "गणित",
  science: "विज्ञान",
  "social-science": "सामाजिक विज्ञान",
  english: "अंग्रेज़ी",
  hindi: "हिंदी",
  "information-technology": "सूचना प्रौद्योगिकी",
  evs: "पर्यावरण अध्ययन",
  physics: "भौतिकी",
  chemistry: "रसायन विज्ञान",
  biology: "जीव विज्ञान",
  accountancy: "लेखाशास्त्र",
  economics: "अर्थशास्त्र",
  "business-studies": "व्यवसाय अध्ययन",
  history: "इतिहास",
  "political-science": "राजनीति विज्ञान",
  geography: "भूगोल",
  "computer-science": "कंप्यूटर विज्ञान",
};

export const subjectNameHi = (id: string, en: string) => SUBJECT_HI[id] ?? en;

function general(s: State): Quest[] {
  const lessons = Object.keys(s.lessons).length;
  const quizzes = Object.values(s.quizzes).filter((q) => q.total > 0);
  const q80 = quizzes.filter((q) => q.best / q.total >= 0.8).length;
  const perfect = quizzes.filter((q) => q.best === q.total).length;
  const g = (id: string, xp: number, have: number, need: number, href: string, title: Text, desc: Text): Quest => ({ id, xp, have, need, href, title, desc, kind: "general" });
  return [
    g("first-steps", 30, lessons, 3, "/learn", { en: "First steps", hi: "पहले क़दम" }, { en: "Complete 3 lessons", hi: "3 पाठ पूरे करो" }),
    g("bookworm", 80, lessons, 15, "/learn", { en: "Bookworm", hi: "किताबी कीड़ा" }, { en: "Complete 15 lessons", hi: "15 पाठ पूरे करो" }),
    g("quiz-star", 60, q80, 5, "/practice", { en: "Quiz star", hi: "क्विज़ स्टार" }, { en: "Score 80% or more on 5 chapter quizzes", hi: "5 अध्याय क्विज़ में 80% या ज़्यादा लाओ" }),
    g("perfect-three", 60, perfect, 3, "/practice", { en: "Full marks", hi: "पूरे अंक" }, { en: "Score 100% on 3 chapter quizzes", hi: "3 अध्याय क्विज़ में 100% लाओ" }),
    g("daily-devotee", 70, Object.keys(s.daily).length, 7, "/daily", { en: "Daily devotee", hi: "रोज़ का साथी" }, { en: "Finish 7 daily challenges", hi: "7 दैनिक चुनौतियाँ पूरी करो" }),
    g("battle-ready", 50, s.battles.won, 3, "/battle", { en: "Battle ready", hi: "मुक़ाबले को तैयार" }, { en: "Win 3 quiz battles", hi: "3 क्विज़ मुक़ाबले जीतो" }),
    g("flash-master", 60, Object.keys(s.cards).length, 50, "/flashcards", { en: "Flash master", hi: "फ़्लैशकार्ड उस्ताद" }, { en: "Study 50 different flashcards", hi: "50 अलग-अलग फ़्लैशकार्ड पढ़ो" }),
    g("mock-marathon", 80, s.mocks.length, 2, "/mock", { en: "Mock marathon", hi: "मॉक मैराथन" }, { en: "Finish 2 full mock tests", hi: "2 पूरे मॉक टेस्ट दो" }),
    g("week-warrior", 70, longestStreak(s.activity), 7, "/dashboard", { en: "Week warrior", hi: "हफ़्ते का योद्धा" }, { en: "Study 7 days in a row", hi: "लगातार 7 दिन पढ़ाई करो" }),
    g("smart-reviser", 50, Object.keys(s.revision).length, 5, "/revise", { en: "Smart reviser", hi: "समझदार दोहराने वाला" }, { en: "Revise 5 chapters", hi: "5 अध्याय दोहराओ" }),
    g("test-maker", 40, s.tests.length, 3, "/practice/builder", { en: "Test maker", hi: "टेस्ट मेकर" }, { en: "Finish 3 custom tests you built", hi: "अपने बनाए 3 टेस्ट पूरे करो" }),
    g("planner-pro", 40, s.tasks.filter((t) => t.done).length, 10, "/planner", { en: "Planner pro", hi: "योजना में माहिर" }, { en: "Tick off 10 planner tasks", hi: "प्लानर के 10 काम पूरे करो" }),
  ];
}

function subjectQuest(s: State, grade: number, subjectId: string): Quest | undefined {
  const subject = getSubject(grade, subjectId);
  if (!subject) return undefined;
  const chapters = chaptersOf(subject);
  if (!chapters.length) return undefined;
  const have = chapters.filter((c) => s.lessons[`${grade}/${subject.id}/${c.id}`]).length;
  const hi = subjectNameHi(subject.id, subject.name);
  return {
    id: `subject:${grade}:${subject.id}`,
    kind: "subject",
    subject: subject.id,
    xp: Math.min(200, chapters.length * 10),
    have,
    need: chapters.length,
    href: `/class/${grade}/${subject.id}`,
    title: { en: `${subject.name} champion`, hi: `${hi} चैंपियन` },
    desc: { en: `Finish all ${chapters.length} chapters of Class ${grade} ${subject.name}`, hi: `कक्षा ${grade} ${hi} के सभी ${chapters.length} अध्याय पूरे करो` },
  };
}

/** All quests for this learner: the general ones plus one per subject of their class. */
export function questsOf(s: State) {
  const grade = s.profile.grade ? getGrade(s.profile.grade) : undefined;
  const subjects = grade ? grade.subjects.map((x) => subjectQuest(s, grade.grade, x.id)).filter((q): q is Quest => !!q) : [];
  return { general: general(s), subjects };
}

/** Find any quest by id, including subject quests from another class (for certificates). */
export function findQuest(s: State, id: string): Quest | undefined {
  if (id.startsWith("subject:")) {
    const [, g, sub] = id.split(":");
    return Number(g) ? subjectQuest(s, Number(g), sub) : undefined;
  }
  return general(s).find((q) => q.id === id);
}

export const isDone = (q: Quest) => q.have >= q.need;
