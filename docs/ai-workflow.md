# AI review and repair

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

Native cloud-agent automations currently support private/internal repositories
only. For this public starter, automatic repair is the CLI session above, not an
always-running hosted service. A fully hosted repair runner would need separate
authentication and deployment. No access token is stored by this setup.

## Verification and limits

Run `actionlint` after workflow edits. Use a PR to verify that build and visual
execute, deploy skips, and a new push invalidates approval. Check the Actions
logs and actual review state: a skipped bot review or empty comments are not
proof of success. Check the deployed site separately after merge.

Sources: [Copilot PR commands](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/manage-pull-requests),
[review configuration](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review),
[cloud automations](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/create-automations).
