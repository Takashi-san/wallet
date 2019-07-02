/**
 * @prettier
 */
/**
 * @typedef {import('../SimpleGUN').Callback} Callback
 * @typedef {import('../SimpleGUN').Data} Data
 * @typedef {import('../SimpleGUN').GUNNode} GUNNode
 * @typedef {import('../SimpleGUN').Listener} Listener
 * @typedef {import('../SimpleGUN').UserGUNNode} UserGUNNode
 * @typedef {import('../SimpleGUN').ValidDataValue} ValidDataValue
 * @typedef {import('../SimpleGUN').ListenerData} ListenerData
 * @typedef {import('../SimpleGUN').ListenerObj} ListenerObj
 * @typedef {import('../SimpleGUN').Soul} Soul
 */

/**
 * @typedef {object} Options
 * @prop {boolean=} isAuth If provided, the node will be pre-authenticated (that
 * is, the is prop will be an object, and it will have an string 'pub' prop).
 * @prop {boolean=} failUserAuth
 * @prop {boolean=} failUserCreation
 * @prop {(ValidDataValue | ValidDataValue[])=} initialData If it's an array
 * Random keys will be created for each item.
 * @prop {string=} key If provided, signals that this is not a root node, will
 * also be provided to listeners.
 */

/**
 * @typedef {Record<string, MockGun | boolean | number | string | null>} ObjectGraph
 * @typedef {boolean | number | string | ObjectGraph | null | undefined} Graph
 */

/**
 * @param {any} o
 * @returns {o is object}
 */
const isObject = o => typeof o === 'object' && o !== null

/**
 * @param {Graph} graph
 * @returns {graph is ObjectGraph}
 */
const graphIsObject = graph => typeof graph === 'object' && graph !== null

/**
 *
 * @param {any} data
 * @returns {data is ValidDataValue}
 */
const isValidGunData = data => {
  if (data === null) {
    return true
  }

  if (typeof data === 'undefined') {
    return false
  }

  if (Array.isArray(data)) {
    return false
  }

  if (typeof data === 'bigint') {
    return false
  }

  if (typeof data === 'function') {
    return false
  }

  if (typeof data === 'symbol') {
    return false
  }

  if (data instanceof Set) {
    return false
  }

  if (data instanceof Map) {
    return false
  }

  if (data instanceof WeakMap) {
    return false
  }

  return true
}

/**
 * @param {any} o
 * @returns {o is GUNNode}
 */
const isGunNode = o => {
  if (!isObject(o)) {
    return false
  }

  if (typeof o.get !== 'function') {
    return false
  }

  if (typeof o.on !== 'function') {
    return false
  }

  return true
}

/**
 * @param {Options=} opts
 * @returns {UserGUNNode}
 */
export const createMockGun = opts => new MockGun(opts)

export default class MockGun {
  /**
   * When set() as successfullly been called on this node, or when map() has
   * been called and the graph is undefined this property will be set to 'set'.
   * If put() has successfuly been called, this property will be set to
   * 'leaf'.
   * @type {'edge'|'leaf'|'set'|'undefined'}
   */
  nodeType = 'undefined'

  /**
   * @type {Graph}
   */
  graph = undefined

  /**
   * @type {Listener[]}
   */
  listeners = []

  /**
   * @type {Listener[]}
   */
  setListeners = []

  /**
   * @param {Options} opts
   */
  constructor({
    failUserAuth,
    failUserCreation,
    initialData,
    key,
    isAuth,
  } = {}) {
    this.key = key

    if (key && failUserAuth) {
      throw new Error('failUserAuth is meant to be used on root nodes only')
    }

    if (key && failUserCreation) {
      throw new Error('failUserCreation is meant to be used on root nodes only')
    }

    if (key && isAuth) {
      throw new Error('isAuth is meant to be used on root nodes only')
    }

    this.failUserAuth = failUserAuth
    this.failUserCreation = failUserCreation
    this.isAuth = isAuth

    this.is = isAuth
      ? {
          pub: Math.random().toString(),
        }
      : undefined

    if (Array.isArray(initialData)) {
      for (const item of initialData) {
        this.set(item)
      }
    } else if (typeof initialData !== 'undefined') {
      this.put(initialData)
    }

    //https://github.com/Microsoft/TypeScript/issues/17498#issuecomment-399439654
    /**
     * Assert that this class correctly implements UserGUNNode.
     * @type {UserGUNNode}
     */
    const instance = this
    instance
  }

  /**
   * @returns {Soul}
   */
  get _() {
    return {
      get: this.key,
      put:
        typeof this.graph === 'object' && this.graph !== null
          ? { '#': this.key }
          : this.graph,
    }
  }

  _notifyListeners() {
    if (typeof this.key !== 'string') {
      throw new Error(
        'Internal error: tried to notify listeners from a root node',
      )
    }

    if (typeof this.graph === 'undefined') {
      return
    }

    if (this.nodeType === 'undefined') {
      throw new Error(
        "Assertion Error: MockGun.prototype._notifyListeners() shouldn't have been called if node type is undefined",
      )
    }

    this.listeners.forEach(cb => {
      this._graphToRegularListenerIfGraphExists(cb)
    })
  }

