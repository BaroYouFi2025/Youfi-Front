# Task Completion Checklist
- Prefer small, single-purpose commits using Conventional Commits style (`feat:`, `fix:`, `chore:`...).
- Run `npm run lint`; resolve autofixable issues or document any remaining lint waivers inline.
- For risky areas (auth, GPS, reporting), note manual QA steps/results in PR description; automated tests not configured yet.
- For UI changes, include screenshots/video in PR; keep styled-components colocated and reuse primitives.
- Verify auth flow: refresh token handling in `utils/authStorage.ts`; clear token on logout flows. Validate critical flows manually (auth, GPS tracking, missing report submission).
- Link related issues (Linear/GitHub) in PR and squash-merge after verification passes.