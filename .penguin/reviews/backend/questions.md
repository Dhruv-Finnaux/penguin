# 🐧 Questions · Backend

> Generated from `data/backend/questions.json`. Edit the JSON, not this file. 79 entries, newest first.

## q-mvz7gqqqz0ty

| Field | Value |
|---|---|
| id | q-mvz7gqqqz0ty |
| code | null |
| priority | P1 |
| category | "" |
| question | Branch and product scope on the run endpoints<br>   - The frontend no longer limits branches or products itself. When the user picks none, it sends them omitted, and relies on the contract: omitted or [] means all of the employee's assigned branches and products, and an unassigned id returns 403.<br>   - This covers POST /reports/builder/templates/:id/run and POST /reports/builder/designation-reports/:id/run.<br>   - Nothing to change if that already holds. If any run path returns loans outside the employee's assigned branches or products, please treat it as a bug, since the UI has no second check. |
| answer | "" |
| answered | false |
| createdAt | 2026-11-02T11:58:37.154Z |
| updatedAt | 2026-11-02T11:58:37.154Z |

---

## q-mvz7g7c06vs6

| Field | Value |
|---|---|
| id | q-mvz7g7c06vs6 |
| code | null |
| priority | P1 |
| category | "" |
| question | Loan Products dropdown fails with 403 for users without HRMS rights<br>   - The report filters load the user's products from GET /hrms/employees/:id/products.<br>   - That endpoint needs the HRMS Employees page right, so a user such as a cashier gets 403 and an empty product list. The report run itself works for them.<br>   - Branches are fine: we switched them to GET /dropdown/session-employee-branch, which needs no HRMS right.<br>   - Request: a session products dropdown for the logged-in employee, for example GET /dropdown/session-employee-product, returning the employee's active assigned products as { label, value } like the branch one. We will switch the filter to it as soon as it exists. Until then the filter shows a small "could not load" hint and the report still runs. |
| answer | "" |
| answered | false |
| createdAt | 2026-11-02T11:58:12.000Z |
| updatedAt | 2026-11-02T11:58:12.000Z |

---

## q-mvro5g2dn9mo

| Field | Value |
|---|---|
| id | q-mvro5g2dn9mo |
| code | null |
| priority | P2 |
| category | "" |
| question | Why All Reports are visible rather than creator's reports ?? |
| answer | It's an Business Requirement. |
| answered | true |
| createdAt | 2026-10-28T05:23:34.165Z |
| updatedAt | 2026-11-02T12:03:07.203Z |

---

## seed-b-p0-01

| Field | Value |
|---|---|
| id | seed-b-p0-01 |
| code | B-P0-01 |
| priority | P0 |
| category | Environments, deploy, rollback |
| question | How are production and staging deployed today? Which host or platform, which build command, and who has access? *Why: no Dockerfile and no `.github/workflows`; `nixpacks.toml` builds with `nest build --builder=swc`, but `package.json` builds with tsup and `nest-cli.json` says webpack.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-02

| Field | Value |
|---|---|
| id | seed-b-p0-02 |
| code | B-P0-02 |
| priority | P0 |
| category | Environments, deploy, rollback |
| question | Which build command does the real deploy run, and which of `nixpacks.toml`, `tsup.config.ts` and `nest-cli.json` are dead? *Why: three conflicting build definitions.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-03

| Field | Value |
|---|---|
| id | seed-b-p0-03 |
| code | B-P0-03 |
| priority | P0 |
| category | Environments, deploy, rollback |
| question | How do we roll back a bad release, and how are DB backups taken and restored? *Why: nothing in the repo describes either.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-04

| Field | Value |
|---|---|
| id | seed-b-p0-04 |
| code | B-P0-04 |
| priority | P0 |
| category | Environments, deploy, rollback |
| question | How many environments exist (dev, staging, UAT, prod), and which one points to KVB SIT vs production? *Why: `libs/kvb-sdk/src/kvb-sdk.service.ts` hardcodes `https://api-sit.kvbank.in`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-05

