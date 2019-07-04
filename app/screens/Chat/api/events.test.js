/**
 * @prettier
 */
import * as ErrorCode from './errorCode'
import * as Events from './events'
import * as Key from './key'
import { createMockGun } from './__mocks__/mock-gun'
/**
 * @typedef {import('./SimpleGUN').GUNNode} GUNNode
 * @typedef {import('./schema').HandshakeRequest} HandshakeRequest
 * @typedef {import('./schema').PartialOutgoing} PartialOutgoing
 * @typedef {import('./schema').Message} Message
 * @typedef {import('./SimpleGUN').UserGUNNode} UserGUNNode
 */

describe('onAvatar()', () => {
  it('throws a NOT_AUTH error if supplied with a non authenticated node', done => {
    const fakeGun = createMockGun()

    try {
      Events.onAvatar(() => {}, fakeGun)
    } catch (e) {
      expect(e.message).toBe(ErrorCode.NOT_AUTH)
      done()
    }
  })

  it('calls the on() prop on a gun instance holding an string value', done => {
    const initialValue = 'jakdljkasd'
    const fakeGun = createMockGun({
      isAuth: true,
    })

    const spy = jest.fn(() => {
      done()
    })

    fakeGun
      .get(Key.PROFILE)
      .get(Key.AVATAR)
      .put(initialValue, ack => {
        if (!ack.err) {
          Events.onAvatar(spy, fakeGun)

          expect(spy).toHaveBeenCalledWith(initialValue)
        }
      })
  })

  it('calls the on() prop on a gun instance holding a null value', done => {
    const initialValue = 'jakdljkasd'
    const fakeGun = createMockGun({
      isAuth: true,
    })

    const spy = jest.fn(() => {
      done()
    })

    fakeGun
      .get(Key.PROFILE)
      .get(Key.AVATAR)
      .put(initialValue, ack => {
        if (!ack.err) {
          Events.onAvatar(spy, fakeGun)

          expect(spy).toHaveBeenCalledWith(initialValue)
        }
      })
  })
})

describe('onBlacklist()', () => {
  it('throws a NOT_AUTH error if supplied with a non authenticated node', () => {
    const mockGun = createMockGun()

    try {
      Events.onBlacklist(() => {}, mockGun)
    } catch (e) {
      expect(e.message).toBe(ErrorCode.NOT_AUTH)
    }
  })

  // TODO: Find out if this test being sync can make it break further down the
  // lane if you tested it with an actual gun node (async)
  it('does NOT supply an empty array if there are no strings in the blacklist', () => {
    const mockGun = createMockGun({
      isAuth: true,
    })

    const spy = jest.fn()

    Events.onBlacklist(spy, mockGun)

    expect(spy).toHaveBeenCalledTimes(0)
  })

  it('supplies the listtener with blacklisted public keys when there are', done => {
    const items = [Math.random().toString(), Math.random().toString()]
    const [first, second] = items

    const mockGun = createMockGun({
      isAuth: true,
    })

    const blacklist = mockGun.get(Key.BLACKLIST)

    blacklist.set(first, ack => {
      if (!ack.err) {
        blacklist.set(second)
      }
    })

    let called = false

    /**
     * @param {any} data
     */
    const spy = data => {
      if (!called) {
        called = true
        return
      }
      expect(data).toEqual(items)
      done()
    }

    Events.onBlacklist(spy, mockGun)
  })
})

describe('onCurrentHandshakeNode()', () => {
  it('throws a NOT_AUTH error if supplied with a non authenticated node', done => {
    const fakeGun = createMockGun()

    try {
      Events.onCurrentHandshakeNode(() => {}, fakeGun)
    } catch (e) {
      expect(e.message).toBe(ErrorCode.NOT_AUTH)
      done()
    }
  })

  it('supplies null if the gun has this edge set to null', done => {
    expect.assertions(1)

    const fakeGun = createMockGun({
      isAuth: true,
    })

    fakeGun.get(Key.CURRENT_HANDSHAKE_NODE).put(null, ack => {
      if (!ack.err) {
        const spy = jest.fn(() => {
          done()
        })

        Events.onCurrentHandshakeNode(spy, fakeGun)

        expect(spy).toHaveBeenCalledWith(null)
      }
    })
  })

  it('supplies an empty object if the handshake node only contains an invalid\
      initialization item', done => {
    const fakeGun = createMockGun({
      isAuth: true,
    })

    fakeGun.get(Key.CURRENT_HANDSHAKE_NODE).set(
      {
        unused: 0,
      },
      ack => {
        if (!ack.err) {
          const spy = jest.fn(() => {
            done()
          })

          Events.onCurrentHandshakeNode(spy, fakeGun)

          expect(spy).toHaveBeenCalledWith({})
        }
      },
    )
  })

  it('calls the on() prop on a fake gun with valid data', done => {
    expect.assertions(1)

    /** @type {HandshakeRequest} */
    const someHandshakeRequest = {
      from: Math.random().toString(),
      requestorFeedID: Math.random().toString(),
      response: Math.random().toString(),
      timestamp: Math.random(),
      to: Math.random().toString(),
    }

    const fakeGun = createMockGun({
      isAuth: true,
    })

    const someHandshakeRequestNode = fakeGun
      .get(Key.CURRENT_HANDSHAKE_NODE)
      .set(someHandshakeRequest, ack => {
        if (ack.err) {
          console.error(ack.err)
        }
      })

    const key = /** @type {string} */ (someHandshakeRequestNode._.get)

    const spy = jest.fn(handshakes => {
      expect(handshakes).toEqual({
        [key]: {
          ...someHandshakeRequest,
          _: {
            '#': key,
          },
        },
      })

      done()
    })

    Events.onCurrentHandshakeNode(spy, fakeGun)
  })
})

