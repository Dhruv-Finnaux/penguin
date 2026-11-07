# 🐧 How Is My Commit · Backend

> Generated from `data/backend/howismycommit.json`. Edit the JSON, not this file. 6 entries, newest first.

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
| status | open |
| resolvedIn | null |
| resolvedAt | null |
| resolvedNote | null |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |
| optional | true |

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
| status | open |
| resolvedIn | null |
| resolvedAt | null |
| resolvedNote | null |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |
| optional | true |

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
| status | open |
| resolvedIn | null |
| resolvedAt | null |
| resolvedNote | null |
| needsAttention | false |
| attentionNote | null |
| confirmed | false |
| confirmedNote | null |
| optional | true |

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
| score | 95 |
| commitScore | 95 |
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
| score | 95 |
| quality | excellent |
| summary.red | 0 |
| summary.amber | 0 |
| summary.green | 2 |
| summary.info | 4 |
| before | The consumer UCRF report wrote one short TUDF record per loan with simple segment tags, a single phone and ID list, and no old account, income, email or secondary address data. With closed cases included it reported open loans together with loans closed in the chosen window. |
| after | The TUDF builder emits segment-length tags (PN03, ID03, PT03, EC03, PA03, TL04), up to five name fields, several phones, emails, a secondary address, old account number, interest rate and income fields, and the grid shows old account and NREGA/CKYC data. With closed cases included the filter returns open loans plus loans closed between the closed-from date and the reporting date. |
| commitScore | 28 |

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
| resolvedAt | 2026-11-04T10:07:20.216Z |
| resolvedNote | Marked resolved manually |
| needsAttention | false |
| attentionNote | null |
| optional | true |

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
| score | 28 |
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
| score | 28 |
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
| score | 28 |
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
