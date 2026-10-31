# @arijitgupta/geo-filter

Filter ordered GPS observations using reported accuracy, implied speed, and minimum-distance thinning. Coordinate types and normalization are provided by [`@arijitgupta/geo-core`](https://www.npmjs.com/package/@arijitgupta/geo-core); great-circle distances are provided by [`@arijitgupta/geo-distance`](https://www.npmjs.com/package/@arijitgupta/geo-distance).

## Install

```bash
npm install @arijitgupta/geo-filter
```

The required geo packages are installed as runtime dependencies automatically.

## Example

```ts
import { filterTrack, type TrackPoint } from "@arijitgupta/geo-filter";

const track: TrackPoint[] = [
    {
        coordinate: { latitude: 22.5726, longitude: 88.3639 },
        timestamp: 1_800_000_000_000,
        accuracyMeters: 8,
    },
    {
        coordinate: { latitude: 22.57261, longitude: 88.36391 },
        timestamp: 1_800_000_005_000,
        accuracyMeters: 12,
    },
];

const result = filterTrack(track, {
    maxAccuracyMeters: 30,
    maxSpeedMetersPerSecond: 15,
    minDistanceMeters: 3,
});

console.log(result.points, result.retainedIndices, result.rejectedIndices);
```

Coordinate-only arrays are also accepted. Timestamps and accuracy are optional metadata.

## API

All functions and types are exported from the package root.

| Export | Description |
| --- | --- |
| `filterTrack(input, options?)` | Normalize and filter an ordered track; returns points and retained/rejected source indices. |
| `removeStationaryDuplicates(input, toleranceMeters?)` | Convenience wrapper applying only minimum-distance thinning. |
| `Coordinate`, `CoordinateInput`, `DMSCoordinate`, `LatitudeDMS`, `LongitudeDMS`, `LatitudeDirection`, `LongitudeDirection` | Shared coordinate types re-exported from `geo-core`. |
| `TrackPoint` | Coordinate plus optional timestamp and reported accuracy metadata. |
| `FilterTrackOptions` | Optional thresholds for accuracy, speed, and minimum distance. |
| `NormalizedTrackPoint`, `FilterTrackResult` | Normalized output point and result shapes. |

| Option | Unit | Rejection rule |
| --- | --- | --- |
| `maxAccuracyMeters` | meters | Reject when reported accuracy is greater than the threshold. A point without accuracy is not rejected by this option. |
| `maxSpeedMetersPerSecond` | meters/second | Reject when implied speed from the last retained timestamped point is greater than the threshold. |
| `minDistanceMeters` | meters | Reject when distance from the last retained point is less than or equal to the threshold. |

## Filtering semantics

- Every filter is opt-in. Processing order is accuracy, speed, then minimum distance.
- A rejected point never becomes the reference for later speed or distance checks.
- Speed is checked only when both the current and last retained points have timestamps. Missing timestamps mean speed cannot be inferred for that pair.
- Timestamps are Unix epoch milliseconds. If speed filtering is enabled and both timestamps exist, a non-increasing timestamp causes the current point to be rejected.
- Speed and distance use `geo-distance`'s spherical Haversine model with a mean Earth radius of 6,371,000 m. It is an estimate, not an ellipsoidal geodesic.
- Coordinates are validated and normalized by `geo-core`; decimal-degree and DMS inputs are supported. Sparse track arrays are rejected.
- Accuracy is trusted as reported. The library does not smooth data, infer missing positions, or choose thresholds for a particular sampling interval.
- Input arrays and points are not mutated. The implementation uses O(n) time and O(n) memory for n track observations because it returns retained points and indices.

Non-finite thresholds and metadata values throw `TypeError`; negative thresholds or accuracy values throw `RangeError`. Invalid coordinates throw `TypeError` or `RangeError`.

## Development

Requires Node.js 22.12+ and npm 10+.

```bash
npm ci
npm test
npm run check
npm run build
npm run lint:md
npm run test:coverage
npm run benchmark
```

## License

MIT
