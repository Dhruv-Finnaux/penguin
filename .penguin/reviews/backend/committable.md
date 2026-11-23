# 🐧 Committable · Backend

> Generated from `data/backend/committable.json`. Edit the JSON, not this file. 26 entries, newest first.

## committable-26

| Field | Value |
|---|---|
| id | committable-26 |
| generatedAt | 2026-11-21T12:22:59+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| verdict | needs-attention |
| files.total | 15 |
| files.staged | 0 |
| files.unstaged | 13 |
| files.untracked | 2 |

### attention (1)

| path | line | priority | issue | fix |
|---|---|---|---|---|
| apps/finnaux-api/src/drizzle/schema/loan-applications.schema.ts | 1726 | medium | Schema change without its migration | Apply stash@{0} (drizzle/0011_finnaux_esign.sql, snapshot, journal, seed) and push it together with this code. |

### safeFiles (14)

- apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/dto/update-loan-document.dto.ts
- apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/loan-documents.module.ts
- apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/loan-documents.service.ts
- apps/finnaux-api/src/configurations/templates/templates.module.ts
- apps/finnaux-api/src/configurations/templates/templates.service.ts
- apps/finnaux-api/src/drizzle/schema/enum-map.ts
- apps/finnaux-api/src/drizzle/schema/enums.ts
- apps/finnaux-api/src/external/finnaux/finnaux.service.ts
- apps/finnaux-api/src/los/loan-application/documents/document.service.ts
- apps/finnaux-api/src/los/loan-application/esign/dto/index.ts
- apps/finnaux-api/src/los/loan-application/esign/esign.controller.ts
- apps/finnaux-api/src/los/loan-application/esign/esign.service.ts
- apps/finnaux-api/src/external/finnaux/finnaux-esign-audit-trail.ts
- apps/finnaux-api/src/los/loan-application/esign/dto/get-esign-audit-trail.dto.ts

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <changed .ts files> | passed |
| grey | tests | not run: no test command configured |

### advice (1)

- honest take: applied as a strict review; no items lowered

---

## committable-25

| Field | Value |
|---|---|
| id | committable-25 |
| generatedAt | 2026-11-20T16:50:15+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| verdict | needs-attention |
| files.total | 21 |
| files.staged | 0 |
| files.unstaged | 19 |
| files.untracked | 2 |

### attention (3)

| path | line | priority | issue | fix |
|---|---|---|---|---|
| apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/loan-documents.service.ts | 27 | medium | Blocks saving an existing product | Product 01M5YAN7CTDQ6NMNH1V9P8B85P has eSign on with non-print template 'Agreement Letter My Demo'; its documents page now fails to save until that template is made print friendly or eSign is turned off there. |
| apps/finnaux-api/src/los/loan-application/templates/templates.service.ts | 104 | medium | Existing template preview PDF changes | The shared /pdf preview route was Letter size with no backgrounds; it is now A4 with backgrounds and waits for network idle, so every template preview looks different and may load slower. |
| apps/finnaux-api/src/drizzle/schema/templates.schema.ts | 49 | low | Deploy needs eSign columns first | Local DB has the columns; any other DB without them breaks templates, notification templates and loan documents reads until the SQL or migration runs. |

### safeFiles (18)

- apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/dto/update-loan-document.dto.ts
- apps/finnaux-api/src/configurations/templates/dto/create-template.dto.ts
- apps/finnaux-api/src/configurations/templates/dto/index.ts
- apps/finnaux-api/src/configurations/templates/templates.service.ts
- apps/finnaux-api/src/drizzle/schema/enum-map.ts
- apps/finnaux-api/src/drizzle/schema/enums.ts
- apps/finnaux-api/src/drizzle/schema/loan-applications.schema.ts
- apps/finnaux-api/src/external/finnaux/finnaux.service.ts
- apps/finnaux-api/src/fixed-cuids.ts
- apps/finnaux-api/src/los/loan-application/documents/document.service.ts
- apps/finnaux-api/src/los/loan-application/esign/dto/create-esign-request.dto.ts
- apps/finnaux-api/src/los/loan-application/esign/dto/index.ts
- apps/finnaux-api/src/los/loan-application/esign/esign.controller.ts
- apps/finnaux-api/src/los/loan-application/esign/esign.module.ts
- apps/finnaux-api/src/los/loan-application/esign/esign.service.ts
- apps/finnaux-api/src/los/loan-application/templates/templates.controller.ts
- apps/finnaux-api/src/configurations/templates/dto/template-esign-signer.dto.ts
- apps/finnaux-api/src/los/loan-application/esign/dto/run-esign-action.dto.ts

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <21 changed .ts files> | passed |
| grey | tests | not run: no test command configured in CLAUDE.md |

