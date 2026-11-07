# 🐧 Questions · Frontend

> Generated from `data/frontend/questions.json`. Edit the JSON, not this file. 62 entries, newest first.

## seed-p0-01

| Field | Value |
|---|---|
| id | seed-p0-01 |
| code | P0-01 |
| priority | P0 |
| category | Environment and deployment |
| question | Where and how is the UI deployed (hosting platform, build pipeline, who has access)? *Why: no Dockerfile or CI in the repo; `finnaux.toml` only has Nixpacks-style install, build and start commands.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:31:30.478Z |

---

## seed-p0-02

| Field | Value |
|---|---|
| id | seed-p0-02 |
| code | P0-02 |
| priority | P0 |
| category | Environment and deployment |
| question | What is the exact value and format of `NEXT_PUBLIC_API_URL` in each environment? *Why: `src/lib/axios.ts` appends `/v1`, the socket code strips a trailing `/api`, and some download URLs fall back to `http://localhost:3000/api`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T08:53:43.157Z |

---

## seed-p0-03

| Field | Value |
|---|---|
| id | seed-p0-03 |
| code | P0-03 |
| priority | P0 |
| category | Environment and deployment |
| question | Which of the six `.env.example` variables are required, and what do the missing ones (`NEXT_PUBLIC_LOCALSTORAGE_USER_KEY`, `NEXT_PUBLIC_QUERY_PARAM_KEY`, `NEXT_PUBLIC_CRM_TICKET_ACTIVITY_URL`) need to be set to? *Why: they are defined in `src/env.js` or read directly, but not in `.env.example`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p0-04

| Field | Value |
|---|---|
| id | seed-p0-04 |
| code | P0-04 |
| priority | P0 |
| category | Environment and deployment |
| question | `next.config.js` sets `typescript.ignoreBuildErrors: true`, and `prebuild` skips type checking when `NODE_ENV=production`. Is type safety checked anywhere before a production deploy? *Why: type errors can currently ship.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p0-05

| Field | Value |
|---|---|
| id | seed-p0-05 |
| code | P0-05 |
| priority | P0 |
| category | Environment and deployment |
| question | Which branch is deployed (`main` or `dhruv`), and what is the branch and release process (`HrmsChanges`, `Pageshell`, `borrowings`, `colending`, `customer-login`, `fd` exist remotely)? *Why: unclear which are merged, abandoned or in progress.* |
| answer | "main" branch is the what is deployed and "dhruv" is the branch which is development branch managed by "Dhruv Ratan Jayaswal" and will be merged in near future. |
| answered | true |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:27:21.711Z |

---

## seed-p0-06

| Field | Value |
|---|---|
| id | seed-p0-06 |
| code | P0-06 |
| priority | P0 |
| category | Frontend and backend contract |
| question | How do we keep UI types in sync with the API when there is no OpenAPI or codegen? Is there a Swagger or Scalar URL we should use per environment? *Why: types are hand-written per feature.* |
| answer | Yes we are using Swagger for this API sync. |
| answered | true |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:31:18.734Z |

---

## seed-p0-07

| Field | Value |
|---|---|
| id | seed-p0-07 |
| code | P0-07 |
| priority | P0 |
| category | Frontend and backend contract |
| question | Response shapes vary (`rows`, `row`, `entries`). Is there a rule for which endpoints return what, and where is it documented? *Why: `AGENTS.md` warns about it; only dealers and vendors have `docs/<module>/data-flow.md`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p0-08

| Field | Value |
|---|---|
| id | seed-p0-08 |
| code | P0-08 |
| priority | P0 |
| category | Frontend and backend contract |
| question | The UI hardcodes backend-seeded IDs (`src/config/fixed-ids.ts`, `fixed-enums.ts`, `page-ids.config.ts`, `loan-process-pages.ts`, `external-api-ids.ts`). How are these seeded, and what happens if the backend reseeds with different values? *Why: the UI breaks silently.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p0-09

| Field | Value |
|---|---|
| id | seed-p0-09 |
| code | P0-09 |
| priority | P0 |
| category | Frontend and backend contract |
| question | What is the JSONata `$transform` query param pattern, and who owns the transforms (UI or backend)? *Why: used in about 90 files, for example `features/hrms/employees/api.ts`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p0-10

