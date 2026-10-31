# Contributing to @arijitgupta/geo-filter

## Prerequisites

- Node.js 22.12 or later
- npm 10 or later

## Setup

```bash
git clone https://github.com/ArijitGupta-in/geo-filter.git
cd geo-filter
npm ci
```

## Development commands

| Command | Purpose |
| --- | --- |
| `npm test` | Run tests with Vitest |
| `npm run test:coverage` | Run tests and generate a coverage report |
| `npm run check` | Type-check source and tests |
| `npm run lint:md` | Lint Markdown files |
| `npm run clean` | Remove generated `dist/` output |
| `npm run build` | Clean and compile TypeScript to `dist/` |
| `npm run benchmark` | Build and run the track filtering benchmark |

## Project conventions

- Source files live under `src/`; tests sit alongside their subjects.
- The public API is defined only by exports from `src/index.ts`.
- Use strict TypeScript and `import type` for type-only imports.
- Use `@arijitgupta/geo-core` for shared coordinate types and normalization through `src/geo.ts`; do not duplicate those contracts.
- Use `@arijitgupta/geo-distance` for great-circle distance calculations rather than maintaining a second implementation.
- Validate untrusted inputs at public API boundaries.
- Make each filter's required inputs explicit. Timestamp-, accuracy-, and speed-dependent operations must not silently assume those values exist.
- Document thresholds, units, ordering guarantees, and whether rejected samples are discarded or reported.
- Every public function needs happy-path, boundary, and invalid-input tests.
- Add TSDoc for each exported function and update the README and changelog when public behavior or API changes.
- Avoid `as any` in tests unless deliberately testing unsafe input.

## Design before implementation

Discuss the distinction between invalid samples, noisy samples, and valid but unusual movement before adding filters or changing defaults. Preserve explicit semantics for missing timestamps, irregular sampling intervals, reported accuracy, stationary drift, and legitimate high-speed travel.

Keep this package focused on filtering GPS observations; geometric path simplification belongs in `geo-simplify`.

## Commit messages

Use Conventional Commits, for example:

```text
feat: add maximum-speed outlier filter
fix: handle missing timestamps
test: cover irregular sample intervals
docs: explain accuracy threshold units
chore: update Vitest
```

## Changelog

Add user-visible changes under [Unreleased] in `CHANGELOG.md`, using Keep a Changelog categories.

## Pull requests

1. Create a branch from `main`.
2. Make a focused change and add tests.
3. Run `npm run check`, `npm run lint:md`, and `npm run test:coverage`.
4. Explain what changed and why; link related issues.

## License

By contributing, you agree that contributions will be licensed under the MIT License.