### advice (3)

- make sure nothing that worked stops working: checked every changed file against other callers and the local DB; 2 medium and 1 low regression risks listed
- changes must stay inside eSign only: 2 changes reach beyond eSign (shared template PDF preview, loan product documents save validation); listed; Finnaux client logging change is opt-in and leaves Aadhaar, PAN, DL and RC calls unchanged
- not catastrophic: no data deletion, no change to Digio, KYC, RC or notification flows beyond additive response fields; Digio receivers fallback only runs if Digio is reselected

---

## committable-24

| Field | Value |
|---|---|
| id | committable-24 |
| generatedAt | 2026-11-20T16:43:47+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| verdict | needs-attention |
| files.total | 21 |
| files.staged | 0 |
| files.unstaged | 19 |
| files.untracked | 2 |

### attention (2)

| path | line | priority | issue | fix |
|---|---|---|---|---|
| apps/finnaux-api/src/los/loan-application/esign/esign.service.ts | 770 | medium | New date normalizer helper added | AGENTS.md bans date normalizer helpers; confirm this third-party ingestion exception or reuse an existing origin parser. |
| apps/finnaux-api/src/drizzle/schema/templates.schema.ts | null | low | Schema change without migration | Migration is deferred by choice; add it to drizzle/ before opening the PR. |

### safeFiles (19)

- apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/dto/update-loan-document.dto.ts
- apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/loan-documents.service.ts
- apps/finnaux-api/src/configurations/templates/dto/create-template.dto.ts
- apps/finnaux-api/src/configurations/templates/dto/index.ts
- apps/finnaux-api/src/configurations/templates/templates.service.ts
- apps/finnaux-api/src/drizzle/schema/enum-map.ts
- apps/finnaux-api/src/drizzle/schema/enums.ts
- apps/finnaux-api/src/drizzle/schema/loan-applications.schema.ts
- apps/finnaux-api/src/external/finnaux/finnaux.service.ts
- apps/finnaux-api/src/fixed-cuids.ts
- apps/finnaux-api/src/los/loan-application/documents/document.service.ts
- apps/finnaux-api/src/los/loan-application/esign/dto/create-esign-request.dto.ts
- apps/finnaux-api/src/los/loan-application/esign/dto/index.ts
- apps/finnaux-api/src/los/loan-application/esign/esign.controller.ts
- apps/finnaux-api/src/los/loan-application/esign/esign.module.ts
- apps/finnaux-api/src/los/loan-application/templates/templates.controller.ts
- apps/finnaux-api/src/los/loan-application/templates/templates.service.ts
- apps/finnaux-api/src/configurations/templates/dto/template-esign-signer.dto.ts
- apps/finnaux-api/src/los/loan-application/esign/dto/run-esign-action.dto.ts

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <21 changed .ts files> | passed |
| grey | tests | not run: no test command configured in CLAUDE.md |

### advice (1)

- honest review: no specific item to match; strict scan applied, nothing suppressed

---

## committable-23

| Field | Value |
|---|---|
| id | committable-23 |
| generatedAt | 2026-11-17T12:26:52+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| verdict | committable |
| files.total | 1 |
| files.staged | 0 |
| files.unstaged | 1 |
| files.untracked | 0 |

### attention (0)

_Empty._

### safeFiles (1)

- apps/finnaux-api/src/external/finnaux/finnaux.service.ts

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/external/finnaux | passed |
| grey | tests | not run: no test command configured |

### advice (1)

- honest review: no conditions to apply; scanned honestly, the debug console.log lines and the cache bypass are gone from the diff, nothing found.

---

## committable-22

| Field | Value |
|---|---|
| id | committable-22 |
| generatedAt | 2026-11-17T12:24:30+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| verdict | needs-attention |
| files.total | 1 |
| files.staged | 0 |
| files.unstaged | 1 |
| files.untracked | 0 |

### attention (4)

