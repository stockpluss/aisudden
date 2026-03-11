# Phase 2: Replace GAS Calls in Action Files

## Objective

Replace Google Apps Script (GAS) fetch calls in both submit-lead action files with direct Google Sheets API calls via `appendRow()` from `lib/google-sheets.ts`. Update `.env.local.example` to reflect the new environment variable scheme.

## Prerequisites

- Phase 1 completed: `lib/google-sheets.ts` exists and exports `appendRow()`
- `googleapis` package installed

## Instructions

### Step 1: Modify `app/actions/submit-lead.ts`

Current file is 80 lines. Apply these changes:

**1a: Add import**
Add import at top (after existing imports):
```typescript
import { appendRow } from "@/lib/google-sheets"
```

**1b: Replace GAS fetch with appendRow call**
Remove the entire `fetch(process.env.APPS_SCRIPT_URL!, ...)` block (lines 31-46 in current file) and the response status check block (lines 48-68).

Replace with:
1. Read env vars: `const sheetId = process.env.STOCKPLUS_SHEET_ID` and `const tabName = process.env.STOCKPLUS_SHEET_TAB`
2. Validate both exist (throw descriptive error if not)
3. Call `await appendRow(sheetId, tabName, [timestamp, formData.name, formData.phone])`
4. After successful appendRow, proceed to Kakao message sending (keep existing Kakao logic unchanged)

**1c: Preserve unchanged elements**
- Keep `"use server"` directive at top
- Keep the `submitLead` function signature: `(formData: { name: string; phone: string }) => Promise<{ success: boolean; error?: string }>`
- Keep Korean timestamp formatting logic (lines 13-26 in current file)
- Keep Kakao message sending logic after Sheet write success
- Keep the try/catch error handling pattern with the same return type

**1d: Remove GAS-related references**
- Remove all references to `process.env.APPS_SCRIPT_URL`
- Remove all references to `process.env.SECRET_TOKEN`
- Remove the `redirect: "manual"` fetch option
- Remove response status 302 check

### Step 2: Modify `app/actions/submit-lead-shinjeong.ts`

Current file is 68 lines. Apply the same pattern as Step 1 with these differences:

**2a: Add import**
```typescript
import { appendRow } from "@/lib/google-sheets"
```

**2b: Replace GAS fetch with appendRow call**
- Read `SHINJEONG_SHEET_ID` and `SHINJEONG_SHEET_TAB` from env
- Call `await appendRow(sheetId, tabName, [timestamp, formData.name, formData.phone, "shinjeong.vc"])`
- Note the 4th element: `"shinjeong.vc"` as the source field

**2c: Preserve unchanged elements**
- Keep `"use server"` directive
- Keep `submitLeadShinjeong` function signature (same as `submitLead` pattern)
- Keep `getKoreanTimestamp()` helper function
- Keep Kakao message sending with `SHINJEONG_KAKAO_TEMPLATE_ID`
- Keep try/catch error handling

**2d: Remove GAS-related references**
- Remove `process.env.SHINJEONG_APPS_SCRIPT_URL`
- Remove `process.env.SHINJEONG_SECRET_TOKEN`

### Step 3: Update `.env.local.example`

Replace the GAS-related section with Google Sheets API variables:

**Remove:**
```
APPS_SCRIPT_URL=https://GOOGLE_APPS_SCRIPT_DEPLOY_URL_HERE
SECRET_TOKEN=SECRET_KEY_SET_INTO_SCRIPT_HERE
```
and:
```
SHINJEONG_APPS_SCRIPT_URL=https://GOOGLE_APPS_SCRIPT_DEPLOY_URL_HERE
SHINJEONG_SECRET_TOKEN=SECRET_KEY_SET_INTO_SCRIPT_HERE
```

**Add (at the top of the file, replacing the old "Google Sheet" section):**
```
# Google Sheets API - Service Account
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Stockplus Sheet
STOCKPLUS_SHEET_ID=your-spreadsheet-id
STOCKPLUS_SHEET_TAB=Sheet1

# Shinjeong Sheet
SHINJEONG_SHEET_ID=your-spreadsheet-id
SHINJEONG_SHEET_TAB=Sheet1
```

Keep all Solapi/Kakao-related variables unchanged.

### Step 4: Verify no remaining GAS references

Search the entire codebase for any remaining references to:
- `APPS_SCRIPT_URL`
- `SECRET_TOKEN` (in the context of GAS, not Solapi)
- `SHINJEONG_APPS_SCRIPT_URL`
- `SHINJEONG_SECRET_TOKEN`

These should only appear in git history, not in any source files.

## Completion Checklist

- [ ] `app/actions/submit-lead.ts` imports `appendRow` from `@/lib/google-sheets`
- [ ] `app/actions/submit-lead.ts` calls `appendRow(sheetId, tabName, [timestamp, name, phone])`
- [ ] `app/actions/submit-lead.ts` reads `STOCKPLUS_SHEET_ID` and `STOCKPLUS_SHEET_TAB` from env
- [ ] `app/actions/submit-lead.ts` preserves `submitLead` function signature and return type
- [ ] `app/actions/submit-lead.ts` preserves Korean timestamp formatting
- [ ] `app/actions/submit-lead.ts` preserves Kakao message sending after success
- [ ] `app/actions/submit-lead.ts` has no references to `APPS_SCRIPT_URL` or `SECRET_TOKEN`
- [ ] `app/actions/submit-lead-shinjeong.ts` imports `appendRow` from `@/lib/google-sheets`
- [ ] `app/actions/submit-lead-shinjeong.ts` calls `appendRow(sheetId, tabName, [timestamp, name, phone, "shinjeong.vc"])`
- [ ] `app/actions/submit-lead-shinjeong.ts` reads `SHINJEONG_SHEET_ID` and `SHINJEONG_SHEET_TAB` from env
- [ ] `app/actions/submit-lead-shinjeong.ts` preserves `submitLeadShinjeong` function signature
- [ ] `app/actions/submit-lead-shinjeong.ts` preserves `getKoreanTimestamp()` function
- [ ] `app/actions/submit-lead-shinjeong.ts` has no references to `SHINJEONG_APPS_SCRIPT_URL` or `SHINJEONG_SECRET_TOKEN`
- [ ] `.env.local.example` contains `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY`
- [ ] `.env.local.example` contains `STOCKPLUS_SHEET_ID`, `STOCKPLUS_SHEET_TAB`
- [ ] `.env.local.example` contains `SHINJEONG_SHEET_ID`, `SHINJEONG_SHEET_TAB`
- [ ] `.env.local.example` does NOT contain `APPS_SCRIPT_URL`, `SECRET_TOKEN`, `SHINJEONG_APPS_SCRIPT_URL`, `SHINJEONG_SECRET_TOKEN`
- [ ] No remaining GAS env var references in any source files
- [ ] CTA component import paths (`@/app/actions/submit-lead`, `@/app/actions/submit-lead-shinjeong`) are unchanged

## Notes

- The `appendRow` function handles retries internally, so action files do not need retry logic.
- The `appendRow` function throws on failure, so the existing try/catch in action files will catch errors naturally.
- `submit-lead-shinjeong.ts` includes `"shinjeong.vc"` as a 4th column value; `submit-lead.ts` only passes 3 values.
