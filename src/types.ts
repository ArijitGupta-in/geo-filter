export type { Coordinate, CoordinateInput } from "@arijitgupta/geo-core";
import type { Coordinate } from "@arijitgupta/geo-core";
export interface TrackPoint {
    coordinate: import("@arijitgupta/geo-core").CoordinateInput;
    /** Unix epoch milliseconds. */
    timestamp?: number;
    /** Reported horizontal accuracy radius in meters. */
    accuracyMeters?: number;
}
export interface FilterTrackOptions {
    maxAccuracyMeters?: number;
    maxSpeedMetersPerSecond?: number;
    minDistanceMeters?: number;
}
export interface NormalizedTrackPoint {
    coordinate: Coordinate;
    timestamp?: number;
    accuracyMeters?: number;
}
export interface FilterTrackResult {
    points: NormalizedTrackPoint[];
    retainedIndices: number[];
    rejectedIndices: number[];
}
