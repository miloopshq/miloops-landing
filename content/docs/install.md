# Install

Install the `miloops` command and open the command center for a repo.

## Requirements

- Node.js 20 or newer. MILOOPS has no other runtime dependencies.
- Git, for workspaces and git evidence. MILOOPS still runs in a folder without git.

## Run it

```bash
npm i -g miloops-cli@next   # or, without installing: npx miloops-cli@next
cd your-repo
miloops
```

`miloops` starts a local server, opens the command center in your browser and keeps missions as plain files in `./.miloops/` in the current folder. Agents and people can edit those files directly, and changes show up live.

> Until launch, the real CLI is published under the `next` tag. `miloops-cli@latest` is a placeholder that only prints a short message.

## Options

| Option            | Default                          |                                                                                                               |
| ----------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `--dir <path>`    | `./.miloops` (or `$MILOOPS_DIR`) | The tracker folder.                                                                                           |
| `--port <n>`      | `7420`, or the next free port    | Port for the command center and its API.                                                                      |
| `--host <addr>`   | `127.0.0.1`                      | Interface to bind. The server can write files in the tracker folder, so only expose it on networks you trust. |
| `--no-open`       |                                  | Don't open the browser.                                                                                       |
| `-v`, `--version` |                                  | Print the version.                                                                                            |
| `-h`, `--help`    |                                  | Show the help.                                                                                                |

See [CLI commands](/docs/cli/) for every command.

## Updating

- With `npx miloops-cli@next`, you always get the current `next` version. npx caches package metadata for a few minutes, so a release can take a moment to show up.
- With a global install, run `npm i -g miloops-cli@next` again. There's no need to uninstall first.

## Commit `.miloops/` or not

Commit the shared files (missions, decisions, briefs, criteria, knowledge and the config files) so your team and your agents see the same state. Local-only folders such as the journal, evidence and agent coordination come with their own `.gitignore`. See [The .miloops folder](/docs/miloops-folder/) for which is which.
