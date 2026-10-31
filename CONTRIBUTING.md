# Contributing to @arijitgupta/geo-filter

## Prerequisites

- Node.js 22.12 or later
- npm 10 or later

## Setup

```bash
git clone https://github.com/ArijitGupta-in/geo-filter.git
cd geo-filter
npm install
```

## Development commands

| Command | Purpose |
| --- | --- |
| `npm test` | Run tests with Vitest |
| `npm run test:coverage` | Run tests and enforce coverage thresholds |
| `npm run check` | Type-check source and tests |
| `npm run lint:md` | Lint Markdown files |
| `npm run build` | Compile TypeScript to `dist/` |

## Project conventions

- Source files live under `src/`; tests sit alongside their subjects.
- The public API is defined only by exports from `src/index.ts`.
- Use strict TypeScript and `import type` for type-only imports.
- Use `@arijitgupta/geo-core` for shared coordinate types and validation.
- Validate untrusted inputs at public API boundaries.
- Make each filter's required inputs explicit. Timestamp-, accuracy-, and speed-dependent operations must not silently assume those values exist.
- Document thresholds, units, ordering guarantees, and whether rejected samples are discarded or reported.
- Every public function needs happy-path, boundary, and invalid-input tests.
- Avoid `as any` in tests unless deliberately testing unsafe input.

## Design before implementation

The API and filtering strategies are not finalized. Discuss the distinction between invalid samples, noisy samples, and valid but unusual movement. Consider missing timestamps, irregular sampling intervals, reported accuracy, stationary drift, and legitimate high-speed travel before choosing defaults.

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