| path | line | priority | issue | fix |
|---|---|---|---|---|
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | 317 | medium | console.log prints Aadhaar response | Remove this debug log before committing; it writes personal data to the server logs. |
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | 460 | medium | console.log prints PAN response | Remove this debug log before committing; it writes personal data to the server logs. |
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | 179 | low | Cache bypass commented out (Aadhaar) | Restore the cache read before committing, or every verify call is charged and inserts duplicate rows. |
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | 364 | low | Cache bypass commented out (PAN) | Restore the cache read before committing, or every verify call is charged and inserts duplicate rows. |

### safeFiles (0)

_Empty._

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/external/finnaux/finnaux.service.ts | passed |
| grey | tests | not run: no test command configured |

### advice (1)

- honest review: no conditions to apply; reported the temporary debug logs and cache bypass as they are, even though you planned to remove them.

---

## committable-21

| Field | Value |
|---|---|
| id | committable-21 |
| generatedAt | 2026-11-16T15:40:23+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| verdict | committable |
| files.total | 1 |
| files.staged | 0 |
| files.unstaged | 1 |
| files.untracked | 0 |

### attention (1)

| path | line | priority | issue | fix |
|---|---|---|---|---|
| apps/finnaux-api/src/external/finnaux/finnaux.controller.ts | 13 | low | Paid routes need login only | Deferred by the user: add a permission guard and a throttle later. |

### safeFiles (1)

- apps/finnaux-api/src/external/finnaux/finnaux.service.ts

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/external/finnaux/finnaux.service.ts | passed |
| grey | tests | not run: no test command configured |

### advice (0)

_Empty._

---

## committable-20

| Field | Value |
|---|---|
| id | committable-20 |
| generatedAt | 2026-11-16T15:36:46+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| verdict | committable |
| files.total | 1 |
| files.staged | 0 |
| files.unstaged | 1 |
| files.untracked | 0 |

### attention (2)

| path | line | priority | issue | fix |
|---|---|---|---|---|
| apps/finnaux-api/src/external/finnaux/finnaux.controller.ts | 13 | low | Paid routes need login only | Deferred by the user: add a permission guard and a throttle later (last-commit finding F4). |
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | 296 | low | raw now null, frontend unconfirmed | Confirm with the frontend team that nothing reads the raw field. |

### safeFiles (1)

- apps/finnaux-api/src/external/finnaux/finnaux.service.ts

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/external/finnaux/finnaux.service.ts | passed |
| grey | tests | not run: no test command configured |

### advice (2)

- Check current changes against last-commit findings F1-F5: F1, F2, F3 and F5 are fixed in finnaux.service.ts; F4 is deferred by the user and listed as a low note; nothing else remains to solve.
- Write a message for the frontend team: written in the chat reply.

---

## committable-19

| Field | Value |
|---|---|
| id | committable-19 |
| generatedAt | 2026-11-16T13:47:36+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| verdict | needs-attention |
| files.total | 13 |
| files.staged | 0 |
| files.unstaged | 6 |
| files.untracked | 7 |

### attention (6)

| path | line | priority | issue | fix |
|---|---|---|---|---|
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | 111 | medium | Raw error text returned to client | Return a fixed message for non-provider errors; the catch also returns database error text (query and parameters). |
| apps/finnaux-api/src/external/shared/external-api-auth.utils.ts | 6 | medium | Mask exposes part of secret keys | Show no characters of apiSecret and encryptionKey in the masked GET, since the 10% rule shows about 48 of 256 key bits. |
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | 158 | low | Database errors become 400 messages | Only wrap provider errors in BadRequestException; let other errors reach the global filter. |
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | 133 | low | Cached result skips OTP check | Tie the cache key to the employee id so only the user who verified can replay the session. |
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | 274 | low | Raw response with photo returned | Drop the base64 photo from raw before returning, caching and logging it. |
| apps/finnaux-api/src/external/finnaux/finnaux.controller.ts | 15 | low | Paid calls need only login | Add a page-right check or a throttle, since each call spends Finnaux wallet balance. |

### safeFiles (10)

- apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts
- apps/finnaux-api/src/external/external.module.ts
- apps/finnaux-api/src/external/shared/external-api-runtime.service.ts
- apps/finnaux-api/src/fixed-cuids.ts
- apps/finnaux-api/src/lms/customer/kyc/kyc-document-verification-channelizer.ts
- apps/finnaux-api/src/external/finnaux/dto/generate-aadhaar-otp.dto.ts
- apps/finnaux-api/src/external/finnaux/dto/index.ts
- apps/finnaux-api/src/external/finnaux/dto/verify-aadhaar-otp.dto.ts
- apps/finnaux-api/src/external/finnaux/finnaux-api.client.ts
- apps/finnaux-api/src/external/finnaux/finnaux.module.ts

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <13 changed .ts files> | passed |
| grey | tests | not run: no test command configured |

