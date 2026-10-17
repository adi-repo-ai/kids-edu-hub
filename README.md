# Kaksha · CBSE learning portal (Classes 1–10)

A high-fidelity, fully clickable design build of a CBSE learning portal for kids.
Built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4**.
All pages are statically generated, and there is no backend.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (52 static pages)
npm run typecheck
npm run build:preview   # static, host-anywhere preview in preview/ (relative paths, full-page navigation)
```

## Deploy

Every push to `main` builds a static export and publishes it to GitHub Pages via
`.github/workflows/deploy.yml`. The site lives at
https://adi-repo-ai.github.io/kids-edu-hub/ (the workflow sets `BASE_PATH` to the repo name).

One-time setup: in the repo go to **Settings → Pages** and set **Source** to **GitHub Actions**.

## Screens

| Route | Screen | Interactive features |
| --- | --- | --- |
| `/` | Homepage & class selection | Hero search with suggestions, classes grouped by NEP stage, 11–12 "coming soon" |
| `/dashboard` | Student dashboard ("My desk") | Continue card, personalised revision path, animated subject progress, today's plan checklist, streak/XP/weekly goal, badges |
| `/class/[grade]` | Subjects for a class | Subject cards with progress |
| `/learn/[subject]` | Subject page | Chapter list with status, progress bars, bookmarks, "up next" |
| `/learn/[subject]/[chapter]` | Chapter page | Lesson thread (done / next / locked), progress ring, chapter quiz, downloads |
| `/lesson/perfect-squares-as-areas` | Interactive lesson | 4 steps: tile-grid slider, grow-the-square with numeric check, multi-select check, summary; hints, gated "Continue" |
| `/practice`, `/practice/[quizId]` | Quizzes & mock exams | Timer, hints, per-question feedback with explanations, progress segments, results review, retry |
| `/papers` | Previous CBSE papers | Class/year filters, subject/code filter, empty state, download + bookmark |
| `/library` | Notes, worksheets, downloads | Subject + type filters, download states (idle → busy → done) |
| `/news` | CBSE news & announcements | Pinned notice, category filter, timeline |
| `/planner` | Study planner & progress | Week strip, toggle tasks, add tasks, live weekly ring, time by subject, exam timetable |
| `/parent` | Parent dashboard | Child switcher, KPIs, daily study chart (with SR table), subject understanding with trends, teacher note, notification switches |
| `/saved` | Saved items | Bookmarks persisted to `localStorage` |
| `/design-system` | Design system reference | Colour tokens with **computed WCAG contrast**, type scale, spacing/radius/elevation, components, state matrices, motion spec, grid, do/don't |

Global: sticky header with active-route underline, `/` keyboard shortcut for search, an ARIA combobox (arrow keys, Enter, Esc), a full-screen search sheet on mobile, a bottom tab bar (Home · Learn · Practice · Saved · Planner) below `lg`, toasts announced via `aria-live`, a skip link and route-change rise transitions.

## Design system in code

- **Tokens:** `src/app/globals.css` (`@theme`). Warm paper neutrals and five accents (royal blue, coral, sunshine yellow, mint and lavender). `*-500` shades are for fills; `*-700` shades are the only accent text colours. Yellow never carries text.
- **Type:** Bricolage Grotesque (display) + Figtree (body), self-hosted via `@fontsource`.
- **Style (v2, bold):**
  - sticker surfaces (ink outlines + hard offset shadows), washi tape, a classroom chalkboard and a cork notice board
  - Gyani the owl mascot (`ui/Mascot.tsx`) with five moods, reacting in quizzes and lessons
  - Caveat handwriting for eyebrows, notes and speech bubbles
- **Motion:** page curtain wipe, scroll reveal with stagger (`[data-reveal]`), springy hovers, 3D tilt, count-up numbers, candy-striped progress bars, marquee strips, parallax hero stickers and canvas confetti (`lib/confetti.ts`). All of it is switched off under `prefers-reduced-motion`.
- **Components:**
  - `src/components/ui/*` holds the primitives: Button, Tag, Card, Progress, FilterChips, Switch, BadgeMedal, SubjectIcon, Doodles, Mascot, Marquee and Motion (reveal, count-up, tilt, rotating word, page curtain).
  - `src/components/features/*` holds the stateful widgets: SearchBox, LessonPlayer, QuizPlayer, WeekPlanner, ParentView, bookmarks and toasts.
- **Hue mapping:** `src/lib/hue.ts` keeps subject colours as literal class strings, so Tailwind can see them.
- **Accessibility:**
  - semantic landmarks and a visible 3px focus ring
  - touch targets of at least 44px (56–64px in the tab bar)
  - `prefers-reduced-motion` collapses all motion
  - charts have screen-reader tables
  - quiz options use the radio pattern

## Content

`src/data/*` holds illustrative sample content: a Class 8 student in half-yearly revision, chapters modelled on the current NCERT textbooks, and Class 10/12 paper listings. News items are placeholders, not real CBSE notices. Downloads are simulated, because no files are attached.
