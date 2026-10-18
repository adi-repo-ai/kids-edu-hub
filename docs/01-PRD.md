# 1. Product Requirements (PRD)

## Problem
CBSE students jump between textbook PDFs, YouTube, coaching apps, guide books and the CBSE website to
understand a chapter, practise it and find papers. Content is scattered, often paywalled, and progress is
not tracked anywhere. Parents can't see what their child has covered.

## Vision
**One free, centralised portal** where a student from Class 1 to 12 can understand every topic of the CBSE
syllabus, check their understanding, practise board-style papers and see their progress — feeling like a
game (Duolingo), explaining like a teacher (Khan Academy / Byju's), and organised like a syllabus.

## Users
| Persona | Needs |
| --- | --- |
| **Student, Class 9–10 (primary, phase 1)** | Board exam prep: clear concepts, PYQ-style questions, full mock papers, revision notes |
| Student, Class 1–8 | Topic-by-topic learning, short quizzes, motivation (streaks, stars) |
| Student, Class 11–12 | Stream subjects (PCM/PCB/Commerce/Humanities), board + entrance foundations |
| Parent | See progress, streak, weak subjects, time spent; no account friction |
| Teacher (later) | Assign chapters, see class progress |

## Goals
1. Every chapter of every CBSE subject for Classes 1–12 is listed and navigable.
2. Every chapter has a concept lesson that is enough to understand it without another site (phased).
3. Every lesson ends with a quiz with explanations; progress and stars save automatically.
4. Full timed mock tests in the board pattern with answers and self-marking.
5. Notes and papers download as real PDF files.
6. No dead links or buttons. Every control does something.

## Non-goals (for now)
Live classes, video hosting, paid plans, chat with tutors, user-generated content.

## Scope and phases
| Phase | Scope | Status |
| --- | --- | --- |
| 1 | App shell, design system, curriculum for Classes 1–12, learning path, progress store | Done |
| 2 | Concept lessons + quizzes for **all Class 9–10 subjects** (Maths, Science, SST, English, Hindi, IT) | Done |
| 3 | Mock tests (Class 9–10 Maths, Science, SST), notes/paper PDFs, past-paper hub | Done |
| 4 | Lessons for Class 11–12 board subjects | Planned |
| 5 | Lessons for Classes 6–8, then 1–5 | Planned |
| 6 | Optional accounts + cloud sync, teacher view, more languages | Planned |

## Functional requirements
- **Learn**: class → subject → learning path (units, chapter nodes, stars) → chapter page (lesson, TOC,
  callouts, quiz, mark complete, save, notes PDF, printable view, previous/next).
- **Practice hub**: continue where you left off, weak chapters, quick quizzes.
- **Mock tests**: intro, timer, question palette, mark-for-review, submit confirm, auto-marked MCQs,
  model answers and self-marking for written questions, history of attempts.
- **Past papers**: links to official CBSE question-paper and sample-paper pages, plus our own practice papers as PDFs.
- **Library**: searchable list of every downloadable note and paper.
- **Progress**: XP, levels, streak, heatmap, per-subject completion, quiz bests, mock history, badges, reset.
- **Planner**: weekly plan, add/complete/delete tasks, suggestions.
- **Parent view**: read-only summary on the same device.
- **Search**: classes, subjects and chapters from anywhere (top bar).
- **Onboarding**: name + class, editable later via the class switcher.

## Non-functional requirements
- Works offline after first load of a page; no sign-up.
- Mobile-first (360 px), no horizontal scroll; usable with keyboard and screen readers; respects reduced motion.
- Static hosting (GitHub Pages / Vercel); page loads < 2 s on 4G.
- Hindi content renders correctly (Noto Sans Devanagari) on screen and in PDFs.

## Success metrics
Weekly active learners; lessons completed per learner per week; quiz attempts and score improvement;
mock tests finished; 7-day streak retention; zero broken links in CI crawl.
