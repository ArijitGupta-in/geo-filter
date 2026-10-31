# @arijitgupta/geo-filter

A lightweight TypeScript library for filtering geographic coordinate sequences and GPS track observations.

This package is in its initial scaffold stage. Filtering strategies, required metadata, and the public API will be defined through design issues before implementation.

## Planned scope

The library will focus on filtering observed location samples rather than modifying path geometry for display. Candidate concerns include implausible jumps, duplicate or near-duplicate observations, accuracy-aware filtering, and temporal or speed-based outlier detection.

The design must distinguish coordinate-only filtering from filters that require timestamps, reported accuracy, or other sensor metadata. No strategy or default threshold is committed yet.

## Coordinate model

Shared coordinate types, DMS conversion, normalization, and validation are provided by [`@arijitgupta/geo-core`](https://www.npmjs.com/package/@arijitgupta/geo-core).

## Development

Requires Node.js 22.12+ and npm 10+.

```bash
npm install
npm test
npm run test:coverage
npm run check
npm run lint:md
npm run build
```

## Status

Under initial development. No stable public API has been released.

## License

MIT
