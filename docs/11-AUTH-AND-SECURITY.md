# 11. Authentication & security

## Current model: no accounts
- No sign-up, no login, no passwords, no cookies, no analytics. The only "identity" is a first name and
  class the learner types during onboarding, stored in their own browser.
- Progress lives in `localStorage` on that device. Clearing browser data or using another device starts fresh.
- The Parent view reads the same local data, so it works on the child's device only.

This keeps the site safe for children (no personal data collected, nothing to leak) and compliant by default
with privacy expectations for minors (India DPDP Act 2023, COPPA-style principles).

## Threat model and mitigations
| Risk | Mitigation |
| --- | --- |
| XSS via lesson HTML (`dangerouslySetInnerHTML`) | Lesson Markdown is authored in the repo and reviewed in PRs; no user-generated content is ever rendered as HTML. User inputs (name, tasks) are rendered as text by React. |
| Malicious external links / tab-nabbing | External links use `target="_blank" rel="noreferrer"`; only official CBSE/NCERT domains are linked. |
| Supply chain | Small dependency set; `package-lock.json` committed; `npm ci` in CI; Dependabot recommended. |
| Secrets in repo | None are needed; never add keys to client code (`NEXT_PUBLIC_*` is public). |
| Corrupt local data | `load()` wraps JSON parsing in try/catch and falls back to an empty state. |
| Shared device | Reset progress on the Progress page; no sensitive data stored. |

Recommended headers when hosted on Vercel/Netlify: `Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.

## Planned: optional accounts (phase 6)
- **Passwordless email OTP** (or Google sign-in for parents); students under 13 sign in via a parent-created profile.
- HTTP-only, Secure, SameSite=Lax session cookies; short-lived sessions with refresh; CSRF protection on mutations.
- Roles: student, parent (linked by a one-time code shown on the student's device), teacher.
- Row-level security: a user can read/write only their own rows; parents read linked students; teachers read assigned classes.
- Data minimisation: display name + class only; export and delete-my-data endpoints.
- Rate limiting on auth endpoints; audit log for parent/teacher access.
