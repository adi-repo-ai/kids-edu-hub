# 8. Project implementation

## History
| Version | What changed |
| --- | --- |
| v1 | Clickable design prototype for Classes 1–10 (static pages, sample data) |
| v2 | Bolder visual style and heavier animation |
| **v3** | Full rebuild: real curriculum for Classes 1–12, concept lessons, quizzes, mock tests, PDFs, persistent progress, no dead buttons |

## v3 work breakdown
1. **Foundation** — tokens and fonts (`globals.css`, `layout.tsx`), UI kit (`components/ui`), app shell with
   responsive navigation, onboarding, search, toasts, progress store.
2. **Curriculum** — Classes 1–5 topic-based; 6–8 on the new NCERT books (Ganita Prakash, Curiosity,
   Exploring Society); 9–10 all subjects; 11–12 science, commerce and humanities subjects.
3. **Learn** — class page, subject learning path (`LearningPath.tsx`), chapter page with lesson, TOC, quiz
   (`Quiz.tsx`), complete/save/notes actions (`ChapterActions.tsx`).
4. **Content (phase 1)** — concept lessons with quizzes for every Class 9 and 10 chapter in Maths, Science,
   Social Science, English, Hindi and Information Technology.
5. **Practice** — practice hub, mock tests (`MockRunner.tsx`: timer, palette, review marks, results, self-marking),
   papers hub with official CBSE links, library of downloads, print routes and generated PDFs.
6. **Progress** — dashboard, progress page (heatmap, subjects, quizzes, mocks, badges, reset), planner, parent view, saved.
7. **Quality** — content validator, type checks, link/button crawl, mobile overflow checks.

## Key files
```
src/app/(site)/page.tsx                  landing page (stats computed from real content)
src/app/(app)/class/[grade]/[subject]/[chapter]/page.tsx   lesson page
src/components/learn/LearningPath.tsx    game-like path
src/components/practice/MockRunner.tsx   mock exam engine
src/lib/store.ts                         progress store
src/lib/lessons.ts                       Markdown → lesson HTML + quiz
src/content/**                           curriculum, lessons, mocks
scripts/check-content.mjs                validator
scripts/generate-pdfs.mjs                PDF generator
```

## Decisions
- **Static over server**: free hosting, instant pages, works offline; accounts can be layered on later.
- **Markdown content**: teachers and agents can write lessons without touching React.
- **localStorage store**: zero friction for kids (no sign-up, no personal data collected).
- **Own PDFs** instead of mirroring CBSE files: CBSE servers block hot-linking/automation, and our PDFs are
  guaranteed to download. Official papers are linked to CBSE's own pages.
