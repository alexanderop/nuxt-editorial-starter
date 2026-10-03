# Implement, review, fix, verify

Read AGENTS.md, README.md, docs/design-system.md, and docs/testing.md.
Use strict TypeScript, Nuxt, Vue Composition API, and pnpm. Preserve both
Node hosting and static hosting under a repository base path.

## Review independently

Review the actual base-to-head diff and surrounding code before reading other
reviewers' conclusions. Report concrete introduced regressions with file/line,
trigger, impact, and a reproducible test or code-level explanation. Prioritize
correctness, draft leaks, base-path errors, hydration, accessibility, semantic
tokens, and regression-test gaps. Distinguish evidence from speculation.

A skipped, failed, or incomplete review is not a passing review. State the
reviewed head SHA and remaining limitations. A green build is not visual proof.
Do not approve while actionable findings remain. Re-check fixes independently.

## Fix valid findings

For each finding, classify it as Act on, Consider, Noted, or Dismissed, with a
short reason. Deduplicate overlapping reports. Fix Act on findings on the PR
branch and add a behavioral regression test where useful. Do not blindly apply
suggestions. Leave uncertain findings unresolved and explain what is needed.
Do not resolve a thread merely because a fix was proposed; verify the fix first.

Run pnpm lint, pnpm typecheck, pnpm test, pnpm build, and pnpm test:e2e.
For deployment changes also run pnpm generate and node scripts/check-static.mjs
with a repository base path. Never build and run development concurrently.
Visual baselines are macOS Chromium: rely on the required macOS visual job
when working on Linux, and do not regenerate baselines on Linux.

Never weaken tests, disable lint rules, invent one-off tokens, expose drafts,
or change branch protection to obtain green checks. Never approve your own
implementation or use an administrator bypass. A new push requires fresh review
and successful checks. Stop after three unsuccessful fix passes and explain
the blocker rather than looping indefinitely.

GitHub enforces merge requirements. Enable auto-merge only for a ready PR;
never force a merge. Changes to workflows, review policy, dependencies, test
configuration, and visual baselines require the designated human code owner.
