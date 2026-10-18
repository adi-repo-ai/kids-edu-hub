# 6. AGENTS — rules for AI agents and contributors

Read this before changing the repo (Claude Code, Copilot, Cursor or a human).

## Project in one paragraph
Static Next.js 16 app (App Router, React 19, TS, Tailwind v4). Curriculum in TypeScript, lessons and mocks in
Markdown, progress in localStorage. No backend. Deployed as a static export.

## Golden rules
1. **No dead UI.** Every link must resolve to a generated page; every button must change state, navigate,
   download or open something. If a feature isn't built, don't render a control for it.
2. **Never change a chapter id** once published (it is the progress key). Fix titles, keep ids (pass the old id explicitly).
3. **Content accuracy first.** Lessons follow current NCERT books and CBSE pattern. If unsure of a fact or
   quotation, paraphrase or leave it out. Don't paste long copyrighted passages.
4. **Validate before committing:** `npm run check:content && npm run typecheck && npm run build`.
5. **Links to files in `public/`** must use `asset("/path")` so they work under a base path.
6. Server-only code (`fs`, Markdown parsing) stays in `src/lib/lessons.ts` / `mocks.ts`; client components never import them.
7. Keep the design system: use `Button`/`ButtonLink`, tokens from `globals.css`, `styleFor(subject)` for colours.
8. Accessibility: label icon buttons, keep focus visible, mark Hindi with `lang="hi"`.
9. Don't commit secrets; there should be none. Don't add tracking without updating the PRD and privacy notes.
10. Regenerate PDFs (`npm run pdfs`) after changing lessons or mocks, and commit `public/notes` / `public/papers`.

## Where things go
| Change | File(s) |
| --- | --- |
| New chapter/subject | `src/content/curriculum/class-XX.ts` |
| New lesson | `src/content/lessons/class-XX/<subject>.md` |
| New mock | `src/content/mocks/<file>.md` + entry in `src/content/mocks/index.ts` |
| New page | `src/app/(app)/<route>/page.tsx` + nav in `src/components/layout/nav.ts` |
| New progress field | `src/lib/store.ts` (bump/migrate version), docs/04-DATABASE.md |

## Lesson authoring format (summary)
See [Feature development](10-FEATURE-DEVELOPMENT.md#lesson-format).

## Commit style
Imperative subject (`Content: Class 10 SST lessons`, `Fix: PDF links under base path`), small focused commits.
