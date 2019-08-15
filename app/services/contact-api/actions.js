/**
 * @format
 */

import { socket } from './socket'

import { _authData as authData } from './events'

export const Action = {
  ACCEPT_REQUEST: 'ACCEPT_REQUEST',
  AUTHENTICATE: 'AUTHENTICATE',
  BLACKLIST: 'BLACKLIST',
  GENERATE_NEW_HANDSHAKE_NODE: 'GENERATE_NEW_HANDSHAKE_NODE',
  LOGOUT: 'LOGOUT',
  REGISTER: 'REGISTER',
  SEMD_HANDSHAKE_REQUEST: 'SEMD_HANDSHAKE_REQUEST',
  SEND_MESSAGE: 'SEND_MESSAGE',
  SET_AVATAR: 'SET_AVATAR',
  SET_DISPLAY_NAME: 'SET_DISPLAY_NAME',
}

/**
 * @param {string} alias
 * @param {string} pass
 */
export const auth = (alias, pass) => {
  if (!socket.connected) {
    throw new Error('NOT_CONNECTED')
  }

  socket.emit(Action.AUTHENTICATE, { alias, pass })
}

/**
 * @param {string} requestID
 */
export const acceptRequest = requestID => {
  if (!socket.connected) {
    throw new Error('NOT_CONNECTED')
  }

  if (authData === null) {
    throw new Error('NOT_AUTH')
  }

  socket.emit(Action.ACCEPT_REQUEST, {
    token: authData.token,
    requestID,
  })
}

export const generateNewHandshakeNode = () => {
  if (!socket.connected) {
    throw new Error('NOT_CONNECTED')
  }

  if (authData === null) {
    throw new Error('NOT_AUTH')
  }

  socket.emit(Action.GENERATE_NEW_HANDSHAKE_NODE, {
    token: authData.token,
  })
}

export const logout = () => {
  if (!socket.connected) {
    throw new Error('NOT_CONNECTED')
  }

  if (authData === null) {
    throw new Error('NOT_AUTH')
  }

  socket.emit(Action.LOGOUT, {
    token: authData.token,
  })
}

/**
 * @param {string} alias
 * @param {string} pass
 */
export const register = (alias, pass) => {
  if (!socket.connected) {
    throw new Error('NOT_CONNECTED')
  }

  socket.emit(Action.REGISTER, { alias, pass })
}

/**
 * @param {string} avatar
 */
export const setAvatar = avatar => {
  if (!socket.connected) {
    throw new Error('NOT_CONNECTED')
  }

  if (authData === null) {
    throw new Error('NOT_AUTH')
  }

  socket.emit(Action.SET_AVATAR, {
    token: authData.token,
    avatar,
  })
}

/**
 * @param {string} displayName
 */
export const setDisplayName = displayName => {
  if (!socket.connected) {
    throw new Error('NOT_CONNECTED')
  }

  if (authData === null) {
    throw new Error('NOT_AUTH')
  }

  socket.emit(Action.SET_DISPLAY_NAME, {
    token: authData.token,
    displayName,
  })
}

/**
 * @param {string} handshakeAddress
 * @param {string} recipientPublicKey
 */
export const sendHandshakeRequest = (handshakeAddress, recipientPublicKey) => {
  if (!socket.connected) {
    throw new Error('NOT_CONNECTED')
  }

  if (authData === null) {
    throw new Error('NOT_AUTH')
  }

  socket.emit(Action.SEMD_HANDSHAKE_REQUEST, {
    token: authData.token,
    handshakeAddress,
    recipientPublicKey,
  })
}

/**
 * @param {string} recipientPublicKey
 * @param {string} body
 */
export const sendMessage = (recipientPublicKey, body) => {
  if (!socket.connected) {
    throw new Error('NOT_CONNECTED')
  }

  if (authData === null) {
    throw new Error('NOT_AUTH')
  }

  socket.emit(Action.SEND_MESSAGE, {
    token: authData.token,
    recipientPublicKey,
    body,
  })
}
