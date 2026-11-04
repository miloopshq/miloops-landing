# Parallel work

Several agents can work at once: each can get its own git worktree, overlaps are flagged before they collide, and real clashes become a suggested ticket. MILOOPS never merges, pushes or deletes branches.

## A workspace per task

Turn it on in [workspaces.json](/docs/workspaces-json/) (or **Settings → Workspaces**), or let an agent ask for one with `claim_ticket` `workspace: true`. Claiming then creates:

- a branch `miloops/<mission>/<n>` from the current `HEAD`;
- a worktree at `<repo parent>/<repo>.miloops/<mission>-<n>` by default.

The claim result returns `workspace: { path, branch, base }`, and the agent edits and commits only there. Claiming again reuses the same worktree. Checks, git evidence and the claim baseline for that ticket run in the worktree. When the ticket completes, the result and a ticket comment name the branch for you to review and merge.

Outside a git repo, or in a repo with no commits, the claim still succeeds and the result explains why there's no workspace (`workspaceNote`).

There is no cleanup button yet: remove old worktrees yourself (`git worktree remove <path>`).

## Overlap warnings

An agent can declare the files it expects to change with `claim_ticket` `touches` (path globs, up to 50). If another live claim declared overlapping files, the claim result has a `warnings` entry naming the other ticket, agent and paths, and an `overlap` item appears in [Waiting on you](/docs/waiting-on-you/).

Overlap errs on the side of warning:

- two plain paths overlap when they're equal;
- a plain path overlaps a glob that matches it;
- two globs overlap when one's fixed prefix lies inside the other's (`src/**` and `src/app/*.ts`).

The ticket inspector shows the declared files and the branch. To hold one of the claims, open it and use **Release to queue**.

## Integration check

Every 10 seconds (`$MILOOPS_INTEGRATION_POLL_MS`), MILOOPS compares `git diff --name-only <base>...<branch>` across active claims that have worktrees. When two branches changed the same files, an `integration` item lists them with **Add integration ticket**: a `task` titled "Bring together #a and #b", blocked by both tickets, listing the files. Nothing is created or merged automatically. Only active claims are compared; once a ticket closes, its branch drops out.

From the chat, `status` includes a `parallel` summary (workspaces, declared overlaps, changed-file clashes) when there's anything to report.
