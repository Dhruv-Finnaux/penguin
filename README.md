# 🐧 Penguin

A local panel for **Finnaux2.0-UI** (frontend) and **Finnaux2.0-API** (backend). It shows commit reviews, pre-commit checks, explanations, docs, open questions and the git history of both repos in one place.

Penguin used to live at `/penguin` inside Finnaux2.0-UI. It now lives here, and the Claude Code skills in both repos write their results into this repo.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3100/penguin. The panel only runs in development (`next dev`). Production builds return 404, as before.

The three repos must sit next to each other:

```
Work/
├── FINNAUX2.0-UI/
├── FINNAUX2.0-API/
└── penguin/
```

Other layouts: change the paths in `penguin.config.json`, or set `PENGUIN_FRONTEND_PATH` / `PENGUIN_BACKEND_PATH`.

## Tabs

| Tab                | Source                                                                                                                                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend / Backend | Git in each repo: every local and remote branch. **Verbose** shows commit cards with reviews and diffs, 50 at a time. **Flow** shows the branch graph: one colour per branch, the short SHA as the node. |
| Findings           | `/howismycommit` runs from both repos (`.penguin/data/<repo>/howismycommit.json`).                                                                                                                       |
| Committables       | `/committable` runs from both repos (`.penguin/data/<repo>/committable.json`).                                                                                                                           |
| Explanations       | `/explainme` answers from both repos (`.penguin/data/<repo>/explainme.json`), shown as one list.                                                                                                         |
| Git Guides         | `/talktomegit` guides from both repos (`.penguin/data/<repo>/talktomegit.json`): goal, approach, steps and questions, shown as one list.                                                                  |
| Documents          | Markdown in the `docs/` folder of both repos, grouped by repo and sub folder.                                                                                                                            |
| Questions          | `.penguin/data/<repo>/questions.json`, edited here.                                                                                                                                                      |

Findings, Committables and Explanations have an **All / Frontend / Backend** filter.

## Data

One JSON file per kind and repo. Each file is an array, newest entry first, and each entry has an id like `committable-4` and a `generatedAt` time. File names carry no dates.

```
.penguin/
├── data/
│   ├── frontend/                # Finnaux2.0-UI
│   │   ├── howismycommit.json
│   │   ├── committable.json
│   │   ├── explainme.json
│   │   ├── promptify.json       # once /promptify has run
│   │   ├── talktomegit.json     # once /talktomegit has run
│   │   └── questions.json
│   └── backend/                 # Finnaux2.0-API, same files
└── reviews/
    ├── frontend/                # howismycommit.md, committable.md, ... one per JSON file
    └── backend/
```

Every file in `reviews/` is generated from the JSON file of the same name, with the same structure, so it reads like the data. Edit the JSON, not the Markdown: the CLI and the panel rewrite the Markdown on every change, and `node scripts/penguin.mjs render` rewrites it after a hand edit.

`.penguin/` is committed in this repo so the history is not lost.

## Skills

The skills live in `skills/` here, and get copied into each repo's `.claude/skills/` with that repo's checks and rules (from `penguin.config.json`):

```bash
npm run skills:sync
```

Run it again after you change a skill in `skills/`, or after you move the folders. Edit the skills here, not in the repos; the copies say they are generated.

| Skill                   | Adds one entry to                       |
| ----------------------- | --------------------------------------- |
| `/howismycommit [hash]` | `data/<repo>/howismycommit.json`        |
| `/committable`          | `data/<repo>/committable.json`          |
| `/explainme <question>` | `data/<repo>/explainme.json`            |
| `/promptify <prompt>`   | `data/<repo>/promptify.json`            |
| `/talktomegit <goal>`   | `data/<repo>/talktomegit.json`          |

The skills call `scripts/penguin.mjs`, which uses `scripts/store.mjs` like the panel does:

```bash
node scripts/penguin.mjs paths <kind> --repo frontend|backend      # where <kind>.json and <kind>.md live
node scripts/penguin.mjs add <kind> --repo frontend|backend < entry.json
node scripts/penguin.mjs render [<kind>] [--repo frontend|backend] # rewrite the Markdown after a hand edit
node scripts/penguin.mjs migrate                                   # old one-file-per-run layout -> arrays
node scripts/penguin.mjs repos                                     # where each repo resolves
```

Claude Code asks before a skill writes outside its own repo. To allow the penguin CLI and `.penguin/` once per repo (it edits each repo's `.claude/settings.local.json`):

```bash
npm run skills:sync -- --permissions
```