### advice (1)

- devil's advocate check for leaks and errors: applied, with extra scrutiny on error text, stored data, key exposure and abuse of paid calls

---

## committable-18

| Field | Value |
|---|---|
| id | committable-18 |
| generatedAt | 2026-11-13T14:11:26+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| verdict | committable |
| files.total | 3 |
| files.staged | 0 |
| files.unstaged | 3 |
| files.untracked | 0 |

### attention (0)

_Empty._

### safeFiles (3)

- apps/finnaux-api/src/configurations/external-apis/external-apis.controller.ts
- apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts
- apps/finnaux-api/src/external/shared/external-api-runtime.service.ts

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <3 changed files> | passed |
| green | bun run build | passed |

### advice (4)

- default 'bearer' is wanted: not listed; contract updated to bearer
- no group without endpoint: schema route mismatch not listed
- first save without lock: fixed by locking the apiGroups row (FOR UPDATE OF apiGroups) inside the save transaction
- two connections per save: fixed by passing tx into getApiGroupAuthContext

---

## committable-17

| Field | Value |
|---|---|
| id | committable-17 |
| generatedAt | 2026-11-13T13:45:39+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| verdict | committable |
| files.total | 3 |
| files.staged | 0 |
| files.unstaged | 3 |
| files.untracked | 0 |

### attention (4)

| path | line | priority | issue | fix |
|---|---|---|---|---|
| apps/finnaux-api/src/external/shared/external-api-runtime.service.ts | 62 | low | Default 'bearer' differs from contract | The default is now 'bearer' (matches lowercase DB values) but docs/external-apis/frontend-contract.md:156 and the v2 spec say API_KEY; update the contract so the frontend sees the same value. |
| apps/finnaux-api/src/external/shared/external-api-runtime.service.ts | 62 | low | Schema route disagrees with PUT | For a group with no endpoint the schema route returns an empty 'bearer' schema while PUT requires apiKey; return apiKey in the schema too, or tell the frontend not to use that route. |
| apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts | 384 | low | First save has no row lock | The lock covers only an existing row; two first saves at once both insert and the later wins. Rare; accept or lock the apiGroups row. |
| apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts | 382 | low | Each save holds two connections | getApiGroupAuthContext runs on the pool while the transaction holds another connection; fine at this traffic, or pass tx into it if the pool is small. |

### safeFiles (1)

- apps/finnaux-api/src/configurations/external-apis/external-apis.controller.ts

### checks (2)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <3 changed files> | passed |

### advice (2)

- check all previous changes, leaks and problems: full diff re-read; no decrypted value in any response or log, no secret in code, mask guard and 10% mask intact; 4 low notes
- check these changes: the new 'bearer' default reviewed and listed against the contract

---

## committable-16

| Field | Value |
|---|---|
| id | committable-16 |
| generatedAt | 2026-11-13T13:18:37+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| verdict | committable |
| files.total | 3 |
| files.staged | 0 |
| files.unstaged | 3 |
| files.untracked | 0 |

### attention (1)

| path | line | priority | issue | fix |
|---|---|---|---|---|
| apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts | 384 | low | First save has no row lock | The lock only covers an existing row; two first saves at once both insert and the later one wins through onConflictDoUpdate. Rare; accept or lock the apiGroups row instead. |

### safeFiles (2)

- apps/finnaux-api/src/configurations/external-apis/external-apis.controller.ts
- apps/finnaux-api/src/external/shared/external-api-runtime.service.ts

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <3 changed files> | passed |
| green | bun run build | passed |

### advice (0)

_Empty._

---

## committable-15

| Field | Value |
|---|---|
| id | committable-15 |
| generatedAt | 2026-11-13T13:01:34+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| verdict | needs-attention |
| files.total | 3 |
| files.staged | 0 |
| files.unstaged | 3 |
| files.untracked | 0 |

### attention (6)

