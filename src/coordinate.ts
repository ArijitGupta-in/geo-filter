import { dmsToDecimal, validateCoordinate } from "@arijitgupta/geo-distance";
import type { Coordinate, DMSCoordinate } from "@arijitgupta/geo-distance";
import type { CoordinateInput } from "./types.js";

/** Validate and normalize decimal-degree or DMS input into a fresh coordinate. */
export function normalizeCoordinate(input: CoordinateInput): Coordinate {
    if (typeof input !== "object" || input === null) throw new TypeError("Coordinate must be an object");
    const latitude: unknown = (input as { latitude?: unknown }).latitude;
    if (typeof latitude === "object" && latitude !== null) {
        const result = dmsToDecimal(input as DMSCoordinate);
        return { latitude: result.latitude, longitude: result.longitude };
    }
    const value = input as Coordinate;
    validateCoordinate(value);
    return { latitude: value.latitude, longitude: value.longitude };
}