| Field | Value |
|---|---|
| id | seed-p0-10 |
| code | P0-10 |
| priority | P0 |
| category | Frontend and backend contract |
| question | Can we run a local backend, or do we use a shared dev API? Do we get test users with different designations? *Why: all screens depend on backend-driven permissions and menus.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p0-11

| Field | Value |
|---|---|
| id | seed-p0-11 |
| code | P0-11 |
| priority | P0 |
| category | Auth |
| question | Is the session purely a backend cookie (`withCredentials: true`) with no token in the UI? What are the cookie name, expiry and domain rules between UI and API hosts? *Why: `sameSite: none` on the backend, no Authorization header in `lib/axios.ts`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p0-12

| Field | Value |
|---|---|
| id | seed-p0-12 |
| code | P0-12 |
| priority | P0 |
| category | Auth |
| question | Why does the `User` type include a `password` field and why is the whole user object kept in localStorage (`contexts/auth.ctx.tsx`)? Does the backend ever return a password? *Why: security risk.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p0-13

| Field | Value |
|---|---|
| id | seed-p0-13 |
| code | P0-13 |
| priority | P0 |
| category | Auth |
| question | All route protection is client-side (`ProtectedProvider`, `PermissionGuard`) and there is no middleware. Does the backend enforce every right independently? *Why: client guards are bypassable.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p0-14

| Field | Value |
|---|---|
| id | seed-p0-14 |
| code | P0-14 |
| priority | P0 |
| category | Auth |
| question | `admin/layout.tsx` has its `PermissionGuard` commented out, so the rule-engine admin area is not guarded. Is that intentional? *Why: potential unauthorised access.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p1-01

| Field | Value |
|---|---|
| id | seed-p1-01 |
| code | P1-01 |
| priority | P1 |
| category | Core flows |
| question | How does the loan application stepper work (`features/loan-application/tabs/index.tsx`, about 60 lazy tabs mapped by page IDs in `config/loan-process-pages.ts`)? How does the UI know the order and completion of steps? *Why: the heart of LOS.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p1-02

| Field | Value |
|---|---|
| id | seed-p1-02 |
| code | P1-02 |
| priority | P1 |
| category | Core flows |
| question | What are the exact steps to add a new page end to end: menu entry (menu management), page ID, designation rights, `PermissionGuard`, route? *Why: pages are registered across UI config and backend data.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p1-03

| Field | Value |
|---|---|
| id | seed-p1-03 |
| code | P1-03 |
| priority | P1 |
| category | Core flows |
| question | How do the KVB tabs (submit application, upload documents, FI update) behave and which backend calls do they make? *Why: bank-facing integration.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p1-04

| Field | Value |
|---|---|
| id | seed-p1-04 |
| code | P1-04 |
| priority | P1 |
| category | Core flows |
| question | How do the LMS screens work: receipts, cash collection, loan closure, prepayment, reschedule, NPA, legal, repossession, bulk NACH? *Why: money-moving screens.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p1-05

| Field | Value |
|---|---|
| id | seed-p1-05 |
| code | P1-05 |
| priority | P1 |
| category | Core flows |
| question | How do accounting screens work, including voucher entries and decisions, maker-checker, and the voucher freeze date? *Why: `voucherFreezeDate` is in the global store and blocks editing.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p1-06

| Field | Value |
|---|---|
| id | seed-p1-06 |
| code | P1-06 |
| priority | P1 |
| category | Core flows |
| question | How should the financial year default be computed? The fallback in `getGlobalStore` sets the end date in the same year as the start, which looks wrong after April. *Why: likely bug, overwritten later from `/preferences`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p1-07

| Field | Value |
|---|---|
| id | seed-p1-07 |
| code | P1-07 |
| priority | P1 |
| category | Security and compliance |
| question | `NEXT_PUBLIC_QUERY_PARAM_KEY` is used with AES in `lib/utils.ts`. What is it for, and are we aware it ships to the browser and is not real encryption? *Why: obfuscation, not confidentiality.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p1-08

| Field | Value |
|---|---|
| id | seed-p1-08 |
| code | P1-08 |
| priority | P1 |
| category | Security and compliance |
| question | HTML from the backend is rendered with `dangerouslySetInnerHTML` (payslip, offer and joining letters, template preview). Who sanitises it, and who can edit those templates? *Why: stored XSS risk.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p1-09

