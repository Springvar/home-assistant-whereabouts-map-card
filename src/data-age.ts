export type StateLookup = (entityId: string) => any;

/**
 * Whether an entity provides real position data, as opposed to a connection
 * tracker that merely pings presence. Connection trackers (WiFi/BLE/router)
 * update frequently for reasons unrelated to a location report, so their
 * timestamps must not be used as a staleness signal.
 */
export function isPositionTracker(entity: any): boolean {
    const attrs = entity?.attributes || {};
    const trackingType = attrs.tracking_type;
    if (trackingType) return trackingType === 'position';
    // Legacy trackers lack tracking_type; coordinates indicate a position source.
    return attrs.latitude !== undefined || attrs.longitude !== undefined;
}

/**
 * Resolve the timestamp that best represents when an entity's whereabouts was
 * last known to be updated.
 *
 * For `person.*` entities the person's own `last_updated`/`last_changed` is
 * avoided, because it churns on unrelated attribute updates (e.g. source
 * tracker switches or presence pings from connection trackers). Instead the
 * newest update among the position device trackers that Home Assistant uses to
 * derive the person's location is used.
 *
 * Falls back to the entity's own `last_updated`/`last_changed` when the entity
 * is not a person, has no attached device trackers, or none are position
 * trackers.
 */
export function getLastKnownUpdateTimestamp(entity: any, states: StateLookup): string | null {
    if (!entity) return null;

    if (entity.entity_id?.startsWith('person.')) {
        const deviceTrackers = entity.attributes?.device_trackers;
        if (Array.isArray(deviceTrackers) && deviceTrackers.length > 0) {
            let newest: string | null = null;
            for (const trackerId of deviceTrackers) {
                const tracker = states(trackerId);
                if (!tracker || !isPositionTracker(tracker)) continue;
                const timestamp = tracker.last_updated || tracker.last_changed;
                if (!timestamp) continue;
                if (!newest || new Date(timestamp).getTime() > new Date(newest).getTime()) {
                    newest = timestamp;
                }
            }
            if (newest) return newest;
        }
    }

    return entity.last_updated || entity.last_changed || null;
}

/**
 * Age in hours since the entity's whereabouts was last known to be updated.
 * Returns Infinity when the entity is missing or has no usable timestamp.
 */
export function getDataAgeHours(entity: any, states: StateLookup): number {
    const timestamp = getLastKnownUpdateTimestamp(entity, states);
    if (!timestamp) return Infinity;
    const parsed = new Date(timestamp).getTime();
    if (isNaN(parsed)) return Infinity;
    return (Date.now() - parsed) / 3600000;
}

/**
 * Age in minutes since the entity's whereabouts was last known to be updated.
 * Returns Infinity when the entity is missing or has no usable timestamp.
 */
export function getDataAgeMinutes(entity: any, states: StateLookup): number {
    const timestamp = getLastKnownUpdateTimestamp(entity, states);
    if (!timestamp) return Infinity;
    const parsed = new Date(timestamp).getTime();
    if (isNaN(parsed)) return Infinity;
    return (Date.now() - parsed) / 60000;
}