  /**
   *
   * @param {Listener} listener
   * @returns {void}
   */
  _graphToRegularListenerIfGraphExists(listener) {
    if (typeof this.key === 'undefined') {
      throw new Error()
    }

    if (typeof this.graph === 'undefined') {
      return
    }

    const listenerData = this._getListenerData()

    listener(listenerData, this.key)
  }

  /**
   * Provides the graph, expanded one layer down, to a set listener.
   * @param {Listener} listener
   * @returns {void}
   */
  _graphToSetListener(listener) {
    const graph = this.graph

    if (!graphIsObject(graph)) {
      throw new Error()
    }

    for (const [key, subGraph] of Object.entries(graph)) {
      if (subGraph instanceof MockGun) {
        subGraph._graphToRegularListenerIfGraphExists(listener)
      } else {
        listener(subGraph, key)
      }
    }
  }

  /**
   * @type {Listener}
   */
  _subNodeOn = (_, key) => {
    // we discriminate between set and leaf because we don't expect to use a
    // node as both in our app
    if (this.nodeType === 'set') {
      this.setListeners.forEach(cb => {
        const graph = this.graph

        if (!graphIsObject(graph)) {
          throw new Error('Assertion Error')
        }

        const subNode = (graph[key])

        if (!(subNode instanceof MockGun)) {
          throw new Error('Assertion Error')
        }

        subNode._graphToRegularListenerIfGraphExists(cb)
      })
    } else if (this.nodeType === 'leaf') {
      this._notifyListeners()
    }
  }

  /**
   * @returns {ListenerData}
   */
  _getListenerData() {
    const graph = this.graph

    if (typeof graph === 'undefined') {
      throw new Error()
    }

    if (graphIsObject(graph)) {
      if (typeof this.key === 'undefined') {
        throw new Error()
      }

      /**
       * @type {ListenerData}
       */
      const listenerData = {
        _: {
          '#': this.key,
        },
      }

      for (const [k, v] of Object.entries(graph)) {
        if (isGunNode(v)) {
          const gunNodeSoul = v._.get

          if (typeof gunNodeSoul !== 'string') {
            throw new Error('Assertion Error')
          }

          listenerData[k] = {
            '#': gunNodeSoul,
          }
        } else {
          listenerData[k] = v
        }
      }

      return listenerData
    } else {
      return graph
    }
  }

  /**
   * @param {string} _
   * @param {string} __
   * @param {Callback=} cb
   * @returns {void}
   */
  auth(_, __, cb) {
    if (this.failUserAuth) {
      cb &&
        cb({
          err: 'Failed authentication mock.',
        })
    } else {
      this.is = {
        pub: Math.random().toString(),
      }

      cb &&
        cb({
          err: undefined,
        })
    }
  }

  /**
   * @param {string} _
   * @param {string} __
   * @param {Callback=} cb
   * @returns {void}
   */
  create(_, __, cb) {
    if (this.failUserCreation) {
      cb &&
        cb({
          err: 'Failed user creation mock.',
        })
    } else {
      cb &&
        cb({
          err: undefined,
        })
    }
  }

  /**
   * @param {string} key
   * @returns {GUNNode}
   */
  get(key) {
    if (typeof key !== 'string') {
      throw new TypeError()
    }

    if (
      typeof this.graph === 'boolean' ||
      typeof this.graph === 'number' ||
      typeof this.graph === 'string' ||
      this.graph === null
    ) {
      throw new Error('Tried to get a subkey of a primitive graph node')
    }

    if (typeof this.graph === 'undefined') {
      this.graph = {}
    }

    const subGraph = this.graph[key]

    if (subGraph instanceof MockGun) {
      return subGraph
    } else {
      const newNode = new MockGun({
        initialData: subGraph,
        key,
      })

      newNode.on(this._subNodeOn)

      this.graph[key] = newNode

      return newNode
    }
  }

  leave() {
    this.is = undefined
  }

  /**
   * @returns {GUNNode}
   */
  map() {
    if (typeof this.key === 'undefined') {
      throw new Error()
    }

    if (this.nodeType === 'leaf') {
      throw new Error(
        'Tried to call map() on a node already determined to be used as a leaf node',
      )
    }

    if (isObject(this.graph) || typeof this.graph === 'undefined') {
      this.nodeType = 'set'

      const surrogate = {
        /** @type {GUNNode['on']} */
        on: cb => {
          if (typeof this.graph !== 'undefined') {
            this._graphToSetListener(cb)
          }

          this.setListeners.push(cb)
        },
      }

      // we ignore the typings, let other code fail/crash if it tries to access
      // missing functions which shouldn't actually been accessed after calling
      // map() on a node.
      // @ts-ignore
      return surrogate
    } else {
      throw new Error()
    }
  }

