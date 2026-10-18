# Kaksha · CBSE learning portal (Classes 1–12)

A free, centralised CBSE learning portal: **concept lessons** for every topic, a **game-like learning path**,
chapter **quizzes**, full **board-pattern mock tests**, **past-paper** links, downloadable **PDF notes**, and
**progress that saves** (XP, streaks, badges, planner, parent view). No sign-up.

Built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4**, fully static.

```bash
npm install
npm run dev              # http://localhost:3000
npm run check:content    # validate lessons and mock papers
npm run typecheck
npm run build            # production build (~1,000 static pages)
npm run check:links      # every internal link and download resolves
npm run check:ui         # every button does something, no console errors, no sideways scroll
npm run pdfs             # regenerate notes/paper PDFs into public/ (needs Playwright)
```

## What's inside
| Area | Routes |
| --- | --- |
| Landing | `/` |
| Dashboard | `/dashboard` — continue learning, today's goal, streak, XP, plan, badges |
| Learn | `/learn`, `/class/[grade]`, `/class/[grade]/[subject]` (learning path), `/class/[grade]/[subject]/[chapter]` (lesson + quiz) |
| Practice | `/practice`, `/mock`, `/mock/[id]` (timed mock exam), `/papers`, `/library` |
| Me | `/progress`, `/planner`, `/saved`, `/parent`, `/news` |
| Print / PDF | `/notes/[grade]/[subject]/[chapter]`, `/paper/[id]` → `public/notes/*.pdf`, `public/papers/*.pdf` |

**Content status:** the full syllabus (every chapter) for Classes 1–12 is listed. Complete concept lessons with quizzes
are live for **all Class 9 and 10 subjects** (Maths, Science, Social Science, English, Hindi, IT). Mock tests cover Class 10
Maths, Science and Social Science, and Class 9 Maths and Science. More classes are being added in phases (see `docs/01-PRD.md`).

## Project layout
```
src/app/            routes: (site) landing, (app) portal, (print) PDF sources
src/components/     ui kit, layout shell, learn, practice, progress, dashboard
src/content/        curriculum (TS), lessons (Markdown), mocks (Markdown)
src/lib/            store (localStorage progress), curriculum, lessons parser, search, mocks
scripts/            content validator, link and UI checkers, PDF generator
docs/               PRD, design, architecture, data, API, agents, setup, testing, debugging…
```

## Deploy
- **GitHub Pages:** every push to `main` runs `.github/workflows/deploy.yml`. One-time: **Settings → Pages → Source: GitHub Actions**.
  Site: https://adi-repo-ai.github.io/kids-edu-hub/
- **Vercel:** import the repo, framework Next.js, no settings needed.

## Docs
Start at [`docs/README.md`](README.md).

Kaksha is independent and not affiliated with CBSE or NCERT.
