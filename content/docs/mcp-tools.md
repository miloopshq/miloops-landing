# MCP tools

Every tool the `miloops mcp` server offers, grouped by what agents use it for.

Agents also get server instructions on connect that explain when to use each tool. Most tools take an optional `mission` (key such as `#1`, id or title; default: the mission the session is on) and an optional `ticket` (default: the ticket the agent holds). Read-only tools are marked.

## Missions

| Tool             |                                                                                                                                                               | Main inputs                                                                                                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`         | Read-only. Missions, progress, ready / claimed / blocked tickets, sessions, the ranked attention summary, discovery, adaptive and parallel-work state, spend. | `mission`                                                                                                                                                                                    |
| `start_mission`  | Create a mission and chart its tickets. Adds a discovery ticket unless `discovery: false`.                                                                    | `title`, `destination`, `notes`, `mode`, `decided`, `unspecified`, `outOfScope`, `tickets[]` (`ref`, `title`, `type`, `body`, `hitl`, `blockedBy`, `criteria`), `assumptions[]`, `discovery` |
| `resume_mission` | Open a session on a mission: status, any ticket you still hold, the next ready ticket.                                                                        | `mission`                                                                                                                                                                                    |
| `update_mission` | Edit the destination or notes, add Not yet specified, Out of scope or Assumptions lines, switch mode. Plan changes go through `propose_replan`.               | `destination`, `notes`, `addUnspecified`, `addOutOfScope`, `addAssumptions`, `mode`                                                                                                          |
| `submit_brief`   | Submit the discovery brief for the human to review.                                                                                                           | `summary`, `existing` (required), `productContext`, `conventions`, `dataModel`, `api`, `risks`, `assumptions`, `openQuestions`                                                               |
| `get_brief`      | Read-only. The brief, its status and any requested changes.                                                                                                   | `mission`                                                                                                                                                                                    |

## Tickets

| Tool             |                                                                                                                                                                                                                                                | Main inputs                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `next_ticket`    | Read-only. The oldest ready ticket with its blockers' decisions. Doesn't claim.                                                                                                                                                                | `types`                                                                     |
| `claim_ticket`   | Claim a ticket (default: the next ready one). Returns knowledge, suggested criteria, verification checks, any `warnings` and the `workspace`. Fails if another agent got it first, if it's frozen by a replan, or if discovery isn't accepted. | `ticket`, `touches` (path globs), `workspace`                               |
| `release_ticket` | Give a claimed ticket back without closing it.                                                                                                                                                                                                 | `ticket`, `reason`                                                          |
| `add_ticket`     | Add a ticket, or promote a Not yet specified line.                                                                                                                                                                                             | `title`, `type`, `body`, `hitl`, `blockedBy`, `fromUnspecified`, `criteria` |
| `set_criteria`   | Set a ticket's acceptance criteria (`AC-1`, …), replacing existing ones.                                                                                                                                                                       | `ticket`, `criteria[]` (`text`, `kind`, `source`)                           |

## Working and completing

| Tool                  |                                                                                                                                         | Main inputs                                                                                                                                                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `report_progress`     | Step, log line, chat message; tokens and cost only when no agent log is read.                                                           | `step`, `message`, `level`, `say`, `inputTokens`, `outputTokens`, `costUsd`                                                                                                                                               |
| `close_ticket`        | Resolve or rule out a ticket: resolution comment, decision record, unblocked tickets. Runs verification first when the ticket needs it. | `resolution`, `summary`, `rationale`, `alternatives`, `outcome` (`completed` or `out_of_scope`), `criteria[]` (`id`, `evidence`, `note`), `category`, `paths`, `assumes`, `noCodeReason`, `postTranscript`, `waitSeconds` |
| `report_completion`   | Claim a ticket is done; like `close_ticket`, plus the pull request to track.                                                            | the same, plus `pr`                                                                                                                                                                                                       |
| `verification_status` | Read-only. Attempts, check results and verdicts; can wait for running checks.                                                           | `ticket`, `wait`, `waitSeconds`                                                                                                                                                                                           |
| `submit_review`       | Answer a review ticket. You can't review work you did.                                                                                  | `ticket`, `verdict` (`PASS`, `FAIL`, `NEEDS_HUMAN`), `summary`, `findings[]` (`path`, `line`, `severity`, `text`)                                                                                                         |
| `record_decision`     | Keep a decision that isn't a ticket resolution. High-risk calls are rejected unless the human made them.                                | `question`, `answer`, `summary`, `rationale`, `alternatives`, `decidedBy`, `appendToMission`, `category`, `paths`, `assumes`                                                                                              |

## The human

| Tool              |                                                                            | Main inputs                                                                                                                    |
| ----------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `ask_human`       | Ask through Waiting on you and wait for the answer.                        | `question`, `suggestions`, `waitSeconds`, `framing`, `urgency` (`blocking`, `soon`, `fyi`), `blocks` (ticket refs), `category` |
| `wait_for_answer` | Read-only. Keep waiting for an answer.                                     | `questionId`, `waitSeconds`                                                                                                    |
| `list_inbox`      | Read-only. Waiting questions plus the ranked attention items with reasons. | `kinds`                                                                                                                        |
| `answer_question` | Pass on the human's own words from the chat. Never invent an answer.       | `questionId`, `answer`                                                                                                         |

## Knowledge

| Tool                |                                                                     | Main inputs                                         |
| ------------------- | ------------------------------------------------------------------- | --------------------------------------------------- |
| `search_knowledge`  | Read-only. Search entries by words, paths and tags.                 | `query`, `paths`, `tags`, `kind`, `includeOutdated` |
| `propose_knowledge` | Suggest an entry; it stays `suggested` until the human confirms it. | `kind`, `title`, `body`, `scope`, `tags`, `files`   |
| `flag_knowledge`    | Report an entry that contradicts the code or product.               | `id` (`K-<n>`), `reason`                            |

## Assumptions and replans

| Tool                   |                                                                                                       | Main inputs                                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `list_assumptions`     | Read-only. The mission's assumptions with status and linked tickets.                                  | `mission`                                                                                                         |
| `challenge_assumption` | Mark an assumption challenged, with evidence. Returns what depends on it.                             | `assumption` (`S-<n>`), `evidence`, `ticket`                                                                      |
| `propose_replan`       | Propose typed plan changes. Returns errors, or the pending proposal with its diff and frozen tickets. | `kind` (`replan`, `challenge-destination`), `destinationReason`, `reason`, `evidence`, `invalidates`, `changes[]` |
| `replan_status`        | Read-only. A proposal's status; can wait for the human's decision.                                    | `id`, `wait`, `waitSeconds`                                                                                       |

See [Assumptions and replans](/docs/adaptive-missions/) for the change types, and [Verification and criteria](/docs/verification/) for completion results.
