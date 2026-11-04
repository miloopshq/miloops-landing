# CLI commands

Every `miloops` command and flag.

```text
miloops [options]
miloops mcp [--dir <path>] [--agent <callsign>] [--lease-minutes <n>]
miloops connect claude|codex [--dir <path>]
miloops connect slack [options]
miloops knowledge import <file.md> [--dir <path>]
```

## miloops

Starts the command center for the current folder and opens it in your browser.

| Option            | Default                          |                                                                                                            |
| ----------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `--dir <path>`    | `./.miloops` (or `$MILOOPS_DIR`) | Tracker folder.                                                                                            |
| `--port <n>`      | `7420`                           | Port. The next free port is used if it's taken.                                                            |
| `--host <addr>`   | `127.0.0.1`                      | Interface to bind. Only expose it on networks you trust: the server can write files in the tracker folder. |
| `--no-open`       |                                  | Don't open the browser.                                                                                    |
| `-v`, `--version` |                                  | Print the version.                                                                                         |
| `-h`, `--help`    |                                  | Show the help.                                                                                             |

## miloops mcp

Serves the MCP server for coding agents over stdio. Agents start it themselves; see [Connect your agent](/docs/connect-your-agent/).

| Option                | Default                            |                                                                                           |
| --------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------- |
| `--dir <path>`        | `./.miloops` (or `$MILOOPS_DIR`)   | Tracker folder.                                                                           |
| `--agent <callsign>`  | from the MCP client                | Fix the session name (otherwise `claude-01`, `codex-01`, …).                              |
| `--lease-minutes <n>` | `15` (or `$MILOOPS_LEASE_MINUTES`) | A claimed ticket returns to the queue after this long without a tool call from its agent. |

## miloops connect claude | codex

Registers the MCP server with Claude Code or Codex and installs the [`/milo` command](/docs/milo-commands/). For Claude Code it also adds a `SessionStart` hook, so usage comes from the session transcript. Takes `--dir <path>`.

## miloops connect slack

Starts the command center on the [Slack](/docs/slack/) setup. It takes the same options as `miloops`.

## miloops knowledge import

```bash
miloops knowledge import docs/spec.md
```

Seeds [project knowledge](/docs/discovery-and-knowledge/) from a markdown document: one `suggested` entry per `##` section, for you to review in the command center. Takes `--dir <path>`.

## miloops hook claude

The `SessionStart` hook itself, run by Claude Code with the hook payload on stdin. You don't run it by hand.
