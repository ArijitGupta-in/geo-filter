import { distanceBetween } from "@arijitgupta/geo-distance";
import { describe, expect, it } from "vitest";
import { filterTrack, removeStationaryDuplicates } from "./index.js";

const point = (latitude: number, longitude: number) => ({ latitude, longitude });
const sample = (
    latitude: number,
    longitude: number,
    timestamp: number,
    accuracyMeters = 5,
) => ({ coordinate: point(latitude, longitude), timestamp, accuracyMeters });

describe("GPS track filtering", () => {
    it("normalizes coordinate-only input", () => {
        expect(filterTrack([point(0, 0), point(0, 1)]).points.map((item) => item.coordinate)).toEqual([
            point(0, 0),
            point(0, 1),
        ]);
    });

    it("uses geo-core normalization for DMS coordinates", () => {
        const result = filterTrack([
            {
                latitude: { degrees: 0, minutes: 0, seconds: 0, direction: "N" },
                longitude: { degrees: 180, minutes: 0, seconds: 0, direction: "W" },
            },
        ]);
        expect(result.points[0]?.coordinate).toEqual(point(0, 180));
    });

    it("filters poor reported accuracy and preserves source indices", () => {
        const result = filterTrack(
            [sample(0, 0, 0, 3), sample(0, 0.001, 1000, 80)],
            { maxAccuracyMeters: 20 },
        );
        expect(result.retainedIndices).toEqual([0]);
        expect(result.rejectedIndices).toEqual([1]);
    });

    it("keeps observations without reported accuracy when accuracy filtering is enabled", () => {
        expect(
            filterTrack([point(0, 0)], { maxAccuracyMeters: 1 }).retainedIndices,
        ).toEqual([0]);
    });

    it("rejects speed outliers against the last retained sample", () => {
        const result = filterTrack(
            [sample(0, 0, 0), sample(0, 1, 1000), sample(0, 0.0001, 10000)],
            { maxSpeedMetersPerSecond: 50 },
        );
        expect(result.retainedIndices).toEqual([0, 2]);
        expect(result.rejectedIndices).toEqual([1]);
    });

    it("skips speed filtering when either timestamp is absent", () => {
        expect(
            filterTrack([point(0, 0), point(0, 1)], {
                maxSpeedMetersPerSecond: 1,
            }).points,
        ).toHaveLength(2);
        expect(
            filterTrack([sample(0, 0, 0), point(0, 1)], {
                maxSpeedMetersPerSecond: 1,
            }).points,
        ).toHaveLength(2);
    });

    it("rejects non-increasing timestamp pairs when speed filtering is enabled", () => {
        const result = filterTrack(
            [sample(0, 0, 1000), sample(0, 0.0001, 1000)],
            { maxSpeedMetersPerSecond: 10 },
        );
        expect(result.rejectedIndices).toEqual([1]);
    });

    it("accepts observations exactly at the maximum speed threshold", () => {
        const first = sample(0, 0, 0);
        const second = sample(0, 0.001, 1000);
        const exactSpeed = distanceBetween(first.coordinate, second.coordinate);
        expect(
            filterTrack([first, second], {
                maxSpeedMetersPerSecond: exactSpeed,
            }).retainedIndices,
        ).toEqual([0, 1]);
    });

    it("thins observations at or below the minimum-distance threshold", () => {
        const close = point(0, 0.001);
        const distance = distanceBetween(point(0, 0), close);
        expect(
            filterTrack([point(0, 0), close, point(0, 0.01)], {
                minDistanceMeters: distance,
            }).retainedIndices,
        ).toEqual([0, 2]);
    });

    it("preserves metadata on retained normalized points", () => {
        const result = filterTrack([sample(0, 0, 1234, 7)]);
        expect(result.points[0]).toEqual({
            coordinate: point(0, 0),
            timestamp: 1234,
            accuracyMeters: 7,
        });
    });

    it("reports stationary duplicates and source indices", () => {
        const result = removeStationaryDuplicates([point(0, 0), point(0, 0), point(0, 1)]);
        expect(result.retainedIndices).toEqual([0, 2]);
        expect(result.rejectedIndices).toEqual([1]);
    });

    it("rejects sparse tracks", () => {
        expect(() => filterTrack([point(0, 0), , point(0, 1)] as never)).toThrow(
            /index 1/,
        );
    });

    it("validates track, options, thresholds, metadata, and coordinates", () => {
        expect(() => filterTrack(null as never)).toThrow(TypeError);
        expect(() => filterTrack([point(0, 0)], null as never)).toThrow(TypeError);
        expect(() => filterTrack([point(0, 0)], { maxAccuracyMeters: -1 })).toThrow(
            RangeError,
        );
        expect(() => filterTrack([point(0, 0)], { minDistanceMeters: Number.NaN })).toThrow(
            TypeError,
        );
        expect(() => filterTrack([{ coordinate: point(0, 0), timestamp: Number.NaN }])).toThrow(
            TypeError,
        );
        expect(() => filterTrack([{ coordinate: point(0, 0), accuracyMeters: -1 }])).toThrow(
            RangeError,
        );
        expect(() => filterTrack([point(91, 0)])).toThrow(RangeError);
    });
});
