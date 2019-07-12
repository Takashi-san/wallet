/**
 * @prettier
 */

// @ts-ignore
const runningInJest = process.env.JEST_WORKER_ID !== undefined

if (!runningInJest) {
  // @ts-ignore
  require('gun/sea')
}

/**
 * @type {import('./SimpleGUN').GUNNode}
 */
export let gun

if (runningInJest) {
  // @ts-ignore Let it crash if actually trying to access the real gun in jest
  gun = null
} else {
  // @ts-ignore force cast
  gun = require('gun/gun')()
}

/**
 * @type {import('./SimpleGUN').UserGUNNode}
 */
// @ts-ignore
export const user = runningInJest ? null : gun.user()
