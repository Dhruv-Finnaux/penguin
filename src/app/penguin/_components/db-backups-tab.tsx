"use client"

import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useMemo, useState } from "react"
import type { DbBackupData, DbBackupFileStatus, DbBackupRun } from "../_lib/types"
import { matchesQuery } from "../_lib/fuzzy"
import { AuthorTag } from "./author-tag"
import { CopyPath } from "./copy-path"
import type { Nest } from "./db-layers"
import { buildNests, colorForBackup, CopyNameButton, DbLayers, inkForBackup } from "./db-layers"
import { Collapse } from "./collapse"
import { ChevronRightIcon } from "lucide-react"
import { Highlight, SearchHighlightProvider } from "./highlight"
import { RunCard, RunTimeline } from "./run-timeline"
import { SearchBox } from "./search-box"
import { TimeLabel } from "./time-label"

const ACTION_STYLE: Record<DbBackupRun["action"], string> = {
  backup: "bg-green-600/10 text-green-700 dark:bg-green-400/15 dark:text-green-300",
  restore: "bg-amber-600/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300",
}

const STATUS_LABEL: Record<DbBackupFileStatus, string> = {
  current: "Exists",
  replaced: "Overwritten",
  deleted: "Deleted",
}

const STATUS_STYLE: Record<DbBackupFileStatus, string> = {
  current: "text-green-600 bg-green-600/10 dark:bg-green-900/50 dark:text-green-300 px-2 py-1 rounded text-xs",
  replaced: "text-muted-foreground dark:text-muted-foreground px-2 py-1 rounded text-xs",
  deleted: "text-red-600 bg-red-600/10 dark:bg-red-900/50 dark:text-red-300 px-2 py-1 rounded text-xs",
}

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${bytes} B`
}

function exactTime(iso: string) {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? "-" : format(date, "EEE, dd MMM yyyy HH:mm:ss")
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[9rem_1fr] gap-3 text-sm">
      <span className="text-xs font-semibold uppercase text-black/60 dark:text-white/60">{label}</span>
      <span className="min-w-0">{children}</span>
    </div>
  )
}

function summaryText(run: DbBackupRun) {
  return run.action === "backup"
    ? `Backed up ${run.database}`
    : `Restored ${run.database} from ${run.backupName || run.database}`
}

function FilesOnDisk({ dir, files, nests }: Pick<DbBackupData, "dir" | "files"> & { nests: Nest[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="overflow-hidden rounded-xl border bg-card cursor-pointer"
      onClick={() => setOpen((value) => !value)}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 hover:bg-accent/30">
        <button type="button" aria-expanded={open} className="flex items-center gap-2 text-left">
          <ChevronRightIcon className={cn("size-4 shrink-0 transition-transform duration-300", open && "rotate-90")} />
          <span className="text-xs font-semibold uppercase text-black dark:text-foreground">
            Backups on disk ({files.length})
          </span>
        </button>
        <CopyPath path={dir}>{dir}</CopyPath>
      </div>
      <Collapse open={open}>
        <p className="px-4 py-2 text-xs text-foreground">
          <code className="rounded bg-accent px-1 py-0.5">db restore &lt;name&gt;</code> loads that backup into the
          database your backend <code className="rounded bg-accent px-1 py-0.5">.env</code> points to, after you type
          yes.
        </p>
        {files.length === 0 ? (
          <p className="px-4 py-3 text-sm text-foreground">
            No backup files yet. Run <code className="rounded bg-accent px-1.5 py-0.5">db backup</code> in the backend.
          </p>
        ) : (
          <ul className="divide-y border-t">
            {files.map((file) => (
              <li key={file.path} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 text-sm">
                <CopyNameButton
                  name={file.name}
                  color={colorForBackup(file.name, nests)}
                  className="!text-white"
                  ink={inkForBackup(file.name, nests)}
                />
                <span className="text-xs text-foreground">{formatSize(file.sizeBytes)}</span>
                <span className="text-xs text-foreground">taken {exactTime(file.modifiedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Collapse>
    </div>
  )
}

export function DbBackupsTab({ dir, runs: allRuns, files }: DbBackupData) {
  const [keyword, setKeyword] = useState("")
  const nests = useMemo(() => buildNests(files, allRuns), [files, allRuns])
  const runs = useMemo(
    () =>
      allRuns.filter((run) => matchesQuery(keyword, [run.author, run.action, run.database, run.backupName, run.file])),
    [allRuns, keyword],
  )

  return (
    <SearchHighlightProvider query={keyword}>
      <div className="space-y-4">
        <DbLayers nests={nests} files={files} />
        <FilesOnDisk dir={dir} files={files} nests={nests} />
        {allRuns.length > 0 && (
          <SearchBox value={keyword} onChange={setKeyword} placeholder="Search by database or action" />
        )}
        <RunTimeline
          runs={runs}
          noun="event"
          empty={
            allRuns.length > 0 ? (
              "No backups match."
            ) : (
              <>
                No backups recorded yet. Run <code className="rounded bg-accent px-1.5 py-0.5">db backup</code> in the
                backend to start the timeline.
              </>
            )
          }
          renderRun={(run) => (
            <RunCard
              summary={
                <>
                  <code className="shrink-0 text-xs font-medium">
                    <TimeLabel iso={run.generatedAt} />
                  </code>
                  <span
                    className={cn(
                      "shrink-0 rounded-sm px-2 py-1.5 text-[11px] font-medium uppercase leading-none",
                      ACTION_STYLE[run.action],
                    )}
                  >
                    {run.action}
                  </span>
                  <AuthorTag name={run.author} />
                  <span className="w-10 flex-1 truncate text-sm">
                    <Highlight text={summaryText(run)} />
                  </span>
                  <span className={cn("shrink-0 text-xs", STATUS_STYLE[run.fileStatus])}>
                    {STATUS_LABEL[run.fileStatus]}
                  </span>
                </>
              }
            >
              <Field label="Database">
                <Highlight text={run.database} />
              </Field>
              {run.action === "restore" && (
                <Field label="Loaded backup">
                  <Highlight text={run.backupName || run.database} />
                </Field>
              )}
              <Field label="Backup file">
                <CopyPath path={run.file}>
                  <Highlight text={run.file} />
                </CopyPath>
              </Field>
              <Field label="Backup taken">{exactTime(run.fileModifiedAt)}</Field>
              <Field label="Size">{formatSize(run.sizeBytes)}</Field>
              {run.tables !== null && <Field label="Tables">{run.tables}</Field>}
              {run.migrations !== null && <Field label="Migrations">{run.migrations}</Field>}
              <Field label="File status">
                <span className={STATUS_STYLE[run.fileStatus]}>{STATUS_LABEL[run.fileStatus]}</span>
              </Field>
            </RunCard>
          )}
        />
      </div>
    </SearchHighlightProvider>
  )
}
