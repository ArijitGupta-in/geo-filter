import { performance } from "node:perf_hooks";
import { filterTrack } from "../dist/index.js";

const sizes = [10_000, 50_000, 100_000];
const runs = 5;

function createTrack(size) {
    return Array.from({ length: size }, (_, index) => ({
        coordinate: {
            latitude: 22.5 + Math.sin(index / 1000) * 0.01,
            longitude: 88 + index * 0.000001,
        },
        timestamp: 1_800_000_000_000 + index * 1000,
        accuracyMeters: 8 + (index % 5),
    }));
}

for (const size of sizes) {
    const track = createTrack(size);
    const options = {
        maxAccuracyMeters: 12,
        maxSpeedMetersPerSecond: 20,
        minDistanceMeters: 1,
    };

    filterTrack(track, options);

    const samples = [];
    let retainedCount = 0;
    for (let run = 0; run < runs; run += 1) {
        const start = performance.now();
        retainedCount = filterTrack(track, options).points.length;
        samples.push(performance.now() - start);
    }

    samples.sort((a, b) => a - b);
    const median = samples[Math.floor(runs / 2)];
    if (median === undefined) {
        throw new Error("Benchmark did not produce timing samples");
    }
    console.log(
        `n=${String(size).padStart(6)} median=${median.toFixed(2)} ms retained=${retainedCount}`,
    );
}