describe('onDisplayName()', () => {
  it('throws a NOT_AUTH error if supplied with a non authenticated node', done => {
    const fakeGun = createMockGun()

    try {
      Events.onDisplayName(() => {}, fakeGun)
    } catch (e) {
      expect(e.message).toBe(ErrorCode.NOT_AUTH)
      done()
    }
  })

  it('calls the on() prop on a gun instance holding an string value', done => {
    const fakeGun = createMockGun({
      isAuth: true,
    })

    const initialValue = Math.random().toString()

    fakeGun
      .get(Key.PROFILE)
      .get(Key.DISPLAY_NAME)
      .put(initialValue)

    const spy = jest.fn(() => {
      done()
    })

    Events.onDisplayName(spy, fakeGun)

    expect(spy).toHaveBeenCalledWith(initialValue)
  })

  it('calls the on() prop on a gun instance holding a null value', done => {
    const fakeGun = createMockGun({
      isAuth: true,
    })

    fakeGun
      .get(Key.PROFILE)
      .get(Key.DISPLAY_NAME)
      .put(null)

    const spy = jest.fn(() => {
      done()
    })

    Events.onDisplayName(spy, fakeGun)

    expect(spy).toHaveBeenCalledWith(null)
  })
})

describe('onOutgoing()', () => {
  it('throws a NOT_AUTH error if supplied with a non authenticated node', done => {
    const fakeGun = createMockGun()

    try {
      Events.onOutgoing(() => {}, fakeGun)
    } catch (e) {
      expect(e.message).toBe(ErrorCode.NOT_AUTH)
      done()
    }
  })

  // TODO: Find out if this test being sync can make it break further down the
  // lane if you tested it with an actual gun node (async)
  it('does NOT supply an empty object if there are no outgoings', () => {
    const fakeGun = createMockGun({
      initialData: [],
      isAuth: true,
    })

    const spy = jest.fn()

    Events.onOutgoing(spy, fakeGun)

    expect(spy).toHaveBeenCalledTimes(0)
  })

  it("calls the listener when there's valid data", done => {
    const fakeOnOutgoingMessage = () => {}

    const fakeKey = Math.random().toString()

    const someOutgoings = [
      { with: Math.random().toString() },
      { with: Math.random().toString() },
    ]

    const fakeGun = createMockGun({
      isAuth: true,
    })

    const outgoingsNode = fakeGun.get(Key.OUTGOINGS)

    someOutgoings.forEach(io => {
      outgoingsNode.set(io)
    })

    const spy = jest.fn(() => {
      done()
    })

    Events.onOutgoing(spy, fakeGun, fakeOnOutgoingMessage)

    const [call] = spy.mock.calls
    // @ts-ignore
    const [data] = call

    expect(
      // @ts-ignore
      Object.values(data).every(og =>
        someOutgoings.some(og2 => og.with === og2.with),
      ),
    ).toBe(true)
  })

  it('supplies the listener with messages for an outgoing', () => {
    const gun = createMockGun({
      isAuth: true,
    })

    const outgoingsNode = gun.get(Key.OUTGOINGS)

    /** @type {Message} */
    const sampleMsg = {
      body: Math.random().toString(),
      timestamp: Math.random(),
    }

    /** @type {PartialOutgoing} */
    const sampleOutgoing = {
      with: Math.random().toString(),
    }

    const sampleOutgoingNode = outgoingsNode.set(sampleOutgoing)
    const key = /** @type {string} */ (sampleOutgoingNode._.get)

    sampleOutgoingNode.get(Key.MESSAGES).set(sampleMsg)

    Events.onOutgoing(outgoingsReceived => {
      const [outgoingReceived] = Object.values(outgoingsReceived)

      const [msgReceived] = Object.values(outgoingReceived.messages)

      expect({
        ...msgReceived,
        _: undefined,
      }).toEqual(sampleMsg)
    }, gun)
  })
})

describe('onSentRequests()', () => {
  it('throws a NOT_AUTH error if supplied with a non authenticated node', done => {
    const fakeGun = createMockGun()

    try {
      Events.onSentRequests(() => {}, fakeGun)
    } catch (e) {
      expect(e.message).toBe(ErrorCode.NOT_AUTH)
      done()
    }
  })

  // TODO: Find out if this test being sync can make it break further down the
  // lane if you tested it with an actual gun node (async)
  it('does NOT supply an empty object if there are no sent requests', () => {
    const spy = jest.fn()

    Events.onSentRequests(
      spy,
      createMockGun({
        initialData: [],
        isAuth: true,
      }),
    )

    expect(spy).toHaveBeenCalledTimes(0)
  })

  it("calls the listener when there's valid data", done => {
    /** @type {HandshakeRequest[]} */
    const someSentRequests = [
      {
        from: Math.random().toString(),
        requestorFeedID: Math.random().toString(),
        response: Math.random().toString(),
        timestamp: Math.random(),
        to: Math.random().toString(),
      },
      {
        from: Math.random().toString(),
        requestorFeedID: Math.random().toString(),
        response: Math.random().toString(),
        timestamp: Math.random(),
        to: Math.random().toString(),
      },
    ]

    expect.assertions(/* fibbonaci(someSentRequests.length) */ 3)

    const spy = jest.fn(sentRequests => {
      const items = Object.values(sentRequests)

      items.forEach(item => {
        expect(someSentRequests).toContainEqual({
          ...item,
          _: undefined,
        })
      })

      done()
    })

    const gun = createMockGun({
      isAuth: true,
    })

    someSentRequests.forEach(r => {
      gun.get(Key.SENT_REQUESTS).set(r)
    })

    Events.onSentRequests(spy, gun)
  })
})
