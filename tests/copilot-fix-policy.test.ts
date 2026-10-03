import { describe, expect, it } from 'vitest'
import { nextFix, requestPrefix, type FixContext } from '../scripts/copilot-fix-policy'

const head = 'a'.repeat(40)
const context: FixContext = {
  open: true, draft: false, sameRepository: true, trustedAuthor: true, paused: false, head,
  reviews: [{ id: 10, author: 'copilot-pull-request-reviewer[bot]', state: 'COMMENTED', commit: head }],
  unresolvedReviewIds: [10], previousRequests: [],
}

describe('automatic Copilot repair policy', () => {
  it('requests a fix for unresolved findings on the current commit', () => {
    expect(nextFix(context)?.reviewId).toBe(10)
  })
  it.each([
    { open: false }, { draft: true }, { sameRepository: false },
    { trustedAuthor: false }, { paused: true }, { head: 'bad' },
    { unresolvedReviewIds: [] }, { reviews: [] },
  ])('does not dispatch for an ineligible PR: %j', (patch) => {
    expect(nextFix({ ...context, ...patch })).toBeNull()
  })
  it.each([
    { commit: 'b'.repeat(40) }, { author: 'someone-else' },
    { state: 'PENDING' }, { state: 'DISMISSED' }, { state: 'APPROVED' }, { id: NaN },
  ])('rejects stale, incomplete, or non-Copilot reviews: %j', (patch) => {
    expect(nextFix({ ...context, reviews: [{ ...context.reviews[0]!, ...patch }] })).toBeNull()
  })
  it('does not dispatch twice for the same review', () => {
    const marker = nextFix(context)!.marker
    expect(nextFix({ ...context, previousRequests: [marker + '\nrequest'] })).toBeNull()
  })
  it('caps attempts across commits', () => {
    expect(nextFix({ ...context, previousRequests: [1, 2, 3].map((id) => `${requestPrefix}${id}:old -->`) })).toBeNull()
  })
  it('does not act on old findings after a newer approval', () => {
    expect(nextFix({ ...context, reviews: [...context.reviews, { ...context.reviews[0]!, id: 11, state: 'APPROVED' }] })).toBeNull()
  })
})
