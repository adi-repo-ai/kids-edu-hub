import type { MockExam, Quiz } from "@/lib/types";

export const quizzes: Quiz[] = [
  {
    id: "squares-quick-check",
    title: "Squares & Cubes: Quick Check",
    subject: "maths",
    chapterId: "square-and-cube",
    minutes: 8,
    questions: [
      {
        id: "q1",
        type: "mcq",
        prompt: "Which of these numbers is a perfect square?",
        options: ["1250", "1296", "1690", "2023"],
        answer: "1296",
        explanation: "1296 = 36 × 36. A quick filter: 1250 and 1690 end in a single zero (perfect squares end in an even number of zeros), and 2023 ends in 3, which no square does.",
        hint: "Squares never end in 2, 3, 7 or 8.",
      },
      {
        id: "q2",
        type: "mcq",
        prompt: "How many perfect squares lie between 50 and 100?",
        options: ["1", "2", "3", "4"],
        answer: "2",
        explanation: "7² = 49 is just below 50 and 10² = 100 is not between. That leaves 8² = 64 and 9² = 81.",
      },
      {
        id: "q3",
        type: "numeric",
        prompt: "What is 12³?",
        answer: "1728",
        explanation: "12 × 12 = 144, and 144 × 12 = 1728. Add 1 and you get 1729, Ramanujan's taxicab number: 12³ + 1³ = 10³ + 9³.",
        hint: "Find 12 × 12 first, then multiply by 12 again.",
      },
      {
        id: "q4",
        type: "truefalse",
        prompt: "A perfect square can end in the digit 7.",
        options: ["True", "False"],
        answer: "False",
        explanation: "The last digit of a square depends only on the last digit of the number. Squaring 0–9 gives last digits 0, 1, 4, 5, 6 and 9, never 7.",
      },
      {
        id: "q5",
        type: "mcq",
        prompt: "1 + 3 + 5 + … + 19 = ?",
        options: ["81", "90", "100", "121"],
        answer: "100",
        explanation: "The sum of the first n odd numbers is n². From 1 to 19 there are 10 odd numbers, so the sum is 10² = 100.",
        hint: "Count how many odd numbers there are.",
      },
      {
        id: "q6",
        type: "numeric",
        prompt: "What is the smallest whole number you must multiply 72 by to get a perfect square?",
        answer: "2",
        explanation: "72 = 2 × 2 × 2 × 3 × 3. The 3s are already paired, but one 2 is left over. Multiplying by 2 gives 144 = 12².",
        hint: "Write 72 as a product of primes and look for unpaired factors.",
      },
    ],
  },
  {
    id: "matter-quick-check",
    title: "Particulate Nature of Matter",
    subject: "science",
    chapterId: "particulate-matter",
    minutes: 6,
    questions: [
      {
        id: "m1",
        type: "mcq",
        prompt: "In which state are the forces of attraction between particles the strongest?",
        options: ["Solid", "Liquid", "Gas", "Equal in all three"],
        answer: "Solid",
        explanation: "Particles in a solid are packed closely and held by strong attraction, which is why solids keep a fixed shape.",
      },
      {
        id: "m2",
        type: "mcq",
        prompt: "A crystal of potassium permanganate is dropped into still water. The purple colour slowly spreads. This is called…",
        options: ["Evaporation", "Diffusion", "Condensation", "Sublimation"],
        answer: "Diffusion",
        explanation: "Particles of the crystal move into the spaces between water particles and spread out on their own. That is diffusion.",
      },
      {
        id: "m3",
        type: "truefalse",
        prompt: "Gases can be compressed easily because there is a lot of space between their particles.",
        options: ["True", "False"],
        answer: "True",
        explanation: "Gas particles are far apart compared with their size, so pressing them together is easy. This is why LPG can be stored in cylinders.",
      },
      {
        id: "m4",
        type: "mcq",
        prompt: "While ice is melting, its temperature stays at 0 °C even though heat is being supplied. Where does the heat go?",
        options: ["It is lost to the air", "It overcomes the attraction between particles", "It makes the particles bigger", "It turns into light"],
        answer: "It overcomes the attraction between particles",
        explanation: "The supplied heat is used to loosen the hold particles have on each other, changing the state without raising the temperature.",
      },
    ],
  },
];

export const quizById = (id: string) => quizzes.find((q) => q.id === id);

export const mockExams: MockExam[] = [
  { id: "mock-maths-hy", title: "Half-yearly Mock: Mathematics", subject: "maths", marks: 80, minutes: 180, sections: "Sections A–E · 38 questions", attempted: { score: 61, date: "4 Oct" } },
  { id: "mock-science-hy", title: "Half-yearly Mock: Science", subject: "science", marks: 80, minutes: 180, sections: "Sections A–E · 39 questions" },
  { id: "mock-sst-hy", title: "Half-yearly Mock: Social Science", subject: "social", marks: 80, minutes: 180, sections: "Sections A–F · 37 questions", attempted: { score: 58, date: "28 Sep" } },
  { id: "mock-english-hy", title: "Half-yearly Mock: English", subject: "english", marks: 80, minutes: 180, sections: "Reading · Writing · Literature" },
];