| path | line | priority | issue | fix |
|---|---|---|---|---|
| apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts | 468 | medium | Mask shows too much of short keys | A 13-char key shows 12 real chars; options: show 4+4 chars, show only last 4, or a fixed 8 X mask. |
| apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts | 378 | medium | Broken saved key blocks every save | If decrypt fails, treat the group as not configured so a full set of keys replaces the broken row. |
| apps/finnaux-api/src/external/shared/external-api-runtime.service.ts | 46 | medium | Random endpoint decides key fields | Add orderBy(provider, name) like findAll, or merge keys from all endpoints of the group. |
| apps/finnaux-api/src/external/shared/external-api-runtime.service.ts | 36 | low | Keys saveable for disabled integrations | Keep (the v2 spec asked for it) or add back the integration-group active join. |
| apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts | 378 | low | Two saves at once lose one | Run read and upsert in one transaction with select for update, or accept last-write-wins. |
| apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts | 351 | low | Two queries run one by one | Run getApiGroupAuthContext and getStoredCredentials with Promise.all. |

### safeFiles (1)

- apps/finnaux-api/src/configurations/external-apis/external-apis.controller.ts

### checks (2)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <3 changed files> | passed |

### advice (2)

- 1-6: the six items from committable-14 re-listed with their stated priorities; still present in the code
- make these simple with solution range and example cases: issue and fix text simplified, examples given in chat

---

## committable-14

| Field | Value |
|---|---|
| id | committable-14 |
| generatedAt | 2026-11-13T12:47:01+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| verdict | needs-attention |
| files.total | 3 |
| files.staged | 0 |
| files.unstaged | 3 |
| files.untracked | 0 |

### attention (6)

| path | line | priority | issue | fix |
|---|---|---|---|---|
| apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts | 468 | medium | Mask leaks most of short keys | A 13-character key shows 12 real characters and every mask shows the exact length; hide more for short values, for example show at most a quarter, and confirm the spec change with the frontend. |
| apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts | 378 | medium | Corrupt stored row blocks every save | PUT always decrypts the stored row, so a bad row or rotated encryption key returns 500 forever; when decrypt fails, fall back to the first-save rule so a full set of keys can replace it. |
| apps/finnaux-api/src/external/shared/external-api-runtime.service.ts | 46 | medium | Endpoint picked without order | limit(1) without orderBy can pick a different endpoint per call, so requiredCredentialKeys can change; order like findAll (provider, name) so both agree. |
| apps/finnaux-api/src/external/shared/external-api-runtime.service.ts | 36 | low | Inactive integration groups now writable | The integration-group active check was dropped as the v2 spec asked; keys can now be saved for groups under an inactive integration. Keep it if that is wanted. |
| apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts | 378 | low | Read-merge-write without transaction | Two partial PUTs at the same time can each overwrite the other's key; lock the row or run read and upsert in one transaction. |
| apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts | 351 | low | Two sequential queries per request | getApiGroupAuthContext and getStoredCredentials are independent; run them with Promise.all in both credentials routes. |

### safeFiles (1)

- apps/finnaux-api/src/configurations/external-apis/external-apis.controller.ts

### checks (2)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <3 changed files> | passed |

### advice (3)

- devil's advocate, no false praise: applied; reported design-level leaks and races beyond the usual rule scan
- look for leaks: mask length leak and mask threshold listed; no decrypted value in any response or log found
- look for optimisations: parallel queries listed

---

## committable-13

| Field | Value |
|---|---|
| id | committable-13 |
| generatedAt | 2026-10-30T14:43:57+05:30 |
| author | Dhruv |
| branch | dhruv |
| verdict | committable |
| files.total | 5 |
| files.staged | 0 |
| files.unstaged | 5 |
| files.untracked | 0 |

### attention (0)

_Empty._

### safeFiles (5)

- apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-ui.types.ts
- apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <changed .ts files> | passed |
| grey | tests | not run: no test command configured |

---

## committable-12

| Field | Value |
|---|---|
| id | committable-12 |
| generatedAt | 2026-10-30T14:25:06+05:30 |
| author | Dhruv |
| branch | dhruv |
| verdict | committable |
| files.total | 5 |
| files.staged | 0 |
| files.unstaged | 5 |
| files.untracked | 0 |

### attention (0)

_Empty._

### safeFiles (5)

- apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-ui.types.ts
- apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <changed .ts files> | passed |
| grey | tests | not run: no test command configured |

