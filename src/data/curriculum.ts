import type { Chapter, Grade, Subject, SubjectId } from "@/lib/types";

export const subjects: Subject[] = [
  { id: "maths", name: "Mathematics", book: "Ganita Prakash", hue: "royal", blurb: "Patterns, numbers and the shapes around you." },
  { id: "science", name: "Science", book: "Curiosity", hue: "mint", blurb: "Ask, observe, test and explain the world." },
  { id: "social", name: "Social Science", book: "Exploring Society: India and Beyond", hue: "coral", blurb: "Our land, our past and how we govern ourselves." },
  { id: "english", name: "English", book: "Poorvi", hue: "lavender", blurb: "Read closely, write clearly, speak with confidence." },
  { id: "hindi", name: "Hindi", book: "Malhar", hue: "sun", blurb: "कविता, कहानी और व्याकरण — अपनी भाषा में।" },
];

export const subjectById = (id: string) => subjects.find((s) => s.id === id);

export const grades: Grade[] = [
  { id: 1, label: "Class 1", stage: "Foundational", focus: "Phonics, numbers to 100, shapes", subjects: ["English", "Hindi", "Mathematics"], available: true },
  { id: 2, label: "Class 2", stage: "Foundational", focus: "Reading aloud, addition stories", subjects: ["English", "Hindi", "Mathematics"], available: true },
  { id: 3, label: "Class 3", stage: "Preparatory", focus: "Place value, plants and animals", subjects: ["English", "Hindi", "Mathematics", "The World Around Us"], available: true },
  { id: 4, label: "Class 4", stage: "Preparatory", focus: "Fractions, maps, water", subjects: ["English", "Hindi", "Mathematics", "The World Around Us"], available: true },
  { id: 5, label: "Class 5", stage: "Preparatory", focus: "Decimals, our body, journeys", subjects: ["English", "Hindi", "Mathematics", "The World Around Us"], available: true },
  { id: 6, label: "Class 6", stage: "Middle", focus: "Integers, food, early India", subjects: ["English", "Hindi", "Mathematics", "Science", "Social Science", "Sanskrit"], available: true },
  { id: 7, label: "Class 7", stage: "Middle", focus: "Ratios, heat, medieval India", subjects: ["English", "Hindi", "Mathematics", "Science", "Social Science", "Sanskrit"], available: true },
  { id: 8, label: "Class 8", stage: "Middle", focus: "Squares & cubes, forces, colonial India", subjects: ["English", "Hindi", "Mathematics", "Science", "Social Science", "Sanskrit"], available: true },
  { id: 9, label: "Class 9", stage: "Secondary", focus: "Polynomials, atoms, democracy", subjects: ["English", "Hindi", "Mathematics", "Science", "Social Science", "Information Technology"], available: true },
  { id: 10, label: "Class 10", stage: "Secondary", focus: "Board prep, trigonometry, life processes", subjects: ["English", "Hindi", "Mathematics", "Science", "Social Science", "Information Technology"], available: true },
  { id: 11, label: "Class 11", stage: "Senior Secondary", focus: "Science, Commerce, Humanities", subjects: ["Physics", "Chemistry", "Mathematics", "Accountancy", "Economics", "History"], available: false },
  { id: 12, label: "Class 12", stage: "Senior Secondary", focus: "Boards, CUET and beyond", subjects: ["Physics", "Chemistry", "Mathematics", "Accountancy", "Economics", "History"], available: false },
];

const L = (id: string, title: string, kind: Chapter["lessons"][number]["kind"], minutes: number, done: boolean, slug?: string) => ({
  id,
  title,
  kind,
  minutes,
  done,
  slug,
});

