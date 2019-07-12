/**
 * @prettier
 */
/**
 * @typedef {object} HandshakeRequest
 * @prop {string} from Public key of the requestor.
 * @prop {string} response Encrypted string where, if the recipient accepts the
 * request, his outgoing feed id will be put. Before that the sender's outgoing
 * feed ID will be placed here, encrypted so only the recipient can access it.
 * @prop {number} timestamp Unix time.
 */

/**
 * @typedef {object} Message
 * @prop {string} body
 * @prop {number} timestamp
 */

/**
 * @typedef {object} ChatMessage
 * @prop {string} body
 * @prop {string} id
 * @prop {boolean} outgoing True if the message is an outgoing message,
 * otherwise it is an incoming message.
 * @prop {number} timestamp
 */

/**
 * A simpler representation of a conversation between two users than the
 * outgoing/incoming feed paradigm. It combines both the outgoing and incoming
 * messages into one data structure plus metada about the chat.
 * @typedef {object} Chat
 * @prop {string} id
 * @prop {ChatMessage[]} messages Sorted from most recent to least recent.
 * @prop {string} recipientDisplayName
 * @prop {boolean} recipientHasAccepted True if the recipient still has not
 * accepted the request to chat.
 */

/**
 * @typedef {object} Outgoing
 * @prop {Record<string, Message>} messages
 * @prop {string} with Public key for whom the outgoing messages are intended.
 */

/**
 * @typedef {object} PartialOutgoing
 * @prop {string} with (Encrypted) Public key for whom the outgoing messages are
 * intended.
 */

/**
 * @param {any} o
 * @returns {o is HandshakeRequest}
 */
export const isHandshakeRequest = o => {
  if (typeof o !== 'object') {
    return false
  }

  if (o === null) {
    return false
  }

  const obj = /** @type {HandshakeRequest} */ (o)

  if (typeof obj.from !== 'string') {
    return false
  }

  if (typeof obj.response !== 'string') {
    return false
  }

  if (typeof obj.timestamp !== 'number') {
    return false
  }

  return true
}

/**
 * @param {any} o
 * @returns {o is Message}
 */
export const isMessage = o => {
  if (typeof o !== 'object') {
    return false
  }

  if (o === null) {
    return false
  }

  const obj = /** @type {Message} */ (o)

  return typeof obj.body === 'string' && typeof obj.timestamp === 'number'
}

/**
 * @param {any} o
 * @returns {o is PartialOutgoing}
 */
export const isPartialOutgoing = o => {
  if (typeof o !== 'object') {
    return false
  }

  if (o === null) {
    return false
  }

  const obj = /** @type {PartialOutgoing} */ (o)

  return typeof obj.with === 'string'
}

/**
 *
 * @param {any} o
 * @returns {o is Outgoing}
 */
export const isOutgoing = o => {
  if (typeof o !== 'object') {
    return false
  }

  if (o === null) {
    return false
  }

  const obj = /** @type {Outgoing} */ (o)

  const messagesAreMessages = Object.values(obj.messages).every(item =>
    isMessage(item),
  )

  return typeof obj.with === 'string' && messagesAreMessages
}
