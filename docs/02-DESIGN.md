# 2. Design

## Direction
A mix of **modern app** (Duolingo-style path, chunky pressable buttons, streaks, XP, mascot) and **clean,
premium polish** (white cards on a cool canvas, generous spacing, one strong brand blue, restrained colour
per subject). Playful where it motivates, calm where students read.

## Tokens (`src/app/globals.css`, Tailwind v4 `@theme`)
| Token | Value | Use |
| --- | --- | --- |
| `canvas` | `#f5f7fb` | App background |
| `surface` / `surface-2` | white / light grey | Cards / insets, hovers |
| `line` / `line-strong` | borders | Card borders / button bottoms |
| `ink`, `ink-2`, `ink-3` | text | Headings / body / meta |
| `brand-50…900` | blue, `brand-500 #2e5bff` | Primary actions, links, current node |
| `coral-50…700` | warm red-orange | Streak, highlights |
| Tailwind `green`, `amber`, `violet` | | Success / XP / mocks |

Subject colours and icons live in `src/lib/subjects.ts` (`subjectStyles`, `styleFor(id)`), each with
`solid`, `soft`, `text`, `bar` classes and a `hex` for charts.

## Typography
- **Plus Jakarta Sans Variable** for UI and lessons; **Noto Sans Devanagari Variable** for Hindi (`lang="hi"`, `font-hindi`).
- Headings `font-extrabold`; lesson body 17px/1.75 (`.lesson` styles); eyebrow labels uppercase tracking.

## Components
| Component | File | Notes |
| --- | --- | --- |
| Button / ButtonLink | `components/ui/Button.tsx` | Variants primary, success, secondary, ghost, danger, white; 4px bottom edge that "presses" |
| ProgressBar / ProgressRing | `components/ui/Progress.tsx` | Animated fills |
| SubjectIcon | `components/ui/SubjectIcon.tsx` | Coloured tile with lucide icon |
| Mascot "Gyani" | `components/ui/Mascot.tsx` | Moods: happy, cheer, think, oops, wave |
| EmptyState, Toaster | `components/ui/` | Every empty list explains what to do next |
| AppShell | `components/layout/AppShell.tsx` | Sidebar (desktop), top bar with class switcher, search, streak & XP; bottom nav + "More" sheet (mobile) |
| LearningPath | `components/learn/LearningPath.tsx` | Zig-zag nodes, unit banners, stars from quiz bests, "Up next" bubble |
| Callouts | `.callout-*` | Key idea (blue), Example (violet), Tip (green), Formula (amber), Remember (coral), Mistake (red) |

## Motion
Keyframes `rise`, `pop`, `float`, `blink`, `wiggle-loop`, `pulse-ring`, `shake`, `stripes`; page enter via
`(app)/template.tsx`; confetti on lesson completion and perfect quizzes. All motion is disabled under
`prefers-reduced-motion`.

## Layout rules
- Max content width 72rem; lessons max 48rem with a sticky TOC on ≥1280 px.
- 16px side gutter on mobile; `overflow-x: clip` on html/body to prevent sideways scroll from rotated decorations.
- Print styles hide `.no-print` UI; print routes render clean A4 notes and papers.

## Accessibility
Semantic landmarks and headings, `aria-label` on icon buttons, `aria-pressed` toggles, visible focus rings,
colour contrast ≥ 4.5:1 for text, keyboard-operable quiz and mock palette, `lang="hi"` on Hindi content.