export const chapters: Chapter[] = [
  // Mathematics — Ganita Prakash, Grade 8 (Part 1)
  {
    id: "square-and-cube",
    number: 1,
    title: "A Square and A Cube",
    subject: "maths",
    progress: 60,
    summary: "Perfect squares, their patterns, square roots, cubes and cube roots, starting from the locker puzzle.",
    quizId: "squares-quick-check",
    lessons: [
      L("sq-1", "The locker puzzle", "activity", 10, true),
      L("sq-2", "Patterns in square numbers", "video", 8, true),
      L("sq-3", "Perfect squares as areas", "interactive", 12, false, "perfect-squares-as-areas"),
      L("sq-4", "Finding square roots", "reading", 10, false),
      L("sq-5", "Cubes and the taxicab number", "video", 9, false),
    ],
  },
  {
    id: "power-play",
    number: 2,
    title: "Power Play",
    subject: "maths",
    progress: 100,
    summary: "Exponents, laws of powers and how quickly repeated doubling grows.",
    lessons: [
      L("pp-1", "Paper folding and doubling", "activity", 10, true),
      L("pp-2", "Laws of exponents", "reading", 12, true),
      L("pp-3", "Scientific notation", "video", 7, true),
    ],
  },
  {
    id: "story-of-numbers",
    number: 3,
    title: "A Story of Numbers",
    subject: "maths",
    progress: 100,
    summary: "How people counted across history and how our place value system came to be.",
    lessons: [L("sn-1", "Counting with tally marks", "reading", 8, true), L("sn-2", "Number systems of the world", "video", 10, true)],
  },
  {
    id: "quadrilaterals",
    number: 4,
    title: "Quadrilaterals",
    subject: "maths",
    progress: 85,
    summary: "Properties of parallelograms, rhombuses, rectangles and squares through construction.",
    lessons: [L("q-1", "Sorting four-sided shapes", "activity", 10, true), L("q-2", "Diagonals tell a story", "interactive", 12, true), L("q-3", "Angle sum property", "reading", 8, false)],
  },
  {
    id: "number-play",
    number: 5,
    title: "Number Play",
    subject: "maths",
    progress: 20,
    summary: "Divisibility puzzles, digit sums and why some tricks always work.",
    lessons: [L("np-1", "Is it divisible?", "activity", 9, true), L("np-2", "Digital roots", "reading", 10, false)],
  },
  {
    id: "we-distribute",
    number: 6,
    title: "We Distribute, Yet Things Multiply",
    subject: "maths",
    progress: 0,
    summary: "The distributive property, algebraic identities and mental multiplication.",
    lessons: [L("wd-1", "Area model of multiplication", "interactive", 12, false)],
  },
  {
    id: "proportional-reasoning",
    number: 7,
    title: "Proportional Reasoning – 1",
    subject: "maths",
    progress: 0,
    summary: "Ratios, rates and scaling recipes, maps and models.",
    lessons: [L("pr-1", "Mixing the perfect chai", "activity", 10, false)],
  },

  // Science — Curiosity, Grade 8
  {
    id: "invisible-living-world",
    number: 2,
    title: "The Invisible Living World",
    subject: "science",
    progress: 100,
    summary: "Microorganisms around us: where they live and how they help or harm.",
    lessons: [L("ilw-1", "Looking through a microscope", "video", 9, true), L("ilw-2", "Making curd at home", "activity", 15, true)],
  },
  {
    id: "health-treasure",
    number: 3,
    title: "Health: The Ultimate Treasure",
    subject: "science",
    progress: 70,
    summary: "Infections, immunity, vaccines and everyday habits that keep us well.",
    lessons: [L("ht-1", "How germs spread", "video", 8, true), L("ht-2", "Vaccines explained", "reading", 10, false)],
  },
  {
    id: "exploring-forces",
    number: 5,
    title: "Exploring Forces",
    subject: "science",
    progress: 45,
    summary: "Contact and non-contact forces, friction and gravity in daily life.",
    lessons: [L("ef-1", "Push, pull and friction", "activity", 12, true), L("ef-2", "Magnets at a distance", "video", 8, false)],
  },
  {
    id: "particulate-matter",
    number: 7,
    title: "Particulate Nature of Matter",
    subject: "science",
    progress: 30,
    summary: "Why solids hold shape, liquids flow and gases spread out.",
    quizId: "matter-quick-check",
    lessons: [L("pm-1", "Dissolving sugar in water", "activity", 10, true), L("pm-2", "Particles in motion", "interactive", 12, false), L("pm-3", "Diffusion", "reading", 8, false)],
  },
  {
    id: "light-mirrors-lenses",
    number: 10,
    title: "Light: Mirrors and Lenses",
    subject: "science",
    progress: 0,
    summary: "Reflection, images in plane and curved mirrors, and how lenses bend light.",
    lessons: [L("lm-1", "Spoon mirrors", "activity", 10, false)],
  },

  // Social Science — Exploring Society: India and Beyond, Grade 8 (Part 1)
  {
    id: "natural-resources",
    number: 1,
    title: "Natural Resources and Their Use",
    subject: "social",
    progress: 100,
    summary: "Renewable and non-renewable resources and using them wisely.",
    lessons: [L("nr-1", "Resource map of India", "interactive", 12, true)],
  },
  {
    id: "rise-of-marathas",
    number: 3,
    title: "The Rise of the Marathas",
    subject: "social",
    progress: 55,
    summary: "Shivaji, the Maratha navy and the expansion of Maratha power.",
    lessons: [L("rm-1", "Forts of the Sahyadris", "video", 9, true), L("rm-2", "Administration and the Ashtapradhan", "reading", 10, false)],
  },
  {
    id: "colonial-era",
    number: 4,
    title: "The Colonial Era in India",
    subject: "social",
    progress: 10,
    summary: "How trading companies became rulers, and what it meant for India.",
    lessons: [L("ce-1", "From traders to rulers", "reading", 12, false)],
  },
  {
    id: "universal-franchise",
    number: 5,
    title: "Universal Franchise and India's Electoral System",
    subject: "social",
    progress: 0,
    summary: "Every adult, one vote: how elections in India are organised.",
    lessons: [L("uf-1", "Run a class election", "activity", 15, false)],
  },

  // English
  {
    id: "en-unit-1",
    number: 1,
    title: "Unit 1: Wisdom Paves the Way",
    subject: "english",
    progress: 80,
    summary: "Stories of quick thinking and fair judgement, with vocabulary and writing tasks.",
    lessons: [L("en1-1", "Reading for inference", "reading", 12, true), L("en1-2", "Writing a diary entry", "activity", 15, false)],
  },
  {
    id: "en-unit-2",
    number: 2,
    title: "Unit 2: Values and Dispositions",
    subject: "english",
    progress: 25,
    summary: "Poems and prose about character, with grammar practice on reported speech.",
    lessons: [L("en2-1", "Reported speech", "interactive", 10, false)],
  },

  // Hindi
  {
    id: "hi-path-1",
    number: 1,
    title: "पाठ 1: कविता — पाठ और भाव",
    subject: "hindi",
    progress: 90,
    summary: "कविता का सस्वर पाठ, भावार्थ और नए शब्द।",
    lessons: [L("hi1-1", "सस्वर पाठ", "video", 8, true), L("hi1-2", "भावार्थ लिखना", "activity", 12, false)],
  },
  {
    id: "hi-vyakaran",
    number: 2,
    title: "व्याकरण: संधि और समास",
    subject: "hindi",
    progress: 35,
    summary: "संधि के प्रकार और समास-विग्रह का अभ्यास।",
    lessons: [L("hiv-1", "स्वर संधि", "reading", 10, true), L("hiv-2", "समास पहचानो", "interactive", 10, false)],
  },
];

export const chaptersFor = (subject: SubjectId) => chapters.filter((c) => c.subject === subject).sort((a, b) => a.number - b.number);
export const chapterById = (id: string) => chapters.find((c) => c.id === id);

export function subjectProgress(subject: SubjectId) {
  const list = chaptersFor(subject);
  if (!list.length) return 0;
  return Math.round(list.reduce((n, c) => n + c.progress, 0) / list.length);
}
