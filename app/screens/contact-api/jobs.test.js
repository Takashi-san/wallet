/**
 * @prettier
 */
import * as Tasks from './jobs'
import { createMockGun } from './__mocks__/mock-gun'

describe('__onAcceptedRequests()', () => {
  it('throws a NOT_AUTH error if supplied with a non authenticated node', () => {
    expect(() => {
      Tasks.__onAcceptedRequests(() => {}, createMockGun())
    }).toThrow()
  })
})
