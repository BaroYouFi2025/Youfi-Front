# Style & Conventions
- Language: TypeScript throughout; components use `PascalCase.tsx`, hooks `use*.ts`, utilities camelCase.
- Formatting: 2-space indent, single quotes preferred. Add concise comments only for non-obvious logic. Keep styled-component definitions near file end.
- Styling: styled-components in `*.styles.ts`; colocate styles with screens/components. Reuse design tokens and existing primitives.
- Imports: Use path aliases (`@/`, `@components/*`, etc.) for clarity and to avoid deep relative paths. Named exports favored to aid tree-shaking and avoid circular deps.
- Routing: Follow Expo Router conventions; colocate new routes in `app/` and wrap screens rather than manual navigator wiring.
- Assets/Fonts: Register new fonts in `app.json` and preload in `app/_layout.tsx` via `useFonts`. Use bundled or CDN images instead of local dev URLs when productionizing.
- API/Types: Respect typed contracts in `types/` (e.g., `MissingPersonTypes.ts`); sanitize inputs via `utils/validation.ts` instead of duplicating validation.