| Field | Value |
|---|---|
| id | seed-p1-09 |
| code | P1-09 |
| priority | P1 |
| category | Security and compliance |
| question | The Surepass DigiBoost SDK is loaded from jsDelivr with `@latest`. Can we pin a version? *Why: supply-chain risk (`hooks/useScript.ts`).* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p1-10

| Field | Value |
|---|---|
| id | seed-p1-10 |
| code | P1-10 |
| priority | P1 |
| category | Security and compliance |
| question | KYC masking in `lib/masking.ts` guesses the type from the document name by substring ("pan" also matches "company"). What is the intended rule, and does the backend mask data too? *Why: sensitive data exposure or wrong masking.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p1-11

| Field | Value |
|---|---|
| id | seed-p1-11 |
| code | P1-11 |
| priority | P1 |
| category | Security and compliance |
| question | The `/penguin` dev tool runs `git` via `child_process` and is gated only by `NODE_ENV !== "production"`. Can it ever run on a deployed non-production build? *Why: server-side command execution.* |
| answer | No, we are maintaining the /penguin tool and it is just for the local machine for development & maintenance phase only. |
| answered | true |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:32:57.942Z |

---

## seed-p1-12

| Field | Value |
|---|---|
| id | seed-p1-12 |
| code | P1-12 |
| priority | P1 |
| category | Security and compliance |
| question | What is the status of the fixes in `docs/ucrf-report/ucrf-report-audit.md` (wrong loan type, facility status, collateral, joint-loan, balance sign and tenure codes; bureau password visible in the preview)? *Why: bureau rejection and credential exposure.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p1-13

| Field | Value |
|---|---|
| id | seed-p1-13 |
| code | P1-13 |
| priority | P1 |
| category | Security and compliance |
| question | CKYC pages sit under several route trees (`/ckyc/*`, `/lms/ckyc/*`, `/lms/ckyc-*`). Which is canonical and which should be deleted? *Why: duplicate sensitive screens.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p1-14

| Field | Value |
|---|---|
| id | seed-p1-14 |
| code | P1-14 |
| priority | P1 |
| category | Integrations |
| question | Which KYC integrations are live in the UI (Surepass, Digio, DigiPehchan, CRIF, eSign), and are they all called through backend proxies? *Why: `features/external-apis`, `config/external-api-ids.ts`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p1-15

| Field | Value |
|---|---|
| id | seed-p1-15 |
| code | P1-15 |
| priority | P1 |
| category | Integrations |
| question | How does the Digio SDK load and what happens if the CDN is unreachable? *Why: `https://ext.digio.in/sdk/v11/digio.js` loaded at runtime.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p1-16

| Field | Value |
|---|---|
| id | seed-p1-16 |
| code | P1-16 |
| priority | P1 |
| category | Integrations |
| question | How do the socket connection (chat, notifications) and SSE logs (`/v1/app-logs`) authenticate and handle reconnects? *Why: separate from axios.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p1-17

| Field | Value |
|---|---|
| id | seed-p1-17 |
| code | P1-17 |
| priority | P1 |
| category | Integrations |
| question | Who may see the live logs page (`/logs`)? *Why: backend app logs may contain sensitive data.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p1-18

| Field | Value |
|---|---|
| id | seed-p1-18 |
| code | P1-18 |
| priority | P1 |
| category | Data handling |
| question | Money is typed as `number` in many types, while `CLAUDE.md` says to treat money as formatted strings. Which is right, and where is rounding done? *Why: financial accuracy.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p1-19

| Field | Value |
|---|---|
| id | seed-p1-19 |
| code | P1-19 |
| priority | P1 |
| category | Data handling |
| question | The global mutation `onSuccess` invalidates every query. Is that intentional, and does it cause refetch storms? *Why: `providers/react-query.provider.tsx`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p1-20

| Field | Value |
|---|---|
| id | seed-p1-20 |
| code | P1-20 |
| priority | P1 |
| category | Data handling |
| question | Upload limits: UI default is 1 MB (`NEXT_PUBLIC_MAX_UPLOAD_SIZE`) while the backend limit is stored but not enforced. Which wins, and where do files get uploaded? *Why: unclear upload path and limits.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p2-01

