/**
 * @prettier
 */
import MockGun, { createMockGun } from './mock-gun'
/**
 * @typedef {import('../SimpleGUN').UserGUNNode} UserGUNNode
 * @typedef {import('../SimpleGUN').ValidDataValue} ValidDataValue
 */

describe('MockGun', () => {
  it("throws an error if calling most methods on it if it's the root node, this detects incorrect behaviour in calling code", () => {
    const gun = createMockGun()

    expect(() => {
      gun.set({ a: 4 })
    }).toThrow()

    expect(() => {
      gun.on(() => {})
    }).toThrow()

    expect(() => {
      gun.off()
    }).toThrow()

    expect(() => {
      gun.map()
    }).toThrow()

    expect(() => {
      gun.put(null)
    }).toThrow()
  })

  describe('provides a listener with the initial provided data', () => {
    it("when it's null", done => {
      expect.assertions(4)

      /** @type {null} */
      const initialData = null
      const hardKey = Math.random().toString()

      const gun = createMockGun({
        initialData,
        key: hardKey,
      })

      let calls = 0

      /**
       * @type {import('./mock-gun').Listener}
       */
      const listener = (data, key) => {
        expect(data).toEqual(initialData)
        expect(key).toEqual(hardKey)
        calls++
        if (calls === 2) {
          done()
        }
      }

      gun.on(listener)

      gun.once(listener)
    })

    it("when it's an string", done => {
      expect.assertions(4)

      /** @type {string} */
      const initialData = 'foo'
      const hardKey = Math.random().toString()

      const gun = createMockGun({
        initialData,
        key: hardKey,
      })

      let calls = 0

      /**
       * @type {import('./mock-gun').Listener}
       */
      const listener = (data, key) => {
        expect(data).toEqual(initialData)
        expect(key).toEqual(hardKey)
        calls++
        if (calls === 2) {
          done()
        }
      }

      gun.on(listener)

      gun.once(listener)
    })

    it("when it's an number", done => {
      expect.assertions(4)

      /** @type {number} */
      const initialData = Math.random()
      const hardKey = Math.random().toString()

      const gun = createMockGun({
        initialData,
        key: hardKey,
      })

      let calls = 0

      /**
       * @type {import('./mock-gun').Listener}
       */
      const listener = (data, key) => {
        expect(data).toEqual(initialData)
        expect(key).toEqual(hardKey)
        calls++
        if (calls === 2) {
          done()
        }
      }

      gun.on(listener)

      gun.once(listener)
    })

    it('when provided an array as initial data', done => {
      expect.assertions(1)

      const initialData = [
        { a: Math.random().toString() },
        { a: Math.random().toString() },
      ]

      const hardKey = Math.random().toString()

      const gun = createMockGun({
        initialData,
        key: hardKey,
      })

      let calls = 0

      /**
       * @type {Record<string, import('../SimpleGUN').ListenerData>}
       */
      const receivedData = {}

      /**
       * @type {import('./mock-gun').Listener}
       */
      const listener = (data, key) => {
        receivedData[key] = data

        calls++

        if (
          calls ===
          initialData.length * 2 /* account for both on() and once() */
        ) {
          const itemsReceived = Object.values(receivedData).map(item => ({
            // @ts-ignore
            a: item.a,
          }))

          expect(itemsReceived).toEqual(initialData)

          done()
        }
      }

      gun.map().on(listener)

      gun
        .once()
        .map()
        .once(listener)
    })
  })

  describe('authentication', () => {
    it('comes non-authenticated by default', () => {
      const gun = createMockGun()

      expect(gun.is).toBeUndefined()
    })

    it('comes pre-authenticated when told so', () => {
      const gun = createMockGun({
        isAuth: true,
      })

      expect(gun.is).toBeDefined()
    })

    it('authenticates', () => {
      expect.assertions(2)

      const gun = createMockGun()

      gun.auth(Math.random().toString(), Math.random().toString(), ack => {
        expect(ack.err).toBeUndefined()
      })

      expect(gun.is).toBeDefined()
    })

    it('authenticates and logoffs', () => {
      expect.assertions(3)

      const gun = createMockGun()

      gun.auth(Math.random().toString(), Math.random().toString(), ack => {
        expect(ack.err).toBeUndefined()
      })

      expect(gun.is).toBeDefined()

      gun.leave()

      expect(gun.is).toBeUndefined()
    })

    it('mocks creating an user', () => {
      expect.assertions(1)

      const gun = createMockGun()

      gun.create(Math.random().toString(), Math.random().toString(), ack => {
        expect(ack.err).toBeUndefined()
      })
    })
  })

  describe('get', () => {
    it('throws a TypeError if called without a key', () => {
      expect(() => {
        const gun = createMockGun()

        // @ts-ignore
        gun.get()
      }).toThrowError(TypeError)
    })

    it('returns a node', () => {
      const gun = createMockGun()

      const subNode = gun.get(Math.random().toString())

      const subSubNode = subNode.get(Math.random().toString())

      expect(subNode).toBeInstanceOf(MockGun)

      expect(subSubNode).toBeInstanceOf(MockGun)
    })

    it('returns a node containing string data that was placed to that part of the graph', done => {
      expect.assertions(1)

      const gun = createMockGun().get(Math.random().toString())

      const key = Math.random().toString()
      const value = Math.random().toString()

      gun.put(
        {
          [key]: value,
        },
        ack => {
          if (!ack.err) {
            gun.get(key).once(data => {
              expect(data).toEqual(value)
              done()
            })
          }
        },
      )
    })

    it('returns a node containing number data that was placed to that part of the graph', done => {
      expect.assertions(1)

      const gun = createMockGun().get(Math.random().toString())

      const key = Math.random().toString()
      const value = Math.random()

      gun.put(
        {
          [key]: value,
        },
        ack => {
          if (!ack.err) {
            gun.get(key).once(data => {
              expect(data).toEqual(value)
              done()
            })
          }
        },
      )
    })

    it('returns a node containing boolean data that was placed to that part of the graph', done => {
      expect.assertions(1)

      const gun = createMockGun().get(Math.random().toString())

      const key = Math.random().toString()
      const value = Math.random() > 0.5

      gun.put(
        {
          [key]: value,
        },
        ack => {
          if (!ack.err) {
            gun.get(key).once(data => {
              expect(data).toEqual(value)
              done()
            })
          }
        },
      )
    })

    it('returns a node containing null data that was placed to that part of the graph', done => {
      expect.assertions(1)

      const gun = createMockGun().get(Math.random().toString())

      const key = Math.random().toString()
      /**
       * @type {null}
       */
      const value = null

      gun.put(
        {
          [key]: value,
        },
        ack => {
          if (!ack.err) {
            gun.get(key).once(data => {
              expect(data).toEqual(value)
              done()
            })
          }
        },
      )
    })

    it('returns a node containing object data that was placed to that part of the graph', done => {
      expect.assertions(1)

      const gun = createMockGun().get(Math.random().toString())

      const key = Math.random().toString()

      const value = {
        [Math.random().toString()]: Math.random().toString(),
      }

      gun.put(
        {
          [key]: value,
        },
        ack => {
          if (!ack.err) {
            gun.get(key).once(data => {
              expect(data).toEqual({
                ...value,
                _: {
                  '#': key,
                },
              })

              done()
            })
          }
        },
      )
    })

    it('throws an error when, a node has been previously used as a primitive-containing node', done => {
      expect.assertions(1)

      const gun = createMockGun().get(Math.random().toString())

      gun.put(null, ack => {
        if (!ack.err) {
          expect(() => {
            gun.get(Math.random().toString())
          }).toThrow()

          done()
        }
      })
    })
  })

  describe('map()', () => {
    it('throws when used on a root node', () => {
      expect(() => {
        const gun = createMockGun()

        gun.map()
      }).toThrow()
    })

    it('throws if it was already determined that the node is being used as a leaf node and not a set node', done => {
      expect.assertions(1)

      const gun = createMockGun().get(Math.random().toString())

      // the node is being used as a leaf node
      gun.put(
        {
          [Math.random().toString()]: Math.random().toString(),
        },
        ack => {
          if (!ack.err) {
            expect(() => {
              gun.map()
            }).toThrow()
            done()
          }
        },
      )
    })

    describe('map().on()', () => {
      it('calls the listener with existing data', done => {
        expect.assertions(1)

        const gun = createMockGun().get(Math.random().toString())

        const key = Math.random().toString()
        const value = Math.random().toString()

        const item = {
          [key]: value,
        }

        gun.set(item, ack => {
          if (!ack.err) {
            gun.map().on(itemReceived => {
              expect({
                // @ts-ignore Let it crash if not an object
                ...itemReceived,
                _: undefined,
              }).toEqual(item)
              done()
            })
          }
        })
      })

      it("provides a listener with data as it's added", () => {
        const items = [
          {
            [Math.random().toString()]: Math.random(),
          },
          {
            [Math.random().toString()]: Math.random(),
          },
          {
            [Math.random().toString()]: Math.random(),
          },
        ]

        expect.assertions(items.length)

        const gun = createMockGun().get(Math.random().toString())

        gun.map().on(itemReceived => {
          const itemWithoutSoul = {
            // @ts-ignore Let it crash if not an object
            ...itemReceived,
          }

          delete itemWithoutSoul['_']

          expect(items).toContainEqual(itemWithoutSoul)
        })

        items.forEach(item => {
          gun.set(item, ack => {
            ack.err && console.warn(ack.err)
          })
        })
      })
    })
  })

  describe('off()', () => {
    it('removes listeners', () => {
      expect.assertions(2)

      const spy = jest.fn()
      const anotherSpy = jest.fn()

      const gun = createMockGun().get(Math.random().toString())

      gun.on(spy)
      gun.on(anotherSpy)

      gun.off()

      gun.on(anotherSpy)

      gun.put({
        [Math.random().toString()]: Math.random() > 0.5,
      })

      expect(spy).toHaveBeenCalledTimes(0)
      expect(anotherSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('on()', () => {
    it('provides the listener with existing data', done => {
      expect.assertions(1)

      const gun = createMockGun().get(Math.random().toString())

      const data = {
        [Math.random().toString()]: Math.random() > 0.5,
      }

      const spy = jest.fn(dataReceived => {
        expect({
          ...dataReceived,
          _: undefined,
        }).toEqual(data)
        done()
      })

      gun.put(data, ack => {
        if (!ack.err) {
          gun.on(spy)
        }
      })
    })

    it("provides the listener with data as it's written to the node ", () => {
      const gun = createMockGun().get(Math.random().toString())

      const key = Math.random().toString()
      const puts = [
        {
          [key]: Math.random().toString(),
        },
        {
          [key]: Math.random().toString(),
        },
        {
          [key]: 'LAST_VALUE',
        },
      ]

      expect.assertions(puts.length)

      /**
       * @param {object} item
       */
      const spy = item => {
        expect(puts).toContainEqual({
          ...item,
          _: undefined,
        })
      }

      gun.on(spy)

      puts.forEach(put => {
        gun.put(put)
      })
    })
  })

  describe('once()', () => {
    it('provides the callback with existing data', done => {
      expect.assertions(1)

      const gun = createMockGun().get(Math.random().toString())

      const data = {
        [Math.random().toString()]: Math.random() > 0.5,
      }

      const spy = jest.fn(dataReceived => {
        expect({
          ...dataReceived,
          _: undefined,
        }).toEqual(data)
        done()
      })

      gun.put(data, ack => {
        if (!ack.err) {
          gun.once(spy)
        }
      })
    })

    it("does NOT provides the listener with data as it's written to the node", done => {
      expect.assertions(1)
      const gun = createMockGun().get(Math.random().toString())

      const key = Math.random().toString()
      const puts = [
        {
          [key]: Math.random().toString(),
        },
        {
          [key]: Math.random().toString(),
        },
        {
          [key]: 'LAST_VALUE',
        },
      ]

      /**
       * @param {object} item
       */
      const spy = jest.fn()

      let putCount = 0

      gun.once(spy)

      puts.forEach(put => {
        gun.put(put, ack => {
          if (!ack.err) {
            putCount++

            if (putCount === puts.length) {
              expect(spy).toHaveBeenCalledTimes(0)
              done()
            }
          }
        })
      })
    })

    describe('once().map().once()', () => {
      it('gives the callback all existing items on a set', done => {
        const items = [
          {
            [Math.random().toString()]: Math.random(),
          },
          {
            [Math.random().toString()]: Math.random(),
          },
          {
            [Math.random().toString()]: Math.random(),
          },
        ]

        expect.assertions(items.length)

        const gun = createMockGun().get(Math.random().toString())

        let successfulSets = 0

        items.forEach(item => {
          gun.set(item, ack => {
            if (!ack.err) {
              successfulSets++
            }

            if (successfulSets === items.length) {
              gun
                .once()
                .map()
                .once(item => {
                  expect(items).toContainEqual({
                    // @ts-ignore Let it fail if not an object
                    ...item,
                    _: undefined,
                  })

                  successfulSets--

                  if (successfulSets === 0) {
                    done()
                  }
                })
            }
          })
        })
      })
    })
  })

  describe('put()', () => {
    it('throws an error if the node was already determined as being used as a set', done => {
      expect.assertions(1)

      const gun = createMockGun().get(Math.random().toString())

      gun.set(
        {
          [Math.random.toString()]: Math.random(),
        },
        ack => {
          if (!ack.err) {
            expect(() => {
              gun.put({
                [Math.random.toString()]: Math.random(),
              })
            }).toThrow()
            done()
          }
        },
      )
    })

    it('accepts edges', () => {
      const gun = createMockGun().get(Math.random().toString())

      const anotherNode = createMockGun().get(Math.random().toString())

      gun.put(anotherNode)
    })

    it('throws on invalid data', () => {
      const gun = createMockGun().get(Math.random().toString())

      expect(() => {
        // @ts-ignore
        gun.put(new Set())
      }).toThrow()

      expect(() => {
        // @ts-ignore
        gun.put({})
      }).toThrow()

      expect(() => {
        // @ts-ignore
        gun.put(undefined)
      }).toThrow()

      expect(() => {
        // @ts-ignore
        gun.put([])
      }).toThrow()
    })

    it('writes object data, as detected by a once() call', done => {
      expect.assertions(1)
      const gun = createMockGun().get(Math.random().toString())

      const key = Math.random().toString()
      const value = Math.random().toString()

      const data = {
        [key]: value,
      }

      gun.put(data, ack => {
        if (!ack.err) {
          gun.once(receivedData => {
            expect({
              // @ts-ignore If not an object let it explode
              ...receivedData,
              _: undefined,
            }).toEqual(data)
            done()
          })
        }
      })
    })

    it('throws on writing primitive data being written to the root of a (sub)node', () => {
      const gun = createMockGun().get(Math.random().toString())

      expect(() => {
        gun.put(Math.random())
      }).toThrow()
    })
  })

  describe('set()', () => {
    it('accepts edges', () => {
      const gun = createMockGun().get(Math.random().toString())

      const anotherNode = createMockGun().get(Math.random().toString())

      gun.set(anotherNode)
    })

    it('throws on invalid data', () => {
      const gun = createMockGun().get(Math.random().toString())

      expect(() => {
        // @ts-ignore
        gun.set(new Set())
      }).toThrow()

      expect(() => {
        // @ts-ignore
        gun.set({})
      }).toThrow()

      expect(() => {
        // @ts-ignore
        gun.set(undefined)
      }).toThrow()

      expect(() => {
        // @ts-ignore
        gun.set([])
      }).toThrow()
    })

    it('throws when the node was already determined to be a leaf node', done => {
      expect.assertions(1)

      const gun = createMockGun().get(Math.random().toString())

      gun.put(
        {
          [Math.random().toString()]: Math.random(),
        },
        ack => {
          if (!ack.err) {
            expect(() => {
              gun.set({
                [Math.random().toString()]: Math.random(),
              })
            }).toThrow()
            done()
          }
        },
      )
    })

    it('throws when the node was beign used as a primtivie', done => {
      expect.assertions(1)

      const gun = createMockGun().get(Math.random().toString())

      const key = Math.random().toString()
      const somePrimitiveVal = Math.random()

      gun.put(
        {
          [key]: somePrimitiveVal,
        },
        ack => {
          if (!ack.err) {
            expect(() => {
              gun.get(key).set({
                [Math.random().toString()]: Math.random(),
              })
            }).toThrow()
            done()
          }
        },
      )
    })
  })
})