---

## committable-11

| Field | Value |
|---|---|
| id | committable-11 |
| generatedAt | 2026-10-30T13:30:03+05:30 |
| author | Dhruv |
| branch | dhruv |
| verdict | committable |
| files.total | 5 |
| files.staged | 0 |
| files.unstaged | 5 |
| files.untracked | 0 |

### attention (0)

_Empty._

### safeFiles (5)

- apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-ui.types.ts
- apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <changed .ts files> | passed |
| grey | tests | not run: no test command configured |

---

## committable-10

| Field | Value |
|---|---|
| id | committable-10 |
| generatedAt | 2026-10-30T11:25:19+05:30 |
| author | Dhruv |
| branch | dhruv |
| verdict | committable |
| files.total | 5 |
| files.staged | 0 |
| files.unstaged | 5 |
| files.untracked | 0 |

### attention (0)

_Empty._

### safeFiles (5)

- apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-ui.types.ts
- apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <changed .ts files> | passed |
| grey | tests | not run: no test command configured |

---

## committable-9

| Field | Value |
|---|---|
| id | committable-9 |
| generatedAt | 2026-10-30T10:10:45+05:30 |
| author | Dhruv |
| branch | dhruv |
| verdict | committable |
| files.total | 8 |
| files.staged | 0 |
| files.unstaged | 8 |
| files.untracked | 0 |

### attention (0)

_Empty._

### safeFiles (8)

- .gitignore
- apps/finnaux-api/src/fixed-cuids.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/format-utils.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-types.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-ui.types.ts
- apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <changed .ts files> | passed |
| grey | tests | not run: no test command configured |

---

## committable-8

| Field | Value |
|---|---|
| id | committable-8 |
| generatedAt | 2026-10-30T10:02:06+05:30 |
| author | Dhruv |
| branch | dhruv |
| verdict | committable |
| files.total | 11 |
| files.staged | 0 |
| files.unstaged | 8 |
| files.untracked | 3 |

### attention (0)

_Empty._

### safeFiles (11)

- .gitignore
- apps/finnaux-api/src/fixed-cuids.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/format-utils.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-types.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-ui.types.ts
- apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts
- docs/ucrf/overview.md
- docs/ucrf/report-format.md
- docs/ucrf/ucrf-field-specification.md

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <changed .ts files> | passed |
| grey | tests | not run: no test command configured |

---

## committable-7

| Field | Value |
|---|---|
| id | committable-7 |
| generatedAt | 2026-10-30T09:55:38+05:30 |
| author | Dhruv |
| branch | dhruv |
| verdict | committable |
| files.total | 13 |
| files.staged | 0 |
| files.unstaged | 10 |
| files.untracked | 3 |

### attention (0)

_Empty._

### safeFiles (13)

- .gitignore
- apps/finnaux-api/src/fixed-cuids.ts
- apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-xlsx.builder.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/format-utils.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-types.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-ui.types.ts
- apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts
- docs/ucrf/overview.md
- docs/ucrf/report-format.md
- docs/ucrf/ucrf-field-specification.md

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <changed .ts files> | passed |
| grey | tests | not run: no test command configured |

---

## committable-6

| Field | Value |
|---|---|
| id | committable-6 |
| generatedAt | 2026-10-29T15:34:15+05:30 |
| author | Dhruv |
| branch | dhruv |
| verdict | committable |
| files.total | 13 |
| files.staged | 0 |
| files.unstaged | 10 |
| files.untracked | 3 |

### attention (0)

_Empty._

### safeFiles (13)

- .gitignore
- apps/finnaux-api/src/fixed-cuids.ts
- apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-xlsx.builder.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/format-utils.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-types.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-ui.types.ts
- apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts
- docs/ucrf/overview.md
- docs/ucrf/report-format.md
- docs/ucrf/ucrf-field-specification.md

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <changed .ts files> | passed |
| grey | tests | not run: no test command configured |

---

## committable-5

| Field | Value |
|---|---|
| id | committable-5 |
| generatedAt | 2026-10-29T11:20:00+05:30 |
| author | Dhruv |
| branch | dhruv |
| verdict | committable |
| files.total | 13 |
| files.staged | 0 |
| files.unstaged | 10 |
| files.untracked | 3 |

### attention (0)

_Empty._

### safeFiles (13)

