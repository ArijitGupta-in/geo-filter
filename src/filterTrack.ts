import { distanceBetween, normalizeCoordinate } from "./geo.js";
import type {
    CoordinateInput,
    FilterTrackOptions,
    FilterTrackResult,
    NormalizedTrackPoint,
    TrackPoint,
} from "./types.js";

function validateThreshold(name: string, value: number | undefined): void {
    if (value === undefined) return;
    if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new TypeError(name + " must be finite");
    }
    if (value < 0) {
        throw new RangeError(name + " must not be negative");
    }
}

function normalizePoint(
    value: TrackPoint | CoordinateInput,
    index: number,
): NormalizedTrackPoint {
    const isTrackPoint =
        typeof value === "object" && value !== null && "coordinate" in value;
    const input: TrackPoint = isTrackPoint
        ? (value as TrackPoint)
        : { coordinate: value as CoordinateInput };
    const point: NormalizedTrackPoint = {
        coordinate: normalizeCoordinate(input.coordinate),
    };

    if (input.timestamp !== undefined) {
        if (typeof input.timestamp !== "number" || !Number.isFinite(input.timestamp)) {
            throw new TypeError("timestamp at index " + index + " must be finite");
        }
        point.timestamp = input.timestamp;
    }

    if (input.accuracyMeters !== undefined) {
        if (typeof input.accuracyMeters !== "number" || !Number.isFinite(input.accuracyMeters)) {
            throw new TypeError("accuracyMeters at index " + index + " must be finite");
        }
        if (input.accuracyMeters < 0) {
            throw new RangeError("accuracyMeters at index " + index + " must not be negative");
        }
        point.accuracyMeters = input.accuracyMeters;
    }

    return point;
}

/**
 * Filters a track by reported accuracy, implied speed, then minimum distance.
 *
 * Each point is normalized and processed in input order. Rejected points do
 * not become references for speed or distance checks. Speed is checked only
 * when both the current and last retained points have timestamps. If speed
 * filtering is enabled and both timestamps exist, a non-increasing timestamp
 * causes the current point to be rejected.
 *
 * @param input - Ordered coordinate inputs or track points with optional metadata.
 * @param options - Optional accuracy, speed, and distance thresholds.
 * @returns Normalized retained points and the retained/rejected source indices.
 * @throws {TypeError} If the track or options have the wrong shape, a threshold or metadata value
 *   is non-finite, or a coordinate is malformed.
 * @throws {RangeError} If a threshold or accuracy is negative, or a coordinate is out of range.
 */
export function filterTrack(
    input: readonly (TrackPoint | CoordinateInput)[],
    options: FilterTrackOptions = {},
): FilterTrackResult {
    if (!Array.isArray(input)) {
        throw new TypeError("Track must be an array");
    }
    if (typeof options !== "object" || options === null || Array.isArray(options)) {
        throw new TypeError("options must be an object");
    }

    validateThreshold("maxAccuracyMeters", options.maxAccuracyMeters);
    validateThreshold("maxSpeedMetersPerSecond", options.maxSpeedMetersPerSecond);
    validateThreshold("minDistanceMeters", options.minDistanceMeters);

    const points: NormalizedTrackPoint[] = [];
    const retainedIndices: number[] = [];
    const rejectedIndices: number[] = [];

    for (let index = 0; index < input.length; index += 1) {
        if (!Object.hasOwn(input, index)) {
            throw new TypeError("Track is missing a point at index " + index);
        }

        const point = normalizePoint(input[index]!, index);
        if (
            options.maxAccuracyMeters !== undefined &&
            point.accuracyMeters !== undefined &&
            point.accuracyMeters > options.maxAccuracyMeters
        ) {
            rejectedIndices.push(index);
            continue;
        }

        const previous = points[points.length - 1];
        let distanceFromPrevious: number | undefined;
        if (
            previous &&
            options.maxSpeedMetersPerSecond !== undefined &&
            previous.timestamp !== undefined &&
            point.timestamp !== undefined
        ) {
            const elapsedSeconds = (point.timestamp - previous.timestamp) / 1000;
            if (elapsedSeconds <= 0) {
                rejectedIndices.push(index);
                continue;
            }
            distanceFromPrevious = distanceBetween(previous.coordinate, point.coordinate);
            const speed = distanceFromPrevious / elapsedSeconds;
            if (speed > options.maxSpeedMetersPerSecond) {
                rejectedIndices.push(index);
                continue;
            }
        }

        if (
            previous &&
            options.minDistanceMeters !== undefined &&
            (distanceFromPrevious ??
                distanceBetween(previous.coordinate, point.coordinate)) <=
                options.minDistanceMeters
        ) {
            rejectedIndices.push(index);
            continue;
        }

        points.push(point);
        retainedIndices.push(index);
    }

    return { points, retainedIndices, rejectedIndices };
}

/**
 * Removes consecutive stationary observations by minimum-distance thinning.
 *
 * Each point is compared with the last retained point. The first point is
 * retained when present; rejected points do not become comparison references.
 *
 * @param input - Ordered coordinate inputs or track points with optional metadata.
 * @param toleranceMeters - Maximum distance in meters for a point to be removed; defaults to zero.
 * @returns Normalized retained points and the retained/rejected source indices.
 * @throws {TypeError} If the tolerance is non-finite or the input/coordinate is malformed.
 * @throws {RangeError} If the tolerance is negative or a coordinate is out of range.
 */
export function removeStationaryDuplicates(
    input: readonly (TrackPoint | CoordinateInput)[],
    toleranceMeters = 0,
): FilterTrackResult {
    return filterTrack(input, { minDistanceMeters: toleranceMeters });
}
