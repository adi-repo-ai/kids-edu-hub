# 5. API

Kaksha has **no runtime HTTP API today**: pages are static and progress is local. This document describes
(a) the internal module APIs other code should use, and (b) the HTTP API planned for accounts and sync.

## A. Internal modules

### Curriculum — `src/lib/curriculum.ts`
| Function | Returns |
| --- | --- |
| `grades` | `GradeDef[]` for Classes 1–12 |
| `getGrade(g)` | `GradeDef \| undefined` |
| `getSubject(g, s)` | `SubjectDef \| undefined` |
| `chaptersOf(subject)` | flat `ChapterDef[]` |
| `getChapter(g, s, c)` | `{ subject, chapter, unit, index, prev, next } \| undefined` |
| `allChapters()` | every `{ grade, subject, chapter }` (used by `generateStaticParams`) |
| `chapterKey(g, s, c)` / `chapterHref(g, s, c)` | `"10/maths/real-numbers"` / `"/class/10/maths/real-numbers"` |

### Lessons — `src/lib/lessons.ts` (server only)
- `getLesson(grade, subject, chapter): LessonDoc | null` → `{ html, toc: {id,title}[], quiz: QuizQuestion[], minutes }`
- `hasLesson(grade, subject, chapter): boolean`
- `parseQuiz(src): QuizQuestion[]`

### Mocks — `src/lib/mocks.ts` (server only)
- `loadMock(id) → { def: MockDef, sections: { title, marksEach, note, questions }[] } | null`
- `mocks` (from `src/content/mocks/index.ts`) lists every paper.

### Search — `src/lib/search.ts`
- `searchIndex()` builds entries for pages, classes, subjects and chapters.
- `search(q, grade?, limit = 10)` ranks by prefix/word match, boosting the learner's class.

### Store — `src/lib/store.ts` (client)
- `useStore(select)`, `useHydrated()`
- `actions.setProfile(p)`, `completeLesson(key)`, `uncompleteLesson(key)`, `recordQuiz(key, score, total)`,
  `recordMock(m) → date`, `updateMockScore(date, score)`, `toggleBookmark(b)`, `addTask(t)`, `toggleTask(id)`,
  `removeTask(id)`, `reset()`
- Derived: `streakOf(activity)`, `levelOf(xp)`, `weekOf(activity)`, `achievements(state)` (`src/lib/achievements.ts`)

### UI helpers
`toast(message)` (`src/lib/toast.ts`), `fireConfetti()` / `confettiFrom(el)` (`src/lib/confetti.ts`),
`asset(path)` (`src/lib/asset.ts`) for links to files in `public/`.

## B. Planned HTTP API (v1)
Base `/api/v1`, JSON, auth via HTTP-only session cookie (see [Auth](11-AUTH-AND-SECURITY.md)).

| Method | Path | Body / query | Response |
| --- | --- | --- | --- |
| POST | `/auth/otp` | `{ email }` | `204` (sends one-time code) |
| POST | `/auth/verify` | `{ email, code }` | `{ user }` + cookie |
| POST | `/auth/logout` | – | `204` |
| GET | `/me` | – | `{ user }` |
| GET | `/progress` | – | `State` document |
| PUT | `/progress` | `State` (client copy) | merged `State` |
| POST | `/quiz-attempts` | `{ chapterKey, score, total }` | `201` |
| POST | `/mock-attempts` | `{ mockId, score, total, minutes }` | `201` |
| GET | `/parent/students` | – | linked students with summaries |
| POST | `/parent/link` | `{ code }` | `201` (student shares a 6-digit code) |

Errors: `{ error: { code, message } }` with 400/401/403/404/409/429. Rate limits on auth endpoints.
Content (curriculum, lessons, mocks) stays static and is **not** served by the API.