- .gitignore
- apps/finnaux-api/src/fixed-cuids.ts
- apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-xlsx.builder.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/format-utils.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-types.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-ui.types.ts
- apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts
- docs/ucrf/overview.md
- docs/ucrf/report-format.md
- docs/ucrf/ucrf-field-specification.md

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <changed .ts files> | passed |
| grey | tests | not run: no test command configured |

---

## committable-4

| Field | Value |
|---|---|
| id | committable-4 |
| generatedAt | 2026-10-29T11:13:31+05:30 |
| author | Dhruv |
| branch | dhruv |
| verdict | committable |
| files.total | 13 |
| files.staged | 0 |
| files.unstaged | 10 |
| files.untracked | 3 |

### attention (0)

_Empty._

### safeFiles (13)

- .gitignore
- apps/finnaux-api/src/fixed-cuids.ts
- apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-xlsx.builder.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/format-utils.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-types.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-ui.types.ts
- apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts
- docs/ucrf/overview.md
- docs/ucrf/report-format.md
- docs/ucrf/ucrf-field-specification.md

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <changed .ts files> | passed |
| grey | tests | not run: no test command configured |

---

## committable-3

| Field | Value |
|---|---|
| id | committable-3 |
| generatedAt | 2026-10-29T11:12:31+05:30 |
| author | Dhruv |
| branch | dhruv |
| verdict | committable |
| files.total | 12 |
| files.staged | 0 |
| files.unstaged | 9 |
| files.untracked | 3 |

### attention (1)

| path | line | priority | issue | fix |
|---|---|---|---|---|
| apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts | 1606 | low | Noisy 'COMING NULL' comment | Remove or resolve this comment. |

### safeFiles (12)

- .gitignore
- apps/finnaux-api/src/fixed-cuids.ts
- apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-xlsx.builder.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/format-utils.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-types.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-ui.types.ts
- docs/ucrf/overview.md
- docs/ucrf/report-format.md
- docs/ucrf/ucrf-field-specification.md

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <changed .ts files> | passed |
| grey | tests | not run: no test command configured |

---

## committable-2

| Field | Value |
|---|---|
| id | committable-2 |
| generatedAt | 2026-10-29T11:10:54+05:30 |
| author | Dhruv |
| branch | dhruv |
| verdict | committable |
| files.total | 12 |
| files.staged | 0 |
| files.unstaged | 9 |
| files.untracked | 3 |

### attention (1)

| path | line | priority | issue | fix |
|---|---|---|---|---|
| apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts | 1586 | low | Noisy 'COMING NULL' comments | Remove or resolve these comments. |

### safeFiles (12)

- .gitignore
- apps/finnaux-api/src/fixed-cuids.ts
- apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-xlsx.builder.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/format-utils.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-types.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-ui.types.ts
- docs/ucrf/overview.md
- docs/ucrf/report-format.md
- docs/ucrf/ucrf-field-specification.md

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <changed .ts files> | passed |
| grey | tests | not run: no test command configured |

---

## committable-1

| Field | Value |
|---|---|
| id | committable-1 |
| generatedAt | 2026-10-29T11:03:00+05:30 |
| author | Dhruv |
| branch | dhruv |
| verdict | needs-attention |
| files.total | 15 |
| files.staged | 0 |
| files.unstaged | 9 |
| files.untracked | 7 |

### attention (5)

| path | line | priority | issue | fix |
|---|---|---|---|---|
| .claude/skills/ | null | high | .claude folder must not be committed | Leave .claude/ out of the commit or add it to .gitignore. |
| apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts | 9 | medium | Unused import TUDF_OCCUPATION | Remove the unused import. |
| apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts | 1697 | low | Commented-out code in query | Delete the commented eq() debug filter. |
| apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts | 1586 | low | Noisy 'COMING NULL' comments | Remove or resolve these comments. |
| apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts | 175 | low | Open-question comment left in code | Resolve or remove the comment. |

### safeFiles (9)

- apps/finnaux-api/src/fixed-cuids.ts
- apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-xlsx.builder.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/format-utils.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-types.ts
- apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-ui.types.ts
- docs/ucrf/overview.md
- docs/ucrf/report-format.md
- docs/ucrf/ucrf-field-specification.md

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <changed .ts files> | passed |
| grey | tests | not run: no test command configured |

---
