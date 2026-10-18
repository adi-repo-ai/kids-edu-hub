# 3. Architecture

## Overview
```
 Markdown + TS content  ──►  Next.js 16 (App Router, static generation)  ──►  static HTML/JS + PDFs
 src/content/**                src/app/** + src/lib/**                          out/ → GitHub Pages / Vercel
                                                                                    │
                                              browser: React 19 client components ─┘
                                              progress in localStorage ("kaksha:v3")
```
There is **no server at runtime**. Every page is pre-rendered at build time (≈1,000 pages), and all
personal data stays in the learner's browser.

## Stack
Next.js 16.4 (Turbopack), React 19, TypeScript 5.9, Tailwind CSS v4, `marked` 15 for lesson Markdown,
`lucide-react` icons, Fontsource fonts, Playwright (dev-only) for PDF generation.

## Route groups
| Group | Layout | Routes |
| --- | --- | --- |
| `(site)` | marketing, no shell | `/` landing |
| `(app)` | `AppShell` | `/dashboard`, `/learn`, `/class/[grade]`, `/class/[grade]/[subject]`, `/class/[grade]/[subject]/[chapter]`, `/practice`, `/mock`, `/mock/[id]`, `/papers`, `/library`, `/progress`, `/planner`, `/parent`, `/saved`, `/news` |
| `(print)` | bare A4 | `/notes/[grade]/[subject]/[chapter]`, `/paper/[id]` (sources for PDFs, also printable in the browser) |

Dynamic routes use `generateStaticParams`, so the static export contains every class, subject, chapter,
mock and print page.

## Server vs client
- **Server components** (default): read the curriculum, parse Markdown (`src/lib/lessons.ts`, `server-only`),
  render lesson HTML, build the search index.
- **Client components** (`"use client"`): anything that reads progress — learning path state, quiz,
  mock runner, dashboard, progress, planner, parent view, buttons that change state.
- The store uses `useSyncExternalStore`, so the server render shows the empty state and the client hydrates
  to saved progress; `useHydrated()` hides numbers that would flash.

## Content pipeline
1. **Curriculum** (`src/content/curriculum/*.ts`): classes → subjects → units → chapters (`ch(title, topics, id?)`).
2. **Lessons** (`src/content/lessons/class-XX/<subject>.md`): `=== chapter-id ===` sections, callouts, `--- quiz ---`.
3. **Mocks** (`src/content/mocks/*.md` + `index.ts`): `## Section | marks | note` blocks.
4. `src/lib/lessons.ts` / `src/lib/mocks.ts` parse these at build time; results are cached per file.
5. `scripts/check-content.mjs` validates everything; `scripts/generate-pdfs.mjs` prints the `(print)` routes to `public/notes` and `public/papers`.

## State
`src/lib/store.ts` — a tiny external store: `load()` from localStorage once, `set()` writes and notifies,
cross-tab sync via the `storage` event. Derived values (`streakOf`, `levelOf`, `weekOf`, `achievements`)
are pure functions of state.

## Deployment
`STATIC_EXPORT=1` → `output: "export"`; `BASE_PATH` → `basePath` and `NEXT_PUBLIC_BASE_PATH` (used by
`src/lib/asset.ts` so plain `<a download>` links to PDFs work under a sub-path).
`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`.

## Extending to a backend (planned)
Keep pages static; add an API (see [API](05-API.md)) for accounts and sync. The store gets a sync adapter
that pushes the same `State` document; content stays in the repo.
