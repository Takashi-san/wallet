/**
 * @prettier
 */
// @ts-ignore
import Gun from 'gun/gun'
import 'gun/sea'

/**
 * @typedef {import('./SimpleGUN').GUNNode} GUNNode
 */

/**
 * @type {GUNNode}
 */
// @ts-ignore force cast
export const gun = Gun('http://localhost:8080/gun')

export const user = gun.user()
