# 🐧 How Is My Commit · Backend

> Generated from `data/backend/howismycommit.json`. Edit the JSON, not this file. 58 entries, newest first.

## howismycommit-58

| Field | Value |
|---|---|
| id | howismycommit-58 |
| generatedAt | 2026-11-24T16:16:37+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 07f82b0a03599091e857955f0e63a25b26cacb1c |
| files.changed | 122 |
| files.added | 33 |
| files.modified | 82 |
| files.deleted | 7 |
| files.insertions | 10503 |
| files.deletions | 1290 |
| verdict | review-with-caution |
| score | 92 |
| commitScore | 72 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 3 |
| summary.info | 0 |
| before | Before 07f82b0a, SurePass, Digio, CRIF, DigiPehchan, KVB and the credit bureaus each had working verification, eSign and bureau flows using credentials saved per API group. |
| after | All of those provider flows are still present; this branch only added Finnaux alongside them, plus small additive changes to SurePass RC, Digio eSign input validation and credential saving. |

### changeType (2)

- refactor
- feature

### effects (1)

- Provider checks on 07f82b0a^..27d063dc (apps only): SurePass, Digio, CRIF, DigiPehchan, KVB, credit bureaus, shared external API runtime and credential saving.

### filesReviewed (8)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/external/digio | modified | green | no issues: identical to 07f82b0a^, no commit in range touched it |
| apps/finnaux-api/src/external/surepass/surepass.service.ts | modified | green | no issues: additive (permanentAddress) |
| apps/finnaux-api/src/external/crif-high-mark | modified | green | no issues: unchanged |
| apps/finnaux-api/src/external/digipehchan | modified | green | no issues: unchanged |
| apps/finnaux-api/src/los/loan-application/asset-vehicles/asset-vehicles.service.ts | modified | green | no issues: SurePass RC still default unless Finnaux RC is selected |
| apps/finnaux-api/src/los/loan-application/esign/esign.service.ts | modified | green | no issues: Digio eSign branch kept |
| apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts | modified | green | no issues: full credential save still works |
| apps/finnaux-api/src/external/shared/external-api-runtime.service.ts | modified | green | no issues: only used by credential config, not provider calls |

### findings (7)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | SurePass RC number now has spaces removed (Dhruv) |
| location | apps/finnaux-api/src/los/loan-application/asset-vehicles/asset-vehicles.service.ts:497 |
| problem | Since 4d5e1f5d/525ecdf4 the RC number sent to SurePass has spaces stripped, e.g. MH 12 AB 1234 becomes MH12AB1234. Before 07f82b0a it was sent as typed (SurePass only trimmed and upper-cased it). |
| impact | Behaviour change for the old SurePass flow; not a defect. |
| fix | None needed if SurePass verifies compact numbers as before. |
| evidence | rcNumber: assetVehicle.registrationNumber<br>        .replaceAll(' ', '') |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-24T11:42:08.058Z |
| resolvedNote | Intended behaviour: RC spaces are removed on purpose (asset-vehicles.service.ts:497). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Digio eSign document URL check moved to the service (Dhruv) |
| location | apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:201 |
| problem | Since 4c4198f4/3a5bf969 documentUrl is optional in the DTO; the Digio branch now rejects a missing URL in the service. Before 07f82b0a the DTO required it. |
| impact | Same 400 error for Digio, different message text; not a defect. |
| fix | None needed. |
| evidence | if (!input.documentUrl) {<br>      throw new BadRequestException('documentUrl is required') |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-24T11:42:08.058Z |
| resolvedNote | Message is clear: Digio path returns 400 "documentUrl is required" (esign.service.ts:201-203). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[3] · F3

| Field | Value |
|---|---|
| id | F3 |
| severity | P3 |
| title | Credential save rewritten for every provider (Dhruv) |
| location | apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts:380 |
| problem | Since 07f82b0a (and 14530eec, 3dbd8880, 06be55ad) saving credentials merges single keys with stored ones, adds a masked read, and groups without keys default to API_KEY. |
| impact | Affects SurePass, Digio, CRIF and others when credentials are saved; full-key saves work as before. Not a defect. |
| fix | None needed. |
| evidence | mergeCredentials(<br>                storedCredentials,<br>                input.credentials, |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-24T12:28:18.880Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[4] · F4

| Field | Value |
|---|---|
| id | F4 |
| severity | P3 |
| title | FINNAUX added to provider enums (Dhruv) |
| location | apps/finnaux-api/src/drizzle/schema/enums.ts:868 |
| problem | Provider enums gained FINNAUX; SUREPASS, DIGIO and INTERNAL are kept. |
| impact | Nothing removed; the matching DB migration must ship with it. |
| fix | Commit the stashed migration before deploy. |
| evidence | values: ['SUREPASS', 'DIGIO', 'FINNAUX'] |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-24T12:09:26.876Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |
| future | true |

#### findings[5] · F5

| Field | Value |
|---|---|
| id | F5 |
| severity | P3 |
| title | Redis activity-log code deleted (shekhar, via dev) |
| location | apps/finnaux-api/src/los/loan-application/logger |
| problem | beed0a64 and ce3a0b85 removed the Redis log queue, interceptor and inspector. Came in through dev merges, not this branch. |
| impact | Loan application logs are now written directly; planned refactor, not a defect. |
| fix | None for this branch. |
| evidence | refactor(audit-logs): write loan application logs directly and remove redis queue |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-24T11:01:34.774Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[6] · F6

| Field | Value |
|---|---|
| id | F6 |
| severity | P3 |
| title | Fintech onboarding routes and exceptions filter changed (shekhar, via dev) |
| location | apps/finnaux-api/src/fintech/fintech.controller.ts |
| problem | d6cc8b75 removed anonymous onboarding routes; 5e51e946 and 227986e2 reworked the exceptions filter (committed on dev before 07f82b0a, merged later). |
| impact | Planned refactor, not from this branch. |
| fix | None for this branch. |
| evidence | fix(fintech): remove anonymous onboarding routes |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-24T11:01:50.080Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[7] · F7

| Field | Value |
|---|---|
| id | F7 |
| severity | P3 |
| title | Duplicate HRMS attendance values removed (shekhar, via dev) |
| location | apps/finnaux-api/src/drizzle/schema/enums.ts:1669 |
| problem | 25a5304b removed duplicate WEEK_OFF/MISPUNCH values. Came in through dev. |
| impact | Planned cleanup, not from this branch. |
| fix | None for this branch. |
| evidence | fix(hrms): remove duplicate WEEK_OFF attendance status |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-24T11:02:00.611Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (0)

_Empty._

### checks (3)

| status | command | result |
|---|---|---|
| green | git diff 07f82b0a^ -- apps/finnaux-api/src/external/digio | passed: no differences, Digio fully restored |
| green | git diff 07f82b0a^ HEAD -- external/crif-high-mark external/digipehchan integrations lms/customer/kyc credit-bureaus | passed: no removed lines |
| green | git diff --numstat dev HEAD -- apps | passed: every other deleted line already exists in dev, so it came from dev merges |

### gaps (2)

- Code comparison only; no provider was called live to prove it still works.
- Signcare has no code in the backend (it only hosts the Finnaux docs), so there was nothing to compare.

### info (0)

_Empty._

---

## howismycommit-57

| Field | Value |
|---|---|
| id | howismycommit-57 |
| generatedAt | 2026-11-24T14:05:57+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 50699b440162e0b5651e2e5300b2c46187839d3f |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 45 |
| files.deletions | 0 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 5 |
| summary.info | 3 |
| before | Adding a bank to an existing customer (POST lms/customer/:customerId/bank) never looked at bank verifications, so a verified account stayed PENDING and the new bank had no lastVerifiedAt. |
| after | When no lastVerifiedAt is passed, create looks for a valid unused PENDING verification with the same account number and IFSC. If one exists, the new bank gets lastVerifiedAt from it, and the verification is linked to the customer and bank and marked EXPIRED. Without one the bank saves as before. |

### changeType (2)

- bug-fix
- api

### effects (3)

- Add bank to an existing customer, and the customer create path at customer.service.ts:165 that calls create without lastVerifiedAt
- The new-customer path that passes its own lastVerifiedAt is left alone
- The bank verification trail shows linked verifications as used

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/lms/customer/bank/bank.service.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 877184fc030a8791fc04f112319343bf8be86dd6 | F1 | Schema enum value ships without its migration | open | Still open: migration 0018 is only in stash@{0}. |

### checks (5)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit, also on this commit alone in a temporary copy | passed |
| green | bunx oxlint (customers bank) | passed |
| green | script (rolled-back transaction on finnaux_dev): add a bank to an existing customer with a waiting verification, and a never-verified bank | passed: lastVerifiedAt set and the verification EXPIRED and linked; the never-verified bank saves with an empty lastVerifiedAt; 0 test rows left |
| green | script (earlier in this session): create called with lastVerifiedAt, the new-customer path | passed: the verification is left PENDING for the caller to expire |
| green | bun run build | passed (run before the commits, code unchanged since) |

### gaps (2)

- The lookup uses an exact account number and IFSC match, like the new-customer path, so a differently cased IFSC from a client would not link
- No automated test covers the link

### info (3)

- This only adds behaviour when a matching unused verification exists; adding an unverified bank is unchanged
- The extra lookup runs on every add-bank call that has no lastVerifiedAt, one small query
- Surepass verifications are saved as EXPIRED, so they never match here

---

## howismycommit-56

| Field | Value |
|---|---|
| id | howismycommit-56 |
| generatedAt | 2026-11-24T14:05:57+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 82b3b8c413b1fc081afa83244625a09c705fe616 |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 82 |
| files.deletions | 13 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 5 |
| summary.info | 4 |
| before | Every Finnaux bank verify call, including cache hits, saved a new PENDING verification row, and verifying an already saved bank left an unused PENDING row. |
| after | A verified account has one valid PENDING row per account and IFSC: older timed-out rows are marked EXPIRED, and repeats add nothing. Verifying an account that is already a saved bank updates its lastVerifiedAt and, on a fresh call, records one EXPIRED row linked to that bank and customer. |

### changeType (2)

- bug-fix
- api

### effects (3)

- bankAccountVerifications: fewer rows, and the bank verification trail no longer lists duplicates
- bankDetails.lastVerifiedAt is updated when a saved bank is verified
- Cache hits no longer write rows, except to restore a missing valid PENDING row

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 877184fc030a8791fc04f112319343bf8be86dd6 | F1 | Schema enum value ships without its migration | open | Still open: migration 0018 is only in stash@{0}; without the enum value the row insert fails with an enum error after the billed call. |

### checks (5)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit, also on this commit alone in a temporary copy | passed |
| green | bunx oxlint (finnaux, customers bank) | passed |
| green | script (rolled-back transaction on finnaux_dev): verify and 3 repeats, verify a saved bank and a repeat | passed: one PENDING row after the repeats; the saved bank gets one EXPIRED row linked to it; 0 test rows left |
| green | script (earlier in this session): a timed-out row then a repeat | passed: old row EXPIRED, one new PENDING |
| green | bun run build | passed (run before the commits, code unchanged since) |

### gaps (2)

- Two simultaneous first-time verifications of the same account could each insert a PENDING row; the frontend disables the button, so this was not tested
- No automated test covers the verification rows

### info (4)

- For an account that is already a saved bank of another customer, verifying it for a new customer now ends with 'verification could not be completed' at save instead of 'Account already exists'; the Surepass flow already behaves this way
- Any user's valid PENDING row for an account is reused by whoever verifies it next, the same as before
- A real call with the enum value missing still bills Finnaux and then fails on the row insert (seen once on finnaux_dev)
- Needs the FINNAUX enum value in the database before it runs (migration 0018 in the stash)

---

## howismycommit-55

| Field | Value |
|---|---|
| id | howismycommit-55 |
| generatedAt | 2026-11-24T14:05:57+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 5c7dfd74ce9c2621c113337f7e25ec7c253c789f |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 11 |
| files.deletions | 0 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 5 |
| summary.info | 4 |
| before | A Finnaux bank verification with a verified status passed whatever the name match score was, so an account could be verified under someone else's name. |
| after | A name match score below 90, or a missing or non-text score, fails with 400 'Account holder name does not match the bank record'. Nothing is cached or saved, and the error shows neither the real holder's name nor the score. |

### changeType (2)

- feature
- api

### effects (3)

- Finnaux bank verify route (add and edit bank, customer bank tab)
- Frontend: a mismatch is now an error toast instead of a warning
- Only verified results with a score of 90 or more are cached or saved

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 877184fc030a8791fc04f112319343bf8be86dd6 | F1 | Schema enum value ships without its migration | open | Still open: the FINNAUX enum value is in enums.ts and migration 0018 is only in stash@{0}. |
| d15e3483aa2003e111f72d4e376ef622aa8753fa | F1 | Commit mixes the name match rule with the duplicate verification fix | resolved | Fixed by this commit: the name rule is now alone in 5c7dfd74 and the mixed commit is on no branch. |

### checks (5)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit, also on this commit alone in a temporary copy | passed |
| green | bunx oxlint (finnaux, customers bank) and oxfmt --check on this commit's file | passed |
| green | script: scores 100, 90, 89.99, 40 and a missing score (rolled-back, stubbed Finnaux reply) | passed: 100 and 90 pass and save; 89.99, 40 and missing fail 400 and save nothing |
| green | real calls through the route on finnaux_dev (by the user) | passed: real holder name verified; other names scored 40 and 25 |
| green | bun run build | passed (run before the commits, code unchanged since) |

### gaps (2)

- The threshold 90 comes from three real calls (100, 40, 25); names with initials or a missing middle name may be wrongly rejected
- A score that Finnaux sends as a number, not text, would be read as missing and reject every verification; the docs and real replies use text

### info (4)

- A rejected name is still a billed Finnaux call, and the route has no rate limit
- The check uses only the score; is_name_match is ignored because it returned false even at 100
- No automated test covers the rule
- The enum migration must be committed before pushing (howismycommit-52 F1)

---

## howismycommit-54

| Field | Value |
|---|---|
| id | howismycommit-54 |
| generatedAt | 2026-11-24T13:05:31+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | f7e8b9571d5d659eab2546bd794208318bd86156 |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 45 |
| files.deletions | 0 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 5 |
| summary.info | 3 |
| before | Adding a bank to an existing customer (POST lms/customer/:customerId/bank) never looked at bank verifications, so a verified account stayed PENDING and the new bank had no lastVerifiedAt. |
| after | When no lastVerifiedAt is passed, create looks for a valid unused PENDING verification with the same account number and IFSC. If one exists, the new bank gets lastVerifiedAt from it, and the verification is linked to the customer and bank and marked EXPIRED. Without one the bank saves as before. |

### changeType (2)

- bug-fix
- api

### effects (3)

- Add bank to an existing customer and the customer create path that calls create without lastVerifiedAt (customer.service.ts:165)
- The new-customer path that passes its own lastVerifiedAt is left alone
- bankAccountVerifications rows are linked and expired, so the bank verification trail shows them as used

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/lms/customer/bank/bank.service.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 877184fc030a8791fc04f112319343bf8be86dd6 | F1 | Schema enum value ships without its migration | open | Still open: migration 0018 is only in stash@{0}. |
| d15e3483aa2003e111f72d4e376ef622aa8753fa | F1 | Commit mixes the name match rule with the duplicate verification fix | open | Still open: the name rule is in d15e3483 (finnaux.service.ts:111). |

### checks (5)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint (customers bank) | passed |
| green | script: add bank to an existing customer with a waiting verification, and a never-verified bank (rolled-back transaction on finnaux_dev) | passed: lastVerifiedAt set, verification EXPIRED and linked to the customer and the bank; never-verified bank saves with an empty lastVerifiedAt; 0 test rows left |
| green | script: a create call that already carries lastVerifiedAt (the new-customer path) | passed: the verification is left PENDING for that caller to expire (run earlier in this session) |
| green | bun run build (before the commit) | passed |

### gaps (2)

- The lookup uses an exact account number and IFSC match, like the new-customer path, so a differently cased IFSC from a client would not link
- No automated test covers the link

### info (3)

- This only adds behaviour when a matching unused verification exists; adding an unverified bank is unchanged
- The extra lookup runs on every add-bank call that has no lastVerifiedAt, one small indexed-by-account query
- Surepass verifications are saved as EXPIRED, so they never match here

---

## howismycommit-53

| Field | Value |
|---|---|
| id | howismycommit-53 |
| generatedAt | 2026-11-24T13:05:31+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | d15e3483aa2003e111f72d4e376ef622aa8753fa |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 93 |
| files.deletions | 13 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 5 |
| summary.info | 5 |
| before | Every Finnaux bank verify call, including cache hits, saved a new PENDING verification row, a verification done on an already saved bank left an unused PENDING row, and a name match mismatch did not block anything. |
| after | A verified account has one valid PENDING row per account and IFSC (older timed-out rows are marked EXPIRED, repeats add nothing). Verifying an account that is already a saved bank updates its lastVerifiedAt and records one EXPIRED row linked to it on a fresh call. A name match score below 90, or a missing score, fails with 400 'Account holder name does not match the bank record' and nothing is cached or saved. |

### changeType (3)

- bug-fix
- feature
- api

### effects (4)

- Finnaux bank verify route: bank form and customer bank tab
- bankAccountVerifications: fewer rows, and the bank verification trail no longer lists duplicates
- bankDetails.lastVerifiedAt is updated when a saved bank is verified
- Frontend: a name mismatch is now an error toast, not a warning with a score

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | modified | amber | F1 |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Commit mixes the name match rule with the duplicate verification fix |
| location | apps/finnaux-api/src/external/finnaux/finnaux.service.ts:111 |
| problem | The name match rule (score below 90 is rejected) was meant to be its own commit. Its pre-commit hook failed when only those hunks were staged, and the next commit staged the whole file, so this commit carries two logical changes under a message that names only the duplicate verification fix. |
| impact | CONTRIBUTING.md asks for one logical change per commit. Someone reading the history, or reverting this commit, would not expect it to also remove the 'name mismatch does not block' behaviour that the frontend relies on. |
| fix | While the commits are unpushed, redo them: reset the branch softly to 877184fc, stage the name rule alone and commit it, then commit the rest. Or keep it and accept that the name rule is documented only here. |
| evidence | const FINNAUX_BANK_NAME_MATCH_MIN_SCORE = 90 |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-24T08:16:20.931Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 877184fc030a8791fc04f112319343bf8be86dd6 | F1 | Schema enum value ships without its migration | open | The FINNAUX enum value is still in enums.ts and migration 0018 is still only in stash@{0}; the latest committed migration is 0017. |

### checks (5)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint (finnaux, customers bank) | passed |
| green | script: verify and 3 repeats, add bank to an existing customer, add a never-verified bank, verify a saved bank and a repeat, score 40 (rolled-back transaction on finnaux_dev) | passed: one PENDING row; EXPIRED and linked after the add; never-verified bank saves with an empty lastVerifiedAt; saved bank gets one EXPIRED row linked; score 40 fails 400 and saves nothing; 0 test rows left |
| green | real calls through the route on finnaux_dev (by the user, earlier today) | passed: the four checks were reported working |
| green | bun run build (before the commit) | passed |

### gaps (2)

- The name score of 90 is a hard-coded guess from three real calls (100, 40, 25); names with initials or a missing middle name may be wrongly rejected
- Two simultaneous first-time verifications of the same account could each insert a PENDING row; the frontend disables the button, so this was not tested

### info (5)

- A rejected name is still a billed Finnaux call, and the route has no rate limit
- The error does not reveal the real holder's name or the score
- For an account that is already a saved bank of another customer, verifying it for a new customer now ends with 'verification could not be completed' at save instead of 'Account already exists'; the Surepass flow already behaves this way
- No automated test covers the verification rows or the name rule
- Run order: this commit and f7e8b957 are not pushed, and the FINNAUX enum migration must be committed before the push

---

## howismycommit-52

| Field | Value |
|---|---|
| id | howismycommit-52 |
| generatedAt | 2026-11-24T11:39:10+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 877184fc030a8791fc04f112319343bf8be86dd6 |
| files.changed | 6 |
| files.added | 1 |
| files.modified | 5 |
| files.deleted | 0 |
| files.insertions | 194 |
| files.deletions | 1 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 5 |
| summary.info | 5 |
| before | Bank accounts could only be verified through Surepass; when the Bank Account integration group had Finnaux selected there was no Finnaux route, and the provider enum for saved bank verifications had no FINNAUX value. |
| after | POST /v1/external/finnaux/bank/verify takes account number (9 to 18 digits), IFSC and the typed holder name, sends them to Finnaux with consent Y and isPennyDrop false, and returns the Surepass-shaped row plus verificationStatus, isNameMatch and nameMatchScore. Anything but status SUCCESS and verification_status VERIFIED fails with 400; a name mismatch does not. A verified account is cached for 60 minutes and saved as a PENDING FINNAUX verification so the bank save can link it. |

### changeType (3)

- feature
- api
- schema

### effects (4)

- Add and edit bank modal and the customer bank tab call this route when Finnaux is the Bank Account provider
- Writes bankAccountVerifications rows with provider FINNAUX and updates bankDetails.lastVerifiedAt for a matching saved bank
- The Surepass bank route is unchanged
- Needs migration 0018 (enum value and endpoint row), which is in stash@{0}, not in this commit

### filesReviewed (6)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/drizzle/schema/enums.ts | modified | amber | F1 |
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | modified | green | no issues |
| apps/finnaux-api/src/external/finnaux/finnaux.controller.ts | modified | green | no issues |
| apps/finnaux-api/src/external/finnaux/dto/verify-bank-account.dto.ts | added | green | no issues |
| apps/finnaux-api/src/external/finnaux/dto/index.ts | modified | green | no issues |
| apps/finnaux-api/src/fixed-cuids.ts | modified | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Schema enum value ships without its migration |
| location | apps/finnaux-api/src/drizzle/schema/enums.ts:869 |
| problem | The commit adds FINNAUX to BankAccountVerificationProviderEnum, but migration 0018 (ALTER TYPE ... ADD VALUE 'FINNAUX' and the endpoint row) is kept in stash@{0}. DATABASE.md asks for every schema change to ship with its migration. |
| impact | If this commit is pushed or deployed alone, a database that never ran the SQL by hand has no FINNAUX enum value and no endpoint row: the route fails, and if the endpoint exists, the billed Finnaux call succeeds before the insert of provider FINNAUX fails with a 500. |
| fix | Apply stash@{0} and commit migration 0018, its snapshot, the journal entry and the seed row next, before pushing or opening a PR. |
| evidence |   values: ['SUREPASS', 'DIGIO', 'FINNAUX'] |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-24T06:09:37.583Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (0)

_Empty._

### checks (5)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint (finnaux, drizzle schema, fixed-cuids) | passed |
| green | script: verifyBankAccount on the real reply shape, a non-VERIFIED status and a top-level FAILED | passed: VERIFIED maps and saves a PENDING FINNAUX row; the other two fail with 400 and write nothing |
| green | real call through the route on finnaux_dev (earlier in this session) | passed: 200, VERIFIED, request logged with only the last 4 account digits, PENDING FINNAUX verification saved with an uppercase IFSC |
| green | bun run build (before the commit) | passed |

### gaps (2)

- The full save path (customer or bank save that links the verification) was not confirmed: no bank row reached the database during the frontend test
- is_name_match and name_match_score have no definition in the provider docs; real calls returned false with score 100

### info (5)

- The 5 commits before this one have no open findings (only howismycommit-51, which had none)
- No rate limit on this billed route, unlike Aadhaar OTP; only the 12-page right guards it
- Every cached repeat call saves another PENDING verification row, as the Surepass code does
- The request log keeps the full Finnaux reply, including the beneficiary name, as the other Finnaux routes do
- The Surepass code saves its bank verifications as EXPIRED, so they can never be linked; that existing behaviour was not changed

---

## howismycommit-51

| Field | Value |
|---|---|
| id | howismycommit-51 |
| generatedAt | 2026-11-24T09:57:04+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 7b26614c6a2b57d642db099a187227c0c2bf6418 |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 26 |
| files.deletions | 0 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 5 |
| summary.info | 5 |
| before | The five paid Finnaux routes (Aadhaar OTP, Aadhaar verify, PAN, driving licence, vehicle RC) needed only a login, so any logged-in employee could run billed checks or send OTP texts, limited only by the global 100 requests a minute per IP. |
| after | Each route now needs view on at least one of 12 menu pages (individual, non-individual, KYC and all customers, LMS customers, applications, LOS process, LOS dashboard, vendors, dealers, branches, employees), otherwise 403. generate-otp is also limited to 10 requests a minute per IP, otherwise 429. |

### changeType (2)

- security
- api

### effects (3)

- Designations with none of the 12 pages lose Finnaux KYC verification (8 designations with 10 active staff on the local database)
- The frontend hides the Verify buttons for those users and shows a clear 429 message
- Other external KYC routes (Surepass, DigiPehchan, Digio) are unchanged and still login-only

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/external/finnaux/finnaux.controller.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (5)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 7b26614c6a2b57d642db099a187227c0c2bf6418 | howismycommit-50 F1 | Paid Finnaux verification routes have no permission check and only a global rate limit | resolved | Fixed by this commit: all five routes carry the 12-page right and generate-otp carries the 10 a minute limit (finnaux.controller.ts, verified through the route metadata). |
| a6fac248 | howismycommit-12 F4 and howismycommit-13 F4 | Paid routes need login only, no limit | resolved | Same problem as above, fixed by this commit; the needs-attention flag on 13 F4 is cleared. |
| 74acf255f9ca7a3ce84c99d8439dd15c9f7af40f | F1 | The send lock holds a database connection for the whole send, which can freeze the pool | resolved | Verified still fixed: the send uses the short claim (esign.service.ts:174). |
| 07f82b0a | F1 | Keyless group saved with authType bearer | resolved | Verified still fixed (external-api-runtime.service.ts:76). |
| b30b2d8e | F4 | Noisy or misspelled comments added against the comment rule | resolved | Verified still fixed: none of the three comments is left. |

### checks (6)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/external/finnaux | passed |
| green | script: read the route metadata of all five routes | passed: each has 12 view-only pages, only generate-otp has the limit of 10 |
| green | script: the guard check with controlled page sets, run before the commit | passed: any one of the 12 pages allows, an unrelated page or no pages gives 403, no employee gives 401 |
| green | 13 unauthenticated POSTs to generate-otp on the local server, run before the commit | passed: first 10 got 401, then 429; pan/verify unaffected |
| green | bun run build (before the commit) | passed |

### gaps (3)

- The check was not run over HTTP as a logged-in user, so no real OTP was sent
- Production designations were not checked here; the local data has no page rights rows for most designations
- Loan application steps are guarded by process-page rights, not menu pages, so a user assigned a loan process whose designation has none of the 12 pages gets 403 there (1 of 9 such employees locally)

### info (5)

- Root has one view page, not one of the 12, and the guard has no root bypass, so Root cannot verify
- The 12 page ids are a fixed list in the controller; a new screen that calls these routes from another page needs its page added
- The OTP limit counts per IP, so staff behind one office address share the 10 a minute
- No automated test covers the rights check or the limit
- Run the production designation query before deploying so nobody who needs Verify is locked out

---

## howismycommit-50

| Field | Value |
|---|---|
| id | howismycommit-50 |
| generatedAt | 2026-11-23T18:10:11+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | uncommitted |
| target.commit | null |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 2 |
| files.deletions | 0 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | null |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 3 |
| summary.info | 3 |
| before | Any logged-in user could call the paid Finnaux Aadhaar OTP route as often as the global limit of 100 requests a minute allows, and none of the Finnaux verification routes check a page right. |
| after | With this change the Aadhaar OTP route would be limited to 10 requests a minute per IP (the same decorator style as oauth.controller.ts). The change was deferred by the user and removed from the working tree; the permission check was never added. |

### changeType (2)

- security
- api

### effects (2)

- Only POST external/finnaux/aadhaar/generate-otp would change; the other four Finnaux routes keep the global limit
- The limit counts per IP, so many staff behind one office address share the 10 a minute

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/external/finnaux/finnaux.controller.ts | modified | amber | F1 |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Paid Finnaux verification routes have no permission check and only a global rate limit |
| location | apps/finnaux-api/src/external/finnaux/finnaux.controller.ts:18 |
| problem | FUTURE WORK, deferred by the user. All five routes use only AuthGuard, so any logged-in employee can send Aadhaar OTP SMS or run PAN, driving licence and vehicle RC checks, each billed to the Finnaux wallet, with no page right and, for generate-otp, only the global 100 a minute. A ready limit for generate-otp was written and tested (a 10 a minute limit returned 429 from the 11th request) but not committed. |
| impact | A logged-in user who has no business doing KYC can spend wallet balance or send OTP texts to any Aadhaar number. A permission check is not copied from other routes, because the Surepass, DigiPehchan and Digio routes are login-only as well and the callers sit on pages with different rights. |
| fix | 1) Add above the generate-otp route: @Throttle({ default: { limit: 10, ttl: 60_000 } }) and import { Throttle } from '@nestjs/throttler'. 2) Decide which page right controls each route (the customer KYC pages use CUSTOMER_INDIVIDUAL view and add; vehicle RC is called from the loan application assets tab) and add @RequirePageRight to each route with the rights of every page that calls it. |
| evidence |   @UseGuards(AuthGuard)<br>  @Post('aadhaar/generate-otp') |
| status | resolved |
| resolvedIn | 7b26614c6a2b57d642db099a187227c0c2bf6418 |
| resolvedAt | 2026-11-24T04:24:11.008Z |
| resolvedNote | The five Finnaux routes now need view on one of 12 customer, loan, vendor, dealer, branch or employee pages and generate-otp is limited to 10 a minute per IP (apps/finnaux-api/src/external/finnaux/finnaux.controller.ts, commit 7b26614c). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 74acf255f9ca7a3ce84c99d8439dd15c9f7af40f | F1 | The send lock holds a database connection for the whole send, which can freeze the pool | resolved | Verified still fixed: only the short claim runs in a transaction (esign.service.ts:174, 644). |

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit, bunx oxlint apps/finnaux-api/src/external/finnaux and bun run build (run earlier in this session with the change in place) | passed |
| green | 13 unauthenticated POSTs to generate-otp on the local server | passed: the first 10 got 401, the 11th to 13th got 429; pan/verify was unaffected |
| green | git diff on the controller | passed: only the import and the decorator line |

### gaps (2)

- The limit was tested with unauthenticated calls, so no real OTP was sent
- Which page right should control each route was not decided

### info (3)

- Deferred by the user to a future change; the 2-line change is removed from the working tree and its exact text is in F1's fix
- This is the same problem as the older findings in howismycommit-12 F4 and howismycommit-13 F4, which stay open
- An IP-based limit is shared by everyone behind the same office address; a per-employee limit would need a custom tracker

