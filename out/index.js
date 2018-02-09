"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Cloud Functions's event type
 */
var EventType;
(function (EventType) {
    EventType["Create"] = "create";
    EventType["Update"] = "update";
    EventType["Write"] = "write";
    EventType["Delete"] = "delete";
})(EventType = exports.EventType || (exports.EventType = {}));
/**
 * Create a roughly similar event to Cloud Functions.
 * [Interface: Event  \|  Firebase](https://firebase.google.com/docs/reference/functions/functions.Event)
 *
 * @param ref DocumentReference: event.data.ref
 * @param data Document Data: event.data.data()
 * @param options Options
 */
exports.event = (ref, data, options) => {
    const now = new Date();
    let eventType = EventType.Write;
    let previousData = undefined;
    let previous = undefined;
    let params = undefined;
    let resource = 'resource';
    let exists = true;
    if (options) {
        previousData = options.previousData;
        previous = { data: () => { return previousData; } };
        params = options.params;
        resource = options.resource;
        if (options.eventType) {
            eventType = options.eventType;
            switch (options.eventType) {
                case EventType.Create:
                    previous = undefined;
                    break;
                case EventType.Delete:
                    exists = false;
                    break;
                default:
                    // nothing to do
                    break;
            }
        }
    }
    return {
        eventId: Math.random().toString(36).slice(-10),
        timestamp: now.toISOString(),
        eventType: `providers/cloud.firestore/eventTypes/document.${eventType}`,
        resource: resource,
        params: params,
        data: {
            exists: exists,
            ref: ref,
            id: ref.id,
            createTime: now.toISOString(),
            updateTime: now.toISOString(),
            readTime: undefined,
            previous: previous,
            data: () => { return data; },
            get: (key) => { return undefined; }
        }
    };
};
