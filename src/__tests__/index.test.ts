import 'jest'
import * as Rescue from '../index'
import * as functions from 'firebase-functions'
import { DeltaDocumentSnapshot } from 'firebase-functions/lib/providers/firestore'

const ref = { id: '1' } as any

describe('no options', () => {
  let event: functions.Event<DeltaDocumentSnapshot>
  const data = { name: 'hoge' }
  beforeEach(() => {
    event = Rescue.event(ref, data)
  })
  test('event created', () => {
    commonExpect(event)
    expect(event.eventType).toContain(Rescue.EventType.Write)
    expect(event.resource).toBe('resource')
    expect(event.params).toBeUndefined()
    expect(event.data.exists).toBe(true)
    expect(event.data.ref).toBe(ref)
    expect(event.data.id).toBe(ref.id)
    expect(event.data.previous).toBeUndefined()
    expect(event.data.data()).toEqual(data)
  })
})

describe('full options', () => {
  let event: functions.Event<DeltaDocumentSnapshot>
  const data = { name: 'hoge' }
  const previousData = { name: 'previous' }
  const params = { userID: '1' }
  const eventType = Rescue.EventType.Write
  const resource = 'projects/sandbox/..../users/1'
  beforeEach(() => {
    event = Rescue.event(ref, data, {
      previousData: previousData,
      params: params,
      eventType: eventType,
      resource: resource
    })
  })
  test('event created', () => {
    commonExpect(event)
    expect(event.eventType).toContain(eventType)
    expect(event.resource).toBe(resource)
    expect(event.params).toBe(params)
    expect(event.data.exists).toBe(true)
    expect(event.data.ref).toBe(ref)
    expect(event.data.id).toBe(ref.id)
    expect(event.data.previous.data()).toEqual(previousData)
    expect(event.data.data()).toEqual(data)
  })
})

describe('EventType.Create', () => {
  let event: functions.Event<DeltaDocumentSnapshot>
  const data = { name: 'hoge' }
  const previousData = undefined
  const params = { userID: '1' }
  const eventType = Rescue.EventType.Create
  const resource = 'projects/sandbox/..../users/1'
  beforeEach(() => {
    event = Rescue.event(ref, data, {
      previousData: previousData,
      params: params,
      eventType: eventType,
      resource: resource
    })
  })
  test('event created', () => {
    commonExpect(event)
    expect(event.eventType).toContain(eventType)
    expect(event.resource).toBe(resource)
    expect(event.params).toBe(params)
    expect(event.data.exists).toBe(true)
    expect(event.data.ref).toBe(ref)
    expect(event.data.id).toBe(ref.id)
    expect(event.data.previous).toBeUndefined()
    expect(event.data.data()).toEqual(data)
  })
})

describe('EventType.Delete', () => {
  let event: functions.Event<DeltaDocumentSnapshot>
  const data = { name: 'hoge' }
  const previousData = { name: 'pre'}
  const params = { userID: '1' }
  const eventType = Rescue.EventType.Delete
  const resource = 'projects/sandbox/..../users/1'
  beforeEach(() => {
    event = Rescue.event(ref, data, {
      previousData: previousData,
      params: params,
      eventType: eventType,
      resource: resource
    })
  })
  test('event created', () => {
    commonExpect(event)
    expect(event.eventType).toContain(eventType)
    expect(event.resource).toBe(resource)
    expect(event.params).toBe(params)
    expect(event.data.exists).toBe(false)
    expect(event.data.ref).toBe(ref)
    expect(event.data.id).toBe(ref.id)
    expect(event.data.previous.data()).toEqual(previousData)
    expect(event.data.data()).toBeUndefined()
  })
})

function commonExpect(event: functions.Event<DeltaDocumentSnapshot>) {
    expect(event.eventId).toBeDefined()
    expect(typeof event.eventId).toBe('string')
    expect(event.timestamp).toBeDefined()
    expect(typeof event.timestamp).toBe('string')
    expect(event.eventType).toBeDefined()
    expect(typeof event.eventType).toBe('string')
    expect(event.data.createTime).toBeDefined()
    expect(typeof event.data.createTime).toBe('string')
    expect(event.data.updateTime).toBeDefined()
    expect(typeof event.data.updateTime).toBe('string')
    expect(event.data.readTime).toBeUndefined()
    expect(event.data.get('')).toBeUndefined()
}
