# /milo commands

The `/milo` command drives MILOOPS from your agent's chat.

`miloops connect claude` installs it as `.claude/commands/milo.md` in the repo. `miloops connect codex` installs it as a Codex prompt (`~/.codex/prompts/milo.md`), used as `/prompts:milo …`. With no arguments, it runs `status`.

| Command                  | Does                                                                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `/milo new "<idea>"`     | Frames the idea with you, charts a mission, does discovery, then works it.                                                               |
| `/milo resume [mission]` | Picks up the mission and works ready tickets until none is ready.                                                                        |
| `/milo status`           | Progress, running sessions, what's waiting on you and what interrupts, blocked and rework tickets, spend.                                |
| `/milo inbox`            | The ranked [Waiting on you](/docs/waiting-on-you/) list. Answer questions in the chat; everything else is decided in the command center. |

## new "<idea>"

1. Checks the work is mission-sized; a bug fix or a single endpoint is done directly, unless you ask for a mission.
2. Asks 3–4 framing questions, one at a time (`ask_human` with `framing: true`): who it's for, what done looks like, what's out of scope, what's decided.
3. Drafts the map: destination, decided, not yet specified, out of scope, assumptions and tickets wired with `blockedBy`, then calls `start_mission`.
4. Does discovery and calls `submit_brief`; continues once you accept it.

## resume [mission]

For each ticket, the agent:

- declares the files it will change (`touches`) and works in its workspace when it gets one;
- reads the knowledge that came with the claim, and proposes or flags knowledge;
- agrees on acceptance criteria (`set_criteria`) before implementation work;
- asks you only calls that are yours (by your [risk policy](/docs/policy-json/)), with honest urgency, and decides and records the rest;
- challenges assumptions and proposes replans instead of working around them;
- closes with a resolution, rationale, alternatives and evidence per criterion, and handles `rework` or `blocked` results.

## In Codex

```text
/prompts:milo new "<idea>"
/prompts:milo resume
/prompts:milo status
/prompts:milo inbox
```
