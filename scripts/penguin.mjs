#!/usr/bin/env node
// Penguin CLI. The skills in Finnaux2.0-UI and Finnaux2.0-API call this to write their
// results into this repo, so the /penguin panel can show runs from both repos.
//
// Data lives in one array file per kind and repo (see scripts/store.mjs):
//   .penguin/data/<repo>/<kind>.json  and its readable copy  .penguin/reviews/<repo>/<kind>.md
//
//   node scripts/penguin.mjs paths <kind> [--repo frontend|backend]
//       Prints the data file and Markdown file for that kind as JSON.
//   node scripts/penguin.mjs add <kind> [--repo frontend|backend] < entry.json
//       Adds one entry (newest first), gives it an id, records the git user.name of the repo it
//       runs in as author (unless the entry has one) and rewrites the Markdown.
//   node scripts/penguin.mjs render [<kind>] [--repo frontend|backend]
//       Rewrites the Markdown after the JSON was edited by hand.
//   node scripts/penguin.mjs migrate
//       Converts the old one-file-per-run layout into the array files and removes the old files.
//   node scripts/penguin.mjs repos
//       Prints the configured repos and where they resolve.

import { execFileSync } from "node:child_process";
import { existsSync, promises as fs, readFileSync, realpathSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createStore, KIND_PATTERN } from "./store.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const store = createStore(ROOT);

function loadRepos() {
  const config = JSON.parse(readFileSync(path.join(ROOT, "penguin.config.json"), "utf8"));
  return Object.fromEntries(
    Object.entries(config.repos).map(([key, repo]) => {
      const override = process.env[`PENGUIN_${key.toUpperCase()}_PATH`];
      return [key, { ...repo, key, dir: path.resolve(ROOT, override || repo.path) }];
    }),
  );
}

const REPOS = loadRepos();

