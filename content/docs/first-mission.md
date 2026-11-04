# Your first mission

Go from an idea to a charted mission, a discovery brief and the first finished ticket.

## 1. Start the command center

```bash
cd your-repo
miloops
```

## 2. Describe the mission

In Claude Code (Codex: `/prompts:milo new …`):

```text
/milo new "Let field researchers edit notes offline for a week"
```

The agent first checks the work is mission-sized: a bug fix or a single endpoint doesn't need a mission. Then it asks 3–4 framing questions (who it's for, what done looks like, what's out of scope, what's already decided). Answer in the chat or in the command center's **Waiting on you** list.

You can also create a mission from the command center (**New mission**), then let an agent pick it up with `/milo resume`.

## 3. Review the discovery brief

`start_mission` charts the map and adds a **discovery ticket**. Until you accept the brief, agents can only claim `research`, `grilling` and `review` tickets. The agent studies the repo and calls `submit_brief` with:

- what the mission changes, and the product context;
- the existing files and modules involved, with real paths;
- conventions, data model and API impact, risks;
- the assumptions it relies on, and open questions.

Open the brief from the banner on the map, then **Accept** it or **Request changes** with a note. On accept, the brief's assumptions are added to the mission. See [Discovery and knowledge](/docs/discovery-and-knowledge/).

## 4. Let agents work

```text
/milo resume
```

Each agent claims the next ready ticket, agrees on [acceptance criteria](/docs/verification/), asks you only the calls your [risk policy](/docs/policy-json/) says are yours, and closes the ticket with a resolution, a decision record and evidence. Run more agents in parallel; see [Parallel work](/docs/parallel-work/).

## 5. Steer

- **Waiting on you** ranks everything that needs you. See [Waiting on you](/docs/waiting-on-you/).
- `/milo status` and `/milo inbox` do the same from the chat. See [/milo commands](/docs/milo-commands/).
- When the facts change, agents propose a replan for you to approve. See [Assumptions and replans](/docs/adaptive-missions/).

## Skip discovery

For small, well-understood missions, ask the agent to skip it: `start_mission` takes `discovery: false`, and implementation tickets are claimable right away.
