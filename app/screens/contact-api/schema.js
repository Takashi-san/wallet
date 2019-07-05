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
 * @prop {string} to Public key of the receiver of the handshake request. Used
 * by the requestor to know to which user's feed id (which the receiver will
 * write to the receiver of this handshake request) to subscribe.
 */

/**
 * @typedef {object} Message
 * @prop {string} body
 * @prop {number} timestamp
 */

/**
 * @typedef {object} Outgoing
 * @prop {Record<string, Message>} messages
 * @prop {string} with Public key for whom the outgoing messages are intended.
 * @prop {string|null} recipientOutgoingID Outgoing id of the recipient from
 * which to listen messages from.
 */

/**
 * @typedef {object} PartialOutgoing
 * @prop {string} with Public key for whom the outgoing messages are intended.
 * @prop {string|null} recipientOutgoingID Outgoing id of the recipient from
 * which to listen messages from.
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

  if (typeof obj.to !== 'string') {
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

  return (
    typeof obj.with === 'string' && typeof obj.recipientOutgoingID === 'string'
  )
}
