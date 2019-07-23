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
 * @typedef {import('./schema').Chat} Chat
 * @typedef {import('./schema').ChatMessage} ChatMessage
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
    .on((req, reqKey) => {
      if (!Schema.isHandshakeRequest(req)) {
        console.error('non-handshakerequest received')
        console.log(req)
        return
      }

      sentRequests[reqKey] = req

      cb(sentRequests)
    })
}

/**
 * Maps a sent request ID to the public key of the user it was sent to.
 * @param {(requestToUser: Record<string, string>) => void} cb
 * @param {UserGUNNode=} user Pass only for testing purposes.
 * @returns {void}
 */
export const __onSentRequestToUser = (cb, user = userGun) => {
  /** @type {Record<string, string>} */
  const requestToUser = {}

  if (!user.is) {
    throw new Error(ErrorCode.NOT_AUTH)
  }

  user
    .get(Key.REQUEST_TO_USER)
    .map()
    .on((userPK, requestKey) => {
      if (typeof userPK !== 'string') {
        console.error('got a non string value')
        return
      }

      if (userPK.length === 0) {
        console.error('got an empty string value')
        return
      }

      requestToUser[requestKey] = userPK

      cb(requestToUser)
    })
}

/**
 * @param {(userToOutgoing: Record<string, string>) => void} cb
 * @param {UserGUNNode=} user Pass only for testing purposes.
 * @returns {void}
 */
export const __onUserToIncoming = (cb, user = userGun) => {
  /** @type {Record<string, string>} */
  const userToOutgoing = {}

  user
    .get(Key.USER_TO_INCOMING)
    .map()
    .on((data, key) => {
      if (typeof data !== 'string') {
        console.error('got a non string value')
        return
      }

      if (data.length === 0) {
        console.error('got an empty string value')
        return
      }

      userToOutgoing[key] = data

      cb(userToOutgoing)
    })
}

/**
 * Massages all of the more primitive data structures into a more manageable
 * 'Chat' paradigm.
 * @param {(chats: Chat[]) => void} cb
 * @param {GUNNode} gun
 * @param {UserGUNNode} user
 * @returns {void}
 */
export const onChats = (cb, gun = origGun, user = userGun) => {
  /**
   * @type {Record<string, Chat>}
   */
  const recipientPKToChat = {}

  /**
   * Keep track of the users for which we already set up avatar listeners.
   * @type {string[]}
   */
  const usersWithAvatarListeners = []

  /**
   * Keep track of the users for which we already set up display name listeners.
   * @type {string[]}
   */
  const usersWithDisplayNameListeners = []

  /**
   * Keep track of the user for which we already set up incoming feed listeners.
   * @type {string[]}
   */
  const usersWithIncomingListeners = []

  const callCB = () => {
    // Only provide chats that have incoming listeners which would be contacts
    // that were actually accepted / are going on
    const chats = Object.values(recipientPKToChat).filter(chat =>
      usersWithIncomingListeners.includes(chat.recipientPublicKey),
    )

    // in case someone else elsewhere forgets about sorting
    chats.forEach(chat => {
      chat.messages = chat.messages
        .slice(0)
        .sort((a, b) => a.timestamp - b.timestamp)
    })

    cb(chats)
  }

  onOutgoing(outgoings => {
    for (const outgoing of Object.values(outgoings)) {
      const recipientPK = outgoing.with

      if (!recipientPKToChat[recipientPK]) {
        recipientPKToChat[recipientPK] = {
          messages: [],
          recipientAvatar: '',
          recipientDisplayName: recipientPK,
          recipientPublicKey: recipientPK,
        }
      }

      const messages = recipientPKToChat[recipientPK].messages

      for (const [msgK, msg] of Object.entries(outgoing.messages)) {
        if (!messages.find(m => m.id === msgK)) {
          messages.push({
            body: msg.body,
            id: msgK,
            outgoing: true,
            timestamp: msg.timestamp,
          })
        }
      }
    }

    callCB()
  }, user)

  __onUserToIncoming(uti => {
    for (const [recipientPK, incomingFeedID] of Object.entries(uti)) {
      if (!recipientPKToChat[recipientPK]) {
        recipientPKToChat[recipientPK] = {
          messages: [],
          recipientAvatar: '',
          recipientDisplayName: recipientPK,
          recipientPublicKey: recipientPK,
        }
      }

      const chat = recipientPKToChat[recipientPK]

      if (!usersWithIncomingListeners.includes(recipientPK)) {
        usersWithIncomingListeners.push(recipientPK)

        onIncomingMessages(
          msgs => {
            for (const [msgK, msg] of Object.entries(msgs)) {
              const messages = chat.messages

              if (!messages.find(m => m.id === msgK)) {
                messages.push({
                  body: msg.body,
                  id: msgK,
                  outgoing: false,
                  timestamp: msg.timestamp,
                })
              }
            }

            callCB()
          },
          recipientPK,
          incomingFeedID,
          gun,
        )
      }

      if (!usersWithAvatarListeners.includes(recipientPK)) {
        usersWithAvatarListeners.push(recipientPK)

        gun
          .user(recipientPK)
          .get(Key.PROFILE)
          .get(Key.AVATAR)
          .on(avatar => {
            if (typeof avatar === 'string') {
              chat.recipientAvatar = avatar
              callCB()
            }
          })
      }

      if (!usersWithDisplayNameListeners.includes(recipientPK)) {
        usersWithDisplayNameListeners.push(recipientPK)

        gun
          .user(recipientPK)
          .get(Key.PROFILE)
          .get(Key.DISPLAY_NAME)
          .on(displayName => {
            if (typeof displayName === 'string') {
              chat.recipientDisplayName = displayName
              callCB()
            }
          })
      }
    }
  }, user)
}
