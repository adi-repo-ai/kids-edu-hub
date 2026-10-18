# 14. Testing & QA

## Automated checks
| Command | What it proves |
| --- | --- |
| `npm run check:content` | Every lesson id exists in the curriculum; each lesson has ≥ 5 questions; every MCQ (lessons and mocks) has exactly one correct option, ≥ 3 options and no duplicates; written questions have answers |
| `npm run typecheck` | TypeScript is sound across pages, components and content definitions |
| `npm run build` | Every static page renders (≈1,000 routes); metadata and params resolve |
| `npm run check:links` | Builds the static export and verifies every internal `href`/`src` in every HTML file resolves to a generated page or file (catches dead links and missing PDFs) |
| `npm run check:ui` | Playwright opens key pages at 390 px and 1280 px, fails on console errors or horizontal overflow, clicks every visible button and fails if a click changes nothing (no DOM change, navigation, dialog or download) |

Run all before merging:
```bash
npm run check:content && npm run typecheck && npm run check:links && npm run check:ui
```

## Manual QA checklist
**Onboarding & shell** — first visit asks name and class; class switcher changes the dashboard; search finds a chapter by partial name; mobile "More" sheet opens and closes.

**Learning** — learning path shows units and nodes; finishing a lesson turns its node green; quiz shows
feedback per question and a score screen; stars appear on the path after a quiz; previous/next work;
bookmarks appear on Saved.

**Practice** — start a mock, answer, mark for review, jump via palette, submit with confirm; MCQs auto-marked;
self-mark written answers; attempt appears on Progress and Mock pages.

**Downloads** — "Notes PDF" downloads a file on chapter pages, library and print view; mock paper PDFs
download from Mock tests, Past papers and Library; also verify on the deployed sub-path.

**Progress** — XP and streak increase; heatmap shows today; badges unlock; Planner tasks add, complete
(+10 XP) and delete; Reset clears progress after confirmation; Parent view mirrors data.

**Hindi** — Devanagari renders in lessons and PDFs; no boxes/tofu.

**Accessibility** — tab through a lesson and a mock; screen reader announces quiz results; reduced motion disables animations.

## Content QA
Each new lesson is reviewed against the NCERT chapter for accuracy, completeness of syllabus points, and
answer correctness of every quiz question. Report errors via GitHub issues with the chapter URL.
