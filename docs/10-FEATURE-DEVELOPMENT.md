# 10. Feature development

## Workflow
1. Branch from `main` (`feature/<name>`).
2. Build the change; keep UI on the design system.
3. `npm run check:content && npm run typecheck && npm run build`.
4. If content changed: `npm run pdfs` and commit the PDFs.
5. Open a PR; the Pages deploy runs when it merges to `main`.

## Add a chapter
In `src/content/curriculum/class-XX.ts` add `ch("Title", ["topic", …])` to the right unit. For non-Latin
titles pass an id: `ch("सूरदास के पद", [...], "surdas-ke-pad")`. The page, path node, search entry and
library row appear automatically.

## Lesson format
File: `src/content/lessons/class-XX/<subject-id>.md` (two-digit class).

```md
=== chapter-id ===
## The big idea
Plain-language explanation…

> [!KEY] Definition
> Callout body. Types: KEY, EXAMPLE, TIP, FORMULA, REMEMBER, MISTAKE.

## Quick recap
- point

--- quiz ---
Q: Multiple-choice question
- wrong
* correct (exactly one)
- wrong
- wrong
> Explanation shown after answering.

W[3]: Written question worth 3 marks
A: Model answer / marking points.
```
Rules (enforced by `check:content`): id must exist in the curriculum, ≥ 5 questions, exactly one correct
option, ≥ 3 options, no duplicate options. `## ` headings become the lesson's table of contents.

## Add a mock test
1. Write `src/content/mocks/<file>.md` with sections: `## Section A | 1 | instructions`, then `Q:`/`W[n]:` items.
2. Add `{ id, title, grade, subject, minutes, marks, file, pattern }` to `src/content/mocks/index.ts`.
3. `npm run pdfs` to create `public/papers/<id>.pdf`.

## Add a page
Create `src/app/(app)/<route>/page.tsx` (server) and put interactive parts in a client component under
`src/components/<area>/`. Add it to `mainNav` or `moreNav` in `src/components/layout/nav.ts` and to the
search index (`src/lib/search.ts`) if it should be searchable.

## Add progress data
Extend `State` and `emptyState` in `src/lib/store.ts`, add an action, and handle older saved documents in
`load()` (spread defaults already fill missing top-level keys). Update [DATABASE](04-DATABASE.md).

## Definition of done
Works at 360 px and desktop; keyboard usable; no console errors; no dead controls; validator, typecheck and build pass; docs updated.
