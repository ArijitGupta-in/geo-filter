import type { Coordinate, CoordinateInput } from "@arijitgupta/geo-core";

export type {
    Coordinate,
    CoordinateInput,
    DMSCoordinate,
    LatitudeDMS,
    LatitudeDirection,
    LongitudeDMS,
    LongitudeDirection,
} from "@arijitgupta/geo-core";

/** A coordinate observation with optional GPS metadata. */
export interface TrackPoint {
    /** Position as decimal-degree or DMS coordinates. */
    coordinate: CoordinateInput;
    /** Unix epoch timestamp in milliseconds. */
    timestamp?: number;
    /** Reported horizontal accuracy radius in meters. */
    accuracyMeters?: number;
}

/** Optional thresholds applied by {@link filterTrack}. */
export interface FilterTrackOptions {
    /** Reject observations whose reported accuracy is greater than this many meters. */
    maxAccuracyMeters?: number;
    /** Reject observations whose implied speed is greater than this many meters per second. */
    maxSpeedMetersPerSecond?: number;
    /** Reject observations within or exactly this distance in meters of the last retained point. */
    minDistanceMeters?: number;
}

/** A retained input point normalized to decimal degrees, preserving supplied metadata. */
export interface NormalizedTrackPoint {
    coordinate: Coordinate;
    timestamp?: number;
    accuracyMeters?: number;
}

/** Filtered points and their source indices in the original input. */
export interface FilterTrackResult {
    /** Retained, normalized points in input order. */
    points: NormalizedTrackPoint[];
    /** Zero-based source indices corresponding to `points`. */
    retainedIndices: number[];
    /** Zero-based source indices for rejected points, in input order. */
    rejectedIndices: number[];
}