| Field | Value |
|---|---|
| id | seed-b-p0-05 |
| code | B-P0-05 |
| priority | P0 |
| category | Environments, deploy, rollback |
| question | Is there any CI at all outside the repo? The only gates seem to be Husky hooks (typecheck, build, commitlint). *Why: no CI config in the repo.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-06

| Field | Value |
|---|---|
| id | seed-b-p0-06 |
| code | B-P0-06 |
| priority | P0 |
| category | Database, migrations, seeds |
| question | What is the real migration workflow: `drizzle-kit push` or `generate` plus `migrate`? Where is the migration history? *Why: `/drizzle` and `src/brewer` are gitignored, so no migration history is committed.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-07

| Field | Value |
|---|---|
| id | seed-b-p0-07 |
| code | B-P0-07 |
| priority | P0 |
| category | Database, migrations, seeds |
| question | Where is the seed data and `src/brewer/run-seed.ts`, which `db:seed` points to? Can you hand over the seed so a fresh DB can be built? *Why: the file is missing from the checkout.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-08

| Field | Value |
|---|---|
| id | seed-b-p0-08 |
| code | B-P0-08 |
| priority | P0 |
| category | Database, migrations, seeds |
| question | How are the SQL functions, views and triggers in `src/drizzle/functions\|views\|triggers` applied to a database? Are they pushed or run by hand? *Why: loan financial logic (DPD, NPA classification, EMI summary, template variables) lives in SQL, and no apply mechanism is visible.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-09

| Field | Value |
|---|---|
| id | seed-b-p0-09 |
| code | B-P0-09 |
| priority | P0 |
| category | Database, migrations, seeds |
| question | How do the hardcoded master IDs in `fixed-cuids.ts` (caste, gender, vendor type, receipt sub-types, documents) get created? What breaks if a reseed produces different IDs? *Why: the UI hardcodes the same IDs.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-10

| Field | Value |
|---|---|
| id | seed-b-p0-10 |
| code | B-P0-10 |
| priority | P0 |
| category | Database, migrations, seeds |
| question | Can we get a sanitized DB dump or staging DB to develop against? *Why: there is no way to build realistic data otherwise.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-11

| Field | Value |
|---|---|
| id | seed-b-p0-11 |
| code | B-P0-11 |
| priority | P0 |
| category | Database, migrations, seeds |
| question | Is `patches/drizzle-orm@0.41.0.patch` still applied, given `package.json` depends on `drizzle-orm ^0.45.2`? *Why: the patch looks stale and may silently not apply.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-12

| Field | Value |
|---|---|
| id | seed-b-p0-12 |
| code | B-P0-12 |
| priority | P0 |
| category | Secrets |
| question | Where do the real production secrets live, who can rotate them, and what is the rotation procedure? *Why: `.env` exists locally with all variables set.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-13

| Field | Value |
|---|---|
| id | seed-b-p0-13 |
| code | B-P0-13 |
| priority | P0 |
| category | Secrets |
| question | `docker-compose.yml` (tracked) hardcodes Postgres and MinIO credentials; `password.ts` and `ssl/localhost-key.pem` are tracked. Were any of these ever used outside local dev? Should they be rotated? *Why: credentials and a private key are in git history.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-14

| Field | Value |
|---|---|
| id | seed-b-p0-14 |
| code | B-P0-14 |
| priority | P0 |
| category | Secrets |
| question | Why is `NODE_TLS_REJECT_UNAUTHORIZED` an env var, what is it set to in each environment, and is TLS verification disabled anywhere? *Why: usually means TLS checks are turned off.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-15

| Field | Value |
|---|---|
| id | seed-b-p0-15 |
| code | B-P0-15 |
| priority | P0 |
| category | Secrets |
| question | Which env vars are required but missing from `.env.example`? Please confirm the list: `KYC_ENCRYPTION_KEY`, `KYC_HASH_KEY`, `EXTERNAL_API_CREDENTIALS_ENCRYPTION_KEY`, `CHAT_SERVER_ENCRYPTION_KEY`, `CKYC_CERSAI_*`, `CKYC_AGGREGATOR_*`. *Why: a new developer cannot boot features without them, and losing a KYC key would make stored data unreadable.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-16

