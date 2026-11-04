# Introduction

MILOOPS is a local command center for big work done by AI coding agents: you describe a mission, your agents map and do the work, and you make the calls that matter.

## How it works

1. You describe a mission, usually from your agent's chat with `/milo new "<idea>"`.
2. The agent frames it with you, studies the repo, and charts a **mission map**: a set of decision tickets wired with blocking edges.
3. Agents claim tickets over [MCP](/docs/mcp-tools/), ask you questions, record decisions with evidence, and prove their work against the checks and criteria you agreed on.
4. You steer in the **command center**, a web app that `miloops` serves on your machine, or straight from the chat with [`/milo`](/docs/milo-commands/).

## What matters for developers

- **Local-first.** Missions are plain files in your repo's [`.miloops/` folder](/docs/miloops-folder/), or issues in your [GitHub or Linear tracker](/docs/trackers/). There is no MILOOPS server.
- **Agent-agnostic.** Everything goes through MCP tools. Claude Code and Codex are the primary agents, and any MCP client works.
- **No model calls.** MILOOPS never calls a model. Agents write briefs, knowledge and criteria; MILOOPS gives them structure and enforces the gates in code.
- **Deterministic.** Lifecycle, gates, ranking and selection are code, not prompts. The same inputs give the same result, and every automated choice comes with a reason.
- **You decide.** MILOOPS never answers a question or approves anything on your behalf. Agents may make small calls themselves when your [risk policy](/docs/policy-json/) allows it, and every one is recorded for you to review.
- **Not an executor.** The local product doesn't start or schedule agents. It can prepare [git worktrees](/docs/parallel-work/) for agents that ask.

## Where to go next

| If you want to              | Read                                                                                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Install and run it          | [Install](/docs/install/), [Connect your agent](/docs/connect-your-agent/), [Your first mission](/docs/first-mission/)                                               |
| Understand the model        | [Missions and tickets](/docs/missions-and-tickets/), [The .miloops folder](/docs/miloops-folder/)                                                                    |
| Configure it without the UI | [verification.json](/docs/verification-json/), [policy.json](/docs/policy-json/), [attention.json](/docs/attention-json/), [workspaces.json](/docs/workspaces-json/) |
| Look something up           | [CLI commands](/docs/cli/), [MCP tools](/docs/mcp-tools/), [File formats](/docs/file-formats/), [Environment variables](/docs/environment-variables/)                |
