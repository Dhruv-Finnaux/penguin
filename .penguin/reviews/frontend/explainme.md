# 🐧 Explain Me · Frontend

> Generated from `data/frontend/explainme.json`. Edit the JSON, not this file. 5 entries, newest first.

## explainme-5

| Field | Value |
|---|---|
| id | explainme-5 |
| generatedAt | 2026-11-05T16:39:10+05:30 |
| author | Dhruv |
| question | Where and in which process are the external APIs for Aadhaar Card and PAN used, and is each one set up or not? |
| problem | You asked where Aadhaar and PAN verification are used in the app, and which providers are set up. This is the guide, from reading the UI and API code. It has not been checked against the live database. |
| reason | WHERE IT IS USED. The user opens a customer's KYC tab or the Identification Document modal and clicks Verify on an Aadhaar or PAN document. A shared 'unified verify' component opens the matching flow.<br><br>AADHAAR has three provider flows in the UI: (1) Surepass: Aadhaar OTP (generate and verify) and DigiLocker. (2) Digipehchan: Aadhaar OTP (generate and verify). (3) Digio: a KYC request (/external/digio/aadhaar-pan/create-request) that returns Aadhaar and PAN data together; it also creates a draft customer and re-verifies one (POST /lms/customer/:id/kyc/re-verify).<br><br>PAN in the UI uses Surepass only (POST /external/surepass/pan/verify). The backend can also check the Aadhaar-PAN link (aadhaar-pan-link), but there is no UI hook for it. Digio's Aadhaar and PAN request also returns PAN data.<br><br>AFTER A SUCCESSFUL VERIFY the backend saves a verification record, links it to the customer's KYC document and sets 'last verified'. Later steps depend on it: the credit bureau check refuses to run unless the customer has a verified KYC document with a bureau ID type (credit-bureaus.service.ts:752).<br><br>STATUS IN CODE. Every provider has real HTTP adapters (libs/kyc-gateway), a controller in the API, and UI hooks. Nothing is a stub or a mock. |
| solution | To see what is really set up, open Configuration > External APIs in the app (Enabled and Disabled tabs, each card shows its active API) and check that each integration's credentials are filled in. The API reads these settings from the database on every call, so the code being ready does not mean it is switched on. |
| advice | Not checked: the live database, so which integrations are switched on and which have working credentials is unknown. No credentials or .env files were read. Only one provider can be active per document, so Aadhaar can be routed to Surepass, Digipehchan or Digio, and the matching flow should be the one shown to the user. If a flow does not appear or fails with a 403, the settings above are the first place to look. |

### sourceFiles (12)

- src/features/customers/components/view-edit-customer/_components/kyc-details.tab.tsx
- src/features/customers/components/identification-document-modal/identification-document-form.tsx
- src/features/external-apis/api.ts
- src/features/external-apis/hooks.ts
- src/features/external-apis/components/aadhar-verify/flows
- src/features/external-apis/components/pan-verify/flows/surepass-pan-flow.tsx
- FINNAUX2.0-API: apps/finnaux-api/src/external/surepass/surepass.controller.ts:97
- FINNAUX2.0-API: apps/finnaux-api/src/external/digio/digio.controller.ts:29
- FINNAUX2.0-API: apps/finnaux-api/src/external/digipehchan/digipehchan.controller.ts:16
- FINNAUX2.0-API: apps/finnaux-api/src/external/shared/external-api-runtime.service.ts
- FINNAUX2.0-API: libs/kyc-gateway/src/providers/surepass/products/pan/surepass-pan-adapter.ts:33
- FINNAUX2.0-API: apps/finnaux-api/src/los/loan-application/customer/credit-bureaus/credit-bureaus.service.ts:752

### approach (6)

- 1. Open Configuration > External APIs and look at the Enabled and Disabled tabs.
- 2. For each provider you need (Surepass, Digipehchan, Digio), check it is Enabled and shows the right Active API.
- 3. Open its edit form and check the credentials are filled in (Surepass uses a bearer token).
- 4. Try Verify on a test Aadhaar and a test PAN in a customer's KYC tab.
- 5. If a call fails, read the error: 'External API integration is disabled' (403) means switched off; 'This API group is not currently selected' (403) means another provider is active for that document; 'External API credentials are not configured' or 'incomplete' (500) means the token or keys are missing.
- PROVIDER LIST, FROM THE CODE: Surepass (Aadhaar OTP, DigiLocker, PAN, bank, GST, CIN, RC, voter ID, driving licence, electricity): built, UI found. Digipehchan (Aadhaar OTP): built, UI found. Digio (Aadhaar and PAN request): built, UI found. Surepass Udyam, Udyog Aadhaar and Aadhaar-PAN link: built, no UI hook in the external-apis folder. Digio eSign, face match and video KYC: built, no hook in that folder (may be called from the loan screens, not checked). CRIF High Mark CIBIL, CKYC and KVB bank: built, UI not checked.

---

## explainme-4

