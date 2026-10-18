# 15. Debugging

| Symptom | Cause | Fix |
| --- | --- | --- |
| Lesson page shows "being written" although the Markdown exists | Chapter id mismatch | `npm run check:content` lists ids that don't match; use the slug of the title or the explicit id |
| Quiz has a missing question or merged options | No blank line between questions | Separate every `Q:`/`W[n]:` block with a blank line |
| Example lines run together in a callout | Lines not prefixed with `> ` | Every callout line starts with `> ` |
| PDF link 404 on GitHub Pages | Plain `<a>` without base path, or PDF not generated | Use `asset("/notes/…")`; run `npm run pdfs` and commit `public/` |
| GitHub Pages deploy fails "Not Found" | Pages not enabled | Settings → Pages → Source: GitHub Actions, then re-run the workflow |
| Site loads unstyled under `/kids-edu-hub/` | Built without `BASE_PATH` | The workflow sets it; for local checks `BASE_PATH=/kids-edu-hub STATIC_EXPORT=1 npm run build` |
| `tsc` errors about missing routes after deleting a page | Stale `.next/types` | `rm -rf .next` and rebuild |
| Hydration warning on progress numbers | Reading the store during server render | Gate with `useHydrated()` |
| Progress "lost" | Different browser/device, private mode, or cleared storage | Expected with local storage; accounts are planned. Inspect `localStorage.getItem("kaksha:v3")` in DevTools |
| Hindi shows boxes in PDFs | Fonts not loaded before printing | The generator awaits `document.fonts.ready`; ensure `@fontsource-variable/noto-sans-devanagari` is installed |
| `npm run pdfs` can't find Playwright | Not installed | `npm i -D playwright && npx playwright install chromium` |
| `'await' expressions are only allowed within async functions` in `generateMetadata` | `await params` inside an arrow callback | Destructure `const { id } = await params;` first |
| Page scrolls sideways on mobile | Wide or rotated element | `npm run check:ui` reports the page; constrain with `min-w-0`, `overflow-x-auto` on tables |

## Tips
- Reset local state: DevTools → Application → Local Storage → delete `kaksha:v3`.
- Inspect parsed lesson data: add `console.log(getLesson(10, "maths", "real-numbers"))` in a server component during dev.
- Mock parsing: headings must be `## Section X | <marks> | <note>`.
