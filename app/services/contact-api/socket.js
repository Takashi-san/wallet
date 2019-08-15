/**
 * @format
 */

import SocketIO from 'socket.io-client'

// @ts-ignore
const { SOCKET_PORT, SOCKET_URL } = require('../../../.config.json')

/**
 * @typedef {object} SimpleSocket
 * @prop {() => void} connect
 * @prop {boolean} connected
 * @prop {(eventName: string, data: any) => void} emit
 * @prop {(eventName: string, handler: (data: any) => void) => void} on
 */

/**
 * @private
 * @type {SimpleSocket}
 */
export const socket = SocketIO(`http://${SOCKET_URL}:${SOCKET_PORT}`, {
  transports: ['websocket'],
  jsonp: false,
})

export const connect = () => {
  socket.connect()
}