---

## howismycommit-49

| Field | Value |
|---|---|
| id | howismycommit-49 |
| generatedAt | 2026-11-23T18:08:44+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 5d63e3c1c7a0c9866e71c831ca148b26fa69dab5 |
| files.changed | 2 |
| files.added | 0 |
| files.modified | 2 |
| files.deleted | 0 |
| files.insertions | 27 |
| files.deletions | 0 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 4 |
| summary.info | 3 |
| before | The Loan Products filter on five screens loaded products through the HRMS employee endpoint, so a user without the HRMS Employees page right got a 403 and an empty filter. The backend had no products route for the logged-in user without a branch. |
| after | GET /v1/dropdown/session-employee-product returns the active loan products assigned to the logged-in employee as { data: { rows: [{ label, value }] } }, sorted by name, behind the login guard only, like session-employee-branch. |

### changeType (2)

- feature
- api

### effects (3)

- Frontend can switch its one product-filter function to this route, fixing the 403 on the sales and NBFC dashboards, the LMS executive assignment filters and the CRM employee assignment tab
- Behaviour difference the frontend accepted: an employee's own assigned product that the manager's product list lacked is now included
- No database change

### filesReviewed (2)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/dropdown/dropdown.controller.ts | modified | green | no issues |
| apps/finnaux-api/src/dropdown/dropdown.service.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (3)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 74acf255f9ca7a3ce84c99d8439dd15c9f7af40f | F1 | The send lock holds a database connection for the whole send, which can freeze the pool | resolved | Verified still fixed: only the short claim runs in a transaction (esign.service.ts:174, 644). |
| 07f82b0a | F1 | Keyless group saved with authType bearer | resolved | Verified still fixed: the fallback is API_KEY (external-api-runtime.service.ts:76). |
| b30b2d8e | F4 | Noisy or misspelled comments added against the comment rule | resolved | Verified still fixed: none of the three comments is left in auth.guard.ts or accounts.ts. |

### checks (4)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/dropdown | passed |
| green | script: the service method on the local database for two employees with 14 and 11 products and one with none | passed: same ids and order as the employeeProducts table, empty list for none (run earlier in this session) |
| green | curl GET /api/v1/dropdown/session-employee-product without login | passed: 401, and an unknown path gives 404, so the route exists and no catch-all route takes it (run earlier in this session) |

### gaps (2)

- The route was not called as a logged-in user over HTTP; the query and response shape were checked directly
- The five frontend screens were not exercised

### info (3)

- No automated test covers the route
- The route returns only the caller's own data (session.employee.id), so no object-level access check is needed
- The product list is small per employee, so there is no pagination

---

## howismycommit-48

| Field | Value |
|---|---|
| id | howismycommit-48 |
| generatedAt | 2026-11-23T17:57:47+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 2bb01ccfd53841c29cfac848df73a47efe08c672 |
| files.changed | 2 |
| files.added | 0 |
| files.modified | 2 |
| files.deleted | 0 |
| files.insertions | 0 |
| files.deletions | 3 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 3 |
| summary.info | 2 |
| before | auth.guard.ts and accounts.ts held three noisy comments: 'is it good to just return ?', 'prioritize wich every found first' and a question about why a table exists. |
| after | The three comment lines are gone. Nothing else changed in the code. |

### changeType (1)

- config

### effects (2)

- No behaviour change
- Touches the auth guard and an accounts schema file, but only deletes comment lines

### filesReviewed (2)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/auth/guards/auth.guard.ts | modified | green | no issues |
| apps/finnaux-api/src/drizzle/schema/accounts.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| b30b2d8e | F4 | Noisy or misspelled comments added against the comment rule | resolved | Fixed by this commit: none of the three comments is left in auth.guard.ts or accounts.ts; the finding in howismycommit-6 is now marked resolved. |
| b30b2d8e | F5, F6 | Aggregation row always returns 0; raw SQL names | open | Still open and not touched by this commit (report-builder.query.ts:87 and the typed "lao"."loanDate"). |

### checks (3)

| status | command | result |
|---|---|---|
| green | git show 2bb01ccf (diff is only 3 deleted comment lines) | passed |
| green | bunx tsc --noEmit and bunx oxlint (auth guards, accounts schema) | passed |
| green | bun run build | passed (run earlier in this session) |

### gaps (1)

- Other comments in these files were left alone, including the INFO comment about money stored as double precision, which gives a real reason

### info (2)

- A comment-only change; no test is needed
- An unrelated uncommitted change in finnaux.controller.ts (an OTP rate limit) was not part of this commit

---

## howismycommit-47

| Field | Value |
|---|---|
| id | howismycommit-47 |
| generatedAt | 2026-11-23T17:57:47+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 06be55adfc5ad4b8f2a1e5ec15fbae413196bb0a |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 1 |
| files.deletions | 1 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 4 |
| summary.info | 3 |
| before | An API group with no active endpoint got auth type 'bearer', although the credentials contract says API_KEY and the only key such a group can store is apiKey. |
| after | The fallback is 'API_KEY', so the credentials routes report API_KEY, validate against the apiKey schema and store API_KEY in the group's credentials. |

### changeType (2)

- bug-fix
- api

### effects (2)