| Field | Value |
|---|---|
| id | seed-b-p0-16 |
| code | B-P0-16 |
| priority | P0 |
| category | Core business flow |
| question | Walk us through the loan lifecycle end to end: inquiry, application, process pipeline, sanction, disbursement, repayment, closure. Which process pages are mandatory for each loan product? *Why: `ProcessOrchestrator` (`los/loan-application/process-orchestrator`, about 5,000 lines) drives everything and is only configured through DB data.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-17

| Field | Value |
|---|---|
| id | seed-b-p0-17 |
| code | B-P0-17 |
| priority | P0 |
| category | Core business flow |
| question | Who or what triggers NPA marking, DPD updates, EMI-due reminders, NACH presentation and pre-due notifications? *Why: only four cron jobs exist (log flush, MCLR 00:05 IST, hourly attendance, monthly leave), none of them for collections.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-18

| Field | Value |
|---|---|
| id | seed-b-p0-18 |
| code | B-P0-18 |
| priority | P0 |
| category | Core business flow |
| question | What is the KVB co-lending flow in production (application, T2 update and submit, document share, e-sign, biometric, callbacks) and what is the plan for cutting over from SIT? *Why: callbacks `Sanction`, `CIBILRejection`, `DocVerification`, `PaymentConfirmation` drive loan status.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-19

| Field | Value |
|---|---|
| id | seed-b-p0-19 |
| code | B-P0-19 |
| priority | P0 |
| category | Core business flow |
| question | What are the exact money and rounding rules (ROUND_HALF_UP, `lib/rounding.ts`), the EMI methods, pre-EMI interest, 360 vs 365 day basis and floating-rate reset? *Why: `lib/calc` has no tests.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-20

| Field | Value |
|---|---|
| id | seed-b-p0-20 |
| code | B-P0-20 |
| priority | P0 |
| category | Core business flow |
| question | Which parts of the system are live in production today and which are still in development? *Why: UCRF reports, KYC provider config, policy redesign, and many template variables are mid-work.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-21

| Field | Value |
|---|---|
| id | seed-b-p0-21 |
| code | B-P0-21 |
| priority | P0 |
| category | Access and ownership |
| question | Who owns each area (LOS, LMS, accounting, HRMS, integrations), and who can we ask after you leave? *Why: `CODEOWNERS` lists one person for everything.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p0-22

| Field | Value |
|---|---|
| id | seed-b-p0-22 |
| code | B-P0-22 |
| priority | P0 |
| category | Access and ownership |
| question | What are the repository, branch and release rules? Which branch is deployable (`main`, `dhruv`), and who approves merges? *Why: current branch is `dhruv` with uncommitted UCRF work.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-01

| Field | Value |
|---|---|
| id | seed-b-p1-01 |
| code | B-P1-01 |
| priority | P1 |
| category | Auth and access control |
| question | How does page-level RBAC work (`@RequirePageRight`, `designationMenuPages`, designation `level`)? How are new pages and rights registered? *Why: every controller depends on this.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-02

| Field | Value |
|---|---|
| id | seed-b-p1-02 |
| code | B-P1-02 |
| priority | P1 |
| category | Auth and access control |
| question | Why do some rules check `designation.name === 'Admin'` (for example MCLR apply) instead of a right? *Why: a rename breaks it, and it is a privilege-escalation risk.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-03

| Field | Value |
|---|---|
| id | seed-b-p1-03 |
| code | B-P1-03 |
| priority | P1 |
| category | Auth and access control |
| question | Is data scoped by branch, zone or area in queries, or only hidden in the UI? *Why: no tenancy layer is visible.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-04

| Field | Value |
|---|---|
| id | seed-b-p1-04 |
| code | B-P1-04 |
| priority | P1 |
| category | Auth and access control |
| question | Does `validateBearerToken` enforce the `allowedDomains` claim for service accounts? Which scopes exist and who uses them? *Why: it was not fully verified (`auth/external-auth.constants.ts`).* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-05

