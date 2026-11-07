---
name: promptify
description: Rewrites a rough request into a clear, complete prompt the user will give to Claude later. Use only when the user types /promptify. Never performs the task.
argument-hint: <rough prompt> [NOTE: extra conditions]
disable-model-invocation: true
---

<!-- Generated from penguin/skills/promptify/SKILL.md by `npm run skills:sync` in the penguin repo. Edit it there, not here. -->

# Promptify

Rewrite `$ARGUMENTS` into a better prompt for the user to run later. Do not do the task.

## Input

- Everything after `NOTE:` is a condition the refined prompt must satisfy.
- If the message starts with `revise:` or says "same prompt, but...", it revises the last refined prompt in this conversation. Otherwise, start fresh, even if it contains `NOTE:`.

## What to do

1. Do not answer the request, run commands, edit project files, or ask clarifying questions. You may read `CLAUDE.md` and `AGENTS.md` for context only.
2. The refined prompt should tell Claude:
   - the goal, in one or two sentences
   - the scope: the screen, feature, or area, using names from `CLAUDE.md` and `AGENTS.md`
   - the expected output and its format: explanation, plan, code change, or review
   - the project constraints this task touches. Reference them by name from `CLAUDE.md` and restate only the ones that apply
   - anything the `NOTE:` requires
   - what not to do, such as "no code changes" when the user only wants understanding
3. Keep the refined prompt under 200 words unless the task is large.
4. Use a placeholder like `[vendor name]` only when the prompt cannot work without that value. Do not guess it.

## Output

Reply with only:

1. `Refined prompt:`
2. The refined prompt in a fenced code block, ready to copy.
3. If there are placeholders, one line listing what to fill in.

Add nothing else in chat.

## Penguin files

Results do not go into this repo. They go to the penguin repo next to it, which runs the `/penguin` panel for {{REPO_NAME}} and its sibling repo. Each repo keeps one JSON array per skill, newest entry first, plus a Markdown copy of it that the penguin CLI writes:

- `<json>`: `.penguin/data/{{REPO_KEY}}/promptify.json`
- `<md>`: `.penguin/reviews/{{REPO_KEY}}/promptify.md`

Print their absolute paths with:

```bash
node "{{PENGUIN_CLI}}" paths promptify --repo {{REPO_KEY}}
```

Save a result by piping one JSON object, shaped like the schema below, into the CLI. It gives the entry an id like `promptify-8`, puts it first in `<json>`, rewrites `<md>` and prints the id:

```bash
node "{{PENGUIN_CLI}}" add promptify --repo {{REPO_KEY}} <<'JSON'
{ ...one entry... }
JSON
```

- Save through `add` only. Never write `<md>` yourself, never create a file per run, and never put a date or time in a file name. The entry's `generatedAt` holds the time.
- Do not edit `.gitignore`. Never put a secret value in an entry.
- If the command fails because the penguin repo is missing, add `Penguin repo not found at {{PENGUIN_DIR}}. Run npm run skills:sync in the penguin repo.` to the reply and do not save.

## Report files

After replying, save the result as one entry with `add promptify`. This is the only writing you do. Do not mention it in chat.

### JSON schema

Valid JSON, no comments or trailing commas.

```json
{
  "generatedAt": "<any value: the CLI replaces it with the real time>",
  "input": "<the rough prompt, without the NOTE>",
  "note": "<text after NOTE:, or empty string>",
  "revision": false,
  "refinedPrompt": "<the refined prompt>",
  "placeholders": ["<placeholder to fill in>"]
}
```

`revision` is `true` when the run revised the last refined prompt.
