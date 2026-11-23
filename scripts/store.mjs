// Penguin data store, shared by the CLI (scripts/penguin.mjs) and the /penguin panel.
//
//   .penguin/data/<repo>/<kind>.json     one array per kind, newest entry first
//   .penguin/reviews/<repo>/<kind>.md    the same entries as readable Markdown, generated
//
// <repo> is frontend or backend. <kind> is a skill (howismycommit, committable, explainme,
// promptify, talktomegit) or questions. Every entry has an id like "committable-4". The Markdown file is
// rewritten on every write, so the JSON is the only thing to edit.

import { existsSync, promises as fs } from "node:fs";
import path from "node:path";

export const KIND_PATTERN = /^[a-z][a-z0-9-]{1,40}$/;

const TITLES = {
  howismycommit: "How Is My Commit",
  committable: "Committable",
  explainme: "Explain Me",
  promptify: "Promptify",
  talktomegit: "Talk To Me Git",
  questions: "Questions",
  dbbackups: "DB Backups",
};

const REPO_LABELS = { frontend: "Frontend", backend: "Backend" };

// 2026-10-29T15:28:24+05:30: the machine's own offset, so the time reads like the clock.
export function localIso(date) {
  const pad = (n) => String(n).padStart(2, "0");
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const abs = Math.abs(offset);
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
  );
}

export function createStore(root) {
  const dataDir = path.join(root, ".penguin", "data");
  const reviewsDir = path.join(root, ".penguin", "reviews");

  const checkKind = (kind) => {
    if (!KIND_PATTERN.test(kind)) throw new Error(`Invalid kind "${kind}"`);
  };

  const dataFile = (repo, kind) => {
    checkKind(kind);
    return path.join(dataDir, repo, `${kind}.json`);
  };

  const reviewFile = (repo, kind) => {
    checkKind(kind);
    return path.join(reviewsDir, repo, `${kind}.md`);
  };

  async function readItems(repo, kind) {
    try {
      const raw = JSON.parse(await fs.readFile(dataFile(repo, kind), "utf8"));
      return Array.isArray(raw) ? raw : [];
    } catch (error) {
      if (error?.code === "ENOENT") return [];
      throw new Error(`${path.relative(root, dataFile(repo, kind))} is not valid JSON`);
    }
  }

  async function writeAtomic(file, content) {
    await fs.mkdir(path.dirname(file), { recursive: true });
    const temp = `${file}.${process.pid}.tmp`;
    await fs.writeFile(temp, content);
    await fs.rename(temp, file);
  }

  async function writeItems(repo, kind, items) {
    await writeAtomic(dataFile(repo, kind), JSON.stringify(items, null, 2) + "\n");
    await writeAtomic(reviewFile(repo, kind), renderMarkdown(repo, kind, items));
  }

  function nextId(kind, items) {
    const numbers = items
      .map((item) => String(item?.id ?? "").match(new RegExp(`^${kind}-(\\d+)$`)))
      .filter(Boolean)
      .map((match) => Number(match[1]));
    return `${kind}-${Math.max(0, ...numbers) + 1}`;
  }

  // New entries go first. A version field from an old skill template is dropped.
  async function addItem(repo, kind, entry) {
    const items = await readItems(repo, kind);
    const rest = { ...entry };
    delete rest.generatedAt;
    delete rest.version;
    delete rest.id;
    // id, time and author first, so every entry reads the same way. The time is always the
    // moment of saving: skills guess it, and a guessed "Z" showed runs hours off.
    const item = {
      id: nextId(kind, items),
      generatedAt: localIso(new Date()),
      ...(rest.author ? { author: rest.author } : {}),
      ...rest,
    };
    items.unshift(item);
    await writeItems(repo, kind, items);
    return item;
  }

  async function updateItems(repo, kind, update) {
    const items = await readItems(repo, kind);
    const next = (await update(items)) ?? items;
    await writeItems(repo, kind, next);
    return next;
  }

  async function listKinds(repo) {
    const dir = path.join(dataDir, repo);
    if (!existsSync(dir)) return [];
    return (await fs.readdir(dir))
      .filter((name) => name.endsWith(".json"))
      .map((name) => name.slice(0, -5))
      .filter((kind) => KIND_PATTERN.test(kind));
  }

  return {
    dataDir,
    reviewsDir,
    dataFile,
    reviewFile,
    readItems,
    writeItems,
    addItem,
    updateItems,
    listKinds,
  };
}

/* ------------------------------------------------------------ markdown */

const isScalar = (value) => value === null || ["string", "number", "boolean"].includes(typeof value);

const isFlatObject = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.values(value).every(isScalar);

function cell(value) {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "string") return String(value);
  if (value === "") return '""';
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>");
}

function keyValueTable(rows) {
  if (rows.length === 0) return [];
  return ["| Field | Value |", "|---|---|", ...rows.map(([key, value]) => `| ${key} | ${cell(value)} |`), ""];
}

// Rows with a few plain fields read best as one table; wider rows read best one item at a time.
function isCompact(list) {
  if (!list.every(isFlatObject)) return false;
  return new Set(list.flatMap((item) => Object.keys(item))).size <= 6;
}

function renderValue(key, value, depth) {
  const heading = "#".repeat(Math.min(depth, 6));
  if (Array.isArray(value)) {
    const lines = [`${heading} ${key} (${value.length})`, ""];
    if (value.length === 0) return [...lines, "_Empty._", ""];
    if (value.every(isScalar)) return [...lines, ...value.map((v) => `- ${cell(v)}`), ""];
    if (isCompact(value)) {
      const keys = [...new Set(value.flatMap((item) => Object.keys(item)))];
      return [
        ...lines,
        `| ${keys.join(" | ")} |`,
        `|${keys.map(() => "---").join("|")}|`,
        ...value.map((item) => `| ${keys.map((k) => cell(item[k])).join(" | ")} |`),
        "",
      ];
    }
    return [
      ...lines,
      ...value.flatMap((item, i) =>
        isScalar(item)
          ? [`- ${cell(item)}`]
          : renderObject(`${key}[${i + 1}]${item?.id ? ` · ${item.id}` : ""}`, item, depth + 1),
      ),
    ];
  }
  return renderObject(key, value, depth);
}

function renderObject(title, object, depth) {
  const heading = "#".repeat(Math.min(depth, 6));
  const rows = [];
  const sections = [];
  for (const [key, value] of Object.entries(object)) {
    if (isScalar(value)) rows.push([key, value]);
    else if (isFlatObject(value)) {
      for (const [sub, subValue] of Object.entries(value)) rows.push([`${key}.${sub}`, subValue]);
    } else sections.push([key, value]);
  }
  return [
    `${heading} ${title}`,
    "",
    ...keyValueTable(rows),
    ...sections.flatMap(([key, value]) => renderValue(key, value, depth + 1)),
  ];
}

export function renderMarkdown(repo, kind, items) {
  const title = TITLES[kind] ?? kind;
  const lines = [
    `# 🐧 ${title} · ${REPO_LABELS[repo] ?? repo}`,
    "",
    `> Generated from \`data/${repo}/${kind}.json\`. Edit the JSON, not this file. ${items.length} ${items.length === 1 ? "entry" : "entries"}, newest first.`,
    "",
  ];
  for (const item of items) {
    lines.push(...renderObject(item?.id ?? "entry", item ?? {}, 2), "---", "");
  }
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}