| Field | Value |
|---|---|
| id | seed-b-p1-05 |
| code | B-P1-05 |
| priority | P1 |
| category | Auth and access control |
| question | What happens when Redis is down? `main.ts` warns but still builds `RedisStore` with a null client. *Why: logins would fail at runtime.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-06

| Field | Value |
|---|---|
| id | seed-b-p1-06 |
| code | B-P1-06 |
| priority | P1 |
| category | Auth and access control |
| question | Why is the session TTL hardcoded to 28800 and the cookie `sameSite: 'none'`? Is `MAX_CONCURRENT_SESSIONS` enforced? *Why: security and UX behaviour.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-07

| Field | Value |
|---|---|
| id | seed-b-p1-07 |
| code | B-P1-07 |
| priority | P1 |
| category | Known bugs and risks |
| question | `webhooks/webhooks.service.ts` `handleKVBWebhook` opens a transaction but writes through `databaseService.db`, not `tx`. Is this known and has it caused inconsistencies? *Why: callback log and status update are not atomic.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-08

| Field | Value |
|---|---|
| id | seed-b-p1-08 |
| code | B-P1-08 |
| priority | P1 |
| category | Known bugs and risks |
| question | Which items in `docs/receipt-workflow-bug-report.md` are fixed (receiptTypes join, `writeOffAmount` vs `writtenOffAmount`, pending-only guard on legal receipts, missing `authorisedAt`)? *Why: accounting correctness.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-09

| Field | Value |
|---|---|
| id | seed-b-p1-09 |
| code | B-P1-09 |
| priority | P1 |
| category | Known bugs and risks |
| question | Is the possible double tax (rate applied to CGST/SGST without `/2`) in `loan-application.service.ts` real? The `CLAUDE.md` line reference is stale. *Why: money audit table.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-10

| Field | Value |
|---|---|
| id | seed-b-p1-10 |
| code | B-P1-10 |
| priority | P1 |
| category | Known bugs and risks |
| question | What should the KVB T2 tax value be? (`integrations/kvb/kvb.service.ts` has "TODO: WHAT TO DO???".) *Why: goes to a bank.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-11

| Field | Value |
|---|---|
| id | seed-b-p1-11 |
| code | B-P1-11 |
| priority | P1 |
| category | Known bugs and risks |
| question | The chat encryption service falls back to a hardcoded dev key if `CHAT_SERVER_ENCRYPTION_KEY` is unset. Is it set in production, and is "E2E" chat really encrypted with a shared server key? *Why: `loan-application-chat-encryption.service.ts`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-12

| Field | Value |
|---|---|
| id | seed-b-p1-12 |
| code | B-P1-12 |
| priority | P1 |
| category | Known bugs and risks |
| question | The app logs the full `DATABASE_URL` on boot. Is that visible in production logs? *Why: `drizzle/drizzle.module.ts`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-13

| Field | Value |
|---|---|
| id | seed-b-p1-13 |
| code | B-P1-13 |
| priority | P1 |
| category | Known bugs and risks |
| question | The request-log buffer flushes to the `log` table every 5 seconds in memory. Is data loss on crash acceptable, and does it break with multiple instances? *Why: `app.controller.ts`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-14

| Field | Value |
|---|---|
| id | seed-b-p1-14 |
| code | B-P1-14 |
| priority | P1 |
| category | Known bugs and risks |
| question | `uncaughtException` is only logged and the process continues. Is that intentional? *Why: could leave the app in a bad state.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-15

| Field | Value |
|---|---|
| id | seed-b-p1-15 |
| code | B-P1-15 |
| priority | P1 |
| category | Known bugs and risks |
| question | Why does `customer.service.ts` delete and re-insert records on update, and what references them? *Why: line 358 comment says temporary.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-16

| Field | Value |
|---|---|
| id | seed-b-p1-16 |
| code | B-P1-16 |
| priority | P1 |
| category | Known bugs and risks |
| question | Which of the remaining TODOs are release-blocking: mandatory-question validation in FI, PD, TVR and file check; eligibility checks on valuations and technicals; send-back validation; webhook input validation? *Why: missing validation allows incomplete applications through.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-17

