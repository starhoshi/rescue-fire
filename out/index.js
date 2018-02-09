"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a roughly similar event to Cloud Functions.
 * @param ref DocumentReference: event.data.ref
 * @param data Document Data: event.data.data()
 * @param options Options
 */
exports.event = (ref, data, options) => {
    const now = new Date();
    let eventType = 'create';
    let previousData = undefined;
    let params = undefined;
    let resource = 'resource';
    if (options) {
        eventType = options.eventType || 'create';
        previousData = options.previousData;
        params = options.params;
        resource = options.resource;
    }
    return {
        eventId: Math.random().toString(36).slice(-10),
        timestamp: now.toISOString(),
        eventType: `providers/cloud.firestore/eventTypes/document.${eventType}`,
        resource: resource,
        params: params,
        data: {
            exists: true,
            ref: ref,
            id: ref.id,
            createTime: now.toISOString(),
            updateTime: now.toISOString(),
            readTime: undefined,
            previous: { data: () => { return previousData; } },
            data: () => { return data; },
            get: (key) => { return undefined; }
        }
    };
};
