# Changelog

All notable changes are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- GPS filtering by reported accuracy, implied speed, and minimum distance.
- Coordinate-only and metadata-rich observations.
- Retained/rejected source indices and validation tests.
- Shared coordinate types and normalization through `geo-core`.
- CI across supported Node.js versions and npm tag publishing workflow.

### Changed

- Process observations in a single pass rather than retaining a fully normalized intermediate track.
- Documented filtering order, timestamp behavior, distance model, and complexity.
- Set the unpublished package's first release version to 1.0.0.

### Fixed

- Reject sparse track arrays explicitly instead of allowing holes to fail later as an incidental error.
- Reuse `geo-core` normalization and `geo-distance` great-circle calculations rather than maintaining duplicate implementations.
