#!/usr/bin/env node
// Installs the skills in skills/ into every repo in penguin.config.json, so /howismycommit,
// /committable, /explainme, /promptify and /talktomegit write their reports into this repo.
//
//   npm run skills:sync             install or update the generated skills
//   npm run skills:sync -- --force  also replace hand-written skills with the same name
//   npm run skills:sync -- --permissions
//       also let Claude Code in each repo run the penguin CLI and write to .penguin/ without
//       asking, through that repo's .claude/settings.local.json

import { existsSync, promises as fs, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const SKILLS_DIR = path.join(ROOT, "skills")
const CLI = path.join(ROOT, "scripts", "penguin.mjs")
const MARKER = "by `npm run skills:sync` in the penguin repo"
const force = process.argv.includes("--force")
const withPermissions = process.argv.includes("--permissions")

const config = JSON.parse(readFileSync(path.join(ROOT, "penguin.config.json"), "utf8"))

function render(template, vars) {
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (match, name) => {
    const value = vars[name]
    if (value === undefined) throw new Error(`No value for ${match}`)
    return Array.isArray(value) ? value.map((line) => `- ${line}`).join("\n") : String(value)
  })
}

async function updateSettings(repoDir) {
  const file = path.join(repoDir, ".claude", "settings.local.json")
  let settings = {}
  if (existsSync(file)) settings = JSON.parse(await fs.readFile(file, "utf8"))

  const permissions = (settings.permissions ??= {})
  const allow = (permissions.allow ??= [])
  const dirs = (permissions.additionalDirectories ??= [])
  const penguinData = path.join(ROOT, ".penguin")
  for (const rule of [`Bash(node ${CLI} *)`, `Edit(/${penguinData}/**)`, `Read(/${penguinData}/**)`]) {
    if (!allow.includes(rule)) allow.push(rule)
  }
  if (!dirs.includes(penguinData)) dirs.push(penguinData)

  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, JSON.stringify(settings, null, 2) + "\n")
}

const skills = (await fs.readdir(SKILLS_DIR, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

for (const [key, repo] of Object.entries(config.repos)) {
  const repoDir = path.resolve(ROOT, process.env[`PENGUIN_${key.toUpperCase()}_PATH`] || repo.path)
  if (!existsSync(path.join(repoDir, ".git"))) {
    console.log(`skip ${repo.name}: no git repo at ${repoDir}`)
    continue
  }

  const vars = {
    ...repo.skills,
    REPO_KEY: key,
    REPO_NAME: repo.name,
    PENGUIN_CLI: CLI,
    PENGUIN_DIR: ROOT,
  }

  for (const skill of skills) {
    const template = await fs.readFile(path.join(SKILLS_DIR, skill, "SKILL.md"), "utf8")
    const target = path.join(repoDir, ".claude", "skills", skill, "SKILL.md")
    if (existsSync(target) && !force) {
      const current = await fs.readFile(target, "utf8")
      if (!current.includes(MARKER)) {
        console.log(`keep ${repo.name}/${skill}: hand-written skill, rerun with --force to replace`)
        continue
      }
    }
    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.writeFile(target, render(template, vars))
    console.log(`wrote ${path.relative(path.dirname(ROOT), target)}`)
  }

  if (withPermissions) {
    await updateSettings(repoDir)
    console.log(`allowed ${repo.name} to use the penguin CLI and .penguin/`)
  }
}
