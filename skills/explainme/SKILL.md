---
name: explainme
description: Answers a question or problem about this repo in a fixed format (problem, sourceFile, reason, solution, approach, advise/gotchas). Use only when the user types /explainme.
argument-hint: <question or problem>
disable-model-invocation: true
---

<!-- Generated from penguin/skills/explainme/SKILL.md by `npm run skills:sync` in the penguin repo. Edit it there, not here. -->

# Explain Me

Answer the question or problem in `$ARGUMENTS` using the fixed format below.

## Before you start

- If `$ARGUMENTS` is empty, reply only with `Give me a question or problem after /explainme.` and stop.
- Read `CLAUDE.md` and `AGENTS.md` if they exist. Apply the rules that touch the code you read.
- Investigate the repo. Do not guess. If you cannot verify something, say so in the field it affects.
- Do not edit files unless `$ARGUMENTS` explicitly asks for a change. The only thing you always write is the answer, saved through the penguin CLI (see [Report files](#report-files)).

## Output

Reply with exactly this structure and nothing else. No intro, no summary.

```
problem: <one or two sentences on what is wrong or what was asked>
sourceFile: <path:line, comma-separated if several>
reason: <why it happens, based on the code you read>
solution: <what to change, naming the functions, hooks or components>
approach:
1. <step>
2. <step>
advise/gotchas: <pitfalls and project rules that apply, or none>
```

## Field rules

- Keep every field short.
- Paths are relative to the repo root.
- Use inline `code` for names and paths.
- If a field does not apply, write `none`.

## Penguin files

Results do not go into this repo. They go to the penguin repo next to it, which runs the `/penguin` panel for {{REPO_NAME}} and its sibling repo. Each repo keeps one JSON array per skill, newest entry first, plus a Markdown copy of it that the penguin CLI writes:

- `<json>`: `.penguin/data/{{REPO_KEY}}/explainme.json`
- `<md>`: `.penguin/reviews/{{REPO_KEY}}/explainme.md`

Print their absolute paths with:

```bash
node "{{PENGUIN_CLI}}" paths explainme --repo {{REPO_KEY}}
```

Save a result by piping one JSON object, shaped like the schema below, into the CLI. It gives the entry an id like `explainme-8`, puts it first in `<json>`, rewrites `<md>` and prints the id:

```bash
node "{{PENGUIN_CLI}}" add explainme --repo {{REPO_KEY}} <<'JSON'
{ ...one entry... }
JSON
```

- Save through `add` only. Never write `<md>` yourself, never create a file per run, and never put a date or time in a file name. The entry's `generatedAt` holds the time.
- Do not edit `.gitignore`. Never put a secret value in an entry.
- If the command fails because the penguin repo is missing, add `Penguin repo not found at {{PENGUIN_DIR}}. Run npm run skills:sync in the penguin repo.` to the reply and do not save.

## Report files

After answering, save the answer as one entry with `add explainme`. The `/penguin` panel shows the answers of both repos in one list. Do not mention the save in chat.

### JSON schema

Valid JSON, no comments or trailing commas. Use the same text as the chat answer. This is the entry you pipe into `add`.

```json
{
  "generatedAt": "<any value: the CLI replaces it with the real time>",
  "question": "<$ARGUMENTS>",
  "problem": "<problem>",
  "sourceFiles": ["<path:line>"],
  "reason": "<reason>",
  "solution": "<solution>",
  "approach": ["<step>"],
  "advice": "<advise/gotchas>"
}
```
