import type { Coordinate, DMSCoordinate } from "@arijitgupta/geo-distance";
export type { Coordinate, DMSCoordinate } from "@arijitgupta/geo-distance";
export type CoordinateInput = Coordinate | DMSCoordinate;

export interface TrackPoint { coordinate: CoordinateInput; timestamp?: number; accuracyMeters?: number; }
export interface FilterTrackOptions { maxAccuracyMeters?: number; maxSpeedMetersPerSecond?: number; minDistanceMeters?: number; }
export interface NormalizedTrackPoint { coordinate: Coordinate; timestamp?: number; accuracyMeters?: number; }
export interface FilterTrackResult { points: NormalizedTrackPoint[]; retainedIndices: number[]; rejectedIndices: number[]; }
