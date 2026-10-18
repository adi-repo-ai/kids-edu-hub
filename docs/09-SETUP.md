# 9. Setup

## Requirements
Node.js 22+, npm 10+. Optional: Playwright + Chromium (only for `npm run pdfs`).

## Run locally
```bash
git clone https://github.com/adi-repo-ai/kids-edu-hub.git
cd kids-edu-hub
npm install
npm run dev          # http://localhost:3000
```

## Scripts
| Script | Does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check:content` | Validate lessons and mocks |
| `npm run pdfs` | Static export + Playwright → `public/notes/*.pdf`, `public/papers/*.pdf` |
| `npm run build:preview` | Self-contained static preview with relative paths |

For PDFs: `npm i -D playwright && npx playwright install chromium` (or a global Playwright install).

## Environment variables
| Var | Effect |
| --- | --- |
| `STATIC_EXPORT=1` | `output: "export"` into `out/` |
| `BASE_PATH=/kids-edu-hub` | Serve from a sub-path (GitHub Pages project sites) |

No secrets or API keys are required.

## Deploy
### GitHub Pages (configured)
1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions** (one time).
2. Push to `main`; `.github/workflows/deploy.yml` builds and deploys.
3. Site: `https://<owner>.github.io/kids-edu-hub/`.

### Vercel (recommended for a custom domain)
Import the repo at vercel.com → framework Next.js → no env vars → Deploy. Every push redeploys, PRs get
preview URLs. (Leave `STATIC_EXPORT`/`BASE_PATH` unset.)

### Netlify
Build command `STATIC_EXPORT=1 npm run build`, publish directory `out`.
