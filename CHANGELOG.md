# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

## [0.3.1-pre.1] - 2026-09-06

### Fixed

- **Staleness and `data_age` reflect actual position freshness** - A person's age is now measured from the newest update among their attached **position** device trackers (those with `tracking_type: position` or GPS coordinates), falling back to the entity's own `last_updated`/`last_changed` when none exist. Connection-style trackers (WiFi/BLE/router presence) are ignored, so unrelated updates no longer falsely reset the stale marker or satisfy `data_age` display conditions.

## [0.3.1-pre] - 2026-09-06

### Changed

- Restyled the card editor to match the flightradar24-card design language.

## [0.3.0] - 2026-09-03

### Added

- History trail with configurable opacity, age, proximity, and distance filters
- Per-person trail color picker
- Multiple map tile providers (OpenStreetMap, CartoDB, Stadia, Esri, OpenTopoMap) with theme-aware `system` mode

### Changed

- Corrected repository metadata after the GitHub rename.