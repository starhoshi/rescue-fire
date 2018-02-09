import * as functions from 'firebase-functions';
/**
 * Cloud Functions's event type
 */
export declare enum EventType {
    Create = "create",
    Update = "update",
    Write = "write",
    Delete = "delete",
}
/**
 * event options
 */
export interface Options {
    /**
     * event.data.previous.data()
     */
    previousData?: any;
    /**
     * event.params
     */
    params?: {
        [option: string]: any;
    };
    /**
     * event.eventType
     */
    eventType?: EventType;
    /**
     * event.resource
     */
    resource?: string;
}
/**
 * Create a roughly similar event to Cloud Functions.
 * [Interface: Event  \|  Firebase](https://firebase.google.com/docs/reference/functions/functions.Event)
 *
 * @param ref DocumentReference: event.data.ref
 * @param data Document Data: event.data.data()
 * @param options Options
 */
export declare const event: (ref: FirebaseFirestore.DocumentReference, data: any, options?: Options | undefined) => functions.Event<functions.firestore.DeltaDocumentSnapshot>;
