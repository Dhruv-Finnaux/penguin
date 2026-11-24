# 🐧 How Is My Commit · Frontend

> Generated from `data/frontend/howismycommit.json`. Edit the JSON, not this file. 90 entries, newest first.

## howismycommit-90

| Field | Value |
|---|---|
| id | howismycommit-90 |
| generatedAt | 2026-11-24T16:20:33+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 3ef31703b18e086df9a2903e77375604267cfe34 |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 13 |
| files.deletions | 0 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 1 |
| before | In the Finnaux PAN dialog, Verify Now only showed a loading state on the button while the request ran. |
| after | While the verify request is pending, the dialog shows a spinner with 'Verifying PAN'; on error it returns to the form with the typed name kept and an error toast. |

### changeType (1)

- UI

### effects (1)

- Only the Finnaux PAN flow changes. The Surepass flow and shared DirectVerificationFlow are untouched.

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| src/features/external-apis/components/pan-verify/flows/finnaux-pan-flow.tsx | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (0)

_Empty._

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint src/features/external-apis/components/pan-verify/flows/finnaux-pan-flow.tsx | passed |

### gaps (1)

- Not exercised in a browser; the pending-to-error return to the form was verified by reading the code only.

### info (1)

- The earlier reports of the previous five commits have no findings, so there was nothing to re-check. The pending view has no Cancel button; the dialog close button still works.

---

## howismycommit-89

| Field | Value |
|---|---|
| id | howismycommit-89 |
| generatedAt | 2026-11-24T11:38:49+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 0b054e12d9c0fccdc581340732c14ba198238d76 |
| files.changed | 3 |
| files.added | 1 |
| files.modified | 2 |
| files.deleted | 0 |
| files.insertions | 28 |
| files.deletions | 2 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 3 |
| before | The bank forms did not pass the account holder name to verification, kept the IFSC as typed after verifying, and showed nothing about the name match. |
| after | The bank modal and the customer bank tab pass the holder name into verification. After a successful verification the form copies the returned IFSC so it matches the stored verification, shows 'Name match score: N' as small text under the holder name, and adds a 'Name match score' row to the details dialog; nothing is shown when the score is null and there is no warning or Matched flag. |

### changeType (2)

- feature
- UI

### effects (2)

- Add or edit bank modal and the customer bank tab
- The IFSC copy applies to Surepass too, where the returned IFSC equals the typed one, so it changes nothing

### filesReviewed (3)

| path | change | status | note |
|---|---|---|---|
| src/features/customers/components/bank-modal.tsx | modified | green | no issues |
| src/features/customers/components/view-edit-customer/_components/bank-details.tab.tsx | modified | green | no issues |
| src/features/external-apis/bank-name-match.ts | added | green | no issues |

### findings (0)

_Empty._

### previousFindings (0)

_Empty._

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files of both commits> | passed |

### gaps (1)

- Not run in a browser by me; the user tested the Finnaux save end to end.

### info (3)

- The customer bank tab verifies but the saved bank is only updated by the backend (lastVerifiedAt), as before.
- Surepass returns the IFSC it was given (ifscCode: input.ifsc in the backend), so copying it back leaves the Surepass form unchanged.
- isNameMatch stays in the response type but no screen reads it, on purpose, because Finnaux has returned false with score 100.

---

## howismycommit-88

| Field | Value |
|---|---|
| id | howismycommit-88 |
| generatedAt | 2026-11-24T11:38:49+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 39f5fbe6d7f80c9155ec951193f58680f016e4e3 |
| files.changed | 12 |
| files.added | 3 |
| files.modified | 9 |
| files.deleted | 0 |
| files.insertions | 180 |
| files.deletions | 2 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 3 |
| before | Bank account verification only had Surepass flows, so with a Finnaux provider selected the Verify Bank dialog was empty. |
| after | When the Bank Account group's provider is finnaux, both bank flows (the one used by the bank forms and the plain one) open a shared dialog that shows the account number and IFSC read-only, asks for the account holder name, checks the account number is 9 to 18 digits, and calls POST /external/finnaux/bank/verify. Errors toast and keep the dialog open; success passes the row to the existing success handler. |

### changeType (3)

- feature
- API
- UI

### effects (2)

- Add or edit bank modal and the customer bank tab, through the shared Verify trigger (already hidden for users without the 12 page rights when the provider is finnaux)
- Surepass bank verification is unchanged

### filesReviewed (12)

| path | change | status | note |
|---|---|---|---|
| src/features/external-apis/components/common/finnaux-bank-verify-dialog.tsx | added | green | no issues |
| src/features/external-apis/components/bank-customer-verify/flows/finnaux-bank-customer-flow.tsx | added | green | no issues |
| src/features/external-apis/components/bank-verify/flows/finnaux-bank-flow.tsx | added | green | no issues |
| src/features/external-apis/components/bank-customer-verify/context.tsx | modified | green | no issues |
| src/features/external-apis/components/bank-customer-verify/dialog-manager.tsx | modified | green | no issues |
| src/features/external-apis/components/bank-customer-verify/types.ts | modified | green | no issues |
| src/features/external-apis/components/bank-verify/context.tsx | modified | green | no issues |
| src/features/external-apis/components/bank-verify/dialog-manager.tsx | modified | green | no issues |
| src/features/external-apis/components/bank-verify/types.ts | modified | green | no issues |
| src/features/external-apis/api.ts | modified | green | no issues |
| src/features/external-apis/hooks.ts | modified | green | no issues |
| src/features/external-apis/types.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (0)

_Empty._

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files of both commits> | passed |

### gaps (1)

- Not run in a browser by me; the user tested Add bank, Check, Verify Bank, Save with the real backend and it worked.

### info (3)

- The plain bank-verify module (BankVerifyProvider) is not used by any screen today; its Finnaux flow is added for consistency and is untested.
- Account numbers with letters or separators are blocked by the 9 to 18 digit check; the backend rule is the same.
- The 400 validation messages from the backend are arrays; the app shows only the first item, which the dialog's own checks mostly prevent.

---

## howismycommit-87

| Field | Value |
|---|---|
| id | howismycommit-87 |
| generatedAt | 2026-11-24T10:02:02+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | b29dbf753888e3700e522568eca7cc399f42e0e5 |
| files.changed | 4 |
| files.added | 1 |
| files.modified | 3 |
| files.deleted | 0 |
| files.insertions | 49 |
| files.deletions | 5 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 3 |
| before | Verify buttons for Aadhaar, PAN, Driving License and RC always showed when the provider was enabled, so a user without the needed page rights got a 403 from the new backend rights check. |
| after | For the Finnaux provider the shared trigger hides Verify when the user has none of 12 page rights (the 8 customer and LOS pages plus Vendors, Dealers, Branches and Employees); it stays visible while rights load or fail, and other providers are unaffected. |

### changeType (2)

- feature
- security

### effects (3)

- Every screen with a verify button: customer add form, customer KYC tab, identification document modal and the vehicle form
- Up to 12 cached page-rights requests per session, only when the provider is Finnaux, sharing the PermissionGuard cache keys
- Adds five page ids to the frontend config

### filesReviewed (4)

| path | change | status | note |
|---|---|---|---|
| src/config/page-ids.config.ts | modified | green | no issues |
| src/hooks/useGetPageRightsQuery.tsx | modified | green | no issues |
| src/features/external-apis/components/common/verification-trigger.tsx | modified | green | no issues |
| src/features/external-apis/hooks/use-can-run-finnaux-checks.ts | added | green | no issues |

### findings (0)

_Empty._

### previousFindings (0)

_Empty._

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files of the three commits> | passed |

### gaps (2)

- Not run in a browser; not checked with an Admin user or a user without any of the 12 pages.
- The 12-page list must stay equal to the backend's KYC_PAGE_RIGHTS; the new ids were compared with the backend's ids by value.

### info (3)

- Fail-open by design: if every rights request errors, Verify stays visible and the backend still enforces the 403.
- The card Verify RC on a saved vehicle uses the los verify-rc route, not the five checked routes, so it is not hidden.
- Any user whose designation has none of the 12 pages (about 10 staff locally) loses Verify; the form does not require a verified document to save.

---

## howismycommit-86

| Field | Value |
|---|---|
| id | howismycommit-86 |
| generatedAt | 2026-11-24T10:02:02+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | e2707f0574c87825684b9c90734fc5a8f440ecdd |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 11 |
| files.deletions | 9 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 2 |
| before | The customer detail page (/lms/customers/[id]) had no guard and passed add, view, delete, print, export and edit as true to every tab. |
| after | The page needs view on LMS_CUSTOMERS through PermissionGuard and passes the page's real rights to every tab; it renders nothing until the rights are loaded. |

### changeType (2)

- bug fix
- security

### effects (2)

- /lms/customers/[id] for every user: view-only users lose edit and add actions, users without LMS_CUSTOMERS are blocked on a direct URL
- The only link to the page is the LMS customers list, which already needs the same right

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/lms/customers/[id]/page.tsx | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (0)

_Empty._

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files of the three commits> | passed |

### gaps (1)

- Not run in a browser with a view-only user.

### info (2)

- The backend page-rights route returns canView, canAdd, canEdit and canDelete only, so canPrint and canExport are now undefined here; nothing in the customer screens reads them.
- The rights query shares its cache key with PermissionGuard, so no extra request is made.

---

## howismycommit-85

| Field | Value |
|---|---|
| id | howismycommit-85 |
| generatedAt | 2026-11-24T10:02:02+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | fd673bc23696b48006376f5dbef92623dcc5eb76 |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 13 |
| files.deletions | 2 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 2 |
| before | A failed generate or resend OTP call showed the raw backend message, which for the throttle is 'ThrottlerException: Too Many Requests'. |
| after | A 429 on generate or resend shows 'Too many OTP requests. Wait a minute and try again.'; other errors keep showing the backend message with the old fallbacks. |

### changeType (2)

- bug fix
- UI

### effects (1)

- Aadhaar OTP dialog for both Digipehchan and Finnaux (shared flow): generate failure closes the dialog with a toast, resend failure toasts and stays on the OTP step

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| src/features/external-apis/components/aadhar-verify/flows/aadhaar-otp-flow.tsx | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (0)

_Empty._

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files of the three commits> | passed |

### gaps (1)

- Not run in a browser; a real 429 was not triggered.

### info (2)

- The message reads 'OTP requests' even when the 429 comes from the app-wide limit of 100 requests a minute; that is close enough for this dialog.
- Verify-OTP errors keep the plain backend message; only generate and resend are throttled by the 10 a minute limit.

---

## howismycommit-84

| Field | Value |
|---|---|
| id | howismycommit-84 |
| generatedAt | 2026-11-23T18:11:51+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | b10f10d2a05b943c06625406ddf81dd2c70806dc |
| files.changed | 2 |
| files.added | 0 |
| files.modified | 2 |
| files.deleted | 0 |
| files.insertions | 8 |
| files.deletions | 3 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 3 |
| before | The session loan products query called the HRMS employee products endpoint (/hrms/employees/:id/product) and kept the assigned rows, so a user without the HRMS Employees page right got a 403 and an empty product filter. |
| after | The query calls the login-only GET /dropdown/session-employee-product and maps its { label, value } rows to the { name, productId } shape every caller already reads, so no caller changed. |

### changeType (2)

- bug fix
- API

### effects (2)

- useGetSessionLoanProductsQuery has about 12 callers: sales, collections and NBFC dashboard filters, LMS executive assignment, CRM employee assignment tab and form, and the reports filters (collection efficiency, DNBS02, master data, UCRF submission, shared filter options)
- Needs the backend route session-employee-product to be deployed first

### filesReviewed (2)

| path | change | status | note |
|---|---|---|---|
| src/features/session/api.ts | modified | green | no issues |
| src/features/session/queries.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 54b1a822a558cb270ab3b077c5da59a3661672ec | F1 | Dialog offers Copy link for signed or revoked requests | resolved | Still fixed: Copy link, the expiry line and the footnote are gated on showLinks at src/features/loan-application/components/esign-dialog.tsx:450. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint src/features/session/api.ts src/features/session/queries.ts | passed |
| green | grep of every caller of useGetSessionLoanProductsQuery | passed: all read only name and productId from the data |

### gaps (2)

- Not run against a live backend; the new route was read in the API repo (dropdown.controller.ts and dropdown.service.ts) but not called.
- Not checked in the browser: product filters on the dashboards and reports screens.

### info (3)

- Deploy the backend route before this commit; until then every product filter above fails to load.
- The old call listed the manager's products marked per employee; the new route returns the employee's own active assigned products, so a product assigned to the employee but missing from the manager's set now appears. The DNBS02 and UCRF filters preselect every product, so such a product would be preselected there.
- Resolves howismycommit-34, 26 and 17 F1.

---

## howismycommit-83

| Field | Value |
|---|---|
| id | howismycommit-83 |
| generatedAt | 2026-11-23T17:56:55+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 91d89422ee574831dd798f51214245313744876a |
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
| before | Since the External APIs restyle (c18c79f7), every Badge in the app was a rounded rectangle and every table row had lost its keyboard focus outline. |
| after | Badge is rounded-full again and TableRow has focus:outline-primary and last:first:focus:!outline-none back; both files are identical to their state before c18c79f7. |

### changeType (2)

- bug fix
- UI

### effects (2)

- Every screen that uses Badge (about 212 files) and every table that uses TableRow
- The External APIs page badges are pills again

### filesReviewed (2)

| path | change | status | note |
|---|---|---|---|
| src/components/ui/badge.tsx | modified | green | no issues |
| src/components/ui/table.tsx | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 54b1a822a558cb270ab3b077c5da59a3661672ec | F1 | Dialog offers Copy link for signed or revoked requests | resolved | Still fixed: gated on showLinks at src/features/loan-application/components/esign-dialog.tsx:450. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint src/components/ui/badge.tsx src/components/ui/table.tsx | passed |
| green | git diff c18c79f7~1 -- badge.tsx table.tsx | passed: empty, both files match their pre-restyle state |

### gaps (2)

- Not run in a browser; badges and table rows were not looked at across screens.
- Shared components: a visual check of a few screens is advised before the PR.

### info (2)

- No other commit has touched either file since c18c79f7, so nothing built after it depended on the rounded-md badge.
- Resolves howismycommit-46 F1.

---

## howismycommit-82

| Field | Value |
|---|---|
| id | howismycommit-82 |
| generatedAt | 2026-11-23T17:56:55+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 653eb5bc6202fdd03d6f0e5b5d94098f7d9efac0 |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 5 |
| files.deletions | 0 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 2 |
| before | .gitignore did not list .localtrack.md, /.penguin/ or /src/app/(app)/penguin/ (a merge had dropped them). |
| after | The three local-tooling paths are ignored again, so the personal change tracker and any recreated penguin folders cannot be committed by accident. |

### changeType (1)

- config

### effects (1)

- Repository ignore rules only; no source code changes

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| .gitignore | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 54b1a822a558cb270ab3b077c5da59a3661672ec | F1 | Dialog offers Copy link for signed or revoked requests | resolved | Still fixed: gated on showLinks at src/features/loan-application/components/esign-dialog.tsx:450. |

### checks (2)

| status | command | result |
|---|---|---|
| green | git check-ignore -v .localtrack.md .penguin/x 'src/app/(app)/penguin/x' | passed: all three matched .gitignore lines 62-64 |
| green | git ls-files .localtrack.md .penguin src/app/(app)/penguin | passed: none of these paths is tracked |

### gaps (1)

- The patterns were checked with git check-ignore, not by creating the folders.

### info (2)

- Ignoring src/app/(app)/penguin/ also hides a future in-repo penguin page; the panel now lives in the separate penguin repo, so this is intended.
- Fixes the open .gitignore finding from the merge (reviews 36, 25 and 19).

---

## howismycommit-81

| Field | Value |
|---|---|
| id | howismycommit-81 |
| generatedAt | 2026-11-23T17:56:55+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | aecf7b6bee7448f38284baf5264ba45a9fd7da1e |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 11 |
| files.deletions | 6 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 1 |
| before | The signer list in the eSign dialog showed Copy link, the expiry line and the 'links expire' footnote for any signer with an unexpired link, even on signed or revoked requests. |
| after | SignerList takes a showLinks flag (true while the request is pending) and shows those three things only then; names and per-signer status badges still show on every request. |

### changeType (2)

- bug fix
- UI

### effects (1)

- Loan application eSign dialog, signer list only

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| src/features/loan-application/components/esign-dialog.tsx | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 54b1a822a558cb270ab3b077c5da59a3661672ec | F1 | Dialog offers Copy link for signed or revoked requests | resolved | Fixed by this commit: Copy link, the expiry line and the footnote are gated on showLinks at src/features/loan-application/components/esign-dialog.tsx:450, :459 and :480. |
| 300406bfe7a009beb3a82c0f924fa34d35fce820 | F1 | Box coordinate errors are hidden while the box is collapsed | resolved | Still fixed: showFields = isSelected \|\| hasError at src/app/(app)/(main)/configuration/templates/_components/esign-box-fields.tsx:41. |

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <changed .ts/.tsx files> | passed |

### gaps (1)

- Not run in a browser; the dialog was not opened on a signed or revoked document.

### info (1)

- No test command is configured, so the change has no automated test.

---

## howismycommit-80

| Field | Value |
|---|---|
| id | howismycommit-80 |
| generatedAt | 2026-11-23T16:44:08+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | ce6d664dbd3a96e906ce85f3f44af11362b6eba4 |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 20 |
| files.deletions | 2 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 1 |
| before | A signature box's coordinate fields were shown only while the box was selected, so an error on a collapsed box was invisible and Save failed with only a generic toast. |
| after | A box whose coordinates have an error opens by itself, gets a red border and the note 'Fix the position of this box to save'. |

### changeType (2)

- bug fix
- UI

### effects (1)

- Configuration > Templates eSign designer, signature box rows only

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/templates/_components/esign-box-fields.tsx | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 300406bfe7a009beb3a82c0f924fa34d35fce820 | F1 | Box coordinate errors are hidden while the box is collapsed | resolved | Fixed by ce6d664dbd3a96e906ce85f3f44af11362b6eba4: showFields = isSelected \|\| hasError at src/app/(app)/(main)/configuration/templates/_components/esign-box-fields.tsx:41. |

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files of both commits> | passed |

### gaps (1)

- Not run in a browser; the paper-size change that triggers the errors was not reproduced.

### info (1)

- Resolves howismycommit-78 F1.

---

## howismycommit-79

| Field | Value |
|---|---|
| id | howismycommit-79 |
| generatedAt | 2026-11-23T16:44:08+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 54b1a822a558cb270ab3b077c5da59a3661672ec |
| files.changed | 4 |
| files.added | 0 |
| files.modified | 4 |
| files.deleted | 0 |
| files.insertions | 43 |
| files.deletions | 12 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 2 |
| summary.info | 2 |
| before | A failed create or action call left the send panel on the old status (a duplicate send's 409 did not refresh it), a signed document without a file had no retry, and the audit trail and company signer load errors hid the backend's reason. |
| after | Create and action calls refresh the loan application data after success or error; the panel falls back to the document's signer statuses; a signed document without a file shows Check status and a toast when Finnaux still sent no usable file; the audit trail and company signer errors show the backend message. |

### changeType (2)

- bug fix
- UI

### effects (2)

- Loan application document cards, eSign dialog and audit trail dialog
- The Digio upload form also refreshes the data after a failed send

### filesReviewed (4)

| path | change | status | note |
|---|---|---|---|
| src/features/loan-application/components/esign-dialog.tsx | modified | amber | F1 |
| src/features/loan-application/components/esign-utils.ts | modified | green | no issues |
| src/features/loan-application/components/loan-documents.tsx | modified | green | no issues |
| src/features/loan-application/components/esign-audit-trail-dialog.tsx | modified | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Dialog offers Copy link for signed or revoked requests |
| location | src/features/loan-application/components/esign-dialog.tsx:447 |
| problem | The signer list now falls back to the document's esignSignerStatuses, so it shows on any document that has them. SignerList shows Copy link and the expiry line whenever a signer has a signingUrl that has not expired, without checking that the request is still pending. |
| impact | Opening the dialog on a signed document, or one that was revoked, lists signers with Copy link and 'Link expires on ...'; a user can copy a link that no longer works and send it to a customer. |
| fix | Pass whether the request is pending to SignerList and show Copy link and the expiry line only then, as the document card already does. |
| evidence |             {signer.signingUrl && !isExpired && ( |
| status | resolved |
| resolvedIn | aecf7b6bee7448f38284baf5264ba45a9fd7da1e |
| resolvedAt | 2026-11-23T11:20:12.617Z |
| resolvedNote | Fixed in aecf7b6b: SignerList shows Copy link, the expiry line and the footnote only while the request is pending, at src/features/loan-application/components/esign-dialog.tsx:450. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 300406bfe7a009beb3a82c0f924fa34d35fce820 | F1 | Box coordinate errors are hidden while the box is collapsed | resolved | Fixed by ce6d664dbd3a96e906ce85f3f44af11362b6eba4: showFields = isSelected \|\| hasError at src/app/(app)/(main)/configuration/templates/_components/esign-box-fields.tsx:41. |

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files of both commits> | passed |

### gaps (2)

- Not run in a browser; the dialog was not opened on a signed document, the case was found by reading SignerList and the new fallback.
- Send for eSign was not clicked (billed).

### info (2)

- No test command is configured, so the changed behaviour has no automated test.
- Backend confirmed STATUS on a signed document retries the file save, which the new Check status button relies on.

---

## howismycommit-78

| Field | Value |
|---|---|
| id | howismycommit-78 |
| generatedAt | 2026-11-23T16:15:06+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 300406bfe7a009beb3a82c0f924fa34d35fce820 |
| files.changed | 6 |
| files.added | 0 |
| files.modified | 6 |
| files.deleted | 0 |
| files.insertions | 197 |
| files.deletions | 138 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 2 |
| summary.info | 2 |
| before | In the template eSign designer each signer card showed all its boxes' five number inputs at all times, with a row of corner buttons and a text list of controls. |
| after | Boxes are collapsed to a one-line summary and expand to their number fields when selected, corner placement moved into an Add box menu, the toolbar and settings are regrouped, and the designer has a Signers header with an empty state. The commit is already merged to dev (PR #143) and the files are unchanged since. |

### changeType (2)

- UI
- feature

### effects (2)

- Configuration > Templates > eSign designer only
- No change to the save payload or validation rules

### filesReviewed (6)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/templates/_components/esign-box-fields.tsx | modified | amber | F1 |
| src/app/(app)/(main)/configuration/templates/_components/esign-designer-lib.ts | modified | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/esign-designer-toolbar.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/esign-designer.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/esign-settings.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/esign-signer-card.tsx | modified | amber | F1 |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Box coordinate errors are hidden while the box is collapsed |
| location | src/app/(app)/(main)/configuration/templates/_components/esign-box-fields.tsx:58 |
| problem | The five coordinate inputs, which carry the field errors (Must be more than x1, Box goes past the page width), now render only for the selected box. The signer card shows just the array-level message, and the old onFocus selection that let the form's focus-on-error open the box was removed. |
| impact | Draw boxes on A4, switch the paper to A5 or to landscape, and boxes now go past the page; Save is blocked with the generic 'Please fix form errors!' toast, and no box shows what is wrong until the user opens each one. |
| fix | Open (or mark) a box whose coordinates have an error: for example treat a box with a field error as expanded in EsignBoxFields, or show a red 'Fix position' note on its summary line. |
| evidence |       {isSelected && (<br>        <div className="space-y-2 border-t p-3"> |
| status | resolved |
| resolvedIn | ce6d664dbd3a96e906ce85f3f44af11362b6eba4 |
| resolvedAt | 2026-11-23T10:57:42.089Z |
| resolvedNote | Fixed in ce6d664d: a box with a coordinate error is shown expanded with a red border and a note (src/app/(app)/(main)/configuration/templates/_components/esign-box-fields.tsx:41 and :76). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (0)

_Empty._

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <6 changed files> | passed |

### gaps (1)

- Not run in a browser; the hidden-error case was found by reading the schema, the signer card and the box fields, not by reproducing it.

### info (2)

- No test command is configured, so the changed behaviour has no automated test.
- esign-designer-toolbar.tsx uses an arbitrary Tailwind value (sm:grid-cols-[1fr_auto]); AGENTS.md prefers standard classes, but no standard class gives this column split.

---

## howismycommit-77

| Field | Value |
|---|---|
| id | howismycommit-77 |
| generatedAt | 2026-11-23T12:32:58+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 7a2e1acb54ec3b93c1c930e5746d481f36d9e558 |
| files.changed | 3 |
| files.added | 0 |
| files.modified | 3 |
| files.deleted | 0 |
| files.insertions | 210 |
| files.deletions | 16 |
| verdict | review-with-caution |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 2 |
| before | Document cards showed only the overall eSign status, the Send panel had no company signer, and signer statuses in the dialog were plain text. |
| after | Cards list each signer from esignSignerStatuses with a badge (green Signed, red Rejected) and Copy link while pending and not expired; the Send panel shows the company signer line or toggle when the template has a Company box and sends companySigner; the dialog notes that links expire after 48 hours. |

### changeType (3)

- feature
- UI
- API

### effects (2)

- Loan application Document Attachments cards and eSign dialog
- New call GET /los/loan-application/:id/esign/company-signers

### filesReviewed (3)

| path | change | status | note |
|---|---|---|---|
| src/features/loan-application/components/esign-dialog.tsx | modified | green | no issues |
| src/features/loan-application/components/esign-utils.ts | modified | green | no issues |
| src/features/loan-application/components/loan-documents.tsx | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| e92ca8cc4f3c5d3916dceefebcd5a7c5db91d9e3 | F1 | Loan product form treats unknown provider as Digio | resolved | Fixed by 9896da192f42e8ccd1be73bf5b7f30f83942289b: LoadingErrorView waits for the provider at src/app/(app)/(main)/configuration/loan-products/[id]/_tabs/product-document.tab/_tabs/loan.tab.tsx:131. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files of the three commits> | passed |
| grey | tests | not run: no test command configured in package.json |

### gaps (1)

- Not run in a browser or against the live company-signers endpoint; Send for eSign was not clicked (billed).

### info (2)

- Send is disabled until the company signers load, with a retry if they fail.
- The 48-hour expiry is a fixed constant (ESIGN_LINK_VALID_HOURS); the per-signer expiresAt from the backend still decides when Copy link hides.

---

## howismycommit-76

| Field | Value |
|---|---|
| id | howismycommit-76 |
| generatedAt | 2026-11-23T12:32:58+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 4e66ecaf1402da0efb2e0a370a59997d2a0f2bdd |
| files.changed | 9 |
| files.added | 0 |
| files.modified | 9 |
| files.deleted | 0 |
| files.insertions | 116 |
| files.deletions | 21 |
| verdict | review-with-caution |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 2 |
| before | Template signature boxes were assigned by position (Signer 1 = applicant, then co-applicants, then guarantors), with at most 6 signers. |
| after | Every signer card has a required Role (Borrower, Co-borrower, Guarantor, Company); exactly one Borrower and at most one Company are enforced, up to 10 boxes, and cards and boxes are labelled by role (B, CB1, G1, C). |

### changeType (2)

- feature
- UI

### effects (2)

- Configuration > Templates eSign designer
- Template save payload now includes esignSigners[].role (required by the backend)

### filesReviewed (9)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/templates/_components/esign-designer-lib.ts | modified | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/esign-designer.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/esign-page-preview.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/esign-schema.ts | modified | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/esign-signer-card.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/use-esign-signers.ts | modified | green | no issues |
| src/config/fixed-enums.ts | modified | green | no issues |
| src/features/configurations/templates/esign.ts | modified | green | no issues |
| src/features/configurations/templates/types.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| e92ca8cc4f3c5d3916dceefebcd5a7c5db91d9e3 | F1 | Loan product form treats unknown provider as Digio | resolved | Fixed by 9896da192f42e8ccd1be73bf5b7f30f83942289b: LoadingErrorView waits for the provider at src/app/(app)/(main)/configuration/loan-products/[id]/_tabs/product-document.tab/_tabs/loan.tab.tsx:131. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files of the three commits> | passed |
| grey | tests | not run: no test command configured in package.json |

### gaps (1)

- Not run in a browser; not saved against the backend role validation.

### info (2)

- Ship together with the backend role change: the backend requires role on every box, and old templates must pick a role before they can be saved.
- If an old template already has two Borrower cards, the Borrower option is hidden on both; the 'exactly one borrower' error guides the fix.

---

## howismycommit-75

| Field | Value |
|---|---|
| id | howismycommit-75 |
| generatedAt | 2026-11-23T12:32:58+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 9896da192f42e8ccd1be73bf5b7f30f83942289b |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 14 |
| files.deletions | 2 |
| verdict | review-with-caution |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 1 |
| before | The loan product Documents tab read only isFinnaux, so while the eSign provider setting was loading or failed it behaved as Digio. |
| after | The tab waits for both the documents and the provider setting, shows a retry with a specific message if either fails, and only then renders cards and the edit form. |

### changeType (2)

- bug fix
- UI

### effects (1)

- Configuration > Loan Products > Documents > Loan

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/loan-products/[id]/_tabs/product-document.tab/_tabs/loan.tab.tsx | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| e92ca8cc4f3c5d3916dceefebcd5a7c5db91d9e3 | F1 | Loan product form treats unknown provider as Digio | resolved | Fixed by 9896da192f42e8ccd1be73bf5b7f30f83942289b: LoadingErrorView waits for the provider at src/app/(app)/(main)/configuration/loan-products/[id]/_tabs/product-document.tab/_tabs/loan.tab.tsx:131. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files of the three commits> | passed |
| grey | tests | not run: no test command configured in package.json |

### gaps (1)

- Not run in a browser.

### info (1)

- Resolves howismycommit-72 F1.

---

## howismycommit-74

| Field | Value |
|---|---|
| id | howismycommit-74 |
| generatedAt | 2026-11-23T10:39:40+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | a18d3cd1e42a4c352770afc60cf0507bd098708b |
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
| summary.info | 1 |
| before | Saving an integration group sent apiGroupKey as the selected group's name, or null when none was selected. |
| after | apiGroupKey is sent only when a group is selected and is optional in UpdateExternalApiBody, matching the backend DTO (@IsOptional apiGroupKey?: string). |

### changeType (2)

- bug fix
- API

### effects (1)

- Configuration > External APIs: integration group save request body only

### filesReviewed (2)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx | modified | green | no issues |
| src/features/configurations/external-apis/types.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| e92ca8cc4f3c5d3916dceefebcd5a7c5db91d9e3 | F1 | Loan product form treats unknown provider as Digio | open | Still present: src/app/(app)/(main)/configuration/loan-products/[id]/_tabs/product-document.tab/_tabs/loan.tab.tsx:118 reads only isFinnaux from useIsFinnauxEsign. |

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <2 changed files> | passed |

### gaps (1)

- Not run in a browser; behaviour is unchanged because the backend skips the lookup for both a missing and a null apiGroupKey (external-apis.service.ts:289).

### info (1)

- No behaviour change for users; the request body is cleaner and matches the backend DTO.

---

## howismycommit-73

| Field | Value |
|---|---|
| id | howismycommit-73 |
| generatedAt | 2026-11-21T13:15:14+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 46b5f8b431d6c7c1fb5412cf24e1c4542a180591 |
| files.changed | 4 |
| files.added | 1 |
| files.modified | 3 |
| files.deleted | 0 |
| files.insertions | 404 |
| files.deletions | 19 |
| verdict | review-with-caution |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 2 |
| before | Loan application documents had no audit trail view, always followed the global eSign provider, counted a document as done only when files were uploaded, and the Digio upload asked for confirmation. |
| after | Signed Finnaux documents get View audit trail (card link, menu and eSign dialog) opening a mapped modal with refresh and print; open requests follow the document's own esignProvider; a signed document counts as complete; the Digio upload sends on one click. |

### changeType (3)

- feature
- UI
- API

### effects (2)

- Loan application Document Attachments cards, eSign dialog and per-process counts
- New calls to GET /los/loan-application/:id/esign/audit-trail (refresh=true asks Finnaux again)

### filesReviewed (4)

| path | change | status | note |
|---|---|---|---|
| src/features/loan-application/components/esign-audit-trail-dialog.tsx | added | green | no issues |
| src/features/loan-application/components/esign-dialog.tsx | modified | green | no issues |
| src/features/loan-application/components/esign-utils.ts | modified | green | no issues |
| src/features/loan-application/components/loan-documents.tsx | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 82bef66d681c604ef0227e6b463b44058f8d716c | F1 | Provider lookup failure falls back to Digio UI | resolved | Still fixed at src/features/loan-application/components/esign-dialog.tsx:95. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files of both commits> | passed |
| grey | tests | not run: no test command configured in package.json |

### gaps (1)

- The audit trail modal was not opened against real backend data in this review; the user confirmed the documents response carries esignProvider FINNAUX.

### info (2)

- The audit trail is stored by the backend only when a STATUS call returns signed; automatic storage without a click is a backend request, not a frontend defect.
- Each Refresh in the modal calls Finnaux again and may be billed.

---

## howismycommit-72

| Field | Value |
|---|---|
| id | howismycommit-72 |
| generatedAt | 2026-11-21T13:15:14+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | e92ca8cc4f3c5d3916dceefebcd5a7c5db91d9e3 |
| files.changed | 4 |
| files.added | 1 |
| files.modified | 3 |
| files.deleted | 0 |
| files.insertions | 182 |
| files.deletions | 19 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 2 |
| summary.info | 2 |
| before | The loan product Documents form only had Enable E-Sign and a required print-friendly template; Digio's sign mode, coordinates, receivers and channel could not be edited, and saving sent none of them. |
| after | When Digio is the selected eSign provider, the form shows the four Digio settings (receivers required, coordinates JSON for CUSTOM) and does not require a template. Every save sends each document's Digio settings so stored values are kept; Finnaux keeps the template rule and card warnings. |

### changeType (2)

- bug fix
- UI

### effects (2)

- Configuration > Loan Products > Documents > Loan: edit form, save payload and cards
- Adds FIXED_ENUMS.LOAN_DOCUMENT_PRIMARY_NOTIFICATION_CHANNEL and ESIGN_PROVIDER

### filesReviewed (4)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/loan-products/[id]/_tabs/product-document.tab/_tabs/loan.tab.tsx | modified | amber | F1 |
| src/app/(app)/(main)/configuration/loan-products/[id]/_tabs/product-document.tab/_tabs/_components/digio-esign-fields.tsx | added | green | no issues |
| src/config/fixed-enums.ts | modified | green | no issues |
| src/features/configurations/loan-products/types.ts | modified | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Loan product form treats unknown provider as Digio |
| location | src/app/(app)/(main)/configuration/loan-products/[id]/_tabs/product-document.tab/_tabs/loan.tab.tsx:118 |
| problem | The form reads only isFinnaux from useIsFinnauxEsign. While the external APIs config is loading, or when it fails to load, isFinnaux is false, so the form behaves as if Digio were selected. |
| impact | With Finnaux selected but the config request slow or failing, the edit dialog shows the Digio settings, requires a notification receiver and skips the template check; the user is asked for the wrong fields (the backend still enforces the template rule). |
| fix | Use isLoading/isError from useIsFinnauxEsign: wait or show a retry before rendering the eSign part of the form, as the eSign dialog already does. |
| evidence |   const { isFinnaux } = useIsFinnauxEsign() |
| status | resolved |
| resolvedIn | 9896da192f42e8ccd1be73bf5b7f30f83942289b |
| resolvedAt | 2026-11-23T07:02:58.467Z |
| resolvedNote | Fixed in 9896da19: the Documents tab waits for the eSign provider (isLoading/isError with retry) before rendering cards or the form at src/app/(app)/(main)/configuration/loan-products/[id]/_tabs/product-document.tab/_tabs/loan.tab.tsx:131. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 82bef66d681c604ef0227e6b463b44058f8d716c | F1 | Provider lookup failure falls back to Digio UI | resolved | Still fixed: the eSign dialog waits on isLoading/isError with a retry at src/features/loan-application/components/esign-dialog.tsx:95. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files of both commits> | passed |
| grey | tests | not run: no test command configured in package.json |

### gaps (1)

- Not run in a browser; not checked that the backend DTO accepts the Digio fields again (contract section 1.1).

### info (2)

- If the backend still strips eSignMode, signCoordinates, notificationReceivers and primaryNotificationChannel, saves succeed but Digio settings are not stored.
- The files are unchanged since this commit.

---

## howismycommit-71

| Field | Value |
|---|---|
| id | howismycommit-71 |
| generatedAt | 2026-11-20T18:11:52+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | f799f4c57cbe0854be815c558449eaec2834901a |
| files.changed | 3 |
| files.added | 0 |
| files.modified | 3 |
| files.deleted | 0 |
| files.insertions | 16 |
| files.deletions | 8 |
| verdict | review-with-caution |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 3 |
| summary.info | 2 |
| before | If GET /configuration/external-apis was loading or failed, the eSign dialog treated the provider as Digio and showed the upload form, and the documents card offered Digio actions. |
| after | The provider hook reports isError, isKnown and refetch. The dialog shows an error with Retry when the lookup fails, and the card hides E-Sign and Check E-Sign Status until the provider is known; the status badge still shows. |

### changeType (2)

- bug fix
- UI

### effects (1)

- Loan application > Documents cards and the eSign dialog only

### filesReviewed (3)

| path | change | status | note |
|---|---|---|---|
| src/features/loan-application/components/esign-dialog.tsx | modified | green | no issues |
| src/features/loan-application/components/esign-utils.ts | modified | green | no issues |
| src/features/loan-application/components/loan-documents.tsx | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 82bef66d681c604ef0227e6b463b44058f8d716c | F1 | Provider lookup failure falls back to Digio UI | resolved | Verified fixed: the dialog passes isError with a Retry at src/features/loan-application/components/esign-dialog.tsx:74 and the card gates actions on canUseEsign at src/features/loan-application/components/loan-documents.tsx:357. |

### checks (4)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <3 files in the commit> | passed |
| green | git diff f799f4c5 -- <files>; git status | passed: working tree clean, review describes the committed code |
| grey | tests | not run: no test command configured in package.json |

### gaps (1)

- Not run in a browser; the error and Retry state was not seen on screen.

### info (2)

- With TanStack Query v5, a failed background refetch sets isError even when earlier data exists, so the dialog may show the error instead of usable data; this errs on the safe side.
- The 5 earlier commits checked include merge d9cc958b, which has no report.

---

## howismycommit-70

| Field | Value |
|---|---|
| id | howismycommit-70 |
| generatedAt | 2026-11-20T18:05:29+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 7d2edc61e46bbb41e3740218e0f757640bafde4c |
| files.changed | 2 |
| files.added | 0 |
| files.modified | 2 |
| files.deleted | 0 |
| files.insertions | 87 |
| files.deletions | 154 |
| verdict | review-with-caution |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 3 |
| summary.info | 2 |
| before | The loan product document form had E-Sign Mode, Sign Coordinates (JSON), Notification Receivers and Primary Notification Channel, did not require a template for eSign, and saved every document with all its fields spread in. |
| after | The form has Should Ask, Must Ask, Process, one print-friendly Template and Enable E-Sign; a template is required when eSign is on. Every document is saved as exactly { id, shouldAsk, mustAsk, processId, templateIds, isEsignEnabled }, and cards show the template name plus ESIGN READY or a warning (no template, not print friendly, no signature boxes). |

### changeType (3)

- refactor
- UI
- API

### effects (2)

- Configuration > Loan Products > Documents > Loan tab
- PUT .../documents/loan-documents body shape for every document of the product

### filesReviewed (2)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/loan-products/[id]/_tabs/product-document.tab/_tabs/loan.tab.tsx | modified | green | no issues |
| src/features/configurations/loan-products/types.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (3)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 82bef66d681c604ef0227e6b463b44058f8d716c | F1 | Provider lookup failure falls back to Digio UI | open | Still present at src/features/loan-application/components/esign-dialog.tsx:72. |
| 291a2d8f9cd2ad01597c39b6b75ef19f412cccf0 | F1 | Conflict and PR steps use bun, but this repo uses npm | resolved | Still fixed: CONTRIBUTING.md:65 uses package-lock.json and npm install. |
| 291a2d8f9cd2ad01597c39b6b75ef19f412cccf0 | F2 | PR checklist points to drizzle/ and DATABASE.md that do not exist here | resolved | Still fixed: no drizzle or DATABASE.md reference in CONTRIBUTING.md (PR checklist at CONTRIBUTING.md:83). |

### checks (4)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <2 files in the commit> | passed |
| green | compare with backend UpdateLoanDocumentDto in ../FINNAUX2.0-API | passed: body fields match (id, shouldAsk, mustAsk, processId ULID optional, templateIds max 1, isEsignEnabled) |
| grey | tests | not run: no test command configured in package.json |

### gaps (1)

- Not run in a browser; the template-required error placement under the Template field was not seen on screen.

### info (2)

- The backend's Digio flow still reads eSignMode, signCoordinates and notificationReceivers (esign.service.ts:164); existing values stay but can no longer be edited here, as the contract asks.
- Documents without a process are now sent with processId null instead of the field being omitted; the DTO allows it (IsOptional).

---

## howismycommit-69

| Field | Value |
|---|---|
| id | howismycommit-69 |
| generatedAt | 2026-11-20T18:05:11+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 82bef66d681c604ef0227e6b463b44058f8d716c |
| files.changed | 3 |
| files.added | 1 |
| files.modified | 2 |
| files.deleted | 0 |
| files.insertions | 532 |
| files.deletions | 125 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 3 |
| summary.info | 3 |
| before | Every loan application document showed E-Sign, which always opened a Digio upload dialog; the status badge compared against 'requested' and 'completed', which the backend never sends, so Check E-Sign Status never appeared. |
| after | E-Sign shows only when isEsignEnabled is true. With Finnaux selected, the dialog shows the template settings and Send for eSign (confirm first, disabled while running), then signers with Copy link and expiry, plus Check status, Resend and Revoke while pending. Other providers keep the Digio upload. Statuses map to Not sent, Waiting for signature, Signed and Failed, revoked or expired. |

### changeType (3)

- feature
- UI
- API

### effects (3)

- Loan application > Documents cards for every process
- Calls GET /configuration/external-apis to decide Finnaux vs Digio
- Digio upload now goes through useFormFlow, which adds its default confirmation

### filesReviewed (3)

| path | change | status | note |
|---|---|---|---|
| src/features/loan-application/components/esign-dialog.tsx | modified | amber | F1 |
| src/features/loan-application/components/esign-utils.ts | added | green | no issues |
| src/features/loan-application/components/loan-documents.tsx | modified | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Provider lookup failure falls back to Digio UI |
| location | src/features/loan-application/components/esign-dialog.tsx:72 |
| problem | useIsFinnauxEsign returns false while GET /configuration/external-apis is loading or when it fails, and the dialog passes isError={false}, so a failed lookup shows the Digio upload form. The card also uses the Digio Check E-Sign Status path until the lookup finishes. |
| impact | If that request fails while Finnaux is the active provider, the user uploads a file and the backend creates a billed Finnaux request (it ignores documentUrl), but the dialog shows no template, signers or links and closes. |
| fix | Expose isError from useIsFinnauxEsign, pass it to LoadingErrorView, and hide the E-Sign actions on the card until the provider is known. |
| evidence | <LoadingErrorView isLoading={isLoading} isError={false}> |
| status | resolved |
| resolvedIn | f799f4c57cbe0854be815c558449eaec2834901a |
| resolvedAt | 2026-11-20T12:38:10.552Z |
| resolvedNote | Fixed in f799f4c5: the dialog shows an error with Retry when the provider lookup fails (src/features/loan-application/components/esign-dialog.tsx:74), and the card hides E-Sign and Check E-Sign Status until the provider is known (src/features/loan-application/components/loan-documents.tsx:357). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 291a2d8f9cd2ad01597c39b6b75ef19f412cccf0 | F1 | Conflict and PR steps use bun, but this repo uses npm | resolved | Still fixed: CONTRIBUTING.md:65 uses package-lock.json and npm install. |
| 291a2d8f9cd2ad01597c39b6b75ef19f412cccf0 | F2 | PR checklist points to drizzle/ and DATABASE.md that do not exist here | resolved | Still fixed: no drizzle or DATABASE.md reference in CONTRIBUTING.md (PR checklist at CONTRIBUTING.md:83). |

### checks (4)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <3 files in the commit> | passed |
| green | compare with backend esign service, DTOs and documents list in ../FINNAUX2.0-API | passed: create/action bodies, response shape, status values, Finnaux group id and isEsignEnabled/templates[] fields match |
| grey | tests | not run: no test command configured in package.json |

### gaps (2)

- Not run in a browser and no eSign request was sent (each create call is billed).
- Where Finnaux returns the signed PDF is not confirmed by the backend, so esignedFileUrl may stay null after signing; the dialog then says the file is not available yet.

### info (3)

- Behaviour change: documents without Enable E-Sign in the loan product no longer show E-Sign, including Digio setups that relied on it; this follows the contract.
- The signer list is empty when the dialog is reopened until Check status is clicked, because the documents list does not return signers.
- The Digio upload now asks for confirmation before creating the request (useFormFlow default).

---

## howismycommit-68

| Field | Value |
|---|---|
| id | howismycommit-68 |
| generatedAt | 2026-11-20T18:04:50+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 5298c5ce28b75b7dc0a838de864e8278cbede18c |
| files.changed | 25 |
| files.added | 16 |
| files.modified | 9 |
| files.deleted | 0 |
| files.insertions | 1372 |
| files.deletions | 25 |
| verdict | review-with-caution |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 4 |
| summary.info | 4 |
| before | The template form had name, description, channel checkboxes, SMS fields and the content editor, with no eSign settings. |
| after | When Print friendly is on, the form shows paper size, orientation, sign pages, page numbers, Aadhaar name check and a designer that draws up to 6 signers' boxes on the template's real PDF (pdfjs-dist) or a blank page, validated as integer, top-left-origin PDF points inside the page. |

### changeType (3)

- feature
- UI
- dependency

### effects (3)

- Configuration > Templates create and edit pages
- New dependency pdfjs-dist, loaded only by the designer through a dynamic import
- Shared eSign enums, the Finnaux eSign API group id and template types used by later commits

### filesReviewed (25)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/templates/_components/template-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/esign-schema.ts | added | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/template-schema.ts | added | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/esign-designer.tsx | added | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/esign-page-preview.tsx | added | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/pdf-page-canvas.tsx | added | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/use-esign-pdf-preview.ts | added | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/use-esign-drawing.ts | added | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/esign-designer-lib.ts | added | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/use-esign-signers.ts | added | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/esign-signer-card.tsx | added | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/esign-box-fields.tsx | added | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/esign-designer-toolbar.tsx | added | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/esign-settings.tsx | added | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/preview-loan-application-picker.tsx | added | green | no issues |
| src/app/(app)/(main)/configuration/templates/_components/use-element-width.ts | added | green | no issues |
| src/features/configurations/templates/esign.ts | added | green | no issues |
| src/features/configurations/templates/types.ts | modified | green | no issues |
| src/features/configurations/templates/api.ts | modified | green | no issues |
| src/features/configurations/templates/hooks.ts | modified | green | no issues |
| src/features/configurations/templates/queries.ts | modified | green | no issues |
| src/config/fixed-enums.ts | modified | green | no issues |
| src/config/external-api-ids.ts | modified | green | no issues |
| package.json | modified | green | no issues |
| package-lock.json | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 291a2d8f9cd2ad01597c39b6b75ef19f412cccf0 | F1 | Conflict and PR steps use bun, but this repo uses npm | resolved | Still fixed: CONTRIBUTING.md:65 uses package-lock.json and npm install. |
| 291a2d8f9cd2ad01597c39b6b75ef19f412cccf0 | F2 | PR checklist points to drizzle/ and DATABASE.md that do not exist here | resolved | Still fixed: no drizzle or DATABASE.md reference in CONTRIBUTING.md (PR checklist at CONTRIBUTING.md:83). |

### checks (5)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <23 .ts/.tsx files in the commit> | passed |
| green | npx next build | passed; pdf.worker.min.mjs emitted as a static asset |
| green | compare with backend DTO, enums and the templates pdf route in ../FINNAUX2.0-API | passed: field names, enum values, 6-signer limit, integer 0-2000 boxes, page-number regex and the PDF paper size all match |
| grey | tests | not run: no test command configured in package.json |

### gaps (2)

- Not run in a browser: drawing, quick-place, PDF rendering and the loan application picker were not exercised.
- The PDF preview depends on a saved template and a real loan application; not tried against the live backend.

### info (4)

- The preview PDF is rendered by the backend at the saved paper size and stretched to the form's paper size; after changing paper size or orientation, save before trusting box positions (the UI says so).
- The picker reuses SearchLoanApplicationModal, which only lists PENDING applications and assumes every row has a borrower; that pre-existing bug is now reachable from Configuration > Templates.
- Boxes are not checked against the PDF's real page count or esignSignPageNumbers; new boxes default to page 0 (every signing page).
- Templates that are not print friendly still send the eSign fields with defaults; the backend ignores them (IgnoreIf isPrintFriendly).

---

## howismycommit-67

| Field | Value |
|---|---|
| id | howismycommit-67 |
| generatedAt | 2026-11-19T12:01:37+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 2f3cf8b22404401027edcd92c46b04843078d5af |
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
| before | feat/external-apis held the five external-apis commits and the two CONTRIBUTING.md commits on top of 06445bee. |
| after | Local dev (88924e6a, the release merge of PR #137 into main) is merged in. The resulting tree is identical to ee69d81d, so no file changes. |

### changeType (1)

- merge

### effects (1)

- Branch history only: the PR from feat/external-apis into dev will also carry 88924e6a and the main history behind it

### filesReviewed (0)

_Empty._

### findings (0)

_Empty._

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 291a2d8f9cd2ad01597c39b6b75ef19f412cccf0 | F1 | Conflict and PR steps use bun, but this repo uses npm | resolved | Still fixed: CONTRIBUTING.md:65 uses package-lock.json and npm install. |
| 291a2d8f9cd2ad01597c39b6b75ef19f412cccf0 | F2 | PR checklist points to drizzle/ and DATABASE.md that do not exist here | resolved | Still fixed: no drizzle or DATABASE.md reference in CONTRIBUTING.md (PR checklist at CONTRIBUTING.md:83). |

### checks (2)

| status | command | result |
|---|---|---|
| green | git diff 2f3cf8b2^1 2f3cf8b2 | passed: empty, the merge changes no files |
| green | git show --cc 2f3cf8b2 | passed: no conflict resolution in the merge |

### gaps (1)

- No fetch was run, so origin/dev may be newer than the local ref (06445bee).

### info (3)

- The reflog shows main was pulled, local dev was fast-forwarded to main (88924e6a), and that dev was merged here. CONTRIBUTING.md says to sync with git merge origin/dev; merging main into dev is meant to be a main to dev back-merge PR.
- 88924e6a is already on origin/main and origin/feat/external-apis; the local ref origin/dev still points to 06445bee.
- Since main and dev had the same content, nothing is lost or duplicated, but the feat/external-apis PR into dev will also act as the main to dev back-merge.

---

## howismycommit-66

| Field | Value |
|---|---|
| id | howismycommit-66 |
| generatedAt | 2026-11-19T11:33:44+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | ee69d81d66318faf8564cc1e2a2193996fd50d28 |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 5 |
| files.deletions | 6 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 1 |
| before | CONTRIBUTING.md told contributors to resolve bun.lock conflicts with bun install, run bun lint and bunx tsc, and add drizzle/ migrations described in DATABASE.md, none of which exist in this npm-based frontend repo. |
| after | Lockfile conflicts use package-lock.json and npm install, the merge and PR checks use npm run lint, npm run build and npx tsc --noEmit, and the backend-only drizzle/DATABASE.md line is gone. |

### changeType (1)

- docs

### effects (1)

- Team workflow docs only; the local /commitforme skill reminder now matches it

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| CONTRIBUTING.md | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (3)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 291a2d8f9cd2ad01597c39b6b75ef19f412cccf0 | F1 | Conflict and PR steps use bun, but this repo uses npm | resolved | Verified fixed by this commit: CONTRIBUTING.md:65 uses package-lock.json and npm install, and CONTRIBUTING.md:86 uses npm run lint, npm run build and npx tsc --noEmit. |
| 291a2d8f9cd2ad01597c39b6b75ef19f412cccf0 | F2 | PR checklist points to drizzle/ and DATABASE.md that do not exist here | resolved | Verified fixed by this commit: no drizzle or DATABASE.md reference remains in CONTRIBUTING.md (Before opening a PR list at CONTRIBUTING.md:83). |
| 96a421d2e090e09664350dccb0d18263912fc883 | F1 | RC address save needs Customer Address add rights | resolved | Still fixed: the modal saves through the rc-address route at src/features/loan-application/tabs/assets-vehicle/hooks.ts:160. |

### checks (2)

| status | command | result |
|---|---|---|
| green | grep -iE 'bun\|drizzle\|DATABASE' CONTRIBUTING.md | passed: no matches; package-lock.json exists |
| green | npx prettier --check CONTRIBUTING.md | passed |

### gaps (1)

- The npm commands were not run as part of this review; npm run build also runs tsc --noEmit through prebuild outside production.

### info (1)

- The working tree is clean; CONTRIBUTING.md is unchanged since this commit.

---

## howismycommit-65

| Field | Value |
|---|---|
| id | howismycommit-65 |
| generatedAt | 2026-11-19T11:27:09+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 291a2d8f9cd2ad01597c39b6b75ef19f412cccf0 |
| files.changed | 1 |
| files.added | 1 |
| files.modified | 0 |
| files.deleted | 0 |
| files.insertions | 159 |
| files.deletions | 0 |
| verdict | review-with-caution |
| score | 92 |
| commitScore | 92 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 0 |
| summary.info | 2 |
| before | The frontend repo had no contribution guide. |
| after | CONTRIBUTING.md documents branches (no direct commits to dev or main), feature branch flow, syncing with dev, conflict resolution, PR checks, merge-commit policy, releases, hotfixes and the category(scope): message commit convention. |

### changeType (1)

- docs

### effects (2)

- Team workflow only; no runtime code changes
- The local /commitforme skill reads this file and follows it

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| CONTRIBUTING.md | added | amber | F1 |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Conflict and PR steps use bun, but this repo uses npm |
| location | CONTRIBUTING.md:65 |
| problem | The guide tells contributors to resolve lockfile conflicts with bun.lock and bun install, and to run bun lint / bunx tsc. This repo has package-lock.json and no bun.lock, and CLAUDE.md lists npm commands. |
| impact | During a merge conflict, `git checkout origin/dev -- bun.lock` fails, package-lock.json conflicts get no guidance, and running bun install can add a stray bun.lock to the diff. |
| fix | Use package-lock.json, npm install, npm run lint, npm run build and npx tsc --noEmit (or state that bun is required and add bun.lock). |
| evidence | 3. `bun.lock` conflicts: do not edit by hand. Take dev's version and reinstall:<br>   git checkout origin/dev -- bun.lock<br>   bun install |
| status | resolved |
| resolvedIn | ee69d81d66318faf8564cc1e2a2193996fd50d28 |
| resolvedAt | 2026-11-19T05:59:11.039Z |
| resolvedNote | Fixed in ee69d81d: the conflict and PR steps now use package-lock.json, npm install, npm run lint/build and npx tsc --noEmit at CONTRIBUTING.md:65 and CONTRIBUTING.md:86. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | PR checklist points to drizzle/ and DATABASE.md that do not exist here |
| location | CONTRIBUTING.md:87 |
| problem | The PR checklist requires schema migrations in drizzle/ and links DATABASE.md and db:push. Neither drizzle/ nor DATABASE.md exists in this frontend repo; the line appears copied from the API repo. |
| impact | Contributors follow a check that cannot apply here and a broken reference, which makes the real checklist easier to skip. |
| fix | Remove the line from the frontend guide, or replace it with a frontend-specific check. |
| evidence | - Schema changes come with a migration in `drizzle/` (see `DATABASE.md`). Never `db:push`. |
| status | resolved |
| resolvedIn | ee69d81d66318faf8564cc1e2a2193996fd50d28 |
| resolvedAt | 2026-11-19T05:59:11.039Z |
| resolvedNote | Fixed in ee69d81d: the drizzle/ and DATABASE.md line is removed from the PR checklist at CONTRIBUTING.md:83-87. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 96a421d2e090e09664350dccb0d18263912fc883 | F1 | RC address save needs Customer Address add rights | resolved | Still fixed: the modal saves through the rc-address route at src/features/loan-application/tabs/assets-vehicle/hooks.ts:160. |
| 8e06b64e2455f4dd1c36daff937b53b53155d46d | F1 | Finnaux DL error bypasses the axios message normalisation | resolved | Still fixed: onFailure(error?.message \|\| ...) at src/features/external-apis/components/dl-verify/flows/finnaux-dl-flow.tsx:35. |

### checks (2)

| status | command | result |
|---|---|---|
| grey | npx tsc --noEmit / npx eslint | not run: the commit changes only a Markdown file |
| grey | ls drizzle DATABASE.md; ls *lock* | not run as a pass/fail check: used as evidence; drizzle/ and DATABASE.md are missing, only package-lock.json exists |

### gaps (1)

- The branch, merge and release policies were not checked against the GitHub repository settings (branch protection, disabled squash merge, CODEOWNERS).

### info (2)

- The local /commitforme skill's reply also quotes bun lint / bun run build / bunx tsc; update it together with F1.
- The commit is on feat/external-apis, which matches the guide's own rule against committing on dev.

---

## howismycommit-64

| Field | Value |
|---|---|
| id | howismycommit-64 |
| generatedAt | 2026-11-19T11:03:05+05:30 |
| author | Dhruv |
| branch | dev |
| target.kind | commit |
| target.commit | f17bc85dc5248b877ce13b335fdfb995a4257323 |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 11 |
| files.deletions | 1 |
| verdict | review-with-caution |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 2 |
| before | The External APIs credentials form treated saved keys as unreadable only when the error message equalled 'Stored external API credentials are invalid'. |
| after | It first checks for errorCode CREDENTIALS_UNREADABLE in the axios error response, then falls back to the same exact message, so behaviour is unchanged until the backend sends the code. |

### changeType (1)

- bug fix

### effects (1)

- Configuration > External APIs credentials modal: which load failures show 'enter every key again' instead of the blocking Retry box

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 8e06b64e2455f4dd1c36daff937b53b53155d46d | F1 | Finnaux DL error bypasses the axios message normalisation | resolved | Still fixed at src/features/external-apis/components/dl-verify/flows/finnaux-dl-flow.tsx:35. |
| 96a421d2e090e09664350dccb0d18263912fc883 | F1 | RC address save needs Customer Address add rights | resolved | Still fixed: the modal saves through the rc-address route at src/features/loan-application/tabs/assets-vehicle/hooks.ts:160. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx | passed |
| grey | tests | not run: no test command configured in package.json |

### gaps (1)

- The errorCode path cannot be exercised until the backend sends CREDENTIALS_UNREADABLE; not run in a browser.

### info (2)

- This commit is the frontend half of the open 'Unreadable keys detected by message text' finding (howismycommit-45 F7, howismycommit-47 F1). Those stay open: the message fallback at src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx:60 is still what works until the backend ships the code (contract docs/contracts/external-apis-credentials-unreadable-code.md).
- Once the backend sends the code, remove the message fallback and mark those findings resolved.

---

## howismycommit-63

| Field | Value |
|---|---|
| id | howismycommit-63 |
| generatedAt | 2026-11-19T11:02:53+05:30 |
| author | Dhruv |
| branch | dev |
| target.kind | commit |
| target.commit | ff67f507630d46470ccac03489535332c20b0272 |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 1 |
| files.deletions | 3 |
| verdict | review-with-caution |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 1 |
| before | When Finnaux Driving License verification failed, the dialog read only response.data.message, so errors sent as `messages` or as an array showed a generic text or a joined array. |
| after | The failure toast uses error.message, which the axios interceptor already normalises from message, messages or the HTTP status, and still falls back to 'Driving license verification failed'. |

### changeType (1)

- bug fix

### effects (1)

- Finnaux DL verify dialog on the customer form and the identification document modal: only the error toast text changes

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| src/features/external-apis/components/dl-verify/flows/finnaux-dl-flow.tsx | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 8e06b64e2455f4dd1c36daff937b53b53155d46d | F1 | Finnaux DL error bypasses the axios message normalisation | resolved | Verified fixed by this commit: onFailure(error?.message \|\| ...) at src/features/external-apis/components/dl-verify/flows/finnaux-dl-flow.tsx:35. |
| 96a421d2e090e09664350dccb0d18263912fc883 | F1 | RC address save needs Customer Address add rights | resolved | Still fixed: the modal saves through the rc-address route at src/features/loan-application/tabs/assets-vehicle/hooks.ts:160. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint src/features/external-apis/components/dl-verify/flows/finnaux-dl-flow.tsx | passed |
| grey | tests | not run: no test command configured in package.json |

### gaps (1)

- Error path not exercised in a browser or against the live Finnaux DL endpoint.

### info (1)

- The file is unchanged since this commit; the working tree is clean.

---

## howismycommit-62

| Field | Value |
|---|---|
| id | howismycommit-62 |
| generatedAt | 2026-11-18T18:36:13+05:30 |
| author | Dhruv |
| branch | dev |
| target.kind | commit |
| target.commit | e914f690b4dcbafe3b3656638a3feeec49e9402e |
| files.changed | 3 |
| files.added | 0 |
| files.modified | 3 |
| files.deleted | 0 |
| files.insertions | 47 |
| files.deletions | 10 |
| verdict | review-with-caution |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 3 |
| summary.info | 2 |
| before | The RC address modal saved through the customer address route, which needs Customer Address add rights, and the RC Address dropdown only showed a spinner on its first load. |
| after | The modal saves through POST los/loan-application/:id/asset-vehicles/rc-address with only the fields the backend needs, waits for the borrower's addresses to reload before closing, and the RC Address dropdown is disabled with 'Loading addresses...' while they reload. The Permanent Address field shows only to users who can add (new vehicle) or edit (saved vehicle) vehicles. |

### changeType (3)

- feature
- API
- UI

### effects (2)

- Asset vehicle form: Permanent Address (from RC) field, RC address modal and RC Address dropdown
- Borrower customer address queries are refetched after a save

### filesReviewed (3)

| path | change | status | note |
|---|---|---|---|
| src/features/loan-application/tabs/assets-vehicle/form.tsx | modified | green | no issues |
| src/features/loan-application/tabs/assets-vehicle/hooks.ts | modified | green | no issues |
| src/features/loan-application/tabs/assets-vehicle/rc-permanent-address-field.tsx | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (3)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 96a421d2e090e09664350dccb0d18263912fc883 | F1 | RC address save needs Customer Address add rights | resolved | Verified fixed: the modal uses useAddRcAddressMutation at src/features/loan-application/tabs/assets-vehicle/rc-permanent-address-field.tsx:110, which posts to the rc-address route at src/features/loan-application/tabs/assets-vehicle/hooks.ts:160. |
| 8e06b64e2455f4dd1c36daff937b53b53155d46d | F1 | Finnaux DL error bypasses the axios message normalisation | open | Still present at src/features/external-apis/components/dl-verify/flows/finnaux-dl-flow.tsx:35. |
| ea8fd9b6a3d16cad34f54ec0d15e54338a81f197 | F1 | PAN details fill the non-individual form | resolved | Still fixed: applyPan returns early for non-individual customers at src/features/customers/components/add-customer-forms/components/kyc-section.tsx:126. |

### checks (4)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint src/features/loan-application/tabs/assets-vehicle | passed |
| green | git diff e914f690 (working tree) | passed: clean, the review describes the committed code |
| grey | tests | not run: no test command configured in package.json |

### gaps (2)

- No test command; the save, refetch and dropdown lock were not exercised.
- Not run in a browser or against the live rc-address endpoint.

### info (2)

- The backend compares streetRoadLane with the RC permanentAddress after trimming; the modal sends the read-only RC text trimmed by the form schema.
- The request body is typed as Record<string, unknown>, so the compiler does not check the field names against the contract.

---

## howismycommit-61

| Field | Value |
|---|---|
| id | howismycommit-61 |
| generatedAt | 2026-11-18T18:35:48+05:30 |
| author | Dhruv |
| branch | dev |
| target.kind | commit |
| target.commit | 96a421d2e090e09664350dccb0d18263912fc883 |
| files.changed | 11 |
| files.added | 2 |
| files.modified | 9 |
| files.deleted | 0 |
| files.insertions | 360 |
| files.deletions | 55 |
| verdict | review-with-caution |
| score | 100 |
| commitScore | 90 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 3 |
| summary.info | 2 |
| before | Vehicle RC verification only had a Surepass flow, so with Finnaux active the Verify RC dialog was empty, and the saved vehicle card verified through the autofill route without updating lastVerifiedAt. |
| after | A Finnaux RC flow is added, the form also fills Permit Upto, and the saved card calls the backend verify-rc route after a confirm. A verified RC's permanent address is shown next to RC Address with a small modal that saves it as a borrower address. |

### changeType (3)

- feature
- UI
- API

### effects (3)

- Loan application asset vehicle form and saved vehicle cards
- RC Address dropdown reloads the borrower's addresses after a save
- Shared address form fields now export AddressLocationFields for reuse

### filesReviewed (11)

| path | change | status | note |
|---|---|---|---|
| src/features/customers/components/shared/address-form-fields.tsx | modified | green | no issues |
| src/features/external-apis/api.ts | modified | green | no issues |
| src/features/external-apis/components/rc-verify/context.tsx | modified | green | no issues |
| src/features/external-apis/components/rc-verify/dialog-manager.tsx | modified | green | no issues |
| src/features/external-apis/components/rc-verify/flows/finnaux-rc-flow.tsx | added | green | no issues |
| src/features/external-apis/hooks.ts | modified | green | no issues |
| src/features/external-apis/types.ts | modified | green | no issues |
| src/features/loan-application/tabs/assets-vehicle/form.tsx | modified | green | no issues |
| src/features/loan-application/tabs/assets-vehicle/hooks.ts | modified | green | no issues |
| src/features/loan-application/tabs/assets-vehicle/index.tsx | modified | green | no issues |
| src/features/loan-application/tabs/assets-vehicle/rc-permanent-address-field.tsx | added | green | F1 (resolved) |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | RC address save needs Customer Address add rights |
| location | src/features/loan-application/tabs/assets-vehicle/rc-permanent-address-field.tsx:107 |
| problem | The RC address modal saved through the customer address route, which the backend allows only for users with add rights on the Customer Address page. The user verifying the RC only needs vehicle rights. |
| impact | A user who can verify the RC but lacks Customer Address add rights fills the whole modal and gets an error on Save, so the government RC address is not stored. |
| fix | Save through a loan-scoped route that checks vehicle rights instead. |
| evidence | const mutation = useCreateCustomerAddressMutation(borrowerCustomerId) |
| status | resolved |
| resolvedIn | e914f690b4dcbafe3b3656638a3feeec49e9402e |
| resolvedAt | 2026-11-18T13:05:54.474Z |
| resolvedNote | Resolved: the modal now saves through the loan-scoped rc-address route (src/features/loan-application/tabs/assets-vehicle/rc-permanent-address-field.tsx:110, src/features/loan-application/tabs/assets-vehicle/hooks.ts:160), which the backend allows on login like the vehicle edit route. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 8e06b64e2455f4dd1c36daff937b53b53155d46d | F1 | Finnaux DL error bypasses the axios message normalisation | open | Still present at src/features/external-apis/components/dl-verify/flows/finnaux-dl-flow.tsx:35. |
| ea8fd9b6a3d16cad34f54ec0d15e54338a81f197 | F1 | PAN details fill the non-individual form | resolved | Still fixed: applyPan returns early for non-individual customers at src/features/customers/components/add-customer-forms/components/kyc-section.tsx:126. |

### checks (4)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <11 changed files> | passed |
| green | re-read current tree for each finding | passed: F1 fixed in e914f690 |
| grey | tests | not run: no test command configured in package.json |

### gaps (2)

- No test command; RC autofill, card verify and the RC address modal were not exercised.
- Not run in a browser or against the live Finnaux RC, verify-rc and rc-address endpoints.

### info (2)

- Later commit e914f690 changed the RC address save route, removed the types field and hid the field from users without vehicle add/edit rights.
- The RC Address dropdown is disabled during any refetch of the borrower's addresses, including background refetches, not only after a save.

---

## howismycommit-60

| Field | Value |
|---|---|
| id | howismycommit-60 |
| generatedAt | 2026-11-18T18:34:57+05:30 |
| author | Dhruv |
| branch | dev |
| target.kind | commit |
| target.commit | 8e06b64e2455f4dd1c36daff937b53b53155d46d |
| files.changed | 12 |
| files.added | 2 |
| files.modified | 10 |
| files.deleted | 0 |
| files.insertions | 311 |
| files.deletions | 28 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 2 |
| summary.info | 2 |
| before | Driving License verification only had a Surepass flow, required a date of birth before the dialog opened, and marked the document verified without filling any customer details. |
| after | A Finnaux DL flow is added and both flows ask for the date of birth inside the dialog. A verified DL fills empty name, DOB, gender and relation fields and an empty address, keeps any document details the user already entered, and shows warnings for an inactive or expired licence. |

### changeType (3)

- feature
- UI
- API

### effects (3)

- Customer add form KYC section (inline Verify) and the identification document modal
- DirectVerificationFlow gained children and isVerifyDisabled, used by every direct verification flow
- IAadhaarVerificationResponse.profilePicUrl is now nullable

### filesReviewed (12)

| path | change | status | note |
|---|---|---|---|
| src/config/fixed-enums.ts | modified | green | no issues |
| src/features/customers/components/add-customer-forms/components/kyc-section.tsx | modified | green | no issues |
| src/features/customers/components/identification-document-modal/identification-document-form.tsx | modified | green | no issues |
| src/features/external-apis/api.ts | modified | green | no issues |
| src/features/external-apis/components/common/direct-verification-flow.tsx | modified | green | no issues |
| src/features/external-apis/components/dl-verify/context.tsx | modified | green | no issues |
| src/features/external-apis/components/dl-verify/dialog-manager.tsx | modified | green | no issues |
| src/features/external-apis/components/dl-verify/flows/finnaux-dl-flow.tsx | added | amber | F1 |
| src/features/external-apis/components/dl-verify/flows/surepass-dl-flow.tsx | modified | green | no issues |
| src/features/external-apis/components/dl-verify/utils.ts | added | green | no issues |
| src/features/external-apis/hooks.ts | modified | green | no issues |
| src/features/external-apis/types.ts | modified | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Finnaux DL error bypasses the axios message normalisation |
| location | src/features/external-apis/components/dl-verify/flows/finnaux-dl-flow.tsx:35 |
| problem | onError reads only error.response.data.message as a string. The axios interceptor already puts the readable message in error.message, including when the backend sends a `messages` field or an array `message`. |
| impact | When the backend replies with `messages`, the user sees the generic 'Driving license verification failed' instead of the reason; when `message` is an array, an array is passed to onFailure and the toast joins the items with no separator. |
| fix | Use onFailure(error?.message \|\| "Driving license verification failed"), as the Surepass and RC flows do. |
| evidence | const responseMessage = (error as { response?: { data?: { message?: string } } }).response<br>            ?.data?.message<br>          onFailure(responseMessage \|\| "Driving license verification failed") |
| status | resolved |
| resolvedIn | ff67f507630d46470ccac03489535332c20b0272 |
| resolvedAt | 2026-11-18T13:07:45.943Z |
| resolvedNote | Fixed in ff67f507: the Finnaux DL flow shows the axios-normalised error.message at src/features/external-apis/components/dl-verify/flows/finnaux-dl-flow.tsx:35. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| ea8fd9b6a3d16cad34f54ec0d15e54338a81f197 | F1 | PAN details fill the non-individual form | resolved | Still fixed: applyPan returns early for non-individual customers at src/features/customers/components/add-customer-forms/components/kyc-section.tsx:126. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <12 changed files> | passed |
| grey | tests | not run: no test command configured in package.json |

### gaps (2)

- No test command; DL fill rules and warnings were not exercised.
- Not run in a browser or against the real Finnaux DL endpoint.

### info (2)

- The commit's DL code is unchanged in the current tree; later commits only touched RC code in the shared api, hooks and types files.
- The date-of-birth check moved from the trigger into the dialog, so Verify now opens even without a DOB and the user enters it there.

---

## howismycommit-59

| Field | Value |
|---|---|
| id | howismycommit-59 |
| generatedAt | 2026-11-17T14:07:07+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | f8940301fae9f9208c67cbc2a381ee8222a57ade |
| files.changed | 9 |
| files.added | 0 |
| files.modified | 9 |
| files.deleted | 0 |
| files.insertions | 83 |
| files.deletions | 67 |
| verdict | review-with-caution |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 2 |
| before | A verified PAN or Aadhaar filled only form fields that were empty. Comments were still in several touched files. |
| after | A verified PAN overwrites first, middle and last name and date of birth, locks what it filled, and shows the name match score and an Aadhaar-linked hint. Aadhaar skips locked fields. Full-line comments are removed from the files touched since 87b21c69. |

### changeType (3)

- feature
- ui
- refactor

### effects (4)

- Add Customer (Individual): name and date of birth come from PAN and cannot be overwritten by a later Aadhaar verify.
- First Name shows a PAN name match percentage, and the KYC section can show whether the PAN is linked to Aadhaar.
- Non-individual customers are not affected by the PAN fill.
- Report filters, the integration form and the document modal lose comments only.

### filesReviewed (9)

| path | change | status | note |
|---|---|---|---|
| src/features/customers/components/add-customer-forms/components/kyc-section.tsx | modified | green | no issues |
| src/features/customers/components/add-customer-forms/individual-customer.tsx | modified | green | no issues |
| src/features/external-apis/types.ts | modified | green | no issues |
| src/features/customers/components/identification-document-modal/types.ts | modified | green | no issues |
| src/features/customers/components/identification-document-modal/identification-document-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx | modified | green | comments removed only |
| src/app/(app)/(main)/reports-user/_shared/filters-sidebar.tsx | modified | green | comments removed only |
| src/app/(app)/(main)/reports-user/_shared/use-report-filters.ts | modified | green | comments removed only |
| src/features/reports/reports-builder/types.ts | modified | green | comments removed only |

### findings (0)

_Empty._

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| ea8fd9b6a3d16cad34f54ec0d15e54338a81f197 | F1 | PAN details fill the non-individual form | resolved | applyPan returns early unless customerType is INDIVIDUAL at src/features/customers/components/add-customer-forms/components/kyc-section.tsx:102, and this commit contains that fix. |
| ea3e2c3dce9bbd0adbf94bd09c96ecf0b735e765 | F1 | Old Digipehchan flow left as a duplicate | resolved | src/features/external-apis/components/aadhar-verify/flows has no digipehchan-flow.tsx. |

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint on the .ts and .tsx files of the commit | passed: no errors |

### gaps (2)

- No test command is configured, and I did not run the Add Customer screen or call the real Finnaux PAN endpoint.
- I checked the fill rules against the contract you pasted, not against the backend code.

### info (2)

- The PAN lock and name match score stay in place if the PAN number is changed to a different PAN after verifying, because they are only cleared when the PAN document type is removed.
- The lock lives in a ref, so a PAN verified in the modal and closed without saving is not remembered after the section remounts.

---

## howismycommit-58

| Field | Value |
|---|---|
| id | howismycommit-58 |
| generatedAt | 2026-11-17T14:05:57+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | ea8fd9b6a3d16cad34f54ec0d15e54338a81f197 |
| files.changed | 5 |
| files.added | 0 |
| files.modified | 5 |
| files.deleted | 0 |
| files.insertions | 47 |
| files.deletions | 14 |
| verdict | review-with-caution |
| score | 100 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 2 |
| before | Verifying a PAN only marked the document verified. Aadhaar verify replaced the basic details and the whole address every time. |
| after | As committed, PAN and Aadhaar both filled only form fields that were empty, from both the inline Verify button and the document modal. The working tree has since replaced this with the PAN-priority rule: PAN overwrites name and date of birth and locks them, and Aadhaar skips locked fields. |

### changeType (3)

- feature
- ui
- api

### effects (3)

- Add Customer fills name and date of birth from a verified PAN.
- The document modal passes the verify response up through a new onVerifiedDetails callback.
- Aadhaar no longer overwrote existing values in the committed version; the current code overwrites again except for fields PAN locked.

### filesReviewed (5)

| path | change | status | note |
|---|---|---|---|
| src/features/customers/components/add-customer-forms/components/kyc-section.tsx | modified | amber | F1 (resolved) |
| src/features/customers/components/add-customer-forms/components/kyc-field.tsx | modified | green | no issues |
| src/features/customers/components/identification-document-modal/identification-document-form.tsx | modified | green | no issues |
| src/features/customers/components/identification-document-modal/types.ts | modified | green | no issues |
| src/features/external-apis/types.ts | modified | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | PAN details fill the non-individual form |
| location | src/features/customers/components/add-customer-forms/components/kyc-section.tsx:133 |
| problem | The committed code filled basicDetails from a PAN verify with no check on the customer type. KycSection is also used by the non-individual form, which has no first name, last name or date of birth fields. |
| impact | Verifying a PAN in a non-individual customer would write firstName, lastName or dateOfBirth into that form's values, and they could be sent with the save request. |
| fix | Apply the PAN details only when customerType is INDIVIDUAL. |
| evidence | if (data) fillFromVerification(data) |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-17T00:00:00.000Z |
| resolvedNote | applyPan returns early unless customerType is INDIVIDUAL at src/features/customers/components/add-customer-forms/components/kyc-section.tsx:102 (uncommitted). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| ea3e2c3dce9bbd0adbf94bd09c96ecf0b735e765 | F1 | Old Digipehchan flow left as a duplicate | resolved | src/features/external-apis/components/aadhar-verify/flows has no digipehchan-flow.tsx and nothing references it. |

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed (current working tree) |
| green | npx eslint on the changed kyc, modal and types files | passed (current working tree) |

### gaps (3)

- The working tree has uncommitted changes in these files, so the score and verdict describe the current code, and the commit itself scored lower (see commitScore).
- No test command is configured, and I did not run the screens in a browser.
- I did not check the Finnaux PAN response against the real backend.

### info (2)

- The PAN lock is kept in a ref. A PAN verified inside the modal and closed without saving is not remembered after the section remounts.
- The committed version and the current version apply different rules for PAN and Aadhaar fill. Only the current one matches the latest contract.

---

## howismycommit-57

| Field | Value |
|---|---|
| id | howismycommit-57 |
| generatedAt | 2026-11-16T18:16:28+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 9c85c0fc9ce3f25ab1c69bd902068e5afbd7272d |
| files.changed | 5 |
| files.added | 1 |
| files.modified | 4 |
| files.deleted | 0 |
| files.insertions | 93 |
| files.deletions | 1 |
| verdict | review-with-caution |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 2 |
| before | The PAN verify dialog only had a Surepass flow. Any other provider opened an empty dialog. |
| after | A finnaux provider opens a dialog that shows the PAN number and asks for the name on the PAN, then calls /external/finnaux/pan/verify. Errors show as a toast and the dialog stays open for a retry. |

### changeType (3)

- feature
- api
- ui

### effects (3)

- Add Customer and the document modal can verify PAN with Finnaux once the backend group has provider finnaux.
- Success uses the same response shape as Surepass PAN, so the existing form fill and verified mark work unchanged.
- Surepass PAN is unchanged.

### filesReviewed (5)

| path | change | status | note |
|---|---|---|---|
| src/features/external-apis/components/pan-verify/flows/finnaux-pan-flow.tsx | added | green | no issues |
| src/features/external-apis/components/pan-verify/dialog-manager.tsx | modified | green | no issues |
| src/features/external-apis/components/pan-verify/context.tsx | modified | green | no issues |
| src/features/external-apis/api.ts | modified | green | no issues |
| src/features/external-apis/hooks.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| ea3e2c3dce9bbd0adbf94bd09c96ecf0b735e765 | F1 | Old Digipehchan flow left as a duplicate | resolved | digipehchan-flow.tsx is not in src/features/external-apis/components/aadhar-verify/flows and nothing references DigipehchanFlow. |

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint src/features/external-apis | passed |

### gaps (2)

- No test command is configured, and I did not run the dialog in a browser or call the real Finnaux endpoint.
- The request and response were checked against the pasted backend description, not against the backend code.

### info (2)

- The name typed in the dialog is not compared with the customer's name on the form, so a verified PAN can belong to a different name than the customer being added.
- A provider with no flow in the PAN dialog still opens an empty dialog. The same is true for the other verify dialogs.

---

## howismycommit-56

| Field | Value |
|---|---|
| id | howismycommit-56 |
| generatedAt | 2026-11-16T17:20:57+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 1c006b9ec5e70e7049d060671d69b904c91dabd5 |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 1 |
| files.deletions | 1 |
| verdict | review-with-caution |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 2 |
| before | getOptions returned undefined while the customer dropdowns were loading or had failed. IdentificationDocumentForm then crashed on options.find and showed an empty modal. |
| after | getOptions always returns a list, empty until the dropdowns load, so the document form opens without crashing. |

### changeType (2)

- bug fix
- ui

### effects (2)

- The KYC document modals in Add Customer open even when the dropdowns request has not finished or has failed.
- The Document Type select is empty in that case instead of the modal crashing.

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| src/features/customers/components/add-customer-forms/components/kyc-section.tsx | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| ea3e2c3dce9bbd0adbf94bd09c96ecf0b735e765 | F1 | Old Digipehchan flow left as a duplicate | resolved | digipehchan-flow.tsx no longer exists in src/features/external-apis/components/aadhar-verify/flows and nothing references DigipehchanFlow. |

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint kyc-section.tsx | passed |

### gaps (2)

- No test command is configured, so the fix was not tested, and I did not reproduce the crash in a browser.
- I only checked the one caller of the document form that I found, KycField in kyc-section.tsx.

### info (2)

- When the dropdowns request fails, the user sees an empty Document Type list with no error message. The type of options in the form still says it is always a list.
- The empty PAN verify modal from the same screen is a separate problem and is not touched by this commit.

---

## howismycommit-55

| Field | Value |
|---|---|
| id | howismycommit-55 |
| generatedAt | 2026-11-16T15:18:48+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 8361af67545e0b98431fba5f550e3fbebbf36ef2 |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 0 |
| files.deleted | 1 |
| files.insertions | 0 |
| files.deletions | 168 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 1 |
| before | The old Digipehchan OTP flow component sat in the repo next to the shared AadhaarOtpFlow, with no importers. |
| after | Only the shared AadhaarOtpFlow handles the Digipehchan and Finnaux OTP steps. The unused copy is gone. |

### changeType (1)

- refactor

### effects (2)

- No screen changes: dialog-manager.tsx already used AadhaarOtpFlow for digipehchan and finnaux.
- Fixes the duplicate-file finding F1 from the previous commit's review.

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| src/features/external-apis/components/aadhar-verify/flows/digipehchan-flow.tsx | deleted | green | no issues |

### findings (0)

_Empty._

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| ea3e2c3dce9bbd0adbf94bd09c96ecf0b735e765 | F1 | Old Digipehchan flow left as a duplicate | resolved | The file is deleted and nothing under src references DigipehchanFlow or digipehchan-flow; the shared flow is at src/features/external-apis/components/aadhar-verify/flows/aadhaar-otp-flow.tsx:25. |

### checks (2)

| status | command | result |
|---|---|---|
| green | grep for DigipehchanFlow and digipehchan-flow in src | passed: no matches |
| green | npx tsc --noEmit | passed |

### gaps (2)

- No test command is configured, and I did not open the Aadhaar dialog in a browser.
- The change only deletes a file, so there is no new logic to review.

### info (1)

- useGenerateDigipehchanAadharOtpMutation and useVerifyDigipehchanAadharOtpMutation in src/features/external-apis/hooks.ts have no users left and can be removed.

---

## howismycommit-54

| Field | Value |
|---|---|
| id | howismycommit-54 |
| generatedAt | 2026-11-16T15:13:08+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | ea3e2c3dce9bbd0adbf94bd09c96ecf0b735e765 |
| files.changed | 6 |
| files.added | 1 |
| files.modified | 5 |
| files.deleted | 0 |
| files.insertions | 213 |
| files.deletions | 5 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 2 |
| summary.info | 2 |
| before | Aadhaar verification supported Digio, Surepass and Digipehchan. The Digipehchan OTP flow lived in digipehchan-flow.tsx, and the integration modal showed required keys plus every saved key. |
| after | A Finnaux provider runs the same OTP flow through a shared AadhaarOtpFlow with its own generate and verify endpoints. The modal shows only the declared required keys, then saved keys, then one apiKey field. |

### changeType (3)

- feature
- ui
- refactor

### effects (3)

- Customer form Aadhaar Verify works with a provider named finnaux, once the backend has the group and endpoints.
- Configuration > External APIs shows fewer credential fields for groups that declare required keys.
- Old Digipehchan calls now go through AadhaarOtpFlow with provider digipehchan.

### filesReviewed (6)

| path | change | status | note |
|---|---|---|---|
| src/features/external-apis/components/aadhar-verify/flows/aadhaar-otp-flow.tsx | added | amber | F1 |
| src/features/external-apis/components/aadhar-verify/dialog-manager.tsx | modified | green | no issues |
| src/features/external-apis/components/aadhar-verify/context.tsx | modified | green | no issues |
| src/features/external-apis/hooks.ts | modified | amber | F1 |
| src/features/external-apis/api.ts | modified | green | no issues |
| src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx | modified | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Old Digipehchan flow left as a duplicate |
| location | src/features/external-apis/components/aadhar-verify/flows/digipehchan-flow.tsx:23 |
| problem | The commit adds aadhaar-otp-flow.tsx as a copy of digipehchan-flow.tsx but does not delete the old file. Nothing imports DigipehchanFlow any more, so about 170 lines are dead and match the new file except for the provider handling. |
| impact | A later fix to the OTP flow (timer, error text, resend) can be made in one file and missed in the other. The old hooks useGenerateDigipehchanAadharOtpMutation and useVerifyDigipehchanAadharOtpMutation are only kept alive by this file. |
| fix | Delete digipehchan-flow.tsx and the two Digipehchan-only hooks in hooks.ts. |
| evidence | export function DigipehchanFlow() { |
| status | resolved |
| resolvedIn | 8361af67545e0b98431fba5f550e3fbebbf36ef2 |
| resolvedAt | 2026-11-16T09:48:48.000Z |
| resolvedNote | digipehchan-flow.tsx is deleted; the only flow file left is src/features/external-apis/components/aadhar-verify/flows/aadhaar-otp-flow.tsx:25, and nothing imports the old one. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (0)

_Empty._

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint src/features/external-apis and configuration/external-apis | passed |

### gaps (3)

- No test command is configured, so the OTP flow and the credential field rules were not tested.
- I did not run the dialog or the modal in a browser, and the Finnaux endpoints do not exist on the backend yet, so the real calls were not exercised.
- I did not review the backend contract document (docs/contracts), which is not part of this commit.

### info (2)

- The finnaux provider id is not in src/config/external-api-ids.ts. The flow picks the provider by name, so this is fine until some code needs the API group id.
- When a group declares required keys, a saved key it no longer declares (for example an old apiKey) is hidden and never sent. It stays stored on the backend.

---

## howismycommit-53

| Field | Value |
|---|---|
| id | howismycommit-53 |
| generatedAt | 2026-11-16T15:12:24+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 87b21c69047d5c7eb2e18b7eae3da556b608bb89 |
| files.changed | 4 |
| files.added | 0 |
| files.modified | 4 |
| files.deleted | 0 |
| files.insertions | 11 |
| files.deletions | 0 |
| verdict | review-with-caution |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 2 |
| before | The report filters sidebar had date, branch and product filters, and the run request sent only those. |
| after | The sidebar also has an Include Internal Vouchers checkbox, off by default. Its value is sent as includeInternalVouchers in the body of both report run calls. |

### changeType (3)

- feature
- ui
- api

### effects (3)

- My Reports and Report Builder (My Reports view) both show the new checkbox, because they share FiltersSidebar.
- Every report run now sends includeInternalVouchers, true or false.
- The backend only logs the field for now (per the contract), so report results do not change yet.

### filesReviewed (4)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/reports-user/_shared/filter-schema.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/filters-sidebar.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/use-report-filters.ts | modified | green | no issues |
| src/features/reports/reports-builder/types.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (3)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| c94a61ef78f2f77342abfad51c8e0d890a97bb44 | F1 | Clipboard read on open and every tab focus | resolved | readText is only called from the click handler at src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx:172; onFocus only selects text (line 224). |
| c94a61ef78f2f77342abfad51c8e0d890a97bb44 | F2 | Paste fires on any focus, not only a click | resolved | Paste runs from onClick only (integration-group-form.tsx:225). |
| d616233a634560a7bb7925abf4f3926d16c326a6 | F1 | Paste fires on any focus, not only a click | resolved | Paste runs from onClick only (integration-group-form.tsx:225). |

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint reports-user/_shared and reports-builder/types.ts | passed |

### gaps (3)

- No test command is configured, so the checkbox and the request body were not tested.
- I did not open the screen or watch the network call in a browser.
- The backend side was not reviewed. I only compared the sent field with docs/contracts/report-builder-include-internal-vouchers-contract.md.

### info (2)

- The checkbox has no effect on report results until the backend applies the filter. Users may think it filters already.
- toReportFilters sends includeInternalVouchers: false when unchecked instead of leaving it out. This matches the contract (boolean, never null).

---

## howismycommit-52

| Field | Value |
|---|---|
| id | howismycommit-52 |
| generatedAt | 2026-11-16T15:11:43+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 72907a54fc278904741c66274d5a39223fe87476 |
| files.changed | 5 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 4 |
| files.insertions | 1 |
| files.deletions | 785 |
| verdict | review-with-caution |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 2 |
| before | The Audit Logs page showed three tabs: Activity Log, Application Log and Redis Activity, each with its own tab file and API helpers. |
| after | The page shows one tab, Application Log. The Activity Log and Redis tab files and their API code are deleted, and page.tsx no longer imports them. |

### changeType (2)

- refactor
- ui

### effects (2)

- Configuration > Audit Logs loses the Activity Log and Redis Activity tabs.
- Users who relied on those tabs lose the screens. Nothing else in src imports the deleted files.

### filesReviewed (5)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/audit-logs/page.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/audit-logs/_lib/api.ts | modified | green | no issues |
| src/app/(app)/(main)/configuration/audit-logs/_tabs/activity-log.tab.tsx | deleted | green | no issues |
| src/app/(app)/(main)/configuration/audit-logs/_tabs/redis-activity.tab.tsx | deleted | green | no issues |
| src/app/(app)/(main)/configuration/audit-logs/_tabs/redis-history.tsx | deleted | green | no issues |

### findings (0)

_Empty._

### previousFindings (4)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 687f0683b496f5b86359bb799905c4cf6d706cf7 | F1 | Unreadable keys detected by message text | open | Still compares the error message to a fixed sentence at src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx:159. |
| c94a61ef78f2f77342abfad51c8e0d890a97bb44 | F1 | Clipboard read on open and every tab focus | resolved | readText is only called from the click handler at integration-group-form.tsx:172, and the focus handler only selects text (line 224). |
| c94a61ef78f2f77342abfad51c8e0d890a97bb44 | F2 | Paste fires on any focus, not only a click | resolved | Paste runs from onClick only (integration-group-form.tsx:225); onFocus just selects the text. |
| d616233a634560a7bb7925abf4f3926d16c326a6 | F1 | Paste fires on any focus, not only a click | resolved | Paste runs from onClick only (integration-group-form.tsx:225); onFocus just selects the text. |

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint src/app/(app)/(main)/configuration/audit-logs | passed |

### gaps (3)

- This is a merge commit. I reviewed its diff against the first parent (32b53099) only, which is the effect of bringing dev into this branch.
- No test command is configured, so the removed tabs and the remaining Application Log tab were not tested.
- I did not open the page in a browser. The working tree has uncommitted changes elsewhere (external-apis), which this review does not cover.

### info (2)

- The deletions match dev commit 780003e2 (feat(audit-logs): remove redis and activity tabs), so they are intended and unrelated to the external-apis branch work.
- Check that no permission or menu entry still points at the removed tabs.

---

## howismycommit-51

| Field | Value |
|---|---|
| id | howismycommit-51 |
| generatedAt | 2026-11-13T17:53:20+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 32b53099b094720fa2c5a72ca5f615d668ef568d |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 2 |
| files.deletions | 4 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 3 |
| summary.info | 3 |
| before | The first-use clipboard paste into an API key field started from the input's onFocus, so tabbing into the field also pasted. |
| after | onFocus only selects the field's text, and the paste starts from onClick, so only a click (or tap) on an empty key field pastes the clipboard. |

### changeType (1)

- bug fix

### effects (3)

- Tabbing into a key field no longer reads the clipboard or uses up that field's one paste.
- Keyboard users have no way to trigger the paste: Enter in an input submits the form and Space types a space, neither produces a click. They can still paste with Ctrl or Cmd+V.
- Only the External APIs modal is affected.

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (11)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| d616233a634560a7bb7925abf4f3926d16c326a6 | F1 | Paste fires on any focus, not only a click | resolved | Verified: integration-group-form.tsx:219 keeps only the select-all in onFocus and line 220 starts the paste from onClick. |
| c94a61ef78f2f77342abfad51c8e0d890a97bb44 | F1 | Clipboard read on open and every tab focus | resolved | Verified: use-clipboard-text.ts has no effect or focus listener; the clipboard is read only in pasteClipboardOnFirstClick (integration-group-form.tsx:162). |
| c94a61ef78f2f77342abfad51c8e0d890a97bb44 | F2 | Paste fires on any focus, not only a click | resolved | Verified: the paste starts at integration-group-form.tsx:220 (onClick). |
| 687f0683b496f5b86359bb799905c4cf6d706cf7 | F1 | Unreadable keys detected by message text | open | Still present at integration-group-form.tsx:154. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F7 | Unreadable keys detected by message text | open | Same issue, still present at integration-group-form.tsx:154. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F1 | Autofill may drop login password into keys | resolved | Verified: no autoComplete prop in integration-group-form.tsx. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F2 | Typed keys stay in memory after save | resolved | Verified: hooks.ts:64 has gcTime: 0. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F3 | Page list refetched twice per save | resolved | Verified: hooks.ts:79 invalidates only the saved-keys queries. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F4 | Unrequested global pagination spacing change | resolved | Verified: data-table-pagination.tsx:28 has no mt-2. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F5 | Credentials fetched while fields hidden | resolved | Verified: integration-group-form.tsx:128 passes isEnabled ? apiGroupId : null. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F6 | Comments against the AGENTS.md rule | resolved | Verified: the form keeps only comments that explain a business reason. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint integration-group-form.tsx | passed: no errors or warnings |
| grey | tests | not run: no test script configured |

### gaps (2)

- No browser test: click, tap and Tab behaviour were read from the code, not tried.
- The code in the checkout is identical to this commit for the file, so the checks ran on the same code.

### info (3)

- An earlier chat message said Enter or Space on a focused field would also paste; that was wrong for an input element, since neither produces a click.
- One earlier finding is still open: unreadable keys are recognised by the backend's message text (integration-group-form.tsx:154).
- A field is marked as used before the clipboard is read, so a click made before copying the key uses up that field's one paste, as requested.

---

## howismycommit-50

| Field | Value |
|---|---|
| id | howismycommit-50 |
| generatedAt | 2026-11-13T17:41:30+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | d616233a634560a7bb7925abf4f3926d16c326a6 |
| files.changed | 2 |
| files.added | 0 |
| files.modified | 2 |
| files.deleted | 0 |
| files.insertions | 34 |
| files.deletions | 55 |
| verdict | looks-good |
| score | 100 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 3 |
| summary.info | 4 |
| before | Each API key field had a Paste button that appeared when the clipboard held text, and the form read the clipboard when the fields appeared and on every tab focus. |
| after | The Paste button and those early clipboard reads are gone. An empty key field with no saved key now fills itself from the clipboard once, the first time it is used; as committed this ran on focus, and the next commit moved it to a click. |

### changeType (3)

- feature
- refactor
- ui

### effects (3)

- The clipboard is read only after the user interacts with a key field, so Chrome's permission prompt no longer appears when the modal opens.
- The hook use-clipboard-text.ts shrinks to a single readText helper used only by the External APIs form.
- A field that already has a saved key never pastes, and each field pastes at most once per modal.

### filesReviewed (2)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx | modified | green | F1 resolved |
| src/hooks/use-clipboard-text.ts | modified | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Paste fires on any focus, not only a click |
| location | src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx:221 |
| problem | The paste ran from the input's onFocus handler, which also runs when the field gets focus from the Tab key, not only from a mouse click. |
| impact | A keyboard user tabbing into the first empty key field got the clipboard filled in without clicking, and that field was then marked as used, so a real click would not paste. |
| fix | Start the paste from onClick instead of onFocus. |
| evidence | void pasteClipboardOnFirstClick(index, key) |
| status | resolved |
| resolvedIn | 32b53099b094720fa2c5a72ca5f615d668ef568d |
| resolvedAt | 2026-11-13T12:11:30Z |
| resolvedNote | integration-group-form.tsx:219 keeps only the select-all in onFocus and line 220 starts the paste from onClick. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (14)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| c94a61ef78f2f77342abfad51c8e0d890a97bb44 | F1 | Clipboard read on open and every tab focus | resolved | Verified: use-clipboard-text.ts has no effect or focus listener; the clipboard is read only in pasteClipboardOnFirstClick (integration-group-form.tsx:162). |
| c94a61ef78f2f77342abfad51c8e0d890a97bb44 | F2 | Paste fires on any focus, not only a click | resolved | Verified: the paste starts at integration-group-form.tsx:220 (onClick), not in onFocus. |
| 687f0683b496f5b86359bb799905c4cf6d706cf7 | F1 | Unreadable keys detected by message text | open | Still present at integration-group-form.tsx:154. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F7 | Unreadable keys detected by message text | open | Same issue, still present at integration-group-form.tsx:154. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F1 | Autofill may drop login password into keys | resolved | Verified: no autoComplete prop in integration-group-form.tsx. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F2 | Typed keys stay in memory after save | resolved | Verified: hooks.ts:64 has gcTime: 0. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F3 | Page list refetched twice per save | resolved | Verified: hooks.ts:79 invalidates only the saved-keys queries. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F4 | Unrequested global pagination spacing change | resolved | Verified: data-table-pagination.tsx:28 has no mt-2. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F5 | Credentials fetched while fields hidden | resolved | Verified: integration-group-form.tsx:128 passes isEnabled ? apiGroupId : null. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F6 | Comments against the AGENTS.md rule | resolved | Verified: the form keeps only comments that explain a business reason. |
| c18c79f7696856db2d1882717b51c48b94511101 | F1 | Page restyle changed shared Badge and TableRow for the whole app | uncertain | Marked resolved by hand; the change is still in place because you said it is intended, so nothing was changed. |
| c18c79f7696856db2d1882717b51c48b94511101 | F2 | Comments against the AGENTS.md rule | resolved | Verified: page.tsx has no comment lines. |
| c18c79f7696856db2d1882717b51c48b94511101 | F3 | Edit button shown without the edit right | resolved | Verified: page.tsx:108 adds the Actions column only when canEdit is true. |
| c18c79f7696856db2d1882717b51c48b94511101 | F4 | Empty Actions column without edit right | resolved | Verified: page.tsx:108 adds the column only when canEdit is true. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed (current code) |
| green | npx eslint integration-group-form.tsx use-clipboard-text.ts | passed: no errors or warnings (current code) |
| grey | tests | not run: no test script configured |

### gaps (3)

- The working tree has moved on (later commit 32b53099b094720fa2c5a72ca5f615d668ef568d changed the form), so the score and verdict describe the current code; commitScore keeps the score as committed.
- No browser test: the first-click paste, the Chrome permission prompt and the saved-key skip were read from the code, not tried.
- Clipboard reading differs by browser (Chrome asks once, Firefox does not allow it); only the code path was checked.

### info (4)

- A field is marked as used before the clipboard is read, so a click made before copying the key uses up that field's one paste, as the request specified.
- One earlier finding is still open: unreadable keys are recognised by the backend's message text (integration-group-form.tsx:154).
- Pasted text is trimmed at both ends, and anything on the clipboard is accepted; nothing is saved until the user presses Save Changes.
- If the keys were switched while the clipboard permission prompt was open, the paste could land in another field; this is unlikely and not reproduced.

---

## howismycommit-49

| Field | Value |
|---|---|
| id | howismycommit-49 |
| generatedAt | 2026-11-13T16:57:46+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | c94a61ef78f2f77342abfad51c8e0d890a97bb44 |
| files.changed | 2 |
| files.added | 1 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 70 |
| files.deletions | 17 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 92 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 3 |
| summary.info | 4 |
| before | The API key fields in the External APIs modal could only be typed into. |
| after | As committed, each key field showed a Paste button at the top right whenever the clipboard held text, and clicking it filled the field. In the current code (a later commit) the button is gone and the field fills itself from the clipboard on the first click into an empty field. |

### changeType (2)

- feature
- ui

### effects (3)

- The modal now reads the clipboard through navigator.clipboard.readText, which makes Chrome ask for permission and does not work in Firefox.
- A new shared hook file, src/hooks/use-clipboard-text.ts, is added; only the External APIs form uses it.
- Only the External APIs modal is affected; no other screen changed.

### filesReviewed (2)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx | modified | amber | F2 |
| src/hooks/use-clipboard-text.ts | added | green | F1 resolved |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Clipboard read on open and every tab focus |
| location | src/hooks/use-clipboard-text.ts:21 |
| problem | To decide whether to show the Paste button, the hook read the clipboard as soon as the key fields appeared and again every time the browser tab regained focus. |
| impact | Chrome showed its clipboard permission prompt before the user did anything, and whatever the user had copied (including unrelated passwords) was read silently on each tab switch just to check it was not empty. |
| fix | Read the clipboard only after a user action, such as clicking the field. |
| evidence | window.addEventListener("focus", refresh) |
| status | resolved |
| resolvedIn | d616233a634560a7bb7925abf4f3926d16c326a6 |
| resolvedAt | 2026-11-13T11:27:46Z |
| resolvedNote | src/hooks/use-clipboard-text.ts no longer has an effect or focus listener; the form reads the clipboard only inside pasteClipboardOnFirstClick (integration-group-form.tsx:162). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Paste fires on any focus, not only a click |
| location | src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx:221 |
| problem | A later change in this file starts the paste from the input's onFocus handler, which also runs when the field gets focus from the Tab key, not only from a mouse click. |
| impact | A keyboard user tabbing from Active API into the first empty key field gets whatever is on the clipboard filled in without clicking, and that field is then marked as used, so it will not paste again on a real click. |
| fix | Start the paste from onClick or onPointerDown on the input instead of onFocus. |
| evidence | void pasteClipboardOnFirstClick(index, key) |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-13T12:09:54.791Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (12)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 687f0683b496f5b86359bb799905c4cf6d706cf7 | F1 | Unreadable keys detected by message text | open | Still present at integration-group-form.tsx:154. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F7 | Unreadable keys detected by message text | open | Same issue, still present at integration-group-form.tsx:154. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F1 | Autofill may drop login password into keys | resolved | Verified: no autoComplete prop in integration-group-form.tsx. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F2 | Typed keys stay in memory after save | resolved | Verified: hooks.ts:64 has gcTime: 0. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F3 | Page list refetched twice per save | resolved | Verified: hooks.ts:79 invalidates only the saved-keys queries. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F4 | Unrequested global pagination spacing change | resolved | Verified: data-table-pagination.tsx:28 has no mt-2. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F5 | Credentials fetched while fields hidden | resolved | Verified: integration-group-form.tsx:128 passes isEnabled ? apiGroupId : null. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F6 | Comments against the AGENTS.md rule | resolved | Verified: the form keeps only comments that explain a business reason. |
| c18c79f7696856db2d1882717b51c48b94511101 | F1 | Page restyle changed shared Badge and TableRow for the whole app | uncertain | Marked resolved by hand; the change is still in place because you said it is intended, so nothing was changed. |
| c18c79f7696856db2d1882717b51c48b94511101 | F2 | Comments against the AGENTS.md rule | resolved | Verified: page.tsx has no comment lines. |
| c18c79f7696856db2d1882717b51c48b94511101 | F3 | Edit button shown without the edit right | resolved | Verified: page.tsx:108 adds the Actions column only when canEdit is true. |
| c18c79f7696856db2d1882717b51c48b94511101 | F4 | Empty Actions column without edit right | resolved | Verified: page.tsx:108 adds the column only when canEdit is true. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed (current code) |
| green | npx eslint integration-group-form.tsx use-clipboard-text.ts | passed: no errors or warnings (current code) |
| grey | tests | not run: no test script configured |

### gaps (3)

- The working tree has moved on (later commit d616233a634560a7bb7925abf4f3926d16c326a6 changed both files), so the score and verdict describe the current code; commitScore keeps the score as committed.
- No browser test: the clipboard permission prompt, the Paste button and the paste-on-click behaviour were read from the code, not tried.
- Clipboard reading differs by browser (Chrome asks once, Firefox does not allow it), and only the code path was checked.

### info (4)

- The paste-on-click rule marks a field as used before it reads the clipboard, so a click made before copying the key uses up that field's one chance.
- One earlier finding is still open: unreadable keys are recognised by the backend's message text (integration-group-form.tsx:154).
- Pasted text is trimmed at both ends, so a trailing line break from a copied key does not reach the backend.
- Anything on the clipboard is accepted, including text that is not a key; the field is masked and nothing is saved until the user presses Save Changes.

---

## howismycommit-48

| Field | Value |
|---|---|
| id | howismycommit-48 |
| generatedAt | 2026-11-13T16:53:56+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 82a49cb765c4c2d512aa14070c5fbcbb459f4870 |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 58 |
| files.deletions | 63 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 3 |
| summary.info | 3 |
| before | The External APIs table always had an Actions column; for users without the edit right its cells were empty. The page also carried four explanatory comments. |
| after | The Actions column is built only when the user has the page's edit right, so view-only users see no empty column. The four comments are removed. |

### changeType (2)

- refactor
- ui

### effects (3)

- View-only users see five columns; users with the edit right see six, including the edit button.
- The table-body click handler is still attached for view-only users, but without the Actions column no cell carries the tag it looks for, so it never opens the modal.
- Only page.tsx changed; nothing else imports from it.

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/external-apis/page.tsx | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (12)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 687f0683b496f5b86359bb799905c4cf6d706cf7 | F1 | Unreadable keys detected by message text | open | Still present at src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx:154. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F7 | Unreadable keys detected by message text | open | Same issue as above, still present at integration-group-form.tsx:154. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F1 | Autofill may drop login password into keys | resolved | Verified: no autoComplete prop remains in integration-group-form.tsx. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F2 | Typed keys stay in memory after save | resolved | Verified: hooks.ts:64 has gcTime: 0 on the keys mutation. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F3 | Page list refetched twice per save | resolved | Verified: hooks.ts:79 invalidates only the saved-keys queries. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F4 | Unrequested global pagination spacing change | resolved | Verified: data-table-pagination.tsx:28 has no mt-2. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F5 | Credentials fetched while fields hidden | resolved | Verified: integration-group-form.tsx:126 passes isEnabled ? apiGroupId : null. |
| 6b160d560971a47f5d2248e7878722196d8137eb | F6 | Comments against the AGENTS.md rule | resolved | Verified: the form keeps only comments that explain a business reason. |
| c18c79f7696856db2d1882717b51c48b94511101 | F1 | Page restyle changed shared Badge and TableRow for the whole app | uncertain | Marked resolved by hand; the change is still in place (badge.tsx:9 is rounded-md, table.tsx has no focus outline) because you said in chat it is intended, so nothing was changed. |
| c18c79f7696856db2d1882717b51c48b94511101 | F2 | Comments against the AGENTS.md rule | resolved | Verified: page.tsx has no comment lines left. |
| c18c79f7696856db2d1882717b51c48b94511101 | F3 | Edit button shown without the edit right | resolved | Verified: page.tsx:108 adds the Actions column only when canEdit is true. |
| c18c79f7696856db2d1882717b51c48b94511101 | F4 | Empty Actions column without edit right | resolved | Verified: page.tsx:108 adds the column only when canEdit is true, so none is left empty. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed (current code, which still matches the commit for this file) |
| green | npx eslint page.tsx | passed: no errors or warnings |
| grey | tests | not run: no test script configured |

### gaps (3)

- No browser test: the view-only case (five columns) and the editor case (six columns with a working edit button) were read from the code, not tried.
- The checkout is now at d616233a; this commit's file has no changes since, so the checks ran on the same code.
- I checked that rights are loaded before the page renders (PermissionGuard uses the same rights query), so the Actions column should not pop in late, but I did not watch it load.

### info (3)

- One earlier finding is still open: the form recognises unreadable saved keys by the backend's message text (integration-group-form.tsx:154).
- The earlier shared Badge and table-row styling change was kept on purpose.
- The click handler on the table body does nothing for view-only users, since no cell has the edit tag.

---

## howismycommit-47

| Field | Value |
|---|---|
| id | howismycommit-47 |
| generatedAt | 2026-11-13T14:51:57+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 687f0683b496f5b86359bb799905c4cf6d706cf7 |
| files.changed | 4 |
| files.added | 0 |
| files.modified | 4 |
| files.deleted | 0 |
| files.insertions | 70 |
| files.deletions | 33 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 2 |
| summary.info | 3 |
| before | The API key modal always fetched saved keys, set autoComplete off on the key inputs, showed a read error under the fields, and required keys only for providers with nothing saved. The page showed the edit button to every viewer, and every save invalidated the whole page list. |
| after | Keys are fetched only while the integration is on, and key fields are required whenever it is on. A saved row that cannot be read keeps the form usable, while other load errors show a Retry box and disable Save. The edit button needs the edit right and has a name, the key save drops its variables from the cache, and the pagination margin added earlier is gone. |

### changeType (3)

- bug fix
- UI
- security

### effects (4)

- Switching an integration off now skips the key request and the key validation
- A failed key load (403, 404, 500 other than the unreadable-row message) blocks Save until Retry works or the integration is switched off
- Only the credentials queries are refreshed after the key save; the final selection save still refreshes the page list
- Users without the edit right no longer see the edit button, and the Actions column stays empty for them

### filesReviewed (4)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx | modified | amber | F1 |
| src/app/(app)/(main)/configuration/external-apis/page.tsx | modified | green | no issues in this commit |
| src/features/configurations/external-apis/hooks.ts | modified | green | no issues |
| src/components/data-table/data-table-pagination.tsx | modified | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Unreadable keys detected by message text |
| location | src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx:152 |
| problem | The form decides the saved keys are unreadable by comparing the error message to a fixed sentence. If the backend wording changes, the error looks like any other load failure. |
| impact | The Retry box shows and Save is disabled, so the user cannot enter new keys to replace the broken row. The only way out is to switch the integration off. |
| fix | Match on a status or error code from the backend instead of the sentence, or have the backend send a stable code. |
| evidence | credentialsQuery.isError && credentialsQuery.error.message === UNREADABLE_SAVED_KEYS_MESSAGE |
| status | resolved |
| resolvedIn | f17bc85dc5248b877ce13b335fdfb995a4257323 |
| resolvedAt | 2026-11-23T05:06:35.474Z |
| resolvedNote | Resolved: the form checks errorCode CREDENTIALS_UNREADABLE first (src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx:55<br>57), and the backend now sends that code with 422 (external-apis.service.ts:475), so rewording the message no longer breaks it. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |
| future | true |

### previousFindings (11)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 6b160d56 | F1 | Autofill may drop login password into keys | resolved | No autoComplete prop remains in integration-group-form.tsx, and src/components/form/form-password-input.tsx:32 sets autoComplete new-password. |
| 6b160d56 | F2 | Typed keys stay in memory after save | resolved | src/features/configurations/external-apis/hooks.ts:64 sets gcTime: 0. |
| 6b160d56 | F3 | Page list refetched twice per save | resolved | src/features/configurations/external-apis/hooks.ts:79 invalidates only the credentials queries. |
| 6b160d56 | F4 | Unrequested global pagination spacing change | resolved | src/components/data-table/data-table-pagination.tsx:28 no longer has mt-2. |
| 6b160d56 | F5 | Credentials fetched while fields hidden | resolved | integration-group-form.tsx:126 passes the group id only when the integration is on. |
| 6b160d56 | F6 | Comments against the AGENTS.md rule | resolved | The old describing comments are gone from integration-group-form.tsx. |
| 6b160d56 | F7 | Unreadable keys detected by message text | open | integration-group-form.tsx:152 still compares the error message to a fixed sentence (now F1 here). |
| c18c79f7696856db2d1882717b51c48b94511101 | F1 | Page restyle changed shared Badge and TableRow for the whole app | open | src/components/ui/badge.tsx:9 still has rounded-md and the TableRow focus classes are still removed. |
| c18c79f7696856db2d1882717b51c48b94511101 | F2 | Comments against the AGENTS.md rule | open | page.tsx:49 and three more describing comments are still there. |
| c18c79f7696856db2d1882717b51c48b94511101 | F3 | Edit button shown without the edit right | resolved | page.tsx:100 shows the button only with canEdit and adds an aria-label. |
| c18c79f7696856db2d1882717b51c48b94511101 | F4 | Empty Actions column without edit right | open | page.tsx:100 still renders null in an always-present Actions column. |

### checks (2)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit (FINNAUX2.0-UI) | passed |
| green | bunx eslint external-apis page, hooks, form and pagination | passed |

### gaps (3)

- No test command is configured in the UI repo, so the form and page behaviour was read, not run.
- The modal was not opened in a browser; the unreadable-keys path was traced from the backend message, not triggered.
- This commit is in the FINNAUX2.0-UI repo; the report is saved under the frontend repo.

### info (3)

- This commit is the fix commit for six findings from the review of 6b160d56 (F1 to F6); all six are verified fixed in the current tree.
- A provider whose endpoints list no keys gets a single required apiKey field; no active endpoint in the local database is in that state.
- The working tree matches this commit, so the current score equals the commit score.

---

## howismycommit-46

| Field | Value |
|---|---|
| id | howismycommit-46 |
| generatedAt | 2026-11-13T14:49:59+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | c18c79f7696856db2d1882717b51c48b94511101 |
| files.changed | 3 |
| files.added | 0 |
| files.modified | 3 |
| files.deleted | 0 |
| files.insertions | 101 |
| files.deletions | 70 |
| verdict | review-with-caution |
| score | 88 |
| commitScore | 84 |
| quality | good |
| summary.red | 0 |
| summary.amber | 3 |
| summary.green | 2 |
| summary.info | 3 |
| before | The External APIs page showed integrations as a grid of cards, each with its own edit button and its own Edit Integration dialog. |
| after | The page shows integrations in a data table with pagination and one shared Edit Integration dialog. A click on the Actions cell is caught on the table body and opens the dialog for that row. The shared Badge became rounded-md and TableRow lost its focus outline classes. |

### changeType (2)

- feature
- UI

### effects (4)

- Every Badge in the app (211 files use it) changes from pill to rounded-md
- Every table using TableRow loses its focus outline styling
- Edit opens only from the Actions cell, through a data attribute lookup on the table body
- Enabled and Disabled tabs both render the same table component

### filesReviewed (3)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/external-apis/page.tsx | modified | amber | F2, F3, F4 |
| src/components/ui/badge.tsx | modified | amber | F1 |
| src/components/ui/table.tsx | modified | amber | F1 |

### findings (4)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Page restyle changed shared Badge and TableRow for the whole app |
| location | src/components/ui/badge.tsx:9 |
| problem | To restyle one page, the commit changed rounded-full to rounded-md in the shared Badge and removed focus:outline-primary and last:first:focus:!outline-none from the shared TableRow. |
| impact | All Badge pills across the app turn square-cornered, and every table row loses its focus outline, a keyboard and click focus indicator. |
| fix | Revert both shared components and pass className overrides from the External APIs page, or agree the app-wide change separately. |
| evidence | "inline-flex items-center justify-center rounded-md px-2.5 py-0.5 text-xs font-semibold |
| status | resolved |
| resolvedIn | 91d89422ee574831dd798f51214245313744876a |
| resolvedAt | 2026-11-23T12:25:45.662Z |
| resolvedNote | Fixed in 91d89422: the shared Badge is rounded-full again (src/components/ui/badge.tsx:9) and TableRow has its focus outline back (src/components/ui/table.tsx). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |
| future | false |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Comments against the AGENTS.md rule |
| location | src/app/(app)/(main)/configuration/external-apis/page.tsx:49 |
| problem | Four comments describe how the code works, not a business reason. AGENTS.md says not to add comments unless they explain a non-obvious business reason. |
| impact | Noise that drifts from the code; breaks the repo's stated rule. |
| fix | Delete the four comments. |
| evidence | // Remembers which integration the user is editing; null means the modal stays closed. |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-13T10:05:07.512Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[3] · F3

| Field | Value |
|---|---|
| id | F3 |
| severity | P3 |
| title | Edit button shown without the edit right |
| location | src/app/(app)/(main)/configuration/external-apis/page.tsx:100 |
| problem | At commit time every user who could view the page saw the edit button, and the icon-only button had no accessible name. The backend now needs canEdit to save, so a view-only user would open the dialog and get a 403 on save. |
| impact | View-only users get a dialog they cannot use; screen readers read an unnamed button. |
| fix | Show the button only with canEdit and add an aria-label. |
| evidence | <Button size="sm" variant="ghost" isIcon data-edit-group-id={row.original.id}> |
| status | resolved |
| resolvedIn | 687f0683b496f5b86359bb799905c4cf6d706cf7 |
| resolvedAt | 2026-11-13T00:00:00.000Z |
| resolvedNote | page.tsx:100 shows the button only when canEdit is true and page.tsx:106 adds an aria-label. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[4] · F4

| Field | Value |
|---|---|
| id | F4 |
| severity | P3 |
| title | Empty Actions column without edit right |
| location | src/app/(app)/(main)/configuration/external-apis/page.tsx:100 |
| problem | The Actions column is always added. When the user has no edit right, the cell renders null, so a column with a header and no content stays in the table. This came from the later gating change. |
| impact | A view-only user sees an empty Actions column. |
| fix | Build the columns array without the Actions column when canEdit is false. |
| evidence | canEdit ? (<br>              <Button |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-13T10:05:09.943Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 67aee43b03f4032b2efbd822756123d791a5e7b7 | F1 | Explicit null field overrides fallback | resolved | src/lib/placeholder-data.ts:13 filters out null values before merging. |
| 67aee43b03f4032b2efbd822756123d791a5e7b7 | F2 | Money fallback computed with floats | resolved | src/app/(app)/(main)/dashboard/dashboard-sales/_components/tabs/risk-analysis.tab.tsx:104 now uses PLACEHOLDER_TEXT instead of a computed amount. |

### checks (2)

| status | command | result |
|---|---|---|
| green | bunx tsc --noEmit (FINNAUX2.0-UI) | passed |
| green | bunx eslint page.tsx badge.tsx table.tsx | passed |

### gaps (3)

- No test command is configured in the UI repo, so the new table and dialog behaviour was not run.
- The page was not opened in a browser; the click handling on the table body was read, not exercised.
- This commit is in the FINNAUX2.0-UI repo; the report is saved under the frontend repo.

### info (3)

- Edit opens from any click inside the Actions cell, found by a data attribute on the table body, not by a handler on the button.
- Search ignores apiGroups and the empty list shows NoDataView.
- The working tree has moved on: commits 6b160d56 and 687f0683 follow this one and were reviewed separately.

---

## howismycommit-45

| Field | Value |
|---|---|
| id | howismycommit-45 |
| generatedAt | 2026-11-13T14:46:40+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | 6b160d560971a47f5d2248e7878722196d8137eb |
| files.changed | 4 |
| files.added | 0 |
| files.modified | 4 |
| files.deleted | 0 |
| files.insertions | 199 |
| files.deletions | 17 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 66 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 3 |
| summary.info | 3 |
| before | The Edit Integration modal only saved the enabled switch and the Active API; there was no way to see or save API keys. |
| after | The modal shows one password field per key, filled with the masked saved value, saves only the keys the user typed (keys first, then the selection), and has hooks and types for reading and saving credentials. This commit also let the saved keys load for switched-off integrations and kept typed keys in the mutation cache. |

### changeType (3)

- feature
- ui
- api

### effects (3)

- External APIs modal now calls GET and PUT .../api-groups/:apiGroupId/credentials.
- Every table's pagination gets an extra mt-2 gap.
- Saving keys refreshes the whole page list, and the selection save refreshes it again.

### filesReviewed (4)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx | modified | amber | F7 |
| src/features/configurations/external-apis/hooks.ts | modified | green | no open issues |
| src/features/configurations/external-apis/types.ts | modified | green | no issues |
| src/components/data-table/data-table-pagination.tsx | modified | green | no open issues |

### findings (7)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | Autofill may drop login password into keys |
| location | src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx:203 |
| problem | The key inputs set autoComplete off, which replaces the new-password value the password input sets for itself, so browsers can autofill the saved login password into an API key field. |
| impact | A user could save their own login password as an API key without noticing. |
| fix | Remove the autoComplete prop so the input keeps new-password. |
| evidence | autoComplete="off" |
| status | resolved |
| resolvedIn | 687f0683b496f5b86359bb799905c4cf6d706cf7 |
| resolvedAt | 2026-11-13T09:16:40Z |
| resolvedNote | No autoComplete prop remains in integration-group-form.tsx; the key fields use the default new-password. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Typed keys stay in memory after save |
| location | src/features/configurations/external-apis/hooks.ts:60 |
| problem | The save-keys mutation keeps its variables, including the plain-text keys, in the mutation cache for the default 5 minutes. |
| impact | Plain-text keys stay inspectable in memory (for example in devtools) after the modal closes. |
| fix | Set gcTime to 0 on the mutation. |
| evidence | return useMutation({<br>    mutationFn: async ({<br>      apiGroupId, |
| status | resolved |
| resolvedIn | 687f0683b496f5b86359bb799905c4cf6d706cf7 |
| resolvedAt | 2026-11-13T09:16:40Z |
| resolvedNote | hooks.ts:64 sets gcTime: 0 on useUpsertApiGroupCredentials. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[3] · F3

| Field | Value |
|---|---|
| id | F3 |
| severity | P3 |
| title | Page list refetched twice per save |
| location | src/features/configurations/external-apis/hooks.ts:78 |
| problem | Both the keys save and the selection save invalidate the whole external-apis list. |
| impact | Two list requests per save for no extra information. |
| fix | Invalidate only the saved-keys data after the keys save. |
| evidence | queryClient.invalidateQueries({ queryKey: EXTERNAL_APIS_KEY }) |
| status | resolved |
| resolvedIn | 687f0683b496f5b86359bb799905c4cf6d706cf7 |
| resolvedAt | 2026-11-13T09:16:40Z |
| resolvedNote | hooks.ts:79 now invalidates only the api-group-credentials queries after the keys save. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[4] · F4

| Field | Value |
|---|---|
| id | F4 |
| severity | P3 |
| title | Unrequested global pagination spacing change |
| location | src/components/data-table/data-table-pagination.tsx:28 |
| problem | An mt-2 was added to the shared pagination, changing the spacing of every table in the app. |
| impact | Unplanned visual shift on all tables. |
| fix | Remove the mt-2. |
| evidence | <div className="mt-2 flex w-full flex-shrink-0 items-center justify-end"> |
| status | resolved |
| resolvedIn | 687f0683b496f5b86359bb799905c4cf6d706cf7 |
| resolvedAt | 2026-11-13T09:16:40Z |
| resolvedNote | data-table-pagination.tsx:28 no longer has mt-2. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[5] · F5

| Field | Value |
|---|---|
| id | F5 |
| severity | P3 |
| title | Credentials fetched while fields hidden |
| location | src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx:125 |
| problem | The saved-keys request ran as soon as a provider was selected, even when the integration was switched off. |
| impact | A wasted request on every open of a disabled integration, and a visible 403 for users without rights. |
| fix | Pass the API group id only when the integration is on. |
| evidence | const credentialsQuery = useApiGroupCredentials(apiGroupId ?? null) |
| status | resolved |
| resolvedIn | 687f0683b496f5b86359bb799905c4cf6d706cf7 |
| resolvedAt | 2026-11-13T09:16:40Z |
| resolvedNote | integration-group-form.tsx:126 passes isEnabled ? apiGroupId : null. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[6] · F6

| Field | Value |
|---|---|
| id | F6 |
| severity | P3 |
| title | Comments against the AGENTS.md rule |
| location | src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx:40 |
| problem | Many comments only described what the code does, but AGENTS.md allows comments only for a non-obvious business reason. |
| impact | Noise that drifts out of date. |
| fix | Keep only comments that explain a business reason. |
| evidence | // Refill the key inputs whenever the user picks another provider or its saved keys arrive. |
| status | resolved |
| resolvedIn | 687f0683b496f5b86359bb799905c4cf6d706cf7 |
| resolvedAt | 2026-11-13T09:16:40Z |
| resolvedNote | integration-group-form.tsx now keeps only comments on the unreadable-keys message, the changed-keys rule and the save order. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[7] · F7

| Field | Value |
|---|---|
| id | F7 |
| severity | P3 |
| title | Unreadable keys detected by message text |
| location | src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx:152 |
| problem | A later change in this file decides the saved keys are unreadable by comparing the error message to a fixed sentence. |
| impact | If the backend rewords that message, a user with broken saved keys sees the blocking Retry box and cannot save new keys. |
| fix | Match on a status or error code from the backend instead of the sentence, or have the backend send a stable code. |
| evidence | credentialsQuery.isError && credentialsQuery.error.message === UNREADABLE_SAVED_KEYS_MESSAGE |
| status | resolved |
| resolvedIn | f17bc85dc5248b877ce13b335fdfb995a4257323 |
| resolvedAt | 2026-11-23T05:06:35.474Z |
| resolvedNote | Resolved: the form checks errorCode CREDENTIALS_UNREADABLE first (src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx:55<br>57), and the backend now sends that code with 422 (external-apis.service.ts:475), so rewording the message no longer breaks it. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |
| future | true |

### previousFindings (0)

_Empty._

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed (current code) |
| green | npx eslint <the 4 files of the commit> | passed: no errors or warnings (current code) |
| grey | tests | not run: no test script configured |

### gaps (3)

- The working tree has moved on since this commit (later commit 687f0683b496f5b86359bb799905c4cf6d706cf7 changed 3 of its files), so the score and verdict describe the current code; commitScore keeps the score as committed.
- The 7 findings were found by reading the diff and the current files, not by running the page; no browser or backend test was done.
- The earlier reports of the 5 commits before this one had no findings left open on these files, so nothing was carried over.

### info (3)

- Six of the seven findings are fixed in the current code; only F7 is open, and it comes from a later change in the same file.
- The query key text api-group-credentials is written in two places in hooks.ts.
- The commit's behaviour matches the backend contract for reading and saving keys.

---

## howismycommit-44

| Field | Value |
|---|---|
| id | howismycommit-44 |
| generatedAt | 2026-11-13T14:42:10+05:30 |
| author | Dhruv |
| branch | feat/external-apis |
| target.kind | commit |
| target.commit | a79d9545e7eff3a7dc007946c77fbd1b38eca06a |
| files.changed | 4 |
| files.added | 0 |
| files.modified | 4 |
| files.deleted | 0 |
| files.insertions | 70 |
| files.deletions | 33 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 3 |
| summary.info | 3 |
| before | The External APIs modal fetched saved keys even for switched-off integrations, kept typed keys in the mutation cache, refetched the page list twice per save, let browsers autofill into the key fields, and showed the edit button to everyone. |
| after | The modal fetches saved keys only when the integration is on, blocks Save with a Retry box when loading them fails (but stays usable when saved keys are unreadable), and no longer overrides the password input's autofill setting. The edit button has a label and shows only with the page's edit right, keys are not kept after saving, and saving keys refreshes only the saved-keys data. |

### changeType (3)

- feature
- bug fix
- ui

### effects (4)

- External APIs page: the Actions column is empty for users without the edit right, and they cannot open the modal.
- Every table's pagination loses the mt-2 gap, which restores what dev had before this branch.
- Backend is unchanged: the integration-group PUT route still has no page-rights check, so hiding the button is UI only.
- This commit was later amended: the same tree is now be035c72 on feat/external-apis with a new message; a79d9545 is no longer on any branch.

### filesReviewed (4)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/external-apis/page.tsx | modified | amber | F1 |
| src/app/(app)/(main)/configuration/external-apis/_components/integration-group-form.tsx | modified | green | no issues |
| src/features/configurations/external-apis/hooks.ts | modified | green | no issues |
| src/components/data-table/data-table-pagination.tsx | modified | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Empty Actions column without edit right |
| location | src/app/(app)/(main)/configuration/external-apis/page.tsx:95 |
| problem | When the user lacks the edit right, the edit button is not rendered but the Actions column and its header stay, so every row shows an empty cell. |
| impact | View-only users see a column titled Actions that does nothing, which looks broken. |
| fix | Add the Actions column to the columns array only when canEdit is true. |
| evidence | cell: ({ row }) =><br>            canEdit ? ( |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-13T10:05:19.900Z |
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
| green | npx tsc --noEmit | passed |
| green | npx eslint <4 files of the commit> | passed: no errors or warnings |
| grey | tests | not run: no test script configured |

### gaps (3)

- The checkout now holds the amended commit be035c72, which has the same tree as a79d9545 (git diff shows no change), so the checks ran on identical code.
- No page was opened in a browser, so the modal, the Retry box and the hidden edit button were not tried.
- Nothing was tested against the live backend routes.

### info (3)

- Hiding the edit button is not access control: the integration-group PUT route needs only a login, per the backend contract.
- The query key string api-group-credentials is written in two places in hooks.ts; a rename in one would stop the invalidation.
- The unreadable-keys case is recognised by matching the backend's message text, so rewording it would block Save.

---

## howismycommit-43

| Field | Value |
|---|---|
| id | howismycommit-43 |
| generatedAt | 2026-11-12T18:27:13+05:30 |
| author | Dhruv |
| branch | feat/dashboard |
| target.kind | commit |
| target.commit | 804625ce2d7a2d372fd72ea313e6c79e97290bcc |
| files.changed | 4 |
| files.added | 0 |
| files.modified | 4 |
| files.deleted | 0 |
| files.insertions | 12 |
| files.deletions | 10 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 3 |
| summary.info | 3 |
| before | The Collections and Sales Advanced hooks mixed the API answer over the placeholder data, so a field sent as null erased its placeholder. The Sales Risk tab worked out the average loan amount in the browser when the backend text was missing. |
| after | One shared withFallback helper drops null fields before mixing, so placeholders survive them, and both hook files use it. The average loan amount card shows only the backend text, or ABC when it is missing. |

### changeType (2)

- bug fix
- refactor

### effects (3)

- All 8 Collections hooks and the Sales Advanced hook now ignore null fields from the backend.
- Sales Risk tab: Avg Loan Amount shows ABC whenever avgLoanAmountDisplay is not sent; the local API checkout sends it (nbfc-dashboard.service.ts:3547), the deployed backend was not checked.
- src/lib/placeholder-data.ts gains one exported helper; nothing outside the dashboard uses it.

### filesReviewed (4)

| path | change | status | note |
|---|---|---|---|
| src/lib/placeholder-data.ts | modified | green | no issues |
| src/features/collections-dashboard/hooks.ts | modified | green | no issues |
| src/features/nbfc-dashboard/hooks.ts | modified | green | no issues |
| src/app/(app)/(main)/dashboard/dashboard-sales/_components/tabs/risk-analysis.tab.tsx | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 67aee43b03f4032b2efbd822756123d791a5e7b7 | F1 | Explicit null field overrides fallback | resolved | src/lib/placeholder-data.ts:11 now drops null fields before spreading, used by both hooks files. |
| 67aee43b03f4032b2efbd822756123d791a5e7b7 | F2 | Money fallback computed with floats | resolved | risk-analysis.tab.tsx:104 shows avgLoanAmountDisplay ?? PLACEHOLDER_TEXT with no float maths. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <4 changed files> | passed: no errors or warnings |
| grey | tests | not run: no test script configured |

### gaps (2)

- Nothing was tried against a live backend and no page was opened in a browser.
- Whether the deployed backend already sends avgLoanAmountDisplay was not verified; only the local API checkout was read.

### info (3)

- withFallback only checks the top level: a null or missing field inside an object (for example one of the insights numbers) or inside a list item is not replaced.
- An answer that is a plain array or non-object would be spread by index; the types say it is an object, so this is theoretical.
- The commit has no tests and the project has no test script.

---

## howismycommit-42

| Field | Value |
|---|---|
| id | howismycommit-42 |
| generatedAt | 2026-11-12T15:02:26+05:30 |
| author | Dhruv |
| branch | feat/dashboard |
| target.kind | commit |
| target.commit | e921ffc6517a9a2eb8e98a7a1382204518db747f |
| files.changed | 40 |
| files.added | 0 |
| files.modified | 0 |
| files.deleted | 0 |
| files.insertions | 2230 |
| files.deletions | 69 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 3 |
| summary.info | 3 |
| before | feat/dashboard had the dashboard work from commit 67aee43b but was behind the dev branch (merged to main as e1040a41). |
| after | feat/dashboard now also holds everything from dev (two-factor login, audit logs, CRM management, company logo, locations paging, and more) merged with no conflicts; the dashboard files are unchanged by the merge. |

### changeType (3)

- feature
- refactor
- config

### effects (3)

- The merge result equals dev plus the dashboard commit only: a diff against e1040a41 touches 25 dashboard and placeholder files and nothing else, so no dev code was altered or dropped.
- package.json and package-lock.json now carry the dependencies that dev added.
- Login page, navbar, settings panel, configuration pages, CRM, customers and the data-table hooks come from dev and were not reviewed line by line here.

### filesReviewed (2)

| path | change | status | note |
|---|---|---|---|
| merge result vs dev (25 dashboard and placeholder files) | modified | green | no issues; already covered by howismycommit-41 |
| files that came from dev (about 40 files, 2230 insertions) | added | green | no issues found in merge mechanics; contents not reviewed line by line |

### findings (0)

_Empty._

### previousFindings (3)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 67aee43b03f4032b2efbd822756123d791a5e7b7 | F1 | Explicit null field overrides fallback | open | Still present at src/features/collections-dashboard/hooks.ts:17 (`{ ...fallback, ...row }`). |
| 67aee43b03f4032b2efbd822756123d791a5e7b7 | F2 | Money fallback computed with floats | open | Still present at src/app/(app)/(main)/dashboard/dashboard-sales/_components/tabs/risk-analysis.tab.tsx:104. |
| 33d2e2a4d37d356cd36316d1e2ebe425e2e8abdf | F1 | Export totals cover the whole report, rows only the search | uncertain | Marked resolved earlier; the original call is still at src/app/(app)/(main)/reports-user/_shared/visible-file-actions.tsx:31 and the fix may live elsewhere, so it could not be confirmed. |

### checks (4)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <38 .ts/.tsx files changed by the merge against the first parent> | passed: no errors or warnings |
| green | git grep conflict markers in src at the commit | none found |
| grey | tests | not run: no test script configured |

### gaps (3)

- Code that came from dev was not reviewed line by line; it was reviewed upstream.
- No page was opened in a browser, so login, audit logs and CRM screens were not tried after the merge.
- npm install was not run, so the package.json and lock file changes were not checked against a fresh install.

### info (3)

- This is a merge commit: parents are 67aee43b (feat/dashboard) and e1040a41 (main).
- The two Low findings from the dashboard commit are still open in the current code.
- No tests exist for the merged code; none are configured in the project.

---

## howismycommit-41

| Field | Value |
|---|---|
| id | howismycommit-41 |
| generatedAt | 2026-11-12T14:56:30+05:30 |
| author | Dhruv |
| branch | feat/dashboard |
| target.kind | commit |
| target.commit | 67aee43b03f4032b2efbd822756123d791a5e7b7 |
| files.changed | 25 |
| files.added | 6 |
| files.modified | 17 |
| files.deleted | 2 |
| files.insertions | 666 |
| files.deletions | 438 |
| verdict | review-with-caution |
| score | 92 |
| commitScore | 92 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 1 |
| summary.info | 3 |
| before | Collections and Sales dashboard tabs and sidebars drew their numbers and dropdown options from two local mock-data files and hardcoded literals. |
| after | Collections KPI cards and 7 tabs, plus the Sales Advanced tab, read from new typed API hooks and show placeholder values (0, ABC) until the backend answers or if the call fails; sidebar branch, product and agent options come from the API. |

### changeType (3)

- feature
- refactor
- ui

### effects (4)

- Collections dashboard now calls 8 new /nbfc-dashboard/collections/* endpoints and the Sales Advanced tab calls /nbfc-dashboard/sales/advanced; none exist in the backend yet, so each fails and keeps placeholders.
- The two mock-data.ts files are deleted; no other file imports them (tsc passed on the pre-commit tree).
- New shared helper src/lib/placeholder-data.ts is used only by dashboard code.
- Sidebar filter choices are local state only and are not sent to any API.

### filesReviewed (19)

| path | change | status | note |
|---|---|---|---|
| src/features/collections-dashboard/hooks.ts | added | amber | F1 |
| src/app/(app)/(main)/dashboard/dashboard-sales/_components/tabs/risk-analysis.tab.tsx | modified | amber | F2 |
| src/features/nbfc-dashboard/hooks.ts | modified | amber | F1 |
| src/features/collections-dashboard/api.ts | added | green | no issues |
| src/features/collections-dashboard/fallback.ts | added | green | no issues |
| src/features/collections-dashboard/queries.ts | added | green | no issues |
| src/features/collections-dashboard/types.ts | added | green | no issues |
| src/features/nbfc-dashboard/fallback.ts | added | green | no issues |
| src/lib/placeholder-data.ts | added | green | no issues |
| src/app/(app)/(main)/dashboard/dashboard-collections/page.tsx | modified | green | no issues |
| src/app/(app)/(main)/dashboard/dashboard-collections/_components/filter-sidebar.tsx | modified | green | no issues |
| src/app/(app)/(main)/dashboard/dashboard-collections/_components/tabs/*.tab.tsx (7 files) | modified | green | no issues |
| src/app/(app)/(main)/dashboard/dashboard-sales/_components/filter-sidebar.tsx | modified | green | no issues |
| src/app/(app)/(main)/dashboard/dashboard-sales/_components/tabs/advanced.tab.tsx | modified | green | no issues |
| src/features/nbfc-dashboard/api.ts | modified | green | no issues |
| src/features/nbfc-dashboard/queries.ts | modified | green | no issues |
| src/features/nbfc-dashboard/types.ts | modified | green | no issues |
| src/app/(app)/(main)/dashboard/dashboard-collections/mock-data.ts | deleted | green | no issues |
| src/app/(app)/(main)/dashboard/dashboard-sales/mock-data.ts | deleted | green | no issues |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Explicit null field overrides fallback |
| location | src/features/collections-dashboard/hooks.ts:16 |
| problem | The merge `{ ...fallback, ...row }` fills missing keys, but a key the backend sends as null (for example monthlyTrend: null) replaces the fallback array with null. The tabs then call .map or read fields on null. |
| impact | One Collections tab, or the KPI cards on the page, would crash once the backend returns a row with a null field. The same pattern is in nbfc-dashboard/hooks.ts for Sales Advanced. |
| fix | Merge per field and keep the fallback when a value is null, e.g. drop null entries from row before spreading. |
| evidence | (row: T \| null \| undefined): T => ({ ...fallback, ...row }) |
| status | resolved |
| resolvedIn | 804625ce2d7a2d372fd72ea313e6c79e97290bcc |
| resolvedAt | 2026-11-12T12:57:13.427Z |
| resolvedNote | src/lib/placeholder-data.ts:11 drops null fields before spreading, and both hooks now use it (collections-dashboard/hooks.ts:17, nbfc-dashboard/hooks.ts:7). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Money fallback computed with floats |
| location | src/app/(app)/(main)/dashboard/dashboard-sales/_components/tabs/risk-analysis.tab.tsx:103 |
| problem | When avgLoanAmountDisplay is not sent, the card formats avgLoanAmount in the browser with division and toFixed, which the project rules forbid for money. |
| impact | Average loan amount can show a rounded or inconsistent figure compared with other money on the dashboard until the backend sends the formatted string. |
| fix | Show the API string only, with the placeholder text when it is missing, once the backend sends avgLoanAmountDisplay. |
| evidence | {riskAnalysis.avgLoanAmountDisplay ??<br>                    `₹${(riskAnalysis.avgLoanAmount / 100000).toFixed(1)}L`} |
| status | resolved |
| resolvedIn | 804625ce2d7a2d372fd72ea313e6c79e97290bcc |
| resolvedAt | 2026-11-12T12:57:13.427Z |
| resolvedNote | src/app/(app)/(main)/dashboard/dashboard-sales/_components/tabs/risk-analysis.tab.tsx:104 now shows avgLoanAmountDisplay ?? PLACEHOLDER_TEXT, with no division or toFixed. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 33d2e2a4d37d356cd36316d1e2ebe425e2e8abdf | F1 | Export totals cover the whole report, rows only the search | uncertain | Report code is not in the dashboard commit and the checkout is now on main, so the current code could not be compared. |
| 46a31b163d25e0355a0a919b662e0ac27f23acd4 | F1 | Settings drawer title is empty | uncertain | Unrelated to the dashboard files and the checkout is now on main, so the current code could not be compared. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed on the same code before the commit (uncommitted tree, 0 errors) |
| grey | npx eslint <commit files> | not run on the commit: the checkout switched to main during the review, so the files are absent; the same code passed eslint with no errors earlier |
| grey | tests | not run: no test script configured |

### gaps (3)

- The checkout moved from feat/dashboard to main while this review ran, so tsc and eslint were not re-run on the commit itself.
- Nothing was tested against a live backend; the 9 new endpoints do not exist in the API yet.
- No UI was opened in a browser during this review.

### info (3)

- Sidebar filters are local state and never sent to the API (hooks are called without filters).
- Missing endpoints fail and retry per query, so every dashboard load makes several failing requests.
- The Region and Process Stage dropdowns include a selectable 'ABC' placeholder option.

---

## howismycommit-40

| Field | Value |
|---|---|
| id | howismycommit-40 |
| generatedAt | 2026-11-05T15:36:26+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | 33d2e2a4d37d356cd36316d1e2ebe425e2e8abdf |
| files.changed | 14 |
| files.added | 2 |
| files.modified | 12 |
| files.deleted | 0 |
| files.insertions | 270 |
| files.deletions | 68 |
| verdict | looks-good |
| score | 100 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 5 |
| before | Report screens always showed the title 'My Reports'. Report Builder exports named columns by their internal ids, and both exports held raw API values with the column names in row 1. My Reports fetched the whole report again from the server to print or export. |
| after | The heading shows the run report's name and a date line ('Report till ...' or 'Report from ... to ...'). Both exports put the report name in row 1, the date line in row 2 and the shown column names in row 3, with dates as dd-mm-yyyy and decimals cut to two places. My Reports prints and exports the loaded rows that match the search, without a server call. |

### changeType (2)

- feature
- UI

### effects (5)

- My Reports and Report Builder headings
- Print and Export in both report screens
- FileActions can now take data directly (getData); the route path still works for other screens
- exportToXLSX and exportToCSV take optional leading rows and a two-decimal option; HRMS callers are unchanged
- exportTanstackTableData can use shown header names and a cell formatter

### filesReviewed (14)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/reports-user/_shared/report-heading.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/report-results.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/use-report-filters.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/visible-file-actions.tsx | added | amber | F1 |
| src/app/(app)/(main)/reports-user/my-reports/_components/my-reports-view.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/index.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/report-actions.tsx | modified | green | no issues |
| src/components/data-table/data-table-export-button.tsx | modified | green | no issues |
| src/components/file-actions.tsx | modified | green | no issues |
| src/features/reports/reports-builder/file-data.ts | modified | green | no issues |
| src/features/reports/reports-builder/types.ts | modified | green | no issues |
| src/lib/export-tanstack-table-data.ts | modified | green | no issues |
| src/lib/file.ts | modified | green | no issues |
| src/lib/format-value.ts | modified | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Export totals cover the whole report, rows only the search |
| location | src/app/(app)/(main)/reports-user/_shared/visible-file-actions.tsx:31 |
| problem | My Reports Print and Export now take only the rows that match the search box, but the totals row still comes from the server's totals for the whole report. |
| impact | With a search applied, the file lists, say, 3 of 500 rows and a Sum for all 500, so the totals do not add up to the rows above them. |
| fix | Leave the totals row out when a search filter is active, or label it 'Report total (all rows)', until the server export API exists. |
| evidence | getData={() => tableToFileData(table, { title, subtitle, totals })} |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-05T09:46:17.590Z |
| resolvedNote | Verified fixed: tableToFileData leaves the totals out while a search or column filter is active (src/features/reports/reports-builder/file-data.ts footer: isFiltered ? undefined : totalsToFooter). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 33d2e2a4d37d356cd36316d1e2ebe425e2e8abdf | F1 | Export totals cover the whole report, rows only the search | resolved | file-data.ts drops the totals row when a search or column filter is active (isFiltered at file-data.ts:38-39, footer at :52; fixed in 1e1d7d52). |
| 46a31b163d25e0355a0a919b662e0ac27f23acd4 | F1 | Settings drawer title is empty | resolved | user-settings-panel.tsx:127 holds the text 'User Settings' with sr-only. |

### checks (4)

| status | command | result |
|---|---|---|
| green | npx eslint <14 files of the commit> | passed |
| green | test with a sample table in Node: search and no search | passed: with a search the file has the matching rows and no totals row; without it the totals row is there |
| green | npx tsc --noEmit | passed (run earlier in this session on this code) |
| grey | tests | not run: no test script is configured in package.json (CLAUDE.md) |

### gaps (2)

- The export files were checked with sample data in Node, not by clicking Export in the app (it needs a login).
- The heading and date line were read from code only.

### info (5)

- formatExportValue turns decimal text into a number so Excel can add it up. Amounts longer than about 15 significant digits would lose digits; this is a trade-off against the project's money-as-text rule.
- Report Builder export takes rows in their filtered order but not the on-screen sort (exportTanstackTableData uses getFilteredRowModel), while My Reports follows the sort. This was already the case before.
- A whole number that came from decimal text, such as 12.000000004, exports as 12 rather than 12.00.
- Both exports carry a TODO to move to a server pagination or full report API; the user asked for these.
- Re-run on the current code: the one finding of howismycommit-37 was fixed after the commit by 1e1d7d52, so only the commit's own score (91) still carries it.

---

## howismycommit-39

| Field | Value |
|---|---|
| id | howismycommit-39 |
| generatedAt | 2026-11-05T15:19:35+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | 1e1d7d5288bf06255289f15bee2299f6075f28b8 |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 5 |
| files.deletions | 1 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 4 |
| before | My Reports Print and Export always added the server's totals row, even when a search or column filter hid rows, so the totals did not add up to the rows in the file. |
| after | The totals row is left out of the file while a search or column filter is active, and kept when nothing is filtered. |

### changeType (1)

- bug fix

### effects (2)

- My Reports Print and Export (both go through tableToFileData)
- Report Builder export is not affected: it never had a totals row

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| src/features/reports/reports-builder/file-data.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 33d2e2a4d37d356cd36316d1e2ebe425e2e8abdf | F1 | Export totals cover the whole report, rows only the search | resolved | file-data.ts:38-40 reads globalFilter and columnFilters from the table state and file-data.ts:52 drops the footer when either is set (fixed in 1e1d7d52). |
| 46a31b163d25e0355a0a919b662e0ac27f23acd4 | F1 | Settings drawer title is empty | resolved | user-settings-panel.tsx:127 holds the text 'User Settings' with sr-only. |

### checks (4)

| status | command | result |
|---|---|---|
| green | npx eslint src/features/reports/reports-builder/file-data.ts | passed |
| green | test with a sample table in Node: search 'jaipur' and no search | passed: with the search the file has 3 rows and no totals row; with the search cleared it has all rows and the totals row |
| green | npx tsc --noEmit | passed (run earlier in this session on this code) |
| grey | tests | not run: no test script is configured in package.json (CLAUDE.md) |

### gaps (2)

- The check was run on a sample table, not by clicking Export in the app (it needs a login).
- The table on screen still shows the server totals in its footer while a search is applied; this commit only changes the file.

### info (4)

- The data table context passes both globalFilter and columnFilters into the table state (data-table-context.tsx:118-119), so the new check sees them.
- A search made of spaces counts as no search, because the text is trimmed first.
- The TODO to use a server pagination or full report API is still in place, as the user asked.
- Once the server export API exists, filtered files can get their own totals back.

---

## howismycommit-38

| Field | Value |
|---|---|
| id | howismycommit-38 |
| generatedAt | 2026-11-05T15:13:28+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | 4546f109aab7eca0de78d8ca99ef851de392e180 |
| files.changed | 6 |
| files.added | 0 |
| files.modified | 6 |
| files.deleted | 0 |
| files.insertions | 63 |
| files.deletions | 20 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 4 |
| before | UCRF grids decided each column's side from the one page on screen, so a column could jump between right and left while paging. Report Builder and My Reports cut decimals through a JS number, which dropped trailing zeros (12.000000004 showed 12) and could change long numbers. |
| after | UCRF grids remember each column's side for the whole report: the first page with a value decides, dates and coded fields are always left, and a new report starts fresh. Report Builder and My Reports format numbers with the same text-cutting helper as UCRF, so 12.000000004 shows 12.00 and long numbers keep their digits. |

### changeType (2)

- bug fix
- UI

### effects (3)

- UCRF consumer and commercial grids: column alignment while paging
- Report Builder and My Reports table cells and their search text
- Footer totals are unchanged and still use their own maths

### filesReviewed (6)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/reports-user/_shared/report-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-commercial-grid-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-commercial-report-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-grid-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx | modified | green | no issues |
| src/features/reports/ucrf/ucrf-grid-format.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 33d2e2a4d37d356cd36316d1e2ebe425e2e8abdf | F1 | Export totals cover the whole report, rows only the search | open | visible-file-actions.tsx:31 still passes the server totals with the search-filtered rows, so it is still open. |
| 46a31b163d25e0355a0a919b662e0ac27f23acd4 | F1 | Settings drawer title is empty | resolved | user-settings-panel.tsx:127 holds the text 'User Settings' with sr-only. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx eslint <6 files of the commit> | passed |
| green | npx tsc --noEmit | passed (run earlier in this session on this code) |
| grey | tests | not run: no test script is configured in package.json (CLAUDE.md) |

### gaps (2)

- The alignment memory and number formatting were tested with sample data in Node, not by paging a real UCRF grid in the app.
- Paging behaviour with the server's real page sizes was not checked.

### info (4)

- The first page with a value decides a column's side. If that page has a non-number such as N/A in a numeric column, the column stays left for the whole report; the reverse case (right, then N/A) also stays right.
- The memory is a Map filled while the columns are built inside useMemo. Filling it twice gives the same result, so React's double render in development is harmless.
- This commit fixes the two open findings of f88be9b9 (UCRF per-page alignment, numbers through a float). That commit is outside the 5 earlier commits checked here, so its report was not updated; the next review of f88be9b9 will mark them.
- The useMemo for the memory has an eslint-disable for exhaustive-deps, with a comment: the filters are only the reset trigger.

---

## howismycommit-37

| Field | Value |
|---|---|
| id | howismycommit-37 |
| generatedAt | 2026-11-05T15:11:08+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | 33d2e2a4d37d356cd36316d1e2ebe425e2e8abdf |
| files.changed | 14 |
| files.added | 2 |
| files.modified | 12 |
| files.deleted | 0 |
| files.insertions | 270 |
| files.deletions | 68 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 2 |
| summary.info | 5 |
| before | Report screens always showed the title 'My Reports'. Report Builder exports named columns by their internal ids, and both exports held raw API values with the column names in row 1. My Reports fetched the whole report again from the server to print or export. |
| after | The heading shows the run report's name and a date line ('Report till ...' or 'Report from ... to ...'). Both exports put the report name in row 1, the date line in row 2 and the shown column names in row 3, with dates as dd-mm-yyyy and decimals cut to two places. My Reports prints and exports the loaded rows that match the search, without a server call. |

### changeType (2)

- feature
- UI

### effects (5)

- My Reports and Report Builder headings
- Print and Export in both report screens
- FileActions can now take data directly (getData); the route path still works for other screens
- exportToXLSX and exportToCSV take optional leading rows and a two-decimal option; HRMS callers are unchanged
- exportTanstackTableData can use shown header names and a cell formatter

### filesReviewed (14)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/reports-user/_shared/report-heading.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/report-results.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/use-report-filters.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/visible-file-actions.tsx | added | amber | F1 |
| src/app/(app)/(main)/reports-user/my-reports/_components/my-reports-view.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/index.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/report-actions.tsx | modified | green | no issues |
| src/components/data-table/data-table-export-button.tsx | modified | green | no issues |
| src/components/file-actions.tsx | modified | green | no issues |
| src/features/reports/reports-builder/file-data.ts | modified | green | no issues |
| src/features/reports/reports-builder/types.ts | modified | green | no issues |
| src/lib/export-tanstack-table-data.ts | modified | green | no issues |
| src/lib/file.ts | modified | green | no issues |
| src/lib/format-value.ts | modified | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Export totals cover the whole report, rows only the search |
| location | src/app/(app)/(main)/reports-user/_shared/visible-file-actions.tsx:31 |
| problem | My Reports Print and Export now take only the rows that match the search box, but the totals row still comes from the server's totals for the whole report. |
| impact | With a search applied, the file lists, say, 3 of 500 rows and a Sum for all 500, so the totals do not add up to the rows above them. |
| fix | Leave the totals row out when a search filter is active, or label it 'Report total (all rows)', until the server export API exists. |
| evidence | getData={() => tableToFileData(table, { title, subtitle, totals })} |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-05T09:46:17.590Z |
| resolvedNote | Verified fixed: tableToFileData leaves the totals out while a search or column filter is active (src/features/reports/reports-builder/file-data.ts footer: isFiltered ? undefined : totalsToFooter). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 46a31b163d25e0355a0a919b662e0ac27f23acd4 | F1 | Settings drawer title is empty | resolved | user-settings-panel.tsx:127 holds the text 'User Settings' with sr-only. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx eslint <14 files of the commit> | passed |
| green | npx tsc --noEmit | passed (run in /committable on this same code just before the commit) |
| grey | tests | not run: no test script is configured in package.json (CLAUDE.md) |

### gaps (2)

- The export files were checked with sample data in Node, not by clicking Export in the app (it needs a login).
- The heading and date line were read from code only.

### info (5)

- formatExportValue turns decimal text into a number so Excel can add it up. Amounts longer than about 15 significant digits would lose digits; this is a trade-off against the project's money-as-text rule.
- Report Builder export takes rows in their filtered order but not the on-screen sort (exportTanstackTableData uses getFilteredRowModel), while My Reports follows the sort. This was already the case before.
- A whole number that came from decimal text, such as 12.000000004, exports as 12 rather than 12.00.
- Both exports carry a TODO to move to a server pagination or full report API; the user asked for these.
- The home-page test toast button is not part of this commit.

---

## howismycommit-36

| Field | Value |
|---|---|
| id | howismycommit-36 |
| generatedAt | 2026-11-05T12:02:27+05:30 |
| author | Dhruv |
| branch | test/secpen |
| target.kind | commit |
| target.commit | f10ede60be90cb55e8e4aa83d0c505dd92912186 |
| files.changed | 43 |
| files.added | 35 |
| files.modified | 8 |
| files.deleted | 0 |
| files.insertions | 2575 |
| files.deletions | 74 |
| verdict | looks-good |
| score | 100 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 5 |
| before | The dhruv branch did not have the dev work: the report builder pages and data hooks, the shared tabs, sheet and sortable components, the data-table search highlight, two review skills, and a few tidy-ups. |
| after | The branch has all of that from dev. Report Builder gets a build view, a My Reports view, save and preview modals and its API, query and hook files. The NPA table shows Tenure (Months) cut to 2 decimals. `.gitignore` now matches dev's version. |

### changeType (4)

- feature
- config or CI
- UI
- refactor

### effects (5)

- Report Builder and My Reports screens (later moved into reports-user/_shared)
- tabs.tsx, sheet.tsx, sortable.tsx and the data table search used by other screens
- NPA loan tables (Tenure column)
- Navbar user settings: Layout Type now hidden below the sm breakpoint
- Git ignore rules for local tooling files

### filesReviewed (43)

| path | change | status | note |
|---|---|---|---|
| .claude/skills/review-standards/SKILL.md | added | green | no issues |
| .claude/skills/ui-conventions/SKILL.md | added | green | no issues |
| .gitignore | modified | amber | F1 |
| src/app/(app)/(main)/_components/navbar/user-settings-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/lms/npa/_shared/common-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_hooks/use-builder-session.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_lib/report-columns.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_schema.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/available-columns-panel.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/category-pills.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/count-pill.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/field-list.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/index.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/mobile-action-bar.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/mode-banner.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/save-button.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/save-template-modal.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/selected-column-row.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/selected-columns-panel.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/table-preview-modal.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/use-column-selection.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/use-save-template.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/workspace-switcher.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/filters-sidebar.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/index.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/report-actions.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/report-results.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/template-card.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/use-filter-options.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/use-report-filters.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/page.tsx | added | green | no issues |
| src/components/data-table/data-table-context.tsx | modified | green | no issues |
| src/components/data-table/global-filter.ts | added | green | no issues |
| src/components/data-table/index.ts | modified | green | no issues |
| src/components/data-table/search-highlight.tsx | added | green | no issues |
| src/components/highlighted-text.tsx | added | green | no issues |
| src/components/tabs.tsx | modified | green | no issues |
| src/components/ui/sheet.tsx | modified | green | no issues |
| src/components/ui/sortable.tsx | modified | green | no issues |
| src/features/reports/reports-builder/api.ts | added | green | no issues |
| src/features/reports/reports-builder/hooks.ts | added | green | no issues |
| src/features/reports/reports-builder/queries.ts | added | green | no issues |
| src/features/reports/reports-builder/types.ts | added | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Merge dropped the local-tooling ignore entries from .gitignore |
| location | .gitignore:55 |
| problem | The merge took the dev side of .gitignore and dropped the branch's own entries for `.localtrack.md`, `/.penguin/` and `/src/app/(app)/penguin/`. They are still missing in the current file. `git check-ignore` reports none of them as ignored. |
| impact | If `.localtrack.md`, a `.penguin/` folder or the penguin panel folder is created here, `git add -A` stages it and it can be committed and pushed. Nothing is staged today: none of them exist in this checkout now. |
| fix | Add `.localtrack.md`, `/.penguin/` and `/src/app/(app)/penguin/` back to .gitignore (a separate commit on the branch that needs them). |
| evidence | certificates<br>docs/ |
| status | resolved |
| resolvedIn | 653eb5bc6202fdd03d6f0e5b5d94098f7d9efac0 |
| resolvedAt | 2026-11-23T12:25:45.662Z |
| resolvedNote | Fixed in 653eb5bc: .gitignore lists .localtrack.md, /.penguin/ and /src/app/(app)/penguin/ (.gitignore:62-64). |
| needsAttention | false |
| attentionNote | null |
| confirmed | true |
| confirmedNote | Confirmed by me |

### previousFindings (7)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| f10ede60be90cb55e8e4aa83d0c505dd92912186 | F1 | Merge dropped the local-tooling ignore entries from .gitignore | resolved | The user confirmed it by hand in the panel, so it was not re-checked. |
| 9e9c05273eec9ade4f153846e01bf3b232fc1de6 | F1 | Commercial panel pagination loses its padding | resolved | ucrf-commercial-report-panel.tsx:127 wraps UcrfGridPagination in p-4, and the consumer panel footer has p-4. |
| 9e9c05273eec9ade4f153846e01bf3b232fc1de6 | F2 | Blue and green download buttons flip to primary on hover | resolved | ucrf-xlsx-preview-modal.tsx sets hover:bg-green-600/90 and disabled:hover:bg-green-600 on the green button. |
| d639ba202a6b352fce6962c8fc139918c4932e18 | F1 | Invalid Tailwind class `px-4)` drops navbar padding | resolved | navbar.tsx has no `px-4)` any more. |
| d639ba202a6b352fce6962c8fc139918c4932e18 | F2 | Toasts lose status colours and hardcode black and white | resolved | layout.tsx:25 has richColors and sonner.tsx has no bg-white, text-black or bg-black. |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F1 | XLSX preview renders every row at once | resolved | ucrf-xlsx-preview-modal.tsx:43 renders rows.slice(0, PREVIEW_ROW_LIMIT). |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F2 | xlsx library is imported statically in the report panel | resolved | ucrf-consumer-report-panel.tsx:44 loads xlsx with await import("xlsx"). |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint (NPA common-columns, user-settings-panel, reports-user/report-builder, features/reports/reports-builder) | passed |
| grey | tests | not run: no test script is configured in package.json (CLAUDE.md) |

### gaps (3)

- Reviewed as a merge: the diff against the first parent (the dev work brought in). The dev side was not re-reviewed line by line for behaviour that was later rewritten.
- 29 of the files have changed since the commit (the report builder was reworked and moved into reports-user/_shared); this review describes the current code for them.
- Screens were not opened in a browser for this review.

### info (5)

- Tenure (NPA) uses Number(Number(row.tenure).toFixed(2)): it rounds (11.999 shows 12) while the shared report formatters cut the digits, and a non-number value would give NaN. Outside the report-builder, My Reports and UCRF scope, so not flagged.
- .claude/ and CLAUDE.md are ignored, but the two skill files in the commit are tracked, so they were added by force. That works but later edits to other .claude files will not show.
- The untracked security/pentagi/ folder is not part of this commit.
- The Layout Type setting in user-settings-panel.tsx is now hidden on phones (hidden sm:block), which is a visible behaviour change from dev.
- Re-run on the same code. The .gitignore finding (F1) is confirmed by the user, so it no longer counts; the file still has no .localtrack.md, /.penguin/ or penguin-folder entry.

---

## howismycommit-35

| Field | Value |
|---|---|
| id | howismycommit-35 |
| generatedAt | 2026-11-05T12:00:51+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | f88be9b9d6f893c89d7b66a5f54abc89b6759f5f |
| files.changed | 12 |
| files.added | 2 |
| files.modified | 10 |
| files.deleted | 0 |
| files.insertions | 230 |
| files.deletions | 53 |
| verdict | review-with-caution |
| score | 92 |
| commitScore | 92 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 2 |
| summary.info | 5 |
| before | Report cells showed rounded numbers and raw ISO dates, all columns were left aligned, and the UCRF grids showed values as sent. |
| after | Report Builder, My Reports and the UCRF consumer and commercial grids show dd-mm-yyyy dates and 2 clipped decimals, and number columns sit on the right. The shared table has an opt-in align option, and the helpers live in src/lib/format-value.ts and features/reports/ucrf/ucrf-grid-format.ts. |

### changeType (2)

- feature
- ui

### effects (4)

- The shared DataTable gains meta.align; other tables are unchanged until they opt in.
- Report footers align their totals with number columns.
- Excel export and Print still use the raw values, so files differ from the screen.
- UCRF grids now depend on src/lib/format-value.ts.

### filesReviewed (12)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/reports-user/_shared/report-columns.tsx | modified | amber | F2 |
| src/app/(app)/(main)/reports-user/_shared/report-results.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/use-report-filters.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-commercial-grid-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-commercial-report-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-grid-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx | modified | green | no issues |
| src/components/data-table/data-table.tsx | modified | green | no issues |
| src/components/data-table/global-filter.ts | modified | green | no issues |
| src/features/reports/reports-builder/aggregation-footer.tsx | modified | green | no issues |
| src/features/reports/ucrf/ucrf-grid-format.ts | added | amber | F1 |
| src/lib/format-value.ts | added | green | no issues |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | UCRF alignment decided per page |
| location | src/features/reports/ucrf/ucrf-grid-format.ts:32 |
| problem | ucrfColumnAlign looks at the rows passed in, and the UCRF grid passes only the current page (grid.rows, a server page). A column that is all numbers on page 1 but has a non-number, or is empty, on page 2 changes side when the user pages. |
| impact | Columns jump between left and right while paging, which looks like a bug in a table that is meant to be stable. |
| fix | Decide alignment from the column, not the page: keep it once decided per column key, or use a fixed list of numeric UCRF keys. |
| evidence | rows.map((row) => row[columnKey]), |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-05T07:03:35.723Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |
| future | false |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Report numbers differ from UCRF and pass through a float |
| location | src/app/(app)/(main)/reports-user/_shared/report-columns.tsx:21 |
| problem | Report Builder and My Reports clip with truncateDecimals, which turns number text into a JS number and drops trailing zeros (12.000000004 shows 12). UCRF uses formatDecimals, which cuts the text and keeps two decimals (12.00). |
| impact | The same value reads 12 in one report and 12.00 in another, and number text beyond about 15 significant digits loses digits in the two report screens. |
| fix | Use formatDecimals in report-columns.tsx for text values (and for numbers when two fixed decimals are wanted); keep truncateDecimals only for the footer maths. |
| evidence | if (/^-?\d+\.\d+$/.test(v)) return truncateDecimals(v) |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-05T07:03:36.722Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (10)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| f88be9b9d6f893c89d7b66a5f54abc89b6759f5f | F1 | UCRF alignment decided per page | open | ucrf-grid-format.ts:32 still decides from the rows of one page, so it is still open. |
| f88be9b9d6f893c89d7b66a5f54abc89b6759f5f | F2 | Report numbers differ from UCRF and pass through a float | open | _shared/report-columns.tsx:20 and :21 still run values through truncateDecimals, so it is still open. |
| 589b8efadcb21c8194dec8be193a5fab7bf61a4f | F1 | Product filter 403s without HRMS rights | resolved | The user confirmed it by hand in the panel, so it was not re-checked. |
| 589b8efadcb21c8194dec8be193a5fab7bf61a4f | F2 | Placeholder totals now shown as real | resolved | The user confirmed it by hand in the panel, so it was not re-checked. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F1 | Rights guard disabled on both report pages | resolved | my-reports/page.tsx:10 and report-builder/page.tsx:20 wrap the page in PermissionGuard. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F2 | Report query has no branch limit | resolved | Confirmed by the user, so it was not re-checked. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F3 | Print button shown but does nothing | resolved | my-reports-view.tsx:36 renders FileActions with canPrint and canExport. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F4 | Footer totals computed with floats | resolved | aggregation-footer.tsx:17 sums whole paise (Math.round(n * 100)). |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F5 | Footer says current page, uses all filtered rows | resolved | aggregation-footer.tsx uses reduce on the page rows for min and max. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F6 | Unreachable return after the rights guard | resolved | my-reports/page.tsx has only the guard return. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files changed by the commit> | passed |
| grey | tests | not run: no test script configured |

### gaps (2)

- No browser run, so the alignment, the date format and the footer layout were reviewed from code only.
- Which UCRF values are real numbers versus codes could not be confirmed without live data.

### info (5)

- Of the five earlier commits, 589b8efa, 602a3f71 and 65e6a5d4 have reviews; their findings were re-checked.
- Excel export and Print still show raw values (ISO dates, full decimals); the commit message mentions Excel alignment but export code is unchanged.
- formatDateDMY reads date-only text as UTC, so a user west of UTC would see the day before; fine in India.
- The commit hook (lint-staged) ran and the push hook ran tsc and next build, both passing.
- Re-run on the same code: nothing changed in these files since howismycommit-33, so F1 and F2 are unchanged. The product-filter and placeholder-totals findings from 589b8efa are now confirmed by the user.

---

## howismycommit-34

| Field | Value |
|---|---|
| id | howismycommit-34 |
| generatedAt | 2026-11-05T11:57:26+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | 589b8efadcb21c8194dec8be193a5fab7bf61a4f |
| files.changed | 31 |
| files.added | 3 |
| files.modified | 13 |
| files.deleted | 15 |
| files.insertions | 416 |
| files.deletions | 727 |
| verdict | review-with-caution |
| score | 90 |
| commitScore | 86 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 2 |
| summary.info | 5 |
| before | My Reports and the Report Builder each had their own copy of the filters, results, template card, filter options and run hook. Reports ran through POST /query, branches loaded from the HRMS employee endpoint, and rows of an old report showed while a new one loaded. |
| after | Both screens share one set of files in reports-user/_shared, chosen by a source (templates or designation). Reports run by id with filters only, branches come from the session endpoint, rows are kept only while the same report reloads, and the Builder gates Build, Edit, Duplicate, Delete and Save on page rights and redirects a typed ?view=build-report without canAdd. |

### changeType (4)

- refactor
- api
- security
- ui

### effects (4)

- My Reports and Report Builder now change together: one edit in _shared affects both screens.
- POST /reports/builder/query is no longer called anywhere.
- The Builder needs canAdd for new and duplicated reports and canEdit for editing; users without them lose those buttons.
- Branch filter options now come from /dropdown/session-employee-branch.

### filesReviewed (31)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/reports-user/_shared/filter-schema.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/filters-sidebar.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/report-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/report-results.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/report-source.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/reports-layout.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/template-card.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/use-filter-options.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/use-report-filters.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/filters-sidebar.tsx | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/my-reports-view.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/report-actions.tsx | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/template-card.tsx | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/use-report-filters.ts | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_lib/report-columns.tsx | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_schema.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/save-button.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/index.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/use-filter-options.ts | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/use-report-filters.ts | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/page.tsx | modified | green | no issues |
| src/features/reports/reports-builder/aggregation-footer.tsx | modified | green | no issues |
| src/features/reports/reports-builder/api.ts | modified | green | no issues |
| src/features/reports/reports-builder/file-data.ts | modified | green | no issues |
| src/features/reports/reports-builder/hooks.ts | modified | green | no issues |
| src/features/reports/reports-builder/queries.ts | modified | green | no issues |
| src/features/reports/reports-builder/types.ts | modified | amber | F2 |
| src/features/session/api.ts | modified | green | no issues |
| src/features/session/hooks.ts | modified | green | no issues |
| src/features/session/queries.ts | modified | amber | F1 |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | Product filter 403s without HRMS rights |
| location | src/features/session/queries.ts:30 |
| problem | The Loan Products dropdown loads the user's products from the HRMS employee endpoint, which needs the HRMS Employees page right. The branch filter was moved to a session endpoint in this commit, the product filter was not. |
| impact | A user such as a cashier gets 403 and an empty product list, so they cannot pick products. The report still runs for all their products, and the sidebar shows a hint. |
| fix | Use a session products dropdown for the logged-in employee once the backend adds one, or load products per picked branch from /dropdown/session-employee-branch/:id/product. |
| evidence | const res = await getEmployeeProducts(id) |
| status | resolved |
| resolvedIn | b10f10d2a05b943c06625406ddf81dd2c70806dc |
| resolvedAt | 2026-11-23T12:38:02.603Z |
| resolvedNote | Fixed in b10f10d2: sessionQueries.loanProducts now calls the login-only GET /dropdown/session-employee-product (src/features/session/queries.ts:29, src/features/session/api.ts:35) instead of the HRMS employee products endpoint. |
| needsAttention | false |
| attentionNote | null |
| confirmed | true |
| confirmedNote | Confirmed by Backend Team |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Placeholder totals now shown as real |
| location | src/features/reports/reports-builder/types.ts:164 |
| problem | API_TOTALS_READY is true, so the footer shows the API total as is. The API contract says every total is a placeholder 0 until backend Phase 3. |
| impact | If the backend still sends 0, every column total reads 0 and looks like real data. |
| fix | Keep it false until the backend sends real totals. Leave it true only if the backend already does. |
| evidence | export const API_TOTALS_READY = true |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-02T12:32:44.069Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | true |
| confirmedNote | Created the API endpoint |
| future | false |

### previousFindings (9)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 589b8efadcb21c8194dec8be193a5fab7bf61a4f | F1 | Product filter 403s without HRMS rights | needs-attention | The user marked it resolved, but session/queries.ts:30 still calls getEmployeeProducts(id) from the HRMS endpoint, so it is still flagged. |
| 589b8efadcb21c8194dec8be193a5fab7bf61a4f | F2 | Placeholder totals now shown as real | resolved | Confirmed by the user, so it was not re-checked. |
| f10ede60be90cb55e8e4aa83d0c505dd92912186 | F1 | Merge dropped the local-tooling ignore entries from .gitignore | needs-attention | The user marked it resolved, but .gitignore:55 still has no .localtrack.md, /.penguin/ or /src/app/(app)/penguin/ entry; flagged in howismycommit-25 and 19. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F1 | Rights guard disabled on both report pages | resolved | my-reports/page.tsx:10 and report-builder/page.tsx:20 wrap the page in PermissionGuard. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F2 | Report query has no branch limit | resolved | Confirmed by the user, so it was not re-checked. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F3 | Print button shown but does nothing | resolved | my-reports-view.tsx:36 renders FileActions with canPrint and canExport. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F4 | Footer totals computed with floats | resolved | aggregation-footer.tsx:17 sums whole paise (Math.round(n * 100)). |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F5 | Footer says current page, uses all filtered rows | resolved | aggregation-footer.tsx uses reduce on the page rows for min and max. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F6 | Unreachable return after the rights guard | resolved | my-reports/page.tsx has only the guard return. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files changed by the commit> | passed |
| grey | tests | not run: no test script configured |

### gaps (2)

- No browser run, so the merged screens, the redirect and the greyed-out Save were reviewed from code only.
- Backend rights, branch and product scoping cannot be checked from this repo.

### info (5)

- Only 602a3f71 and 65e6a5d4 of the five earlier commits have reviews; their six findings were re-checked and stay resolved.
- Report Builder Export still ignores the Export role right and has no Print button, which you chose to leave for now.
- Print and Export rights are still hidden-button only until the backend enforces them.
- The run endpoints return all rows with no pagination, and Print or Export loads the report a second time.
- Re-run on the same code: nothing changed in these files since howismycommit-26. F1 stays flagged because the user's resolved mark is not backed by a code change.

---

## howismycommit-33

| Field | Value |
|---|---|
| id | howismycommit-33 |
| generatedAt | 2026-11-05T11:56:46+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | f88be9b9d6f893c89d7b66a5f54abc89b6759f5f |
| files.changed | 12 |
| files.added | 2 |
| files.modified | 10 |
| files.deleted | 0 |
| files.insertions | 230 |
| files.deletions | 53 |
| verdict | review-with-caution |
| score | 92 |
| commitScore | 92 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 2 |
| summary.info | 5 |
| before | Report cells showed rounded numbers and raw ISO dates, all columns were left aligned, and the UCRF grids showed values as sent. |
| after | Report Builder, My Reports and the UCRF consumer and commercial grids show dd-mm-yyyy dates and 2 clipped decimals, and number columns sit on the right. The shared table has an opt-in align option, and the helpers live in src/lib/format-value.ts and features/reports/ucrf/ucrf-grid-format.ts. |

### changeType (2)

- feature
- ui

### effects (4)

- The shared DataTable gains meta.align; other tables are unchanged until they opt in.
- Report footers align their totals with number columns.
- Excel export and Print still use the raw values, so files differ from the screen.
- UCRF grids now depend on src/lib/format-value.ts.

### filesReviewed (12)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/reports-user/_shared/report-columns.tsx | modified | amber | F2 |
| src/app/(app)/(main)/reports-user/_shared/report-results.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/use-report-filters.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-commercial-grid-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-commercial-report-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-grid-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx | modified | green | no issues |
| src/components/data-table/data-table.tsx | modified | green | no issues |
| src/components/data-table/global-filter.ts | modified | green | no issues |
| src/features/reports/reports-builder/aggregation-footer.tsx | modified | green | no issues |
| src/features/reports/ucrf/ucrf-grid-format.ts | added | amber | F1 |
| src/lib/format-value.ts | added | green | no issues |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | UCRF alignment decided per page |
| location | src/features/reports/ucrf/ucrf-grid-format.ts:32 |
| problem | ucrfColumnAlign looks at the rows passed in, and the UCRF grid passes only the current page (grid.rows, a server page). A column that is all numbers on page 1 but has a non-number, or is empty, on page 2 changes side when the user pages. |
| impact | Columns jump between left and right while paging, which looks like a bug in a table that is meant to be stable. |
| fix | Decide alignment from the column, not the page: keep it once decided per column key, or use a fixed list of numeric UCRF keys. |
| evidence | rows.map((row) => row[columnKey]), |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-05T07:03:50.829Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |
| future | false |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Report numbers differ from UCRF and pass through a float |
| location | src/app/(app)/(main)/reports-user/_shared/report-columns.tsx:21 |
| problem | Report Builder and My Reports clip with truncateDecimals, which turns number text into a JS number and drops trailing zeros (12.000000004 shows 12). UCRF uses formatDecimals, which cuts the text and keeps two decimals (12.00). |
| impact | The same value reads 12 in one report and 12.00 in another, and number text beyond about 15 significant digits loses digits in the two report screens. |
| fix | Use formatDecimals in report-columns.tsx for text values (and for numbers when two fixed decimals are wanted); keep truncateDecimals only for the footer maths. |
| evidence | if (/^-?\d+\.\d+$/.test(v)) return truncateDecimals(v) |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-05T07:03:52.546Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (10)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| f88be9b9d6f893c89d7b66a5f54abc89b6759f5f | F1 | UCRF alignment decided per page | open | ucrf-grid-format.ts:32 still decides from the rows of one page, so it is still open. |
| f88be9b9d6f893c89d7b66a5f54abc89b6759f5f | F2 | Report numbers differ from UCRF and pass through a float | open | _shared/report-columns.tsx:20 and :21 still run values through truncateDecimals, so it is still open. |
| 589b8efadcb21c8194dec8be193a5fab7bf61a4f | F1 | Product filter 403s without HRMS rights | needs-attention | The user marked it resolved, but session/queries.ts:30 still calls getEmployeeProducts(id) from the HRMS endpoint; flagged as needing attention in howismycommit-26. |
| 589b8efadcb21c8194dec8be193a5fab7bf61a4f | F2 | Placeholder totals now shown as real | resolved | Confirmed by the user, so it was not re-checked. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F1 | Rights guard disabled on both report pages | resolved | my-reports/page.tsx:10 and report-builder/page.tsx:20 wrap the page in PermissionGuard. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F2 | Report query has no branch limit | resolved | Confirmed by the user, so it was not re-checked. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F3 | Print button shown but does nothing | resolved | my-reports-view.tsx:36 renders FileActions with canPrint and canExport. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F4 | Footer totals computed with floats | resolved | aggregation-footer.tsx:17 sums whole paise (Math.round(n * 100)). |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F5 | Footer says current page, uses all filtered rows | resolved | aggregation-footer.tsx uses reduce on the page rows for min and max. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F6 | Unreachable return after the rights guard | resolved | my-reports/page.tsx has only the guard return. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files changed by the commit> | passed |
| grey | tests | not run: no test script configured |

### gaps (2)

- No browser run, so the alignment, the date format and the footer layout were reviewed from code only.
- Which UCRF values are real numbers versus codes could not be confirmed without live data.

### info (5)

- Of the five earlier commits, 589b8efa, 602a3f71 and 65e6a5d4 have reviews; their findings were re-checked.
- Excel export and Print still show raw values (ISO dates, full decimals); the commit message mentions Excel alignment but export code is unchanged.
- formatDateDMY reads date-only text as UTC, so a user west of UTC would see the day before; fine in India.
- The commit hook (lint-staged) ran and the push hook ran tsc and next build, both passing.
- Re-run on the same code: nothing changed in these files since howismycommit-27, so F1 and F2 are unchanged.

---

## howismycommit-32

| Field | Value |
|---|---|
| id | howismycommit-32 |
| generatedAt | 2026-11-05T11:52:36+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | 46a31b163d25e0355a0a919b662e0ac27f23acd4 |
| files.changed | 6 |
| files.added | 0 |
| files.modified | 6 |
| files.deleted | 0 |
| files.insertions | 37 |
| files.deletions | 28 |
| verdict | looks-good |
| score | 100 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 3 |
| summary.info | 5 |
| before | UCRF used the browser's own date inputs. Three empty states (UCRF before a report, the Report Builder field list, the XLSX preview) were hand-made text. The settings drawer showed a Profile title. |
| after | UCRF uses the shared date picker for Reporting date and Closed from. The three empty states use NoDataView. The day part of the picked dates is sent to the API, and the same-day check compares days. The settings drawer title is empty. |

### changeType (2)

- UI
- feature

### effects (3)

- UCRF Data Submission filters, validation and the request sent to the server
- Report Builder available-fields panel and the UCRF XLSX preview modal
- Settings drawer header (title text removed)

### filesReviewed (6)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/_components/navbar/user-settings-panel.tsx | modified | amber | F1 |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/field-list.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-filters.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_schema.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/page.tsx | modified | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Settings drawer title is empty |
| location | src/app/(app)/(main)/_components/navbar/user-settings-panel.tsx:127 |
| problem | The drawer's title element was emptied. It renders as an empty heading, so the drawer no longer has a name. |
| impact | A screen reader announces the open settings drawer with no name, and the browser accessibility tree shows an empty dialog title. Sighted users only see a header with a close button. |
| fix | Put the text back, or keep it hidden for sighted users with `sr-only` on the title. |
| evidence | <Drawer.Title className="text-lg tracking-tight"></Drawer.Title> |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-05T06:04:47.865Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (3)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 46a31b163d25e0355a0a919b662e0ac27f23acd4 | F1 | Settings drawer title is empty | resolved | user-settings-panel.tsx:127 holds the text 'User Settings' with sr-only, so the drawer has a name again (fixed in 3aaa63bc; the user had already marked it resolved). |
| f88be9b9d6f893c89d7b66a5f54abc89b6759f5f | F1 | UCRF alignment decided per page | open | ucrf-grid-format.ts:32 still decides from the rows of one page, so it is still open. |
| f88be9b9d6f893c89d7b66a5f54abc89b6759f5f | F2 | Report numbers differ from UCRF and pass through a float | open | _shared/report-columns.tsx:20 and :21 still run values through truncateDecimals, so it is still open. |

### checks (4)

| status | command | result |
|---|---|---|
| green | npx eslint src/app/(app)/(main)/reports-user src/app/(app)/(main)/_components/navbar | passed |
| green | schema check run with tsx on ucrf-submission/_schema.ts | passed: a later Closed from fails with the right message, the same day passes, a cleared Closed from passes, a cleared Reporting date gives 'Reporting date is required' |
| green | npx tsc --noEmit | passed (run earlier in this session on the same tree) |
| grey | tests | not run: no test script is configured in package.json (CLAUDE.md) |

### gaps (2)

- The UCRF screen was not opened in a browser, so the picker and the request body were read from code only.
- user-settings-panel.tsx has changed since this commit (the colour palette work in 3aaa63bc); only the drawer title part belongs to this review.

### info (5)

- The picker keeps a full ISO time and the code cuts it to yyyy-MM-dd before the request; the API takes any ISO 8601 date, so both work.
- A cleared Closed from is a null value, which removeEmptyFilters drops before the request.
- Report Builder field-list shows a large NoDataView inside a narrow panel; this is a look choice, not a defect.
- The same commit removed a comment above the drawer's slide offset in user-settings-panel.tsx.
- The f88be9b9 findings (UCRF per-page alignment, float path in report numbers) are still open.

---

## howismycommit-31

| Field | Value |
|---|---|
| id | howismycommit-31 |
| generatedAt | 2026-11-05T11:43:11+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | 3aaa63bcefb3ca9a07a22bf78147385c81a2e981 |
| files.changed | 3 |
| files.added | 0 |
| files.modified | 3 |
| files.deleted | 0 |
| files.insertions | 80 |
| files.deletions | 34 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 5 |
| before | A colour saved as anything other than the seven known names (for example a hex from an earlier test) left the page with no colour class, and the app showed the navy default. The settings panel built its colour swatches from an array, and the drawer title was empty. |
| after | Only the seven known colour names are accepted. Anything else becomes color-blue, in the early page script, on load and on every change. The default primary is the same blue. The settings panel has the seven swatches written out one by one again, and the drawer title is hidden text 'User Settings'. |

### changeType (2)

- bug fix
- UI

### effects (4)

- Every page: the primary colour on first load, and for users whose saved colour was not one of the seven
- Users who never picked a colour now get blue; before, purple
- Settings drawer: palette markup and the screen-reader title
- The server value is not corrected; a bad one stays until a setting is saved from the panel

### filesReviewed (3)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/_components/navbar/user-settings-panel.tsx | modified | green | no issues |
| src/app/globals.css | modified | green | no issues |
| src/providers/color.provider.tsx | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (1)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 46a31b163d25e0355a0a919b662e0ac27f23acd4 | F1 | Settings drawer title is empty | resolved | user-settings-panel.tsx:127 now holds the text 'User Settings', hidden with sr-only, so the drawer has a name again. |

### checks (4)

| status | command | result |
|---|---|---|
| green | npx eslint src/app/(app)/(main)/_components/navbar src/providers | passed |
| green | npx tsc --noEmit | passed (run earlier in this session on this code) |
| green | browser check on /login with a stored hex, a valid name, an unknown name and nothing saved | passed: hex and unknown name gave color-blue, color-rose stayed rose, nothing saved gave color-blue |
| grey | tests | not run: no test script is configured in package.json (CLAUDE.md) |

### gaps (2)

- The settings panel itself was not opened after the commit because it needs a login.
- The server preference was not read, so whether a bad colour is stored there was not checked.

### info (5)

- The swatches are plain divs with a click handler, so they cannot be reached with the keyboard. This is how the pre-d639ba20 palette was written.
- color-blue is hsl(214 100% 56%) with light text, which has less contrast than the old default; it is now the colour most users see.
- The 'text-lg tracking-tight' classes on the hidden drawer title have no effect.
- The old .color-* rules and the Tailwind safelist for them are still needed and unchanged.
- The leftover hex on the server is only replaced when the user saves a preference, such as by clicking a swatch.

---

## howismycommit-30

| Field | Value |
|---|---|
| id | howismycommit-30 |
| generatedAt | 2026-11-05T11:09:00+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | 46a31b163d25e0355a0a919b662e0ac27f23acd4 |
| files.changed | 6 |
| files.added | 0 |
| files.modified | 6 |
| files.deleted | 0 |
| files.insertions | 37 |
| files.deletions | 28 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 2 |
| summary.info | 4 |
| before | UCRF used the browser's own date inputs. Three empty states (UCRF before a report, the Report Builder field list, the XLSX preview) were hand-made text. The settings drawer showed a Profile title. |
| after | UCRF uses the shared date picker for Reporting date and Closed from. The three empty states use NoDataView. The day part of the picked dates is sent to the API, and the same-day check compares days. The settings drawer title is empty. |

### changeType (2)

- UI
- feature

### effects (3)

- UCRF Data Submission filters, validation and the request sent to the server
- Report Builder available-fields panel and the UCRF XLSX preview modal
- Settings drawer header (title text removed)

### filesReviewed (6)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/_components/navbar/user-settings-panel.tsx | modified | amber | F1 |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/field-list.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-filters.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_schema.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/page.tsx | modified | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Settings drawer title is empty |
| location | src/app/(app)/(main)/_components/navbar/user-settings-panel.tsx:127 |
| problem | The drawer's title element was emptied. It renders as an empty heading, so the drawer no longer has a name. |
| impact | A screen reader announces the open settings drawer with no name, and the browser accessibility tree shows an empty dialog title. Sighted users only see a header with a close button. |
| fix | Put the text back, or keep it hidden for sighted users with `sr-only` on the title. |
| evidence | <Drawer.Title className="text-lg tracking-tight"></Drawer.Title> |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-05T06:04:47.865Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| f88be9b9d6f893c89d7b66a5f54abc89b6759f5f | F1 | UCRF alignment decided per page | open | ucrf-grid-format.ts:32 still decides from the rows of one page, so it is still open. |
| f88be9b9d6f893c89d7b66a5f54abc89b6759f5f | F2 | Report numbers differ from UCRF and pass through a float | open | _shared/report-columns.tsx:20 and :21 still run values through truncateDecimals, so it is still open. |

### checks (4)

| status | command | result |
|---|---|---|
| green | npx eslint src/app/(app)/(main)/reports-user src/app/(app)/(main)/_components/navbar | passed |
| green | schema check run with tsx on ucrf-submission/_schema.ts | passed: a later Closed from fails with the right message, the same day passes, a cleared Closed from passes, a cleared Reporting date gives 'Reporting date is required' |
| green | npx tsc --noEmit | passed (run earlier in this session on the same tree) |
| grey | tests | not run: no test script is configured in package.json (CLAUDE.md) |

### gaps (2)

- The UCRF screen was not opened in a browser, so the picker and the request body were read from code only.
- The working tree has other uncommitted edits in user-settings-panel.tsx (the colour palette), globals.css, color.provider.tsx and form-input.tsx. They are not part of this commit and were not reviewed here.

### info (5)

- The picker keeps a full ISO time and the code cuts it to yyyy-MM-dd before the request; the API takes any ISO 8601 date, so both work.
- A cleared Closed from is a null value, which removeEmptyFilters drops before the request.
- Report Builder field-list shows a large NoDataView inside a narrow panel; this is a look choice, not a defect.
- The same commit removed a comment above the drawer's slide offset in user-settings-panel.tsx.
- The f88be9b9 findings (UCRF per-page alignment, float path in report numbers) are still open.

---

## howismycommit-29

| Field | Value |
|---|---|
| id | howismycommit-29 |
| generatedAt | 2026-11-04T18:42:08+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | 9de5c114b21507602860520ccc7c97ffe6859c9c |
| files.changed | 5 |
| files.added | 1 |
| files.modified | 4 |
| files.deleted | 0 |
| files.insertions | 69 |
| files.deletions | 20 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 5 |
| before | Only columns with meta.align set were right-aligned, and dates showed as the API sent them unless a screen formatted them itself. Report tables used a column-aligned sticky footer with border lines. |
| after | Every table right-aligns columns whose values are all numbers (ids, codes and phone numbers stay left), reading all rows so the choice does not change per page. Plain cells with ISO dates show dd-mm-yyyy, including the '2024-03-01 00:00:00+00' form. Report tables use the default footer, now tinted like the header. |

### changeType (2)

- feature
- UI

### effects (4)

- Every DataTable and VirtualizedClientTable in the app: header, cells and footer alignment
- Any column without its own cell that holds ISO date text now shows dd-mm-yyyy instead of the raw text
- formatDateDMY and isIsoDateString accept a space before the time and short offsets such as +00 (used by report and UCRF screens too)
- My Reports and Report Builder footers: no longer sticky or width-aligned, now header-tinted

### filesReviewed (5)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/reports-user/_shared/report-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/report-results.tsx | modified | green | no issues |
| src/components/data-table/column-format.ts | added | green | no issues |
| src/components/data-table/data-table.tsx | modified | green | no issues |
| src/lib/format-value.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| f88be9b9d6f893c89d7b66a5f54abc89b6759f5f | F1 | UCRF alignment decided per page | open | ucrf-grid-format.ts:32 still decides from the rows of one page, and its meta.align wins over the new all-rows check, so it is still open. |
| f88be9b9d6f893c89d7b66a5f54abc89b6759f5f | F2 | Report numbers differ from UCRF and pass through a float | open | _shared/report-columns.tsx:20 and :21 still run values through truncateDecimals, so it is still open. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx eslint src/components/data-table src/lib/format-value.ts src/app/(app)/(main)/reports-user/_shared | passed |
| green | npx tsc --noEmit | passed (run earlier in this session on the same code; the only later edits are the uncommitted colour-picker files) |
| grey | tests | not run: no test script is configured in package.json (CLAUDE.md) |

### gaps (3)

- Checked in the browser only for date parsing samples (run through tsx); the tables across the app were not opened after this change.
- Other screens' tables were not reviewed one by one for columns that hold numbers but render text (for example a numeric status code shown as a label); those would now move right.
- The uncommitted colour-picker changes in the working tree are not part of this commit and were not reviewed here.

### info (5)

- renderCellContent uses table._getDefaultColumnDef(), an internal TanStack method. It works on the installed version but may change on an upgrade.
- Date-only values like '2024-03-01' are read as UTC midnight, so users west of UTC would see the day before. This was the same before the commit.
- alignFooterToColumns and meta.footerClassName are no longer passed by any screen; the code that reads them in data-table.tsx is now unused.
- ISO timestamps in plain cells now lose their time part, since only dd-mm-yyyy is shown.
- The f88be9b9 findings (UCRF per-page alignment, float path in report numbers) are still open.

---

## howismycommit-28

| Field | Value |
|---|---|
| id | howismycommit-28 |
| generatedAt | 2026-11-04T17:12:19+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | d1ceb8c3d1c94079d132f459990ef2f7debe9f2a |
| files.changed | 35 |
| files.added | 28 |
| files.modified | 7 |
| files.deleted | 0 |
| files.insertions | 2019 |
| files.deletions | 45 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 5 |
| before | Report Builder had no screens, only the data hooks and types. The data table searched columns with the library default, and the sortable list could only show a fixed drag overlay. |
| after | The branch has the Report Builder scaffold: a build view (column lists, drag to order, save modal, preview) and a My Reports view (filters, template cards, results). The data table can search by the text it shows, and highlight the match. |

### changeType (3)

- feature
- UI
- refactor

### effects (5)

- New Report Builder page and its two views (later reworked and partly moved to reports-user/_shared)
- Every table that uses DataTableProvider gets the display-text search and number search (components/data-table)
- Sortable overlay can now be a function that gets the dragged item
- Save, update and delete report hooks no longer show their own toasts; the form flow and delete confirm do
- NPA loan tables: Tenure column header and value change

### filesReviewed (35)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/lms/npa/_shared/common-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_hooks/use-builder-session.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_lib/report-columns.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_schema.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/available-columns-panel.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/category-pills.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/count-pill.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/field-list.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/index.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/mobile-action-bar.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/mode-banner.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/save-button.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/save-template-modal.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/selected-column-row.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/selected-columns-panel.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/table-preview-modal.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/use-column-selection.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/use-save-template.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/workspace-switcher.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/filters-sidebar.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/index.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/report-actions.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/report-results.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/template-card.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/use-filter-options.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/use-report-filters.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/page.tsx | added | green | no issues |
| src/components/data-table/data-table-context.tsx | modified | green | no issues |
| src/components/data-table/global-filter.ts | added | green | no issues |
| src/components/data-table/index.ts | modified | green | no issues |
| src/components/data-table/search-highlight.tsx | added | green | no issues |
| src/components/ui/sheet.tsx | modified | green | no issues |
| src/components/ui/sortable.tsx | modified | green | no issues |
| src/features/reports/reports-builder/hooks.ts | modified | green | no issues |
| src/features/reports/reports-builder/types.ts | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (0)

_Empty._

### checks (3)

| status | command | result |
|---|---|---|
| green | npx eslint (report-builder, data-table, ui/sheet, ui/sortable, features/reports/reports-builder, npa common-columns) | passed |
| green | npx tsc --noEmit | passed (run earlier in this session on the same code; no source edits since) |
| grey | tests | not run: no test script is configured in package.json (CLAUDE.md) |

### gaps (4)

- 6 of the 35 files no longer exist: their code moved to reports-user/_shared, where later problems are in howismycommit-17, 18 and the earlier reviews of later commits.
- 25 files changed since this commit. The review describes the current code for them and was not traced line by line for the 28 added files.
- No earlier report exists for this commit or for the 5 commits before it, so there were no previous findings to check.
- The screens were read from code, not opened in a browser.

### info (5)

- The mutation hooks lost their toasts in this commit. They are still covered: use-save-template goes through useFormFlow (save-template-modal.tsx:75), and delete goes through useDeleteConfirm (my-reports/index.tsx:56).
- Clone starts with the same name as the original report (use-builder-session.ts:34), so two reports can share a name. Whether the backend allows that was not checked.
- The NPA Tenure value is rounded to 2 decimals (toFixed) while the shared report formats cut the digits.
- The data-table search change applies to every table in the app, not only the report screens. Number columns are now searched as text, which is the intent.
- The commit was written by another author (shekhar); it is part of dev's history, brought in by the merge of f10ede60.

---

## howismycommit-27

| Field | Value |
|---|---|
| id | howismycommit-27 |
| generatedAt | 2026-11-04T10:10:59+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | f88be9b9d6f893c89d7b66a5f54abc89b6759f5f |
| files.changed | 12 |
| files.added | 2 |
| files.modified | 10 |
| files.deleted | 0 |
| files.insertions | 230 |
| files.deletions | 53 |
| verdict | review-with-caution |
| score | 92 |
| commitScore | 92 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 2 |
| summary.info | 5 |
| before | Report cells showed rounded numbers and raw ISO dates, all columns were left aligned, and the UCRF grids showed values as sent. |
| after | Report Builder, My Reports and the UCRF consumer and commercial grids show dd-mm-yyyy dates and 2 clipped decimals, and number columns sit on the right. The shared table has an opt-in align option, and the helpers live in src/lib/format-value.ts and features/reports/ucrf/ucrf-grid-format.ts. |

### changeType (2)

- feature
- ui

### effects (4)

- The shared DataTable gains meta.align; other tables are unchanged until they opt in.
- Report footers align their totals with number columns.
- Excel export and Print still use the raw values, so files differ from the screen.
- UCRF grids now depend on src/lib/format-value.ts.

### filesReviewed (12)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/reports-user/_shared/report-columns.tsx | modified | amber | F2 |
| src/app/(app)/(main)/reports-user/_shared/report-results.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/use-report-filters.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-commercial-grid-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-commercial-report-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-grid-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx | modified | green | no issues |
| src/components/data-table/data-table.tsx | modified | green | no issues |
| src/components/data-table/global-filter.ts | modified | green | no issues |
| src/features/reports/reports-builder/aggregation-footer.tsx | modified | green | no issues |
| src/features/reports/ucrf/ucrf-grid-format.ts | added | amber | F1 |
| src/lib/format-value.ts | added | green | no issues |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | UCRF alignment decided per page |
| location | src/features/reports/ucrf/ucrf-grid-format.ts:32 |
| problem | ucrfColumnAlign looks at the rows passed in, and the UCRF grid passes only the current page (grid.rows, a server page). A column that is all numbers on page 1 but has a non-number, or is empty, on page 2 changes side when the user pages. |
| impact | Columns jump between left and right while paging, which looks like a bug in a table that is meant to be stable. |
| fix | Decide alignment from the column, not the page: keep it once decided per column key, or use a fixed list of numeric UCRF keys. |
| evidence | rows.map((row) => row[columnKey]), |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-05T06:51:52.677Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |
| future | false |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Report numbers differ from UCRF and pass through a float |
| location | src/app/(app)/(main)/reports-user/_shared/report-columns.tsx:21 |
| problem | Report Builder and My Reports clip with truncateDecimals, which turns number text into a JS number and drops trailing zeros (12.000000004 shows 12). UCRF uses formatDecimals, which cuts the text and keeps two decimals (12.00). |
| impact | The same value reads 12 in one report and 12.00 in another, and number text beyond about 15 significant digits loses digits in the two report screens. |
| fix | Use formatDecimals in report-columns.tsx for text values (and for numbers when two fixed decimals are wanted); keep truncateDecimals only for the footer maths. |
| evidence | if (/^-?\d+\.\d+$/.test(v)) return truncateDecimals(v) |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-05T06:51:54.169Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (9)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| f88be9b9d6f893c89d7b66a5f54abc89b6759f5f | F1 | UCRF alignment decided per page | open | ucrf-grid-format.ts:25 still picks the alignment from the rows passed in (one page), so it is still open. |
| f88be9b9d6f893c89d7b66a5f54abc89b6759f5f | F2 | Report numbers differ from UCRF and pass through a float | open | _shared/report-columns.tsx:21 still runs number text through truncateDecimals, so it is still open. |
| 589b8efadcb21c8194dec8be193a5fab7bf61a4f | F1 | Product filter 403s without HRMS rights | open | session/queries.ts:30 still calls getEmployeeProducts(id) from the HRMS endpoint, so it is still open. |
| 589b8efadcb21c8194dec8be193a5fab7bf61a4f | F2 | Placeholder totals now shown as real | needs-attention | reports-builder/types.ts:164 still has API_TOTALS_READY = true; the flag stays and the user's resolved mark is kept. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F1 | Rights guard disabled on both report pages | resolved | my-reports/page.tsx:9 and report-builder/page.tsx:20 wrap the page in PermissionGuard. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F3 | Print button shown but does nothing | resolved | my-reports-view.tsx:36 renders FileActions with canPrint and canExport. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F4 | Footer totals computed with floats | resolved | aggregation-footer.tsx:20 sums whole paise. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F5 | Footer says current page, uses all filtered rows | resolved | aggregation-footer.tsx:27 and :29 use reduce on the page rows. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F6 | Unreachable return after the rights guard | resolved | my-reports/page.tsx:9 has only the guard return. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files changed by the commit> | passed |
| grey | tests | not run: no test script configured |

### gaps (2)

- No browser run, so the alignment, the date format and the footer layout were reviewed from code only.
- Which UCRF values are real numbers versus codes could not be confirmed without live data.

### info (5)

- Of the five earlier commits, 589b8efa, 602a3f71 and 65e6a5d4 have reviews; their findings were re-checked.
- Excel export and Print still show raw values (ISO dates, full decimals); the commit message mentions Excel alignment but export code is unchanged.
- formatDateDMY reads date-only text as UTC, so a user west of UTC would see the day before; fine in India.
- The commit hook (lint-staged) ran and the push hook ran tsc and next build, both passing.
- Re-run on the same code: the working tree has not changed since howismycommit-18, so F1 and F2 are unchanged.

---

## howismycommit-26

| Field | Value |
|---|---|
| id | howismycommit-26 |
| generatedAt | 2026-11-04T10:10:12+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | 589b8efadcb21c8194dec8be193a5fab7bf61a4f |
| files.changed | 31 |
| files.added | 3 |
| files.modified | 13 |
| files.deleted | 15 |
| files.insertions | 416 |
| files.deletions | 727 |
| verdict | review-with-caution |
| score | 86 |
| commitScore | 86 |
| quality | good |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 2 |
| summary.info | 5 |
| before | My Reports and the Report Builder each had their own copy of the filters, results, template card, filter options and run hook. Reports ran through POST /query, branches loaded from the HRMS employee endpoint, and rows of an old report showed while a new one loaded. |
| after | Both screens share one set of files in reports-user/_shared, chosen by a source (templates or designation). Reports run by id with filters only, branches come from the session endpoint, rows are kept only while the same report reloads, and the Builder gates Build, Edit, Duplicate, Delete and Save on page rights and redirects a typed ?view=build-report without canAdd. |

### changeType (4)

- refactor
- api
- security
- ui

### effects (4)

- My Reports and Report Builder now change together: one edit in _shared affects both screens.
- POST /reports/builder/query is no longer called anywhere.
- The Builder needs canAdd for new and duplicated reports and canEdit for editing; users without them lose those buttons.
- Branch filter options now come from /dropdown/session-employee-branch.

### filesReviewed (31)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/reports-user/_shared/filter-schema.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/filters-sidebar.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/report-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/report-results.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/report-source.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/reports-layout.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/template-card.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/use-filter-options.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/use-report-filters.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/filters-sidebar.tsx | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/my-reports-view.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/report-actions.tsx | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/template-card.tsx | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/use-report-filters.ts | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_lib/report-columns.tsx | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_schema.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/save-button.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/index.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/use-filter-options.ts | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/use-report-filters.ts | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/page.tsx | modified | green | no issues |
| src/features/reports/reports-builder/aggregation-footer.tsx | modified | green | no issues |
| src/features/reports/reports-builder/api.ts | modified | green | no issues |
| src/features/reports/reports-builder/file-data.ts | modified | green | no issues |
| src/features/reports/reports-builder/hooks.ts | modified | green | no issues |
| src/features/reports/reports-builder/queries.ts | modified | green | no issues |
| src/features/reports/reports-builder/types.ts | modified | amber | F2 |
| src/features/session/api.ts | modified | green | no issues |
| src/features/session/hooks.ts | modified | green | no issues |
| src/features/session/queries.ts | modified | amber | F1 |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | Product filter 403s without HRMS rights |
| location | src/features/session/queries.ts:30 |
| problem | The Loan Products dropdown loads the user's products from the HRMS employee endpoint, which needs the HRMS Employees page right. The branch filter was moved to a session endpoint in this commit, the product filter was not. |
| impact | A user such as a cashier gets 403 and an empty product list, so they cannot pick products. The report still runs for all their products, and the sidebar shows a hint. |
| fix | Use a session products dropdown for the logged-in employee once the backend adds one, or load products per picked branch from /dropdown/session-employee-branch/:id/product. |
| evidence | const res = await getEmployeeProducts(id) |
| status | resolved |
| resolvedIn | b10f10d2a05b943c06625406ddf81dd2c70806dc |
| resolvedAt | 2026-11-23T12:38:02.603Z |
| resolvedNote | Fixed in b10f10d2: sessionQueries.loanProducts now calls the login-only GET /dropdown/session-employee-product (src/features/session/queries.ts:29, src/features/session/api.ts:35) instead of the HRMS employee products endpoint. |
| needsAttention | false |
| attentionNote | null |
| confirmed | true |
| confirmedNote | Confirmed by Backend |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Placeholder totals now shown as real |
| location | src/features/reports/reports-builder/types.ts:164 |
| problem | API_TOTALS_READY is true, so the footer shows the API total as is. The API contract says every total is a placeholder 0 until backend Phase 3. |
| impact | If the backend still sends 0, every column total reads 0 and looks like real data. |
| fix | Keep it false until the backend sends real totals. Leave it true only if the backend already does. |
| evidence | export const API_TOTALS_READY = true |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-02T12:32:44.069Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | true |
| confirmedNote | Created the API endpoint |
| future | false |

### previousFindings (8)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 589b8efadcb21c8194dec8be193a5fab7bf61a4f | F1 | Product filter 403s without HRMS rights | open | session/queries.ts:30 still calls getEmployeeProducts(id) from the HRMS endpoint, so it is still open. |
| 589b8efadcb21c8194dec8be193a5fab7bf61a4f | F2 | Placeholder totals now shown as real | needs-attention | reports-builder/types.ts:164 still has API_TOTALS_READY = true; the flag stays and the user's resolved mark is kept. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F1 | Rights guard disabled on both report pages | resolved | my-reports/page.tsx:9 and report-builder/page.tsx:20 wrap the page in PermissionGuard. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F3 | Print button shown but does nothing | resolved | my-reports-view.tsx:36 renders FileActions with canPrint and canExport. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F4 | Footer totals computed with floats | resolved | aggregation-footer.tsx:20 sums whole paise. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F5 | Footer says current page, uses all filtered rows | resolved | aggregation-footer.tsx:27 and :29 use reduce on the page rows. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F6 | Unreachable return after the rights guard | resolved | my-reports/page.tsx:9 has only the guard return. |
| f10ede60be90cb55e8e4aa83d0c505dd92912186 | F1 | Merge dropped the local-tooling ignore entries from .gitignore | open | The .gitignore still lacks .localtrack.md, /.penguin/ and /src/app/(app)/penguin/, so it is still open. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files changed by the commit> | passed |
| grey | tests | not run: no test script configured |

### gaps (2)

- No browser run, so the merged screens, the redirect and the greyed-out Save were reviewed from code only.
- Backend rights, branch and product scoping cannot be checked from this repo.

### info (5)

- Only 602a3f71 and 65e6a5d4 of the five earlier commits have reviews; their six findings were re-checked and stay resolved.
- Report Builder Export still ignores the Export role right and has no Print button, which you chose to leave for now.
- Print and Export rights are still hidden-button only until the backend enforces them.
- The run endpoints return all rows with no pagination, and Print or Export loads the report a second time.
- Re-run on the same code: the working tree has not changed since howismycommit-17, so F1 and F2 are unchanged.

---

## howismycommit-25

| Field | Value |
|---|---|
| id | howismycommit-25 |
| generatedAt | 2026-11-04T10:09:40+05:30 |
| author | Dhruv |
| branch | test/secpen |
| target.kind | commit |
| target.commit | f10ede60be90cb55e8e4aa83d0c505dd92912186 |
| files.changed | 43 |
| files.added | 35 |
| files.modified | 8 |
| files.deleted | 0 |
| files.insertions | 2575 |
| files.deletions | 74 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 2 |
| summary.info | 5 |
| before | The dhruv branch did not have the dev work: the report builder pages and data hooks, the shared tabs, sheet and sortable components, the data-table search highlight, two review skills, and a few tidy-ups. |
| after | The branch has all of that from dev. Report Builder gets a build view, a My Reports view, save and preview modals and its API, query and hook files. The NPA table shows Tenure (Months) cut to 2 decimals. `.gitignore` now matches dev's version. |

### changeType (4)

- feature
- config or CI
- UI
- refactor

### effects (5)

- Report Builder and My Reports screens (later moved into reports-user/_shared)
- tabs.tsx, sheet.tsx, sortable.tsx and the data table search used by other screens
- NPA loan tables (Tenure column)
- Navbar user settings: Layout Type now hidden below the sm breakpoint
- Git ignore rules for local tooling files

### filesReviewed (43)

| path | change | status | note |
|---|---|---|---|
| .claude/skills/review-standards/SKILL.md | added | green | no issues |
| .claude/skills/ui-conventions/SKILL.md | added | green | no issues |
| .gitignore | modified | amber | F1 |
| src/app/(app)/(main)/_components/navbar/user-settings-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/lms/npa/_shared/common-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_hooks/use-builder-session.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_lib/report-columns.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_schema.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/available-columns-panel.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/category-pills.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/count-pill.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/field-list.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/index.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/mobile-action-bar.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/mode-banner.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/save-button.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/save-template-modal.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/selected-column-row.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/selected-columns-panel.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/table-preview-modal.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/use-column-selection.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/use-save-template.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/workspace-switcher.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/filters-sidebar.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/index.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/report-actions.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/report-results.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/template-card.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/use-filter-options.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/use-report-filters.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/page.tsx | added | green | no issues |
| src/components/data-table/data-table-context.tsx | modified | green | no issues |
| src/components/data-table/global-filter.ts | added | green | no issues |
| src/components/data-table/index.ts | modified | green | no issues |
| src/components/data-table/search-highlight.tsx | added | green | no issues |
| src/components/highlighted-text.tsx | added | green | no issues |
| src/components/tabs.tsx | modified | green | no issues |
| src/components/ui/sheet.tsx | modified | green | no issues |
| src/components/ui/sortable.tsx | modified | green | no issues |
| src/features/reports/reports-builder/api.ts | added | green | no issues |
| src/features/reports/reports-builder/hooks.ts | added | green | no issues |
| src/features/reports/reports-builder/queries.ts | added | green | no issues |
| src/features/reports/reports-builder/types.ts | added | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Merge dropped the local-tooling ignore entries from .gitignore |
| location | .gitignore:55 |
| problem | The merge took the dev side of .gitignore and dropped the branch's own entries for `.localtrack.md`, `/.penguin/` and `/src/app/(app)/penguin/`. They are still missing in the current file. `git check-ignore` reports none of them as ignored. |
| impact | If `.localtrack.md`, a `.penguin/` folder or the penguin panel folder is created here, `git add -A` stages it and it can be committed and pushed. Nothing is staged today: none of them exist in this checkout now. |
| fix | Add `.localtrack.md`, `/.penguin/` and `/src/app/(app)/penguin/` back to .gitignore (a separate commit on the branch that needs them). |
| evidence | certificates<br>docs/ |
| status | resolved |
| resolvedIn | 653eb5bc6202fdd03d6f0e5b5d94098f7d9efac0 |
| resolvedAt | 2026-11-23T12:25:45.662Z |
| resolvedNote | Fixed in 653eb5bc: .gitignore lists .localtrack.md, /.penguin/ and /src/app/(app)/penguin/ (.gitignore:62-64). |
| needsAttention | false |
| attentionNote | null |
| confirmed | true |
| confirmedNote | Confirmed by me |

### previousFindings (6)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 9e9c05273eec9ade4f153846e01bf3b232fc1de6 | F1 | Commercial panel pagination loses its padding | resolved | ucrf-commercial-report-panel.tsx:127 wraps UcrfGridPagination in p-4, and the consumer panel footer has p-4, so the padding is back. |
| 9e9c05273eec9ade4f153846e01bf3b232fc1de6 | F2 | Blue and green download buttons flip to primary on hover | resolved | ucrf-xlsx-preview-modal.tsx:133 sets hover:bg-green-600/90 and disabled:hover:bg-green-600, so the hover colour no longer flips. |
| d639ba202a6b352fce6962c8fc139918c4932e18 | F1 | Invalid Tailwind class `px-4)` drops navbar padding | resolved | navbar.tsx has no `px-4)` any more (grep finds none). |
| d639ba202a6b352fce6962c8fc139918c4932e18 | F2 | Toasts lose status colours and hardcode black and white | resolved | sonner.tsx has no bg-white, text-black or bg-black classes now. |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F1 | XLSX preview renders every row at once | resolved | ucrf-xlsx-preview-modal.tsx:42 renders rows.slice(0, PREVIEW_ROW_LIMIT). |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F2 | xlsx library is imported statically in the report panel | resolved | ucrf-consumer-report-panel.tsx:44 loads xlsx with await import("xlsx"). |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint (NPA common-columns, user-settings-panel, reports-user/report-builder, features/reports/reports-builder) | passed |
| grey | tests | not run: no test script is configured in package.json (CLAUDE.md) |

### gaps (3)

- Reviewed as a merge: the diff against the first parent (the dev work brought in). The dev side was not re-reviewed line by line for behaviour that was later rewritten.
- 29 of the files have changed since the commit (the report builder was reworked and moved into reports-user/_shared); this review describes the current code for them.
- Screens were not opened in a browser for this review.

### info (5)

- Tenure (NPA) uses Number(Number(row.tenure).toFixed(2)): it rounds (11.999 shows 12) while the shared report formatters cut the digits, and a non-number value would give NaN. Outside the report-builder, My Reports and UCRF scope, so not flagged.
- .claude/ and CLAUDE.md are ignored, but the two skill files in the commit are tracked, so they were added by force. That works but later edits to other .claude files will not show.
- The untracked security/pentagi/ folder is not part of this commit.
- The Layout Type setting in user-settings-panel.tsx is now hidden on phones (hidden sm:block), which is a visible behaviour change from dev.
- Re-run on the same code: nothing in the working tree has changed since howismycommit-19, so F1 (.gitignore) is still open.

---

## howismycommit-24

| Field | Value |
|---|---|
| id | howismycommit-24 |
| generatedAt | 2026-11-04T10:08:01+05:30 |
| author | Dhruv |
| branch | test/secpen |
| target.kind | commit |
| target.commit | 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 |
| files.changed | 52 |
| files.added | 13 |
| files.modified | 39 |
| files.deleted | 0 |
| files.insertions | 1714 |
| files.deletions | 287 |
| verdict | looks-good |
| score | 95 |
| commitScore | 51 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 5 |
| before | There was no My Reports page and no report rights per designation. Report Builder had its own copy of the report list. Footer totals did not exist. |
| after | A My Reports page lists the reports a designation may see, with filters, Print and Export. The designation page has a Reports rights tab. Report tables show footer totals. Several detail forms were reshaped. |

### changeType (3)

- feature
- UI
- API

### effects (5)

- New My Reports page and a Reports rights tab on the designation page
- Report Builder screens: column choice, save modal and stale-column modal
- Branch, dealer, lender, product, designation and employee forms (shared edits)
- Aggregation footer used by every report table
- Later work moved most My Reports files into reports-user/_shared

### filesReviewed (52)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/branches/_components/branch-details-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/co-lending/_components/lender-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/dealers/_components/dealer-detail-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/loan-products/_components/product-details-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/vendors/_components/vendor-detail-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/hrms/designations/[id]/_tabs/reports-rights.tab.tsx | added | green | no issues |
| src/app/(app)/(main)/hrms/designations/[id]/page.tsx | modified | green | no issues |
| src/app/(app)/(main)/hrms/designations/_components/designation-detail-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/hrms/employees/_components/employee-on-role.form.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/filters-sidebar.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/my-reports-view.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/report-actions.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx | added | green | F3 |
| src/app/(app)/(main)/reports-user/my-reports/_components/template-card.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/use-filter-options.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/use-report-filters.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_lib/report-columns.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_schema.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/page.tsx | added | green | F1 |
| src/app/(app)/(main)/reports-user/report-builder/_hooks/use-builder-session.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_lib/report-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/available-columns-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/category-pills.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/field-list.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/index.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/mode-banner.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/save-template-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/selected-column-row.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/selected-columns-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/stale-columns-modal.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/table-preview-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/use-column-selection.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/use-save-template.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/filters-sidebar.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/index.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/report-actions.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/report-results.tsx | modified | green | F3 |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/template-card.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/use-report-filters.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/page.tsx | modified | green | no issues |
| src/components/data-table/data-table.tsx | modified | green | no issues |
| src/components/data-table/global-filter.ts | modified | green | no issues |
| src/config/page-ids.config.ts | modified | green | no issues |
| src/features/hrms/designations/api.ts | modified | green | no issues |
| src/features/hrms/designations/hooks.ts | modified | green | no issues |
| src/features/hrms/designations/queries.ts | modified | green | no issues |
| src/features/hrms/designations/types.ts | modified | green | no issues |
| src/features/reports/reports-builder/aggregation-footer.tsx | added | green | F4 |
| src/features/reports/reports-builder/api.ts | modified | green | no issues |
| src/features/reports/reports-builder/hooks.ts | modified | green | no issues |
| src/features/reports/reports-builder/queries.ts | modified | green | no issues |
| src/features/reports/reports-builder/types.ts | modified | green | no issues |

### findings (6)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | Rights guard disabled on both report pages |
| location | src/app/(app)/(main)/reports-user/my-reports/page.tsx:12 |
| problem | PermissionGuard is commented out on My Reports and Report Builder, so both pages render for every signed-in user. The backend has no rights check on POST /query or GET /templates/:id either. |
| impact | A user without the page right can open the pages and read any report's data. Intentional for now, but committed as is. |
| fix | Restore the guard (uncomment the imports, PAGE_ID and the guard return) before release, and add the backend check. |
| evidence |   // return <PermissionGuard comp={<Component />} pageId={PAGE_ID} /><br>  return <Component /> |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:34:25+05:30 |
| resolvedNote | PermissionGuard is back on both pages at src/app/(app)/(main)/reports-user/my-reports/page.tsx:10 and src/app/(app)/(main)/reports-user/report-builder/page.tsx:18. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P2 |
| title | Report query has no branch limit |
| location | src/app/(app)/(main)/reports-user/my-reports/_components/use-report-filters.ts:70 |
| problem | branchIdArr is sent only when the user picks branches. With none picked the query runs across all branches. |
| impact | A branch-level user such as a cashier can see data for branches they have no access to. |
| fix | Send the user's own branch ids when none are picked, or scope it in POST /query on the backend. |
| evidence | branchIdArr: values.branchIdArr?.length ? values.branchIdArr : undefined, |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-02T09:24:09.737Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | true |
| confirmedNote | Confirmed by BRD |

#### findings[3] · F3

| Field | Value |
|---|---|
| id | F3 |
| severity | P2 |
| title | Print button shown but does nothing |
| location | src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx:68 |
| problem | ReportActions is given empty onPrint and onExport handlers, and printRef is attached but never used. The Print button appears when canPrint is true and a click does nothing. |
| impact | Users with the Print right see a dead button. No audit call is made for Export either. |
| fix | Wire onPrint to react-to-print with printRef and onExport to the export API, or hide the buttons until then. |
| evidence | onPrint={() => {}}<br>                onExport={() => {}} |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:02:36+05:30 |
| resolvedNote | Print and Export now go through ReportFileActions with getData, at src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx:85. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[4] · F4

| Field | Value |
|---|---|
| id | F4 |
| severity | P2 |
| title | Footer totals computed with floats |
| location | src/features/reports/reports-builder/aggregation-footer.tsx:17 |
| problem | Clicking a total re-aggregates cell values in the browser with Number and reduce. Money columns are summed and averaged as floats, against the project rule. |
| impact | The shown-rows total can differ by a rounding error from the API total on money columns. |
| fix | Have the API return per-filter totals as formatted strings, or label the value as indicative only. |
| evidence | return numbers.reduce((a, b) => a + b, 0) |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:02:36+05:30 |
| resolvedNote | Sums and averages now run on whole paise integers, at src/features/reports/reports-builder/aggregation-footer.tsx:19. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[5] · F5

| Field | Value |
|---|---|
| id | F5 |
| severity | P3 |
| title | Footer says current page, uses all filtered rows |
| location | src/features/reports/reports-builder/aggregation-footer.tsx:46 |
| problem | The tooltip says the value is for the current page, but the caller passes table.getFilteredRowModel().rows, which is every row that matches the search, not one page. Math.max(...numbers) also spreads the whole array. |
| impact | The label misleads users, and a very large report could throw a RangeError on Maximum or Minimum. |
| fix | Change the wording to match the rows used, or use getRowModel(); fold min and max with reduce instead of spread. |
| evidence | ? "From the current page. Click for the total"<br>      return Math.max(...numbers) |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:02:36+05:30 |
| resolvedNote | Footer uses table.getRowModel() (visible page) at src/app/(app)/(main)/reports-user/my-reports/_lib/report-columns.tsx:54, and min/max use reduce at aggregation-footer.tsx:26. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[6] · F6

| Field | Value |
|---|---|
| id | F6 |
| severity | P3 |
| title | Unreachable return after the rights guard |
| location | src/app/(app)/(main)/reports-user/my-reports/page.tsx:10 |
| problem | Page returns the PermissionGuard and then a second `return <Component />` on the next line, which can never run. Same in report-builder/page.tsx. |
| impact | Dead code that hides a mistake: it looks like the page opens without a guard. |
| fix | Delete the plain `return <Component />` line in both page.tsx files. |
| evidence | return <PermissionGuard comp={<Component />} pageId={PAGE_ID} /><br>  return <Component /> |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:39:01+05:30 |
| resolvedNote | The extra return is gone; only the guard return remains at src/app/(app)/(main)/reports-user/my-reports/page.tsx:10 and src/app/(app)/(main)/reports-user/report-builder/page.tsx:18. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (7)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F1 | Rights guard disabled on both report pages | resolved | my-reports/page.tsx:9 and report-builder/page.tsx:20 wrap the page in PermissionGuard with a pageId. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F2 | Report query has no branch limit | resolved | Confirmed by the user, so it was not re-checked. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F3 | Print button shown but does nothing | resolved | my-reports-view.tsx:36 renders FileActions with canPrint and canExport from the report. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F4 | Footer totals computed with floats | resolved | aggregation-footer.tsx:20 sums whole paise (Math.round(n * 100)). |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F5 | Footer says current page, uses all filtered rows | resolved | aggregation-footer.tsx:27 and :29 use reduce on page rows; report-columns.tsx reads table.getRowModel(). |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F6 | Unreachable return after the rights guard | resolved | my-reports/page.tsx:9 has only the guard return. |
| f10ede60be90cb55e8e4aa83d0c505dd92912186 | F1 | Merge dropped the local-tooling ignore entries from .gitignore | open | The .gitignore at :55 still lacks .localtrack.md, /.penguin/ and /src/app/(app)/penguin/, so it is still open. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx eslint (reports-user, hrms/designations, features/reports, features/hrms/designations) | passed |
| green | npx tsc --noEmit | passed (run earlier in this session on the same tree; no source edits since) |
| grey | tests | not run: no test script is configured in package.json (CLAUDE.md) |

### gaps (5)

- 13 of the 52 files no longer exist: their code was moved into reports-user/_shared. Defects found in the moved code later are in howismycommit-17 and 18, not here.
- The screens were read from code, not opened in a browser.
- Backend rights and branch scoping cannot be checked from this repo.
- F2 is confirmed by the user and was not checked again.
- The five form files and the rights tab were not traced line by line.

### info (5)

- Print and Export call the run endpoint again, so each click loads the report a second time (earlier note).
- Page IDs in page-ids.config.ts changed after this commit; confirm they match the database.
- The old my-reports/_components/report-actions.tsx is gone, so the unused-file note no longer applies.
- API_TOTALS_READY is still true while totals are a placeholder 0 until the backend finishes them (howismycommit-17 F2).
- The f10ede60 .gitignore finding is still open and is listed with the previous findings.

---

## howismycommit-23

| Field | Value |
|---|---|
| id | howismycommit-23 |
| generatedAt | 2026-11-04T10:05:25+05:30 |
| author | Dhruv |
| branch | test/secpen |
| target.kind | commit |
| target.commit | d639ba202a6b352fce6962c8fc139918c4932e18 |
| files.changed | 20 |
| files.added | 0 |
| files.modified | 19 |
| files.deleted | 1 |
| files.insertions | 301 |
| files.deletions | 436 |
| verdict | looks-good |
| score | 100 |
| commitScore | 92 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 3 |
| summary.info | 4 |
| before | The UCRF pages, sidebar, navbar, settings panel and login page were laid out for wide screens. Toasts followed the theme. |
| after | These screens adapt to small screens. The login button stays off until both fields have text. The navbar and settings panel get a new look, toasts and help pop-ups got new colours, and one internal doc was deleted. |

### changeType (3)

- UI
- feature
- docs

### effects (6)

- UCRF Data Submission page and its panels, pagination and preview modals
- Navbar, sidebar, user settings and the home page layout
- Login page: Login button is disabled until username and password are filled
- Every toast in the app (Toaster in app/layout.tsx and ui/sonner.tsx)
- Form field help pop-up colour (form-field.tsx)
- docs/git-changes-review.md removed; .gitignore got three new lines

### filesReviewed (20)

| path | change | status | note |
|---|---|---|---|
| .gitignore | modified | green | no issues |
| docs/git-changes-review.md | deleted | green | no issues |
| src/app/(app)/(auth)/login/page.tsx | modified | green | no issues |
| src/app/(app)/(main)/_components/navbar/navbar.tsx | modified | amber | F1 |
| src/app/(app)/(main)/_components/navbar/user-settings-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/_components/sidebar/index.tsx | modified | green | no issues |
| src/app/(app)/(main)/page.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-bureau-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-commercial-report-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-field-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-filters.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-grid-pagination.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-skipped-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-tudf-preview-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/page.tsx | modified | green | no issues |
| src/app/(app)/layout.tsx | modified | amber | F2 |
| src/components/form/form-field.tsx | modified | green | no issues |
| src/components/ui/sonner.tsx | modified | amber | F2 |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Invalid Tailwind class `px-4)` drops navbar padding |
| location | src/app/(app)/(main)/_components/navbar/navbar.tsx:78 |
| problem | The class string contains `px-4)` with a stray parenthesis, so Tailwind does not generate it. The old `px-4` class was removed in the same edit. |
| impact | The right-hand navbar panel (loan chat listener and user area) renders without horizontal padding, so its content touches the edges. |
| fix | Change `px-4)` to `px-4` in the class string. |
| evidence | "px-4) relative z-[1] flex h-full w-56 flex-col items-center justify-center gap-1 rounded-bl-3xl bg-card", |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-29T09:41:36.882Z |
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
| title | Toasts lose status colours and hardcode black and white |
| location | src/components/ui/sonner.tsx:27 |
| problem | The toast classes use bg-white, text-black and bg-black, and richColors was removed from the Toaster in src/app/(app)/layout.tsx:25. AGENTS.md requires design system tokens, not fixed colours. |
| impact | Success and error toasts from useFormFlow and mutations no longer show green or red, so failures are harder to notice. Toasts also ignore theme changes. |
| fix | Restore richColors on the Toaster and use tokens such as bg-background and text-foreground in sonner.tsx instead of white and black. |
| evidence | group-[.toaster]:bg-white group-[.toaster]:text-black dark:group-[.toaster]:bg-black |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-28T12:14:20.942Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (4)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| d639ba202a6b352fce6962c8fc139918c4932e18 | F1 | Invalid Tailwind class `px-4)` drops navbar padding | resolved | navbar.tsx:78 now ends the class string with px-4 and no `px-4)` is left. |
| d639ba202a6b352fce6962c8fc139918c4932e18 | F2 | Toasts lose status colours and hardcode black and white | resolved | layout.tsx:25 has richColors again and sonner.tsx:27 uses bg-background and text-foreground. |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F1 | XLSX preview renders every row at once | resolved | ucrf-xlsx-preview-modal.tsx:42 renders rows.slice(0, PREVIEW_ROW_LIMIT). |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F2 | xlsx library is imported statically in the report panel | resolved | ucrf-consumer-report-panel.tsx:44 loads xlsx with await import("xlsx"). |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx eslint (login page, main _components, form-field, sonner, app layout, home page, ucrf-submission) | passed |
| green | npx tsc --noEmit | passed (run earlier in this session on the same tree; no source edits since) |
| grey | tests | not run: no test script is configured in package.json (CLAUDE.md) |

### gaps (3)

- Both findings were fixed after the commit. They were checked against the current files and counted as resolved, as in the earlier reports.
- The screens were read from code, not opened on a phone or in a browser.
- user-settings-panel.tsx and sidebar/index.tsx are mostly layout changes; they were scanned for storage, token and typing problems, not traced line by line.

### info (4)

- Login: the button stays disabled until both fields have text. Some browsers fill saved passwords without firing a change event, so the button can stay off until the user types. Not confirmed here.
- user-settings-panel.tsx still passes the layout mode through `as unknown as any`.
- The help pop-up in form-field.tsx now uses bg-primary with text-background, which depends on the theme colours for contrast.
- The same commit also added .claude/, .localtrack.md and a tracker comment to .gitignore; a later merge dropped the .localtrack.md line (howismycommit-19 F1).

---

## howismycommit-22

| Field | Value |
|---|---|
| id | howismycommit-22 |
| generatedAt | 2026-11-04T10:03:49+05:30 |
| author | Dhruv |
| branch | test/secpen |
| target.kind | commit |
| target.commit | e1ded77299cbebe2c0f4afce1684037547e991ac |
| files.changed | 11 |
| files.added | 5 |
| files.modified | 6 |
| files.deleted | 0 |
| files.insertions | 1522 |
| files.deletions | 35 |
| verdict | looks-good |
| score | 100 |
| commitScore | 86 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 4 |
| before | The UCRF page only had two direct download buttons for XLSX and TUDF. The Skipped records table sat in a fixed box. |
| after | Each file has a preview (eye) button and a download button. Previews load once per filter set and are kept for 5 minutes. The Skipped table has its own header, count, search and export. Four review notes were added under docs/. |

### changeType (3)

- feature
- UI
- docs

### effects (4)

- UCRF Data Submission page: consumer panel and Skipped records table
- features/reports/api.ts: new getUcrfConsumerXlsx and getUcrfConsumerTudf; the download functions now use them
- One extra download of each file when a user opens a preview
- Four internal docs were committed, and later removed and ignored

### filesReviewed (11)

| path | change | status | note |
|---|---|---|---|
| .gitignore | modified | green | no issues |
| docs/git-changes-review.md | added | green | no issues |
| docs/ucrf-report-audit.md | added | green | no issues |
| docs/ucrf-report.md | added | green | no issues |
| docs/ucrf-submission-responsiveness.md | added | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx | modified | amber | F2 |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-grid-pagination.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-tudf-preview-modal.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx | added | amber | F1 |
| src/app/(app)/(main)/reports-user/ucrf-submission/page.tsx | modified | green | no issues |
| src/features/reports/api.ts | modified | green | no issues |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | XLSX preview renders every row at once |
| location | src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx:86 |
| problem | The table maps over all rows from the parsed sheet with no row limit or pagination, and renders one td for every column in every row. |
| impact | A report with thousands of records creates tens of thousands of DOM nodes when the dialog opens, so the tab freezes or becomes slow to scroll. |
| fix | Show only the first N rows (for example 100) with a note such as `Showing first 100 of <total> rows`, or paginate the preview. |
| evidence | {rows.map((row, rowIndex) => ( |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-27T06:31:53.643Z |
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
| title | xlsx library is imported statically in the report panel |
| location | src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx:20 |
| problem | `import { read, utils } from "xlsx"` is at the top of the panel, so the library is part of the page bundle even when the user never opens the XLSX preview. |
| impact | Every visit to the UCRF submission page downloads and parses the xlsx code, which makes the first load heavier. |
| fix | Load it inside parseXlsxPreview with `const { read, utils } = await import("xlsx")`. |
| evidence | import { read, utils } from "xlsx" |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-27T05:40:26.253Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| e1ded77299cbebe2c0f4afce1684037547e991ac | F1 | XLSX preview renders every row at once | resolved | ucrf-xlsx-preview-modal.tsx:42 renders rows.slice(0, PREVIEW_ROW_LIMIT) with a limit of 40. |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F2 | xlsx library is imported statically in the report panel | resolved | ucrf-consumer-report-panel.tsx:44 loads xlsx with await import("xlsx"). |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx eslint src/app/(app)/(main)/reports-user/ucrf-submission src/features/reports/api.ts | passed |
| green | npx tsc --noEmit | passed (run earlier in this session on the same tree; no source edits since) |
| grey | tests | not run: no test script is configured in package.json (CLAUDE.md) |

### gaps (3)

- The two findings were fixed after the commit. They were checked against the current files and counted as resolved, as in the earlier report.
- The previews were read from code, not opened in a browser.
- The four docs files were not read in detail: they are notes, not code, and are gone from the working tree.

### info (4)

- The TUDF preview puts the whole file text in a read-only text area with no size limit. It works, but a very large file would be heavy. The XLSX preview has a 40-row limit.
- The XLSX preview downloads and parses the whole file in the browser before it shows the first rows.
- The page was reworked for small screens after this commit (ucrf-submission/page.tsx, grid pagination, TUDF modal).
- Four internal docs were committed here and have since been removed; docs/ is now in .gitignore.

---

## howismycommit-21

| Field | Value |
|---|---|
| id | howismycommit-21 |
| generatedAt | 2026-11-04T10:00:33+05:30 |
| author | Dhruv |
| branch | test/secpen |
| target.kind | commit |
| target.commit | d73ceed5ecc97991e6409656bf26d039f38e31a9 |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 31 |
| files.deletions | 6 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 3 |
| before | The External APIs page showed every integration group in one grid. |
| after | The page splits the groups into Enabled and Disabled tabs. The search still works across both, and the chosen tab is kept in the URL. |

### changeType (2)

- feature
- UI

### effects (3)

- configuration/external-apis page only (brought in from dev, commit 54cfde79)
- A group moves between tabs after its Enabled setting is saved and the list reloads
- The tab is kept in the URL query (external-apis-tab), not in local storage

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/external-apis/page.tsx | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (4)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| f88be9b9d6f893c89d7b66a5f54abc89b6759f5f | F1 | UCRF alignment decided per page | open | ucrf-grid-format.ts:25 still picks the alignment from the rows of one page, so it is still open. |
| f88be9b9d6f893c89d7b66a5f54abc89b6759f5f | F2 | Report numbers differ from UCRF and pass through a float | open | report-columns.tsx:21 still runs number text through truncateDecimals, so it is still open. |
| 589b8efadcb21c8194dec8be193a5fab7bf61a4f | F1 | Product filter 403s without HRMS rights | open | session/queries.ts:30 still calls getEmployeeProducts(id), so it is still open. |
| 589b8efadcb21c8194dec8be193a5fab7bf61a4f | F2 | Placeholder totals now shown as real | needs-attention | reports-builder/types.ts:164 still has API_TOTALS_READY = true; the flag stays and the resolved mark is kept. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx eslint src/app/(app)/(main)/configuration/external-apis/page.tsx | passed |
| green | npx tsc --noEmit | passed (run earlier in this session on the same tree; no source edits since) |
| grey | tests | not run: no test script is configured in package.json (CLAUDE.md) |

### gaps (3)

- The tab behaviour was read from code, not opened in a browser.
- This is dev's change; the review covers only this one page.
- Commits 602a3f71 and 8ee98644 have no open findings of their own to re-check.

### info (3)

- If a tab has no groups (all enabled, or the search matches none) the tab shows an empty area with no message. The old page did the same for no match, so it is not flagged.
- The page file has not changed since this commit.
- No tests exist for this page and no test command is configured.

---

## howismycommit-20

| Field | Value |
|---|---|
| id | howismycommit-20 |
| generatedAt | 2026-11-04T09:59:19+05:30 |
| author | Dhruv |
| branch | test/secpen |
| target.kind | commit |
| target.commit | 8ee98644043163de724a36a0c737338171855d49 |
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
| before | feat/report-builder had the f88be9b9 report formatting work and had not yet merged origin/dev at 6b67e753. |
| after | The branch has a merge commit with the same files as before. dev's tip 6b67e753 was already in the branch's history, so the merge changed no file. |

### changeType (1)

- config or CI

### effects (2)

- No source file changes, so no screen, API or data behaviour changes.
- History gets one extra merge commit on feat/report-builder.

### filesReviewed (0)

_Empty._

### findings (0)

_Empty._

### previousFindings (9)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| f88be9b9d6f893c89d7b66a5f54abc89b6759f5f | F1 | UCRF alignment decided per page | open | ucrf-grid-format.ts:25 still picks the alignment from the rows passed in (one page), so it is still open. |
| f88be9b9d6f893c89d7b66a5f54abc89b6759f5f | F2 | Report numbers differ from UCRF and pass through a float | open | report-columns.tsx:21 still runs number text through truncateDecimals, so it is still open. |
| 589b8efadcb21c8194dec8be193a5fab7bf61a4f | F1 | Product filter 403s without HRMS rights | open | session/queries.ts:30 still calls getEmployeeProducts(id) from the HRMS endpoint, so it is still open. |
| 589b8efadcb21c8194dec8be193a5fab7bf61a4f | F2 | Placeholder totals now shown as real | needs-attention | reports-builder/types.ts:164 still has API_TOTALS_READY = true; the existing needs-attention flag stays and the user's resolved mark is kept. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F1 | Rights guard disabled on both report pages | resolved | my-reports/page.tsx:9 and report-builder/page.tsx:20 wrap the page in PermissionGuard with a pageId. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F3 | Print button shown but does nothing | resolved | my-reports-view.tsx:36 renders FileActions with canPrint from the report's right. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F4 | Footer totals computed with floats | resolved | aggregation-footer.tsx:17 sums whole paise (Math.round(n * 100)). |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F5 | Footer says current page, uses all filtered rows | resolved | aggregation-footer.tsx:46 uses getRowValues() on the table's rows with the page label and star. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F6 | Unreachable return after the rights guard | resolved | my-reports/page.tsx has no code after the guard's return. |

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed (run earlier in this session on the same code; no source edits since) |
| grey | tests | not run: no test script is configured in package.json (CLAUDE.md) |

### gaps (3)

- The commit changes no files, so there is nothing new to read; only earlier findings were re-checked.
- howismycommit-17 and 18 findings were left as they are: the code still has them. The one flagged resolved mark (API_TOTALS_READY) stays flagged.
- 65e6a5d4 F2 is confirmed by the user and was not re-checked.

### info (3)

- The merge is empty because dev's commit 6b67e753 (PR #128) was already in the branch.
- Only d73ceed5 and 54cfde79 (the external-apis page) came after this commit.
- The untracked security/ folder is not part of this commit.

---

## howismycommit-19

| Field | Value |
|---|---|
| id | howismycommit-19 |
| generatedAt | 2026-11-04T09:58:20+05:30 |
| author | Dhruv |
| branch | test/secpen |
| target.kind | commit |
| target.commit | f10ede60be90cb55e8e4aa83d0c505dd92912186 |
| files.changed | 43 |
| files.added | 35 |
| files.modified | 8 |
| files.deleted | 0 |
| files.insertions | 2575 |
| files.deletions | 74 |
| verdict | review-with-caution |
| score | 96 |
| commitScore | 96 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 2 |
| summary.info | 4 |
| before | The dhruv branch did not have the dev work: the report builder pages and data hooks, the shared tabs, sheet and sortable components, the data-table search highlight, two review skills, and a few tidy-ups. |
| after | The branch has all of that from dev. Report Builder gets a build view, a My Reports view, save and preview modals and its API, query and hook files. The NPA table shows Tenure (Months) cut to 2 decimals. `.gitignore` now matches dev's version. |

### changeType (4)

- feature
- config or CI
- UI
- refactor

### effects (5)

- Report Builder and My Reports screens (later moved into reports-user/_shared)
- tabs.tsx, sheet.tsx, sortable.tsx and the data table search used by other screens
- NPA loan tables (Tenure column)
- Navbar user settings: Layout Type now hidden below the sm breakpoint
- Git ignore rules for local tooling files

### filesReviewed (43)

| path | change | status | note |
|---|---|---|---|
| .claude/skills/review-standards/SKILL.md | added | green | no issues |
| .claude/skills/ui-conventions/SKILL.md | added | green | no issues |
| .gitignore | modified | amber | F1 |
| src/app/(app)/(main)/_components/navbar/user-settings-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/lms/npa/_shared/common-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_hooks/use-builder-session.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_lib/report-columns.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_schema.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/available-columns-panel.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/category-pills.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/count-pill.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/field-list.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/index.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/mobile-action-bar.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/mode-banner.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/save-button.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/save-template-modal.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/selected-column-row.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/selected-columns-panel.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/table-preview-modal.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/use-column-selection.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/use-save-template.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/workspace-switcher.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/filters-sidebar.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/index.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/report-actions.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/report-results.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/template-card.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/use-filter-options.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/use-report-filters.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/page.tsx | added | green | no issues |
| src/components/data-table/data-table-context.tsx | modified | green | no issues |
| src/components/data-table/global-filter.ts | added | green | no issues |
| src/components/data-table/index.ts | modified | green | no issues |
| src/components/data-table/search-highlight.tsx | added | green | no issues |
| src/components/highlighted-text.tsx | added | green | no issues |
| src/components/tabs.tsx | modified | green | no issues |
| src/components/ui/sheet.tsx | modified | green | no issues |
| src/components/ui/sortable.tsx | modified | green | no issues |
| src/features/reports/reports-builder/api.ts | added | green | no issues |
| src/features/reports/reports-builder/hooks.ts | added | green | no issues |
| src/features/reports/reports-builder/queries.ts | added | green | no issues |
| src/features/reports/reports-builder/types.ts | added | green | no issues |

### findings (1)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Merge dropped the local-tooling ignore entries from .gitignore |
| location | .gitignore:55 |
| problem | The merge took the dev side of .gitignore and dropped the branch's own entries for `.localtrack.md`, `/.penguin/` and `/src/app/(app)/penguin/`. They are still missing in the current file. `git check-ignore` reports none of them as ignored. |
| impact | If `.localtrack.md`, a `.penguin/` folder or the penguin panel folder is created here, `git add -A` stages it and it can be committed and pushed. Nothing is staged today: none of them exist in this checkout now. |
| fix | Add `.localtrack.md`, `/.penguin/` and `/src/app/(app)/penguin/` back to .gitignore (a separate commit on the branch that needs them). |
| evidence | certificates<br>docs/ |
| status | resolved |
| resolvedIn | 653eb5bc6202fdd03d6f0e5b5d94098f7d9efac0 |
| resolvedAt | 2026-11-23T12:25:45.662Z |
| resolvedNote | Fixed in 653eb5bc: .gitignore lists .localtrack.md, /.penguin/ and /src/app/(app)/penguin/ (.gitignore:62-64). |
| needsAttention | false |
| attentionNote | null |
| confirmed | true |
| confirmedNote | Confirmed by me |

### previousFindings (6)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 9e9c05273eec9ade4f153846e01bf3b232fc1de6 | F1 | Commercial panel pagination loses its padding | uncertain | ucrf-grid-pagination.tsx:36 still has the same wrapper class, so I could not prove from this line alone where the padding comes from; left as it was. |
| 9e9c05273eec9ade4f153846e01bf3b232fc1de6 | F2 | Blue and green download buttons flip to primary on hover | resolved | ucrf-xlsx-preview-modal.tsx:133 sets hover:bg-green-600/90 and disabled:hover:bg-green-600, so the hover colour no longer flips. |
| d639ba202a6b352fce6962c8fc139918c4932e18 | F1 | Invalid Tailwind class `px-4)` drops navbar padding | resolved | navbar.tsx has no `px-4)` any more (grep finds none). |
| d639ba202a6b352fce6962c8fc139918c4932e18 | F2 | Toasts lose status colours and hardcode black and white | resolved | sonner.tsx has no bg-white, text-black or bg-black classes now. |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F1 | XLSX preview renders every row at once | resolved | ucrf-xlsx-preview-modal.tsx:42 renders rows.slice(0, PREVIEW_ROW_LIMIT). |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F2 | xlsx library is imported statically in the report panel | resolved | ucrf-consumer-report-panel.tsx:44 loads xlsx with await import("xlsx"). |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint (NPA common-columns, user-settings-panel, reports-user/report-builder, features/reports/reports-builder) | passed |
| grey | tests | not run: no test script is configured in package.json (CLAUDE.md) |

### gaps (4)

- Reviewed as a merge: the diff against the first parent (the dev work brought in). The dev side was not re-reviewed line by line for behaviour that was later rewritten.
- 29 of the files have changed since the commit (the report builder was reworked and moved into reports-user/_shared); this review describes the current code for them.
- Screens were not opened in a browser for this review.
- ucrf-grid-pagination.tsx:36 padding finding could not be proven either way.

### info (4)

- Tenure (NPA) uses Number(Number(row.tenure).toFixed(2)): it rounds (11.999 shows 12) while the shared report formatters cut the digits, and a non-number value would give NaN. Outside the report-builder, My Reports and UCRF scope, so not flagged.
- .claude/ and CLAUDE.md are ignored, but the two skill files in the commit are tracked, so they were added by force. That works but later edits to other .claude files will not show.
- The untracked security/pentagi/ folder is not part of this commit.
- The Layout Type setting in user-settings-panel.tsx is now hidden on phones (hidden sm:block), which is a visible behaviour change from dev.

---

## howismycommit-18

| Field | Value |
|---|---|
| id | howismycommit-18 |
| generatedAt | 2026-11-03T13:00:22+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | f88be9b9d6f893c89d7b66a5f54abc89b6759f5f |
| files.changed | 12 |
| files.added | 2 |
| files.modified | 10 |
| files.deleted | 0 |
| files.insertions | 230 |
| files.deletions | 53 |
| verdict | review-with-caution |
| score | 92 |
| commitScore | 92 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 2 |
| summary.info | 4 |
| before | Report cells showed rounded numbers and raw ISO dates, all columns were left aligned, and the UCRF grids showed values as sent. |
| after | Report Builder, My Reports and the UCRF consumer and commercial grids show dd-mm-yyyy dates and 2 clipped decimals, and number columns sit on the right. The shared table has an opt-in align option, and the helpers live in src/lib/format-value.ts and features/reports/ucrf/ucrf-grid-format.ts. |

### changeType (2)

- feature
- ui

### effects (4)

- The shared DataTable gains meta.align; other tables are unchanged until they opt in.
- Report footers align their totals with number columns.
- Excel export and Print still use the raw values, so files differ from the screen.
- UCRF grids now depend on src/lib/format-value.ts.

### filesReviewed (12)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/reports-user/_shared/report-columns.tsx | modified | amber | F2 |
| src/app/(app)/(main)/reports-user/_shared/report-results.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/use-report-filters.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-commercial-grid-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-commercial-report-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-grid-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx | modified | green | no issues |
| src/components/data-table/data-table.tsx | modified | green | no issues |
| src/components/data-table/global-filter.ts | modified | green | no issues |
| src/features/reports/reports-builder/aggregation-footer.tsx | modified | green | no issues |
| src/features/reports/ucrf/ucrf-grid-format.ts | added | amber | F1 |
| src/lib/format-value.ts | added | green | no issues |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | UCRF alignment decided per page |
| location | src/features/reports/ucrf/ucrf-grid-format.ts:32 |
| problem | ucrfColumnAlign looks at the rows passed in, and the UCRF grid passes only the current page (grid.rows, a server page). A column that is all numbers on page 1 but has a non-number, or is empty, on page 2 changes side when the user pages. |
| impact | Columns jump between left and right while paging, which looks like a bug in a table that is meant to be stable. |
| fix | Decide alignment from the column, not the page: keep it once decided per column key, or use a fixed list of numeric UCRF keys. |
| evidence | rows.map((row) => row[columnKey]), |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-05T06:51:38.407Z |
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
| title | Report numbers differ from UCRF and pass through a float |
| location | src/app/(app)/(main)/reports-user/_shared/report-columns.tsx:21 |
| problem | Report Builder and My Reports clip with truncateDecimals, which turns number text into a JS number and drops trailing zeros (12.000000004 shows 12). UCRF uses formatDecimals, which cuts the text and keeps two decimals (12.00). |
| impact | The same value reads 12 in one report and 12.00 in another, and number text beyond about 15 significant digits loses digits in the two report screens. |
| fix | Use formatDecimals in report-columns.tsx for text values (and for numbers when two fixed decimals are wanted); keep truncateDecimals only for the footer maths. |
| evidence | if (/^-?\d+\.\d+$/.test(v)) return truncateDecimals(v) |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-05T06:51:39.707Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 589b8efadcb21c8194dec8be193a5fab7bf61a4f | F1 | Product filter 403s without HRMS rights | open | Still loads products from the HRMS employee endpoint at src/features/session/queries.ts:30. |
| 589b8efadcb21c8194dec8be193a5fab7bf61a4f | F2 | Placeholder totals now shown as real | needs-attention | API_TOTALS_READY is still true at src/features/reports/reports-builder/types.ts:164; your resolved mark is kept and flagged. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files changed by the commit> | passed |
| grey | tests | not run: no test script configured |

### gaps (2)

- No browser run, so the alignment, the date format and the footer layout were reviewed from code only.
- Which UCRF values are real numbers versus codes could not be confirmed without live data.

### info (4)

- Of the five earlier commits, 589b8efa, 602a3f71 and 65e6a5d4 have reviews; their findings were re-checked.
- Excel export and Print still show raw values (ISO dates, full decimals); the commit message mentions Excel alignment but export code is unchanged.
- formatDateDMY reads date-only text as UTC, so a user west of UTC would see the day before; fine in India.
- The commit hook (lint-staged) ran and the push hook ran tsc and next build, both passing.

---

## howismycommit-17

| Field | Value |
|---|---|
| id | howismycommit-17 |
| generatedAt | 2026-11-02T18:00:42+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | 589b8efadcb21c8194dec8be193a5fab7bf61a4f |
| files.changed | 31 |
| files.added | 3 |
| files.modified | 13 |
| files.deleted | 15 |
| files.insertions | 416 |
| files.deletions | 727 |
| verdict | review-with-caution |
| score | 86 |
| commitScore | 86 |
| quality | good |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 2 |
| summary.info | 4 |
| before | My Reports and the Report Builder each had their own copy of the filters, results, template card, filter options and run hook. Reports ran through POST /query, branches loaded from the HRMS employee endpoint, and rows of an old report showed while a new one loaded. |
| after | Both screens share one set of files in reports-user/_shared, chosen by a source (templates or designation). Reports run by id with filters only, branches come from the session endpoint, rows are kept only while the same report reloads, and the Builder gates Build, Edit, Duplicate, Delete and Save on page rights and redirects a typed ?view=build-report without canAdd. |

### changeType (4)

- refactor
- api
- security
- ui

### effects (4)

- My Reports and Report Builder now change together: one edit in _shared affects both screens.
- POST /reports/builder/query is no longer called anywhere.
- The Builder needs canAdd for new and duplicated reports and canEdit for editing; users without them lose those buttons.
- Branch filter options now come from /dropdown/session-employee-branch.

### filesReviewed (31)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/reports-user/_shared/filter-schema.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/filters-sidebar.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/report-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/report-results.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/report-source.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/reports-layout.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/template-card.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/use-filter-options.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/_shared/use-report-filters.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/filters-sidebar.tsx | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/my-reports-view.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/report-actions.tsx | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/template-card.tsx | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/use-report-filters.ts | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_lib/report-columns.tsx | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_schema.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/save-button.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/index.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/use-filter-options.ts | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/use-report-filters.ts | deleted | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/page.tsx | modified | green | no issues |
| src/features/reports/reports-builder/aggregation-footer.tsx | modified | green | no issues |
| src/features/reports/reports-builder/api.ts | modified | green | no issues |
| src/features/reports/reports-builder/file-data.ts | modified | green | no issues |
| src/features/reports/reports-builder/hooks.ts | modified | green | no issues |
| src/features/reports/reports-builder/queries.ts | modified | green | no issues |
| src/features/reports/reports-builder/types.ts | modified | amber | F2 |
| src/features/session/api.ts | modified | green | no issues |
| src/features/session/hooks.ts | modified | green | no issues |
| src/features/session/queries.ts | modified | amber | F1 |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | Product filter 403s without HRMS rights |
| location | src/features/session/queries.ts:30 |
| problem | The Loan Products dropdown loads the user's products from the HRMS employee endpoint, which needs the HRMS Employees page right. The branch filter was moved to a session endpoint in this commit, the product filter was not. |
| impact | A user such as a cashier gets 403 and an empty product list, so they cannot pick products. The report still runs for all their products, and the sidebar shows a hint. |
| fix | Use a session products dropdown for the logged-in employee once the backend adds one, or load products per picked branch from /dropdown/session-employee-branch/:id/product. |
| evidence | const res = await getEmployeeProducts(id) |
| status | resolved |
| resolvedIn | b10f10d2a05b943c06625406ddf81dd2c70806dc |
| resolvedAt | 2026-11-23T12:38:02.603Z |
| resolvedNote | Fixed in b10f10d2: sessionQueries.loanProducts now calls the login-only GET /dropdown/session-employee-product (src/features/session/queries.ts:29, src/features/session/api.ts:35) instead of the HRMS employee products endpoint. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Placeholder totals now shown as real |
| location | src/features/reports/reports-builder/types.ts:164 |
| problem | API_TOTALS_READY is true, so the footer shows the API total as is. The API contract says every total is a placeholder 0 until backend Phase 3. |
| impact | If the backend still sends 0, every column total reads 0 and looks like real data. |
| fix | Keep it false until the backend sends real totals. Leave it true only if the backend already does. |
| evidence | export const API_TOTALS_READY = true |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-02T12:32:44.069Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | true |
| confirmedNote | API are done. |

### previousFindings (6)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F1 | Rights guard disabled on both report pages | resolved | PermissionGuard is back on both pages at src/app/(app)/(main)/reports-user/my-reports/page.tsx:10 and src/app/(app)/(main)/reports-user/report-builder/page.tsx:18. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F2 | Report query has no branch limit | resolved | Confirmed by BRD, left as is. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F3 | Print button shown but does nothing | resolved | Print and Export now go through ReportFileActions with getData, at src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx:85. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F4 | Footer totals computed with floats | resolved | Sums and averages now run on whole paise integers, at src/features/reports/reports-builder/aggregation-footer.tsx:19. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F5 | Footer says current page, uses all filtered rows | resolved | Footer uses table.getRowModel() (visible page) at src/app/(app)/(main)/reports-user/my-reports/_lib/report-columns.tsx:54, and min/max use reduce at aggregation-footer.tsx:26. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F6 | Unreachable return after the rights guard | resolved | The extra return is gone; only the guard return remains at src/app/(app)/(main)/reports-user/my-reports/page.tsx:10 and src/app/(app)/(main)/reports-user/report-builder/page.tsx:18. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files changed by the commit> | passed |
| grey | tests | not run: no test script configured |

### gaps (2)

- No browser run, so the merged screens, the redirect and the greyed-out Save were reviewed from code only.
- Backend rights, branch and product scoping cannot be checked from this repo.

### info (4)

- Only 602a3f71 and 65e6a5d4 of the five earlier commits have reviews; their six findings were re-checked and stay resolved.
- Report Builder Export still ignores the Export role right and has no Print button, which you chose to leave for now.
- Print and Export rights are still hidden-button only until the backend enforces them.
- The run endpoints return all rows with no pagination, and Print or Export loads the report a second time.

---

## howismycommit-16

| Field | Value |
|---|---|
| id | howismycommit-16 |
| generatedAt | 2026-11-02T16:11:22+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| files.changed | 14 |
| files.added | 3 |
| files.modified | 11 |
| files.deleted | 0 |
| files.insertions | 256 |
| files.deletions | 35 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 4 |
| before | Print and Export in My Reports did nothing, footer totals used floats and all filtered rows, the reports list ignored the View right, and both report pages had their rights guard commented out. |
| after | One route-driven FileActions component and file utility build the print view or Excel file from an API response. The list drops reports without View, footer totals work on the visible page in whole paise, and both pages are guarded again with new page IDs. |

### changeType (4)

- feature
- ui
- api
- security

### effects (4)

- My Reports Print and Export now call POST /reports/builder/query again on each click.
- Report Builder and My Reports need the new page IDs to exist in the database and be linked to menus.
- Footer totals in both report tables use the visible page when clicked.
- The old my-reports report-actions component is no longer used.

### filesReviewed (14)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/reports-user/my-reports/_components/my-reports-view.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_lib/report-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/page.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_lib/report-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/page.tsx | modified | green | no issues |
| src/components/file-actions.tsx | added | green | no issues |
| src/config/page-ids.config.ts | modified | green | no issues |
| src/features/reports/reports-builder/aggregation-footer.tsx | modified | green | no issues |
| src/features/reports/reports-builder/api.ts | modified | green | no issues |
| src/features/reports/reports-builder/file-data.ts | added | green | no issues |
| src/features/reports/reports-builder/queries.ts | modified | green | no issues |
| src/features/reports/reports-builder/types.ts | modified | green | no issues |
| src/lib/file.ts | added | green | no issues |

### findings (0)

_Empty._

### previousFindings (6)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F1 | Rights guard disabled on both report pages | resolved | PermissionGuard is back on both pages at src/app/(app)/(main)/reports-user/my-reports/page.tsx:10 and src/app/(app)/(main)/reports-user/report-builder/page.tsx:18. Fixed in 602a3f71. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F2 | Report query has no branch limit | resolved | Confirmed by BRD, left as is. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F3 | Print button shown but does nothing | resolved | Print and Export now go through ReportFileActions with getData, at src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx:85. Fixed in 602a3f71. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F4 | Footer totals computed with floats | resolved | Sums and averages now run on whole paise integers, at src/features/reports/reports-builder/aggregation-footer.tsx:19. Fixed in 602a3f71. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F5 | Footer says current page, uses all filtered rows | resolved | Footer uses table.getRowModel() (visible page) at src/app/(app)/(main)/reports-user/my-reports/_lib/report-columns.tsx:54, and min/max use reduce at aggregation-footer.tsx:26. Fixed in 602a3f71. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F6 | Unreachable return after the rights guard | resolved | The extra return is gone; only the guard return remains at src/app/(app)/(main)/reports-user/my-reports/page.tsx:10 and src/app/(app)/(main)/reports-user/report-builder/page.tsx:18. Fixed in 602a3f71. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files changed by the commit> | passed |
| grey | tests | not run: no test script configured |

### gaps (3)

- No browser run, so the print iframe, the xlsx download and the guards were reviewed from code only.
- Backend rights, branch scoping and the new page IDs cannot be checked from this repo.
- The Print and Export rights are still hidden-button only until the backend enforces them.

### info (4)

- Branch limit on the report query (finding F2 of 65e6a5d) is confirmed by BRD and left as is.
- Page IDs in page-ids.config.ts changed in this commit; confirm they match the database.
- Each Print or Export click loads the report a second time from the API.
- The Excel totals row holds text such as `Sum: 1,234`, not numbers.

---

## howismycommit-15

| Field | Value |
|---|---|
| id | howismycommit-15 |
| generatedAt | 2026-11-02T15:39:07+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 |
| files.changed | 52 |
| files.added | 13 |
| files.modified | 39 |
| files.deleted | 0 |
| files.insertions | 1714 |
| files.deletions | 287 |
| verdict | review-with-caution |
| score | 85 |
| commitScore | 51 |
| quality | good |
| summary.red | 0 |
| summary.amber | 1 |
| summary.green | 2 |
| summary.info | 4 |
| before | There was a Report Builder only: reports used one list for everyone, columns were keyed by name, and there was no report rights tab or footer totals. |
| after | A My Reports page runs reports with filters. Reports Rights lives in HRMS Designation. Since the commit, Print and Export use one route-driven ReportFileActions, the list drops reports without View, footer totals use the visible page in whole paise, and the rights guard is back on both pages with new page IDs. |

### changeType (3)

- feature
- ui
- api

### effects (4)

- HRMS designation page gets a Reports Rights tab backed by /hrms/designation/:id/reports.
- Shared DataTable gets opt-in footer props, so other tables are unchanged.
- Seven configuration and HRMS forms had their edit button logic restructured with the same behaviour.
- Report Builder and My Reports query paths and the query response shape (aggregations) change.

### filesReviewed (52)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/branches/_components/branch-details-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/co-lending/_components/lender-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/dealers/_components/dealer-detail-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/loan-products/_components/product-details-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/vendors/_components/vendor-detail-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/hrms/designations/[id]/_tabs/reports-rights.tab.tsx | added | green | no issues |
| src/app/(app)/(main)/hrms/designations/[id]/page.tsx | modified | green | no issues |
| src/app/(app)/(main)/hrms/designations/_components/designation-detail-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/hrms/employees/_components/employee-on-role.form.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/filters-sidebar.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/my-reports-view.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/report-actions.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx | added | green | no issues (F3, F4, F5 resolved in working tree) |
| src/app/(app)/(main)/reports-user/my-reports/_components/template-card.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/use-filter-options.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/use-report-filters.ts | added | amber | F2 |
| src/app/(app)/(main)/reports-user/my-reports/_lib/report-columns.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_schema.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/page.tsx | added | green | no issues (F1, F6 resolved in working tree) |
| src/app/(app)/(main)/reports-user/report-builder/_hooks/use-builder-session.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_lib/report-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/available-columns-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/category-pills.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/field-list.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/index.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/mode-banner.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/save-template-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/selected-column-row.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/selected-columns-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/stale-columns-modal.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/table-preview-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/use-column-selection.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/use-save-template.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/filters-sidebar.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/index.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/report-actions.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/report-results.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/template-card.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/use-report-filters.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/page.tsx | modified | green | no issues (F1, F6 resolved in working tree) |
| src/components/data-table/data-table.tsx | modified | green | no issues |
| src/components/data-table/global-filter.ts | modified | green | no issues |
| src/config/page-ids.config.ts | modified | green | no issues |
| src/features/hrms/designations/api.ts | modified | green | no issues |
| src/features/hrms/designations/hooks.ts | modified | green | no issues |
| src/features/hrms/designations/queries.ts | modified | green | no issues |
| src/features/hrms/designations/types.ts | modified | green | no issues |
| src/features/reports/reports-builder/aggregation-footer.tsx | added | green | no issues (F3, F4, F5 resolved in working tree) |
| src/features/reports/reports-builder/api.ts | modified | green | no issues |
| src/features/reports/reports-builder/hooks.ts | modified | green | no issues |
| src/features/reports/reports-builder/queries.ts | modified | green | no issues |
| src/features/reports/reports-builder/types.ts | modified | green | no issues |

### findings (6)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | Rights guard disabled on both report pages |
| location | src/app/(app)/(main)/reports-user/my-reports/page.tsx:12 |
| problem | PermissionGuard is commented out on My Reports and Report Builder, so both pages render for every signed-in user. The backend has no rights check on POST /query or GET /templates/:id either. |
| impact | A user without the page right can open the pages and read any report's data. Intentional for now, but committed as is. |
| fix | Restore the guard (uncomment the imports, PAGE_ID and the guard return) before release, and add the backend check. |
| evidence |   // return <PermissionGuard comp={<Component />} pageId={PAGE_ID} /><br>  return <Component /> |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:34:25+05:30 |
| resolvedNote | PermissionGuard is back on both pages at src/app/(app)/(main)/reports-user/my-reports/page.tsx:10 and src/app/(app)/(main)/reports-user/report-builder/page.tsx:18. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P2 |
| title | Report query has no branch limit |
| location | src/app/(app)/(main)/reports-user/my-reports/_components/use-report-filters.ts:70 |
| problem | branchIdArr is sent only when the user picks branches. With none picked the query runs across all branches. |
| impact | A branch-level user such as a cashier can see data for branches they have no access to. |
| fix | Send the user's own branch ids when none are picked, or scope it in POST /query on the backend. |
| evidence | branchIdArr: values.branchIdArr?.length ? values.branchIdArr : undefined, |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-02T09:24:09.737Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | true |
| confirmedNote | Confirmed by BRD |

#### findings[3] · F3

| Field | Value |
|---|---|
| id | F3 |
| severity | P2 |
| title | Print button shown but does nothing |
| location | src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx:68 |
| problem | ReportActions is given empty onPrint and onExport handlers, and printRef is attached but never used. The Print button appears when canPrint is true and a click does nothing. |
| impact | Users with the Print right see a dead button. No audit call is made for Export either. |
| fix | Wire onPrint to react-to-print with printRef and onExport to the export API, or hide the buttons until then. |
| evidence | onPrint={() => {}}<br>                onExport={() => {}} |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:02:36+05:30 |
| resolvedNote | Print and Export now go through ReportFileActions with getData, at src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx:85. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[4] · F4

| Field | Value |
|---|---|
| id | F4 |
| severity | P2 |
| title | Footer totals computed with floats |
| location | src/features/reports/reports-builder/aggregation-footer.tsx:17 |
| problem | Clicking a total re-aggregates cell values in the browser with Number and reduce. Money columns are summed and averaged as floats, against the project rule. |
| impact | The shown-rows total can differ by a rounding error from the API total on money columns. |
| fix | Have the API return per-filter totals as formatted strings, or label the value as indicative only. |
| evidence | return numbers.reduce((a, b) => a + b, 0) |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:02:36+05:30 |
| resolvedNote | Sums and averages now run on whole paise integers, at src/features/reports/reports-builder/aggregation-footer.tsx:19. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[5] · F5

| Field | Value |
|---|---|
| id | F5 |
| severity | P3 |
| title | Footer says current page, uses all filtered rows |
| location | src/features/reports/reports-builder/aggregation-footer.tsx:46 |
| problem | The tooltip says the value is for the current page, but the caller passes table.getFilteredRowModel().rows, which is every row that matches the search, not one page. Math.max(...numbers) also spreads the whole array. |
| impact | The label misleads users, and a very large report could throw a RangeError on Maximum or Minimum. |
| fix | Change the wording to match the rows used, or use getRowModel(); fold min and max with reduce instead of spread. |
| evidence | ? "From the current page. Click for the total"<br>      return Math.max(...numbers) |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:02:36+05:30 |
| resolvedNote | Footer uses table.getRowModel() (visible page) at src/app/(app)/(main)/reports-user/my-reports/_lib/report-columns.tsx:54, and min/max use reduce at aggregation-footer.tsx:26. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[6] · F6

| Field | Value |
|---|---|
| id | F6 |
| severity | P3 |
| title | Unreachable return after the rights guard |
| location | src/app/(app)/(main)/reports-user/my-reports/page.tsx:10 |
| problem | Page returns the PermissionGuard and then a second `return <Component />` on the next line, which can never run. Same in report-builder/page.tsx. |
| impact | Dead code that hides a mistake: it looks like the page opens without a guard. |
| fix | Delete the plain `return <Component />` line in both page.tsx files. |
| evidence | return <PermissionGuard comp={<Component />} pageId={PAGE_ID} /><br>  return <Component /> |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:39:01+05:30 |
| resolvedNote | The extra return is gone; only the guard return remains at src/app/(app)/(main)/reports-user/my-reports/page.tsx:10 and src/app/(app)/(main)/reports-user/report-builder/page.tsx:18. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (6)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F1 | Rights guard disabled on both report pages | resolved | PermissionGuard is back on both pages at src/app/(app)/(main)/reports-user/my-reports/page.tsx:10 and src/app/(app)/(main)/reports-user/report-builder/page.tsx:18. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F2 | Report query has no branch limit | needs-attention | null |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F3 | Print button shown but does nothing | resolved | Print and Export now go through ReportFileActions with getData, at src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx:85. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F4 | Footer totals computed with floats | resolved | Sums and averages now run on whole paise integers, at src/features/reports/reports-builder/aggregation-footer.tsx:19. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F5 | Footer says current page, uses all filtered rows | resolved | Footer uses table.getRowModel() (visible page) at src/app/(app)/(main)/reports-user/my-reports/_lib/report-columns.tsx:54, and min/max use reduce at aggregation-footer.tsx:26. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F6 | Unreachable return after the rights guard | resolved | The extra return is gone; only the guard return remains at src/app/(app)/(main)/reports-user/my-reports/page.tsx:10 and src/app/(app)/(main)/reports-user/report-builder/page.tsx:18. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <commit files + report-file.ts, report-file-actions.tsx, file-data.ts> | passed |
| grey | tests | not run: no test script configured |

### gaps (3)

- No browser run, so the guard, print iframe and xlsx download were reviewed from code only.
- Backend rights, branch scoping and the new page IDs cannot be checked from this repo.
- Fixes for F1 and F3 to F6 are uncommitted, so resolvedIn stays null.

### info (4)

- Only 90fe997e of the five earlier commits has a review, with no findings.
- Print and Export now call POST /reports/builder/query again, so each click loads the report a second time.
- Page IDs in page-ids.config.ts changed after the commit; confirm they match the DB.
- my-reports/_components/report-actions.tsx is no longer imported anywhere.

---

## howismycommit-14

| Field | Value |
|---|---|
| id | howismycommit-14 |
| generatedAt | 2026-11-02T15:34:36+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 |
| files.changed | 52 |
| files.added | 13 |
| files.modified | 39 |
| files.deleted | 0 |
| files.insertions | 1714 |
| files.deletions | 287 |
| verdict | review-with-caution |
| score | 81 |
| commitScore | 51 |
| quality | good |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 2 |
| summary.info | 3 |
| before | There was a Report Builder only: reports used one list for everyone, columns were keyed by name, and there was no report rights tab or footer totals. |
| after | A My Reports page runs reports with filters. Reports Rights lives in HRMS Designation. Since the commit, Print and Export use one route-driven ReportFileActions, the list drops reports without View, footer totals use the visible page in whole paise, and the rights guard is back on both pages with new page IDs. |

### changeType (3)

- feature
- ui
- api

### effects (4)

- HRMS designation page gets a Reports Rights tab backed by /hrms/designation/:id/reports.
- Shared DataTable gets opt-in footer props, so other tables are unchanged.
- Seven configuration and HRMS forms had their edit button logic restructured with the same behaviour.
- Report Builder and My Reports query paths and the query response shape (aggregations) change.

### filesReviewed (52)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/branches/_components/branch-details-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/co-lending/_components/lender-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/dealers/_components/dealer-detail-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/loan-products/_components/product-details-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/vendors/_components/vendor-detail-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/hrms/designations/[id]/_tabs/reports-rights.tab.tsx | added | green | no issues |
| src/app/(app)/(main)/hrms/designations/[id]/page.tsx | modified | green | no issues |
| src/app/(app)/(main)/hrms/designations/_components/designation-detail-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/hrms/employees/_components/employee-on-role.form.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/filters-sidebar.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/my-reports-view.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/report-actions.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx | added | green | no issues (F3, F4, F5 resolved in working tree) |
| src/app/(app)/(main)/reports-user/my-reports/_components/template-card.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/use-filter-options.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/use-report-filters.ts | added | amber | F2 |
| src/app/(app)/(main)/reports-user/my-reports/_lib/report-columns.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_schema.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/page.tsx | added | amber | F6 (F1 resolved in working tree) |
| src/app/(app)/(main)/reports-user/report-builder/_hooks/use-builder-session.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_lib/report-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/available-columns-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/category-pills.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/field-list.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/index.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/mode-banner.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/save-template-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/selected-column-row.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/selected-columns-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/stale-columns-modal.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/table-preview-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/use-column-selection.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/use-save-template.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/filters-sidebar.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/index.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/report-actions.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/report-results.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/template-card.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/use-report-filters.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/page.tsx | modified | amber | F6 (F1 resolved in working tree) |
| src/components/data-table/data-table.tsx | modified | green | no issues |
| src/components/data-table/global-filter.ts | modified | green | no issues |
| src/config/page-ids.config.ts | modified | green | no issues |
| src/features/hrms/designations/api.ts | modified | green | no issues |
| src/features/hrms/designations/hooks.ts | modified | green | no issues |
| src/features/hrms/designations/queries.ts | modified | green | no issues |
| src/features/hrms/designations/types.ts | modified | green | no issues |
| src/features/reports/reports-builder/aggregation-footer.tsx | added | green | no issues (F3, F4, F5 resolved in working tree) |
| src/features/reports/reports-builder/api.ts | modified | green | no issues |
| src/features/reports/reports-builder/hooks.ts | modified | green | no issues |
| src/features/reports/reports-builder/queries.ts | modified | green | no issues |
| src/features/reports/reports-builder/types.ts | modified | green | no issues |

### findings (6)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | Rights guard disabled on both report pages |
| location | src/app/(app)/(main)/reports-user/my-reports/page.tsx:12 |
| problem | PermissionGuard is commented out on My Reports and Report Builder, so both pages render for every signed-in user. The backend has no rights check on POST /query or GET /templates/:id either. |
| impact | A user without the page right can open the pages and read any report's data. Intentional for now, but committed as is. |
| fix | Restore the guard (uncomment the imports, PAGE_ID and the guard return) before release, and add the backend check. |
| evidence |   // return <PermissionGuard comp={<Component />} pageId={PAGE_ID} /><br>  return <Component /> |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:34:25+05:30 |
| resolvedNote | PermissionGuard is back on both pages at src/app/(app)/(main)/reports-user/my-reports/page.tsx:10 and src/app/(app)/(main)/reports-user/report-builder/page.tsx:18. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P2 |
| title | Report query has no branch limit |
| location | src/app/(app)/(main)/reports-user/my-reports/_components/use-report-filters.ts:70 |
| problem | branchIdArr is sent only when the user picks branches. With none picked the query runs across all branches. |
| impact | A branch-level user such as a cashier can see data for branches they have no access to. |
| fix | Send the user's own branch ids when none are picked, or scope it in POST /query on the backend. |
| evidence | branchIdArr: values.branchIdArr?.length ? values.branchIdArr : undefined, |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-02T09:24:09.737Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | true |
| confirmedNote | Confirmed by BRD |

#### findings[3] · F3

| Field | Value |
|---|---|
| id | F3 |
| severity | P2 |
| title | Print button shown but does nothing |
| location | src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx:68 |
| problem | ReportActions is given empty onPrint and onExport handlers, and printRef is attached but never used. The Print button appears when canPrint is true and a click does nothing. |
| impact | Users with the Print right see a dead button. No audit call is made for Export either. |
| fix | Wire onPrint to react-to-print with printRef and onExport to the export API, or hide the buttons until then. |
| evidence | onPrint={() => {}}<br>                onExport={() => {}} |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:02:36+05:30 |
| resolvedNote | Print and Export now go through ReportFileActions with getData, at src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx:85. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[4] · F4

| Field | Value |
|---|---|
| id | F4 |
| severity | P2 |
| title | Footer totals computed with floats |
| location | src/features/reports/reports-builder/aggregation-footer.tsx:17 |
| problem | Clicking a total re-aggregates cell values in the browser with Number and reduce. Money columns are summed and averaged as floats, against the project rule. |
| impact | The shown-rows total can differ by a rounding error from the API total on money columns. |
| fix | Have the API return per-filter totals as formatted strings, or label the value as indicative only. |
| evidence | return numbers.reduce((a, b) => a + b, 0) |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:02:36+05:30 |
| resolvedNote | Sums and averages now run on whole paise integers, at src/features/reports/reports-builder/aggregation-footer.tsx:19. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[5] · F5

| Field | Value |
|---|---|
| id | F5 |
| severity | P3 |
| title | Footer says current page, uses all filtered rows |
| location | src/features/reports/reports-builder/aggregation-footer.tsx:46 |
| problem | The tooltip says the value is for the current page, but the caller passes table.getFilteredRowModel().rows, which is every row that matches the search, not one page. Math.max(...numbers) also spreads the whole array. |
| impact | The label misleads users, and a very large report could throw a RangeError on Maximum or Minimum. |
| fix | Change the wording to match the rows used, or use getRowModel(); fold min and max with reduce instead of spread. |
| evidence | ? "From the current page. Click for the total"<br>      return Math.max(...numbers) |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:02:36+05:30 |
| resolvedNote | Footer uses table.getRowModel() (visible page) at src/app/(app)/(main)/reports-user/my-reports/_lib/report-columns.tsx:54, and min/max use reduce at aggregation-footer.tsx:26. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[6] · F6

| Field | Value |
|---|---|
| id | F6 |
| severity | P3 |
| title | Unreachable return after the rights guard |
| location | src/app/(app)/(main)/reports-user/my-reports/page.tsx:10 |
| problem | Page returns the PermissionGuard and then a second `return <Component />` on the next line, which can never run. Same in report-builder/page.tsx. |
| impact | Dead code that hides a mistake: it looks like the page opens without a guard. |
| fix | Delete the plain `return <Component />` line in both page.tsx files. |
| evidence | return <PermissionGuard comp={<Component />} pageId={PAGE_ID} /><br>  return <Component /> |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:39:01+05:30 |
| resolvedNote | The extra return is gone; only the guard return remains at src/app/(app)/(main)/reports-user/my-reports/page.tsx:10 and src/app/(app)/(main)/reports-user/report-builder/page.tsx:18. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (5)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F1 | Rights guard disabled on both report pages | resolved | PermissionGuard is back on both pages at src/app/(app)/(main)/reports-user/my-reports/page.tsx:10 and src/app/(app)/(main)/reports-user/report-builder/page.tsx:18. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F2 | Report query has no branch limit | needs-attention | null |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F3 | Print button shown but does nothing | resolved | Print and Export now go through ReportFileActions with getData, at src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx:85. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F4 | Footer totals computed with floats | resolved | Sums and averages now run on whole paise integers, at src/features/reports/reports-builder/aggregation-footer.tsx:19. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F5 | Footer says current page, uses all filtered rows | resolved | Footer uses table.getRowModel() (visible page) at src/app/(app)/(main)/reports-user/my-reports/_lib/report-columns.tsx:54, and min/max use reduce at aggregation-footer.tsx:26. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <commit files + report-file.ts, report-file-actions.tsx, file-data.ts> | passed |
| grey | tests | not run: no test script configured |

### gaps (3)

- No browser run, so the guard, print iframe and xlsx download were reviewed from code only.
- Backend rights, branch scoping and the new page IDs cannot be checked from this repo.
- Fixes for F1 and F3 to F5 are uncommitted, so resolvedIn stays null.

### info (4)

- Only 90fe997e of the five earlier commits has a review, with no findings.
- Print and Export now call POST /reports/builder/query again, so each click loads the report a second time.
- Page IDs in page-ids.config.ts changed after the commit; confirm they match the DB.
- my-reports/_components/report-actions.tsx is no longer imported anywhere.

---

## howismycommit-13

| Field | Value |
|---|---|
| id | howismycommit-13 |
| generatedAt | 2026-11-02T15:05:52+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 |
| files.changed | 52 |
| files.added | 13 |
| files.modified | 39 |
| files.deleted | 0 |
| files.insertions | 1714 |
| files.deletions | 287 |
| verdict | review-with-caution |
| score | 80 |
| commitScore | 56 |
| quality | good |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 2 |
| summary.info | 3 |
| before | There was a Report Builder only: reports used one list for everyone, columns were keyed by name, and there was no report rights tab or footer totals. |
| after | A My Reports page lists the reports a designation can view and runs them with filters. HRMS Designation has a Reports Rights tab, columns are keyed by field id with report types and aggregations, and tables can show footer totals. Since the commit, Print and Export in My Reports use a reusable ReportFileActions component, and footer totals recalculate from the visible page in whole paise. |

### changeType (3)

- feature
- ui
- api

### effects (4)

- HRMS designation page gets a Reports Rights tab backed by /hrms/designation/:id/reports.
- Shared DataTable gets opt-in footer props, so other tables are unchanged.
- Seven configuration and HRMS forms had their edit button logic restructured with the same behaviour.
- Report Builder and My Reports query paths and the query response shape (aggregations) change.

### filesReviewed (52)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/branches/_components/branch-details-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/co-lending/_components/lender-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/dealers/_components/dealer-detail-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/loan-products/_components/product-details-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/vendors/_components/vendor-detail-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/hrms/designations/[id]/_tabs/reports-rights.tab.tsx | added | green | no issues |
| src/app/(app)/(main)/hrms/designations/[id]/page.tsx | modified | green | no issues |
| src/app/(app)/(main)/hrms/designations/_components/designation-detail-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/hrms/employees/_components/employee-on-role.form.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/filters-sidebar.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/my-reports-view.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/report-actions.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx | added | green | no issues (F3, F4, F5 resolved in working tree) |
| src/app/(app)/(main)/reports-user/my-reports/_components/template-card.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/use-filter-options.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/use-report-filters.ts | added | amber | F2 |
| src/app/(app)/(main)/reports-user/my-reports/_lib/report-columns.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_schema.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/page.tsx | added | amber | F1 |
| src/app/(app)/(main)/reports-user/report-builder/_hooks/use-builder-session.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_lib/report-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/available-columns-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/category-pills.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/field-list.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/index.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/mode-banner.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/save-template-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/selected-column-row.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/selected-columns-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/stale-columns-modal.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/table-preview-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/use-column-selection.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/use-save-template.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/filters-sidebar.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/index.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/report-actions.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/report-results.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/template-card.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/use-report-filters.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/page.tsx | modified | amber | F1 |
| src/components/data-table/data-table.tsx | modified | green | no issues |
| src/components/data-table/global-filter.ts | modified | green | no issues |
| src/config/page-ids.config.ts | modified | green | no issues |
| src/features/hrms/designations/api.ts | modified | green | no issues |
| src/features/hrms/designations/hooks.ts | modified | green | no issues |
| src/features/hrms/designations/queries.ts | modified | green | no issues |
| src/features/hrms/designations/types.ts | modified | green | no issues |
| src/features/reports/reports-builder/aggregation-footer.tsx | added | green | no issues (F3, F4, F5 resolved in working tree) |
| src/features/reports/reports-builder/api.ts | modified | green | no issues |
| src/features/reports/reports-builder/hooks.ts | modified | green | no issues |
| src/features/reports/reports-builder/queries.ts | modified | green | no issues |
| src/features/reports/reports-builder/types.ts | modified | green | no issues |

### findings (5)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | Rights guard disabled on both report pages |
| location | src/app/(app)/(main)/reports-user/my-reports/page.tsx:12 |
| problem | PermissionGuard is commented out on My Reports and Report Builder, so both pages render for every signed-in user. The backend has no rights check on POST /query or GET /templates/:id either. |
| impact | A user without the page right can open the pages and read any report's data. Intentional for now, but committed as is. |
| fix | Restore the guard (uncomment the imports, PAGE_ID and the guard return) before release, and add the backend check. |
| evidence |   // return <PermissionGuard comp={<Component />} pageId={PAGE_ID} /><br>  return <Component /> |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:34:25+05:30 |
| resolvedNote | PermissionGuard is back on both pages at src/app/(app)/(main)/reports-user/my-reports/page.tsx:10 and src/app/(app)/(main)/reports-user/report-builder/page.tsx:18. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P2 |
| title | Report query has no branch limit |
| location | src/app/(app)/(main)/reports-user/my-reports/_components/use-report-filters.ts:70 |
| problem | branchIdArr is sent only when the user picks branches. With none picked the query runs across all branches. |
| impact | A branch-level user such as a cashier can see data for branches they have no access to. |
| fix | Send the user's own branch ids when none are picked, or scope it in POST /query on the backend. |
| evidence | branchIdArr: values.branchIdArr?.length ? values.branchIdArr : undefined, |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-02T09:24:09.737Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | true |
| confirmedNote | Confirmed by BRD |

#### findings[3] · F3

| Field | Value |
|---|---|
| id | F3 |
| severity | P2 |
| title | Print button shown but does nothing |
| location | src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx:68 |
| problem | ReportActions is given empty onPrint and onExport handlers, and printRef is attached but never used. The Print button appears when canPrint is true and a click does nothing. |
| impact | Users with the Print right see a dead button. No audit call is made for Export either. |
| fix | Wire onPrint to react-to-print with printRef and onExport to the export API, or hide the buttons until then. |
| evidence | onPrint={() => {}}<br>                onExport={() => {}} |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:02:36+05:30 |
| resolvedNote | Print and Export now go through ReportFileActions with getData, at src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx:85. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[4] · F4

| Field | Value |
|---|---|
| id | F4 |
| severity | P2 |
| title | Footer totals computed with floats |
| location | src/features/reports/reports-builder/aggregation-footer.tsx:17 |
| problem | Clicking a total re-aggregates cell values in the browser with Number and reduce. Money columns are summed and averaged as floats, against the project rule. |
| impact | The shown-rows total can differ by a rounding error from the API total on money columns. |
| fix | Have the API return per-filter totals as formatted strings, or label the value as indicative only. |
| evidence | return numbers.reduce((a, b) => a + b, 0) |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:02:36+05:30 |
| resolvedNote | Sums and averages now run on whole paise integers, at src/features/reports/reports-builder/aggregation-footer.tsx:19. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[5] · F5

| Field | Value |
|---|---|
| id | F5 |
| severity | P3 |
| title | Footer says current page, uses all filtered rows |
| location | src/features/reports/reports-builder/aggregation-footer.tsx:46 |
| problem | The tooltip says the value is for the current page, but the caller passes table.getFilteredRowModel().rows, which is every row that matches the search, not one page. Math.max(...numbers) also spreads the whole array. |
| impact | The label misleads users, and a very large report could throw a RangeError on Maximum or Minimum. |
| fix | Change the wording to match the rows used, or use getRowModel(); fold min and max with reduce instead of spread. |
| evidence | ? "From the current page. Click for the total"<br>      return Math.max(...numbers) |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:02:36+05:30 |
| resolvedNote | Footer uses table.getRowModel() (visible page) at src/app/(app)/(main)/reports-user/my-reports/_lib/report-columns.tsx:54, and min/max use reduce at aggregation-footer.tsx:26. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (5)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F1 | Rights guard disabled on both report pages | open | Guard still commented out; page returns <Component /> directly. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F2 | Report query has no branch limit | needs-attention | null |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F3 | Print button shown but does nothing | resolved | Print and Export now go through ReportFileActions with getData, at src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx:85. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F4 | Footer totals computed with floats | resolved | Sums and averages now run on whole paise integers, at src/features/reports/reports-builder/aggregation-footer.tsx:19. |
| 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 | F5 | Footer says current page, uses all filtered rows | resolved | Footer uses table.getRowModel() (visible page) at src/app/(app)/(main)/reports-user/my-reports/_lib/report-columns.tsx:54, and min/max use reduce at aggregation-footer.tsx:26. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <commit files + report-file.ts + report-file-actions.tsx> | passed |
| grey | tests | not run: no test script configured |

### gaps (3)

- No browser run: print from the hidden iframe and the xlsx download were reviewed from code only.
- Backend rights and branch scoping cannot be checked from this repo.
- Fixes for F3, F4 and F5 are uncommitted, so resolvedIn stays null.

### info (3)

- Commits before 65e6a5d: only 90fe997e has a review, with no findings.
- Export via ReportFileActions now writes all API records, not only rows matching the search box, unlike DataTableExportButton.
- my-reports/_components/report-actions.tsx is no longer imported anywhere.

---

## howismycommit-12

| Field | Value |
|---|---|
| id | howismycommit-12 |
| generatedAt | 2026-11-02T14:52:29+05:30 |
| author | Dhruv |
| branch | feat/report-builder |
| target.kind | commit |
| target.commit | 65e6a5d47d7550f5819c8f1ed4f6ab13cfe83544 |
| files.changed | 52 |
| files.added | 13 |
| files.modified | 39 |
| files.deleted | 0 |
| files.insertions | 1714 |
| files.deletions | 287 |
| verdict | review-with-caution |
| score | 56 |
| commitScore | 56 |
| quality | fair |
| summary.red | 0 |
| summary.amber | 5 |
| summary.green | 2 |
| summary.info | 2 |
| before | There was a Report Builder only: reports used one list for everyone, columns were keyed by name, and there was no report rights tab or footer totals. |
| after | A My Reports page lists the reports a designation can view and runs them with filters. HRMS Designation has a Reports Rights tab, columns are keyed by field id with report types and aggregations, and tables can show footer totals. |

### changeType (3)

- feature
- ui
- api

### effects (4)

- HRMS designation page gets a Reports Rights tab backed by /hrms/designation/:id/reports.
- Shared DataTable gets opt-in footer props, so other tables are unchanged.
- Seven configuration and HRMS forms had their edit button logic restructured with the same behaviour.
- Report Builder and My Reports query paths and the query response shape (aggregations) change.

### filesReviewed (52)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/configuration/branches/_components/branch-details-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/co-lending/_components/lender-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/dealers/_components/dealer-detail-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/loan-products/_components/product-details-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/vendors/_components/vendor-detail-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/hrms/designations/[id]/_tabs/reports-rights.tab.tsx | added | green | no issues |
| src/app/(app)/(main)/hrms/designations/[id]/page.tsx | modified | green | no issues |
| src/app/(app)/(main)/hrms/designations/_components/designation-detail-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/hrms/employees/_components/employee-on-role.form.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/filters-sidebar.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/my-reports-view.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/report-actions.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx | added | amber | F3 |
| src/app/(app)/(main)/reports-user/my-reports/_components/template-card.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/use-filter-options.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_components/use-report-filters.ts | added | amber | F2 |
| src/app/(app)/(main)/reports-user/my-reports/_lib/report-columns.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/_schema.ts | added | green | no issues |
| src/app/(app)/(main)/reports-user/my-reports/page.tsx | added | amber | F1 |
| src/app/(app)/(main)/reports-user/report-builder/_hooks/use-builder-session.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_lib/report-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/available-columns-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/category-pills.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/field-list.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/index.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/mode-banner.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/save-template-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/selected-column-row.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/selected-columns-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/stale-columns-modal.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/table-preview-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/use-column-selection.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/build-report/use-save-template.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/filters-sidebar.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/index.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/report-actions.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/report-results.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/template-card.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/_views/my-reports/use-report-filters.ts | modified | green | no issues |
| src/app/(app)/(main)/reports-user/report-builder/page.tsx | modified | amber | F1 |
| src/components/data-table/data-table.tsx | modified | green | no issues |
| src/components/data-table/global-filter.ts | modified | green | no issues |
| src/config/page-ids.config.ts | modified | green | no issues |
| src/features/hrms/designations/api.ts | modified | green | no issues |
| src/features/hrms/designations/hooks.ts | modified | green | no issues |
| src/features/hrms/designations/queries.ts | modified | green | no issues |
| src/features/hrms/designations/types.ts | modified | green | no issues |
| src/features/reports/reports-builder/aggregation-footer.tsx | added | amber | F4 |
| src/features/reports/reports-builder/api.ts | modified | green | no issues |
| src/features/reports/reports-builder/hooks.ts | modified | green | no issues |
| src/features/reports/reports-builder/queries.ts | modified | green | no issues |
| src/features/reports/reports-builder/types.ts | modified | green | no issues |

### findings (5)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | Rights guard disabled on both report pages |
| location | src/app/(app)/(main)/reports-user/my-reports/page.tsx:12 |
| problem | PermissionGuard is commented out on My Reports and Report Builder, so both pages render for every signed-in user. The backend has no rights check on POST /query or GET /templates/:id either. |
| impact | A user without the page right can open the pages and read any report's data. Intentional for now, but committed as is. |
| fix | Restore the guard (uncomment the imports, PAGE_ID and the guard return) before release, and add the backend check. |
| evidence |   // return <PermissionGuard comp={<Component />} pageId={PAGE_ID} /><br>  return <Component /> |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:34:25+05:30 |
| resolvedNote | PermissionGuard is back on both pages at src/app/(app)/(main)/reports-user/my-reports/page.tsx:10 and src/app/(app)/(main)/reports-user/report-builder/page.tsx:18. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P2 |
| title | Report query has no branch limit |
| location | src/app/(app)/(main)/reports-user/my-reports/_components/use-report-filters.ts:70 |
| problem | branchIdArr is sent only when the user picks branches. With none picked the query runs across all branches. |
| impact | A branch-level user such as a cashier can see data for branches they have no access to. |
| fix | Send the user's own branch ids when none are picked, or scope it in POST /query on the backend. |
| evidence | branchIdArr: values.branchIdArr?.length ? values.branchIdArr : undefined, |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-11-02T09:24:09.737Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| confirmed | true |
| confirmedNote | Confirmed by BRD |

#### findings[3] · F3

| Field | Value |
|---|---|
| id | F3 |
| severity | P2 |
| title | Print button shown but does nothing |
| location | src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx:68 |
| problem | ReportActions is given empty onPrint and onExport handlers, and printRef is attached but never used. The Print button appears when canPrint is true and a click does nothing. |
| impact | Users with the Print right see a dead button. No audit call is made for Export either. |
| fix | Wire onPrint to react-to-print with printRef and onExport to the export API, or hide the buttons until then. |
| evidence | onPrint={() => {}}<br>                onExport={() => {}} |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:02:36+05:30 |
| resolvedNote | Print and Export now go through ReportFileActions with getData, at src/app/(app)/(main)/reports-user/my-reports/_components/report-results.tsx:85. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[4] · F4

| Field | Value |
|---|---|
| id | F4 |
| severity | P2 |
| title | Footer totals computed with floats |
| location | src/features/reports/reports-builder/aggregation-footer.tsx:17 |
| problem | Clicking a total re-aggregates cell values in the browser with Number and reduce. Money columns are summed and averaged as floats, against the project rule. |
| impact | The shown-rows total can differ by a rounding error from the API total on money columns. |
| fix | Have the API return per-filter totals as formatted strings, or label the value as indicative only. |
| evidence | return numbers.reduce((a, b) => a + b, 0) |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:02:36+05:30 |
| resolvedNote | Sums and averages now run on whole paise integers, at src/features/reports/reports-builder/aggregation-footer.tsx:19. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[5] · F5

| Field | Value |
|---|---|
| id | F5 |
| severity | P3 |
| title | Footer says current page, uses all filtered rows |
| location | src/features/reports/reports-builder/aggregation-footer.tsx:46 |
| problem | The tooltip says the value is for the current page, but the caller passes table.getFilteredRowModel().rows, which is every row that matches the search, not one page. Math.max(...numbers) also spreads the whole array. |
| impact | The label misleads users, and a very large report could throw a RangeError on Maximum or Minimum. |
| fix | Change the wording to match the rows used, or use getRowModel(); fold min and max with reduce instead of spread. |
| evidence | ? "From the current page. Click for the total"<br>      return Math.max(...numbers) |
| status | resolved |
| resolvedIn | 602a3f71fe45139e1b03309724bf6497edcb6749 |
| resolvedAt | 2026-11-02T15:02:36+05:30 |
| resolvedNote | Footer uses table.getRowModel() (visible page) at src/app/(app)/(main)/reports-user/my-reports/_lib/report-columns.tsx:54, and min/max use reduce at aggregation-footer.tsx:26. |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (0)

_Empty._

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <files changed by the commit> | passed |
| grey | tests | not run: no test script configured |

### gaps (3)

- No browser run, so footer totals, Print and Export, and the rights tab were reviewed from code only.
- Backend rights and branch scoping could not be checked from this repo.
- The working tree has only a formatting change in aggregation-footer.tsx since the commit.

### info (2)

- Of the last 5 commits only 90fe997e has a review, with no findings, so no earlier findings were checked.
- The seven form diffs are the same edit-button restructure and look behaviour-neutral.

---

## howismycommit-11

| Field | Value |
|---|---|
| id | howismycommit-11 |
| generatedAt | 2026-10-30T14:55:39+05:30 |
| author | Dhruv |
| branch | dhruv |
| target.kind | commit |
| target.commit | 90fe997e7aef6474baf92a6845b75930195d977e |
| files.changed | 3 |
| files.added | 0 |
| files.modified | 3 |
| files.deleted | 0 |
| files.insertions | 16 |
| files.deletions | 11 |
| verdict | looks-good |
| score | 100 |
| commitScore | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 1 |
| before | The commercial panel rendered pagination with no padding, and the TUDF and XLSX download buttons changed to the primary colour on hover. |
| after | The commercial panel wraps pagination in a p-4 div, and both download buttons keep their blue or green colour on hover and when disabled. The XLSX preview shows the first 40 rows instead of 20. |

### changeType (2)

- ui
- bug fix

### effects (3)

- Commercial bureau segment pagination spacing now matches the consumer panel.
- TUDF and XLSX preview modals show the same button colour on hover.
- XLSX preview renders up to 40 rows, so slightly more DOM per open.

### filesReviewed (3)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-commercial-report-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-tudf-preview-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx | modified | green | no issues |

### findings (0)

_Empty._

### previousFindings (6)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 9e9c05273eec9ade4f153846e01bf3b232fc1de6 | F1 | Commercial panel pagination loses its padding | resolved | Pagination is wrapped in a p-4 div at src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-commercial-report-panel.tsx:127, now committed. |
| 9e9c05273eec9ade4f153846e01bf3b232fc1de6 | F2 | Blue and green download buttons flip to primary on hover | resolved | Hover classes present at src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx:133 and ucrf-tudf-preview-modal.tsx:64, now committed. |
| d639ba202a6b352fce6962c8fc139918c4932e18 | F1 | Invalid Tailwind class `px-4)` drops navbar padding | resolved | Class is px-4 at src/app/(app)/(main)/_components/navbar/navbar.tsx:78. |
| d639ba202a6b352fce6962c8fc139918c4932e18 | F2 | Toasts lose status colours and hardcode black and white | resolved | richColors is set at src/app/(app)/layout.tsx:25 and sonner.tsx uses theme tokens. |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F1 | XLSX preview renders every row at once | resolved | Rows are sliced to PREVIEW_ROW_LIMIT at src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx:43. |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F2 | xlsx library is imported statically in the report panel | resolved | xlsx is imported dynamically at src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx:44. |

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| grey | tests | not run: no test script configured |

### gaps (2)

- No UI was run in a browser; layout and hover behaviour come from reading the code.
- No test command is configured, so behaviour changes are untested.

### info (1)

- PREVIEW_ROW_LIMIT went from 20 to 40 in this commit; the commit message does not mention it.

---

## howismycommit-10

| Field | Value |
|---|---|
| id | howismycommit-10 |
| generatedAt | 2026-10-30T14:27:05+05:30 |
| author | Dhruv |
| branch | dhruv |
| target.kind | commit |
| target.commit | 9e9c05273eec9ade4f153846e01bf3b232fc1de6 |
| files.changed | 15 |
| files.added | 0 |
| files.modified | 11 |
| files.deleted | 4 |
| files.insertions | 63 |
| files.deletions | 1112 |
| verdict | looks-good |
| score | 100 |
| commitScore | 92 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 2 |
| before | UCRF report panels and preview modals used theme-primary buttons, a static xlsx import, full-row previews and padded pagination. The navbar had a broken px-4 class, toasts hardcoded black and white, and the colour theme safelist was missing. |
| after | The xlsx library loads on demand and the preview shows the first rows only (now 40 in the working tree). Preview download buttons are blue and green with matching hover colours, both bureau panels keep padded pagination, toasts use theme tokens and rich colours, and the seven color-* classes are safelisted. The vendor form hides its buttons without edit permission. |

### changeType (3)

- ui
- refactor
- config

### effects (4)

- Both bureau panels (consumer and commercial) render UcrfGridPagination.
- Every toast in the app changes look (richColors, no border).
- Vendor detail form no longer shows Cancel/Save to users without canEdit.
- Three tracked docs files and the test page route are deleted.

### filesReviewed (15)

| path | change | status | note |
|---|---|---|---|
| .gitignore | modified | green | no issues |
| src/app/(app)/(main)/_components/navbar/navbar.tsx | modified | green | no issues |
| src/app/(app)/(main)/_components/navbar/user-settings-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/vendors/_components/vendor-detail-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-grid-pagination.tsx | modified | green | no issues (F1/F2 resolved) |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-tudf-preview-modal.tsx | modified | green | no issues (F1/F2 resolved) |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx | modified | green | no issues (F1/F2 resolved) |
| src/app/(app)/layout.tsx | modified | green | no issues |
| src/components/ui/sonner.tsx | modified | green | no issues |
| tailwind.config.ts | modified | green | no issues |
| docs/ucrf-report-audit.md | deleted | green | no issues |
| docs/ucrf-report.md | deleted | green | no issues |
| docs/ucrf-submission-responsiveness.md | deleted | green | no issues |
| src/app/(app)/test/page.tsx | deleted | green | no issues |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Commercial panel pagination loses its padding |
| location | src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-grid-pagination.tsx:36 |
| problem | px-4 py-3 was removed from the pagination row for the consumer panel's new p-4 footer, but the commercial panel renders UcrfGridPagination directly inside an unpadded root div. |
| impact | On the Commercial segment the pager and Items per page selector touch the panel edges. |
| fix | Wrap the pagination in the commercial panel with a padded div, or restore the padding in UcrfGridPagination. |
| evidence | <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end"> |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T12:00:00+05:30 |
| resolvedNote | Fixed in the working tree: pagination is wrapped in a p-4 div at src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-commercial-report-panel.tsx:127 (not committed yet). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Blue and green download buttons flip to primary on hover |
| location | src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx:133 |
| problem | bg-blue-600 and bg-green-600 replace bg-primary through the class merge, but the default Button variant still carries hover:bg-primary/90, so hover shows the theme colour. |
| impact | The TUDF and XLSX download buttons change colour on hover. |
| fix | Add hover and disabled:hover variants of the same colour. |
| evidence | className="w-full bg-green-600 sm:w-auto" |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T12:00:00+05:30 |
| resolvedNote | Fixed in the working tree: hover:bg-green-600/90 at src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx:133 and hover:bg-blue-600/90 at ucrf-tudf-preview-modal.tsx:64 (not committed yet). |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |

### previousFindings (6)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 9e9c05273eec9ade4f153846e01bf3b232fc1de6 | F1 | Commercial panel pagination loses its padding | resolved | Pagination is wrapped in a p-4 div at src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-commercial-report-panel.tsx:127. |
| 9e9c05273eec9ade4f153846e01bf3b232fc1de6 | F2 | Blue and green download buttons flip to primary on hover | resolved | Hover classes present at src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx:133. |
| d639ba202a6b352fce6962c8fc139918c4932e18 | F1 | Invalid Tailwind class `px-4)` drops navbar padding | resolved | Class is px-4 at src/app/(app)/(main)/_components/navbar/navbar.tsx:78. |
| d639ba202a6b352fce6962c8fc139918c4932e18 | F2 | Toasts lose status colours and hardcode black and white | resolved | richColors is set at src/app/(app)/layout.tsx:25 and sonner.tsx uses theme tokens. |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F1 | XLSX preview renders every row at once | resolved | Rows are sliced to PREVIEW_ROW_LIMIT at src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx:43. |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F2 | xlsx library is imported statically in the report panel | resolved | xlsx is imported dynamically at src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx:44. |

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| grey | tests | not run: no test script configured |

### gaps (3)

- The fixes for F1 and F2 are uncommitted, so the commit itself still contains both defects.
- No UI was run in a browser; layout conclusions come from reading the code.
- No test command is configured, so behaviour changes are untested.

### info (2)

- The working tree raises PREVIEW_ROW_LIMIT from 20 to 40 since the commit; no defect found in that change.
- Hardcoded blue-600 and green-600 and the ignored docs/ folder bypass theme tokens and shared docs; confirm both are intended.

---

## howismycommit-9

| Field | Value |
|---|---|
| id | howismycommit-9 |
| generatedAt | 2026-10-30T10:49:47+05:30 |
| author | Dhruv |
| branch | dhruv |
| target.kind | commit |
| target.commit | 9e9c05273eec9ade4f153846e01bf3b232fc1de6 |
| files.changed | 15 |
| files.added | 0 |
| files.modified | 11 |
| files.deleted | 4 |
| files.insertions | 63 |
| files.deletions | 1112 |
| verdict | looks-good |
| score | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 2 |
| before | UCRF report panels and preview modals used theme-primary buttons, a static xlsx import, full-row previews and padded pagination. The navbar had a broken px-4 class, toasts hardcoded black and white, and the colour theme safelist was missing. |
| after | The xlsx library loads on demand and the preview shows 20 rows. Preview download buttons are blue and green, the pagination padding moved into the consumer footer, toasts use theme tokens and rich colours, and the seven color-* classes are safelisted. The vendor form hides its buttons without edit permission, and docs, the penguin folder and CLAUDE.md are gitignored. |

### changeType (3)

- ui
- refactor
- config

### effects (4)

- Both bureau panels (consumer and commercial) render UcrfGridPagination.
- Every toast in the app changes look (richColors, no border).
- Vendor detail form no longer shows Cancel/Save to users without canEdit.
- Three tracked docs files and the test page route are deleted.

### filesReviewed (15)

| path | change | status | note |
|---|---|---|---|
| .gitignore | modified | green | no issues |
| src/app/(app)/(main)/_components/navbar/navbar.tsx | modified | green | no issues |
| src/app/(app)/(main)/_components/navbar/user-settings-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/vendors/_components/vendor-detail-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-grid-pagination.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-tudf-preview-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx | modified | green | no issues |
| src/app/(app)/layout.tsx | modified | green | no issues |
| src/components/ui/sonner.tsx | modified | green | no issues |
| tailwind.config.ts | modified | green | no issues |
| docs/ucrf-report-audit.md | deleted | green | no issues |
| docs/ucrf-report.md | deleted | green | no issues |
| docs/ucrf-submission-responsiveness.md | deleted | green | no issues |
| src/app/(app)/test/page.tsx | deleted | green | no issues |

### findings (0)

_Empty._

### previousFindings (6)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| 9e9c05273eec9ade4f153846e01bf3b232fc1de6 | F1 | Commercial panel pagination loses its padding | resolved | Pagination is wrapped in a p-4 div at src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-commercial-report-panel.tsx:127 (uncommitted). |
| 9e9c05273eec9ade4f153846e01bf3b232fc1de6 | F2 | Blue and green download buttons flip to primary on hover | resolved | Buttons carry hover:bg-green-600/90 at src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx:133 and the blue equivalent at ucrf-tudf-preview-modal.tsx:64 (uncommitted). |
| d639ba202a6b352fce6962c8fc139918c4932e18 | F1 | Invalid Tailwind class `px-4)` drops navbar padding | resolved | Class is px-4 at src/app/(app)/(main)/_components/navbar/navbar.tsx:78. |
| d639ba202a6b352fce6962c8fc139918c4932e18 | F2 | Toasts lose status colours and hardcode black and white | resolved | richColors is set at src/app/(app)/layout.tsx:25 and sonner.tsx uses theme tokens. |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F1 | XLSX preview renders every row at once | resolved | Rows are sliced to PREVIEW_ROW_LIMIT at src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx:43. |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F2 | xlsx library is imported statically in the report panel | resolved | xlsx is imported dynamically at src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx:44. |

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| grey | tests | not run: no test script configured |

### gaps (3)

- The fixes for the two earlier findings of this commit are uncommitted, so the commit itself still has them.
- No UI was run in a browser; layout conclusions come from reading the code.
- No test command is configured, so behaviour changes are untested.

### info (2)

- vendor-detail-form now returns null instead of Cancel/Save when canEdit is false, which looks like an intended fix but changes behaviour.
- Hardcoded blue-600 and green-600 and the ignored docs/ folder bypass theme tokens and shared docs; confirm both are intended.

---

## howismycommit-8

| Field | Value |
|---|---|
| id | howismycommit-8 |
| generatedAt | 2026-10-30T10:14:28+05:30 |
| author | Dhruv |
| branch | dhruv |
| target.kind | commit |
| target.commit | 9e9c05273eec9ade4f153846e01bf3b232fc1de6 |
| files.changed | 15 |
| files.added | 0 |
| files.modified | 11 |
| files.deleted | 4 |
| files.insertions | 63 |
| files.deletions | 1112 |
| verdict | review-with-caution |
| score | 92 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 2 |
| summary.info | 2 |
| before | UCRF report panels and preview modals used theme-primary buttons, a static xlsx import, full-row previews and padded pagination. The navbar had a broken px-4 class, toasts hardcoded black and white, and the colour theme safelist was missing. |
| after | The xlsx library loads on demand and the preview shows 20 rows. Preview download buttons are blue and green, the pagination padding moved into the consumer footer, toasts use theme tokens and rich colours, and the seven color-* classes are safelisted. The vendor form hides its buttons without edit permission, and docs, the penguin folder and CLAUDE.md are gitignored. |

### changeType (3)

- ui
- refactor
- config

### effects (4)

- Both bureau panels (consumer and commercial) render UcrfGridPagination.
- Every toast in the app changes look (richColors, no border).
- Vendor detail form no longer shows Cancel/Save to users without canEdit.
- Three tracked docs files and the test page route are deleted.

### filesReviewed (15)

| path | change | status | note |
|---|---|---|---|
| .gitignore | modified | green | no issues |
| docs/ucrf-report-audit.md | deleted | green | no issues |
| docs/ucrf-report.md | deleted | green | no issues |
| docs/ucrf-submission-responsiveness.md | deleted | green | no issues |
| src/app/(app)/(main)/_components/navbar/navbar.tsx | modified | green | no issues |
| src/app/(app)/(main)/_components/navbar/user-settings-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/configuration/vendors/_components/vendor-detail-form.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-grid-pagination.tsx | modified | amber | F1 |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-tudf-preview-modal.tsx | modified | amber | F2 |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx | modified | amber | F2 |
| src/app/(app)/layout.tsx | modified | green | no issues |
| src/app/(app)/test/page.tsx | deleted | green | no issues |
| src/components/ui/sonner.tsx | modified | green | no issues |
| tailwind.config.ts | modified | green | no issues |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Commercial panel pagination loses its padding |
| location | src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-grid-pagination.tsx:36 |
| problem | px-4 py-3 was removed from the pagination row so the consumer panel's new p-4 footer could wrap it. The commercial panel renders UcrfGridPagination directly inside an unpadded root div, so it now has no padding. |
| impact | On the Commercial segment the pager and Items per page selector touch the panel edges. |
| fix | Wrap the pagination in the commercial panel with a padded div, or restore the padding in UcrfGridPagination. |
| evidence | <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end"> |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:02:49.365Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Blue and green download buttons flip to primary on hover |
| location | src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx:133 |
| problem | bg-blue-600 and bg-green-600 replace bg-primary through the class merge, but the default Button variant still carries hover:bg-primary/90. On hover the button changes to the theme colour. |
| impact | The TUDF and XLSX download buttons flicker from blue or green to the primary colour when hovered. |
| fix | Add hover:bg-blue-600/90 and hover:bg-green-600/90 (also disabled:hover variants), or use a variant instead of a hardcoded colour. |
| evidence | className="w-full bg-green-600 sm:w-auto" |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-30T05:02:58.874Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |

### previousFindings (4)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| d639ba202a6b352fce6962c8fc139918c4932e18 | F1 | Invalid Tailwind class `px-4)` drops navbar padding | resolved | Class is now px-4 in src/app/(app)/(main)/_components/navbar/navbar.tsx:78. |
| d639ba202a6b352fce6962c8fc139918c4932e18 | F2 | Toasts lose status colours and hardcode black and white | resolved | richColors is set in src/app/(app)/layout.tsx:25 and sonner.tsx uses theme tokens. |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F1 | XLSX preview renders every row at once | resolved | Rows are sliced to PREVIEW_ROW_LIMIT in ucrf-xlsx-preview-modal.tsx:43. |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F2 | xlsx library is imported statically in the report panel | resolved | xlsx is imported dynamically at ucrf-consumer-report-panel.tsx:44. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed |
| green | npx eslint <7 changed .ts/.tsx files> | passed |
| grey | tests | not run: no test script configured |

### gaps (2)

- No UI was run in a browser; the layout findings come from reading the code.
- No test command is configured, so behaviour changes are untested.

### info (2)

- vendor-detail-form now returns null instead of Cancel/Save when canEdit is false, which looks like an intended fix but changes behaviour.
- Hardcoded blue-600 and green-600 and the ignored docs/ folder bypass theme tokens and shared docs; confirm both are intended.

---

## howismycommit-7

| Field | Value |
|---|---|
| id | howismycommit-7 |
| generatedAt | 2026-10-27T12:35:09+05:30 |
| branch | dhruv |
| target.kind | commit |
| target.commit | d639ba202a6b352fce6962c8fc139918c4932e18 |
| files.changed | 20 |
| files.added | 0 |
| files.modified | 19 |
| files.deleted | 1 |
| files.insertions | 301 |
| files.deletions | 436 |
| verdict | review-with-caution |
| score | 92 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 2 |
| summary.info | 2 |
| before | UCRF report pages, sidebar, navbar, settings panel and login were laid out for desktop widths. Toasts used the theme colours with colour-coded success and error styles. |
| after | UCRF report panels, filters, pagination and preview modals reflow on small screens. The sidebar and navbar have a new look, the login button stays disabled until both fields are filled, and toasts are plain white or black without status colours. |

### changeType (3)

- UI
- refactor
- docs

### effects (4)

- Every screen that shows a toast (forms using useFormFlow, mutations) loses the red and green status colouring from richColors.
- The right-hand navbar panel in horizontal layout loses its horizontal padding.
- Tooltips from FormField now use the primary colour, which affects every form with contextual help.
- docs/git-changes-review.md is deleted.

### filesReviewed (20)

| path | change | status | note |
|---|---|---|---|
| .gitignore | modified | green | no issues |
| docs/git-changes-review.md | deleted | green | no issues |
| src/app/(app)/(auth)/login/page.tsx | modified | green | no issues |
| src/app/(app)/(main)/_components/navbar/navbar.tsx | modified | amber | F1 |
| src/app/(app)/(main)/_components/navbar/user-settings-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/_components/sidebar/index.tsx | modified | green | no issues |
| src/app/(app)/(main)/page.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-bureau-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-commercial-report-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-field-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-filters.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-grid-pagination.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-skipped-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-tudf-preview-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/page.tsx | modified | green | no issues |
| src/app/(app)/layout.tsx | modified | amber | F2 |
| src/components/form/form-field.tsx | modified | green | no issues |
| src/components/ui/sonner.tsx | modified | amber | F2 |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Invalid Tailwind class `px-4)` drops navbar padding |
| location | src/app/(app)/(main)/_components/navbar/navbar.tsx:78 |
| problem | The class string contains `px-4)` with a stray parenthesis, so Tailwind does not generate it. The old `px-4` class was removed in the same edit. |
| impact | The right-hand navbar panel (loan chat listener and user area) renders without horizontal padding, so its content touches the edges. |
| fix | Change `px-4)` to `px-4` in the class string. |
| evidence | "px-4) relative z-[1] flex h-full w-56 flex-col items-center justify-center gap-1 rounded-bl-3xl bg-card", |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-29T09:41:36.882Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Toasts lose status colours and hardcode black and white |
| location | src/components/ui/sonner.tsx:27 |
| problem | The toast classes use bg-white, text-black and bg-black, and richColors was removed from the Toaster in src/app/(app)/layout.tsx:25. AGENTS.md requires design system tokens, not fixed colours. |
| impact | Success and error toasts from useFormFlow and mutations no longer show green or red, so failures are harder to notice. Toasts also ignore theme changes. |
| fix | Restore richColors on the Toaster and use tokens such as bg-background and text-foreground in sonner.tsx instead of white and black. |
| evidence | group-[.toaster]:bg-white group-[.toaster]:text-black dark:group-[.toaster]:bg-black |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-28T12:14:20.942Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |

### previousFindings (4)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| d639ba202a6b352fce6962c8fc139918c4932e18 | F1 | Invalid Tailwind class `px-4)` drops navbar padding | resolved | Verified: the class is `px-4 relative ...` at navbar.tsx:78 with no stray parenthesis. |
| d639ba202a6b352fce6962c8fc139918c4932e18 | F2 | Toasts lose status colours and hardcode black and white | resolved | Verified: sonner.tsx:27 now uses design tokens (bg-background, text-foreground) and richColors is on the Toaster at layout.tsx:25. The earlier needs-attention flag is cleared. |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F1 | XLSX preview renders every row at once | resolved | Verified: the preview shows only the first 10 rows (ucrf-xlsx-preview-modal.tsx:28). |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F2 | xlsx library is imported statically in the report panel | resolved | Verified: xlsx is loaded with a dynamic import at ucrf-consumer-report-panel.tsx:44. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed (run on the working tree, which is later than the commit reviewed) |
| green | npx eslint <changed ts and tsx files> | passed |
| grey | tests | not run: no test script is configured in package.json |

### gaps (4)

- The layout changes were not checked on real phone or tablet widths.
- No test script exists, so no behavior is covered by tests.
- tsc and eslint ran on the current working tree, which includes changes made after this commit.
- Of the 5 commits before this one, only `e1ded77` and `c9bb363` have reviews; the rest were skipped.

### info (3)

- navbar.tsx leaves a commented-out div (`For weird style`) in place of deleting it.
- The login button shows both a loading spinner and the text `Loading...` while submitting.
- The scored findings are as they were when the commit was reviewed. Both are now fixed in the working tree (uncommitted) and verified, so none are open.

---

## howismycommit-6

| Field | Value |
|---|---|
| id | howismycommit-6 |
| generatedAt | 2026-10-27T12:14:16+05:30 |
| branch | dhruv |
| target.kind | commit |
| target.commit | d639ba202a6b352fce6962c8fc139918c4932e18 |
| files.changed | 20 |
| files.added | 0 |
| files.modified | 19 |
| files.deleted | 1 |
| files.insertions | 301 |
| files.deletions | 436 |
| verdict | review-with-caution |
| score | 92 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 2 |
| summary.info | 2 |
| before | UCRF report pages, sidebar, navbar, settings panel and login were laid out for desktop widths. Toasts used the theme colours with colour-coded success and error styles. |
| after | UCRF report panels, filters, pagination and preview modals reflow on small screens. The sidebar and navbar have a new look, the login button stays disabled until both fields are filled, and toasts are plain white or black without status colours. |

### changeType (3)

- UI
- refactor
- docs

### effects (4)

- Every screen that shows a toast (forms using useFormFlow, mutations) loses the red and green status colouring from richColors.
- The right-hand navbar panel in horizontal layout loses its horizontal padding.
- Tooltips from FormField now use the primary colour, which affects every form with contextual help.
- docs/git-changes-review.md is deleted.

### filesReviewed (20)

| path | change | status | note |
|---|---|---|---|
| .gitignore | modified | green | no issues |
| docs/git-changes-review.md | deleted | green | no issues |
| src/app/(app)/(auth)/login/page.tsx | modified | green | no issues |
| src/app/(app)/(main)/_components/navbar/navbar.tsx | modified | amber | F1 |
| src/app/(app)/(main)/_components/navbar/user-settings-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/_components/sidebar/index.tsx | modified | green | no issues |
| src/app/(app)/(main)/page.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-bureau-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-commercial-report-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-field-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-filters.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-grid-pagination.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-skipped-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-tudf-preview-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/page.tsx | modified | green | no issues |
| src/app/(app)/layout.tsx | modified | amber | F2 |
| src/components/form/form-field.tsx | modified | green | no issues |
| src/components/ui/sonner.tsx | modified | amber | F2 |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Invalid Tailwind class `px-4)` drops navbar padding |
| location | src/app/(app)/(main)/_components/navbar/navbar.tsx:78 |
| problem | The class string contains `px-4)` with a stray parenthesis, so Tailwind does not generate it. The old `px-4` class was removed in the same edit. |
| impact | The right-hand navbar panel (loan chat listener and user area) renders without horizontal padding, so its content touches the edges. |
| fix | Change `px-4)` to `px-4` in the class string. |
| evidence | "px-4) relative z-[1] flex h-full w-56 flex-col items-center justify-center gap-1 rounded-bl-3xl bg-card", |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-27T05:40:39.211Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Toasts lose status colours and hardcode black and white |
| location | src/components/ui/sonner.tsx:27 |
| problem | The toast classes use bg-white, text-black and bg-black, and richColors was removed from the Toaster in src/app/(app)/layout.tsx:25. AGENTS.md requires design system tokens, not fixed colours. |
| impact | Success and error toasts from useFormFlow and mutations no longer show green or red, so failures are harder to notice. Toasts also ignore theme changes. |
| fix | Restore richColors on the Toaster and use tokens such as bg-background and text-foreground in sonner.tsx instead of white and black. |
| evidence | group-[.toaster]:bg-white group-[.toaster]:text-black dark:group-[.toaster]:bg-black |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-27T05:40:40.113Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |

### previousFindings (4)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| d639ba202a6b352fce6962c8fc139918c4932e18 | F1 | Invalid Tailwind class `px-4)` drops navbar padding | resolved | Verified: the class is now `px-4 relative ...` at navbar.tsx:78 with no stray parenthesis. |
| d639ba202a6b352fce6962c8fc139918c4932e18 | F2 | Toasts lose status colours and hardcode black and white | resolved | Verified: sonner.tsx:27 now uses design tokens and richColors is on the Toaster at layout.tsx:25. |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F1 | XLSX preview renders every row at once | resolved | Verified: the preview shows only the first 10 rows (ucrf-xlsx-preview-modal.tsx:28 and :43). |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F2 | xlsx library is imported statically in the report panel | resolved | Verified: xlsx is loaded with a dynamic import at ucrf-consumer-report-panel.tsx:44. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed (run on the working tree, which is later than the commit reviewed) |
| green | npx eslint <changed ts and tsx files> | passed |
| grey | tests | not run: no test script is configured in package.json |

### gaps (4)

- The layout changes were not checked on real phone or tablet widths.
- No test script exists, so no behavior is covered by tests.
- tsc and eslint ran on the current working tree, which includes changes made after this commit.
- Of the 5 commits before this one, only `e1ded77` and `c9bb363` have reviews; the rest were skipped.

### info (3)

- navbar.tsx leaves a commented-out div (`For weird style`) in place of deleting it.
- The login button shows both a loading spinner and the text `Loading...` while submitting.
- The scored findings are as they were when the commit was reviewed. F1 is now fixed in the working tree. F2 is marked resolved but still needs attention.

---

## howismycommit-5

| Field | Value |
|---|---|
| id | howismycommit-5 |
| generatedAt | 2026-10-27T11:37:37+05:30 |
| branch | dhruv |
| target.kind | commit |
| target.commit | e1ded77299cbebe2c0f4afce1684037547e991ac |
| files.changed | 11 |
| files.added | 6 |
| files.modified | 5 |
| files.deleted | 0 |
| files.insertions | 1522 |
| files.deletions | 35 |
| verdict | review-with-caution |
| score | 86 |
| quality | good |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 2 |
| summary.info | 2 |
| before | The consumer UCRF report only offered two buttons that downloaded the XLSX and TUDF files. The skipped records table sat in a small bordered box on the page. |
| after | Each file has an eye button that opens a preview dialog (XLSX as a table, TUDF as text) next to its download button. Previews are fetched once and cached for 5 minutes per filter set. The skipped records table has its own header, count and pagination. |

### changeType (3)

- feature
- UI
- docs

### effects (4)

- The ucrf-submission page now fetches the XLSX and TUDF files an extra time when a preview is opened, on top of the download request.
- src/features/reports/api.ts gains getUcrfConsumerXlsx and getUcrfConsumerTudf, and the two download functions now call them.
- Four docs files are added under docs/ and git-changes-review.md is removed in a later commit.
- git-commit.sh is added to .gitignore.

### filesReviewed (11)

| path | change | status | note |
|---|---|---|---|
| .gitignore | modified | green | no issues |
| docs/git-changes-review.md | added | green | no issues |
| docs/ucrf-report-audit.md | added | green | no issues |
| docs/ucrf-report.md | added | green | no issues |
| docs/ucrf-submission-responsiveness.md | added | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx | modified | amber | F2 |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-grid-pagination.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-tudf-preview-modal.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx | added | amber | F1 |
| src/app/(app)/(main)/reports-user/ucrf-submission/page.tsx | modified | green | no issues |
| src/features/reports/api.ts | modified | green | no issues |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | XLSX preview renders every row at once |
| location | src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx:86 |
| problem | The table maps over all rows from the parsed sheet with no row limit or pagination, and renders one td for every column in every row. |
| impact | A report with thousands of records creates tens of thousands of DOM nodes when the dialog opens, so the tab freezes or becomes slow to scroll. |
| fix | Show only the first N rows (for example 100) with a note such as `Showing first 100 of <total> rows`, or paginate the preview. |
| evidence | {rows.map((row, rowIndex) => ( |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-27T06:31:53.643Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | xlsx library is imported statically in the report panel |
| location | src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx:20 |
| problem | `import { read, utils } from "xlsx"` is at the top of the panel, so the library is part of the page bundle even when the user never opens the XLSX preview. |
| impact | Every visit to the UCRF submission page downloads and parses the xlsx code, which makes the first load heavier. |
| fix | Load it inside parseXlsxPreview with `const { read, utils } = await import("xlsx")`. |
| evidence | import { read, utils } from "xlsx" |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-27T05:40:26.253Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |

### previousFindings (2)

| commit | findingId | title | result | note |
|---|---|---|---|---|
| e1ded77299cbebe2c0f4afce1684037547e991ac | F1 | XLSX preview renders every row at once | resolved | Verified: the preview now shows only the first 10 rows (PREVIEW_ROW_LIMIT, ucrf-xlsx-preview-modal.tsx:28 and :43) with a "Showing first N of M rows" note at :131. |
| e1ded77299cbebe2c0f4afce1684037547e991ac | F2 | xlsx library is imported statically in the report panel | resolved | Verified: xlsx is now loaded with a dynamic import at ucrf-consumer-report-panel.tsx:44. |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed (run on the working tree, which is later than the commit reviewed) |
| green | npx eslint src/app/(app)/(main)/reports-user/ucrf-submission src/features/reports/api.ts | passed |
| grey | tests | not run: no test script is configured in package.json |

### gaps (4)

- The preview was not opened with a large real report, so the size at which F1 becomes visible is not measured.
- The cache behavior (5 minute stale time, retry off) was read from code, not exercised in a browser.
- tsc and eslint ran on a later state of the code than the commit reviewed.
- Earlier reports of this commit and the 5 commits before it were checked against the current working tree. Only `c9bb363` has a review among those 5 commits and it has no findings.

### info (2)

- Previews are cached for 5 minutes per filter set, so regenerating a report with the same filters can show an older preview than the file you download.
- F1 and F2 were marked resolved by hand and both are verified as really fixed in the current working tree (uncommitted).

---

## howismycommit-4

| Field | Value |
|---|---|
| id | howismycommit-4 |
| generatedAt | 2026-10-27T11:00:57+05:30 |
| branch | dhruv |
| target.kind | commit |
| target.commit | e1ded77299cbebe2c0f4afce1684037547e991ac |
| files.changed | 11 |
| files.added | 6 |
| files.modified | 5 |
| files.deleted | 0 |
| files.insertions | 1522 |
| files.deletions | 35 |
| verdict | review-with-caution |
| score | 86 |
| quality | good |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 2 |
| summary.info | 2 |
| before | The consumer UCRF report only offered two buttons that downloaded the XLSX and TUDF files. The skipped records table sat in a small bordered box on the page. |
| after | Each file has an eye button that opens a preview dialog (XLSX as a table, TUDF as text) next to its download button. Previews are fetched once and cached for 5 minutes per filter set. The skipped records table has its own header, count and pagination. |

### changeType (3)

- feature
- UI
- docs

### effects (4)

- The ucrf-submission page now fetches the XLSX and TUDF files an extra time when a preview is opened, on top of the download request.
- src/features/reports/api.ts gains getUcrfConsumerXlsx and getUcrfConsumerTudf, and the two download functions now call them.
- Four docs files are added under docs/ and git-changes-review.md is removed in a later commit.
- git-commit.sh is added to .gitignore.

### filesReviewed (11)

| path | change | status | note |
|---|---|---|---|
| .gitignore | modified | green | no issues |
| docs/git-changes-review.md | added | green | no issues |
| docs/ucrf-report-audit.md | added | green | no issues |
| docs/ucrf-report.md | added | green | no issues |
| docs/ucrf-submission-responsiveness.md | added | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx | modified | amber | F2 |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-grid-pagination.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-tudf-preview-modal.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx | added | amber | F1 |
| src/app/(app)/(main)/reports-user/ucrf-submission/page.tsx | modified | green | no issues |
| src/features/reports/api.ts | modified | green | no issues |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | XLSX preview renders every row at once |
| location | src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx:86 |
| problem | The table maps over all rows from the parsed sheet with no row limit or pagination, and renders one td for every column in every row. |
| impact | A report with thousands of records creates tens of thousands of DOM nodes when the dialog opens, so the tab freezes or becomes slow to scroll. |
| fix | Show only the first N rows (for example 100) with a note such as `Showing first 100 of <total> rows`, or paginate the preview. |
| evidence | {rows.map((row, rowIndex) => ( |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-27T06:07:16.905Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | xlsx library is imported statically in the report panel |
| location | src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx:20 |
| problem | `import { read, utils } from "xlsx"` is at the top of the panel, so the library is part of the page bundle even when the user never opens the XLSX preview. |
| impact | Every visit to the UCRF submission page downloads and parses the xlsx code, which makes the first load heavier. |
| fix | Load it inside parseXlsxPreview with `const { read, utils } = await import("xlsx")`. |
| evidence | import { read, utils } from "xlsx" |
| status | resolved |
| resolvedIn | null |
| resolvedAt | 2026-10-27T05:40:26.253Z |
| resolvedNote | Marked resolved manually |

### previousFindings (0)

_Empty._

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed (run on the working tree, which is later than the commit reviewed) |
| green | npx eslint src/app/(app)/(main)/reports-user/ucrf-submission src/features/reports/api.ts | passed |
| grey | tests | not run: no test script is configured in package.json |

### gaps (4)

- The preview was not opened with a large real report, so the size at which F1 becomes visible is not measured.
- The cache behavior (5 minute stale time, retry off) was read from code, not exercised in a browser.
- tsc and eslint ran on a later state of the code than the commit reviewed.
- Previous findings were not checked because this review targeted one commit by hash.

### info (2)

- Previews are cached for 5 minutes per filter set, so regenerating a report with the same filters can show an older preview than the file you download.
- In the TUDF modal, the load error text is shown inside the read-only file text area instead of a separate error state.

---

## howismycommit-3

| Field | Value |
|---|---|
| id | howismycommit-3 |
| generatedAt | 2026-10-23T17:07:47+05:30 |
| branch | dhruv |
| target.kind | commit |
| target.commit | c9bb36323a79d516cc702cb97334df8931048f8f |
| files.changed | 1 |
| files.added | 0 |
| files.modified | 1 |
| files.deleted | 0 |
| files.insertions | 1 |
| files.deletions | 1 |
| verdict | looks-good |
| score | 100 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 2 |
| before | The toolbar above the skipped records table (search box and export button) had no padding, so it sat flush against the edges of its container. |
| after | The toolbar has horizontal padding of 1rem and vertical padding of 0.5rem. |

### changeType (1)

- UI

### effects (1)

- Only the toolbar of SkippedTable on the UCRF submission page changes. The next commit rewrites this component, so this padding is replaced there.

### filesReviewed (1)

| path | change | status | note |
|---|---|---|---|
| src/app/(app)/(main)/reports-user/ucrf-submission/page.tsx | modified | green | no issues |

### findings (0)

_Empty._

### checks (2)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed (run on the working tree, which is two commits after this one) |
| green | npx eslint src/app/(app)/(main)/reports-user/ucrf-submission/page.tsx | passed |

### gaps (3)

- The change was not viewed in a browser.
- tsc and eslint ran on a later state of the code than the commit reviewed.
- No test script is configured in package.json. This is a styling-only change, so no score was deducted.

### info (2)

- The commit message says `verify branch and repository setup` but the commit changes UI padding. A message that names the change would make history easier to search.
- The same SkippedTable toolbar is rewritten in the next commit, so this change is short-lived.

---

## howismycommit-2

| Field | Value |
|---|---|
| id | howismycommit-2 |
| generatedAt | 2026-10-23T17:06:57+05:30 |
| branch | dhruv |
| target.kind | commit |
| target.commit | e1ded77299cbebe2c0f4afce1684037547e991ac |
| files.changed | 11 |
| files.added | 6 |
| files.modified | 5 |
| files.deleted | 0 |
| files.insertions | 1522 |
| files.deletions | 35 |
| verdict | review-with-caution |
| score | 86 |
| quality | good |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 2 |
| summary.info | 2 |
| before | The consumer UCRF report only offered two buttons that downloaded the XLSX and TUDF files. The skipped records table sat in a small bordered box on the page. |
| after | Each file has an eye button that opens a preview dialog (XLSX as a table, TUDF as text) next to its download button. Previews are fetched once and cached for 5 minutes per filter set. The skipped records table has its own header, count and pagination. |

### changeType (3)

- feature
- UI
- docs

### effects (4)

- The ucrf-submission page now fetches the XLSX and TUDF files an extra time when a preview is opened, on top of the download request.
- src/features/reports/api.ts gains getUcrfConsumerXlsx and getUcrfConsumerTudf, and the two download functions now call them.
- Four docs files are added under docs/ and git-changes-review.md is later removed in the next commit.
- git-commit.sh is added to .gitignore.

### filesReviewed (11)

| path | change | status | note |
|---|---|---|---|
| .gitignore | modified | green | no issues |
| docs/git-changes-review.md | added | green | no issues |
| docs/ucrf-report-audit.md | added | green | no issues |
| docs/ucrf-report.md | added | green | no issues |
| docs/ucrf-submission-responsiveness.md | added | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx | modified | amber | F2 |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-grid-pagination.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-tudf-preview-modal.tsx | added | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx | added | amber | F1 |
| src/app/(app)/(main)/reports-user/ucrf-submission/page.tsx | modified | green | no issues |
| src/features/reports/api.ts | modified | green | no issues |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P2 |
| title | XLSX preview renders every row at once |
| location | src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx:88 |
| problem | The table maps over all rows from the parsed sheet with no row limit or pagination, and renders one td for every column in every row. |
| impact | A report with thousands of records creates tens of thousands of DOM nodes when the dialog opens, so the tab freezes or becomes slow to scroll. |
| fix | Show only the first N rows (for example 100) with a note such as `Showing first 100 of <total> rows`, or paginate the preview. |
| status | resolved |
| resolvedAt | 2026-10-27T11:59:37+05:30 |
| resolvedNote | Fixed in uncommitted changes: the preview now shows only the first 10 rows (PREVIEW_ROW_LIMIT at ucrf-xlsx-preview-modal.tsx:28 and :43) with a "Showing first N of M rows" note at :131 |
| resolvedIn | null |
| needsAttention | false |
| attentionNote | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | xlsx library is imported statically in the report panel |
| location | src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx:20 |
| problem | `import { read, utils } from "xlsx"` is at the top of the panel, so the library is part of the page bundle even when the user never opens the XLSX preview. |
| impact | Every visit to the UCRF submission page downloads and parses the xlsx code, which makes the first load heavier. |
| fix | Load it inside parseXlsxPreview with `const { read, utils } = await import("xlsx")`. |
| status | resolved |
| resolvedAt | 2026-11-04T05:03:49.886Z |
| resolvedNote | Marked resolved manually |
| resolvedIn | null |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed (run on the working tree, HEAD is d639ba2 which is one commit after this one) |
| green | npx eslint src/app/(app)/(main)/reports-user/ucrf-submission src/features/reports/api.ts | passed |
| grey | tests | not run: no test script is configured in package.json |

### gaps (3)

- The preview was not opened with a large real report, so the size at which F1 becomes visible is not measured.
- The cache behavior (5 minute stale time, retry off) was read from code, not exercised in a browser.
- tsc and eslint ran on a later commit than the one reviewed.

### info (2)

- Previews are cached for 5 minutes per filter set, so regenerating a report with the same filters can show an older preview than the file you download.
- In the TUDF modal, the load error text is shown inside the read-only file text area instead of a separate error state.

---

## howismycommit-1

| Field | Value |
|---|---|
| id | howismycommit-1 |
| generatedAt | 2026-10-23T17:03:50+05:30 |
| branch | dhruv |
| target.kind | commit |
| target.commit | d639ba202a6b352fce6962c8fc139918c4932e18 |
| files.changed | 20 |
| files.added | 0 |
| files.modified | 19 |
| files.deleted | 1 |
| files.insertions | 301 |
| files.deletions | 436 |
| verdict | review-with-caution |
| score | 92 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 2 |
| summary.green | 2 |
| summary.info | 2 |
| before | UCRF report pages, sidebar, navbar, settings panel and login were laid out for desktop widths. Toasts used the theme colours with colour-coded success and error styles. |
| after | UCRF report panels, filters, pagination and preview modals reflow on small screens. The sidebar and navbar have a new look, the login button stays disabled until both fields are filled, and toasts are plain white or black without status colours. |

### changeType (3)

- UI
- refactor
- docs

### effects (4)

- Every screen that shows a toast (forms using useFormFlow, mutations) loses the red and green status colouring from richColors.
- The right-hand navbar panel in horizontal layout loses its horizontal padding.
- Tooltips from FormField now use the primary colour, which affects every form with contextual help.
- docs/git-changes-review.md is deleted.

### filesReviewed (20)

| path | change | status | note |
|---|---|---|---|
| .gitignore | modified | green | no issues |
| docs/git-changes-review.md | deleted | green | no issues |
| src/app/(app)/(auth)/login/page.tsx | modified | green | no issues |
| src/app/(app)/(main)/_components/navbar/navbar.tsx | modified | amber | F1 |
| src/app/(app)/(main)/_components/navbar/user-settings-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/_components/sidebar/index.tsx | modified | green | no issues |
| src/app/(app)/(main)/page.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-bureau-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-commercial-report-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-consumer-report-panel.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-field-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-filters.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-grid-pagination.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-skipped-columns.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-tudf-preview-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/_components/ucrf-xlsx-preview-modal.tsx | modified | green | no issues |
| src/app/(app)/(main)/reports-user/ucrf-submission/page.tsx | modified | green | no issues |
| src/app/(app)/layout.tsx | modified | amber | F2 |
| src/components/form/form-field.tsx | modified | green | no issues |
| src/components/ui/sonner.tsx | modified | amber | F2 |

### findings (2)

#### findings[1] · F1

| Field | Value |
|---|---|
| id | F1 |
| severity | P3 |
| title | Invalid Tailwind class `px-4)` drops navbar padding |
| location | src/app/(app)/(main)/_components/navbar/navbar.tsx:78 |
| problem | The class string contains `px-4)` with a stray parenthesis, so Tailwind does not generate it. The old `px-4` class was removed in the same edit. |
| impact | The right-hand navbar panel (loan chat listener and user area) renders without horizontal padding, so its content touches the edges. |
| fix | Change `px-4)` to `px-4` in the class string. |
| status | resolved |
| resolvedAt | 2026-10-27T05:40:39.211Z |
| resolvedNote | Marked resolved manually |
| resolvedIn | null |

#### findings[2] · F2

| Field | Value |
|---|---|
| id | F2 |
| severity | P3 |
| title | Toasts lose status colours and hardcode black and white |
| location | src/components/ui/sonner.tsx:27 |
| problem | The toast classes use bg-white, text-black and bg-black, and richColors was removed from the Toaster in src/app/(app)/layout.tsx:25. AGENTS.md requires design system tokens, not fixed colours. |
| impact | Success and error toasts from useFormFlow and mutations no longer show green or red, so failures are harder to notice. Toasts also ignore theme changes. |
| fix | Restore richColors on the Toaster and use tokens such as bg-background and text-foreground in sonner.tsx instead of white and black. |
| status | resolved |
| resolvedAt | 2026-10-27T05:40:40.113Z |
| resolvedNote | Marked resolved manually |
| resolvedIn | null |
| needsAttention | false |
| attentionNote | null |

### checks (3)

| status | command | result |
|---|---|---|
| green | npx tsc --noEmit | passed (run on the working tree at HEAD d639ba2) |
| green | npx eslint <changed ts and tsx files> | passed |
| grey | tests | not run: no test script is configured in package.json |

### gaps (3)

- The layout changes were not checked on real phone or tablet widths.
- No test script exists, so no behavior is covered by tests.
- tsc and eslint ran on the current working tree, which may include changes made after this commit.

### info (2)

- navbar.tsx leaves a commented-out div (`For weird style`) in place of deleting it.
- The login button shows both a loading spinner and the text `Loading...` while submitting.

---
