/**
 * @format
 */

import SocketIO from 'socket.io-client'

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
export const socket = SocketIO('http://192.168.10.89:3000', {
  transports: ['websocket'],
  jsonp: false,
})

export const connect = () => {
  socket.connect()
}
