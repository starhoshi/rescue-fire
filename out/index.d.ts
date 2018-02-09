import * as functions from 'firebase-functions';
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
    eventType?: 'create' | 'write' | 'update' | 'delete';
    /**
     * event.resource
     */
    resource?: string;
}
/**
 * Create a roughly similar event to Cloud Functions.
 * @param ref DocumentReference: event.data.ref
 * @param data Document Data: event.data.data()
 * @param options Options
 */
export declare const event: (ref: FirebaseFirestore.DocumentReference, data: any, options?: Options | undefined) => functions.Event<functions.firestore.DeltaDocumentSnapshot>;
