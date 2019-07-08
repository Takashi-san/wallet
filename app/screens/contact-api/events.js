/**
 * @prettier
 */
import * as ErrorCode from './errorCode'
import * as Key from './key'
import { gun as origGun, user as userGun } from './gun'
import * as Schema from './schema'
/**
 * @typedef {import('./SimpleGUN').UserGUNNode} UserGUNNode
 * @typedef {import('./SimpleGUN').GUNNode} GUNNode
 * @typedef {import('./schema').HandshakeRequest} HandshakeRequest
 * @typedef {import('./schema').Message} Message
 * @typedef {import('./schema').Outgoing} Outgoing
 * @typedef {import('./schema').PartialOutgoing} PartialOutgoing
 */

/**
 * @param {(displayName: string|null) => void} cb
 * @param {UserGUNNode=} user Pass only for testing purposes.
 * @throws {Error} If user hasn't been auth.
 * @returns {void}
 */
export const onDisplayName = (cb, user = userGun) => {
  if (!user.is) {
    throw new Error(ErrorCode.NOT_AUTH)
  }

  const u = /** @type {UserGUNNode} */ (user)

  u.get(Key.PROFILE)
    .get(Key.DISPLAY_NAME)
    .on(displayName => {
      if (typeof displayName === 'string' || displayName === null) {
        cb(displayName)
      }
    })
}

/**
 * @param {(displayName: string|null) => void} cb
 * @param {UserGUNNode=} user Pass only for testing purposes.
 * @throws {Error} If user hasn't been auth.
 * @returns {void}
 */
export const onAvatar = (cb, user = userGun) => {
  if (!user.is) {
    throw new Error(ErrorCode.NOT_AUTH)
  }

  const u = /** @type {UserGUNNode} */ (user)

  u.get(Key.PROFILE)
    .get(Key.AVATAR)
    .on(avatar => {
      if (typeof avatar === 'string' || avatar === null) {
        cb(avatar)
      }
    })
}

/**
 *
 * @param {string} outgoingKey
 * @param {(message: Message, key: string) => void} cb
 * @param {UserGUNNode} user
 * @returns {void}
 */
const __onOutgoingMessage = (outgoingKey, cb, user) => {
  if (!user.is) {
    throw new Error(ErrorCode.NOT_AUTH)
  }

  user
    .get(Key.OUTGOINGS)
    .get(outgoingKey)
    .get(Key.MESSAGES)
    .map()
    .on((data, key) => {
      if (Schema.isMessage(data)) {
        cb(data, key)
      }
    })
}

/**
 * @param {(messages: Record<string, Message>) => void} cb
 * @param {string} userPK Public key of the user from whom the incoming
 * messages will be obtained.
 * @param {string} outgoingFeedID ID of the outgoing feed from which the
 * incoming messages will be obtained.
 * @param {GUNNode=} gun (Pass only for testing purposes)
 * @returns {void}
 */
export const onIncomingMessages = (
  cb,
  userPK,
  outgoingFeedID,
  gun = origGun,
) => {
  const user = gun.user(userPK)

  /**
   * @type {Record<string, Message>}
   */
  const messages = {}

  user
    .get(Key.OUTGOINGS)
    .get(outgoingFeedID)
    .get(Key.MESSAGES)
    .map()
    .on((data, key) => {
      if (!Schema.isMessage(data)) {
        console.warn('non-message received')
        return
      }

      const msg = data

      messages[key] = msg

      cb(messages)
    })
}

/**
 *
 * @param {(outgoings: Record<string, Outgoing>) => void} cb
 * @param {UserGUNNode} user
 * @param {typeof __onOutgoingMessage} onOutgoingMessage
 */
export const onOutgoing = (
  cb,
  user = userGun,
  onOutgoingMessage = __onOutgoingMessage,
) => {
  if (!user.is) {
    throw new Error(ErrorCode.NOT_AUTH)
  }

  /**
   * @type {Record<string, Outgoing>}
   */
  const outgoings = {}

  /**
   * @type {string[]}
   */
  const outgoingsWithMessageListeners = []

  const u = /** @type {UserGUNNode} */ (user)

  u.get(Key.OUTGOINGS)
    .map()
    .on((data, key) => {
      if (!Schema.isPartialOutgoing(data)) {
        console.warn('not partial outgoing')
        console.warn(JSON.stringify(data))
        return
      }

      outgoings[key] = {
        messages: outgoings[key] ? outgoings[key].messages : {},
        recipientOutgoingID: data.recipientOutgoingID,
        with: data.with,
      }

      if (!outgoingsWithMessageListeners.includes(key)) {
        outgoingsWithMessageListeners.push(key)

        onOutgoingMessage(
          key,
          (msg, msgKey) => {
            outgoings[key].messages = {
              ...outgoings[key].messages,
              [msgKey]: msg,
            }

            cb(outgoings)
          },
          user,
        )
      }

      cb(outgoings)
    })
}

/**
 * @param {(blacklist: string[]) => void} cb
 * @param {UserGUNNode} user
 * @returns {void}
 */
export const onBlacklist = (cb, user = userGun) => {
  /** @type {string[]} */
  const blacklist = []

  if (!user.is) {
    throw new Error(ErrorCode.NOT_AUTH)
  }

  user
    .get(Key.BLACKLIST)
    .map()
    .on(publicKey => {
      if (typeof publicKey === 'string' && publicKey.length > 0) {
        blacklist.push(publicKey)
        cb(blacklist)
      } else {
        console.warn('Invalid public key received for blacklist')
      }
    })
}

/**
 * @param {(currentHandshakeNode: Record<string, HandshakeRequest>|null) => void} cb
 * @param {UserGUNNode=} user Pass only for testing purposes.
 * @returns {void}
 */
export const onCurrentHandshakeNode = (cb, user = userGun) => {
  if (!user.is) {
    throw new Error(ErrorCode.NOT_AUTH)
  }

  /**
   * @type {Record<string, HandshakeRequest>}
   */
  const handshakes = {}

  user.get(Key.CURRENT_HANDSHAKE_NODE).on(handshakeNode => {
    if (handshakeNode === null) {
      cb(null)
    } else {
      user
        .get(Key.CURRENT_HANDSHAKE_NODE)
        .once()
        .map()
        .once((handshakeReq, key) => {
          if (Schema.isHandshakeRequest(handshakeReq)) {
            handshakes[key] = handshakeReq
          }

          cb(handshakes)
        })
    }
  })
}

/**
 * @param {(sentRequests: Record<string, HandshakeRequest>) => void} cb
 * @param {UserGUNNode=} user Pass only for testing purposes.
 * @returns {void}
 */
export const onSentRequests = (cb, user = userGun) => {
  if (!user.is) {
    throw new Error(ErrorCode.NOT_AUTH)
  }

  /**
   * @type {Record<string, HandshakeRequest>}
   */
  const sentRequests = {}

  const u = /** @type {UserGUNNode} */ (user)

  u.get(Key.SENT_REQUESTS)
    .map()
    .on((data, key) => {
      if (Schema.isHandshakeRequest(data)) {
        sentRequests[key] = data

        cb(sentRequests)
      }
    })
}
