# 4. Database / data model

## Today: browser storage
All learner data is one JSON document in `localStorage["kaksha:v3"]` (see `src/lib/store.ts`).

```ts
interface State {
  v: 3;
  profile: { name: string; grade: number | null; onboarded: boolean; dailyGoal: number };
  lessons: Record<string, string>;        // "10/maths/real-numbers" -> ISO date completed
  quizzes: Record<string, QuizRecord>;    // same key -> { best, total, attempts, last }
  mocks: MockRecord[];                    // newest first, max 50: { id, title, score, total, date, minutes }
  bookmarks: Bookmark[];                  // { key, title, meta, href }
  tasks: PlanTask[];                      // { id, title, date: yyyy-mm-dd, subject?, minutes, done }
  activity: Record<string, number>;       // yyyy-mm-dd -> XP earned that day
  xp: number;
}
```

**Keys:** chapter key = `chapterKey(grade, subject, chapter)` = `"<grade>/<subject-id>/<chapter-id>"`.
Chapter ids are stable slugs; renaming a chapter title must keep its id (pass an explicit id) or progress is orphaned.

**XP rules:** lesson complete +20 (once); quiz attempt +5, plus +5 per correct answer above your previous best;
mock finished +50; planner task done +10. Level = ⌊xp / 250⌋ + 1. Streak = consecutive days with activity.

**Versioning:** `v` is checked on load; a different version starts fresh. A future v4 must migrate v3 in `load()`.

**Limits & privacy:** a few KB per learner; nothing leaves the device; "Reset progress" on the Progress page
clears everything except the profile.

## Content "database" (build time)
| Entity | Source | Key |
| --- | --- | --- |
| Grade | `src/content/curriculum/class-*.ts` | `grade` 1–12 |
| Subject | same | `id` (e.g. `maths`, `social-science`) |
| Unit | same | index |
| Chapter | same | `id` (slug or explicit) |
| Lesson | `src/content/lessons/class-XX/<subject>.md` | `=== chapter-id ===` |
| Quiz question | inside lesson after `--- quiz ---` | position |
| Mock | `src/content/mocks/index.ts` + `.md` | `id` |

## Planned server schema (Postgres)
```sql
users(id uuid pk, created_at, display_name, grade int, role text check (role in ('student','parent','teacher')))
links(parent_id uuid fk users, student_id uuid fk users, pk(parent_id, student_id))
lesson_progress(user_id fk, chapter_key text, completed_at timestamptz, pk(user_id, chapter_key))
quiz_attempts(id pk, user_id fk, chapter_key text, score int, total int, created_at)
mock_attempts(id pk, user_id fk, mock_id text, score int, total int, minutes int, created_at)
bookmarks(user_id fk, key text, title text, meta text, href text, pk(user_id, key))
tasks(id pk, user_id fk, title text, date date, subject text, minutes int, done bool)
activity(user_id fk, day date, xp int, pk(user_id, day))
```
Sync strategy: on sign-in upload the local document, merge by max/union (best scores, earliest completion,
union of bookmarks/tasks, sum of distinct-day XP), then keep local as a cache.