| Field | Value |
|---|---|
| id | explainme-4 |
| generatedAt | 2026-11-03T18:09:42+05:30 |
| author | Dhruv |
| question | How do I use PentAGI to pen test this UI on localhost, from the test/secpen branch? |
| problem | You want to pen test the Finnaux UI on your own machine with PentAGI (AI pen testing tool in Docker). This guide is the steps to use it. |
| reason | PentAGI is not an npm package or a Claude plugin. It is its own app that runs in Docker with a web page on https://localhost:8443. So the repo only holds a folder with the setup notes (security/pentagi/README.md). Docker and your LLM key do the real work. I checked you are on test/secpen with a clean tree. I did not run Docker or any test. |
| solution | Follow security/pentagi/README.md. Create security/pentagi/.env with one LLM key and your own passwords, download PentAGI's docker-compose.yml, run docker compose up -d, open https://localhost:8443, then start a flow aimed at the UI dev server. |
| advice | Only test your own localhost app. Do not point it at staging, production or the API repo unless you are allowed to. The .env file is git-ignored; never commit keys. The tool needs Docker, so the pre-push hook is not related. The agent can send many requests; keep PENTAGI_LISTEN_IP at 127.0.0.1 and block ports 28000-29999 with a firewall. I could not read the plugin/MCP part of PentAGI's README, and the README says plugins and MCP are an Enterprise feature, so this setup does not use them. I wanted to add security/pentagi/.env.example but a permission rule blocked writing .env* files, so the variables are listed in the README instead. |

### sourceFiles (1)

- security/pentagi/README.md

### approach (11)

- 1. Check you have Docker running (2 CPU, 4 GB RAM, 20 GB disk free).
- 2. Stay on test/secpen: git branch --show-current.
- 3. In security/pentagi/ create .env. Add ANTHROPIC_API_KEY (or another LLM key), PENTAGI_LISTEN_IP=127.0.0.1, PENTAGI_LISTEN_PORT=8443, PUBLIC_URL=https://localhost:8443, and your own COOKIE_SIGNING_SALT, PENTAGI_POSTGRES_USER, PENTAGI_POSTGRES_PASSWORD.
- 4. In security/pentagi/ run: curl -O https://raw.githubusercontent.com/vxcontrol/pentagi/master/docker-compose.yml
- 5. Start it: docker compose up -d. Wait a minute.
- 6. Open https://localhost:8443. Login admin@pentagi.com / admin. Change the password at once.
- 7. In another terminal start the UI: npm run dev (runs on port 3000).
- 8. In PentAGI click Flows, New Flow, choose Automation, pick your LLM provider.
- 9. In the message box write: Target http://host.docker.internal:3000 only. Goal: find XSS, token storage problems, auth route bypass, missing headers. Do not touch any other host.
- 10. Submit, watch the flow, open Report when done. Fix real findings on this branch.
- 11. Stop it: docker compose down (inside security/pentagi/).

---

## explainme-3

| Field | Value |
|---|---|
| id | explainme-3 |
| generatedAt | 2026-11-03T17:48:13+05:30 |
| author | Dhruv |
| question | i ran: switch dev, pull origin dev (1 new commit), switch feat/report-builder, merge dev (no conflicts). Now: should I commit and push, or something else? Is this safe to do always before coding on feat? Is pushing after it safe when my feat changes are ready and dev changes are safe? |
| problem | You merged local dev into feat/report-builder. You ask what to do next (commit? push?) and whether this routine is safe before coding and before pushing. |
| reason | git merge already made the commit for you (d73ceed5 'Merge branch dev into feat/report-builder'). Nothing is left to add or commit. Your feat is now 2 commits ahead of origin/feat/report-builder (0 behind): the merge from before (8ee98644) and this new merge (d73ceed5). dev local and origin/dev are equal (0 / 0). |
| solution | Do not run git add or git commit. Just run git push. After that, open (or update) your PR from feat/report-builder into dev on GitHub. |
| advice | Merge commits are normal here; do not worry about them. Never use git push --force. Safe means no conflicts, not 'works': dev's change in external-apis/page.tsx could break your code without a conflict, so run npx tsc --noEmit and npm run lint after merging. Always do git status first so no work is lost. If a merge shows conflicts, stop and ask before fixing. Verified: feat is 2 ahead, 0 behind origin; dev equals origin/dev. |

### sourceFiles (1)

- none

### approach (6)

- 1. Check: git status -sb. Expect 'ahead 2' and no changed files.
- 2. Push: git push. It sends the 2 merge commits to origin/feat/report-builder. The pre-push hook runs tsc and next build, so wait for it.
- 3. If push says 'rejected', someone else pushed to feat. Run git pull, then git push again.
- 4. Open the PR into dev on GitHub (or refresh the open one). Dev has no new commits since, so it will merge clean.
- Q1 (before coding): Yes, this routine is safe. Do it at the start: switch dev, git pull, switch feat, git merge dev. Safest when git status is clean first. If you have uncommitted work, commit it first, or the merge can stop.
- Q2 (before pushing): Yes, it is ok. Merging dev into feat only changes feat, never dev. Your push only adds commits (no force), so nobody loses work. Run tsc and lint after the merge to catch breaks from the dev changes.

