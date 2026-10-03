# AI review and repair

## Automatic hosted fixes

`.github/workflows/copilot-auto-fix.yml` checks after Copilot review completes,
and every 15 minutes as a fallback. It sends a targeted `@copilot` request for
unresolved findings on the current commit. Copilot cloud agent then triages,
repairs, tests, and pushes to the PR branch; review-on-push requests a new review.
No local CLI session or manual mention is needed once this dispatcher is enabled.

The dispatcher runs only trusted default-branch code and never checks out or
executes PR code with its credential. It processes ready, same-repository PRs
authored by users with write access. Forks and external authors are skipped.
Bot-authored PRs are not included in this initial policy. It sends at most one
request per review and at most three requests per PR. Add `copilot-fix-paused`
to a PR, or set `COPILOT_AUTO_FIX_ENABLED` to `false`, to stop future requests.
Stopping the dispatcher does not cancel a Copilot session already started.

Activation requires a one-time credential setup after merging these files:

1. Create a fine-grained GitHub user token restricted to this repository, from
   a user with write access and an active Copilot plan. Grant only Pull requests
   read/write (Metadata read is included automatically). Do not grant Contents,
   Issues, or workflow permissions; the dispatcher only requests work.
2. Store it as the repository Actions secret `COPILOT_FIX_TOKEN` using GitHub's
   secrets UI or `gh secret set COPILOT_FIX_TOKEN` (interactive input). Never
   put the token in a PR, chat, source file, or command-line argument.
3. Set the Actions variable `COPILOT_AUTO_FIX_ENABLED` to `true`, then manually
   run **Dispatch Copilot fixes** once. Verify an eligible review produces one
   request and a **Copilot has started work** event. A second run must not
   duplicate the request. Missing credentials or API failures fail the job.
4. GitHub normally requires approval to run Actions after a cloud-agent push.
   To make the entire loop unattended, configure that behavior explicitly in
   **Settings → Copilot → Cloud agent**. Copilot approval counting is a separate
   setting; it does not activate repairs or approve workflow execution.

The credential and enable variable are not created by template files. Until
they are configured and a hosted run is verified, automatic dispatch is pending.
The default `GITHUB_TOKEN` is deliberately not used to post requests because
Copilot responds to users with write access, not arbitrary bot mentions.

## Optional local repair loop

Work on a feature branch. With GitHub Copilot CLI installed and signed in:

```sh
git switch -c fix/my-change
# Make the change, then start the repair/review loop:
pnpm pr:fix
# Or include GitHub auto-merge after all requirements pass:
pnpm pr:automerge
```

These launch Copilot's native `/pr auto` and `/pr automerge` commands in an
interactive session. Copilot creates a PR if needed, addresses review feedback,
resolves conflicts, fixes CI, and pushes repairs. Keep the session running.
Inspect or stop its schedule with `/every`. Tool permissions remain interactive;
the starter does not grant unrestricted shell access. `/pr automerge` enables
GitHub auto-merge; it does not override repository rules.

The cloud-agent alternative is **Fix with Copilot** on review findings, or an
`@copilot` PR comment from a user with write access asking it to fix the valid
findings. Cloud-agent pushes may require approval before Actions run. No
workflow posts bot mentions and pretends they start a supported fix session.

## Review contract

`.github/copilot-instructions.md` asks for independent, evidence-backed review,
lead triage (Act on / Consider / Noted / Dismissed), focused repairs, regression
tests, and verification of the resulting commit. This adopts pstack's review
discipline; it does not provision pstack's independent multi-model reviewers.
Prompt instructions are guidance, not executable security controls.

GitHub rules must require:

- `build`: lint, types, unit tests, production browser journeys (including
  hydration and accessibility), and static generation at a repository base path.
- `visual`: macOS Chromium comparisons against reviewed screenshots.
- One approval, with stale approvals dismissed on new pushes, and all review
  threads resolved. Automatic Copilot review is requested again on new pushes.
- Human code-owner review for automation, dependency/configuration changes,
  enforcement fixtures, and visual baselines. See `.github/CODEOWNERS`.

Only main-branch runs deploy. PR runs receive read-only permissions, never Pages
credentials. A missing review is not an approval. Required checks must come from
GitHub Actions and pass against the latest base. Copilot approval must be enabled
in GitHub settings before it can satisfy the approval requirement.

## Configure a repository created from this template

GitHub settings and rulesets do not travel with template files. Replace the
reviewer in `.github/CODEOWNERS`. Enable **Allow auto-merge** in General settings.
The two ruleset definitions are versioned in `.github/rulesets/`; import them
through GitHub's ruleset UI or its REST API. Review their administrator PR-only
bypass before importing. It is for deliberate human intervention, not agents.
Create an active default-branch ruleset with the checks and review requirements
above, prevent force pushes/deletion, and enable **Automatically request Copilot
code review → Review new pushes**. Enable draft reviews if desired.

In **Settings → Copilot → Code review**, choose Balanced effort, enable Copilot
approvals and allow them to count toward merge requirements. Limit counting
approvals to ordinary app/content paths; keep policy files under human review.
If you authored a protected-file PR yourself, ask another eligible human reviewer
or deliberately use the administrator's audited PR-only bypass. Agents must
never use that bypass.

Native cloud-agent Automations currently support private/internal repositories
only. The hosted dispatcher above is an ordinary GitHub Actions workflow using
the supported user-mention handoff, rather than that private-repository feature.
The token authenticates the request; Copilot runs its own cloud environment.

## Verification and limits

Run `actionlint` after workflow edits. Use a PR to verify that build and visual
execute, deploy skips, and a new push invalidates approval. Check the Actions
logs and actual review state: a skipped bot review or empty comments are not
proof of success. Check the deployed site separately after merge.

Sources: [Copilot PR commands](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/manage-pull-requests),
[review configuration](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review),
[cloud automations](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/create-automations).