| Field | Value |
|---|---|
| id | seed-b-p1-17 |
| code | B-P1-17 |
| priority | P1 |
| category | Integrations |
| question | Which providers are live for KYC, CKYC (CERSAI vs aggregator), credit bureau and e-sign, and which are test only? *Why: `ckyc-provider.factory.ts` switches between them.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-18

| Field | Value |
|---|---|
| id | seed-b-p1-18 |
| code | B-P1-18 |
| priority | P1 |
| category | Integrations |
| question | How far did the DB-driven provider config go (`external/shared`, `schema/third-party/api-*`, `docs/kyc-provider-config-system-design.md`, backfill scripts)? Are credentials read from env or from the DB today? *Why: two config sources are active.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-19

| Field | Value |
|---|---|
| id | seed-b-p1-19 |
| code | B-P1-19 |
| priority | P1 |
| category | Integrations |
| question | What is the DB credential encryption key lifecycle (`EXTERNAL_API_CREDENTIALS_ENCRYPTION_KEY`)? *Why: losing it loses all stored credentials.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-20

| Field | Value |
|---|---|
| id | seed-b-p1-20 |
| code | B-P1-20 |
| priority | P1 |
| category | Integrations |
| question | Which SMS provider is used, and why is the API key sent in the URL query string? Which message templates and DLT registrations are in use? *Why: `SMS_*` config, compliance.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-21

| Field | Value |
|---|---|
| id | seed-b-p1-21 |
| code | B-P1-21 |
| priority | P1 |
| category | Integrations |
| question | Which email, S3 bucket and Telegram chat are in each environment, and who monitors the Telegram alerts? *Why: operational alerting.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-22

| Field | Value |
|---|---|
| id | seed-b-p1-22 |
| code | B-P1-22 |
| priority | P1 |
| category | Integrations |
| question | How does the Customer App API integration work, and who owns the other side? *Why: `customer-app/` has its own client ID and secret and token cache.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-23

| Field | Value |
|---|---|
| id | seed-b-p1-23 |
| code | B-P1-23 |
| priority | P1 |
| category | Integrations |
| question | What are the rate limits, retry, timeout and failure handling for each external API? *Why: no queues exist, calls run in-request.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p1-24

| Field | Value |
|---|---|
| id | seed-b-p1-24 |
| code | B-P1-24 |
| priority | P1 |
| category | Integrations |
| question | Is there any WhatsApp sending, or only the enum value? *Why: channel exists in templates but no sender found.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p2-01

| Field | Value |
|---|---|
| id | seed-b-p2-01 |
| code | B-P2-01 |
| priority | P2 |
| category | Loan origination (LOS) |
| question | How are process flows configured per loan product (parent and child pages, swap, send-back, hold, revert)? *Why: `los-process.service.ts`, `master.process.ts`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p2-02

| Field | Value |
|---|---|
| id | seed-b-p2-02 |
| code | B-P2-02 |
| priority | P2 |
| category | Loan origination (LOS) |
| question | How do deviations and fee deviations work, who approves by amount range, and is the fee-deviation join in `fee-deviations.service.ts` correct? *Why: suspicious join noted.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p2-03

| Field | Value |
|---|---|
| id | seed-b-p2-03 |
| code | B-P2-03 |
| priority | P2 |
| category | Loan origination (LOS) |
| question | What is the status of the policy redesign (`docs/POLICY-SYSTEM-REDESIGN.md`)? *Why: ejsScript per policy vs templateVariableId.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p2-04

| Field | Value |
|---|---|
| id | seed-b-p2-04 |
| code | B-P2-04 |
| priority | P2 |
| category | Loan origination (LOS) |
| question | How do templates and template variables work (EJS, `getLoanApplicationTemplateVariableValues`), and which variables are still placeholders? *Why: `template-variables-progress.md`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p2-05

