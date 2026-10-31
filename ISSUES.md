# Review findings

Findings from the review of `@arijitgupta/geo-filter`.

All identified correctness findings are fixed. The streaming change removes the intermediate normalized array; benchmark results characterize filtering throughput at larger track sizes.

| Priority | Finding | Status |
| --- | --- | --- |
| Low | `Array.map` skipped sparse track entries. The later loop then accessed an absent normalized point and failed with an incidental runtime error. | Fixed: the single-pass loop explicitly rejects a missing source index with a descriptive `TypeError`. |
| Enhancement | The implementation normalized every point into an intermediate array before filtering, increasing peak memory and delaying output decisions. | Fixed: normalization and filtering now happen in one pass while preserving source indices and validation of every visited entry. Added a 10k/50k/100k benchmark. |
| Enhancement | Coordinate validation and Haversine distance were duplicated from sibling geo packages. | Fixed: coordinate types/normalization use `geo-core`; distances use `geo-distance`. No other geo package provides a better fit for these operations. |
| Enhancement | Non-increasing timestamps are rejected only when speed filtering is enabled and both compared points have timestamps. | Kept as deliberate, documented behavior; regression tests cover missing and non-increasing timestamps. A separate timestamp-validation option is not justified without a use case. |
