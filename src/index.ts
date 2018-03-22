import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

/**
 * Cloud Functions's event type
 */
export enum EventType {
  Create = 'create',
  Update = 'update',
  Write = 'write',
  Delete = 'delete'
}

/**
 * event options
 */
export interface Options {
  /**
   * event.data.previous.data()
   */
  previousData?: any

  /**
   * event.params
   */
  params?: { [option: string]: any },

  /**
   * event.eventType
   */
  eventType?: EventType

  /**
   * event.resource
   */
  resource?: string
}

/**
 * Create a roughly similar event to Cloud Functions.
 * [Interface: Event  \|  Firebase](https://firebase.google.com/docs/reference/functions/functions.Event)
 *
 * @param ref DocumentReference: event.data.ref
 * @param data Document Data: event.data.data()
 * @param options Options
 */
export const event = (ref: FirebaseFirestore.DocumentReference, data: any, options?: Options): functions.Event<functions.firestore.DeltaDocumentSnapshot> => {
  const now = new Date()
  let eventType = EventType.Write
  let previousData: any | undefined = undefined
  let previous: { [key: string]: any } | undefined = undefined
  let params: { [key: string]: string } | undefined = undefined
  let resource: string | undefined = 'resource'
  let exists = true

  if (options) {
    previousData = options.previousData
    previous = { data: () => { return previousData } }
    params = options.params
    resource = options.resource

    if (options.eventType) {
      eventType = options.eventType
      switch (options.eventType) {
        case EventType.Create:
          previous = undefined
          break
        case EventType.Delete:
          exists = false
          break
        default:
          // nothing to do
          break
      }
    }
  }

  return <functions.Event<functions.firestore.DeltaDocumentSnapshot>>{
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
      readTime: undefined as any,
      previous: previous as any,
      data: () => { return data },
      get: (key: string) => { return undefined }
    }
  }
}
