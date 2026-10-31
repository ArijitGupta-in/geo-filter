import { describe, expect, it } from "vitest";
import * as packageEntry from "./index.js";

describe("package entry point", () => {
    it("loads successfully", () => {
        expect(packageEntry).toBeDefined();
    });
});
