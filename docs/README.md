# Kaksha documentation

Kaksha is a free CBSE learning portal for Classes 1–12: concept lessons, a game-like learning path,
chapter quizzes, full mock tests, past-paper links, downloadable notes and progress tracking.

| # | Document | What it covers |
| --- | --- | --- |
| 1 | [PRD](01-PRD.md) | Product goals, users, scope, phased roadmap, success metrics |
| 2 | [DESIGN](02-DESIGN.md) | Visual language, tokens, components, motion, accessibility |
| 3 | [ARCHITECTURE](03-ARCHITECTURE.md) | System overview, routing, rendering, content pipeline |
| 4 | [DATABASE](04-DATABASE.md) | Progress data model (localStorage today, server schema planned) |
| 5 | [API](05-API.md) | Internal module APIs and the planned HTTP API |
| 6 | [AGENTS](06-AGENTS.md) | Rules for AI coding agents and contributors working in this repo |
| 7 | [README](07-README.md) | Project overview (same as the repo README) |
| 8 | [Project implementation](08-PROJECT-IMPLEMENTATION.md) | What is built, file by file, and how the phases were delivered |
| 9 | [Setup](09-SETUP.md) | Local setup, scripts, deployment to GitHub Pages or Vercel |
| 10 | [Feature development](10-FEATURE-DEVELOPMENT.md) | How to add lessons, chapters, mocks, pages and features |
| 11 | [Authentication & security](11-AUTH-AND-SECURITY.md) | Current privacy model, threat model, planned accounts |
| 12 | [MCP connection](12-MCP-CONNECTION.md) | Using MCP servers to develop, test and (later) serve content |
| 13 | [Integrations](13-INTEGRATIONS.md) | CBSE/NCERT links, hosting, fonts, planned analytics and backend |
| 14 | [Testing & QA](14-TESTING-QA.md) | Content validator, type checks, link/button crawl, manual checklist |
| 15 | [Debugging](15-DEBUGGING.md) | Known issues and how to diagnose them |

Quick start:

```bash
npm install
npm run dev            # http://localhost:3000
npm run check:content  # validate lessons and mock papers
npm run build          # production build
```
