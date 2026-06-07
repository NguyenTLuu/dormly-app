# DORMLY Agent Instructions

## Required Context

Before making changes, read:

- `docs/DORMLY_CONTEXT.md`
- `docs/UI_DECISIONS.md`
- `docs/SCREEN_REQUIREMENTS.md`
- `docs/TASK_HISTORY.md`

Use current code as the final source of truth when documentation and implementation differ.

## Working Rules

- Preserve Expo Router route groups and the existing manager detail Stack-screen approach.
- Keep manager feature components split into the existing feature folders.
- Use typed mock data under `src/data` until a real data layer is explicitly requested.
- Use NativeWind and existing shared components before adding new styling patterns.
- Use `sonner-native` for new user feedback instead of React Native `Alert`.
- Do not infer unimplemented requirements from `docs/DORMLY.pdf`.
- Do not broadly refactor or restyle legacy student/auth screens unless requested.
- Run TypeScript validation and lint after code changes.

## Documentation Maintenance

- Update the relevant context document when changing routes, screen behavior, data contracts, or durable UI decisions.
- Keep these documents concise and based on confirmed repository behavior.