- GET and PUT credentials and the credentials schema route for groups without an active endpoint
- Groups that have an endpoint are unchanged (they still use the endpoint's own value, such as hmac)

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/external/shared/external-api-runtime.service.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 07f82b0a | F1 | Keyless group saved with authType bearer | resolved | Fixed by this commit (external-api-runtime.service.ts:76); the finding in howismycommit-9 is now marked resolved. |

### checks (4)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/external/shared | passed |
| green | script: getApiGroupAuthContext on a real local group with no active endpoint, and one with an endpoint | passed: API_KEY with no keys; the group with an endpoint still returned hmac (run earlier in this session) |
| green | bun run build | passed (run earlier in this session) |

### gaps (2)

- Existing stored credentials saved under the old 'bearer' fallback keep that auth type; no data fix was made
- No automated test covers the fallback

### info (3)

- Existing endpoint auth types are lowercase (bearer, basic, hmac, custom) while this value and the schema builder use uppercase; the contract requires API_KEY, so this was followed
- The API groups list route still returns 'none' for groups without an endpoint (external-apis.service.ts:251); left unchanged
- Nothing else reads the stored auth type of group credentials, so the value only shows in the credentials routes

---

## howismycommit-46

| Field | Value |
|---|---|
| id | howismycommit-46 |
| generatedAt | 2026-11-23T17:57:47+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 7cce418b6d1a3878d11a5a7a26ec208a09762d0c |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 116 |
| files.deletions | 44 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 4 |
| summary.info | 4 |
| before | A Finnaux send held a database transaction (and one pooled connection) for its whole length, including the PDF render and the Finnaux call, so about as many concurrent sends as pool connections could freeze the API. |
| after | The lock covers only a short claim step: it re-checks the status, marks the document ESIGN_PENDING and commits. The PDF render and Finnaux call run outside any transaction, and the previous status and time are put back if the send fails. A second click gets a 409. |

### changeType (2)

- bug-fix
- api

### effects (3)

- POST esign/create-request for Finnaux documents: a second click during a send gets 409 'already being sent'
- A failed send leaves the document as it was; a first-ever failed send leaves an empty document row with status NOT_RECEIVED
- A claim with no Finnaux session older than 5 minutes is treated as a failed send and can be taken over

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/los/loan-application/esign/esign.service.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 74acf255f9ca7a3ce84c99d8439dd15c9f7af40f | F1 | The send lock holds a database connection for the whole send, which can freeze the pool | resolved | Fixed by this commit: only the claim runs in a transaction and the slow work runs outside it (esign.service.ts:174-196, 644, 727). |
| 74acf255f9ca7a3ce84c99d8439dd15c9f7af40f | F2-F1 (howismycommit-43 F2 and howismycommit-44 F1) | Pending check not atomic; signed file saved without PDF check | resolved | Both still fixed: the claim re-check is under the per-document lock (esign.service.ts:644-727) and uploadSignedPdf still requires %PDF-. |

### checks (4)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint (esign, external shared, auth guards, accounts schema) | passed |
| green | script: claim and release on the local database with a pool of 2 (two clicks, third click, release, stale takeover, restore of an old failed request) | passed: no hang, exactly one claim wins (run earlier in this session) |
| green | bun run build | passed (run earlier in this session) |

### gaps (2)

- No real Finnaux send was made, and the failure path was tested on release directly, not through a forced Finnaux error
- No automated test covers the claim and release

### info (4)

- Narrow race: if the old request's Finnaux webhook or a Check status click lands during a re-send, it can overwrite the claim marker, and a quick second click could then get through
- If the server stops mid-send, a document that already has an older Finnaux session stays 'pending' until Check status is clicked; one without a session frees itself after 5 minutes
- If Finnaux accepts a request but saving it fails, the claim is released and a retry could send a second request; this existed before the change
- The claim also sets updaterId, which is not restored when a send fails

---

## howismycommit-45

| Field | Value |
|---|---|
| id | howismycommit-45 |
| generatedAt | 2026-11-23T16:44:43+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 74acf255f9ca7a3ce84c99d8439dd15c9f7af40f |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 63 |
| files.deletions | 19 |
| verdict | review-with-caution |
| score | 90 |
| commitScore | 90 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 3 |
| summary.info | 3 |
| before | Two eSign sends for one document at the same moment could both reach Finnaux, and a downloaded signed file was saved without checking it was a PDF. |
| after | Finnaux sends take a per-document Postgres advisory lock and re-read the status before calling Finnaux, so the second send gets the 'already pending' 409. A signed file is saved only if it starts with %PDF-; anything else is logged and skipped so a later status check retries. |

### changeType (2)

- bug-fix
- api

### effects (3)

- POST esign/create-request for Finnaux documents now runs inside a database transaction that stays open until Finnaux has answered and the row is saved
- Signed files that are not PDFs are no longer stored; esignedFileUrl stays empty until a good file arrives
- The Digio path is unchanged

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/los/loan-application/esign/esign.service.ts | modified | amber | F1 |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | The send lock holds a database connection for the whole send, which can freeze the pool |
| location | apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:173 |
| problem | The lock transaction stays open while createFinnauxEsignRequest renders the PDF, calls Finnaux and saves the row, and those steps run their own queries on other pooled connections. If as many sends (including double clicks, since each waiting click also holds a connection) are running as the pool has connections, every connection is held by a waiting transaction and none is left for the inner queries. |
| impact | The sends and every other API request that needs a database connection hang, because the driver has no wait limit, until the server is restarted. Reproduced with a pool of 2: two concurrent sends stayed stuck after 5 seconds. The pool is DATABASE_POOL_MAX (10 locally), so it takes about 10 concurrent sends or double clicks. |
| fix | Keep the lock short: inside one quick transaction take the lock, re-check the status and mark the document ESIGN_PENDING, then commit; do the PDF render and Finnaux call outside any transaction, and put the previous status back if Finnaux fails. A cap on concurrent sends below the pool size is a smaller alternative. |
| evidence | return this.databaseService.db.transaction(async (tx) => {<br>        await tx.execute( |
| status | resolved |
| resolvedIn | 7cce418b6d1a3878d11a5a7a26ec208a09762d0c |
| resolvedAt | 2026-11-23T11:26:18.606Z |
| resolvedNote | The lock transaction now only claims the document (select, check, mark ESIGN_PENDING) and the PDF render and Finnaux call run outside any transaction, with the claim undone on failure (apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:174-196, 644, 727). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (3)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 4c4198f4a54c2c653f7fba65575e42b18852716e | F2 | Pending check is not atomic, so two creates can both reach Finnaux | resolved | Fixed by this commit: the lock and re-read make a second send wait and get the pending 409 (esign.service.ts:173-216). |
| 5aaac3db75ab0e52d1be7fb4292ce5f33447ecee | F1 | Downloaded signed file is saved without checking it is a PDF | resolved | Fixed by this commit: uploadSignedPdf requires the %PDF- header and returns null otherwise (esign.service.ts:1158-1164). |
| 4c4198f4a54c2c653f7fba65575e42b18852716e | F1 | A REVOKE or RESEND reply of SUCCESS marks the document signed | resolved | Verified still fixed (esign.service.ts, getFinnauxActionStatus). |

### checks (5)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/los/loan-application/esign | passed |
| green | script: PDF check on the real uploadSignedPdf, copySignedPdfFromUrl and saveFinnauxSignedPdf (real PDF, HTML, JSON, empty, bad base64) | passed: only the real PDFs were uploaded (run earlier in this session) |
| green | script: two concurrent sends with and without the advisory lock | passed: without the lock 2 Finnaux requests, with the lock 1 and the other refused (run earlier in this session) |
| green | script: pool of 2 with two concurrent lock transactions | reproduced the freeze behind F1: stuck after 5 seconds |

### gaps (3)

- No real Finnaux send was made, so the lock was tested as a mechanism, not through the real create flow
- The production DATABASE_POOL_MAX is unknown; .env.example leaves it empty
- A PDF with bytes before the %PDF- header would be refused; this is rare and was not seen in the one real signed file

### info (3)

- No test covers the lock or the PDF check
- The lock key is a 32-bit hash of loanApplicationId and systemDocumentId; a collision only makes two unrelated documents wait for each other
- Two API servers behind one database are still covered, because the lock lives in Postgres

---

## howismycommit-44

| Field | Value |
|---|---|
| id | howismycommit-44 |
| generatedAt | 2026-11-23T16:04:00+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 5aaac3db75ab0e52d1be7fb4292ce5f33447ecee |
| files.changed | 15 |
| files.added | 2 |
| files.modified | 13 |
| files.deleted | 0 |
| files.insertions | 811 |
| files.deletions | 99 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 3 |
| summary.info | 4 |
| before | Every eSign request followed the global provider setting, Finnaux signed-file links were stored as Finnaux sent them, there was no audit trail, and the loan product documents page no longer accepted the four Digio settings. |
| after | Each document remembers which provider sent it, Finnaux signed PDFs are copied to our storage, the masked Finnaux audit trail is stored and served from GET esign/audit-trail, and the Digio settings are accepted again with stored values kept for missing fields. |

### changeType (3)

- feature
- schema
- api

### effects (4)

- Loan product documents save and list (four Digio fields back in the response)
- Templates config: the eSign guard now runs only when Finnaux is selected
- Loan application documents list gains esignProvider
- New columns on loanApplicationDocuments are now part of migration 0016_finnaux_esign

### filesReviewed (15)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/los/loan-application/esign/esign.service.ts | modified | amber | F1 |
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | modified | green | no issues |
| apps/finnaux-api/src/external/finnaux/finnaux-esign-audit-trail.ts | added | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/dto/get-esign-audit-trail.dto.ts | added | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/esign.controller.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/dto/index.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/loan-documents.service.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/dto/update-loan-document.dto.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/loan-documents.module.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/templates/templates.service.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/templates/templates.module.ts | modified | green | no issues |
| apps/finnaux-api/src/drizzle/schema/loan-applications.schema.ts | modified | green | no issues |
| apps/finnaux-api/src/drizzle/schema/enums.ts | modified | green | no issues |
| apps/finnaux-api/src/drizzle/schema/enum-map.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/documents/document.service.ts | modified | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Downloaded signed file is saved without checking it is a PDF |
| location | apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:1109 |
| problem | copySignedPdfFromUrl stores whatever the URL returns as <id>-signed.pdf. If Finnaux answers an expired or wrong link with a 200 HTML or JSON page, that page is saved as the signed PDF. |
| impact | The stored link then points to our own storage, so isStoredOnOurSide is true and the file is never copied again, neither by a status check nor by the webhook; the signed document stays broken with no error. |
| fix | Before uploading, check the buffer starts with %PDF (or the response content-type is application/pdf); otherwise log and return null so the next status check or webhook retries. |
| evidence | const pdf = await this.finnauxService.downloadSignedEsignPdf(url) |
| status | resolved |
| resolvedIn | 74acf255f9ca7a3ce84c99d8439dd15c9f7af40f |
| resolvedAt | 2026-11-23T11:14:43.248Z |
| resolvedNote | uploadSignedPdf refuses any file that does not start with %PDF- and returns null so a later status check retries (apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:1158-1164). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (3)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 5aaac3db75ab0e52d1be7fb4292ce5f33447ecee | F1 | Downloaded signed file is saved without checking it is a PDF | open | No %PDF or content-type check exists anywhere; the download returns the raw bytes (finnaux.service.ts:1163-1170) and they are uploaded as is (esign.service.ts:1109-1111). |
| 4c4198f4a54c2c653f7fba65575e42b18852716e | F1 | A REVOKE or RESEND reply of SUCCESS marks the document signed | resolved | Verified still fixed (esign.service.ts:1183-1195). |
| 4c4198f4a54c2c653f7fba65575e42b18852716e | F2 | Pending check is not atomic, so two creates can both reach Finnaux | open | Still a read, then a separate create with no lock (esign.service.ts:170-186). |

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit (current tree, HEAD deb8f879) | passed |
| green | bunx oxlint (los, finnaux, configurations, drizzle schema, webhooks) | passed |
| grey | jest | not run: no test covers the eSign code |

### gaps (2)

- The review describes the current code: esign.service.ts has changed a lot since this commit
- The app boot with the new module imports was verified earlier in the session, not in this run

### info (4)

- Every STATUS call on a signed document no longer resets esignedAt: fixed later with coalesce (esign.service.ts:894)
- There is no retry job any more, so a failed audit-trail save is retried only by the next webhook, a status click or a manual refresh (user's decision)
- Audit-trail dates are passed through as Finnaux text by choice
- The audit trail is only protected by the normal login guard, like the other loan application routes

---

## howismycommit-43

| Field | Value |
|---|---|
| id | howismycommit-43 |
| generatedAt | 2026-11-23T16:04:00+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 4c4198f4a54c2c653f7fba65575e42b18852716e |
| files.changed | 10 |
| files.added | 1 |
| files.modified | 9 |
| files.deleted | 0 |
| files.insertions | 759 |
| files.deletions | 22 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 86 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 3 |
| summary.info | 4 |
| before | Loan application eSign went only through Digio, needed a documentUrl from the frontend, and failed when no notification receivers were set. |
| after | When the Finnaux eSign group is selected, the backend renders the linked template to PDF, builds signers from the loan customers, and calls Finnaux. STATUS, RESEND_INVITATION and REVOKE go through POST esign/action, and GET routes to Finnaux STATUS when a session exists. |

### changeType (3)

- feature
- api
- schema

### effects (3)

- New column loanApplicationDocuments.esignSession (now part of migration 0016)
- Loan application documents list returns more template fields
- Finnaux API request logs strip strings over 2000 characters for eSign calls only

### filesReviewed (10)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/los/loan-application/esign/esign.service.ts | modified | amber | F2 |
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | modified | green | no issues |
| apps/finnaux-api/src/fixed-cuids.ts | modified | green | no issues |
| apps/finnaux-api/src/drizzle/schema/loan-applications.schema.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/documents/document.service.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/dto/create-esign-request.dto.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/dto/index.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/dto/run-esign-action.dto.ts | added | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/esign.controller.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/esign.module.ts | modified | green | no issues |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | A REVOKE or RESEND reply of SUCCESS marks the document signed |
| location | apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:1183 |
| problem | runFinnauxEsignAction mapped data.status the same way for every action, so a SUCCESS reply to a revoke or resend saved the document as signed. |
| impact | A revoked or re-sent agreement could show as signed with no signed PDF behind it. |
| fix | Map data.status only for STATUS; REVOKE always ESIGNED_FAILURE; RESEND leaves the status unchanged. |
| evidence | const esignAgreementStatus =<br>      action === 'REVOKE' ? (mappedStatus ?? 'ESIGNED_FAILURE') : mappedStatus |
| status | resolved |
| resolvedIn | 5aaac3db75ab0e52d1be7fb4292ce5f33447ecee |
| resolvedAt | 2026-11-21T07:34:06Z |
| resolvedNote | getFinnauxActionStatus maps the provider status only for STATUS, stores ESIGNED_FAILURE for REVOKE and leaves RESEND_INVITATION unchanged (apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:1183-1195). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Pending check is not atomic, so two creates can both reach Finnaux |
| location | apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:170 |
| problem | The pending check reads the row, then calls Finnaux, then upserts. Two clicks at once both pass the check and both create a Finnaux request; the second overwrites the first session and reference id. |
| impact | Customers get two signing links. If they sign the first one, our status check and the Finnaux webhook look up only the second request, so the real signature is never recorded (the webhook logs an unknown journey and is ignored). |
| fix | Lock the document row (select for update in a transaction) or set ESIGN_PENDING before calling Finnaux and roll back on failure. |
| evidence | if (await this.isFinnauxEsignSelected()) {<br>      if (<br>        existingDocument && |
| status | resolved |
| resolvedIn | 74acf255f9ca7a3ce84c99d8439dd15c9f7af40f |
| resolvedAt | 2026-11-23T11:14:43.248Z |
| resolvedNote | Sends for one document now take a Postgres advisory lock and re-read the status before calling Finnaux, so a second click waits and gets the pending 409 (apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:173-216); a new risk from holding the connection is reported separately. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (3)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 4c4198f4a54c2c653f7fba65575e42b18852716e | F1 | A REVOKE or RESEND reply of SUCCESS marks the document signed | resolved | Verified still fixed (esign.service.ts:1183-1195). |
| 4c4198f4a54c2c653f7fba65575e42b18852716e | F2 | Pending check is not atomic, so two creates can both reach Finnaux | open | Still a read, then a separate create with no lock (esign.service.ts:170-186). |
| 5aaac3db75ab0e52d1be7fb4292ce5f33447ecee | F1 | Downloaded signed file is saved without checking it is a PDF | open | copySignedPdfFromUrl still uploads the bytes unchecked (esign.service.ts:1109-1111). |

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit (current tree, HEAD deb8f879) | passed |
| green | bunx oxlint (los, finnaux, configurations, drizzle schema, webhooks) | passed |
| grey | jest | not run: no test covers the eSign code |

### gaps (2)

- The review describes the current code: esign.service.ts has changed a lot since this commit (roles, company signer, webhook)
- Finnaux status shapes for REVOKE and RESEND were never seen

### info (4)

- The old note about esignedAt being reset on every status check is fixed: it now uses coalesce (esign.service.ts:894)
- Digio create no longer requires notification receivers in this commit; that was restored later in b8abe45b
- The pending check only covers ESIGN_PENDING, not WAITING_FOR_ESIGN, which Finnaux creates never use
- Branch HEAD is now deb8f879, the merge of PR 113

---

## howismycommit-42

| Field | Value |
|---|---|
| id | howismycommit-42 |
| generatedAt | 2026-11-23T12:52:58+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 0c32162fb9e1eb05ded7628157393d1eea6a60af |
| files.changed | 29 |
| files.added | 9 |
| files.modified | 16 |
| files.deleted | 3 |
| files.insertions | 168061 |
| files.deletions | 5215 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 4 |
| summary.info | 3 |
| before | The branch had its own 0011_finnaux_esign and 0012_esign_signer_roles migrations, which clashed with dev's own 0011 and the later report-builder migrations. |
| after | Merge of origin/dev (18 commits). The three conflicting files (journal and snapshots 0011 and 0012) were resolved by taking dev's versions and deleting the branch's two old migration files, so the drizzle folder matches dev until the next commit adds 0016. |

### changeType (2)

- config
- schema

### effects (3)

- Brings in dev's report-builder changes and migrations 0011 to 0015
- Removes the branch-only migrations 0011_finnaux_esign and 0012_esign_signer_roles; their content was regenerated as 0016 in the next commit
- No eSign code was changed by the merge

### filesReviewed (6)

| path | change | status | note |
|---|---|---|---|
| drizzle/meta/_journal.json | modified | green | no issues |
| drizzle/meta/0011_snapshot.json | modified | green | no issues |
| drizzle/meta/0012_snapshot.json | modified | green | no issues |
| drizzle/0011_finnaux_esign.sql | deleted | green | no issues |
| drizzle/0012_esign_signer_roles.sql | deleted | green | no issues |
| apps/finnaux-api/src/reports/report-builder | modified | green | dev's changes, not reviewed in depth |

### findings (0)

_Empty._

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 25011428b20b972d5e60e0f5d31e46366e1dd54e | F1 | A non-ASCII signature header makes the check throw a 500 | resolved | Fixed in b158cdbe (finnaux-webhook-signature.ts:16-36). |
| 4b536ba3b24611e2dd5ef4e1c12fcd9ea9d5d99b | F1 | Migration 0012 extends a numbering clash with dev | resolved | Fixed by this merge and f30f3649: only dev's 0011 to 0015 plus 0016 remain, with increasing journal times (drizzle/meta/_journal.json). |

### checks (4)

| status | command | result |
|---|---|---|
| green | git diff --name-only --diff-filter=U after resolving | passed: no conflicts left, no conflict markers in the journal |
| green | bunx tsc --noEmit | passed |
| green | bun run build | passed |
| green | bun db:migrate and bun seed:check on local finnaux_dev | passed: 17 of 17 applied, 0 orphans |

### gaps (2)

- dev's own report-builder changes and tests were not reviewed in depth and jest was not run
- dev's migration 0012 deletes 11 report fields; this was approved and backed up locally, but other databases will lose them too when migrated

### info (3)

- A later merge, da67278f (dev PR 112), is now at the branch tip and changed none of the eSign, webhook, template or drizzle files
- The earlier branch-only migrations must never be applied to a shared database; they exist only in earlier commits
- Whoever merges next into dev will not clash with 0016 unless dev gets a new migration first

---

## howismycommit-41

| Field | Value |
|---|---|
| id | howismycommit-41 |
| generatedAt | 2026-11-23T12:52:58+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | f30f36497a88f6e0fe2d4438881841ea4ea2fca4 |
| files.changed | 3 |
| files.added | 2 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 53775 |
| files.deletions | 0 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 4 |
| summary.info | 3 |
| before | After merging dev, our eSign work had no migration (the old 0011 and 0012 were removed because they clashed with dev's 0011). |
| after | One migration, 0016_finnaux_esign, built on dev's 0015: all eSign enums and columns with IF NOT EXISTS guards, the esignProvider backfill for existing rows, and the 4 Finnaux endpoint rows with ON CONFLICT DO NOTHING. |

### changeType (3)

- schema
- feature
- config

### effects (3)

- Adds esignSession, esignProvider, esignAuditTrail, esignAuditTrailFetchedAt to loanApplicationDocuments and six esign settings columns to templates
- Existing signed or sent rows get esignProvider FINNAUX when they have a session, otherwise DIGIO
- Safe to run on a database that already has some of these objects

### filesReviewed (3)

| path | change | status | note |
|---|---|---|---|
| drizzle/0016_finnaux_esign.sql | added | green | no issues |
| drizzle/meta/0016_snapshot.json | added | green | no issues |
| drizzle/meta/_journal.json | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 25011428b20b972d5e60e0f5d31e46366e1dd54e | F1 | A non-ASCII signature header makes the check throw a 500 | resolved | Fixed in b158cdbe (finnaux-webhook-signature.ts:16-36). |
| 4b536ba3b24611e2dd5ef4e1c12fcd9ea9d5d99b | F1 | Migration 0012 extends a numbering clash with dev | resolved | Fixed by this commit: old 0011/0012 are gone and 0016 follows dev's 0015 with a later journal time (drizzle/meta/_journal.json). |

### checks (4)

| status | command | result |
|---|---|---|
| green | bun scripts/check-migrations.ts drizzle/0016_finnaux_esign.sql | passed (warning only: updates existing rows, which is the intended provider backfill) |
| green | bun db:migrate on local finnaux_dev (earlier in this session) | passed: 17 of 17 applied, seed:check 0 orphans |
| green | journal order check (node script) | passed: 17 entries, times strictly increasing, 17 sql files |
| green | bunx tsc --noEmit and bun run build | passed |

### gaps (2)

- Only run on the local database; whether demo or other databases already hold the removed branch-only 0011 or 0012 in their migration table was not checked
- No rollback script

### info (3)

- The snapshot was generated before the guards were added by hand, which is fine because the guards do not change the final schema
- The RC FINNAUX enum value is not repeated here because dev's 0011 already adds it
- Run order matters on shared databases: do not apply this before dev's 0011 to 0015

---

## howismycommit-40

| Field | Value |
|---|---|
| id | howismycommit-40 |
| generatedAt | 2026-11-23T12:52:57+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | b158cdbeab055c90d7b87dcb613e7712714f0fed |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 11 |
| files.deletions | 3 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 4 |
| summary.info | 2 |
| before | A Finnaux webhook signature header with a non-ASCII character passed the string-length check but made timingSafeEqual throw, so the public endpoint returned 500. |
| after | The signature must be exactly 64 hex characters (any case) and byte lengths are compared before timingSafeEqual, so any malformed header gets a 401 instead of a crash. |

### changeType (2)

- bug-fix
- security

### effects (1)

- Only the Finnaux webhook signature check changes; valid Finnaux deliveries (lowercase hex HMAC-SHA256) behave as before

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/webhooks/finnaux-webhook-signature.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (7)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 25011428b20b972d5e60e0f5d31e46366e1dd54e | F1 | A non-ASCII signature header makes the check throw a 500 | resolved | Fixed by this commit: signature must match /^[0-9a-f]{64}$/i and byte lengths are compared (finnaux-webhook-signature.ts:16-36). |
| 4b536ba3b24611e2dd5ef4e1c12fcd9ea9d5d99b | F1 | Migration 0012 extends a numbering clash with dev | resolved | Old 0011/0012 are gone; 0016_finnaux_esign sits on dev 0015 with increasing journal times (drizzle/meta/_journal.json). |
| 5aaac3db75ab0e52d1be7fb4292ce5f33447ecee | F1 | Downloaded signed file is saved without checking it is a PDF | open | copySignedPdfFromUrl still uploads the downloaded bytes without a PDF check (esign.service.ts:1109). |
| 4c4198f4a54c2c653f7fba65575e42b18852716e | F1 | A REVOKE or RESEND reply of SUCCESS marks the document signed | resolved | Verified still fixed: REVOKE maps to ESIGNED_FAILURE and RESEND to no change (esign.service.ts:1190-1193). |
| 4c4198f4a54c2c653f7fba65575e42b18852716e | F2 | Pending check is not atomic, so two creates can both reach Finnaux | open | The pending check is still a read followed by a separate create (esign.service.ts:171-186). |
| 28df9458 | F1 | Saving the page wipes the Digio eSign settings | resolved | Verified still fixed: stored settings are kept when a field is missing (loan-documents.service.ts:51-66). |
| 28df9458 | F2 | eSign can be turned on for a template with no signature boxes | resolved | Verified still fixed: a template with no boxes is rejected on save (loan-documents.service.ts:233-238). |

### checks (4)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint (webhooks, los, configurations, drizzle schema) | passed |
| green | bun run build | passed |
| green | signature check script (valid, uppercase, non-ASCII, tampered body, short) | passed |

### gaps (2)

- No test file covers the webhook signature check; jest was not run in this review
- No real Finnaux delivery has been received yet in this review (checked only with scripts)

### info (2)

- If Finnaux ever signs in a format other than 64 hex characters, every delivery would be refused with 401; the guide shows hex HMAC-SHA256, which matches
- The branch HEAD is now da67278f, a later merge of dev (PR 112) that did not touch these files

---

## howismycommit-39

| Field | Value |
|---|---|
| id | howismycommit-39 |
| generatedAt | 2026-11-23T12:33:04+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 25011428b20b972d5e60e0f5d31e46366e1dd54e |
| files.changed | 7 |
| files.added | 1 |
| files.modified | 6 |
| files.deleted | 0 |
| files.insertions | 183 |
| files.deletions | 6 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 5 |
| summary.info | 2 |
| before | Finnaux eSign status changed only when someone clicked Check status; there was no Finnaux webhook endpoint. |
| after | POST /v1/webhooks/finnaux/esign is public and unthrottled, verifies Finnaux's HMAC-SHA256 signature over timestamp + raw body, rejects timestamps older than 5 minutes, replies 200 at once and runs the status check for the journey in the background. main.ts keeps the raw body only for /webhooks/finnaux/ requests, and the secret comes from FINNAUX_ESIGN_WEBHOOK_SECRET. |

### changeType (4)

- feature
- api
- security
- config

### effects (3)

- main.ts JSON parser now stores a raw body copy for Finnaux webhook requests only
- New env value FINNAUX_ESIGN_WEBHOOK_SECRET; without it every delivery gets 401
- WebhooksModule now imports EsignModule

### filesReviewed (7)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/webhooks/finnaux-webhook-signature.ts | added | amber | F1 |
| apps/finnaux-api/src/webhooks/webhooks.service.ts | modified | green | no issues |
| apps/finnaux-api/src/webhooks/webhooks.controller.ts | modified | green | no issues |
| apps/finnaux-api/src/webhooks/webhooks.module.ts | modified | green | no issues |
| apps/finnaux-api/src/main.ts | modified | green | no issues |
| apps/finnaux-api/src/app.config.ts | modified | green | no issues |
| .env.example | modified | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | A non-ASCII signature header makes the check throw a 500 |
| location | apps/finnaux-api/src/webhooks/finnaux-webhook-signature.ts:33 |
| problem | The length check compares string lengths, but timingSafeEqual compares byte lengths. A signature header with a character such as 'é' has the same string length as the hex digest but more bytes, so timingSafeEqual throws ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH instead of returning false. |
| impact | Anyone can make the public endpoint return 500 instead of 401 and fill the error log; no signed delivery is affected. |
| fix | Compare buffer lengths: build both Buffers first and return false when their byteLength differs, or reject any signature that is not /^[0-9a-f]{64}$/. |
| evidence |     expected.length === signature.length &&<br>    timingSafeEqual(Buffer.from(expected), Buffer.from(signature)) |
| status | resolved |
| resolvedIn | b158cdbeab055c90d7b87dcb613e7712714f0fed |
| resolvedAt | 2026-11-23T07:22:13.044Z |
| resolvedNote | Signature must now match /^[0-9a-f]{64}$/i and byte lengths are compared before timingSafeEqual (apps/finnaux-api/src/webhooks/finnaux-webhook-signature.ts:16-36); a non-ASCII header returns false. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 5aaac3db75ab0e52d1be7fb4292ce5f33447ecee | F1 | Downloaded signed file is saved without checking it is a PDF | open | copySignedPdfFromUrl still uploads the downloaded bytes without a PDF check (esign.service.ts:1109). |
| 4b536ba3b24611e2dd5ef4e1c12fcd9ea9d5d99b | F1 | Migration 0012 extends a numbering clash with dev | open | drizzle/0011_finnaux_esign.sql and 0012 are still on top of a different 0011 than origin/dev. |

### checks (6)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint (changed folders) | passed |
| green | bun run build | passed |
| green | curl POST /api/v1/webhooks/finnaux/esign with a bad signature (local server) | passed: 401 Invalid signature, so the route is public and the raw body is captured |
| green | signature check script (valid, tampered body, old timestamp, wrong secret, missing signature) | passed |
| grey | tests | not run: no test command configured |

### gaps (2)

- No real Finnaux delivery was received; Finnaux cannot reach the local server
- Not confirmed whether Finnaux retries send a fresh x-finnaux-timestamp; if retries reuse the first one, retries after 5 minutes would be refused

### info (2)

- main.ts was changed because the signature needs the exact request bytes; the raw copy is kept only for /webhooks/finnaux/ requests
- Repeated or out-of-order deliveries are not de-duplicated by delivery id; each one just re-runs the status check, which is safe

---

## howismycommit-38

| Field | Value |
|---|---|
| id | howismycommit-38 |
| generatedAt | 2026-11-23T12:32:47+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 3a5bf9692a4c17a47b80a7d757bb4b8238c06cbc |
| files.changed | 5 |
| files.added | 1 |
| files.modified | 4 |
| files.deleted | 0 |
| files.insertions | 394 |
| files.deletions | 100 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 3 |
| summary.info | 4 |
| before | Finnaux eSign put customers into boxes by position, had no company signer, overwrote esignedAt on every signed status check, could store an empty audit trail, and the documents list did not show each signer's status. |
| after | Customers fill boxes of their own role; an optional Company box is signed by the logged-in employee or, after credit approval, the credit approver (new GET company-signers endpoint and companySigner field). esignedAt is kept once set, empty audit trails are refused, the documents list returns esignSignerStatuses and esignHasCompanySigner, and a webhook entry point re-runs the status check for a journey. |

### changeType (3)

- feature
- api
- bug-fix

### effects (4)

- POST esign/create-request accepts companySigner
- New GET esign/company-signers
- Loan application documents list gains esignSignerStatuses and templates[].esignHasCompanySigner
- Manual audit-trail refresh returns 400 when Finnaux sends an empty trail

### filesReviewed (5)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/los/loan-application/esign/esign.service.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/esign.controller.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/dto/create-esign-request.dto.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/finnaux-esign-signers.ts | added | green | no issues |
| apps/finnaux-api/src/los/loan-application/documents/document.service.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 5aaac3db75ab0e52d1be7fb4292ce5f33447ecee | F1 | Downloaded signed file is saved without checking it is a PDF | open | copySignedPdfFromUrl still uploads the downloaded bytes without a PDF check (esign.service.ts:1109). |
| 4b536ba3b24611e2dd5ef4e1c12fcd9ea9d5d99b | F1 | Migration 0012 extends a numbering clash with dev | open | drizzle/0011_finnaux_esign.sql and 0012 are still on top of a different 0011 than origin/dev. |

### checks (4)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit (in a worktree at this commit) | passed |
| green | bunx oxlint (changed folders) | passed |
| green | bun run build | passed |
| grey | tests | not run: no test command configured |

### gaps (2)

- No real Finnaux request with role-matched boxes or a company signer was sent
- Company signer contact lookup was checked only for the one local credit approver

### info (4)

- With no retry job, a failed PDF copy or audit-trail save is only retried by the next webhook delivery, a Check status click or a manual refresh (user's decision)
- Two deliveries processed at the same moment can each copy the signed PDF, leaving one unused attachment
- esignSignerStatuses includes signing links, which were already visible in lastEsignWebhookPayload
- The earlier open finding about a non-atomic pending check is outside this commit's window but still open

---

## howismycommit-37

| Field | Value |
|---|---|
| id | howismycommit-37 |
| generatedAt | 2026-11-23T12:32:32+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 4b536ba3b24611e2dd5ef4e1c12fcd9ea9d5d99b |
| files.changed | 8 |
| files.added | 2 |
| files.modified | 6 |
| files.deleted | 0 |
| files.insertions | 53783 |
| files.deletions | 1 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 3 |
| summary.info | 2 |
| before | Template signature boxes had only coordinates, and customers were placed into boxes by position (borrower first, then the rest in order), with at most 6 boxes. |
| after | Every box must have a role (BORROWER, CO_BORROWER, GUARANTOR or COMPANY); saving needs exactly one Borrower box and allows at most one Company box and up to 10 boxes. Two new enums come with migration 0012. |

### changeType (3)

- feature
- schema
- api

### effects (3)

- Template create and update API: `role` is now required on every esignSigners item, so the current frontend cannot save templates with boxes until it sends roles
- Templates saved earlier without roles fail on eSign send (handled in the next commit)
- Migration 0012 adds two enum types and no columns

### filesReviewed (8)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/drizzle/schema/enums.ts | modified | green | no issues |
| apps/finnaux-api/src/drizzle/schema/enum-map.ts | modified | green | no issues |
| apps/finnaux-api/src/drizzle/schema/templates.schema.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/templates/dto/template-esign-signer.dto.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/templates/templates.service.ts | modified | green | no issues |
| drizzle/0012_esign_signer_roles.sql | added | amber | F1 |
| drizzle/meta/0012_snapshot.json | added | amber | F1 |
| drizzle/meta/_journal.json | modified | amber | F1 |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Migration 0012 extends a numbering clash with dev |
| location | drizzle/0012_esign_signer_roles.sql:1 |
| problem | origin/dev already has its own 0011_instalment_ledger_lines_and_speed. This branch has 0011_finnaux_esign, and 0012 is generated on top of that snapshot, so the journal and snapshots will conflict when dev is merged. |
| impact | Merging dev gives two different 0011 migrations and a 0012 snapshot that does not include dev's change; per DATABASE.md, Drizzle can silently skip or rerun migrations depending on journal `when` order. |
| fix | Merge dev, delete this branch's 0011 and 0012 (keep their custom SQL, such as the endpoint INSERTs and the IF NOT EXISTS guards), and run bun db:generate once to produce a single migration, as DATABASE.md describes for whoever merges second. |
| evidence | DO $$ BEGIN CREATE TYPE "public"."esign_company_signer_enum" AS ENUM('LOGGED_IN_EMPLOYEE', 'CREDIT_APPROVER'); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint |
| status | resolved |
| resolvedIn | f30f36497a88f6e0fe2d4438881841ea4ea2fca4 |
| resolvedAt | 2026-11-23T07:22:13.044Z |
| resolvedNote | Old 0011/0012 are gone and 0016_finnaux_esign sits on dev 0015 with increasing journal times (drizzle/meta/_journal.json, drizzle/0016_finnaux_esign.sql:1). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (3)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 5aaac3db75ab0e52d1be7fb4292ce5f33447ecee | F1 | Downloaded signed file is saved without checking it is a PDF | open | copySignedPdfFromUrl still uploads the downloaded bytes without a PDF check (esign.service.ts:1109). |
| 4c4198f4a54c2c653f7fba65575e42b18852716e | F2 | Pending check is not atomic, so two creates can both reach Finnaux | open | The pending check is still a read followed by a separate create (esign.service.ts:171). |
| 4c4198f4a54c2c653f7fba65575e42b18852716e | F1 | A REVOKE or RESEND reply of SUCCESS marks the document signed | resolved | Verified still fixed: REVOKE maps to ESIGNED_FAILURE and RESEND to no change (esign.service.ts:1190). |

### checks (4)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit (in a worktree at this commit) | passed |
| green | bunx oxlint (changed folders) | passed |
| green | bun run build | passed |
| grey | tests | not run: no test command configured |

### gaps (2)

- Migration 0012 was not run against a database
- No automated tests for the new template save rules

### info (2)

- `role` is required, so this must deploy together with the frontend role select, as the frontend asked
- The two enum types exist only because createEnum always creates a pg type; no column uses them

---

## howismycommit-36

| Field | Value |
|---|---|
| id | howismycommit-36 |
| generatedAt | 2026-11-21T13:04:50+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| commitScore | 100 |
| target.kind | commit |
| target.commit | b8abe45b9f8db6e7f1356769665228bf129a2b35 |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 13 |
| files.deletions | 10 |
| verdict | looks-good |
| score | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 2 |
| before | A Digio send with an empty notification-receiver list went to every customer type. |
| after | A Digio send with an empty list is rejected with "At least one notification receiver is required", exactly as before the Finnaux work; the unused LOAN_CUSTOMER_TYPE_VALUES import is removed. |

### previousFindings (4)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 4c4198f4a54c2c653f7fba65575e42b18852716e | F1 | A REVOKE or RESEND reply of SUCCESS marks the document signed | resolved | Status is mapped only for STATUS; REVOKE stores ESIGNED_FAILURE and RESEND leaves it unchanged (apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:941). |
| 4c4198f4a54c2c653f7fba65575e42b18852716e | F2 | Pending check is not atomic, so two creates can both reach Finnaux | open | The pending check still reads the row and calls Finnaux with no lock (apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:157). |
| 28df9458ca716ea1af1b296f9f8df528735b5336 | F1 | Saving the page wipes the Digio eSign settings | resolved | Stored Digio settings are carried over for missing fields (apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/loan-documents.service.ts:66). |
| 28df9458ca716ea1af1b296f9f8df528735b5336 | F2 | eSign can be turned on for a template with no signature boxes | resolved | Templates with an empty esignSigners list are rejected (apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/loan-documents.service.ts:233). |

### changeType (1)

- bug-fix

### effects (1)

- Digio create-request only; Finnaux is not affected

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/los/loan-application/esign/esign.service.ts | modified | green | no issues |

### findings (0)

_Empty._

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps | passed |
| grey | tests | not run: no test command configured |

### gaps (1)

- Not exercised against Digio

### info (2)

- The frontend no longer sends notificationReceivers (UI commit 7d2edc61), so Digio documents set up through the current UI keep [] and cannot be sent until the Digio inputs are restored, as the frontend prompt asks
- Matches the original check in 8b74e4d3, including that it runs before the CUSTOM coordinates branch

---

## howismycommit-35

| Field | Value |
|---|---|
| id | howismycommit-35 |
| generatedAt | 2026-11-21T13:04:50+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| commitScore | 100 |
| target.kind | commit |
| target.commit | 2c41646bcc07c5d1d0bf8d67a93979a82dc858d3 |
| files.changed | 4 |
| files.added | 2 |
| files.modified | 2 |
| files.deleted | 0 |
| files.insertions | 53746 |
| files.deletions | 1 |
| verdict | looks-good |
| score | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 4 |
| summary.info | 2 |
| before | No migration existed for the eSign template settings, esignSession, the RC FINNAUX value, the audit-trail columns or the Finnaux DL, RC and eSign endpoints. |
| after | One migration 0011_finnaux_esign adds all of them with IF NOT EXISTS guards, backfills esignProvider on existing eSign rows, and inserts the four Finnaux endpoints; the seed carries the same endpoints. |

### previousFindings (4)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 4c4198f4a54c2c653f7fba65575e42b18852716e | F1 | A REVOKE or RESEND reply of SUCCESS marks the document signed | resolved | Status is mapped only for STATUS; REVOKE stores ESIGNED_FAILURE and RESEND leaves it unchanged (apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:941). |
| 4c4198f4a54c2c653f7fba65575e42b18852716e | F2 | Pending check is not atomic, so two creates can both reach Finnaux | open | The pending check still reads the row and calls Finnaux with no lock (apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:157). |
| 28df9458ca716ea1af1b296f9f8df528735b5336 | F1 | Saving the page wipes the Digio eSign settings | resolved | Stored Digio settings are carried over for missing fields (apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/loan-documents.service.ts:66). |
| 28df9458ca716ea1af1b296f9f8df528735b5336 | F2 | eSign can be turned on for a template with no signature boxes | resolved | Templates with an empty esignSigners list are rejected (apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/loan-documents.service.ts:233). |

### changeType (2)

- schema
- migration

### effects (3)

- Every database gets the new templates and loanApplicationDocuments columns on db:migrate
- apiEndpoints gains four Finnaux rows (ON CONFLICT DO NOTHING)
- Must ship together with 5aaac3db, which reads the new columns

### filesReviewed (4)

| path | change | status | note |
|---|---|---|---|
| drizzle/0011_finnaux_esign.sql | added | green | no issues |
| drizzle/meta/0011_snapshot.json | added | green | no issues |
| drizzle/meta/_journal.json | modified | green | no issues |
| seed/data/apiEndpoints.json | modified | green | no issues |

### findings (0)

_Empty._

### checks (5)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps | passed |
| green | bun scripts/check-migrations.ts drizzle/0011_finnaux_esign.sql | passed (warning: updates existing rows, the esignProvider backfill) |
| green | bun db:migrate and bun seed:check on local finnaux_dev | passed: 12 of 12 migrations, 0 orphans (run during the change) |
| grey | tests | not run: no test command configured |

### gaps (2)

- Only run on the local finnaux_dev database, not on a fresh database or staging
- The open finding F2 of 4c4198f4 is unrelated to this commit

### info (2)

- Pushing this commit apart from 5aaac3db would leave either the code without columns or the columns without code; push them together
- The endpoint INSERT joins apiGroups, so on a fresh database the rows come from the seed instead, as the comment says

---

## howismycommit-34

| Field | Value |
|---|---|
| id | howismycommit-34 |
| generatedAt | 2026-11-21T13:04:50+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| commitScore | 96 |
| target.kind | commit |
| target.commit | 5aaac3db75ab0e52d1be7fb4292ce5f33447ecee |
| files.changed | 15 |
| files.added | 2 |
| files.modified | 13 |
| files.deleted | 0 |
| files.insertions | 811 |
| files.deletions | 99 |
| verdict | review-with-caution |
| score | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 2 |
| summary.info | 3 |
| before | Every eSign request followed the global provider setting, Finnaux signed-file links were stored as Finnaux sent them, there was no audit trail, and the loan product documents page no longer accepted the four Digio settings. |
| after | Each document remembers which provider sent it, open requests stay on that provider, Finnaux signed PDFs are copied to our storage, the masked Finnaux audit trail is stored and served from GET esign/audit-trail, and the Digio settings are accepted again with stored values kept for missing fields. |

### previousFindings (4)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 4c4198f4a54c2c653f7fba65575e42b18852716e | F1 | A REVOKE or RESEND reply of SUCCESS marks the document signed | resolved | Status is mapped only for STATUS; REVOKE stores ESIGNED_FAILURE and RESEND leaves it unchanged (apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:941). |
| 4c4198f4a54c2c653f7fba65575e42b18852716e | F2 | Pending check is not atomic, so two creates can both reach Finnaux | open | The pending check still reads the row and calls Finnaux with no lock (apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:157). |
| 28df9458ca716ea1af1b296f9f8df528735b5336 | F1 | Saving the page wipes the Digio eSign settings | resolved | Stored Digio settings are carried over for missing fields (apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/loan-documents.service.ts:66). |
| 28df9458ca716ea1af1b296f9f8df528735b5336 | F2 | eSign can be turned on for a template with no signature boxes | resolved | Templates with an empty esignSigners list are rejected (apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/loan-documents.service.ts:233). |

### changeType (3)

- feature
- schema
- api

### effects (4)

- Loan product documents save and list (four Digio fields back in the response)
- Templates config: the eSign guard now runs only when Finnaux is selected
- Loan application documents list gains esignProvider
- New columns on loanApplicationDocuments need migration 2c41646b

### filesReviewed (15)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/los/loan-application/esign/esign.service.ts | modified | amber | F1 |
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | modified | green | no issues |
| apps/finnaux-api/src/external/finnaux/finnaux-esign-audit-trail.ts | added | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/dto/get-esign-audit-trail.dto.ts | added | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/esign.controller.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/dto/index.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/loan-documents.service.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/dto/update-loan-document.dto.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/loan-documents.module.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/templates/templates.service.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/templates/templates.module.ts | modified | green | no issues |
| apps/finnaux-api/src/drizzle/schema/loan-applications.schema.ts | modified | green | no issues |
| apps/finnaux-api/src/drizzle/schema/enums.ts | modified | green | no issues |
| apps/finnaux-api/src/drizzle/schema/enum-map.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/documents/document.service.ts | modified | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Downloaded signed file is saved without checking it is a PDF |
| location | apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:877 |
| problem | copySignedPdfFromUrl stores whatever the URL returns as <id>-signed.pdf. If Finnaux answers an expired or wrong link with a 200 HTML or JSON page, that page is saved as the signed PDF. |
| impact | The stored link then points to our own storage, so isStoredOnOurSide is true and the file is never copied again; the signed document stays broken with no error. |
| fix | Before uploading, check the buffer starts with %PDF (or the response content-type is application/pdf); otherwise log and return null so the next STATUS call retries. |
| evidence | const pdf = await this.finnauxService.downloadSignedEsignPdf(url) |
| status | resolved |
| resolvedIn | 74acf255f9ca7a3ce84c99d8439dd15c9f7af40f |
| resolvedAt | 2026-11-23T11:26:18.606Z |
| resolvedNote | uploadSignedPdf refuses any file that does not start with %PDF- and returns null so a later status check retries (apps/finnaux-api/src/los/loan-application/esign/esign.service.ts: uploadSignedPdf). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps | passed |
| grey | tests | not run: no test command configured |

### gaps (3)

- The app was not started, so the new FinnauxModule imports in loan documents and templates were checked for cycles by reading, not by boot
- Finnaux STATUS and AUDIT_TRAIL response shapes are unconfirmed; the signed PDF keys and the AUDIT_TRAIL action are assumptions
- No automated tests cover eSign

### info (3)

- Every STATUS call on a signed document sets esignedAt to now() again; this line predates this commit (4c4198f4)
- If fetching the audit trail fails, the next STATUS call tries again, adding one Finnaux call per status check until it succeeds
- Audit-trail dates are passed through as Finnaux text by choice, so the AGENTS.md date rule is not touched

---

## howismycommit-33

| Field | Value |
|---|---|
| id | howismycommit-33 |
| generatedAt | 2026-11-20T18:13:36+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 4c4198f4a54c2c653f7fba65575e42b18852716e |
| files.changed | 10 |
| files.added | 1 |
| files.modified | 9 |
| files.deleted | 0 |
| files.insertions | 759 |
| files.deletions | 22 |
| verdict | review-with-caution |
| score | 86 |
| commitScore | 86 |
| quality | good |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 3 |
| summary.info | 4 |
| before | Loan application eSign went only through Digio, needed a documentUrl from the frontend, and failed when no notification receivers were set. |
| after | When the Finnaux eSign group is selected, the backend renders the linked template to PDF, builds signers from the loan customers in order, and calls Finnaux. STATUS, RESEND_INVITATION and REVOKE go through a new POST esign/action route, and GET routes to Finnaux STATUS when a session exists. Digio still runs otherwise, now signing all customer types when no receivers are set. |

### changeType (3)

- feature
- api
- schema

### effects (4)

- New column loanApplicationDocuments.esignSession needs a migration
- Loan application documents list returns more template fields
- Finnaux API request logs strip strings over 2000 characters for eSign calls only
- Digio create no longer requires notification receivers

### filesReviewed (10)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | modified | green | no issues |
| apps/finnaux-api/src/fixed-cuids.ts | modified | green | no issues |
| apps/finnaux-api/src/drizzle/schema/loan-applications.schema.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/documents/document.service.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/dto/create-esign-request.dto.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/dto/index.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/dto/run-esign-action.dto.ts | added | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/esign.controller.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/esign.module.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/esign.service.ts | modified | amber | F1 |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | A REVOKE or RESEND reply of SUCCESS marks the document signed |
| location | apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:580 |
| problem | runFinnauxEsignAction maps data.status the same way for every action, and SUCCESS maps to ESIGNED_SUCCESS. If Finnaux answers a revoke or resend with data.status SUCCESS (meaning the action worked), the document is saved as signed with esignedAt set. |
| impact | A revoked or re-sent agreement can show as signed in the loan application with no signed PDF behind it. |
| fix | Map data.status only for STATUS. For REVOKE always store ESIGNED_FAILURE. For RESEND_INVITATION leave the stored status unchanged. |
| evidence | const esignAgreementStatus =<br>      action === 'REVOKE' ? (mappedStatus ?? 'ESIGNED_FAILURE') : mappedStatus |
| status | resolved |
| resolvedIn | 5aaac3db75ab0e52d1be7fb4292ce5f33447ecee |
| resolvedAt | 2026-11-21T07:34:06Z |
| resolvedNote | getFinnauxActionStatus maps the provider status only for STATUS, stores ESIGNED_FAILURE for REVOKE and leaves RESEND_INVITATION unchanged (apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:941). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Pending check is not atomic, so two creates can both reach Finnaux |
| location | apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:140 |
| problem | The pending check reads the row, then calls Finnaux, then upserts. Two clicks at once both pass the check and both create a Finnaux request; the second overwrites the first session. |
| impact | Customers get two signing links. If they sign the first one, STATUS polls the second session and never sees the signature. |
| fix | Lock the document row (select for update in a transaction) or set ESIGN_PENDING before calling Finnaux and roll back on failure. |
| evidence | if (await this.isFinnauxEsignSelected()) {<br>      if (<br>        existingDocument && |
| status | resolved |
| resolvedIn | 74acf255f9ca7a3ce84c99d8439dd15c9f7af40f |
| resolvedAt | 2026-11-23T11:26:18.606Z |
| resolvedNote | Sends for one document take a Postgres advisory lock and re-check the status before marking it pending, so a second click gets the pending 409 (apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:644-727). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (0)

_Empty._

### checks (4)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <files changed in the 4 commits> | passed |
| green | bun run build | passed |
| grey | tests | not run: no test command configured |

### gaps (3)

- The signed-PDF field in the STATUS response is unknown, so saveFinnauxSignedPdf is a guess over four keys
- RESEND and REVOKE response shapes were never seen
- Signer order relies on the database enum order matching BORROWER, CO_BORROWER, GUARANTOR

### info (4)

- expiresAt keeps only the date part of expires_at and drops the time, by the user's choice to reuse getIsoDateFromDigio
- If the signed PDF comes back as a URL, that provider URL is stored as-is and may expire
- Pre-commit review howismycommit-29 (uncommitted target): F3 date helper is gone, F2 is still present as F2 here, F1 is narrowed and remains as F1 here
- Customer phone and email lookups run 4 queries per customer in a loop; fine for 6 customers

---

## howismycommit-32

| Field | Value |
|---|---|
| id | howismycommit-32 |
| generatedAt | 2026-11-20T18:13:36+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | f564093e057bb9dc76bbd8801deb19e63db4d409 |
| files.changed | 2 |
| files.added | 0 |
| files.modified | 2 |
| files.deleted | 0 |
| files.insertions | 56 |
| files.deletions | 21 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 3 |
| summary.info | 2 |
| before | The preview endpoint wrote every PDF to one shared output.pdf file next to the controller, sent it, then deleted it, so two requests at once could send each other's PDF. |
| after | The PDF is built in memory by TemplatesService.renderPdf and sent directly. Templates without signature boxes print exactly as before (Letter, default wait). Templates with boxes use their paper size, orientation, backgrounds and wait for network idle. The browser is always closed in finally. |

### changeType (2)

- feature
- refactor

### effects (2)

- Template PDF preview endpoint: same output for existing templates, a filename header is now set
- renderPdf is reused by the eSign flow

### filesReviewed (2)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/los/loan-application/templates/templates.controller.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/templates/templates.service.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (0)

_Empty._

### checks (4)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <files changed in the 4 commits> | passed |
| green | bun run build | passed |
| grey | tests | not run: no test command configured |

### gaps (1)

- PDF output not compared visually against the old output

### info (2)

- A new headless browser is still launched per request (existing behaviour)
- networkidle0 on eSign templates waits up to puppeteer's 30s default if an external asset never settles

---

## howismycommit-31

| Field | Value |
|---|---|
| id | howismycommit-31 |
| generatedAt | 2026-11-20T18:13:36+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 28df9458ca716ea1af1b296f9f8df528735b5336 |
| files.changed | 2 |
| files.added | 0 |
| files.modified | 2 |
| files.deleted | 0 |
| files.insertions | 64 |
| files.deletions | 79 |
| verdict | review-with-caution |
| score | 86 |
| commitScore | 86 |
| quality | good |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 3 |
| summary.info | 1 |
| before | The loan product documents page saved eSign mode, custom coordinates, notification receivers and channel for each document, and accepted any template with eSign on. |
| after | It saves only isEsignEnabled. eSign on now needs one active print-friendly template. The list response hides the four old fields and adds isPrintFriendly and esignSignerCount to each template. |

### changeType (2)

- refactor
- api

### effects (3)

- Loan product documents API: four request fields are now stripped by whitelist
- The Digio eSign path still reads eSignMode, signCoordinates, notificationReceivers and primaryNotificationChannel
- Products already saved with eSign on a non-print template can no longer save the page until fixed

### filesReviewed (2)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/dto/update-loan-document.dto.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/loan-documents.service.ts | modified | amber | F1 |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | Saving the page wipes the Digio eSign settings |
| location | apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/loan-documents.service.ts:46 |
| problem | update deletes and re-inserts every document row with only isEsignEnabled, so eSignMode resets to ALL, signCoordinates to null, notificationReceivers to [] and primaryNotificationChannel to EMAIL. The Digio path in esign.service.ts:164-208 still reads all four. |
| impact | Any product using Digio with custom coordinates, chosen receivers or SMS loses them the next time someone saves its documents page. Digio then signs with no coordinates, sends to every customer type (the new fallback) and uses email. |
| fix | Carry the four existing column values over in the insert (read them before the delete), or confirm Digio is not used and say so. |
| evidence | isEsignEnabled: document.isEsignEnabled ?? false, |
| status | resolved |
| resolvedIn | 5aaac3db75ab0e52d1be7fb4292ce5f33447ecee |
| resolvedAt | 2026-11-21T07:34:06Z |
| resolvedNote | The save reads the stored Digio settings before the delete and falls back to them for any missing field (apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/loan-documents.service.ts:66). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | eSign can be turned on for a template with no signature boxes |
| location | apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/loan-documents.service.ts:174 |
| problem | assertEsignTemplates checks only isPrintFriendly. createFinnauxEsignRequest also needs esignSigners to be non-empty. |
| impact | The configuration saves fine, but every eSign attempt on that document fails with 'has no signature boxes' at loan time. |
| fix | Also select esignSigners and reject templates whose list is empty when eSign is on. |
| evidence | const nonPrintTemplate = templates.find(<br>      (template) => !template.isPrintFriendly<br>    ) |
| status | resolved |
| resolvedIn | 5aaac3db75ab0e52d1be7fb4292ce5f33447ecee |
| resolvedAt | 2026-11-21T07:34:06Z |
| resolvedNote | assertEsignTemplates selects esignSigners and rejects templates with no signature boxes (apps/finnaux-api/src/configurations/loan-products/documents/loan-documents/loan-documents.service.ts:233). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (0)

_Empty._

### checks (4)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <files changed in the 4 commits> | passed |
| green | bun run build | passed |
| grey | tests | not run: no test command configured |

### gaps (1)

- Could not confirm whether any tenant still uses Digio eSign

### info (1)

- The insert now defaults isEsignEnabled to false instead of passing undefined; same stored result because the column defaults to false

---

## howismycommit-30

| Field | Value |
|---|---|
| id | howismycommit-30 |
| generatedAt | 2026-11-20T18:13:36+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 4648e3ab9840b3096cd8e6670af68a0174d0893d |
| files.changed | 7 |
| files.added | 1 |
| files.modified | 6 |
| files.deleted | 0 |
| files.insertions | 287 |
| files.deletions | 3 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 3 |
| summary.info | 3 |
| before | Templates only stored text, print, email and SMS settings. Nothing stopped a template from being switched off print friendly. |
| after | Print-friendly templates also store eSign settings (paper size, orientation, sign pages, page numbers, verify name, up to 6 signature boxes). Turning print friendly off is refused when a loan product document with eSign on uses the template. |

### changeType (3)

- feature
- schema
- api

### effects (3)

- Template create and update API accept six new optional fields, stripped when isPrintFriendly is false
- templates table gets six new columns with defaults, so existing rows keep working once migrated
- Four new pg enums need a migration before deploy

### filesReviewed (7)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/configurations/templates/dto/create-template.dto.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/templates/dto/index.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/templates/dto/template-esign-signer.dto.ts | added | green | no issues |
| apps/finnaux-api/src/configurations/templates/templates.service.ts | modified | green | no issues |
| apps/finnaux-api/src/drizzle/schema/enum-map.ts | modified | green | no issues |
| apps/finnaux-api/src/drizzle/schema/enums.ts | modified | green | no issues |
| apps/finnaux-api/src/drizzle/schema/templates.schema.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (0)

_Empty._

### checks (4)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <files changed in the 4 commits> | passed |
| green | bun run build | passed |
| grey | tests | not run: no test command configured |

### gaps (2)

- No migration in the commit; deploy fails until the user adds it (user's stated plan)
- Not tested against a running API or the frontend

### info (3)

- Signature boxes can still be emptied on a template that eSign uses; the eSign create call then fails with a clear 'no signature boxes' message
- assertNotUsedForEsign does not filter inactive loan products, so an inactive product name may appear in the error
- Because UpdateTemplateDto extends CreateTemplateDto, an update that leaves out isPrintFriendly silently drops all eSign fields

---

## howismycommit-29

| Field | Value |
|---|---|
| id | howismycommit-29 |
| generatedAt | 2026-11-20T16:10:22+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | uncommitted |
| target.commit | null |
| files.changed | 19 |
| files.added | 2 |
| files.modified | 17 |
| files.deleted | 0 |
| files.insertions | 1055 |
| files.deletions | 39 |
| verdict | review-with-caution |
| score | 87 |
| commitScore | null |
| quality | good |
| summary.red | 0 |
| summary.amber | 3 |
| summary.green | 3 |
| summary.info | 4 |
| before | eSign worked only through Digio with an uploaded PDF, templates had no eSign settings, and the template PDF route wrote every PDF to one shared output.pdf file on the server. |
| after | Print-friendly templates store paper size, orientation, pages and up to 6 signer boxes; when the Finnaux eSign group is selected, create-request renders the linked template to PDF and sends all loan customers to Finnaux, and a new action route runs STATUS, RESEND_INVITATION and REVOKE. The PDF route renders in memory at the template's paper settings. |

### changeType (3)

- feature
- schema
- api

### effects (6)

- Templates configuration create, update, list and detail APIs now accept and return the esign* fields
- LOS documents list returns template eSign settings and signer count inside templates[]
- esign/create-request switches provider at runtime; documentUrl is now optional (still required for Digio)
- esign/get-document runs a Finnaux status check when the document has an esignSession
- New DB columns on templates and loanApplicationDocuments plus 4 new enum types; APIs that read templates fail until the SQL is applied
- FinnauxService.executeLoggedRequest accepts any request shape and can omit large strings from logged responses

### filesReviewed (19)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/los/loan-application/esign/esign.service.ts | modified | amber | F1 |
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/esign.controller.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/esign.module.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/dto/create-esign-request.dto.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/dto/run-esign-action.dto.ts | added | green | no issues |
| apps/finnaux-api/src/los/loan-application/esign/dto/index.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/templates/templates.service.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/templates/templates.controller.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/documents/document.service.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/templates/dto/create-template.dto.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/templates/dto/template-esign-signer.dto.ts | added | green | no issues |
| apps/finnaux-api/src/configurations/templates/dto/index.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/templates/templates.service.ts | modified | green | no issues |
| apps/finnaux-api/src/drizzle/schema/templates.schema.ts | modified | green | no issues |
| apps/finnaux-api/src/drizzle/schema/loan-applications.schema.ts | modified | green | no issues |
| apps/finnaux-api/src/drizzle/schema/enums.ts | modified | green | no issues |
| apps/finnaux-api/src/drizzle/schema/enum-map.ts | modified | green | no issues |
| apps/finnaux-api/src/fixed-cuids.ts | modified | green | no issues |

### findings (3)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | RESEND and REVOKE responses are mapped like a status check |
| location | apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:582 |
| problem | Every action maps data.status through mapFinnauxEsignStatus, which treats SUCCESS as signed and PENDING as pending. If Finnaux acknowledges a REVOKE or RESEND_INVITATION with data.status SUCCESS, the document is marked ESIGNED_SUCCESS; if REVOKE echoes PENDING, the document stays ESIGN_PENDING. |
| impact | A revoked request can show as Signed (and the signed-PDF save runs), or stay Pending so create-request keeps returning 409 and the document can never be sent again. |
| fix | Map data.status only for STATUS. For REVOKE always set ESIGNED_FAILURE; for RESEND_INVITATION leave esignAgreementStatus unchanged. |
| evidence | const mappedStatus = this.mapFinnauxEsignStatus(providerStatus)<br>    const esignAgreementStatus =<br>      action === 'REVOKE' ? (mappedStatus ?? 'ESIGNED_FAILURE') : mappedStatus |
| status | resolved |
| resolvedIn | 5aaac3db75ab0e52d1be7fb4292ce5f33447ecee |
| resolvedAt | 2026-11-23T11:26:18.606Z |
| resolvedNote | getFinnauxActionStatus maps the provider status only for STATUS, stores ESIGNED_FAILURE for REVOKE and leaves RESEND_INVITATION unchanged (apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:1299). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Pending check is not atomic, so two creates can both reach Finnaux |
| location | apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:140 |
| problem | The pending check reads existingDocument before the Finnaux call and the upsert runs after it, with no lock. Two create-request calls for the same document (double click, two users) both pass the check. |
| impact | Two billed Finnaux requests; customers get two SMS links, and the second upsert overwrites the first session, so signing the first link is never tracked. |
| fix | Lock the loanApplicationDocuments row (or an advisory lock on loanApplicationId + systemDocumentId) across check and create, or send an idempotency-key derived from the document. |
| evidence | existingDocument.esignSession &&<br>        existingDocument.esignAgreementStatus === 'ESIGN_PENDING' |
| status | resolved |
| resolvedIn | 74acf255f9ca7a3ce84c99d8439dd15c9f7af40f |
| resolvedAt | 2026-11-23T11:26:18.606Z |
| resolvedNote | The pending check now runs under a per-document lock in claimFinnauxEsignSend, so two creates cannot both reach Finnaux (apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:644-727). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[3] · F3

| Field | Value |
|---|---|
| id | F3 |
| severity | P3 |
| title | New date normaliser helper with an unverified format |
| location | apps/finnaux-api/src/los/loan-application/esign/esign.service.ts:773 |
| problem | getExpiresAt is a local date normaliser, which AGENTS.md forbids, and it assumes Finnaux sends dd/MM in IST. Only one sample (01/01/2030) has been seen, which cannot tell dd/MM from MM/dd. The comment also says the value is stored, but it is only returned. |
| impact | If Finnaux sends MM/dd, expiresAt is wrong for any day above 12 (null) or swapped (wrong date), and the frontend may show a valid link as expired. |
| fix | Confirm the format with a real response with a day above 12, and agree with the team where provider dates are converted (an existing pattern is getIsoDateFromSurepass); fix the comment. |
| evidence | const expiresAt = parse(<br>      `${value} +05:30`,<br>      'dd/MM/yyyy HH:mm:ss xxx', |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-23T11:26:18.606Z |
| resolvedNote | The date helper never reached a commit; signer expiry now reuses the shared getIsoDateFromDigio (apps/finnaux-api/src/los/loan-application/esign/finnaux-esign-signers.ts:40). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (0)

_Empty._

### checks (4)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps libs | passed |
| green | bun run build | passed, 0 warnings |
| grey | bun run test | not run: no tests cover templates or esign |

### gaps (4)

- No real Finnaux call was made: the signed-PDF location (signed_pdf, signed_document, signed_file, pdf) and the email and verify_name signer keys are guesses
- The resend and revoke response shapes are unknown, which is why F1 is a risk rather than a reproduced bug
- The schema SQL was generated with drizzle-kit but not applied or run against the database
- No unit tests for signer ordering, box count limits or status mapping

### info (4)

- finnaux_esign_action_enum creates a Postgres type that no column uses; it exists only because DTO enums must live in enums.ts
- The new esign/action route is AuthGuard-only with no page right, the same as the existing esign routes, so any signed-in employee can revoke
- If Finnaux accepts a create but the database upsert then fails, the billed request and its session are lost
- renderPdf loads the template twice (findOne, then compile calls findOne again); harmless but redundant

---

## howismycommit-28

| Field | Value |
|---|---|
| id | howismycommit-28 |
| generatedAt | 2026-11-19T12:02:10+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | de4a1a7ee83da67aecb55fef1108bacea4551945 |
| files.changed | 20 |
| files.added | 1 |
| files.modified | 7 |
| files.deleted | 12 |
| files.insertions | 97 |
| files.deletions | 2819 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 4 |
| before | Each AI tool had its own copy of the project rules (.cursorrules, .windsurfrules, .clinerules, .github/copilot-instructions.md, AI.md, AIDER.md, CODEX.md, GEMINI.md, QWEN.md, RULES.md, a full CLAUDE.md) kept in sync by a sync:ai-rules script. AGENTS.md still named Biome as the formatter, and CONTRIBUTING.md had no rule about commit authorship or PR descriptions. |
| after | This clean merge of dev makes AGENTS.md the single rule file: CLAUDE.md only imports it (@AGENTS.md), the copies and the sync script are deleted, and a finnaux-backend skill is added under .agents/skills. AGENTS.md now lists the repo guides, asks agents to report changes, names Oxlint and Oxfmt, and forbids AI authors or Co-authored-by trailers. CONTRIBUTING.md adds human-only commit authorship and a PR description section; README.md explains agent setup. One TODO comment is removed from customer.service.ts. |

### changeType (2)

- docs
- config

### effects (4)

- Claude Code now loads AGENTS.md through CLAUDE.md; Codex and Antigravity read AGENTS.md directly.
- Cursor, Windsurf, Cline, Aider and Copilot no longer get a rule file from this repo.
- The sync:ai-rules package script and scripts/sync-ai-rules.ts are gone.
- No runtime behaviour changes: the only code change removes a comment in customer.service.ts.

### filesReviewed (10)

| path | change | status | note |
|---|---|---|---|
| .agents/skills/finnaux-backend/SKILL.md | added | green | no issues |
| AGENTS.md | modified | green | no issues |
| CLAUDE.md | modified | green | no issues |
| CONTRIBUTING.md | modified | green | no issues |
| DATABASE.md | modified | green | no issues |
| README.md | modified | green | no issues |
| apps/finnaux-api/src/lms/customer/customer.service.ts | modified | green | no issues |
| package.json | modified | green | no issues |
| scripts/sync-ai-rules.ts | deleted | green | no issues |
| .clinerules, .cursorrules, .windsurfrules, .cursor/rules/finnaux-api-rules.mdc, .github/copilot-instructions.md, AI.md, AIDER.md, CODEX.md, GEMINI.md, QWEN.md, RULES.md | deleted | green | no issues |

### findings (0)

_Empty._

### previousFindings (3)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 9c4985deed12aaef2dad35721a9ea46b0527e3cb | F1 | Duplicate address check can be passed by two requests at the same time | resolved | Still fixed: apps/finnaux-api/src/los/loan-application/asset-vehicles/asset-vehicles.service.ts:603 locks the borrower row before the duplicate check. |
| 4d5e1f5df46a4cf7c54ecf0e4ff94ff149e92b7a | F1 | Provider check ignores the default group when no group is selected | resolved | Still fixed: apps/finnaux-api/src/los/loan-application/asset-vehicles/asset-vehicles.service.ts:689 falls back to the first active group. |
| 9686054ccc924765566bf085450942930483f5b7 | F1 | Full Finnaux DL response is sent to the frontend and kept in cache | resolved | Still fixed: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:772 sends raw: null. |

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/lms/customer/customer.service.ts | passed |
| grey | tests | not run: no runtime behaviour changed (docs, config and one removed comment) |

### gaps (2)

- This is a clean merge of dev with no conflict resolution in the merge commit, so the review covers the dev changes it brings in.
- Links in the new docs to external sites (Codex, Claude Code, Antigravity guides) were not opened; no network calls were made.

### info (4)

- No file in the repo (md, json, ts, yml) still references the deleted rule files or the sync:ai-rules script, and every guide AGENTS.md links to (CONTEXT.md, LOGGING.md, DATABASE.md, CONTRIBUTING.md, scripts/fix-type-imports.ts) exists.
- AGENTS.md and CONTRIBUTING.md now forbid AI agents as commit author, committer or Co-authored-by, which matches how the commits on this branch are made.
- Developers using Cursor, Windsurf, Cline, Aider or Copilot lose their repo rule file; they must point their tool at AGENTS.md themselves.
- Pre-existing, not from this merge: the Money & Rounding edge-case table in AGENTS.md has a broken row (row 4 splits across columns), so it renders badly.

---

## howismycommit-27

| Field | Value |
|---|---|
| id | howismycommit-27 |
| generatedAt | 2026-11-19T11:02:47+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 3dbd8880a58cdc3914e3437a830c2635af68a5bf |
| files.changed | 3 |
| files.added | 0 |
| files.modified | 3 |
| files.deleted | 0 |
| files.insertions | 57 |
| files.deletions | 11 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 3 |
| summary.info | 4 |
| before | GET api-groups/:apiGroupId/credentials returned a 500 'Stored external API credentials are invalid' when the saved credentials could not be decrypted or parsed, and the global filter never sent an errorCode. A missing server encryption key was also hidden behind that same 'credentials are invalid' 500. |
| after | The GET credentials endpoint now returns 422 with the generic message and top-level errorCode CREDENTIALS_UNREADABLE only when the stored value fails to decrypt or parse. A missing server key is thrown outside the try, so it stays a plain 500 with no errorCode. The global filter adds errorCode only when an HttpException response object carries a string errorCode. |

### changeType (2)

- bug fix
- API

### effects (3)

- AllExceptionsFilter: every error response may now carry errorCode, but only the new 422 in ExternalApisService sets one, so no other response changed.
- ExternalApiRuntimeService (provider calls): unreadable credentials are still a 500 with the same message, because the new exception extends InternalServerErrorException. Only a missing server key now shows 'External API credentials encryption key is not configured' instead of 'Stored external API credentials are invalid'.
- PUT api-groups/:apiGroupId/credentials: no change. decryptStoredCredentialsOrNull still turns any decrypt failure into null, so a full set of required keys replaces unreadable credentials.

### filesReviewed (3)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/common/exception-filters/all-exceptions.filter.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts | modified | green | no issues |
| apps/finnaux-api/src/external/shared/external-api-credentials-crypto.service.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (3)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 9c4985deed12aaef2dad35721a9ea46b0527e3cb | F1 | Duplicate address check can be passed by two requests at the same time | resolved | Still fixed: apps/finnaux-api/src/los/loan-application/asset-vehicles/asset-vehicles.service.ts:603. |
| 4d5e1f5df46a4cf7c54ecf0e4ff94ff149e92b7a | F1 | Provider check ignores the default group when no group is selected | resolved | Still fixed: apps/finnaux-api/src/los/loan-application/asset-vehicles/asset-vehicles.service.ts:689. |
| 9686054ccc924765566bf085450942930483f5b7 | F1 | Full Finnaux DL response is sent to the frontend and kept in cache | resolved | Still fixed: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:772. |

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <3 changed .ts files> | passed |
| green | throwaway script outside the repo running the real ExternalApisService.getApiGroupCredentials, crypto service and AllExceptionsFilter with stubbed DB and runtime | passed: wrong key, non-JSON and JSON null stored values gave 422 with errorCode CREDENTIALS_UNREADABLE; missing server key gave 500 with no errorCode; 404, 403 and 400 gave no errorCode; runtime decrypt failure gave 500 with no errorCode; a good row returned masked values; decryptStoredCredentialsOrNull returned null for unreadable data; logs held no decrypted values or key names. |

### gaps (2)

- No automated test was added for the 422 path or for the filter's errorCode passthrough. jest exists, but there are no specs for these modules.
- Not run against a real database or through the full HTTP stack (guards, pipes, interceptors). Only the service and filter were exercised directly.

### info (4)

- Only ExternalApisService.decryptStoredCredentialsForRead sets errorCode in the codebase today. The filter passes through any string errorCode from any HttpException status, so future code that sets errorCode on a 5xx would also send it.
- The 422 is logged at warn level with only the generic message and no stack. The runtime 500 logs the stack of UnreadableExternalApiCredentialsException, which holds no decrypted values.
- Promise.all in getApiGroupCredentials rejects with the auth-context 404 before any decrypt runs, so a missing or inactive API group never returns CREDENTIALS_UNREADABLE.
- Pre-existing, not from this commit: parseCredentials accepts a decrypted JSON number or string (Object.entries gives {} or per-character keys) instead of rejecting it. This only matters if such data was encrypted with the real key.

---

## howismycommit-26

| Field | Value |
|---|---|
| id | howismycommit-26 |
| generatedAt | 2026-11-19T11:02:47+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 525ecdf4bf8f5a7680cdbad2b532a61ce260aa80 |
| files.changed | 2 |
| files.added | 0 |
| files.modified | 2 |
| files.deleted | 0 |
| files.insertions | 67 |
| files.deletions | 18 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 3 |
| before | Finnaux PAN verification passed when the response had a data object and no top-level success:false. If pan_number was missing, it used the PAN the user typed. The Finnaux DL response sent back the raw provider payload (photos removed) and kept it in the cache. RC provider selection only counted an explicit selection on the integration group and ignored isActive flags. The RC address endpoint checked for a duplicate address without any lock, so two parallel requests could both insert the same address. |
| after | PAN verification now fails on data.success:false or a top-level status other than SUCCESS, and fails if the response has no pan_number, so the typed PAN is no longer trusted. The DL response always sends raw: null and the raw payload is no longer cached. RC provider selection filters active groups and integration groups and falls back to the first active group by name and provider, the same rule as ExternalApiRuntimeService and customer.service.ts. createRcAddress locks the borrower customer row with SELECT ... FOR UPDATE on the CLS transaction before the duplicate check, so parallel calls run one after another. |

### changeType (2)

- bug fix
- API

### effects (4)

- POST Finnaux PAN verify route: responses that previously passed with a missing pan_number or a non-SUCCESS status now return 400.
- POST Finnaux DL verify route: the raw field in the response is now always null. No backend code reads it.
- POST los/loan-application/:id/asset-vehicles/:assetVehicleId/verify-rc: may now route to Finnaux when no group is explicitly selected and Finnaux RC is first by name, or to Surepass when the Finnaux RC group or its integration group is inactive.
- POST los/loan-application/:id/asset-vehicles/rc-address: the FOR UPDATE and AddressService.create both use the same CLS 'tx', so the lock is held until the insert commits. Other transactions that insert rows referencing the same customer wait briefly for this short transaction.

### filesReviewed (2)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/asset-vehicles/asset-vehicles.service.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (3)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 9c4985deed12aaef2dad35721a9ea46b0527e3cb | F1 | Duplicate address check can be passed by two requests at the same time | resolved | Fixed in this commit: apps/finnaux-api/src/los/loan-application/asset-vehicles/asset-vehicles.service.ts:603 locks the borrower row before the duplicate check. |
| 4d5e1f5df46a4cf7c54ecf0e4ff94ff149e92b7a | F1 | Provider check ignores the default group when no group is selected | resolved | Fixed in this commit: apps/finnaux-api/src/los/loan-application/asset-vehicles/asset-vehicles.service.ts:689 falls back to the first active group. |
| 9686054ccc924765566bf085450942930483f5b7 | F1 | Full Finnaux DL response is sent to the frontend and kept in cache | resolved | Fixed in this commit: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:772 sends raw: null. |

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/external/finnaux/finnaux.service.ts apps/finnaux-api/src/los/loan-application/asset-vehicles/asset-vehicles.service.ts | passed |
| grey | tests | not run: no tests cover these files (-5) |

### gaps (4)

- No tests cover these files, so the changed PAN, DL and RC behaviour is not tested.
- No sample Finnaux PAN response or fixture exists in the repo, so it could not be confirmed that a successful response always has data.pan_number and a top-level status of exactly 'SUCCESS'. If not, valid PANs would now be rejected. The same status check is already used for DL and RC.
- The frontend was not checked; any screen reading raw from the Finnaux DL response now gets null.
- The lock relies on the default READ COMMITTED isolation; the query was not run against a live database.

### info (3)

- The new provider fallback does not check apiIntegrationGroupsTable.isEnabled like customer.service.ts does, but both RC calls go through resolveCredentialsByApiEndpointId, which throws Forbidden when the integration is disabled, so the result is the same.
- SELECT ... FOR UPDATE on customers also blocks other transactions that insert rows with an FK to this customer until the rc-address transaction commits. FOR NO KEY UPDATE would block less. The transaction is short and makes no external calls, so this is minor.
- Old DL cache entries written before this commit still carry a raw key, but the response ignores it and always sends raw: null.

---

## howismycommit-25

| Field | Value |
|---|---|
| id | howismycommit-25 |
| generatedAt | 2026-11-18T18:43:57+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | f652cdc3860c676cf1ed52ca869480a5cc998a65 |
| files.changed | 21 |
| files.added | 6 |
| files.modified | 15 |
| files.deleted | 0 |
| files.insertions | 55011 |
| files.deletions | 20 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 3 |
| summary.info | 4 |
| before | The branch had migration 0008 with placeholder '...' descriptions and '{...}' metadata, the report builder could only use loan overview and loan application fields and filtered loans by loanDate >= fromDate, and the master report had no ledger movement data. |
| after | This merge of dev brings a fixed migration 0008 with real descriptions and valid JSON metadata, a new migration 0009 that rebuilds the report_field_source enum, adds the loanChargesHeadMovement and loanLedgerMovement SQL functions and 14 ledger movement report fields, and switches off the Calculation Method field. The report builder can join ledger movement columns, takes includeInternalVouchers, and now includes every loan up to toDate (no fromDate bound on loanDate). The master report takes an optional fromDate and returns stockMovement, interestMovement and chargesMovement per loan. |

### changeType (4)

- feature
- schema
- migration
- tests

### effects (4)

- bun db:migrate on existing databases now runs a valid 0008 and the new 0009 (enum rebuilt via text, functions created, report fields inserted).
- Report builder: existing reports with a fromDate now include loans booked before fromDate; this is intended and covered by a test.
- Master report: every request now also runs loanChargesHeadMovement for all loans.
- Seed customReportFields.json gains the 14 ledger movement fields and marks Calculation Method inactive.

### filesReviewed (21)

| path | change | status | note |
|---|---|---|---|
| drizzle/0008_finnaux_kyc_endpoints.sql | modified | green | no issues |
| drizzle/0009_report_builder_ledger_movement.sql | added | green | no issues |
| drizzle/meta/0009_snapshot.json | added | green | no issues |
| drizzle/meta/_journal.json | modified | green | no issues |
| apps/finnaux-api/src/drizzle/functions/loan-charges-head-movement.sql | added | green | no issues |
| apps/finnaux-api/src/drizzle/functions/loan-ledger-movement.sql | added | green | no issues |
| apps/finnaux-api/src/drizzle/functions/loan-financial-functions.md | modified | green | no issues |
| apps/finnaux-api/src/drizzle/functions/__tests__/loan-charges-head-movement.spec.ts | added | green | no issues |
| apps/finnaux-api/src/drizzle/schema/enums.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/master-report/dto/find-all-master-report.dto.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/master-report/master-report.service.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/report-builder/report-builder.ledger-movement.ts | added | green | no issues |
| apps/finnaux-api/src/reports/report-builder/report-builder.query.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/report-builder/report-builder.service.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/report-builder/report-builder.sources.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/report-builder/report-builder.types.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/report-builder/dto/query-custom-report.dto.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/report-builder/__tests__/fixtures.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/report-builder/__tests__/report-builder.query.spec.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/report-builder/__tests__/report-builder.run.spec.ts | modified | green | no issues |
| seed/data/customReportFields.json | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 29d30d20700fb25c23233e401d4f2ee3c52f659e | F1 | Migration 0008 had placeholder '{...}' metadata that is not valid JSON | resolved | Still fixed: drizzle/0008_finnaux_kyc_endpoints.sql:13-15 hold real descriptions and valid JSON metadata. |
| f90a4d3c0c3d4917e7a784d12c81c72de05c25e5 | F1 | PAN success check never uses the real status field | resolved | Still fixed (not committed yet): apps/finnaux-api/src/external/finnaux/finnaux.service.ts:458 rejects any status other than SUCCESS. |

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <15 changed .ts files> | passed |
| green | bun run test -- apps/finnaux-api/src/reports/report-builder apps/finnaux-api/src/drizzle/functions | passed: 85 passed, 26 skipped (the loanChargesHeadMovement DB suite needs TEST_DATABASE_URL) |

### gaps (4)

- This is a clean merge of dev (no conflict resolution in the merge commit), so the review covers the dev changes it brings into this branch, not decisions made in the merge.
- The loanChargesHeadMovement database test suite was skipped because TEST_DATABASE_URL is not set; the functions were only smoke-tested on the local DB, which has no vouchers, so the money values were not checked against real data.
- The 53k-line 0009 snapshot was not read line by line.
- The master report fromDate and movement objects have no automated test.

### info (4)

- Migration 0009 is already applied on the local database, and both new SQL functions run there.
- The voucher type and charges head ids hardcoded in the SQL functions match fixedIds (REPAYMENT_(LOAN_(JOURNAL)), LOAN_STOCK, INTEREST_CHARGED, CHARGES_RECOVERABLE).
- The master report calls loanChargesHeadMovement with no loan id list, so every request scans the vouchers of all loans for these three heads. This matches the existing loanChargesPeriodBalances(NULL, ...) call there, but it will slow down as vouchers grow; the report builder passes the filtered loan ids instead.
- The report builder no longer bounds loanDate by fromDate for any report, so a periodic report now lists loans booked before the period too. This is intended (comment and test say so) but changes results of existing saved reports.

---

## howismycommit-24

| Field | Value |
|---|---|
| id | howismycommit-24 |
| generatedAt | 2026-11-18T18:37:46+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 9c4985deed12aaef2dad35721a9ea46b0527e3cb |
| files.changed | 6 |
| files.added | 1 |
| files.modified | 5 |
| files.deleted | 0 |
| files.insertions | 200 |
| files.deletions | 4 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 2 |
| summary.info | 4 |
| before | The RC verify flow saved the RC permanent address in the verification trail, but there was no way to save it as a customer address. AddressService.create accepted only the full CreateAddressDto. |
| after | A new POST /v1/los/loan-application/:loanApplicationId/asset-vehicles/rc-address route finds the active borrower, checks that the latest RC verification for that registration number has the same permanent address text, skips the save if the borrower already has an address with the same street text and location, and otherwise saves it as an Other Address through AddressService inside a DB transaction. AddressService.create now takes a wider input type where landmark, areaLocalitySector and nearestPoliceStationAddress are optional. |

### changeType (2)

- feature
- api

### effects (4)

- AssetVehiclesModule now imports AddressModule and AssetVehiclesService depends on AddressService.
- AddressService.create type is wider; the existing POST /lms/customer/:customerId/address route still passes the full validated CreateAddressDto, so its behaviour and rights do not change.
- New rows in addresses, customerAddresses and customerAddressTypes for the borrower of the loan application.
- Frontend RC verify screen can now call the new route; it gets no address id back.

### filesReviewed (6)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/lms/customer/address/address.service.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/asset-vehicles/asset-vehicles.controller.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/asset-vehicles/asset-vehicles.module.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/asset-vehicles/asset-vehicles.service.ts | modified | amber | F1 |
| apps/finnaux-api/src/los/loan-application/asset-vehicles/dto/create-rc-address.dto.ts | added | green | no issues |
| apps/finnaux-api/src/los/loan-application/asset-vehicles/dto/index.ts | modified | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Duplicate address check can be passed by two requests at the same time |
| location | apps/finnaux-api/src/los/loan-application/asset-vehicles/asset-vehicles.service.ts:595 |
| problem | The duplicate check reads with this.databaseService.db (outside the request transaction) and there is no unique constraint on street text and location for a customer. If the user double clicks the save button, or the UI retries, two requests can both see no existing address and both insert. |
| impact | The borrower gets two identical Other Address rows, which then show twice in the customer address list and in any address picker such as the vehicle RC address field. |
| fix | Take a lock before the check, for example run the check on the CLS tx and first lock the borrower row with select ... for update (or a pg_advisory_xact_lock on the customer id), so a second request waits and then sees the first insert. |
| evidence | const [existingAddress] = await this.databaseService.db<br>      .select({ id: customerAddressesTable.id })<br>      .from(customerAddressesTable) |
| status | resolved |
| resolvedIn | 525ecdf4bf8f5a7680cdbad2b532a61ce260aa80 |
| resolvedAt | 2026-11-18T13:10:44.307Z |
| resolvedNote | The borrower row is locked with select ... for update inside the request transaction at apps/finnaux-api/src/los/loan-application/asset-vehicles/asset-vehicles.service.ts:603 before the duplicate check, which now reads on the same tx, committed in 525ecdf4. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 4d5e1f5df46a4cf7c54ecf0e4ff94ff149e92b7a | F1 | Provider check ignores the default group when no group is selected | open | Still there: apps/finnaux-api/src/los/loan-application/asset-vehicles/asset-vehicles.service.ts:638 compares only selectedApiGroupId. |
| 9686054ccc924765566bf085450942930483f5b7 | F1 | Full Finnaux DL response is sent to the frontend and kept in cache | open | Still there: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:763. |

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <6 changed .ts files> | passed |
| grey | tests | not run: no test command is configured, so the new route has no test (-5) |

### gaps (3)

- The RC number check compares the DTO value (all spaces removed, upper case) with the number stored in the trail, which is the number the provider sends back. Spaces are not removed there, and hyphens are not removed on either side. If a provider ever returns the number with spaces, or the UI sends a number with hyphens, a real verified RC would be refused. Not confirmed against real responses, so not reported as a finding.
- The working tree is clean and matches the commit, so the current state is the same as the commit.
- The route was not called against a real database; the checks are based on reading the code and the schema.

### info (4)

- Pass: the transaction setup is correct. DbTransactionInterceptor sets the CLS 'tx' and AddressService.create uses it, so the three inserts commit or roll back together. The earlier checks use the main db connection, which only reads data.
- Pass: the AddressService type change does not change behaviour. landmark and areaLocalitySector are nullable columns and nearestPoliceStationAddress has a DB default of '', and the existing customer address route still gets the full validated CreateAddressDto.
- The verification lookup is scoped by loan application and registration number only, not by an asset vehicle on that loan application.
- The duplicate check matches on street text and location only, so if the borrower already has the same address under another type (for example Permanent Address), the route returns OK and no Other Address is added. This looks intended.

---

## howismycommit-23

| Field | Value |
|---|---|
| id | howismycommit-23 |
| generatedAt | 2026-11-18T18:37:46+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 4d5e1f5df46a4cf7c54ecf0e4ff94ff149e92b7a |
| files.changed | 10 |
| files.added | 1 |
| files.modified | 9 |
| files.deleted | 0 |
| files.insertions | 356 |
| files.deletions | 16 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 2 |
| summary.info | 3 |
| before | The asset-vehicle verify-rc route always called Surepass to verify a vehicle RC. There was no Finnaux RC route, and the Surepass RC row did not include the permanent address. |
| after | A new POST external/finnaux/vehicle-rc/verify route calls the Finnaux RC API, maps the answer to the same row shape as Surepass, caches it per employee for 60 minutes and saves a trail row with provider FINNAUX. The asset-vehicle verify-rc route removes spaces from the RC number and calls Finnaux when the Vehicle RC integration group has the Finnaux group selected, otherwise Surepass. The Surepass RC row now also returns permanentAddress. |

### changeType (2)

- feature
- api

### effects (5)

- Asset-vehicle verify-rc route (loan application asset vehicles) now depends on the Vehicle RC integration group selection in apiIntegrationGroups.
- loanApplicationAssetVehicleVerifications gets rows with provider FINNAUX, which needs the FINNAUX value in rc_verification_provider_enum in the database.
- Surepass RC calls from the asset-vehicle route now get the RC number with spaces removed.
- AssetVehiclesModule now imports FinnauxModule.
- getIsoDateFromSurepass is now exported from the KYC channelizer and used by the Finnaux service.

### filesReviewed (10)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/drizzle/schema/enums.ts | modified | green | no issues |
| apps/finnaux-api/src/external/finnaux/dto/index.ts | modified | green | no issues |
| apps/finnaux-api/src/external/finnaux/dto/verify-vehicle-rc.dto.ts | added | green | no issues |
| apps/finnaux-api/src/external/finnaux/finnaux.controller.ts | modified | green | no issues |
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | modified | green | no issues |
| apps/finnaux-api/src/external/surepass/surepass.service.ts | modified | green | no issues |
| apps/finnaux-api/src/fixed-cuids.ts | modified | green | no issues |
| apps/finnaux-api/src/lms/customer/kyc/kyc-document-verification-channelizer.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/asset-vehicles/asset-vehicles.module.ts | modified | green | no issues |
| apps/finnaux-api/src/los/loan-application/asset-vehicles/asset-vehicles.service.ts | modified | amber | F1 |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Provider check ignores the default group when no group is selected |
| location | apps/finnaux-api/src/los/loan-application/asset-vehicles/asset-vehicles.service.ts:638 |
| problem | isFinnauxVehicleRcSelected only returns true when apiIntegrationGroups.apiGroupId equals the Finnaux Vehicle RC group id. When the Vehicle RC integration group has apiGroupId null, the rest of the system picks the first active group by name (external-api-runtime.service.ts:175, external-apis.service.ts resolveEnabledApiGroupId, customer.service.ts:598). 'Finnaux Vehicle RC' sorts before 'Surepass Vehicle RC', and the Surepass group is inactive, so the effective provider is Finnaux, but this method returns false and calls Surepass. |
| impact | In that state every RC verify from the asset-vehicle screen fails: Surepass credential lookup throws 404 'API endpoint not found' (Surepass group inactive) or 403 'This API group is not currently selected', while the admin screen shows Finnaux as the active provider. |
| fix | Use the same rule as customer.service.ts isApiEndpointEnabledAndSelected: check the Finnaux RC endpoint, and when selectedApiGroupId is null fall back to the first active api group of the integration group ordered by name and provider (also filter isActive on both tables). |
| evidence | return Boolean(<br>      selection && selection.selectedApiGroupId === finnauxVehicleRcGroupId<br>    ) |
| status | resolved |
| resolvedIn | 525ecdf4bf8f5a7680cdbad2b532a61ce260aa80 |
| resolvedAt | 2026-11-18T13:10:44.307Z |
| resolvedNote | With no selected group, the check now falls back to the first active group by name and provider at apps/finnaux-api/src/los/loan-application/asset-vehicles/asset-vehicles.service.ts:689, like the rest of the system, committed in 525ecdf4. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 9686054ccc924765566bf085450942930483f5b7 | F1 | Full Finnaux DL response is sent to the frontend and kept in cache | open | Still there: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:763 returns raw: verification.raw ?? null. |

### checks (4)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint <changed .ts files> | passed |
| grey | bun run build | not run: review was read-only and the build writes dist |
| grey | tests | not run: no test command is configured; changed behaviour has no tests (-5) |

### gaps (3)

- The real Finnaux RC response shape (data.data vs data, field names such as registrationNumber, financier, taxPaidUpto, manufacturedMonthYear) could not be checked against the live API.
- The hand-made database changes (FINNAUX enum value, Finnaux RC endpoint row, Vehicle RC selection) were not checked against the database.
- No tests exist for the Finnaux RC mapping or the provider switch.

### info (3)

- Later commit 9c4985de only adds createRcAddress to asset-vehicles.service.ts and AddressModule to the module; it does not change the code from this commit.
- getYear and getFuelType in finnaux.service.ts copy getYearFromSurepass and getFuelTypeFromSurepass from surepass.service.ts; they behave the same today but can drift.
- Known deferred items (migrations and seed rows, AuthGuard-only Finnaux routes, EXPIRED trail status, isRCHPNEndorsed from financier, exported getIsoDateFromSurepass) were treated as intentional and not reported.

---

## howismycommit-22

| Field | Value |
|---|---|
| id | howismycommit-22 |
| generatedAt | 2026-11-18T18:37:46+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 9686054ccc924765566bf085450942930483f5b7 |
| files.changed | 6 |
| files.added | 1 |
| files.modified | 5 |
| files.deleted | 0 |
| files.insertions | 343 |
| files.deletions | 12 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 2 |
| summary.info | 3 |
| before | The Finnaux module could only verify Aadhaar (OTP) and PAN. The request logger removed only data.photo from logged responses, and the request body type allowed string values only. |
| after | A new POST external/finnaux/driving-license/verify endpoint calls Finnaux with licence number and date of birth, saves a KYC verification record, uploads the licence photo, fills basic and address details, and returns licenseStatus and isLicenseExpired. The logger now removes every photo and img key at any object depth, and request bodies may hold booleans. |

### changeType (2)

- feature
- api

### effects (4)

- New fixed ids for the Finnaux driving licence product and endpoint in fixed-cuids.ts (DB rows added by hand, seed deferred).
- Rows are written to kycDocumentVerificationsTable and, when the licence number matches an active customer document, to customerKycDocumentVerificationLinksTable.
- withoutPhoto is shared, so Aadhaar, PAN and later RC request logs now also have photo/img keys removed at every depth.
- Customer KYC screen receives a new response shape with licenseStatus, isLicenseExpired and a non-null raw field.

### filesReviewed (6)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | modified | amber | F1 |
| apps/finnaux-api/src/external/finnaux/finnaux.controller.ts | modified | green | no issues |
| apps/finnaux-api/src/external/finnaux/dto/verify-driving-license.dto.ts | added | green | no issues |
| apps/finnaux-api/src/external/finnaux/dto/index.ts | modified | green | no issues |
| apps/finnaux-api/src/fixed-cuids.ts | modified | green | no issues |
| apps/finnaux-api/src/lms/customer/kyc/kyc-document-verification-channelizer.ts | modified | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Full Finnaux DL response is sent to the frontend and kept in cache |
| location | apps/finnaux-api/src/external/finnaux/finnaux.service.ts:763 |
| problem | verifyDrivingLicense keeps the whole provider response (only photo/img removed) as raw, stores it in the cache and returns it as data.row.raw. The sibling Finnaux Aadhaar and PAN flows pass raw: null (finnaux.service.ts:409 and :546). Still present in the current tree. |
| impact | Every caller of the endpoint receives the full licence payload, including all addresses, father or husband name, licence classes and any other personal fields Finnaux adds later, even though the screen only needs the mapped fields. This widens personal data exposure in the browser, network logs and the cache for no business need, and makes the response shape depend on the provider. |
| fix | Pass raw: null like the Aadhaar and PAN flows and drop raw from TCachedFinnauxDrivingLicenseVerification. If a field from the payload is really needed, map it to a named key. |
| evidence |       raw: verification.raw ?? null, |
| status | resolved |
| resolvedIn | 525ecdf4bf8f5a7680cdbad2b532a61ce260aa80 |
| resolvedAt | 2026-11-18T13:10:44.307Z |
| resolvedNote | The DL response now sends raw: null and no longer caches the provider payload at apps/finnaux-api/src/external/finnaux/finnaux.service.ts:772, committed in 525ecdf4. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (0)

_Empty._

### checks (4)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint finnaux.service.ts finnaux.controller.ts verify-driving-license.dto.ts kyc-document-verification-channelizer.ts | passed |
| grey | bun lint | not run: it auto-fixes files and this review is read-only |
| grey | tests | not run: no test command is configured; changed behaviour has no tests (-5) |

### gaps (4)

- No test covers the new endpoint, the provider response parsing or the cache-hit path; behaviour was checked only by reading code.
- The real Finnaux driving licence response shape (data vs data.data, address array, pin as number or string) could not be confirmed against a live call or fixture.
- Could not confirm whether the frontend reads data.row.raw for the DL flow.
- The DL-related code is unchanged in the current tree since the commit; later commits only add the RC flow and export getIsoDateFromSurepass.

### info (3)

- No console.log, commented-out cache code or other debug leftovers were found in the commit or the current tree; the cache read and write paths are both active.
- Migrations and seed rows for the new Finnaux driving licence endpoint ids are deferred to a later batch commit by design; fresh environments will fail with an unknown endpoint until then.
- withoutPhoto now walks objects recursively but does not descend into arrays, so a photo or img key inside an array element would still be logged; no current Finnaux response is known to do this.

---

## howismycommit-21

| Field | Value |
|---|---|
| id | howismycommit-21 |
| generatedAt | 2026-11-18T18:37:46+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | be053813febc1d50271476570220ed9b92b0f701 |
| files.changed | 2 |
| files.added | 0 |
| files.modified | 2 |
| files.deleted | 0 |
| files.insertions | 2 |
| files.deletions | 2 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 2 |
| before | When a customer's Aadhaar was verified through the Finnaux OTP flow, the Aadhaar KYC document and its verification record were saved with no front image (docImgFrontUrl was null), even though the photo was uploaded and used as the profile picture. |
| after | The uploaded Aadhaar photo URL is now also used as the Aadhaar document's front image, both in the cached KYC document list and in the verification record built by formatFinnauxAadhaarVerification. If the photo is missing or the upload fails, the value stays null as before. |

### changeType (1)

- feature

### effects (3)

- Finnaux Aadhaar OTP verification flow in FinnauxService (cached verification and saved kycDocumentVerifications row)
- Customer KYC screens that show the Aadhaar document front image for Finnaux-verified customers
- Behaviour now matches the Surepass and Digio Aadhaar flows

### filesReviewed (2)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | modified | green | no issues |
| apps/finnaux-api/src/lms/customer/kyc/kyc-document-verification-channelizer.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (4)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 29d30d20700fb25c23233e401d4f2ee3c52f659e | F1 | Migration 0008 had placeholder {...} metadata that is not valid JSON | resolved | Still fixed: drizzle/0008_finnaux_kyc_endpoints.sql:13-15 hold real descriptions and valid JSON metadata. |
| 8cc2acfade181e856a3dd58cd06cfc6c1e27bf5e | F1 | FINNAUX enum value and endpoint rows exist in no migration | resolved | Still fixed: drizzle/0007_kyc_provider_finnaux.sql:1 and drizzle/0008_finnaux_kyc_endpoints.sql:13. |
| 8cc2acfade181e856a3dd58cd06cfc6c1e27bf5e | F2 | PAN success check never uses the real status field | open | Still there: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:454. |
| f90a4d3c0c3d4917e7a784d12c81c72de05c25e5 | F1 | PAN success check never uses the real status field | open | Still there: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:454. |

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/external/finnaux/finnaux.service.ts apps/finnaux-api/src/lms/customer/kyc/kyc-document-verification-channelizer.ts | passed |
| grey | tests | not run: no test command is configured in CLAUDE.md (-5 for changed behaviour without a test) |

### gaps (2)

- No automated test covers the Finnaux Aadhaar flow, so the saved docImgFrontUrl value was checked by reading the code only, not by running it.
- Both files changed a lot after this commit (about 594 lines added in later commits). Those later changes belong to other commits and were not reviewed here, apart from confirming that the two changed lines are still the same at finnaux.service.ts:351 and kyc-document-verification-channelizer.ts:336.

### info (2)

- Using the Aadhaar photo URL as both basicDetails.profilePicUrl and the Aadhaar document's docImgFrontUrl is an intentional choice that matches Surepass (surepass.service.ts:1297) and Digio, so it is not reported as a defect.
- profilePicUrl is string \| null from resolvePhotoUrl (finnaux.service.ts:1384), so the new value fits the existing nullable docImgFrontUrl type, and a failed upload still stores null.

---

## howismycommit-20

| Field | Value |
|---|---|
| id | howismycommit-20 |
| generatedAt | 2026-11-18T18:37:46+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 29d30d20700fb25c23233e401d4f2ee3c52f659e |
| files.changed | 6 |
| files.added | 4 |
| files.modified | 2 |
| files.deleted | 0 |
| files.insertions | 107201 |
| files.deletions | 1 |
| verdict | looks-good |
| score | 100 |
| commitScore | 75 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 1 |
| summary.info | 2 |
| before | The kyc_verification_provider_enum type in the database had only SUREPASS, DIGIO and INTERNAL. The apiEndpoints table and seed had no Finnaux endpoints. |
| after | Migration 0007 adds FINNAUX to kyc_verification_provider_enum. Migration 0008 inserts three Finnaux endpoints (PAN Pro, Generate Aadhaar OTP, Verify Aadhaar OTP) under the Finnaux PAN and Aadhaar api groups, and the seed file holds the same three rows with the same fixed ids. |

### changeType (3)

- schema
- migration
- feature

### effects (3)

- Customer KYC verification rows can now store provider FINNAUX.
- The external API runtime can find the Finnaux PAN Pro and Aadhaar OTP endpoints by id, using hmac auth and the FINNAUX_* secrets.
- bun db:migrate on existing databases runs 0007 and 0008 in one batch, so a failure in 0008 also rolls back 0007.

### filesReviewed (6)

| path | change | status | note |
|---|---|---|---|
| drizzle/0007_kyc_provider_finnaux.sql | added | green | no issues |
| drizzle/0008_finnaux_kyc_endpoints.sql | added | green | F1 (resolved) |
| drizzle/meta/0007_snapshot.json | added | green | no issues |
| drizzle/meta/0008_snapshot.json | added | green | no issues |
| drizzle/meta/_journal.json | modified | green | no issues |
| seed/data/apiEndpoints.json | modified | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P1 |
| title | Migration 0008 had placeholder '{...}' metadata that is not valid JSON |
| location | drizzle/0008_finnaux_kyc_endpoints.sql:13 |
| problem | As committed, the VALUES rows used '...' for description and '{...}' for metadata, and the SELECT casts v.metadata::jsonb. On any existing database where migration 0005 already created the Finnaux PAN and Aadhaar api groups, the JOIN matches rows and Postgres fails with 'invalid input syntax for type json'. On a fresh database the JOIN is empty, so the bug stays hidden there. |
| impact | bun db:migrate fails on every existing database. Drizzle runs pending migrations in one transaction, so 0007 (the enum value) is rolled back too, and the deploy is blocked. If the cast had passed, the endpoints would have been stored with '...' as the description. |
| fix | Put the real description text and valid JSON metadata (the same values as seed/data/apiEndpoints.json) into the VALUES rows. |
| evidence | ('01M7J019D17192EZB6TSEM1E4M', '01M77M7TG461FHCQ6QRRGV3W46', 'Verify PAN Pro', '...', '/PAN_PRO',        ARRAY['kyc','pan','verification'], '{...}'), |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-24T08:44:13.308Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (3)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 8cc2acfade181e856a3dd58cd06cfc6c1e27bf5e | F1 | FINNAUX enum value and endpoint rows exist in no migration | resolved | Still fixed: drizzle/0007_kyc_provider_finnaux.sql:1 adds FINNAUX and drizzle/0008_finnaux_kyc_endpoints.sql:13 inserts the endpoint rows. |
| 8cc2acfade181e856a3dd58cd06cfc6c1e27bf5e | F2 | PAN success check never uses the real status field | open | Still there: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:454 checks only success === false and a missing data record. |
| f90a4d3c0c3d4917e7a784d12c81c72de05c25e5 | F1 | PAN success check never uses the real status field | open | Still there: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:454. |

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| grey | bunx oxlint <changed .ts files> | not run: the commit changes no .ts files |
| grey | tests | not run: no test command is configured; -5 applied for changed behavior with no test |

### gaps (2)

- Migrations were not run against a real database; the JSON failure in F1 was found by reading the SQL, and the current metadata values were checked with a JSON parser only.
- The 53k-line snapshot files were only checked for the enum change and id/prevId chain, not line by line.

### info (2)

- Per the user's plan, more Finnaux endpoint and enum rows will be added in a later batch migration; the DB was updated by hand for now.
- ALTER TYPE ... ADD VALUE inside the migration transaction is fine on Postgres 12+, and 0008 does not use the new enum value (apiEndpoints.provider is a text column), so there is no same-transaction enum use problem.

---

## howismycommit-19

| Field | Value |
|---|---|
| id | howismycommit-19 |
| generatedAt | 2026-11-17T14:09:48+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 8cc2acfade181e856a3dd58cd06cfc6c1e27bf5e |
| files.changed | 7 |
| files.added | 1 |
| files.modified | 6 |
| files.deleted | 0 |
| files.insertions | 209 |
| files.deletions | 15 |
| verdict | review-with-caution |
| score | 86 |
| commitScore | 86 |
| quality | good |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 2 |
| summary.info | 3 |
| before | Finnaux had only the Aadhaar OTP routes, and Aadhaar verifications were saved with provider INTERNAL. |
| after | A new POST external/finnaux/pan/verify route verifies a PAN with Finnaux using a PAN number and holder name, with fixed consent text, a 60-minute cache per employee, PAN and name, and the Surepass-style PAN response. FINNAUX is added to the provider enum and both Aadhaar and PAN verifications are now saved with it. PAN rows are matched to customers by the full number. |

### changeType (2)

- feature
- api

### effects (4)

- kycDocumentVerifications rows for Finnaux now use provider FINNAUX; this needs the matching database enum value.
- The PAN endpoint row and the Finnaux Aadhaar endpoint rows are read from apiEndpoints by fixed id.
- createKycVerificationRecords in the Finnaux service now links PAN by full number and Aadhaar by last four digits.
- Request logs now carry the product name (aadhaar or pan) instead of a fixed aadhaar label.

### filesReviewed (7)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/drizzle/schema/enums.ts | modified | amber | F1 |
| apps/finnaux-api/src/fixed-cuids.ts | modified | amber | F1 |
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | modified | amber | F2 |
| apps/finnaux-api/src/external/finnaux/finnaux.controller.ts | modified | green | no issues |
| apps/finnaux-api/src/external/finnaux/dto/verify-pan.dto.ts | added | green | no issues |
| apps/finnaux-api/src/external/finnaux/dto/index.ts | modified | green | no issues |
| apps/finnaux-api/src/lms/customer/kyc/kyc-document-verification-channelizer.ts | modified | green | no issues |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | FINNAUX enum value and endpoint rows exist in no migration |
| location | apps/finnaux-api/src/drizzle/schema/enums.ts:881 |
| problem | The code now saves verifications with provider FINNAUX and reads the Finnaux Aadhaar and PAN endpoints by fixed id, but no migration adds the FINNAUX enum value and neither the seed nor the migrations contain those endpoint rows. They were added by hand to one database. |
| impact | On any other or fresh database, Finnaux Aadhaar and PAN verify fail: the insert is rejected for the unknown enum value and the endpoint lookup finds nothing. |
| fix | Add a migration that adds FINNAUX to kyc_verification_provider_enum and inserts the three endpoint rows, and add them to the seed, before deploying to other environments. |
| evidence | values: ['SUREPASS', 'DIGIO', 'INTERNAL', 'FINNAUX'] |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-24T08:44:29.184Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | PAN success check never uses the real status field |
| location | apps/finnaux-api/src/external/finnaux/finnaux.service.ts:388 |
| problem | The real Finnaux PAN response has status SUCCESS and no success field, so the success === false test never fires and only a missing data object is rejected. If Finnaux answers 200 with a data object that has no holder details, the code falls back to the PAN number typed by the user and saves it as a verified PAN. |
| impact | A PAN could be recorded as verified without Finnaux confirming it, with empty name and date of birth. |
| fix | Require status SUCCESS and a returned pan_number or user_full_name, and drop the fallback to the typed PAN number. |
| evidence | this.getPathValue(response, ['success']) === false \|\|<br>      !this.getRecord(response, ['data']) |
| status | resolved |
| resolvedIn | 525ecdf4bf8f5a7680cdbad2b532a61ce260aa80 |
| resolvedAt | 2026-11-18T13:10:44.307Z |
| resolvedNote | The PAN check now fails on status other than SUCCESS or success false at apps/finnaux-api/src/external/finnaux/finnaux.service.ts:458, and requires pan_number instead of falling back to the typed number at apps/finnaux-api/src/external/finnaux/finnaux.service.ts:471, committed in 525ecdf4. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (7)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 369cb7d7c9cc8ad09f7edc2c57e3ad17ace78a8e | F1 | Repeat verify inserts duplicate verification rows | resolved | Saved rows are reused: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:325 and :462. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F1 | Cached verify replay skips OTP and is not tied to the user | resolved | Cache key holds the employee id: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:175. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F2 | Raw internal error text returned to the UI | resolved | Non-Finnaux errors become a generic 500: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:588. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F3 | Verified result lost if saving the record fails | resolved | Result is cached before the insert: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:325. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F4 | Paid routes need login only, no limit | uncertain | Marked resolved by hand because AuthGuard enforces rights; the routes carry no scopes, so I could not prove it either way. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F5 | Full Aadhaar details stored and returned raw | resolved | raw is null and the photo is blanked in the log: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:343 and :551. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F6 | Repeat verify inserts duplicate verification rows | resolved | Saved rows are reused: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:325. |

### checks (2)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/external apps/finnaux-api/src/lms/customer/kyc/kyc-document-verification-channelizer.ts apps/finnaux-api/src/fixed-cuids.ts apps/finnaux-api/src/drizzle/schema/enums.ts | passed |

### gaps (3)

- No test command is configured and none was added; the PAN flow was never run against live Finnaux here.
- I did not check other environments, only the repo: the migrations, the seed and the database named in .env.
- The Finnaux failure shape for a refused PAN with HTTP 200 is unknown, so F2 is a risk, not a confirmed failure.

### info (3)

- F1 is known to the author: the migration was postponed on purpose, so it is a deployment ordering risk, not a surprise.
- verify-pan.dto.ts calls value.trim() in a Transform, so a non-string panNumber or panHolderName gives a 500 instead of a 400; the Surepass PAN DTO does the same.
- The cached PAN result from this commit has the older shape; later commits changed the response and old cache entries expire within 60 minutes.

---

## howismycommit-18

| Field | Value |
|---|---|
| id | howismycommit-18 |
| generatedAt | 2026-11-17T14:08:54+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | c6df6c235693f321410c0626993feb9c1824aeb6 |
| files.changed | 0 |
| files.added | 0 |
| files.modified | 0 |
| files.deleted | 0 |
| files.insertions | 0 |
| files.deletions | 0 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 3 |
| before | The branch ended at ec884d4b, and dev held 5de09833, the merge of the earlier pull request #96 from this same branch. |
| after | A merge commit joins the two lines. The result is identical to ec884d4b, so no file changes. |

### changeType (1)

- config or CI

### effects (2)

- No code, config or schema changes, so no behaviour changes.
- The branch now contains dev's merge commit 5de09833 in its history.

### filesReviewed (0)

_Empty._

### findings (0)

_Empty._

### previousFindings (3)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| ec884d4b0beb78a0042641e5fa356c730867b83a | - | No findings in the report | resolved | Nothing to check; the report had no findings. |
| f90a4d3c0c3d4917e7a784d12c81c72de05c25e5 | F1 | PAN success check never uses the real status field | open | apps/finnaux-api/src/external/finnaux/finnaux.service.ts:388 still tests success === false and line 397 still falls back to the typed PAN number. |
| 369cb7d7c9cc8ad09f7edc2c57e3ad17ace78a8e | F1 | Repeat verify inserts duplicate verification rows | resolved | Saved rows are reused: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:325 and :462. |

### checks (2)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/external | passed |

### gaps (2)

- A merge commit has no changes of its own here, so this review covers only that nothing changed and the checks still pass.
- No test command is configured, so nothing was run against Finnaux.

### info (3)

- git diff between ec884d4b and this merge is empty, and the combined merge diff shows no conflict edits.
- The PAN success check finding F1 from the f90a4d3c review is still open and is not counted in this score.
- No test is added for changed behaviour in earlier commits; the 5-point deduction is not applied because this commit changes no behaviour.

---

## howismycommit-17

| Field | Value |
|---|---|
| id | howismycommit-17 |
| generatedAt | 2026-11-17T14:08:23+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | ec884d4b0beb78a0042641e5fa356c730867b83a |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 16 |
| files.deletions | 60 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 3 |
| before | The Finnaux PAN verify sent names, gender, title, address, contact details, PAN type and a string name match score to the frontend. |
| after | PAN now sends only first, middle and last name and date of birth in basicDetails, an empty addressDetails, nameMatchScore as a number, aadhaarLinkedStatus, and a priorityFields list. Address, gender, title, contact details and PAN type are no longer sent. |

### changeType (2)

- feature
- api

### effects (3)

- The frontend must apply PAN over existing form values for the four priority fields and let Aadhaar fill the rest.
- Any frontend code that read panType, contactDetails or PAN address data from this response no longer gets them.
- PAN results cached before this commit keep the old shape until their 60-minute expiry.

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (8)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| f90a4d3c0c3d4917e7a784d12c81c72de05c25e5 | F1 | PAN success check never uses the real status field | open | apps/finnaux-api/src/external/finnaux/finnaux.service.ts:388 still tests success === false and falls back to the typed PAN number. |
| 369cb7d7c9cc8ad09f7edc2c57e3ad17ace78a8e | F1 | Repeat verify inserts duplicate verification rows | resolved | Saved rows are reused: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:325 and :462. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F1 | Cached verify replay skips OTP and is not tied to the user | resolved | Cache key holds the employee id: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:175. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F2 | Raw internal error text returned to the UI | resolved | Non-Finnaux errors become a generic 500: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:588. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F3 | Verified result lost if saving the record fails | resolved | Result is cached before the insert: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:325. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F4 | Paid routes need login only, no limit | uncertain | Marked resolved by hand because AuthGuard enforces rights; the routes carry no scopes, so I could not prove it either way. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F5 | Full Aadhaar details stored and returned raw | resolved | raw is null and the photo is blanked in the log: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:343 and :551. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F6 | Repeat verify inserts duplicate verification rows | resolved | Saved rows are reused: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:325. |

### checks (2)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/external/finnaux | passed |

### gaps (2)

- No test command is configured and none was added; the PAN flow was never run against live Finnaux here.
- The form-priority rules live in the frontend, so this review cannot check that they are applied.

### info (3)

- The PAN success check finding F1 from the f90a4d3c review is still open and is not counted in this score.
- The verification record saved for PAN still holds gender and address even though the response no longer sends them; that is audit data only.
- Cached PAN entries from before this commit still have the old shape (string nameMatchScore) until they expire.

---

## howismycommit-16

| Field | Value |
|---|---|
| id | howismycommit-16 |
| generatedAt | 2026-11-17T14:07:50+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | f90a4d3c0c3d4917e7a784d12c81c72de05c25e5 |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 105 |
| files.deletions | 8 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 2 |
| summary.info | 3 |
| before | The Finnaux PAN verify returned only kycDocuments with the verification record, so nothing filled the customer form from PAN. |
| after | As committed, PAN also returned basicDetails (title, names, gender, date of birth), addressDetails, contact details, name match score, Aadhaar-linked status and PAN type. The later commit ec884d4b cut this down to names and date of birth plus a priorityFields list, and made the score a number, so the current code differs from this commit. |

### changeType (2)

- feature
- api

### effects (2)

- The PAN response shape grew; the current code (ec884d4b) trims it back to names, date of birth, nameMatchScore, aadhaarLinkedStatus and priorityFields.
- Frontend fills the form from PAN under the agreed priority rules.

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | modified | amber | F1 |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | PAN success check never uses the real status field |
| location | apps/finnaux-api/src/external/finnaux/finnaux.service.ts:388 |
| problem | The real Finnaux PAN response has status SUCCESS and no success field, so the success === false test never fires and only a missing data object is rejected. If Finnaux answers 200 with a data object that has no holder details, the code falls back to the PAN number typed by the user and saves it as a verified PAN. |
| impact | A PAN could be recorded as verified without Finnaux confirming it, with empty name and date of birth. |
| fix | Require status SUCCESS and a returned pan_number or user_full_name, and drop the fallback to the typed PAN number. |
| evidence | this.getPathValue(response, ['success']) === false \|\|<br>      !this.getRecord(response, ['data']) |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-24T08:44:18.560Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (7)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 369cb7d7c9cc8ad09f7edc2c57e3ad17ace78a8e | F1 | Repeat verify inserts duplicate verification rows | resolved | Saved rows are reused: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:325 and :462. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F1 | Cached verify replay skips OTP and is not tied to the user | resolved | Cache key holds the employee id: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:175. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F2 | Raw internal error text returned to the UI | resolved | Non-Finnaux errors become a generic 500: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:588. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F3 | Verified result lost if saving the record fails | resolved | Result is cached before the insert: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:325. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F4 | Paid routes need login only, no limit | uncertain | Marked resolved by hand because AuthGuard enforces rights; the routes carry no scopes, so I could not prove it either way. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F5 | Full Aadhaar details stored and returned raw | resolved | raw is null and the photo is blanked in the log: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:343 and :551. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F6 | Repeat verify inserts duplicate verification rows | resolved | Saved rows are reused: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:325. |

### checks (2)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/external/finnaux | passed |

### gaps (2)

- No test command is configured and none was added; the PAN flow was never run against live Finnaux in this review.
- The Finnaux failure shape for a refused PAN with HTTP 200 is unknown, so F1 is a risk, not a confirmed failure.

### info (3)

- Review describes current code: the reviewed commit sent more data than ec884d4b now does; none of that is reported because it matched the request at the time.
- verify-pan.dto.ts calls value.trim() in a Transform, so a non-string panNumber or panHolderName gives a 500 instead of a 400; the Surepass PAN DTO does the same.
- PAN results cached before ec884d4b keep the old shape (panType, string nameMatchScore) until they expire in 60 minutes.

---

## howismycommit-15

| Field | Value |
|---|---|
| id | howismycommit-15 |
| generatedAt | 2026-11-16T16:06:44+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 110dcf2f9c57ac41bf36c84a41ccc51074d0d326 |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 21 |
| files.deletions | 6 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 1 |
| before | Every verify-otp call that hit the cache ran the record insert again, so a repeat with the same user, txnId and OTP added duplicate verification rows. |
| after | After the first successful insert, the saved rows are added to the cached entry. Later calls reuse them and skip the insert. If the first insert failed, the entry has no rows, so a retry inserts again. |

### changeType (1)

- bug fix

### effects (2)

- Repeat verify-otp calls within 60 minutes return the same saved rows without touching the database.
- Each successful first save refreshes the cache entry for another 60 minutes.

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (9)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 369cb7d7c9cc8ad09f7edc2c57e3ad17ace78a8e | F1 | Repeat verify inserts duplicate verification rows | resolved | Fixed by this commit: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:293-299. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F1 | Cached verify replay skips OTP and is not tied to the user | resolved | Cache key still holds employee id and OTP: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:145-147. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F2 | Raw internal error text returned to the UI | resolved | Non-Finnaux errors still become a generic 500: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:392. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F3 | Verified result lost if saving the record fails | resolved | Result is cached before the insert: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:278. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F4 | Paid routes need login only, no limit | uncertain | Marked resolved by hand because AuthGuard enforces rights; the routes carry no scopes at apps/finnaux-api/src/external/finnaux/finnaux.controller.ts:15, so I could not prove it either way. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F5 | Full Aadhaar details stored and returned raw | resolved | raw is still null and the photo blanked: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:296 and :355. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F6 | Repeat verify inserts duplicate verification rows | resolved | Fixed by this commit: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:293-299. |
| 07f82b0a03599091e857955f0e63a25b26cacb1c | F1 | Keyless group saved with authType bearer | open | apps/finnaux-api/src/external/shared/external-api-runtime.service.ts:76 still falls back to bearer. |
| 07f82b0a03599091e857955f0e63a25b26cacb1c | F2 | First save skips the string check | uncertain | Marked resolved by hand; external-apis.service.ts:408 still passes input.credentials on first save and validateCredentials coerces with String(), so I could not prove it either way. |

### checks (2)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/external/finnaux | passed |

### gaps (2)

- No test command is configured and none was added; verify-otp was never run against live Finnaux.
- Two requests that arrive together before the first save finishes can both insert rows, because no lock exists. I could not tell whether the UI prevents a double click.

### info (1)

- If the cache write after the insert fails, the user gets an error although the rows were saved, and a retry would insert again. This needs a cache outage, so it is not reported as a finding.

---

## howismycommit-14

| Field | Value |
|---|---|
| id | howismycommit-14 |
| generatedAt | 2026-11-16T16:06:07+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 369cb7d7c9cc8ad09f7edc2c57e3ad17ace78a8e |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 79 |
| files.deletions | 50 |
| verdict | looks-good |
| score | 100 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 2 |
| before | Verify-otp cached the full Finnaux result under the txnId only, returned the raw response and photo, showed internal error text and lost a paid verification if the record insert failed. |
| after | The cache is keyed by employee, txnId and OTP and holds only mapped fields. The cache is written before the record insert. raw is null, the photo is blanked in the logged copy, and non-Finnaux errors become a generic 500. A later commit (110dcf2f) also caches the saved rows so repeats do not insert again. |

### changeType (2)

- bug fix
- security

### effects (3)

- verify-otp and generate-otp responses for Finnaux: raw is now null and errors are split into Finnaux messages and a generic 500.
- apiRequests logs for Finnaux no longer hold the Aadhaar photo.
- Frontend confirmed by code reading that nothing uses raw.

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | modified | green | F1 resolved in 110dcf2f |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Repeat verify inserts duplicate verification rows |
| location | apps/finnaux-api/src/external/finnaux/finnaux.service.ts:280 |
| problem | Every call that hits the cache ran createKycVerificationRecords again, so a repeat or double click with the same OTP inserted another kycDocumentVerifications row for the same Aadhaar. |
| impact | Duplicate verification rows and link rows for one verification. |
| fix | Cache the saved rows and reuse them on later calls. |
| evidence | if (cached) {<br>      return this.saveVerificationAndFormat(cached, session)<br>    } |
| status | resolved |
| resolvedIn | 110dcf2f9c57ac41bf36c84a41ccc51074d0d326 |
| resolvedAt | 2026-11-16T10:36:07.506Z |
| resolvedNote | Saved rows are cached and reused: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:293-299. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (8)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F1 | Cached verify replay skips OTP and is not tied to the user | resolved | Cache key now includes the employee id and the typed OTP: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:145. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F2 | Raw internal error text returned to the UI | resolved | Only Finnaux errors reach the user; other errors become a generic 500: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:392. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F3 | Verified result lost if saving the record fails | resolved | Result is cached before the record insert: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:278. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F5 | Full Aadhaar details stored and returned raw | resolved | raw is now null and the photo is blanked in the logged copy: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:296 and :355. Frontend confirmed nothing reads raw. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F4 | Paid routes need login only, no limit | uncertain | Marked resolved by hand because AuthGuard enforces rights; the routes carry no scopes at apps/finnaux-api/src/external/finnaux/finnaux.controller.ts:15, so I could not prove it either way. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F6 | Repeat verify inserts duplicate verification rows | resolved | Fixed in 110dcf2f: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:293-299. |
| 07f82b0a03599091e857955f0e63a25b26cacb1c | F1 | Keyless group saved with authType bearer | open | apps/finnaux-api/src/external/shared/external-api-runtime.service.ts:76 still falls back to bearer. |
| 07f82b0a03599091e857955f0e63a25b26cacb1c | F2 | First save skips the string check | uncertain | Marked resolved by hand; external-apis.service.ts:408 still passes input.credentials on first save and validateCredentials coerces with String(), so I could not prove it either way. |

### checks (2)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/external/finnaux | passed |

### gaps (2)

- No test command is configured and none was added; verify-otp was never run against live Finnaux.
- Two requests that arrive together before the first save finishes can still both insert rows; no lock exists.

### info (2)

- The a6fac248 commit review howismycommit-13 had its F6 marked resolved by this review.
- Network errors from axios show their own message (for example a timeout or connection text) to the user as a Finnaux error.

---

## howismycommit-13

| Field | Value |
|---|---|
| id | howismycommit-13 |
| generatedAt | 2026-11-16T15:42:34+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | a6fac2480e571ae46d9ee6304c95d96569eb50cb |
| files.changed | 11 |
| files.added | 7 |
| files.modified | 4 |
| files.deleted | 0 |
| files.insertions | 925 |
| files.deletions | 0 |
| verdict | review-with-caution |
| score | 92 |
| commitScore | 70 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 2 |
| summary.info | 2 |
| before | There was no Finnaux provider. Aadhaar OTP could only go through Surepass or DigiPehchan. |
| after | Two login-protected routes, POST external/finnaux/aadhaar/generate-otp and verify-otp, call the Finnaux Aadhaar API. The base URL, path and the three keys come from the apiEndpoints row and the saved credentials. Requests are AES-GCM encrypted and HMAC signed, and logged to apiRequests. A verified result is turned into the common Aadhaar shape, stored as a kycDocumentVerifications row and cached for 60 minutes. A follow-up commit (369cb7d7) keys the verify cache by employee, txnId and OTP, caches before the record insert, returns raw as null, blanks the photo in the logged copy and sends generic 500s for non-Finnaux errors. |

### changeType (2)

- feature
- api

### effects (4)

- External API runtime service now also returns baseUrl and path from the endpoint row.
- New fixed ids for the Finnaux group and endpoints, which must match the seeded DB rows.
- New INTERNAL-provider verification rows with channel FINNAUX:AADHAAR_CARD:VERIFY in kycDocumentVerifications.
- Every call spends Finnaux wallet balance and, for generate, sends an SMS to the Aadhaar holder.

### filesReviewed (11)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | added | amber | F6 |
| apps/finnaux-api/src/external/finnaux/finnaux.controller.ts | added | amber | F4 |
| apps/finnaux-api/src/external/finnaux/finnaux-api.client.ts | added | green | no issues |
| apps/finnaux-api/src/external/finnaux/finnaux.module.ts | added | green | no issues |
| apps/finnaux-api/src/external/finnaux/dto/generate-aadhaar-otp.dto.ts | added | green | no issues |
| apps/finnaux-api/src/external/finnaux/dto/verify-aadhaar-otp.dto.ts | added | green | no issues |
| apps/finnaux-api/src/external/finnaux/dto/index.ts | added | green | no issues |
| apps/finnaux-api/src/external/external.module.ts | modified | green | no issues |
| apps/finnaux-api/src/external/shared/external-api-runtime.service.ts | modified | green | no issues |
| apps/finnaux-api/src/fixed-cuids.ts | modified | green | no issues |
| apps/finnaux-api/src/lms/customer/kyc/kyc-document-verification-channelizer.ts | modified | green | no issues |

### findings (6)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | Cached verify replay skips OTP and is not tied to the user |
| location | apps/finnaux-api/src/external/finnaux/finnaux.service.ts:133 |
| problem | The cache key is only the txnId. Within 60 minutes any logged-in user who knows the txnId can call verify-otp with any otp value and get the full Aadhaar result (name, dob, address, photo) without the OTP being checked. Each replay also inserts new kycDocumentVerifications rows. |
| impact | Aadhaar personal data can be fetched without the OTP, and the verification table fills with duplicate rows. |
| fix | Include the employee id in the key and only serve the cache after the same OTP was verified, or drop the cache and let the first result be the single source. |
| evidence | const cacheKey = ['finnaux', 'aadhaar', 'verify', input.txnId.trim()].join(<br>      ':'<br>    ) |
| status | resolved |
| resolvedIn | 369cb7d7c9cc8ad09f7edc2c57e3ad17ace78a8e |
| resolvedAt | 2026-11-16T10:10:19.618Z |
| resolvedNote | Cache key now includes the employee id and the typed OTP: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:145. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Raw internal error text returned to the UI |
| location | apps/finnaux-api/src/external/finnaux/finnaux.service.ts:115 |
| problem | The generate catch returns error.message as a normal 200 response, and the verify catch turns any error from executeLoggedRequest into a 400 with the same text. A failed apiRequests insert or a credential setup error would put database or config text in the message. |
| impact | Internal details reach the browser, and a server fault is reported as a 400 client error. |
| fix | Return the message only for Finnaux errors, and let other errors surface as 500 with a fixed message. |
| evidence | message:<br>              error instanceof Error ? error.message : 'OTP could not be sent', |
| status | resolved |
| resolvedIn | 369cb7d7c9cc8ad09f7edc2c57e3ad17ace78a8e |
| resolvedAt | 2026-11-16T10:10:19.618Z |
| resolvedNote | Only Finnaux errors reach the user; other errors become a generic 500: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:392. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[3] · F3

| Field | Value |
|---|---|
| id | F3 |
| severity | P3 |
| title | Verified result lost if saving the record fails |
| location | apps/finnaux-api/src/external/finnaux/finnaux.service.ts:272 |
| problem | Finnaux has already accepted the OTP and charged the wallet when createKycVerificationRecords runs. If it throws (for example 'Document is linked to more than one active customer' or a DB error) the result is not cached and the session is used up. |
| impact | The user must generate a new OTP and pay again, and the Aadhaar holder gets another SMS. |
| fix | Cache the mapped result before the record insert, or make the insert failure recoverable. |
| evidence | const verificationRecords = await this.createKycVerificationRecords(<br>      [verificationRecord],<br>      session<br>    ) |
| status | resolved |
| resolvedIn | 369cb7d7c9cc8ad09f7edc2c57e3ad17ace78a8e |
| resolvedAt | 2026-11-16T10:10:19.618Z |
| resolvedNote | Result is cached before the record insert: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:278. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[4] · F4

| Field | Value |
|---|---|
| id | F4 |
| severity | P3 |
| title | Paid routes need login only, no limit |
| location | apps/finnaux-api/src/external/finnaux/finnaux.controller.ts:13 |
| problem | Both routes use only AuthGuard. Any logged-in user can send OTP SMS to any Aadhaar number and spend Finnaux wallet balance, with no permission check or throttle. |
| impact | Wallet drain and SMS spam to arbitrary people from one account. |
| fix | Add the same permission guard the other KYC routes use and a throttle on generate-otp. |
| evidence | @UseGuards(AuthGuard)<br>  @Post('aadhaar/generate-otp') |
| status | resolved |
| resolvedIn | 7b26614c6a2b57d642db099a187227c0c2bf6418 |
| resolvedAt | 2026-11-24T04:24:11.008Z |
| resolvedNote | The five Finnaux routes now need view on one of 12 customer, loan, vendor, dealer, branch or employee pages and generate-otp is limited to 10 a minute per IP (apps/finnaux-api/src/external/finnaux/finnaux.controller.ts, commit 7b26614c). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |
| future | true |

#### findings[5] · F5

| Field | Value |
|---|---|
| id | F5 |
| severity | P3 |
| title | Full Aadhaar details stored and returned raw |
| location | apps/finnaux-api/src/external/finnaux/finnaux.service.ts:280 |
| problem | The whole Finnaux response (name, dob, address, base64 photo) is saved in apiRequests.responseBody, returned to the client as raw and cached in memory for 60 minutes. The request bodies are masked but the response is not. |
| impact | Aadhaar personal data and large photo payloads sit in logs and cache, more than the KYC tables need. |
| fix | Drop the photo and unneeded fields from the logged and cached copy, and do not return raw to the client. |
| evidence | raw: response,<br>      verificationRecords |
| status | resolved |
| resolvedIn | 369cb7d7c9cc8ad09f7edc2c57e3ad17ace78a8e |
| resolvedAt | 2026-11-16T10:10:19.618Z |
| resolvedNote | raw is now null and the photo is blanked in the logged copy: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:296 and :355. Frontend confirmed nothing reads raw. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[6] · F6

| Field | Value |
|---|---|
| id | F6 |
| severity | P3 |
| title | Repeat verify inserts duplicate verification rows |
| location | apps/finnaux-api/src/external/finnaux/finnaux.service.ts:280 |
| problem | Every call that hits the cache runs createKycVerificationRecords again. A double click, or a retry with the same OTP after success, inserts another kycDocumentVerifications row for the same Aadhaar. |
| impact | Duplicate verification rows and duplicate link rows for one verification. |
| fix | Return the first formatted result from the cache after a successful insert, and only re-run the insert when the first insert failed. |
| evidence | if (cached) {<br>      return this.saveVerificationAndFormat(cached, session)<br>    } |
| status | resolved |
| resolvedIn | 110dcf2f9c57ac41bf36c84a41ccc51074d0d326 |
| resolvedAt | 2026-11-16T10:36:07.505Z |
| resolvedNote | Saved rows are now cached and reused: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:293-299. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (7)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F1 | Cached verify replay skips OTP and is not tied to the user | resolved | Cache key now includes the employee id and the typed OTP: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:145. Fixed in 369cb7d7. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F2 | Raw internal error text returned to the UI | resolved | Only Finnaux errors reach the user; other errors become a generic 500: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:392. Fixed in 369cb7d7. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F3 | Verified result lost if saving the record fails | resolved | Result is cached before the record insert: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:278. Fixed in 369cb7d7. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F4 | Paid routes need login only, no limit | open | Routes at apps/finnaux-api/src/external/finnaux/finnaux.controller.ts:15 still only use AuthGuard; deferred by the user. |
| a6fac2480e571ae46d9ee6304c95d96569eb50cb | F5 | Full Aadhaar details stored and returned raw | resolved | raw is now null and the photo is blanked in the logged copy: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:296 and :355. Frontend confirmed nothing reads raw. Fixed in 369cb7d7. |
| 07f82b0a03599091e857955f0e63a25b26cacb1c | F1 | Keyless group saved with authType bearer | open | apps/finnaux-api/src/external/shared/external-api-runtime.service.ts:76 still falls back to bearer. |
| 07f82b0a03599091e857955f0e63a25b26cacb1c | F2 | First save skips the string check | uncertain | Marked resolved by hand; external-apis.service.ts:408 still passes input.credentials on first save and validateCredentials coerces with String(), so I could not prove it either way. |

### checks (2)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/external/finnaux | passed |

### gaps (4)

- No test command is configured and none was added, so the OTP flow is untested; verify-otp was never run against the live Finnaux API.
- The seeded apiEndpoints rows and ids were not checked in this review.
- Finnaux returns the Aadhaar number masked; it is stored as docNumber, which I did not compare with what Surepass or DigiPehchan store.
- Frontend confirmed by code reading only that nothing uses raw.

### info (2)

- The provider is stored as INTERNAL because the enum has no FINNAUX value, so it differs from the v3 contract.
- A disabled provider gives a 403 from the runtime service, not the 409/422 the contract names.

---

## howismycommit-12

| Field | Value |
|---|---|
| id | howismycommit-12 |
| generatedAt | 2026-11-16T15:15:38+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | a6fac2480e571ae46d9ee6304c95d96569eb50cb |
| files.changed | 11 |
| files.added | 7 |
| files.modified | 4 |
| files.deleted | 0 |
| files.insertions | 925 |
| files.deletions | 0 |
| verdict | review-with-caution |
| score | 74 |
| commitScore | 74 |
| quality | fair |
| summary.red | 0 |
| summary.amber | 5 |
| summary.green | 2 |
| summary.info | 2 |
| before | There was no Finnaux provider. Aadhaar OTP could only go through Surepass or DigiPehchan. |
| after | Two login-protected routes, POST external/finnaux/aadhaar/generate-otp and verify-otp, call the Finnaux Aadhaar API. The base URL, path and the three keys come from the apiEndpoints row and the saved credentials. Requests are AES-GCM encrypted and HMAC signed, and logged to apiRequests. A verified result is turned into the common Aadhaar shape, stored as a kycDocumentVerifications row and cached for 60 minutes. |

### changeType (2)

- feature
- api

### effects (4)

- External API runtime service now also returns baseUrl and path from the endpoint row.
- New fixed ids for the Finnaux group and endpoints, which must match the seeded DB rows.
- New INTERNAL-provider verification rows with channel FINNAUX:AADHAAR_CARD:VERIFY in kycDocumentVerifications.
- Every call spends Finnaux wallet balance and, for generate, sends an SMS to the Aadhaar holder.

### filesReviewed (11)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/external/finnaux/finnaux.service.ts | added | amber | F1 |
| apps/finnaux-api/src/external/finnaux/finnaux.controller.ts | added | amber | F4 |
| apps/finnaux-api/src/external/finnaux/finnaux-api.client.ts | added | green | no issues |
| apps/finnaux-api/src/external/finnaux/finnaux.module.ts | added | green | no issues |
| apps/finnaux-api/src/external/finnaux/dto/generate-aadhaar-otp.dto.ts | added | green | no issues |
| apps/finnaux-api/src/external/finnaux/dto/verify-aadhaar-otp.dto.ts | added | green | no issues |
| apps/finnaux-api/src/external/finnaux/dto/index.ts | added | green | no issues |
| apps/finnaux-api/src/external/external.module.ts | modified | green | no issues |
| apps/finnaux-api/src/external/shared/external-api-runtime.service.ts | modified | green | no issues |
| apps/finnaux-api/src/fixed-cuids.ts | modified | green | no issues |
| apps/finnaux-api/src/lms/customer/kyc/kyc-document-verification-channelizer.ts | modified | green | no issues |

### findings (5)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | Cached verify replay skips OTP and is not tied to the user |
| location | apps/finnaux-api/src/external/finnaux/finnaux.service.ts:133 |
| problem | The cache key is only the txnId. Within 60 minutes any logged-in user who knows the txnId can call verify-otp with any otp value and get the full Aadhaar result (name, dob, address, photo) without the OTP being checked. Each replay also inserts new kycDocumentVerifications rows. |
| impact | Aadhaar personal data can be fetched without the OTP, and the verification table fills with duplicate rows. |
| fix | Include the employee id in the key and only serve the cache after the same OTP was verified, or drop the cache and let the first result be the single source. |
| evidence | const cacheKey = ['finnaux', 'aadhaar', 'verify', input.txnId.trim()].join(<br>      ':'<br>    ) |
| status | resolved |
| resolvedIn | 369cb7d7c9cc8ad09f7edc2c57e3ad17ace78a8e |
| resolvedAt | 2026-11-16T10:10:19.618Z |
| resolvedNote | Cache key now includes the employee id and the typed OTP: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:145. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Raw internal error text returned to the UI |
| location | apps/finnaux-api/src/external/finnaux/finnaux.service.ts:115 |
| problem | The generate catch returns error.message as a normal 200 response, and the verify catch turns any error from executeLoggedRequest into a 400 with the same text. A failed apiRequests insert or a credential setup error would put database or config text in the message. |
| impact | Internal details reach the browser, and a server fault is reported as a 400 client error. |
| fix | Return the message only for Finnaux errors, and let other errors surface as 500 with a fixed message. |
| evidence | message:<br>              error instanceof Error ? error.message : 'OTP could not be sent', |
| status | resolved |
| resolvedIn | 369cb7d7c9cc8ad09f7edc2c57e3ad17ace78a8e |
| resolvedAt | 2026-11-16T10:10:19.618Z |
| resolvedNote | Only Finnaux errors reach the user; other errors become a generic 500: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:392. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[3] · F3

| Field | Value |
|---|---|
| id | F3 |
| severity | P3 |
| title | Verified result lost if saving the record fails |
| location | apps/finnaux-api/src/external/finnaux/finnaux.service.ts:272 |
| problem | Finnaux has already accepted the OTP and charged the wallet when createKycVerificationRecords runs. If it throws (for example 'Document is linked to more than one active customer' or a DB error) the result is not cached and the session is used up. |
| impact | The user must generate a new OTP and pay again, and the Aadhaar holder gets another SMS. |
| fix | Cache the mapped result before the record insert, or make the insert failure recoverable. |
| evidence | const verificationRecords = await this.createKycVerificationRecords(<br>      [verificationRecord],<br>      session<br>    ) |
| status | resolved |
| resolvedIn | 369cb7d7c9cc8ad09f7edc2c57e3ad17ace78a8e |
| resolvedAt | 2026-11-16T10:10:19.618Z |
| resolvedNote | Result is cached before the record insert: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:278. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[4] · F4

| Field | Value |
|---|---|
| id | F4 |
| severity | P3 |
| title | Paid routes need login only, no limit |
| location | apps/finnaux-api/src/external/finnaux/finnaux.controller.ts:13 |
| problem | Both routes use only AuthGuard. Any logged-in user can send OTP SMS to any Aadhaar number and spend Finnaux wallet balance, with no permission check or throttle. |
| impact | Wallet drain and SMS spam to arbitrary people from one account. |
| fix | Add the same permission guard the other KYC routes use and a throttle on generate-otp. |
| evidence | @UseGuards(AuthGuard)<br>  @Post('aadhaar/generate-otp') |
| status | resolved |
| resolvedIn | 7b26614c6a2b57d642db099a187227c0c2bf6418 |
| resolvedAt | 2026-11-24T04:24:11.008Z |
| resolvedNote | The five Finnaux routes now need view on one of 12 customer, loan, vendor, dealer, branch or employee pages and generate-otp is limited to 10 a minute per IP (apps/finnaux-api/src/external/finnaux/finnaux.controller.ts, commit 7b26614c). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |
| future | true |

#### findings[5] · F5

| Field | Value |
|---|---|
| id | F5 |
| severity | P3 |
| title | Full Aadhaar details stored and returned raw |
| location | apps/finnaux-api/src/external/finnaux/finnaux.service.ts:280 |
| problem | The whole Finnaux response (name, dob, address, base64 photo) is saved in apiRequests.responseBody, returned to the client as raw and cached in memory for 60 minutes. The request bodies are masked but the response is not. |
| impact | Aadhaar personal data and large photo payloads sit in logs and cache, more than the KYC tables need. |
| fix | Drop the photo and unneeded fields from the logged and cached copy, and do not return raw to the client. |
| evidence | raw: response,<br>      verificationRecords |
| status | resolved |
| resolvedIn | 369cb7d7c9cc8ad09f7edc2c57e3ad17ace78a8e |
| resolvedAt | 2026-11-16T10:10:19.618Z |
| resolvedNote | raw is now null and the photo is blanked in the logged copy: apps/finnaux-api/src/external/finnaux/finnaux.service.ts:296 and :355. Frontend confirmed nothing reads raw. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 07f82b0a03599091e857955f0e63a25b26cacb1c | F1 | Keyless group saved with authType bearer | open | apps/finnaux-api/src/external/shared/external-api-runtime.service.ts:76 still falls back to 'bearer'. |
| 07f82b0a03599091e857955f0e63a25b26cacb1c | F2 | First save skips the string check | uncertain | Marked resolved by hand, but external-apis.service.ts:408 still passes input.credentials straight on first save and validateCredentials coerces with String() at external-api-runtime.service.ts:92; I could not prove it fixed or broken, so nothing changed. |

### checks (2)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/external apps/finnaux-api/src/lms/customer/kyc/kyc-document-verification-channelizer.ts apps/finnaux-api/src/fixed-cuids.ts | passed |

### gaps (3)

- No test command is configured and none was added, so the OTP flow is untested; verify-otp was never run against the live Finnaux API.
- The seeded apiEndpoints rows and ids were not checked in this review.
- Finnaux returns the Aadhaar number masked; it is stored as docNumber, which I did not compare with what Surepass or DigiPehchan store.

### info (2)

- The provider is stored as INTERNAL because the enum has no FINNAUX value, so it differs from the v3 contract.
- A disabled provider gives a 403 from the runtime service, not the 409/422 the contract names.

---

## howismycommit-11

| Field | Value |
|---|---|
| id | howismycommit-11 |
| generatedAt | 2026-11-13T18:28:02+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 9c51821e2c1dfe29e51501cad66500f2277fc7d0 |
| files.changed | 367 |
| files.added | 189 |
| files.modified | 27 |
| files.deleted | 151 |
| files.insertions | 548910 |
| files.deletions | 2235556 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 4 |
| before | feat/external-apis was behind dev: it had the External APIs credentials work but none of dev's logging, migration and seed changes. |
| after | The branch now includes dev's pino/OpenTelemetry logging, request-id middleware, a reworked exception filter, the drizzle migration folder (0000 to 0006) and the seed folder, plus the External APIs work unchanged. |

### changeType (4)

- config or CI
- schema or migration
- dependency
- refactor

### effects (4)

- package.json adds nestjs-pino, pino, pino-http, pino-pretty and four @opentelemetry packages, so every developer must run bun install after pulling
- package.json drops db:push, db:seed and db:export-from-database and adds db:migrate and seed:run, seed:export, seed:check
- The Redis loan-application log queue and activity-log interceptor files are deleted, replaced by the new logger setup
- No file under configurations/external-apis or external/ differs from the first parent, so the credentials behaviour is unchanged

### filesReviewed (4)

| path | change | status | note |
|---|---|---|---|
| package.json | modified | green | no issues |
| apps/finnaux-api/src/bootstrap/imports/bootstrap.imports.ts | modified | green | no issues |
| apps/finnaux-api/src/common/exception-filters/all-exceptions.filter.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/external-apis/ | modified | green | unchanged by the merge |

### findings (0)

_Empty._

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 07f82b0a03599091e857955f0e63a25b26cacb1c | F1 | Keyless group saved with authType bearer | open | Still the intended default at apps/finnaux-api/src/external/shared/external-api-runtime.service.ts:76, left on purpose. |
| 07f82b0a03599091e857955f0e63a25b26cacb1c | F2 | First save skips the string check | resolved | Fix still in place at apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts:381. |

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps libs | passed: no errors reported |
| grey | conflict marker scan on the commit | passed: none found |

### gaps (3)

- A 367-file merge was not reviewed line by line; only package.json, the files in the pre-push error and the external-apis paths were read
- dev's drizzle migrations and seed scripts were not run against a database
- No tests were run: jest is not configured for this repo

### info (4)

- The earlier pre-push tsc failure came from a node_modules that was missing the new logging packages; it type-checks cleanly now
- drizzle/meta snapshots add about 370k lines; they are generated files
- Removing db:push and db:seed means any script or doc still calling them will break
- bun.lock changed by about 1700 lines and should be committed as part of this merge

---

## howismycommit-10

| Field | Value |
|---|---|
| id | howismycommit-10 |
| generatedAt | 2026-11-13T16:50:37+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 14530eec9796a574d75abc1283b6e30ec285fbd4 |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 10 |
| files.deletions | 4 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 3 |
| before | The check that every credential value is text ran only when keys were already saved. A first save of a number or an object was turned into text and stored. |
| after | upsertApiGroupCredentials checks every sent value is a string before the transaction starts, for first saves and updates alike, and answers 400 Credential <key> must be a string. mergeCredentials no longer repeats the check. |

### changeType (2)

- bug fix
- API

### effects (3)

- A first save with a non-string value, including null, now returns 400 instead of storing converted text or reporting missing keys
- The body check now runs before the API group is looked up, so a bad body for an unknown group returns 400 before 404
- No change for requests whose values are all strings

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 07f82b0a03599091e857955f0e63a25b26cacb1c | F1 | Keyless group saved with authType bearer | open | external-apis runtime service line 76 still falls back to 'bearer'; left as is on purpose, as agreed. |
| 07f82b0a03599091e857955f0e63a25b26cacb1c | F2 | First save skips the string check | resolved | external-apis.service.ts:381 now runs assertCredentialValuesAreStrings(input.credentials) before the first-save or update branch. |

### checks (2)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/configurations/external-apis apps/finnaux-api/src/external/shared | passed |

### gaps (2)

- No test covers the new check; jest packages are not installed locally, so nothing was run.
- The route was not called on a running server; the helper was run on four sample bodies in an earlier step.

### info (3)

- The working tree matches this commit, so the current score equals the commit score.
- IsObject on the request class already rejects arrays and null, so the loop only sees objects.
- The commit message says 'type assertion'; the code is a runtime check that throws 400.

---

## howismycommit-9

| Field | Value |
|---|---|
| id | howismycommit-9 |
| generatedAt | 2026-11-13T14:45:27+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 07f82b0a03599091e857955f0e63a25b26cacb1c |
| files.changed | 3 |
| files.added | 0 |
| files.modified | 3 |
| files.deleted | 0 |
| files.insertions | 213 |
| files.deletions | 47 |
| verdict | review-with-caution |
| score | 92 |
| commitScore | 92 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 3 |
| summary.info | 4 |
| before | Saving credentials for an API group needed every key each time and only worked when the group had an active endpoint; there was no way to read saved keys, and both credentials routes needed only a login. |
| after | A new GET route returns the saved keys masked (first and last 10%), the PUT route merges only the keys sent and keeps the rest, saves inside a transaction that locks the API group row, accepts one apiKey for groups with no listed keys, and works for groups with no endpoint. Both routes now require the External APIs page rights. |

### changeType (3)

- feature
- api
- security

### effects (4)

- Frontend modal on /configuration/external-apis now has a route to load masked keys and can save partial updates.
- getApiGroupAuthContext now returns a result for groups without an active endpoint, so the schema route (GET .../credentials/schema) and the callers of that method also stop returning 404 for them.
- Credentials rows written for such groups carry authType bearer.
- The integration-group PUT and the list GET still need only a login (not changed here).

### filesReviewed (3)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/external/shared/external-api-runtime.service.ts | modified | amber | F1 |
| apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts | modified | amber | F2 |
| apps/finnaux-api/src/configurations/external-apis/external-apis.controller.ts | modified | green | no issues |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Keyless group saved with authType bearer |
| location | apps/finnaux-api/src/external/shared/external-api-runtime.service.ts:76 |
| problem | For a group with no active endpoint the auth context falls back to 'bearer', but the contract with the frontend says API_KEY, and the only key such a group can store is apiKey. That authType is written to apiGroupCredentials.authType. |
| impact | The saved row says bearer for a plain API key, and the schema route (buildCredentialsJsonSchema) does not recognise the lowercase value, so its answer for that group is wrong. |
| fix | Fall back to the API_KEY value the rest of the code uses, or the lowercase api_key if the column convention is lowercase, and keep both places consistent. |
| evidence | authType: apiGroup.authType ?? 'bearer', |
| status | resolved |
| resolvedIn | 06be55adfc5ad4b8f2a1e5ec15fbae413196bb0a |
| resolvedAt | 2026-11-23T12:27:47.478Z |
| resolvedNote | A group with no active endpoint now falls back to API_KEY, as the credentials contract says (apps/finnaux-api/src/external/shared/external-api-runtime.service.ts:76). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |
| future | true |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | First save skips the string check |
| location | apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts:406 |
| problem | The 'Credential <key> must be a string' check only runs inside mergeCredentials, which is used when keys are already saved. On the first save the body goes straight to validateCredentials, which turns any value into text. |
| impact | A first save of { apiKey: { a: 1 } } stores the text [object Object] as the key, and { apiKey: 123 } stores '123', while the same body is rejected with a 400 once keys exist. |
| fix | Run the string check on input.credentials before the stored-or-not branch, or validate the DTO values as strings. |
| evidence | storedCredentials === null<br>            ? input.credentials |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-13T09:33:47.078Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (0)

_Empty._

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit (API repo) | passed |
| green | npx oxlint apps/finnaux-api/src/configurations/external-apis apps/finnaux-api/src/external/shared | passed: no warnings or errors (run without --fix) |
| grey | npm test (jest) | not run: the commit adds no tests, and the mask, merge and locking logic is not covered by any |

### gaps (3)

- The commit is in the FINNAUX2.0-API repo, not in the UI repo this skill runs from; it was read there without changing anything and saved under the backend reports.
- No request was sent to the routes and the transaction lock was not exercised against a database.
- The jest suite was not run, and the commit adds no tests for maskCredentialValue, mergeCredentials or the locking.

### info (4)

- The route guards match the contract: GET needs canView and PUT needs canView plus canEdit on the External APIs page.
- The mask reveals the key length and 20% of its characters (for a 25-character key, 4), as the contract specifies.
- The FOR UPDATE lock is taken on the apiGroups row only (of: apiGroupsTable), which is the non-nullable side of the left join, so it is valid in Postgres.
- A stored row that cannot be decrypted makes the GET return 500 but the PUT treats it as not configured, as the contract says.

---

## howismycommit-8

| Field | Value |
|---|---|
| id | howismycommit-8 |
| generatedAt | 2026-11-13T14:44:33+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 07f82b0a03599091e857955f0e63a25b26cacb1c |
| files.changed | 3 |
| files.added | 0 |
| files.modified | 3 |
| files.deleted | 0 |
| files.insertions | 213 |
| files.deletions | 47 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 4 |
| before | Credentials could only be saved as a full set, never read back, and any logged-in employee could save them. Groups with no active endpoint returned 404 on the credentials routes. |
| after | A new GET returns saved keys masked to 10% at each end. PUT merges partial updates inside a transaction that locks the apiGroups row, ignores empty or still-masked values, accepts a single apiKey for groups with no required keys, and replaces a row that no longer decrypts. Both routes need the External APIs page right. |

### changeType (3)

- feature
- api
- security

### effects (4)

- Designations without the External APIs page right now get 403 on both credentials routes
- Groups under an inactive integration group, or with no active endpoint, behave differently on the credentials and schema routes (404 or bearer default)
- Frontend must use the new mask format and read route
- getApiGroupAuthContext gained optional db and forUpdate arguments; other callers are unchanged

### filesReviewed (3)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/configurations/external-apis/external-apis.controller.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts | modified | green | no issues |
| apps/finnaux-api/src/external/shared/external-api-runtime.service.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (0)

_Empty._

### checks (2)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/configurations/external-apis apps/finnaux-api/src/external/shared | passed |

### gaps (3)

- No tests cover the mask or merge logic; jest is not installed locally, so nothing was run.
- Routes were not called against a running server.
- Adapters that receive the decrypted keys were not read for logging.

### info (4)

- This commit is the amended c74e6e14 (message only, identical files); the earlier report howismycommit-7 covers the same code and had no findings.
- The mask keeps the key length visible and shows 10% of the characters at each end.
- GET returns 500 when the saved row cannot be decrypted, while PUT treats it as not configured and overwrites it.
- GET / and PUT integration-groups/:id still have no page-right check, as before this commit.

---

## howismycommit-7

| Field | Value |
|---|---|
| id | howismycommit-7 |
| generatedAt | 2026-11-13T14:41:44+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | c74e6e1436741e562e5e6aa56a3fd7acc965d4fe |
| files.changed | 3 |
| files.added | 0 |
| files.modified | 3 |
| files.deleted | 0 |
| files.insertions | 213 |
| files.deletions | 47 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 4 |
| before | Credentials could only be saved as a full set, never read back, and any logged-in employee could save them. Groups with no active endpoint returned 404 on the credentials routes. |
| after | A new GET returns saved keys masked to 10% at each end. PUT merges partial updates inside a transaction that locks the apiGroups row, ignores empty or still-masked values, accepts a single apiKey for groups with no required keys, and replaces a row that no longer decrypts. Both routes need the External APIs page right. |

### changeType (3)

- feature
- api
- security

### effects (4)

- Designations without the External APIs page right now get 403 on both credentials routes
- Groups under an inactive integration group, or with no active endpoint, now behave differently on the credentials and schema routes (404 or bearer defaults)
- Frontend must use the new mask format and read route
- getApiGroupAuthContext gained optional db and forUpdate arguments; other callers are unchanged

### filesReviewed (3)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/configurations/external-apis/external-apis.controller.ts | modified | green | no issues |
| apps/finnaux-api/src/configurations/external-apis/external-apis.service.ts | modified | green | no issues |
| apps/finnaux-api/src/external/shared/external-api-runtime.service.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (0)

_Empty._

### checks (2)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps/finnaux-api/src/configurations/external-apis apps/finnaux-api/src/external/shared | passed |

### gaps (3)

- No tests cover the mask or merge logic; jest is configured but its packages are not installed locally, so nothing was run.
- Routes were not called against a running server; only the locking query was run against the database and rolled back.
- Adapters that receive the decrypted keys were not read for logging.

### info (4)

- The mask keeps the key length visible and shows 10% of the characters at each end.
- GET returns 500 when the saved row cannot be decrypted, while PUT treats it as not configured and overwrites it.
- GET / and PUT integration-groups/:id still have no page-right check, as before this commit.
- authType falls back to 'bearer' for a group with no endpoint, as requested.

---

## howismycommit-6

| Field | Value |
|---|---|
| id | howismycommit-6 |
| generatedAt | 2026-11-04T09:52:55+05:30 |
| author | Dhruv |
| branch | dev |
| target.kind | commit |
| target.commit | b30b2d8ee7d5db29448bf9815e8c6da11d27fde2 |
| files.changed | 22 |
| files.added | 9 |
| files.modified | 13 |
| files.deleted | 0 |
| files.insertions | 1111 |
| files.deletions | 65 |
| verdict | review-with-caution |
| score | 82 |
| commitScore | 43 |
| quality | good |
| summary.red | 0 |
| summary.amber | 3 |
| summary.green | 1 |
| summary.info | 3 |
| before | The dhruv branch had no report builder. Auth guard, dropdown and customer DTO matched the earlier dhruv state. |
| after | The merge brings in dev's report builder (fields, query, saved templates), a customReports table with a ReportType enum, a WEEK_OFF attendance value, auth guard message constants and comments, and a hardcoded Report Builder module in the designation modules dropdown. |

### changeType (4)

- feature
- api
- schema or migration
- config or CI

### effects (4)

- New /reports/builder endpoints read loan overview data
- New customReports table needs a schema push
- getModules in the dropdown service changed what menu-rights screens receive
- Attendance status enum gains WEEK_OFF

### filesReviewed (8)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/reports/report-builder/report-builder.controller.ts | added | green | F1 fixed |
| apps/finnaux-api/src/reports/report-builder/report-builder.repository.ts | added | amber | F6 |
| apps/finnaux-api/src/reports/report-builder/report-builder.query.ts | added | amber | F5, F6 |
| apps/finnaux-api/src/dropdown/dropdown.service.ts | modified | green | F2 fixed |
| apps/finnaux-api/src/auth/guards/auth.guard.ts | modified | amber | F4 |
| apps/finnaux-api/src/drizzle/schema/accounts.ts | modified | amber | F4 |
| apps/finnaux-api/src/drizzle/schema/custom-report.schema.ts | added | green | no issues |
| apps/finnaux-api/src/drizzle/schema/enums.ts | modified | green | no issues |

### findings (6)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P1 |
| title | Report data endpoints had no page right or branch scope |
| location | apps/finnaux-api/src/reports/report-builder/report-builder.controller.ts:30 |
| problem | At the merge, every /reports/builder route used only AuthGuard. Any logged-in employee could POST /query for loan data of all branches and products, and read other employees' saved reports. |
| impact | Cross-branch loan data exposure to any employee. |
| fix | Add RequirePageRight and scope runs by the employee's access configuration. |
| evidence | @UseGuards(AuthGuard)<br>@Controller({ path: 'reports/builder', version: '1' }) |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-04T06:14:08.153Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P2 |
| title | Hardcoded fake Report Builder module pushed into designation modules |
| location | apps/finnaux-api/src/dropdown/dropdown.service.ts:543 |
| problem | getModules appended a module with a made-up id to every designation's module list. getMenuRights and the menu-rights screens use this list, so a module that is not in the database appeared there. |
| impact | Menu-rights screens show a phantom module that cannot be saved against; ids not in master_menu_modules. |
| fix | Remove the hardcoded module and seed the real one in the database. |
| evidence | modules.push({<br>      id: '01KRXBJXAAR3MDJ6V436RWB',<br>      name: 'Report Builder', |
| status | resolved |
| resolvedIn | c11a9debe1be93721d1979053ad94387c470b7d9 |
| resolvedAt | 2026-11-04T00:00:00.000Z |
| resolvedNote | getModules now returns only database modules (dropdown.service.ts:541-543). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[3] · F3

| Field | Value |
|---|---|
| id | F3 |
| severity | P3 |
| title | Column names built with sql.raw string concatenation, and IsIn with raw values |
| location | apps/finnaux-api/src/reports/report-builder/report-builder.repository.ts:118 |
| problem | Selected columns were turned into SQL with sql.raw of a template string, and the DTO validated keys with IsIn(REPORT_COLUMN_KEYS). Both break CLAUDE.md rules, and the raw string depended on a registry staying trusted. |
| impact | Injection risk if the registry ever takes outside input; rule violation. |
| fix | Use sql.identifier and enum or id-based validation. |
| evidence | selectedFields[col.key] = sql.raw(`"${col.source}"."${col.key}"`) |
| status | resolved |
| resolvedIn | 2db9b5277264f2b35408dc3cc903bfb264ed33a5 |
| resolvedAt | 2026-11-04T00:00:00.000Z |
| resolvedNote | report-builder.query.ts:23-24 uses sql.identifier and fields come from the database by id. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[4] · F4

| Field | Value |
|---|---|
| id | F4 |
| severity | P3 |
| title | Noisy or misspelled comments added against the comment rule |
| location | apps/finnaux-api/src/auth/guards/auth.guard.ts:113 |
| problem | The merge adds comments such as a question about returning early, 'prioritize wich every found first' and a question about a table in accounts.ts. They explain no business or technical reason, and CLAUDE.md says to remove noisy comments. |
| impact | Noise and typos in guard and schema code; no runtime effect. |
| fix | Remove them or turn them into issues. |
| evidence | //is it good to just return ?<br>//prioritize wich every found first |
| status | resolved |
| resolvedIn | 2bb01ccfd53841c29cfac848df73a47efe08c672 |
| resolvedAt | 2026-11-23T12:27:47.478Z |
| resolvedNote | The three noisy comments are removed from auth.guard.ts and accounts.ts (commit 2bb01ccf; no match left for them in either file). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |
| future | true |

#### findings[5] · F5

| Field | Value |
|---|---|
| id | F5 |
| severity | P2 |
| title | Aggregation row always returns 0 |
| location | apps/finnaux-api/src/reports/report-builder/report-builder.query.ts:68 |
| problem | buildAggregationRow returns { name, value: 0 } for every aggregated column without querying anything. This was added after the merge (cd07ebd1) and is in the current code. |
| impact | A report with a SUM or COUNT column shows a total of 0 next to rows with real values. |
| fix | Compute the aggregation in SQL, or omit the row until it is implemented. |
| evidence | row[field.id] = { name: aggregation, value: 0 } |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-23T12:33:32.201Z |
| resolvedNote | Marked resolved manually |
| needsAttention | true |
| attentionNote | The aggregation row still returns a fixed 0 without querying anything (apps/finnaux-api/src/reports/report-builder/report-builder.query.ts:87). |
| confirmed | false |
| confirmedNote | null |
| future | false |

#### findings[6] · F6

| Field | Value |
|---|---|
| id | F6 |
| severity | P3 |
| title | Physical table and column names typed inside raw SQL |
| location | apps/finnaux-api/src/reports/report-builder/report-builder.query.ts:30 |
| problem | Filters use sql with typed names such as the lao loanDate, branchId and la loanCloseDate columns. CLAUDE.md says to interpolate Drizzle column objects instead of typing names. |
| impact | A column rename in the view or table breaks the report at runtime, not at compile time. |
| fix | Reference loanApplicationOverviewView and loanApplicationsTable columns through Drizzle aliases. |
| evidence | const loanDate = sql`"lao"."loanDate"` |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-23T12:33:33.741Z |
| resolvedNote | Marked resolved manually |
| needsAttention | true |
| attentionNote | The filter still types the raw name "lao"."loanDate" inside sql (apps/finnaux-api/src/reports/report-builder/report-builder.query.ts:33). |
| confirmed | false |
| confirmedNote | null |
| future | false |

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 9caccbef6360073ac36c255ce5ed236e66cd0b6c | none | Run 5 had no findings | resolved | Nothing to check; howismycommit-5 reported 0 findings. |

### checks (2)

| status | command | result |
|---|---|---|
| grey | bunx tsc --noEmit | 13 errors, all in spec files: @jest/globals and @nestjs/testing are not installed in node_modules. No errors in source files. |
| green | bunx oxlint report-builder dropdown auth | passed |

### gaps (3)

- Jest specs were not run: jest is not installed locally.
- Only the merge diff against its first parent (9caccbef) was reviewed, not dev's own history.
- The customReports schema push and the seeded report menu page were not checked against a database.

### info (3)

- The working tree has moved far past the merge: report builder was rewritten and HRMS changes (#93) landed after it.
- WEEK_OFF was added to an attendance enum; check the database enum is migrated.
- auth.guard.ts:46 and dropdown.service.ts changes in the merge are otherwise behaviour-neutral.

---

## howismycommit-5

| Field | Value |
|---|---|
| id | howismycommit-5 |
| generatedAt | 2026-10-30T14:56:04+05:30 |
| author | Dhruv |
| branch | dhruv |
| target.kind | commit |
| target.commit | 9caccbef6360073ac36c255ce5ed236e66cd0b6c |
| files.changed | 5 |
| files.added | 0 |
| files.modified | 5 |
| files.deleted | 0 |
| files.insertions | 18 |
| files.deletions | 9 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 4 |
| before | The UCRF consumer grid and TUDF file had the problems listed in the review of fb661de5: including closed loans dropped every open loan, loans closed after the reporting date were reported, the NREGA id could contain the text null, field 38 could be written empty, and the grid and DTO disagreed on the old account column and the account type default. |
| after | Including closed loans returns open loans plus loans closed between closedFromDate and the reporting date (both inclusive, UTC). The NREGA id is built null-safely, field 38 is written only with a rate, the grid exposes oldAccountNumber everywhere, and the account type defaults to 05 padded to 2 digits in the grid as in the file. |

### changeType (2)

- bug fix
- api

### effects (4)

- UCRF consumer report requests with includeClosedCases now return open loans as well as the closed ones in range.
- The consumer grid API and its Swagger schema expose oldAccountNumber and no longer expose oldAccountNo; any client reading oldAccountNo must switch.
- TUDF consumer files drop field 38 for loans with no interest rate or a rate of 0.
- Grid account type and old account type are always 2 digits.

### filesReviewed (5)

| path | change | status | note |
|---|---|---|---|
| apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-ui.types.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (7)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F1 | Including closed cases drops every open loan | resolved | ucrf-report.service.ts:1336-1373 returns or(open filters, closed filters), so open loans stay in the result. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F2 | Loans closed after the reporting date are reported as closed | resolved | ucrf-report.service.ts:1361-1364 bounds loanCloseDate below the day after the reporting date. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F3 | NREGA id gets the string 'null' when last name is empty | resolved | lib/consumer/tudf-file.builder.ts:141 uses (row.lastName ?? '') instead of concatenating null. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F4 | Field 38 written empty when interest rate is null | resolved | lib/consumer/tudf-file.builder.ts:376-379 writes field 38 only when formatInterestRate returns a value. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F5 | New NREGA and CKYC master document ids look like placeholders | resolved | Confirmed manually: NREGA and CKYC ids exist in the documents table (checked against the project database). |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F6 | Grid row DTO not updated for the renamed old account column | resolved | dto/ucrf-consumer-grid-row.dto.ts:85 declares oldAccountNumber, and oldAccountNo is gone from the types and mapper. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F7 | Grid account type lost its default while the file keeps it | resolved | lib/consumer/ucrf-consumer-grid.mapper.ts:90 applies the same 05 default and 2-digit padding as the file builder. |

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps libs | passed |
| grey | tests | not run: no test script in package.json and none for the ucrf module |

### gaps (4)

- The working tree matches this commit, so the review of current code and of the commit is the same.
- The TUDF tag layout and field numbers were not checked against the bureau spec or a real sample file.
- No tests cover the TUDF builder or the portfolio filter, so their output was not exercised.
- The closed-case date bounds were reviewed as SQL, not run against real closed loans.

### info (4)

- Field 38 now requires both noOfInstallments and interestRate, so a loan with a 0 rate or no installment count has no rate in the file. Confirm the bureau accepts that for interest-free loans.
- The default (row.cibilAccountTypeCode ?? 05).padStart(2, 0) is repeated twice in the mapper and twice in the file builder; one shared helper would keep them from drifting.
- NREGA ids are nregaCard plus lastName, so a customer with no last name gets the card number alone; the fallback is undecided.
- loanDate <= reportingDate still compares a timestamptz with a date at session time zone, the same risk the close date bound removed.

---

## howismycommit-4

| Field | Value |
|---|---|
| id | howismycommit-4 |
| generatedAt | 2026-10-30T14:27:11+05:30 |
| author | Dhruv |
| branch | dhruv |
| target.kind | commit |
| target.commit | fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 |
| files.changed | 8 |
| files.added | 0 |
| files.modified | 8 |
| files.deleted | 0 |
| files.insertions | 263 |
| files.deletions | 50 |
| verdict | looks-good |
| score | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 4 |
| before | The consumer UCRF report wrote one short TUDF record per loan with simple segment tags, a single phone and ID list, and no old account, income, email or secondary address data. With closed cases included it reported open loans together with loans closed in the chosen window. |
| after | The TUDF builder emits segment-length tags (PN03, ID03, PT03, EC03, PA03, TL04), up to five name fields, several phones, emails, a secondary address, old account number, interest rate and income fields, and the grid shows old account and NREGA/CKYC data. With closed cases included the filter returns open loans plus loans closed between the closed-from date and the reporting date. |
| commitScore | 33 |

### changeType (2)

- feature
- api

### effects (5)

- UCRF consumer TUDF file content and field order for every reported loan
- UCRF consumer grid and Excel export columns (old account number column key renamed)
- Loan selection for the UCRF report when includeClosedCases is true
- NREGA and CKYC document lookups that depend on two new master document IDs
- generate-ucrf-report requests that set includeClosedCases without closedFromDate now fail with 400

### filesReviewed (8)

| path | change | status | note |
|---|---|---|---|
| .gitignore | modified | green | no issues |
| apps/finnaux-api/src/fixed-cuids.ts | modified | amber | F5 |
| apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts | modified | amber | F3 |
| apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts | modified | amber | F7 |
| apps/finnaux-api/src/reports/ucrf-report/lib/shared/format-utils.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-types.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-ui.types.ts | modified | amber | F6 |
| apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts | modified | red | F1 |

### findings (7)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P1 |
| title | Including closed cases drops every open loan |
| location | apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts:1366 |
| problem | buildLoanPortfolioFilter builds openLoanFilters, returns them only when includeClosedCases is false, and otherwise returns and(...closedLoanFilters). The previous or(open, closed) is gone, so with includeClosedCases=true the open filters are built and thrown away. |
| impact | A report generated with 'include closed cases' contains only closed loans. The live portfolio is missing from the file submitted to the bureau, and the grid shows the wrong set. |
| fix | Return or(and(...openLoanFilters), and(...closedLoanFilters)) when includeClosedCases is true, and import or again. |
| evidence | return and(...closedLoanFilters) as SQL |
| status | resolved |
| resolvedIn | 9caccbef6360073ac36c255ce5ed236e66cd0b6c |
| resolvedAt | 2026-11-18T13:03:58.744Z |
| resolvedNote | Verified: with includeClosedCases the filter again returns or(open, closed) at apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts:1372. |
| needsAttention | false |
| attentionNote | null |
| future | true |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P2 |
| title | Loans closed after the reporting date are reported as closed |
| location | apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts:1359 |
| problem | The closed filter no longer has lte(loanCloseDate, reportingDate). It only requires loanCloseDate >= closedFromDate, so a loan closed after the reporting date matches. |
| impact | For a back-dated reporting date, such a loan is written with a closed status code and a Date Closed later than the reporting date, although it was still open on that date. |
| fix | Keep lte(loanApplicationsTable.loanCloseDate, reportingDateSql) in the closed filter next to the gte on closedFromDate. |
| evidence | gte(<br>        loanApplicationsTable.loanCloseDate,<br>        sql`${input.closedFromDate}::date`<br>      ), |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | ucrf-report.service.ts:1361-1364 bounds loanCloseDate below the day after the reporting date. |
| needsAttention | false |
| attentionNote | null |

#### findings[3] · F3

| Field | Value |
|---|---|
| id | F3 |
| severity | P2 |
| title | NREGA id gets the string 'null' when last name is empty |
| location | apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts:141 |
| problem | row.lastName is typed string \| null and is concatenated onto the NREGA number with +. A null last name produces '<card>null'. |
| impact | The identifier written to the bureau file is corrupted for any customer with an NREGA card and no last name, and a long card number can be cut by the 30 character limit. |
| fix | Append the last name only when it is present, for example number: row.nregaCard + (row.lastName ?? ''), or confirm with the spec that the name must be appended at all. |
| evidence | ids.push({ type: TUDF_ID_TYPE.NREGA, number: row.nregaCard + row.lastName }) |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | lib/consumer/tudf-file.builder.ts:141 uses (row.lastName ?? '') instead of concatenating null. |
| needsAttention | false |
| attentionNote | null |

#### findings[4] · F4

| Field | Value |
|---|---|
| id | F4 |
| severity | P2 |
| title | Field 38 written empty when interest rate is null |
| location | apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts:377 |
| problem | formatInterestRate returns '' for a null rate and buildVarField turns that into the zero-length field '3800'. The field is also gated on noOfInstallments instead of on the rate. |
| impact | Loans with installments but no IRR get an empty field 38 that the bureau can reject, and loans with a rate but no installment count never report it. |
| fix | Gate the field on row.interestRate being present and non-null, not on noOfInstallments. |
| evidence | if (row.noOfInstallments) {<br>    segment += buildVarField('38', formatInterestRate(row.interestRate)) |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T08:21:53.690Z |
| resolvedNote | lib/consumer/tudf-file.builder.ts:376-379 writes field 38 only when formatInterestRate returns a value. |
| needsAttention | false |
| attentionNote | null |

#### findings[5] · F5

| Field | Value |
|---|---|
| id | F5 |
| severity | P3 |
| title | New NREGA and CKYC master document ids look like placeholders |
| location | apps/finnaux-api/src/fixed-cuids.ts:204 |
| problem | The two ids follow a sequential pattern unlike the neighbouring generated ids, and nothing else in the repo references them. If no master document row exists with these ids, the lookups always return null. |
| impact | NREGA and CKYC numbers are silently never reported, which looks the same as customers having no such document. |
| fix | Confirm both ids exist in the master documents table (or add the seed) and replace them with the real ids. |
| evidence | NREGA: '01JWZGJ8Q1Y12V3B4N5P6Q7R8S',<br>    CKYC: '01J8F3Y4M5P6Q7R8S9T0V1W2X3', |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T08:59:20.983Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | true |
| confirmedNote | Confirmed manually: NREGA and CKYC ids exist in the documents table (checked against the project database). |

#### findings[6] · F6

| Field | Value |
|---|---|
| id | F6 |
| severity | P3 |
| title | Grid row DTO not updated for the renamed old account column |
| location | apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts:85 |
| problem | TUcrfConsumerGridRow and UCRF_CONSUMER_GRID_COLUMNS now use oldAccountNumber, but UcrfConsumerGridRowDto still declares only oldAccountNo, so the Swagger schema has no oldAccountNumber field. |
| impact | Clients generated from the API schema do not see the new Old Acc No column key, and oldAccountNo is still sent as a duplicate. |
| fix | Add oldAccountNumber to the DTO and drop the unused oldAccountNo, or keep the old key in the column list. |
| evidence | @ApiProperty({ required: false }) oldAccountNo: string \| null |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | dto/ucrf-consumer-grid-row.dto.ts:85 declares oldAccountNumber, and oldAccountNo is gone from the types and mapper. |
| needsAttention | false |
| attentionNote | null |

#### findings[7] · F7

| Field | Value |
|---|---|
| id | F7 |
| severity | P3 |
| title | Grid account type lost its default while the file keeps it |
| location | apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts:175 |
| problem | The grid now shows row.cibilAccountTypeCode as is, but the TUDF builder still writes (row.cibilAccountTypeCode ?? '05').padStart(2, '0') at tudf-file.builder.ts:346. |
| impact | For a product with no CIBIL type the grid shows a blank account type while the submitted file says 05, so what the user reviews differs from what is sent. |
| fix | Use the same default and padding in the grid, or remove the default from the file builder. |
| evidence | accountType: row.cibilAccountTypeCode, |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | lib/consumer/ucrf-consumer-grid.mapper.ts:90 applies the same 05 default and 2-digit padding as the file builder. |
| needsAttention | false |
| attentionNote | null |

### previousFindings (7)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F1 | Including closed cases drops every open loan | resolved | ucrf-report.service.ts:1336-1373 returns or(open filters, closed filters), so open loans stay in the result. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F2 | Loans closed after the reporting date are reported as closed | resolved | ucrf-report.service.ts:1361-1364 bounds loanCloseDate below the day after the reporting date. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F3 | NREGA id gets the string 'null' when last name is empty | resolved | lib/consumer/tudf-file.builder.ts:141 uses (row.lastName ?? '') instead of concatenating null. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F4 | Field 38 written empty when interest rate is null | resolved | lib/consumer/tudf-file.builder.ts:376-379 writes field 38 only when formatInterestRate returns a value. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F5 | New NREGA and CKYC master document ids look like placeholders | resolved | Confirmed manually: NREGA and CKYC ids exist in the documents table (checked against the project database). |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F6 | Grid row DTO not updated for the renamed old account column | resolved | dto/ucrf-consumer-grid-row.dto.ts:85 declares oldAccountNumber, and oldAccountNo is gone from the types and mapper. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F7 | Grid account type lost its default while the file keeps it | resolved | lib/consumer/ucrf-consumer-grid.mapper.ts:90 applies the same 05 default and 2-digit padding as the file builder. |

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps libs | passed |
| grey | tests | not run: no test script in package.json and none for the ucrf module |

### gaps (5)

- The commit files differ from the working tree (4 files, 15 insertions, 9 deletions). That diff holds exactly the fixes for F1 to F4, F6 and F7 and no new defect.
- The fixes are uncommitted, so they hold only until they are committed or discarded.
- The TUDF tag layout (PN03, ID03, TL04 and field numbers 18 to 20, 38, 46 to 49) was not checked against the bureau spec or a real sample file.
- No tests cover the TUDF builder, so the segment output was not exercised.
- The closed-case date bounds were checked as SQL, not against real closed loans in a report run.

### info (4)

- NREGA ids are built as nregaCard plus lastName, so a customer with no last name gets the card number alone; the fallback is undecided.
- loanDate <= reportingDate still compares a timestamptz with a date at session time zone, the same risk the close date bound removed.
- buildIdSegments returns one string that buildConsumerTudfRecord spreads into characters; it works but is accidental.
- formatInterestRate truncates to three decimals instead of rounding, so 8.9999 is reported as 8.999.

---

## howismycommit-3

| Field | Value |
|---|---|
| id | howismycommit-3 |
| generatedAt | 2026-10-30T13:33:30+05:30 |
| author | Dhruv |
| branch | dhruv |
| target.kind | commit |
| target.commit | fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 |
| files.changed | 8 |
| files.added | 0 |
| files.modified | 8 |
| files.deleted | 0 |
| files.insertions | 263 |
| files.deletions | 50 |
| verdict | request-changes |
| score | 33 |
| quality | poor |
| summary.red | 1 |
| summary.amber | 6 |
| summary.green | 2 |
| summary.info | 4 |
| before | The consumer UCRF report wrote one short TUDF record per loan with simple segment tags, a single phone and ID list, and no old account, income, email or secondary address data. With closed cases included it reported open loans together with loans closed in the chosen window. |
| after | The TUDF builder emits segment-length tags (PN03, ID03, PT03, EC03, PA03, TL04), up to five name fields, several phones, emails, a secondary address, old account number, interest rate and income fields, and the grid shows old account and NREGA/CKYC data. With closed cases included the filter returns open loans plus loans closed between the closed-from date and the reporting date. |

### changeType (2)

- feature
- api

### effects (5)

- UCRF consumer TUDF file content and field order for every reported loan
- UCRF consumer grid and Excel export columns (old account number column key renamed)
- Loan selection for the UCRF report when includeClosedCases is true
- NREGA and CKYC document lookups that depend on two new master document IDs
- generate-ucrf-report requests that set includeClosedCases without closedFromDate now fail with 400

### filesReviewed (8)

| path | change | status | note |
|---|---|---|---|
| .gitignore | modified | green | no issues |
| apps/finnaux-api/src/fixed-cuids.ts | modified | amber | F5 |
| apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts | modified | amber | F3 |
| apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts | modified | amber | F7 |
| apps/finnaux-api/src/reports/ucrf-report/lib/shared/format-utils.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-types.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-ui.types.ts | modified | amber | F6 |
| apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts | modified | red | F1 |

### findings (7)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P1 |
| title | Including closed cases drops every open loan |
| location | apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts:1366 |
| problem | buildLoanPortfolioFilter builds openLoanFilters, returns them only when includeClosedCases is false, and otherwise returns and(...closedLoanFilters). The previous or(open, closed) is gone, so with includeClosedCases=true the open filters are built and thrown away. |
| impact | A report generated with 'include closed cases' contains only closed loans. The live portfolio is missing from the file submitted to the bureau, and the grid shows the wrong set. |
| fix | Return or(and(...openLoanFilters), and(...closedLoanFilters)) when includeClosedCases is true, and import or again. |
| evidence | return and(...closedLoanFilters) as SQL |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | Fixed: the filter returns or(open, closed) when closed cases are included at apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts:1372. |
| needsAttention | false |
| attentionNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P2 |
| title | Loans closed after the reporting date are reported as closed |
| location | apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts:1359 |
| problem | The closed filter no longer has lte(loanCloseDate, reportingDate). It only requires loanCloseDate >= closedFromDate, so a loan closed after the reporting date matches. |
| impact | For a back-dated reporting date, such a loan is written with a closed status code and a Date Closed later than the reporting date, although it was still open on that date. |
| fix | Keep lte(loanApplicationsTable.loanCloseDate, reportingDateSql) in the closed filter next to the gte on closedFromDate. |
| evidence | gte(<br>        loanApplicationsTable.loanCloseDate,<br>        sql`${input.closedFromDate}::date`<br>      ), |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | Fixed: closed loans are bounded to closedFromDate through the reporting date, inclusive, at apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts:1363. |
| needsAttention | false |
| attentionNote | null |

#### findings[3] · F3

| Field | Value |
|---|---|
| id | F3 |
| severity | P2 |
| title | NREGA id gets the string 'null' when last name is empty |
| location | apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts:141 |
| problem | row.lastName is typed string \| null and is concatenated onto the NREGA number with +. A null last name produces '<card>null'. |
| impact | The identifier written to the bureau file is corrupted for any customer with an NREGA card and no last name, and a long card number can be cut by the 30 character limit. |
| fix | Append the last name only when it is present, for example number: row.nregaCard + (row.lastName ?? ''), or confirm with the spec that the name must be appended at all. |
| evidence | ids.push({ type: TUDF_ID_TYPE.NREGA, number: row.nregaCard + row.lastName }) |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | Fixed: the last name is appended only when present at apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts:141. |
| needsAttention | false |
| attentionNote | null |

#### findings[4] · F4

| Field | Value |
|---|---|
| id | F4 |
| severity | P2 |
| title | Field 38 written empty when interest rate is null |
| location | apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts:377 |
| problem | formatInterestRate returns '' for a null rate and buildVarField turns that into the zero-length field '3800'. The field is also gated on noOfInstallments instead of on the rate. |
| impact | Loans with installments but no IRR get an empty field 38 that the bureau can reject, and loans with a rate but no installment count never report it. |
| fix | Gate the field on row.interestRate being present and non-null, not on noOfInstallments. |
| evidence | if (row.noOfInstallments) {<br>    segment += buildVarField('38', formatInterestRate(row.interestRate)) |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T08:21:53.690Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |

#### findings[5] · F5

| Field | Value |
|---|---|
| id | F5 |
| severity | P3 |
| title | New NREGA and CKYC master document ids look like placeholders |
| location | apps/finnaux-api/src/fixed-cuids.ts:204 |
| problem | The two ids follow a sequential pattern unlike the neighbouring generated ids, and nothing else in the repo references them. If no master document row exists with these ids, the lookups always return null. |
| impact | NREGA and CKYC numbers are silently never reported, which looks the same as customers having no such document. |
| fix | Confirm both ids exist in the master documents table (or add the seed) and replace them with the real ids. |
| evidence | NREGA: '01JWZGJ8Q1Y12V3B4N5P6Q7R8S',<br>    CKYC: '01J8F3Y4M5P6Q7R8S9T0V1W2X3', |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T08:21:56.212Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | true |
| confirmedNote | Confirmed manually: NREGA and CKYC ids exist in the documents table (checked against the project database). |

#### findings[6] · F6

| Field | Value |
|---|---|
| id | F6 |
| severity | P3 |
| title | Grid row DTO not updated for the renamed old account column |
| location | apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts:85 |
| problem | TUcrfConsumerGridRow and UCRF_CONSUMER_GRID_COLUMNS now use oldAccountNumber, but UcrfConsumerGridRowDto still declares only oldAccountNo, so the Swagger schema has no oldAccountNumber field. |
| impact | Clients generated from the API schema do not see the new Old Acc No column key, and oldAccountNo is still sent as a duplicate. |
| fix | Add oldAccountNumber to the DTO and drop the unused oldAccountNo, or keep the old key in the column list. |
| evidence | @ApiProperty({ required: false }) oldAccountNo: string \| null |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | Fixed: the DTO now declares oldAccountNumber at apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts:85. |
| needsAttention | false |
| attentionNote | null |

#### findings[7] · F7

| Field | Value |
|---|---|
| id | F7 |
| severity | P3 |
| title | Grid account type lost its default while the file keeps it |
| location | apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts:175 |
| problem | The grid now shows row.cibilAccountTypeCode as is, but the TUDF builder still writes (row.cibilAccountTypeCode ?? '05').padStart(2, '0') at tudf-file.builder.ts:346. |
| impact | For a product with no CIBIL type the grid shows a blank account type while the submitted file says 05, so what the user reviews differs from what is sent. |
| fix | Use the same default and padding in the grid, or remove the default from the file builder. |
| evidence | accountType: row.cibilAccountTypeCode, |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | Fixed: the grid applies the same 05 default and two-digit padding at apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts:90. |
| needsAttention | false |
| attentionNote | null |

### previousFindings (7)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F1 | Including closed cases drops every open loan | resolved | Fixed: the filter returns or(open, closed) when closed cases are included at apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts:1372. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F2 | Loans closed after the reporting date are reported as closed | resolved | Fixed: closed loans are bounded to closedFromDate through the reporting date, inclusive, at apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts:1363. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F3 | NREGA id gets the string 'null' when last name is empty | resolved | Fixed: the last name is appended only when present at apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts:141. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F4 | Field 38 written empty when interest rate is null | resolved | Fixed: field 38 is written whenever a rate exists, not only with installments, at apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts:378. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F5 | New NREGA and CKYC master document ids look like placeholders | resolved | Confirmed manually: NREGA and CKYC ids exist in the documents table (checked against the project database). |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F6 | Grid row DTO not updated for the renamed old account column | resolved | Fixed: the DTO now declares oldAccountNumber at apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts:85. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F7 | Grid account type lost its default while the file keeps it | resolved | Fixed: the grid applies the same 05 default and two-digit padding at apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts:90. |

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps libs | passed |
| grey | tests | not run: no test script in package.json and none for the ucrf module |

### gaps (5)

- The TUDF tag layout (PN03, ID03, TL04 and field numbers 18 to 20, 38, 46 to 49) was not checked against the bureau spec or a real sample file.
- Master document rows for the new NREGA and CKYC ids were not checked in the database.
- No tests cover the TUDF builder, so the new segment output was not exercised.
- The change to throw when includeClosedCases is set without closedFromDate was not checked against the UI request.
- Findings F1 to F4, F6 and F7 were re-verified against the uncommitted working tree, which has not changed since howismycommit-2, so they stay fixed only until the fixes are committed.

### info (4)

- buildIdSegments now returns one string and buildConsumerTudfRecord spreads it, which splits it into characters that join('') puts back together. It works but is accidental.
- buildThSegment ignores its arguments and returns an empty string, and two consecutive if (row.customerIncomeAmount) blocks could be one. The secondary address category ternary is always RESIDENCE inside its own guard.
- .gitignore now ignores docs/ although docs/ has tracked files, so new docs will not be picked up by git add, and the file ends without a newline.
- formatInterestRate truncates to three decimals instead of rounding, so 8.9999 is reported as 8.999.

---

## howismycommit-2

| Field | Value |
|---|---|
| id | howismycommit-2 |
| generatedAt | 2026-10-30T11:32:56+05:30 |
| author | Dhruv |
| branch | dhruv |
| target.kind | commit |
| target.commit | fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 |
| files.changed | 8 |
| files.added | 0 |
| files.modified | 8 |
| files.deleted | 0 |
| files.insertions | 263 |
| files.deletions | 50 |
| verdict | request-changes |
| score | 33 |
| quality | poor |
| summary.red | 1 |
| summary.amber | 6 |
| summary.green | 2 |
| summary.info | 4 |
| before | The consumer UCRF report wrote one short TUDF record per loan with simple segment tags, a single phone and ID list, and no old account, income, email or secondary address data. With closed cases included it reported open loans together with loans closed in the chosen window. |
| after | The TUDF builder emits segment-length tags (PN03, ID03, PT03, EC03, PA03, TL04), up to five name fields, several phones, emails, a secondary address, old account number, interest rate and income fields, and the grid shows old account and NREGA/CKYC data. With closed cases included the filter returns open loans plus loans closed between the closed-from date and the reporting date. |

### changeType (2)

- feature
- api

### effects (5)

- UCRF consumer TUDF file content and field order for every reported loan
- UCRF consumer grid and Excel export columns (old account number column key renamed)
- Loan selection for the UCRF report when includeClosedCases is true
- NREGA and CKYC document lookups that depend on two new master document IDs
- generate-ucrf-report requests that set includeClosedCases without closedFromDate now fail with 400

### filesReviewed (8)

| path | change | status | note |
|---|---|---|---|
| .gitignore | modified | green | no issues |
| apps/finnaux-api/src/fixed-cuids.ts | modified | amber | F5 |
| apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts | modified | amber | F3 |
| apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts | modified | amber | F7 |
| apps/finnaux-api/src/reports/ucrf-report/lib/shared/format-utils.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-types.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-ui.types.ts | modified | amber | F6 |
| apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts | modified | red | F1 |

### findings (7)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P1 |
| title | Including closed cases drops every open loan |
| location | apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts:1366 |
| problem | buildLoanPortfolioFilter builds openLoanFilters, returns them only when includeClosedCases is false, and otherwise returns and(...closedLoanFilters). The previous or(open, closed) is gone, so with includeClosedCases=true the open filters are built and thrown away. |
| impact | A report generated with 'include closed cases' contains only closed loans. The live portfolio is missing from the file submitted to the bureau, and the grid shows the wrong set. |
| fix | Return or(and(...openLoanFilters), and(...closedLoanFilters)) when includeClosedCases is true, and import or again. |
| evidence | return and(...closedLoanFilters) as SQL |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | Fixed: the filter returns or(open, closed) when closed cases are included at apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts:1372. |
| needsAttention | false |
| attentionNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P2 |
| title | Loans closed after the reporting date are reported as closed |
| location | apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts:1359 |
| problem | The closed filter no longer has lte(loanCloseDate, reportingDate). It only requires loanCloseDate >= closedFromDate, so a loan closed after the reporting date matches. |
| impact | For a back-dated reporting date, such a loan is written with a closed status code and a Date Closed later than the reporting date, although it was still open on that date. |
| fix | Keep lte(loanApplicationsTable.loanCloseDate, reportingDateSql) in the closed filter next to the gte on closedFromDate. |
| evidence | gte(<br>        loanApplicationsTable.loanCloseDate,<br>        sql`${input.closedFromDate}::date`<br>      ), |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | Fixed: closed loans are bounded to closedFromDate through the reporting date, inclusive, at apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts:1363. |
| needsAttention | false |
| attentionNote | null |

#### findings[3] · F3

| Field | Value |
|---|---|
| id | F3 |
| severity | P2 |
| title | NREGA id gets the string 'null' when last name is empty |
| location | apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts:141 |
| problem | row.lastName is typed string \| null and is concatenated onto the NREGA number with +. A null last name produces '<card>null'. |
| impact | The identifier written to the bureau file is corrupted for any customer with an NREGA card and no last name, and a long card number can be cut by the 30 character limit. |
| fix | Append the last name only when it is present, for example number: row.nregaCard + (row.lastName ?? ''), or confirm with the spec that the name must be appended at all. |
| evidence | ids.push({ type: TUDF_ID_TYPE.NREGA, number: row.nregaCard + row.lastName }) |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | Fixed: the last name is appended only when present at apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts:141. |
| needsAttention | false |
| attentionNote | null |

#### findings[4] · F4

| Field | Value |
|---|---|
| id | F4 |
| severity | P2 |
| title | Field 38 written empty when interest rate is null |
| location | apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts:377 |
| problem | formatInterestRate returns '' for a null rate and buildVarField turns that into the zero-length field '3800'. The field is also gated on noOfInstallments instead of on the rate. |
| impact | Loans with installments but no IRR get an empty field 38 that the bureau can reject, and loans with a rate but no installment count never report it. |
| fix | Gate the field on row.interestRate being present and non-null, not on noOfInstallments. |
| evidence | if (row.noOfInstallments) {<br>    segment += buildVarField('38', formatInterestRate(row.interestRate)) |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | Fixed: field 38 is written whenever a rate exists, not only with installments, at apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts:378. |
| needsAttention | false |
| attentionNote | null |

#### findings[5] · F5

| Field | Value |
|---|---|
| id | F5 |
| severity | P3 |
| title | New NREGA and CKYC master document ids look like placeholders |
| location | apps/finnaux-api/src/fixed-cuids.ts:204 |
| problem | The two ids follow a sequential pattern unlike the neighbouring generated ids, and nothing else in the repo references them. If no master document row exists with these ids, the lookups always return null. |
| impact | NREGA and CKYC numbers are silently never reported, which looks the same as customers having no such document. |
| fix | Confirm both ids exist in the master documents table (or add the seed) and replace them with the real ids. |
| evidence | NREGA: '01JWZGJ8Q1Y12V3B4N5P6Q7R8S',<br>    CKYC: '01J8F3Y4M5P6Q7R8S9T0V1W2X3', |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:57:53.330Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | true |
| confirmedNote | Confirmed manually: NREGA and CKYC ids exist in the documents table (checked against the project database). |

#### findings[6] · F6

| Field | Value |
|---|---|
| id | F6 |
| severity | P3 |
| title | Grid row DTO not updated for the renamed old account column |
| location | apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts:85 |
| problem | TUcrfConsumerGridRow and UCRF_CONSUMER_GRID_COLUMNS now use oldAccountNumber, but UcrfConsumerGridRowDto still declares only oldAccountNo, so the Swagger schema has no oldAccountNumber field. |
| impact | Clients generated from the API schema do not see the new Old Acc No column key, and oldAccountNo is still sent as a duplicate. |
| fix | Add oldAccountNumber to the DTO and drop the unused oldAccountNo, or keep the old key in the column list. |
| evidence | @ApiProperty({ required: false }) oldAccountNo: string \| null |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | Fixed: the DTO now declares oldAccountNumber at apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts:85. |
| needsAttention | false |
| attentionNote | null |

#### findings[7] · F7

| Field | Value |
|---|---|
| id | F7 |
| severity | P3 |
| title | Grid account type lost its default while the file keeps it |
| location | apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts:175 |
| problem | The grid now shows row.cibilAccountTypeCode as is, but the TUDF builder still writes (row.cibilAccountTypeCode ?? '05').padStart(2, '0') at tudf-file.builder.ts:346. |
| impact | For a product with no CIBIL type the grid shows a blank account type while the submitted file says 05, so what the user reviews differs from what is sent. |
| fix | Use the same default and padding in the grid, or remove the default from the file builder. |
| evidence | accountType: row.cibilAccountTypeCode, |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | Fixed: the grid applies the same 05 default and two-digit padding at apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts:90. |
| needsAttention | false |
| attentionNote | null |

### previousFindings (7)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F1 | Including closed cases drops every open loan | resolved | Fixed: the filter returns or(open, closed) when closed cases are included at apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts:1372. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F2 | Loans closed after the reporting date are reported as closed | resolved | Fixed: closed loans are bounded to closedFromDate through the reporting date, inclusive, at apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts:1363. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F3 | NREGA id gets the string 'null' when last name is empty | resolved | Fixed: the last name is appended only when present at apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts:141. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F4 | Field 38 written empty when interest rate is null | resolved | Fixed: field 38 is written whenever a rate exists, not only with installments, at apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts:378. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F5 | New NREGA and CKYC master document ids look like placeholders | needs-attention | Fixed: the ids are unchanged intentionally. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F6 | Grid row DTO not updated for the renamed old account column | resolved | Fixed: the DTO now declares oldAccountNumber at apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts:85. |
| fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 | F7 | Grid account type lost its default while the file keeps it | resolved | Fixed: the grid applies the same 05 default and two-digit padding at apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts:90. |

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps libs | passed |
| grey | tests | not run: no test script in package.json and none for the ucrf module |

### gaps (5)

- The TUDF tag layout (PN03, ID03, TL04 and field numbers 18 to 20, 38, 46 to 49) was not checked against the bureau spec or a real sample file.
- Master document rows for the new NREGA and CKYC ids were not checked in the database.
- No tests cover the TUDF builder, so the new segment output was not exercised.
- The change to throw when includeClosedCases is set without closedFromDate was not checked against the UI request.
- Findings F1 to F4, F6 and F7 were verified against the uncommitted working tree, so they are fixed only until the fixes are committed.

### info (4)

- buildIdSegments now returns one string and buildConsumerTudfRecord spreads it, which splits it into characters that join('') puts back together. It works but is accidental.
- buildThSegment ignores its arguments and returns an empty string, and two consecutive if (row.customerIncomeAmount) blocks could be one. The secondary address category ternary is always RESIDENCE inside its own guard.
- .gitignore now ignores docs/ although docs/ has tracked files, so new docs will not be picked up by git add, and the file ends without a newline.
- formatInterestRate truncates to three decimals instead of rounding, so 8.9999 is reported as 8.999.

---

## howismycommit-1

| Field | Value |
|---|---|
| id | howismycommit-1 |
| generatedAt | 2026-10-30T10:15:11+05:30 |
| author | Dhruv |
| branch | dhruv |
| target.kind | commit |
| target.commit | fb661de5c3c58ba2c01f27844a5e1c666e7fb0e2 |
| files.changed | 8 |
| files.added | 0 |
| files.modified | 8 |
| files.deleted | 0 |
| files.insertions | 263 |
| files.deletions | 50 |
| verdict | request-changes |
| score | 33 |
| quality | poor |
| summary.red | 1 |
| summary.amber | 6 |
| summary.green | 2 |
| summary.info | 4 |
| before | The consumer UCRF report wrote one short TUDF record per loan with simple segment tags, a single phone and ID list, and no old account, income, email or secondary address data. With closed cases included it reported open loans together with loans closed in the chosen window. |
| after | The TUDF builder emits segment-length tags (PN03, ID03, PT03, EC03, PA03, TL04), up to five name fields, several phones, emails, a secondary address, old account number, interest rate and income fields, and the grid shows Account Name-less old account and NREGA/CKYC data. With closed cases included the portfolio filter now returns only closed loans. |

### changeType (2)

- feature
- api

### effects (5)

- UCRF consumer TUDF file content and field order for every reported loan
- UCRF consumer grid and Excel export columns (old account number column key renamed)
- Loan selection for the UCRF report when includeClosedCases is true
- NREGA and CKYC document lookups that depend on two new master document IDs
- generate-ucrf-report requests that set includeClosedCases without closedFromDate now fail with 400

### filesReviewed (8)

| path | change | status | note |
|---|---|---|---|
| .gitignore | modified | green | no issues |
| apps/finnaux-api/src/fixed-cuids.ts | modified | amber | F5 |
| apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts | modified | amber | F3 |
| apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts | modified | amber | F7 |
| apps/finnaux-api/src/reports/ucrf-report/lib/shared/format-utils.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-types.ts | modified | green | no issues |
| apps/finnaux-api/src/reports/ucrf-report/lib/shared/ucrf-ui.types.ts | modified | amber | F6 |
| apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts | modified | red | F1 |

### findings (7)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P1 |
| title | Including closed cases drops every open loan |
| location | apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts:1366 |
| problem | buildLoanPortfolioFilter builds openLoanFilters, returns them only when includeClosedCases is false, and otherwise returns and(...closedLoanFilters). The previous or(open, closed) is gone, so with includeClosedCases=true the open filters are built and thrown away. |
| impact | A report generated with 'include closed cases' contains only closed loans. The live portfolio is missing from the file submitted to the bureau, and the grid shows the wrong set. |
| fix | Return or(and(...openLoanFilters), and(...closedLoanFilters)) when includeClosedCases is true, and import or again. |
| evidence | return and(...closedLoanFilters) as SQL |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | Fixed: the filter returns or(open, closed) when closed cases are included at apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts:1372. |
| needsAttention | false |
| attentionNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P2 |
| title | Loans closed after the reporting date are reported as closed |
| location | apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts:1359 |
| problem | The closed filter no longer has lte(loanCloseDate, reportingDate). It only requires loanCloseDate >= closedFromDate, so a loan closed after the reporting date matches. |
| impact | For a back-dated reporting date, such a loan is written with a closed status code and a Date Closed later than the reporting date, although it was still open on that date. |
| fix | Keep lte(loanApplicationsTable.loanCloseDate, reportingDateSql) in the closed filter next to the gte on closedFromDate. |
| evidence | gte(<br>        loanApplicationsTable.loanCloseDate,<br>        sql`${input.closedFromDate}::date`<br>      ), |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | Fixed: closed loans are bounded to closedFromDate through the reporting date, inclusive, at apps/finnaux-api/src/reports/ucrf-report/ucrf-report.service.ts:1363. |
| needsAttention | false |
| attentionNote | null |

#### findings[3] · F3

| Field | Value |
|---|---|
| id | F3 |
| severity | P2 |
| title | NREGA id gets the string 'null' when last name is empty |
| location | apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts:141 |
| problem | row.lastName is typed string \| null and is concatenated onto the NREGA number with +. A null last name produces '<card>null'. |
| impact | The identifier written to the bureau file is corrupted for any customer with an NREGA card and no last name, and a long card number can be cut by the 30 character limit. |
| fix | Append the last name only when it is present, for example number: row.nregaCard + (row.lastName ?? ''), or confirm with the spec that the name must be appended at all. |
| evidence | ids.push({ type: TUDF_ID_TYPE.NREGA, number: row.nregaCard + row.lastName }) |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | Fixed: the last name is appended only when present at apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts:141. |
| needsAttention | false |
| attentionNote | null |

#### findings[4] · F4

| Field | Value |
|---|---|
| id | F4 |
| severity | P2 |
| title | Field 38 written empty when interest rate is null |
| location | apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts:377 |
| problem | formatInterestRate returns '' for a null rate and buildVarField turns that into the zero-length field '3800'. The field is also gated on noOfInstallments instead of on the rate. |
| impact | Loans with installments but no IRR get an empty field 38 that the bureau can reject, and loans with a rate but no installment count never report it. |
| fix | Gate the field on row.interestRate being present and non-null, not on noOfInstallments. |
| evidence | if (row.noOfInstallments) {<br>    segment += buildVarField('38', formatInterestRate(row.interestRate)) |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | Fixed: field 38 is written whenever a rate exists, not only with installments, at apps/finnaux-api/src/reports/ucrf-report/lib/consumer/tudf-file.builder.ts:378. |
| needsAttention | false |
| attentionNote | null |

#### findings[5] · F5

| Field | Value |
|---|---|
| id | F5 |
| severity | P3 |
| title | New NREGA and CKYC master document ids look like placeholders |
| location | apps/finnaux-api/src/fixed-cuids.ts:204 |
| problem | The two ids follow a sequential pattern unlike the neighbouring generated ids, and nothing else in the repo references them. If no master document row exists with these ids, the lookups always return null. |
| impact | NREGA and CKYC numbers are silently never reported, which looks the same as customers having no such document. |
| fix | Confirm both ids exist in the master documents table (or add the seed) and replace them with the real ids. |
| evidence | NREGA: '01JWZGJ8Q1Y12V3B4N5P6Q7R8S',<br>    CKYC: '01J8F3Y4M5P6Q7R8S9T0V1W2X3', |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:57:53.330Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | true |
| confirmedNote | Confirmed manually: NREGA and CKYC ids exist in the documents table (checked against the project database). |

#### findings[6] · F6

| Field | Value |
|---|---|
| id | F6 |
| severity | P3 |
| title | Grid row DTO not updated for the renamed old account column |
| location | apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts:85 |
| problem | TUcrfConsumerGridRow and UCRF_CONSUMER_GRID_COLUMNS now use oldAccountNumber, but UcrfConsumerGridRowDto still declares only oldAccountNo, so the Swagger schema has no oldAccountNumber field. |
| impact | Clients generated from the API schema do not see the new Old Acc No column key, and oldAccountNo is still sent as a duplicate. |
| fix | Add oldAccountNumber to the DTO and drop the unused oldAccountNo, or keep the old key in the column list. |
| evidence | @ApiProperty({ required: false }) oldAccountNo: string \| null |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | Fixed: the DTO now declares oldAccountNumber at apps/finnaux-api/src/reports/ucrf-report/dto/ucrf-consumer-grid-row.dto.ts:85. |
| needsAttention | false |
| attentionNote | null |

#### findings[7] · F7

| Field | Value |
|---|---|
| id | F7 |
| severity | P3 |
| title | Grid account type lost its default while the file keeps it |
| location | apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts:175 |
| problem | The grid now shows row.cibilAccountTypeCode as is, but the TUDF builder still writes (row.cibilAccountTypeCode ?? '05').padStart(2, '0') at tudf-file.builder.ts:346. |
| impact | For a product with no CIBIL type the grid shows a blank account type while the submitted file says 05, so what the user reviews differs from what is sent. |
| fix | Use the same default and padding in the grid, or remove the default from the file builder. |
| evidence | accountType: row.cibilAccountTypeCode, |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:53:30.679Z |
| resolvedNote | Fixed: the grid applies the same 05 default and two-digit padding at apps/finnaux-api/src/reports/ucrf-report/lib/consumer/ucrf-consumer-grid.mapper.ts:90. |
| needsAttention | false |
| attentionNote | null |

### previousFindings (0)

_Empty._

### checks (3)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit | passed |
| green | bunx oxlint apps libs | passed |
| grey | tests | not run: no test script in package.json and none for the ucrf module |

### gaps (4)

- The TUDF tag layout (PN03, ID03, TL04 and field numbers 18 to 20, 38, 46 to 49) was not checked against the bureau spec or a real sample file.
- Master document rows for the new NREGA and CKYC ids were not checked in the database.
- No tests cover the TUDF builder, so the new segment output was not exercised.
- The change to throw when includeClosedCases is set without closedFromDate was not checked against the UI request.

### info (4)

- buildIdSegments now returns one string and buildConsumerTudfRecord spreads it, which splits it into characters that join('') puts back together. It works but is accidental.
- buildThSegment ignores its arguments and returns an empty string, and two consecutive if (row.customerIncomeAmount) blocks could be one. The secondary address category ternary is always RESIDENCE inside its own guard.
- .gitignore now ignores docs/ although docs/ has tracked files, so new docs will not be picked up by git add, and the file ends without a newline.
- formatInterestRate truncates to three decimals instead of rounding, so 8.9999 is reported as 8.999.

---
