# @arijitgupta/geo-filter

Filter GPS observations using reported accuracy, implied speed, and minimum-distance thinning.

## Install

```bash
npm install @arijitgupta/geo-filter
```

## Example

```ts
import { filterTrack } from "@arijitgupta/geo-filter";
const result = filterTrack([
    { coordinate: { latitude: 22.5726, longitude: 88.3639 }, timestamp: 1_800_000_000_000, accuracyMeters: 8 },
    { coordinate: { latitude: 22.57261, longitude: 88.36391 }, timestamp: 1_800_000_005_000, accuracyMeters: 12 },
], { maxAccuracyMeters: 30, maxSpeedMetersPerSecond: 15, minDistanceMeters: 3 });
console.log(result.points, result.rejectedIndices);
```

Coordinate-only arrays are also accepted. Timestamps and accuracy are optional metadata.

## API

- `filterTrack(points, options?)`: returns normalized `points`, `retainedIndices`, and `rejectedIndices`.
- `removeStationaryDuplicates(points, toleranceMeters?)`: convenience wrapper for minimum-distance thinning.

| Option | Unit | Rule |
| --- | --- | --- |
| `maxAccuracyMeters` | meters | Reject when reported accuracy exceeds the threshold |
| `maxSpeedMetersPerSecond` | meters/second | Reject when speed from the last retained timestamped observation exceeds the threshold |
| `minDistanceMeters` | meters | Reject when distance from the last retained observation is at or below the threshold |

All filters are opt-in. Processing order is accuracy, speed, then distance. Timestamps are Unix epoch milliseconds. If either point lacks a timestamp, speed is not inferred for that pair. When both timestamps exist, non-increasing time is rejected if speed filtering is enabled. A rejected outlier does not become the reference for the next sample.

This library does not smooth data or infer missing positions. Accuracy is trusted as reported and thresholds must be chosen for the sampling interval and use case.

## Development

Requires Node.js 22.12+ and npm 10+. Run `npm install`, `npm test`, `npm run check`, `npm run build`, and `npm run lint:md`.

## License

MIT
