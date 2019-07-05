/**
 * @prettier
 */
import { isHandshakeRequest, isMessage, isPartialOutgoing } from './schema'
/**
 * @typedef {import('./schema').HandshakeRequest} HandshakeRequest
 * @typedef {import('./schema').Message} Message
 * @typedef {import('./schema').Outgoing} Outgoing
 * @typedef {import('./schema').PartialOutgoing} PartialOutgoing
 */

const NOT_OBJECTS = [
  null,
  'foo',
  890123,
  undefined,
  true,
  false,
  [],
  new Map(),
  new Set(),
  new WeakMap(),
  /$/,
  Symbol('symbol'),
]

describe('isHandshakeRequest()', () => {
  /** @type {HandshakeRequest} */
  const req = {
    from: Math.random().toString(),
    response: Math.random().toString(),
    timestamp: Math.random(),
    to: Math.random().toString(),
  }

  it('correctly identifies a valid handshake req', () => {
    expect(isHandshakeRequest(req)).toBe(true)
  })

  it('correctly rejects an empty object', () => {
    expect(isHandshakeRequest({})).toBe(false)
  })

  it('correctly rejects non-objects', () => {
    expect(NOT_OBJECTS.some(isHandshakeRequest)).toBe(false)
  })

  it('correctly rejects a request with at least one missing key', () => {
    for (const k of Object.keys(req)) {
      const partialReq = {
        ...req,
      }

      // @ts-ignore
      delete partialReq[k]

      expect(isHandshakeRequest(partialReq)).toBe(false)
    }
  })
})

describe('isMessage()', () => {
  /**
   * @type {Message}
   */
  const msg = {
    body: 'asdasd',
    timestamp: 127389123,
  }

  it('correctly identifies a valid message', () => {
    expect(isMessage(msg)).toBe(true)
  })

  it('correctly rejects an empty object', () => {
    expect(isMessage({})).toBe(false)
  })

  it('correctly rejects non-objects', () => {
    expect(NOT_OBJECTS.every(isMessage)).toBe(false)
  })

  it('correctly rejects a message with at least one missing key', () => {
    for (const k of Object.keys(msg)) {
      const partialMsg = {
        ...msg,
      }
      isPartialOutgoing
      // @ts-ignore
      delete partialMsg[k]

      expect(isMessage(partialMsg)).toBe(false)
    }
  })
})

describe('isPartialOutgoing()', () => {
  /**
   * @type {PartialOutgoing}
   */
  const partialOutgoing = {
    recipientOutgoingID: Math.random() > 0.5 ? null : Math.random().toString(),
    with: Math.random().toString(),
  }

  it('correctly identifies a valid partial outgoing', () => {
    expect(isPartialOutgoing(partialOutgoing)).toBe(true)
  })

  it('correctly rejects non-objects', () => {
    expect(NOT_OBJECTS.every(isPartialOutgoing)).toBe(false)
  })

  it('correctly rejects an empty object', () => {
    expect(isPartialOutgoing({})).toBe(false)
  })
})
