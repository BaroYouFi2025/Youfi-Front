# AI Agent Guide

## Product Snapshot
- YouFi is an Expo Router powered React Native app that helps users report and track missing persons.
- Supports Android, iOS, and web targets with Expo SDK 54, React Native 0.81, and React 19.1.
- Authentication is gated by a refresh token stored in secure storage unless `EXPO_PUBLIC_BYPASS_AUTH` is true.

## Architecture & Module Map
- `app/`: Expo Router entry point; each route colocates its own styles and hooks. `app/(tabs)` holds the bottom tab layout while standalone routes (e.g., `login.tsx`, `missing-report.tsx`) wrap the screen modules.
- `screens/`: Page-level components composed from smaller UI pieces. Each screen keeps styles in `*.styles.ts` alongside the main component.
- `components/`: Reusable UI primitives (logo, themed views, form inputs) exported as typed function components. Prefer composition over deep prop drilling.
- `services/`, `utils/`, `constants/`: Shared business logic, API adapters, validation helpers, and configuration. Use named exports to keep tree-shaking effective and avoid circular imports.
- `assets/`: Packaged fonts and imagery. Register new fonts in `app.json` and preload them via hooks (see `hooks/useColorScheme.ts` and `app/_layout.tsx`).
- Path aliases (`@/`, `@components/*`, etc.) are defined in `tsconfig.json`; leverage them for import clarity.

## Navigation & Screens
- `app/_layout.tsx` wires `Stack` navigation with Safe Area and theme providers. It selects `(tabs)` or `login` as the initial route based on `getRefreshToken()` in `utils/authStorage.ts`.
- Tab routes in `app/(tabs)` (`gps.tsx`, `list.tsx`, `profile.tsx`, etc.) wrap screen modules while preserving router-based layout composition.
- Screens such as `screens/Home/home.tsx` and `screens/MissingReport/MissingReportScreen.tsx` rely on Expo Router’s `router` helper for navigation and future TODO hooks for feature build-out.
- Keep new routes colocated with their styles and register them through Expo Router conventions instead of manual navigator wiring.

## Styling & UI
- Styling uses `styled-components` in `*.styles.ts` files. Define styled blocks near the bottom of the file and reuse design tokens where possible.
- Visual assets currently reference local dev URLs for mock data. Replace with bundled images or remote CDN paths as features harden.
- The logo and other primitives live in `components/YouFiLogo`, `components/ThemedView`, etc.; prefer reusing these before creating new primitives.

## Data & Services
- `services/missingPersonAPI.ts` wraps Axios calls to the backend. Respect the typed request/response contracts defined in `types/MissingPersonTypes.ts`.
- Input sanitation and form validation live in `utils/validation.ts`; extend these helpers instead of duplicating validation logic.
- Authentication state uses Expo Secure Store (`utils/authStorage.ts`) and is consumed in root layout — remember to clear tokens on logout flows.

## Environment & Build Configuration
- `app.config.ts` maps Expo config, surfaces `EXPO_PUBLIC_API_URL`, and enables typed routes plus React Compiler. Update this file when adjusting platform settings.
- Default API base URL is `https://api.youfi.com`; override with `EXPO_PUBLIC_API_URL` for staging or local development.
- Fonts are loaded through `useFonts` inside `app/_layout.tsx`; register additional fonts both in `assets/fonts` and the layout loader.

## Development Commands
- `npm install`: Sync dependencies after editing `package.json`.
- `npm run start`: Launch Expo development server and validate Android/iOS/web QR builds.
- `npm run ios` / `npm run android` / `npm run web`: Open platform previews for platform-specific QA.
- `npm run lint`: Run `eslint-config-expo` to catch style and type issues before committing.
- `npm run reset-project`: Clear Metro/Expo caches via `scripts/reset-project.js` when bundler issues appear.

## Coding Standards
- Use TypeScript everywhere; components follow `PascalCase.tsx`, hooks `use*.ts`, utilities `camelCase.ts`.
- Indent with two spaces and prefer single quotes. Keep styled-component definitions at file end and annotate complex logic with concise comments only when necessary.
- Run `npm run lint` before pushing; apply auto-fixable changes and document any required rule exceptions inline.

## Testing & QA
- Automated tests are not yet configured. Run `npm run start` and exercise critical flows (auth, GPS tracking, missing report submission) on device or simulator.
- If adding Jest tests, place them in `__tests__/` with `*.test.ts[x]` patterns and mock async dependencies.
- For high-risk areas (auth, location, reporting), document manual QA steps and results in PR descriptions.

## Collaboration & Source Control
- Follow Conventional Commits (`feat:`, `fix:`, `chore:`…) with scoped, concise summaries.
- Keep commits single-purpose; split translations or config changes into separate commits when possible.
- PRs should summarize changes, link related Linear/GitHub issues, and include screenshots or videos for UI updates plus test evidence.
- Request review before merging and squash-merge only after CI or manual verification passes.
