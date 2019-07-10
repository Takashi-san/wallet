/**
 * @prettier
 */
// @ts-ignore
import Gun from 'gun/gun'

// @ts-ignore
const runningInJest = process.env.JEST_WORKER_ID !== undefined

if (!runningInJest) {
  // @ts-ignore
  require('gun/sea')
}

/**
 * @type {import('./SimpleGUN').GUNNode}
 */
// @ts-ignore force cast
export const gun = Gun('http://localhost:8080/gun')

/**
 * @type {import('./SimpleGUN').UserGUNNode}
 */
// @ts-ignore
export const user = runningInJest ? null : gun.user()