  /**
   * @returns {void}
   */
  off() {
    if (typeof this.key === 'undefined') {
      throw new Error()
    }

    this.listeners.splice(0, this.listeners.length)
  }

  /**
   * @param {Listener} cb
   * @returns {void}
   */
  on(cb) {
    if (typeof this.key === 'undefined') {
      throw new Error()
    }

    this._graphToRegularListenerIfGraphExists(cb)

    this.listeners.push(cb)
  }

  /**
   * @param {Listener=} cb
   * @returns {GUNNode}
   */
  once(cb) {
    if (typeof this.key === 'undefined') {
      throw new Error()
    }

    if (cb) {
      this._graphToRegularListenerIfGraphExists(cb)

      // @ts-ignore
      return {}
    } else {
      if (this.nodeType === 'leaf') {
        throw new Error(
          'Tried to call once() without a cb on a leaf node, calling once() without a cb is most commonly used on set nodes.',
        )
      }

      // this behaviour conforms to this node being used as a set
      this.nodeType === 'set'

      // we ignore the typings, let other code fail/crash if it tries to access
      // missing functions which shouldn't actually been accessed when using the
      // return value of once() without a callback on our app
      // @ts-ignore
      return {
        // @ts-ignore
        map: () => {
          return {
            // once().map().once(cb) gets the items list once, gets each of
            // those items only once (not added ones).
            once: cb => {
              if (cb) {
                this._graphToSetListener(cb)
              } else {
                throw new ReferenceError(
                  'A callback should be provided when calling once().map().once()',
                )
              }
            },
          }
        },
      }
    }
  }

  /**
   *
   * @param {ValidDataValue} newData
   * @param {Callback=} cb
   */
  put(newData, cb) {
    // TODO; Data saved to the root level of the graph must be a node (an
    // object), not a string of "{ a: 4 }"!
    const isRootNode = typeof this.key === 'undefined'
    if (isRootNode) {
      throw new Error()
    }

    if (this.nodeType === 'set') {
      throw new Error()
    }

    if (newData instanceof MockGun) {
      throw new TypeError('No Edges for now')
    }

    if (!isValidGunData(newData)) {
      throw new TypeError()
    }

    // TODO: coallesce sub-graph puts/ roll backs

    if (isObject(newData)) {
      const data = /** @type {Data} */ (newData)
      const numPuts = Object.keys(data).length

      if (!isObject(this.graph)) {
        this.graph = {}
      }

      const graph = /** @type {ObjectGraph} */ (this.graph)

      /** @type {string|undefined} */
      let err
      let completedSubPuts = 0

      if (Object.keys(data).length === 0) {
        throw new Error()
      }

      this.nodeType = 'leaf'

      for (const [k, subData] of Object.entries(data)) {
        const subGraph = graph[k]

        if (isGunNode(subGraph)) {
          subGraph.put(subData, ack => {
            if (ack.err) {
              console.error(ack)
            }

            completedSubPuts++
            if (completedSubPuts === numPuts) {
              // Warning: gun behaviour is to call listeners before the callback
              this._notifyListeners()
              cb && cb({ err })
            }
          })
        } else {
          if (isObject(subData)) {
            const subNode = new MockGun({
              initialData: subData,
              key: k,
            })

            subNode.on(this._subNodeOn)

            graph[k] = subNode
          } else {
            graph[k] = subData
          }
          completedSubPuts++

          if (completedSubPuts === numPuts) {
            // Warning: gun behaviour is to call listeners before the callback
            this._notifyListeners()
            cb && cb({ err })
          }
        }
      }
    } else {
      this.nodeType = 'leaf'
      this.graph = newData
      // Warning: gun behaviour is to call listeners before the callback
      this._notifyListeners()
      cb && cb({ err: undefined })
    }
  }

  /**
   * @param {ValidDataValue} newItem
   * @param {Callback=} cb
   * @returns {GUNNode}
   */
  set(newItem, cb) {
    if (typeof this.key === 'undefined') {
      throw new Error()
    }

    if (isGunNode(newItem)) {
      throw new TypeError('No edges for now')
    }

    if (!isValidGunData(newItem)) {
      throw new TypeError()
    }

    if (this.nodeType === 'leaf') {
      throw new Error()
    }

    if (typeof this.graph === 'undefined') {
      this.graph = {}
    }

    const graph = this.graph

    if (graphIsObject(graph)) {
      const key = Math.random().toString()

      const newSubNode = new MockGun({
        initialData: newItem,
        key,
      })

      graph[key] = newSubNode

      this.nodeType = 'set'

      // Warning: gun behaviour is to call listeners before the callback
      newSubNode.on(this._subNodeOn)
      setImmediate(() => {
        cb && cb({ err: undefined })
      })

      return newSubNode
    } else {
      throw new Error('Tried to call set() on a primitive-graph node')
    }
  }

  /**
   * @returns {UserGUNNode}
   */
  user() {
    return this
  }
}