| Field | Value |
|---|---|
| id | seed-p2-01 |
| code | P2-01 |
| priority | P2 |
| category | Data handling |
| question | Which screens are half-built (`UnderConstructionCard` in `los/los-process/[id]`, `lms/manage-applications/[id]`, `managed-portfolios/manage-lenders-loan`)? What is the plan? *Why: users can hit empty screens.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p2-02

| Field | Value |
|---|---|
| id | seed-p2-02 |
| code | P2-02 |
| priority | P2 |
| category | Data handling |
| question | The rule engine admin UI: status and who uses it? *Why: unguarded layout and unclear completeness.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p2-03

| Field | Value |
|---|---|
| id | seed-p2-03 |
| code | P2-03 |
| priority | P2 |
| category | Data handling |
| question | `manage-applications/page.tsx` and `search-loan-application.tsx` hardcode `creditApprovedAt: "TODO"` and a placeholder photo. What real data should go there? *Why: duplicated placeholder logic.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p2-04

| Field | Value |
|---|---|
| id | seed-p2-04 |
| code | P2-04 |
| priority | P2 |
| category | Data handling |
| question | How do the LOS process graph editor and CRM workflow board (`@xyflow/react`, `dagre`) persist their data? *Why: configuration screens.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p2-05

| Field | Value |
|---|---|
| id | seed-p2-05 |
| code | P2-05 |
| priority | P2 |
| category | Data handling |
| question | How do loan products, asset products, dealers, vendors, branches, areas and locations configuration screens depend on each other? *Why: setup order matters.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p2-06

| Field | Value |
|---|---|
| id | seed-p2-06 |
| code | P2-06 |
| priority | P2 |
| category | Data handling |
| question | The locations list has about 155,000 rows and pagination is reported broken. Has it been verified? *Why: from `.knowledge-transfer/day-1.md`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p2-07

| Field | Value |
|---|---|
| id | seed-p2-07 |
| code | P2-07 |
| priority | P2 |
| category | Data handling |
| question | Which settings are saved in the UI but not enforced by the backend (auto reject, reopen window, invoice prefix, file size limit, rent due date)? *Why: users may think they work.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p2-08

| Field | Value |
|---|---|
| id | seed-p2-08 |
| code | P2-08 |
| priority | P2 |
| category | Data handling |
| question | HRMS screens: employees graph, attendance and shifts, leave, payroll, performance, recruitment, letter templates. Who tests them? *Why: large module.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p2-09

| Field | Value |
|---|---|
| id | seed-p2-09 |
| code | P2-09 |
| priority | P2 |
| category | Data handling |
| question | Why do payroll and letter-template download links build URLs by hand with a `localhost:3000/api` fallback instead of using `makeRequest`? *Why: `features/hrms/payroll-management/api.ts`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p2-10

| Field | Value |
|---|---|
| id | seed-p2-10 |
| code | P2-10 |
| priority | P2 |
| category | Data handling |
| question | CRM tickets: `NEXT_PUBLIC_CRM_TICKET_ACTIVITY_URL` points where, and is the legacy link still needed? *Why: variable read outside `src/env.js`.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p2-11

| Field | Value |
|---|---|
| id | seed-p2-11 |
| code | P2-11 |
| priority | P2 |
| category | Data handling |
| question | Reports: UCRF preview with XLSX parsing, DNBS02, collection efficiency, master data. Which are production ready? *Why: regulatory.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p2-12

| Field | Value |
|---|---|
| id | seed-p2-12 |
| code | P2-12 |
| priority | P2 |
| category | Data handling |
| question | NBFC dashboards divide by 1e5 or 1e7 and use `toFixed`. What is the intended unit and rounding? *Why: reported numbers.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p2-13

| Field | Value |
|---|---|
| id | seed-p2-13 |
| code | P2-13 |
| priority | P2 |
| category | Data handling |
| question | `RightsHOC` hides UI by comparing a create date with a compare date. What business rule is that? *Why: unclear behaviour.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p2-14

