import { describe, expect, it } from "vitest";
import * as packageEntry from "./index.js";

describe("package entry point", () => {
    it("exports the public runtime operations", () => {
        expect(packageEntry.filterTrack).toBeTypeOf("function");
        expect(packageEntry.removeStationaryDuplicates).toBeTypeOf("function");
    });
});