| Field | Value |
|---|---|
| id | seed-b-p2-05 |
| code | B-P2-05 |
| priority | P2 |
| category | Loan origination (LOS) |
| question | What does the rule engine and workflow do (`expr-eval`, rulesets), and why does `workflow.update` delete and re-insert ruleset links? *Why: data loss risk on edit.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p2-06

| Field | Value |
|---|---|
| id | seed-b-p2-06 |
| code | B-P2-06 |
| priority | P2 |
| category | Loan origination (LOS) |
| question | Which sequences use `strict-sequences` and what happens on gaps? *Why: row-locked numbering.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p2-07

| Field | Value |
|---|---|
| id | seed-b-p2-07 |
| code | B-P2-07 |
| priority | P2 |
| category | Loan management (LMS) |
| question | What are the receipt workflow rules (create, entries, authorise) and the accounting entries each type creates? *Why: `lms/receipt-workflow`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p2-08

| Field | Value |
|---|---|
| id | seed-b-p2-08 |
| code | B-P2-08 |
| priority | P2 |
| category | Loan management (LMS) |
| question | How do vehicle repossession and release accounting work (`docs/vehicle-repossession-release-flow.md`)? *Why: accounting only at repossession authorisation and release receipt.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p2-09

| Field | Value |
|---|---|
| id | seed-b-p2-09 |
| code | B-P2-09 |
| priority | P2 |
| category | Loan management (LMS) |
| question | How do legal marking, settlement and NPA regularise work, and what do the comments about `AUTHORISED` NPA marking mean? *Why: doubts in code comments.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p2-10

| Field | Value |
|---|---|
| id | seed-b-p2-10 |
| code | B-P2-10 |
| priority | P2 |
| category | Loan management (LMS) |
| question | How do closure, prepayment and reschedule work, including MCLR floating-rate reset by the 00:05 cron? *Why: runs as a synthetic session and changes loans daily.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p2-11

| Field | Value |
|---|---|
| id | seed-b-p2-11 |
| code | B-P2-11 |
| priority | P2 |
| category | Loan management (LMS) |
| question | How do collection assignment and eligible lists work? *Why: `lms/collection`, `assignment-lists`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p2-12

| Field | Value |
|---|---|
| id | seed-b-p2-12 |
| code | B-P2-12 |
| priority | P2 |
| category | Loan management (LMS) |
| question | NACH: how are registration, presentation and bounces handled? *Why: `nach-entries`, `los/nach`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p2-13

| Field | Value |
|---|---|
| id | seed-b-p2-13 |
| code | B-P2-13 |
| priority | P2 |
| category | Accounting, reports, HR |
| question | How do vouchers, account groups and heads, tax slabs, borrowings and the voucher freeze date work? *Why: `accounts/*`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p2-14

| Field | Value |
|---|---|
| id | seed-b-p2-14 |
| code | B-P2-14 |
| priority | P2 |
| category | Accounting, reports, HR |
| question | What is the state of UCRF (consumer TUDF, commercial PIPE, MFI PIPE), the field and collection gap docs, and the uncommitted work? *Why: regulatory submissions.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p2-15

| Field | Value |
|---|---|
| id | seed-b-p2-15 |
| code | B-P2-15 |
| priority | P2 |
| category | Accounting, reports, HR |
| question | How are DNBS02, collection efficiency and the NBFC dashboard computed and validated? *Why: regulatory and management reports.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p2-16

| Field | Value |
|---|---|
| id | seed-b-p2-16 |
| code | B-P2-16 |
| priority | P2 |
| category | Accounting, reports, HR |
| question | HRMS: attendance cron, leave overlap bug in `leave-management.service.ts`, payroll and recruitment flows. *Why: flagged in the audit.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p2-17

| Field | Value |
|---|---|
| id | seed-b-p2-17 |
| code | B-P2-17 |
| priority | P2 |
| category | Accounting, reports, HR |
| question | CRM: ticket workflow and how it links to loans. *Why: `crm/`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p2-18

