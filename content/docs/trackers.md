# GitHub Issues and Linear

Keep missions and tickets as issues in the tracker your team already uses, instead of markdown files.

## How it maps

The map and tickets keep the same body format as the markdown files. MILOOPS adds:

| MILOOPS                      | In the tracker                                                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Mission                      | An issue labelled `miloops:map`, with the map as its body.                                                                |
| Ticket type, HITL, plan-only | Labels: `miloops:research`, `miloops:grilling`, …, `miloops:hitl`, `miloops:plan-only`.                                   |
| Claim, phase, verification   | A `<!-- miloops:meta {…} -->` marker at the end of the issue body. A human assignee in the tracker counts as a claim too. |
| Decision record              | A comment on its ticket ending in a `<!-- miloops:decision {…} -->` marker.                                               |
| Comment author               | A `<!-- miloops:author <id> -->` first line (the API user posts every comment).                                           |

Writes go through a local outbox, so they survive going offline and replay once the tracker is reachable. The journal, evidence and agent coordination stay in the local [`.miloops/` folder](/docs/miloops-folder/).

## Connect

Open **Settings → Tracker** in the command center and pick GitHub or Linear. The choice is saved in `.miloops/trackers.json`, which holds no secrets:

```json
{
  "active": "github",
  "github": { "repo": "acme/fieldnote" }
}
```

```json
{
  "active": "linear",
  "linear": { "teamId": "…", "teamKey": "FN", "projectId": "…" }
}
```

`active` is `markdown` (the default), `github` or `linear`. For Linear, `projectId` is optional: missions are then created in that project and only its missions are listed.

## Tokens

Tokens never go in the repo. MILOOPS uses the first one it finds:

| Tracker | Order                                                                                                 |
| ------- | ----------------------------------------------------------------------------------------------------- |
| GitHub  | Saved in Settings (`credentials.json`), then `$GITHUB_TOKEN`, then `$GH_TOKEN`, then `gh auth token`. |
| Linear  | Saved in Settings (`credentials.json`), then `$LINEAR_API_KEY`.                                       |

The repo defaults to the `origin` remote. Settings shows where a token came from, never its value.

GitHub is also where [verification](/docs/verification-json/) tracks pull requests and CI (`github` in `verification.json`).
