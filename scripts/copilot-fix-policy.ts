export type Review = Readonly<{
  id: number
  author: string
  state: string
  commit: string
}>

export type FixContext = Readonly<{
  open: boolean
  draft: boolean
  sameRepository: boolean
  trustedAuthor: boolean
  paused: boolean
  head: string
  reviews: readonly Review[]
  unresolvedReviewIds: readonly number[]
  previousRequests: readonly string[]
}>

export const requestPrefix = '<!-- copilot-auto-fix:'

// This limit is per PR, not per commit: an unsuccessful fixer cannot reset it
// by pushing another commit. A human can continue the work explicitly.
export function nextFix(context: FixContext): Readonly<{ reviewId: number; marker: string }> | null {
  if (!context.open || context.draft || !context.sameRepository || !context.trustedAuthor || context.paused)
    return null
  if (!/^[a-f0-9]{40}$/.test(context.head)) return null
  const attempts = context.previousRequests.filter((body) => body.startsWith(requestPrefix))
  if (attempts.length >= 3) return null
  const latest = context.reviews
    .filter((review) => review.author === 'copilot-pull-request-reviewer[bot]'
      && review.commit === context.head && Number.isSafeInteger(review.id) && review.id > 0
      && ['COMMENTED', 'CHANGES_REQUESTED', 'APPROVED'].includes(review.state))
    .reduce<Review | undefined>((last, review) => !last || review.id > last.id ? review : last, undefined)
  // Re-reviews can keep findings in existing threads instead of posting new
  // comments. Include those threads, but only after a review of the current head.
  const hasFindings = context.reviews.some((review) =>
    review.author === 'copilot-pull-request-reviewer[bot]'
    && ['COMMENTED', 'CHANGES_REQUESTED'].includes(review.state)
    && context.unresolvedReviewIds.includes(review.id))
  if (!latest || latest.state === 'APPROVED' || !hasFindings) return null
  const marker = `${requestPrefix}${latest.id}:${context.head} -->`
  if (attempts.some((body) => body.startsWith(marker))) return null
  return { reviewId: latest.id, marker }
}
