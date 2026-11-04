# File formats

The format of every file in `.miloops/`, with short examples from a real mission.

Markdown files use YAML-style frontmatter between `---` lines. Times are ISO 8601 in frontmatter and epoch milliseconds in JSON. See [The .miloops folder](/docs/miloops-folder/) for which files to commit.

## Mission: `<mission>/map.md`

```md
---
key: '#1'
title: Offline-first sync for Fieldnote
mode: plan+execute
labels: [miloops:map]
created: 2026-11-04T11:57:05.743Z
updated: 2026-11-04T11:57:05.792Z
---

## Destination

Fieldnote mobile users can capture and edit notes for a week with no signal.

## Notes

Current sync is request/response over REST.

## Assumptions

- [holding] Notes stay under 10,000 per device <!-- miloops:asm {"id":"S-1","tickets":["5","10"],"source":"brief:A-1"} -->

## Decisions so far

- #3: Field researchers with multi-day dead zones, not commuters.

## Not yet specified

- Attachments and photo sync

## Out of scope

- Real-time collaborative cursors — single-author notes
```

`mode` is `plan+execute` or `plan-only`; an optional `verification` key holds the mission's [verification level](/docs/verification/). The body format is the same on GitHub and Linear.

### Assumption lines

```md
- [<status>] <text> <!-- miloops:asm {json} -->
```

The JSON holds `id` (`S-<n>`), `tickets` (ticket ids that depend on it), and optionally `source` (`brief:A-<n>`), `challenge` (`by`, `at`, `evidence`, `ticketId`) and `decidedBy` (`R-<n>` or `operator`). Statuses: `holding`, `challenged`, `invalidated`, `confirmed`.

## Ticket: `<mission>/tickets/<n>.md`

```md
---
id: '3'
title: Who is the primary offline user?
type: grilling
labels: [miloops:grilling]
state: closed
close_reason: completed
assignee: ''
blocked_by: []
created: 2026-11-04T11:57:05.746Z
updated: 2026-11-04T11:57:05.758Z
closed: 2026-11-04T11:57:05.758Z
---

Decision ticket for the Fieldnote offline sync mission.

## Comments

### claude-07 @ 2026-11-04T11:57:05.757Z

**Resolution**

Field researchers with multi-day dead zones, not commuters.
```

| Key                      |                                                                   |
| ------------------------ | ----------------------------------------------------------------- |
| `type`                   | `research`, `prototype`, `grilling`, `task`, `execute`, `review`. |
| `labels`                 | `miloops:<type>`, plus `miloops:hitl` for HITL tasks.             |
| `state`, `close_reason`  | `open` / `closed`; `completed` or `out_of_scope` when closed.     |
| `assignee`               | The agent or person holding the claim.                            |
| `blocked_by`             | Ticket ids that must close first.                                 |
| `status`                 | Optional: `verifying`, `rework` or `blocked`.                     |
| `verification`, `checks` | Optional per-ticket overrides of the level and the checks to run. |
| `review_of`              | On `review` tickets: the ticket under review.                     |

## Decision: `<mission>/decisions/D-<n>.md`

```md
---
id: D-3
mission: offline-first-sync-for-fieldnote
ticket: '3'
ticket_key: '#3'
decided_by: arekom
decided_at: 2026-11-03T23:27:05.743Z
participants: [arekom, operator]
source: tracker
supersedes: D-2
---

## Question

Who is the primary offline user?

## Decision

Field researchers with multi-day dead zones, not commuters.

## Summary

## Alternatives

- Commuters with patchy transit signal

## Rationale

## Transcript
```

Decisions can also carry the risk level they got from the [policy](/docs/policy-json/) and the assumptions they rely on.

## Discovery brief: `briefs/<mission>.md`

```md
---
status: accepted
author: claude-01
submitted: 2026-11-02T11:57:05.772Z
decided: 2026-11-02T12:57:05.772Z
---

## Summary

## Product context

## Existing implementation

## Conventions and abstractions

## Data model impact

## API impact

## Risks and possible regressions

## Assumptions

- A-1: Notes stay under 10,000 per device

## Open questions
```

`status` is `draft`, `submitted`, `accepted` or `changes-requested` (with your `note`).

## Acceptance criteria: `criteria/<mission>.md`

```md
# Acceptance criteria: Offline-first sync for Fieldnote

## #8 (id 8) · confirmed

- AC-1 (unit) Every sync failure is counted with its cause
- AC-2 (business-rule, K-1) Counting never drops or changes a user's edit
- AC-3 (manual) The dashboard shows last week's failure rate
```

One section per ticket; `· confirmed` once you confirmed them. Each line is `AC-<n> (<kind>[, <knowledge id>]) <text>`.

## Knowledge: `knowledge/K-<n>.md`

```md
---
title: Never lose a field edit
kind: business-rule
status: confirmed
scope: [src/sync/**]
tags: [sync, merge]
sources: [mission:#1]
anchors: [src/sync/merge.ts@3f2a1c9]
createdBy: claude-01
created: 2026-11-01T11:57:05.772Z
updated: 2026-11-02T11:57:05.772Z
---

A user's edit must survive any sync conflict.
```

`anchors` are `path@blobhash`, used for [staleness](/docs/discovery-and-knowledge/). A flagged entry also has `flaggedBy`, `flagged` and `flagReason`.

## Replan proposal: `.replans/<mission>/R-<n>.json`

```json
{
  "v": 1,
  "id": "R-1",
  "mapId": "team-workspaces",
  "kind": "challenge-destination",
  "destinationReason": "already-exists",
  "by": "claude-02",
  "at": 1793792225772,
  "reason": "Organizations already give teams shared notebooks and an admin role.",
  "evidence": "`src/admin/orgs.ts` has organizations with members and an admin role since v3.2.",
  "invalidates": [],
  "changes": [
    { "op": "update_destination", "text": "Admins manage their organization's members themselves." },
    { "op": "cancel_ticket", "ticket": "18", "reason": "Organizations are the prior art" }
  ],
  "status": "pending",
  "applied": [],
  "created": {}
}
```

`status` is `pending`, `approved`, `rejected` or `superseded`. `applied` lists the indexes of changes already executed, so applying resumes where it stopped. See [Assumptions and replans](/docs/adaptive-missions/) for every change `op`.

## Journal: `.events/<mission>.jsonl`

One JSON object per line, append-only. Transitions (`kind: "transition"`: `event`, `from`, `to`, `actor`, `actorKind`, `reason`) and replan steps:

```json
{
  "v": 1,
  "kind": "replan",
  "at": 1793793425803,
  "mapId": "offline-first-sync-for-fieldnote",
  "replanId": "R-1",
  "action": "proposed",
  "actor": "claude-02",
  "actorKind": "agent",
  "reason": "The notes API cannot take batches."
}
```

Readers skip kinds they don't know, so old and new journals both load.

## Local coordination: `.agents/`

Written by MILOOPS processes, not meant for hand edits: agent sessions, answers, ticket leases (with declared `touches` and the `workspace`), callsigns, prepared workspaces (`workspaces/`), the latest integration scan (`integration.json`) and the server lock.
