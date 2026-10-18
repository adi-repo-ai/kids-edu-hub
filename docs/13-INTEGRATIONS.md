# 13. Integrations

| Integration | Status | How |
| --- | --- | --- |
| **CBSE** question papers & sample papers | Linked | Papers page links to `cbse.gov.in/cbsenew/question-paper.html` and `cbseacademic.nic.in` (SQP and marking schemes). CBSE blocks automated downloads, so files are not mirrored. |
| **NCERT** textbooks | Linked | `ncert.nic.in/textbook.php` from every chapter without a lesson yet |
| **GitHub Pages** | Live | `.github/workflows/deploy.yml` on push to `main` |
| **Vercel / Netlify** | Supported | See [Setup](09-SETUP.md) |
| **Fonts** | Bundled | `@fontsource-variable/plus-jakarta-sans`, `@fontsource-variable/noto-sans-devanagari` (self-hosted, no Google requests) |
| **Icons** | Bundled | `lucide-react` |
| **Playwright** | Dev only | PDF generation and UI testing |
| **CBSE news** | Static | `/news` lists curated notices with links to CBSE; planned: build-time RSS/scrape when CBSE offers a feed |
| Analytics | Not added | If added, use a privacy-first, cookie-less tool (Plausible/Umami), aggregate only, no child identifiers |
| Backend (accounts/sync) | Planned | Supabase or Postgres + Next.js route handlers; see [API](05-API.md) |
| Video | Planned | Embed curated YouTube (NCERT/CIET/DIKSHA) per chapter via `youtube-nocookie.com` |
| DIKSHA / NDEAR | Planned | Link chapter QR content where available |

Adding an integration: document it here, keep it optional (site must work without it), never send learner data
to a third party without updating [Auth & security](11-AUTH-AND-SECURITY.md).