| Field | Value |
|---|---|
| id | seed-b-p2-18 |
| code | B-P2-18 |
| priority | P2 |
| category | Accounting, reports, HR |
| question | What does the api-gateway batch endpoint do and who uses it (`docs/api-gateway-spec.md`)? *Why: bulk calls bypass normal flow.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p2-19

| Field | Value |
|---|---|
| id | seed-b-p2-19 |
| code | B-P2-19 |
| priority | P2 |
| category | Accounting, reports, HR |
| question | Why do `attachment/` and `attachments/` both exist? *Why: duplicate modules.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p2-20

| Field | Value |
|---|---|
| id | seed-b-p2-20 |
| code | B-P2-20 |
| priority | P2 |
| category | Accounting, reports, HR |
| question | Import-data and message-configuration: how is bulk data imported and who uses it? *Why: `configurations/import-data`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p3-01

| Field | Value |
|---|---|
| id | seed-b-p3-01 |
| code | B-P3-01 |
| priority | P3 |
| category | Accounting, reports, HR |
| question | `CLAUDE.md` says Biome but the repo uses oxlint and oxfmt. Which is the standard? *Why: conflicting docs.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p3-02

| Field | Value |
|---|---|
| id | seed-b-p3-02 |
| code | B-P3-02 |
| priority | P3 |
| category | Accounting, reports, HR |
| question | Eight AI-rules files (`CLAUDE.md`, `AGENTS.md`, `AI.md`, and others) are identical; `sync:ai-rules` keeps them in sync. Which do we keep? *Why: clutter.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p3-03

| Field | Value |
|---|---|
| id | seed-b-p3-03 |
| code | B-P3-03 |
| priority | P3 |
| category | Accounting, reports, HR |
| question | The root `README.md` is a change note, not a setup guide. Is there an onboarding doc elsewhere? |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p3-04

| Field | Value |
|---|---|
| id | seed-b-p3-04 |
| code | B-P3-04 |
| priority | P3 |
| category | Accounting, reports, HR |
| question | `CLAUDE.md` bans `any` and optional chaining, but the code uses both widely. Is the rule enforced? *Why: lint vs reality.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p3-05

| Field | Value |
|---|---|
| id | seed-b-p3-05 |
| code | B-P3-05 |
| priority | P3 |
| category | Accounting, reports, HR |
| question | What should we do with stale files: `loan-application.module.ts.codex.bak`, `nbfc-dashboard-mockup.html`, `cuid.ts`, `scripts/menu.sh`, `.claude/worktrees/*`, and the `kvb-api` lib listed in `nest-cli.json` but missing? |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p3-06

| Field | Value |
|---|---|
| id | seed-b-p3-06 |
| code | B-P3-06 |
| priority | P3 |
| category | Accounting, reports, HR |
| question | Is `start:debug` (nest start) usable with the tsup build? |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p3-07

| Field | Value |
|---|---|
| id | seed-b-p3-07 |
| code | B-P3-07 |
| priority | P3 |
| category | Accounting, reports, HR |
| question | Is there a plan to split `loan-application.service.ts` (6,249 lines) and `process-orchestrator.ts` (5,023 lines)? |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p3-08

| Field | Value |
|---|---|
| id | seed-b-p3-08 |
| code | B-P3-08 |
| priority | P3 |
| category | Accounting, reports, HR |
| question | What monitoring, APM or error tracking is planned beyond the DB log table, SSE logs, Telegram and `/healthz`? |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p3-09

| Field | Value |
|---|---|
| id | seed-b-p3-09 |
| code | B-P3-09 |
| priority | P3 |
| category | Accounting, reports, HR |
| question | What test strategy do you recommend? There are no tests. Start with `lib/calc` and rounding? |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---

## seed-b-p3-10

| Field | Value |
|---|---|
| id | seed-b-p3-10 |
| code | B-P3-10 |
| priority | P3 |
| category | Accounting, reports, HR |
| question | Swagger is forced open in development; the host-block code is commented out. Is that intentional, and is Swagger off in production? |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T09:24:35.522Z |
| updatedAt | 2026-10-28T09:24:35.522Z |

---