---

## explainme-2

| Field | Value |
|---|---|
| id | explainme-2 |
| generatedAt | 2026-10-31T11:11:38+05:30 |
| author | Dhruv |
| question | ive changed an canEdit based button toggle view, check and let me know what i did is good?, if yes there are many places with the old code should i change it? if yes tell me and if not then explain me why not? |
| problem | You changed the Edit / Cancel+Save toggle so users without canEdit see no buttons. You asked if it is correct and whether the other forms with the old code should change too. |
| reason | The old chain `canEdit && !isEditing ? Edit : (Cancel + Save)` falls into the Cancel/Save branch whenever canEdit is false, because the first condition fails. A read-only user therefore saw Cancel and Save on a locked form (useFormFlow starts locked, so the fields are disabled). Your `canEdit ? (!isEditing ? Edit : Cancel+Save) : null` is correct: new forms still get Save, editors get the toggle, read-only users get nothing. |
| solution | Keep the new logic. Apply the same shape to the 5 other forms that still use the old chain (dealer, branch, loan product, employee on-role, lender), and fix the formatting in designation-detail-form.tsx (`( !isEditing ? (` fails Prettier). |
| advice | Not verified: I did not run the pages with a read-only role, and I only checked the files that contain `canEdit && !isEditing`. closure.tab/index.tsx, template-form.tsx and the rule-engine dialogs also call setIsEditing(true) and may have the same problem. Dealers' new page and the rule-engine dialogs pass canEdit as true, so they will not change. The old pattern was low risk because Save stays disabled when the form is not dirty, but showing Cancel/Save to read-only users is still misleading, and the Cancel click resets the form. |

### sourceFiles (7)

- src/app/(app)/(main)/hrms/designations/_components/designation-detail-form.tsx:89
- src/app/(app)/(main)/configuration/vendors/_components/vendor-detail-form.tsx:49
- src/app/(app)/(main)/configuration/dealers/_components/dealer-detail-form.tsx:52
- src/app/(app)/(main)/configuration/branches/_components/branch-details-form.tsx:86
- src/app/(app)/(main)/configuration/loan-products/_components/product-details-form.tsx:62
- src/app/(app)/(main)/hrms/employees/_components/employee-on-role.form.tsx:154
- src/app/(app)/(main)/configuration/co-lending/_components/lender-form.tsx:89

### approach (5)

- Run Prettier on designation-detail-form.tsx; it is the only changed file that fails the check.
- In dealer-detail-form.tsx:52, branch-details-form.tsx:86, product-details-form.tsx:62 and employee-on-role.form.tsx:154 replace `props.canEdit && !isEditing ? (Edit) : (Cancel+Save)` with `props.canEdit ? (!isEditing ? (Edit) : (Cancel+Save)) : null`.
- In lender-form.tsx:89 do the same with `canEdit`; it defaults to true, so behaviour only changes if a caller passes false.
- Optional: move the toggle into one shared FormActions component so the nested ternary is not copied into seven files.
- Open each page as a user without edit rights and as one with rights, and check that the buttons show and hide as expected.

---

## explainme-1

| Field | Value |
|---|---|
| id | explainme-1 |
| generatedAt | 2026-10-28T13:04:01+05:30 |
| author | Dhruv |
| question | there is this feature of changing color of the theme (primary) from the sidebar in user settings panel "<ColorField control={control} />", what's the problem why it is showing the fallback color |
| problem | Picking any colour swatch except purple leaves the app on the default :root primary (252 80% 40%), the fallback colour. |
| reason | The .color-rose/orange/teal/purple/blue/coral/amber rules sit inside @layer base. Tailwind 3 drops class selectors in @layer that no content file uses literally. ColorField builds the class at runtime (`color-${theme.name}`), so only color-purple survives (it appears literally as defaultTheme in color.provider.tsx). Verified in the browser: html had class color-rose but the compiled stylesheet contained only .color-purple, and --primary stayed 252 80% 40%. |
| solution | Make the colour classes survive Tailwind's purge: either move the .color-* rules out of @layer base in globals.css, or add a safelist of the seven color-* classes to tailwind.config.ts. |
| advice | Adding a new swatch needs its name added to both the swatch list in ColorField and the safelist. A stored value with no matching CSS class (for example an old colorMode from the API) would also show the fallback, but that was not the cause here. |

### sourceFiles (4)

- src/app/globals.css:184
- src/app/(app)/(main)/_components/navbar/user-settings-panel.tsx:548
- src/providers/color.provider.tsx:373
- tailwind.config.ts:5

### approach (3)

- Preferred: in tailwind.config.ts add safelist: ["color-rose","color-orange","color-teal","color-purple","color-blue","color-coral","color-amber"].
- Restart the dev server and hard reload so the CSS is rebuilt.
- Click each swatch in ColorField and confirm getComputedStyle(document.documentElement).getPropertyValue('--primary') changes.

---