| Field | Value |
|---|---|
| id | seed-p2-14 |
| code | P2-14 |
| priority | P2 |
| category | Data handling |
| question | `PermissionGuard` page IDs are reused: `TRIAL_BALANCE` is marked "does not exist" and is shared by P&L and trading account. Are rights supposed to be separate? *Why: wrong access control.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p2-15

| Field | Value |
|---|---|
| id | seed-p2-15 |
| code | P2-15 |
| priority | P2 |
| category | Data handling |
| question | What is the `customer-login` branch, and is a customer portal planned? *Why: scope.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p2-16

| Field | Value |
|---|---|
| id | seed-p2-16 |
| code | P2-16 |
| priority | P2 |
| category | Data handling |
| question | `lib/axios.ts` has a missing `break` after the 504 case, so the message is overwritten. Known? *Why: wrong error messages.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p2-17

| Field | Value |
|---|---|
| id | seed-p2-17 |
| code | P2-17 |
| priority | P2 |
| category | Data handling |
| question | The 500 ms artificial delay in dev inside `getRights`: why? *Why: slows development.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p2-18

| Field | Value |
|---|---|
| id | seed-p2-18 |
| code | P2-18 |
| priority | P2 |
| category | Data handling |
| question | What does `src/server/(los)` contain and is it used? *Why: two unexplained index files.* |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p3-01

| Field | Value |
|---|---|
| id | seed-p3-01 |
| code | P3-01 |
| priority | P3 |
| category | Data handling |
| question | Conventions: where are the up-to-date rules (`CLAUDE.md`, `AGENTS.md`), including `useFormFlow`, `page-shell`, kebab-case and import order? |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p3-02

| Field | Value |
|---|---|
| id | seed-p3-02 |
| code | P3-02 |
| priority | P3 |
| category | Data handling |
| question | Why are yup and zod both used (HRMS performance forms use zod)? Which is the standard? |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p3-03

| Field | Value |
|---|---|
| id | seed-p3-03 |
| code | P3-03 |
| priority | P3 |
| category | Data handling |
| question | Why are three headless UI libraries used (`@base-ui/react`, `@headlessui/react`, Radix)? |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p3-04

| Field | Value |
|---|---|
| id | seed-p3-04 |
| code | P3-04 |
| priority | P3 |
| category | Data handling |
| question | Dead config: `@heroui/theme` in `tailwind.config.ts`, the stray `remove` dependency, `service:build` pointing to a missing builder, and `eslint-config-next` 15.5.5 with Next 16. Can we clean it up? |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p3-05

| Field | Value |
|---|---|
| id | seed-p3-05 |
| code | P3-05 |
| priority | P3 |
| category | Data handling |
| question | `components/tabs-old.tsx` and `tabs.tsx` both exist. Which is used? |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p3-06

| Field | Value |
|---|---|
| id | seed-p3-06 |
| code | P3-06 |
| priority | P3 |
| category | Data handling |
| question | About 1,150 `: any` and 210 `as any`. Is there a plan to tighten types? |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p3-07

| Field | Value |
|---|---|
| id | seed-p3-07 |
| code | P3-07 |
| priority | P3 |
| category | Data handling |
| question | `git-commit.sh` is hard-locked to a branch named `dhruv`. Do we keep it? |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p3-08

| Field | Value |
|---|---|
| id | seed-p3-08 |
| code | P3-08 |
| priority | P3 |
| category | Data handling |
| question | `.localtrack.md`, `.penguin/`, and `.knowledge-transfer/` (day 1 only): are they meant to be maintained? |
| answer | .localtrack.md, .penguin/ are not being maintained and knowledge-transfer/ are now being maintained? |
| answered | true |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:33:39.445Z |

---

## seed-p3-09

| Field | Value |
|---|---|
| id | seed-p3-09 |
| code | P3-09 |
| priority | P3 |
| category | Data handling |
| question | Testing: there are no tests. What would you add first (forms, permission guard, money formatting)? Is Playwright acceptable? |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---

## seed-p3-10

| Field | Value |
|---|---|
| id | seed-p3-10 |
| code | P3-10 |
| priority | P3 |
| category | Data handling |
| question | Is there analytics, error tracking or monitoring planned? None exists now. |
| answer | "" |
| answered | false |
| createdAt | 2026-10-28T05:11:28.398Z |
| updatedAt | 2026-10-28T05:11:28.398Z |

---
