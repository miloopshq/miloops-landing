# Assumptions and replans

Missions write down what they assume; when an assumption breaks, an agent proposes a new plan, and nothing changes until you approve it.

## Assumptions

Assumptions live in the mission's `map.md` under `## Assumptions`, each with an id (`S-1`, `S-2`, …), a status and the tickets that depend on it:

| Status        | Meaning                                    |
| ------------- | ------------------------------------------ |
| `holding`     | Nobody has shown it's wrong.               |
| `challenged`  | An agent showed evidence against it.       |
| `invalidated` | An approved replan confirmed it was wrong. |
| `confirmed`   | You confirmed it.                          |

They come from the accepted discovery brief, from `start_mission` (`assumptions`), from `update_mission` (`addAssumptions`) or from the **New mission** dialog. Decisions can name the assumptions they rely on (`assumes`). Confirm assumptions on the **Plan** tab.

## Challenge and propose

When an agent finds that an assumption is wrong, it calls `challenge_assumption` with the evidence, then `propose_replan` with typed changes:

| Change                                | Does                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------- |
| `add_ticket`                          | Adds a ticket (`ref`, `title`, `type`, `blockedBy` can name other new refs). |
| `cancel_ticket`                       | Cancels a ticket, with a reason.                                             |
| `edit_ticket`                         | Replaces a ticket's title and/or body, and leaves an audit comment.          |
| `rewire`                              | Adds and/or removes blockers (`addBlockedBy`, `removeBlockedBy`).            |
| `supersede_decision`                  | Replaces a decision with a new answer and rationale.                         |
| `update_destination`                  | Changes what done looks like.                                                |
| `add_unspecified`, `add_out_of_scope` | Adds a line to those sections.                                               |
| `reopen`                              | Puts a done or cancelled ticket back in the queue (ready), as the operator.  |

MILOOPS validates the proposal (unknown refs, cycles after every added and removed edge, removing an edge that isn't there, edits to done or cancelled tickets, duplicate refs; each error names the change), computes a before/after diff, and **freezes** the tickets it touches: agents can't claim them until you decide. A new proposal from the same agent replaces its earlier pending one. Agents keep working on other tickets and check `replan_status`.

## Challenge the destination

A proposal with `kind: "challenge-destination"` says the mission itself should change, with a `destinationReason`:

- `already-exists`: the work is already done somewhere;
- `wrong-problem`: the mission targets the wrong problem;
- `rescope`: it should be rescoped.

It comes with evidence and a suggested destination (an `update_destination` change).

## Review and apply

The map shows a banner and previews the diff: new tickets as outlines, cancelled ones struck through, new edges dashed, frozen tickets marked. **Review** opens the proposal with its reason, evidence and every change. **Approve and apply** runs the changes through the normal operations, safely resumable if the process stops midway; **Reject** needs a note for the agent. Invalidated assumptions become suggested knowledge (`dead-end` or `fact`). Every step is journaled (`proposed`, `approved`, `rejected`, `applied`, `superseded`).

## Replan suggestions

Deterministic triggers raise `replan-suggested` items in [Waiting on you](/docs/waiting-on-you/), but never change the plan themselves:

- a ticket blocked after its last allowed attempt;
- a superseded decision whose dependent tickets are already done;
- a cancelled ticket with open dependents;
- a pull request closed without merging.

Proposals are stored in `.miloops/.replans/<mission>/R-<n>.json`. See [File formats](/docs/file-formats/).
