# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

## [0.3.1] - 2026-09-07

Consolidated release of the stale-detection, trail-history, editor, and position-freshness work.

### Added

- **Stale-person detection** - Mark a person as "stale" when their location hasn't updated within `stale_after_hours` (default: disabled). Stale markers are dimmed, faded, and shown in grayscale, and staleness is re-evaluated once a minute automatically. A missing entity or timestamp is always treated as stale.
- **`data_age` built-in sensor** - Age (in **minutes**) of a person's last location update, usable in display conditions (e.g. `sensor: data_age, comparator: gt, value: 1440` hides a person last updated more than 24h ago).
- **"Show as stale" editor setting** - Configure stale detection in the card editor under *Display Conditions*, with a threshold slider (1-72 hours).
- Editor restyled to match the flightradar24-card design language.

### Changed

- **More distinct stale marker styling** - Stale markers and overlay toggles are now faded (opacity 0.5) and lightened (`brightness(0.85)`) in addition to the grayscale filter, making outdated positions easier to spot.

### Fixed

- **Trail history "Request error"** - Replaced the REST `callApi` history fetch with the WebSocket `history/history_during_period` API (`hass.callWS`), eliminating the residual `{error: 'Request error'}` failures on Home Assistant versions where the REST history endpoint is unavailable or rejects requests.
- **Stale styling on overlay toggles** - The person toggle buttons in the top-right overlay now also dim and grayscale when their person is stale, matching the map marker treatment.

## [0.3.0] - 2026-09-03

### Added

- History trail with configurable opacity, age, proximity, and distance filters
- Per-person trail color picker
- Multiple map tile providers (OpenStreetMap, CartoDB, Stadia, Esri, OpenTopoMap) with theme-aware `system` mode

### Changed

- Corrected repository metadata after the GitHub rename.