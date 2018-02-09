import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { DeltaDocumentSnapshot } from 'firebase-functions/lib/providers/firestore'

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
  eventType?: 'create' | 'write' | 'update' | 'delete'

  /**
   * event.resource
   */
  resource?: string
}

/**
 * Create a roughly similar event to Cloud Functions.
 * @param ref DocumentReference: event.data.ref
 * @param data Document Data: event.data.data()
 * @param options Options
 */
export const event = (ref: FirebaseFirestore.DocumentReference, data: any, options?: Options) => {
  const now = new Date()
  let eventType = 'create'
  let previousData: any | undefined = undefined
  let params: { [key: string]: string } | undefined = undefined
  let resource: string | undefined = 'resource'
  if (options) {
    eventType = options.eventType || 'create'
    previousData = options.previousData
    params = options.params
    resource = options.resource
  }

  return <functions.Event<DeltaDocumentSnapshot>>{
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
      readTime: undefined as any,
      previous: { data: () => { return previousData } },
      data: () => { return data },
      get: (key: string) => { return undefined }
    }
  }
}