function fail(message) {
  console.error(`penguin: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      flags[arg.slice(2)] = argv[i + 1];
      i++;
    } else positional.push(arg);
  }
  return { positional, flags };
}

const real = (dir) => {
  try {
    return realpathSync(dir).toLowerCase();
  } catch {
    return path.resolve(dir).toLowerCase();
  }
};

// Worktrees live inside the main checkout, so the git common dir always points at the real repo.
function detectRepo() {
  let top;
  try {
    const common = execFileSync("git", ["rev-parse", "--path-format=absolute", "--git-common-dir"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    top = real(path.dirname(common));
  } catch {
    top = real(process.cwd());
  }
  return Object.values(REPOS).find((repo) => real(repo.dir) === top)?.key ?? null;
}

function resolveRepo(flag) {
  const key = flag ?? detectRepo();
  if (!key) fail(`could not tell which repo this is. Pass --repo ${Object.keys(REPOS).join("|")}.`);
  if (!REPOS[key]) fail(`unknown repo "${key}". Use one of: ${Object.keys(REPOS).join(", ")}.`);
  return key;
}

// Whoever runs the skill, as git knows them in the repo it runs in.
function gitUserName() {
  try {
    return execFileSync("git", ["config", "user.name"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function requireKind(kind) {
  if (!kind || !KIND_PATTERN.test(kind)) fail("give a kind, for example: add howismycommit");
  return kind;
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

const filesFor = (repo, kind) => ({
  repo,
  kind,
  json: store.dataFile(repo, kind),
  md: store.reviewFile(repo, kind),
});

async function add(kind, repo) {
  const input = (await readStdin()).trim();
  if (!input) fail("pipe the entry JSON on stdin");
  let entry;
  try {
    entry = JSON.parse(input);
  } catch {
    fail("the entry on stdin is not valid JSON");
  }
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) fail("the entry must be one JSON object");
  if (!entry.author) {
    const author = gitUserName();
    if (author) entry.author = author;
  }
  const item = await store.addItem(repo, kind, entry);
  console.log(JSON.stringify({ id: item.id, ...filesFor(repo, kind) }, null, 2));
}

async function render(kind, repo) {
  const repos = repo ? [repo] : Object.keys(REPOS);
  for (const key of repos) {
    const kinds = kind ? [kind] : await store.listKinds(key);
    for (const k of kinds) {
      await store.writeItems(key, k, await store.readItems(key, k));
      console.log(`penguin: rendered ${path.relative(ROOT, store.reviewFile(key, k))}`);
    }
  }
}

/* -------------------------------------------------------------- migrate */

const OLD_RUN = /^([a-z][a-z0-9-]*?)-(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})\.(json|md)$/;
const DROP_FIELDS = ["version", "id", "repo", "legacyFile", "report"];

const strip = (raw) => Object.fromEntries(Object.entries(raw).filter(([key]) => !DROP_FIELDS.includes(key)));
const sameEntry = (a, b) => JSON.stringify(strip(a)) === JSON.stringify(strip(b));
const time = (item) => new Date(item.generatedAt ?? 0).getTime() || 0;

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

async function migrate() {
  const removed = [];
  const remove = async (file) => {
    await fs.rm(file, { force: true });
    removed.push(path.relative(ROOT, file));
  };

  // Old runs per repo and kind, plus the answers that sat in one shared explanation file.
  const incoming = new Map();
  const push = (repo, kind, entry) => {
    const key = `${repo}/${kind}`;
    incoming.set(key, [...(incoming.get(key) ?? []), entry]);
  };

  for (const repo of Object.keys(REPOS)) {
    const dir = path.join(store.dataDir, repo);
    if (!existsSync(dir)) continue;
    for (const name of (await fs.readdir(dir)).sort()) {
      const match = name.match(OLD_RUN);
      if (!match || match[3] !== "json") continue;
      push(repo, match[1], strip(await readJson(path.join(dir, name))));
      await remove(path.join(dir, name));
    }
  }

  for (const name of ["explanation.json", "explanations.json"]) {
    const file = path.join(store.dataDir, name);
    if (!existsSync(file)) continue;
    for (const item of (await readJson(file))?.items ?? []) {
      const repo = REPOS[item?.repo] ? item.repo : "frontend";
      push(repo, "explainme", strip(item));
    }
    await remove(file);
  }

  for (const repo of Object.keys(REPOS)) {
    const file = path.join(store.dataDir, `${repo}-question.json`);
    if (!existsSync(file)) continue;
    const items = (await readJson(file))?.items ?? [];
    const existing = await store.readItems(repo, "questions");
    const known = new Set(existing.map((q) => q.id));
    await store.writeItems(repo, "questions", [...existing, ...items.filter((q) => !known.has(q.id))]);
    console.log(`penguin: ${items.length} question(s) -> ${path.relative(ROOT, store.dataFile(repo, "questions"))}`);
    await remove(file);
  }

  for (const [key, entries] of incoming) {
    const [repo, kind] = key.split("/");
    const items = await store.readItems(repo, kind);
    // Oldest first, so the ids count up in the order the runs happened.
    for (const entry of entries.sort((a, b) => time(a) - time(b))) {
      if (items.some((item) => sameEntry(item, entry))) continue;
      const numbers = items.map((i) => Number(String(i.id).split("-").pop()) || 0);
      items.push({ id: `${kind}-${Math.max(0, ...numbers) + 1}`, ...entry });
    }
    items.sort((a, b) => time(b) - time(a));
    await store.writeItems(repo, kind, items);
    console.log(`penguin: ${items.length} entr(ies) -> ${path.relative(ROOT, store.dataFile(repo, kind))}`);
  }

  // The per-run reports are replaced by the generated <kind>.md files.
  for (const repo of Object.keys(REPOS)) {
    for (const dir of [path.join(store.reviewsDir, repo), path.join(store.dataDir, repo)]) {
      if (!existsSync(dir)) continue;
      for (const name of await fs.readdir(dir)) {
        if (OLD_RUN.test(name) || name === ".gitkeep") await remove(path.join(dir, name));
      }
    }
  }

  console.log(`penguin: removed ${removed.length} old file(s)`);
  for (const file of removed) console.log(`  - ${file}`);
}

const { positional, flags } = parseArgs(process.argv.slice(2));
const [command, arg] = positional;

switch (command) {
  case "paths": {
    const repo = resolveRepo(flags.repo);
    const kind = requireKind(arg);
    await fs.mkdir(path.join(store.dataDir, repo), { recursive: true });
    console.log(JSON.stringify(filesFor(repo, kind), null, 2));
    break;
  }
  case "add":
    await add(requireKind(arg), resolveRepo(flags.repo));
    break;
  case "render":
    await render(arg ? requireKind(arg) : null, flags.repo ? resolveRepo(flags.repo) : null);
    break;
  case "migrate":
    await migrate();
    break;
  case "repos":
    for (const repo of Object.values(REPOS)) {
      console.log(`${repo.key}\t${repo.name}\t${repo.dir}\t${existsSync(repo.dir) ? "found" : "missing"}`);
    }
    break;
  default:
    fail("commands: paths <kind>, add <kind>, render [<kind>], migrate, repos");
}
