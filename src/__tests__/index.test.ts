import 'jest'
import * as Rescue from '../index'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { DeltaDocumentSnapshot } from 'firebase-functions/lib/providers/firestore'

describe('no options', () => {
  let event: functions.Event<DeltaDocumentSnapshot>
  const ref = admin.firestore().doc('user/1')
  const data = { name: 'hoge' }
  beforeEach(() => {
    event = Rescue.event(ref, data)
  })
  test('event created', () => {
    expect(event.eventId).toBeDefined()
    expect(typeof event.eventId).toBe('string')
    expect(event.timestamp).toBeDefined()
    expect(typeof event.timestamp).toBe('string')
    expect(event.eventType).toBeDefined()
    expect(typeof event.eventType).toBe('string')
    expect(event.eventType).toContain(Rescue.EventType.Create)
    expect(event.resource).toBeDefined()
    expect(typeof event.resource).toBe('string')
    expect(event.params).toBeUndefined()
    expect(event.data.exists).toBe(true)
    expect(event.data.ref).toBe(ref)
    expect(event.data.id).toBe(ref.id)
    expect(event.data.createTime).toBeDefined()
    expect(typeof event.data.createTime).toBe('string')
    expect(event.data.updateTime).toBeDefined()
    expect(typeof event.data.updateTime).toBe('string')
    expect(event.data.readTime).toBeUndefined()
    expect(event.data.previous).toBeUndefined()
    expect(event.data.data())
  })
})
