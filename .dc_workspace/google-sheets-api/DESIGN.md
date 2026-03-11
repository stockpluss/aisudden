# Google Sheets API Direct Integration - Design Document

## Overview

Replace Google Apps Script (GAS) based Google Sheet writes with direct Google Sheets API calls from Next.js server actions. This eliminates per-domain GAS deployment overhead and centralizes Sheet access through a shared Service Account utility module.

**Target Version:** 2.0.0
**Complexity:** SIMPLE (2 sequential phases)
**Reference:** [SPEC.md](./SPEC.md)

---

## Global Context

### Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API Client | `googleapis` npm package | Typed Sheets API client with built-in auth |
| Auth Method | Service Account JWT | Server-to-server auth; credentials via env vars |
| Module Location | `lib/google-sheets.ts` | Follows project convention for shared utilities |
| Retry Strategy | Exponential backoff, max 3 attempts | Handles transient API errors and quota limits |
| Server Directive | `"use server"` in action files only | Lib module is plain utility, not a server action |
| Private Key Newlines | `.replace(/\\n/g, "\n")` | Env vars store literal `\n`; must convert for PEM |

### Environment Variables

**Shared (Service Account):**
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`

**Per Domain:**
- `STOCKPLUS_SHEET_ID`, `STOCKPLUS_SHEET_TAB`
- `SHINJEONG_SHEET_ID`, `SHINJEONG_SHEET_TAB`

**Removed:**
- `APPS_SCRIPT_URL`, `SECRET_TOKEN`
- `SHINJEONG_APPS_SCRIPT_URL`, `SHINJEONG_SECRET_TOKEN`

### File Structure

| File | Action | Phase |
|------|--------|-------|
| `lib/google-sheets.ts` | CREATE | 1 |
| `package.json` | MODIFY | 1 |
| `app/actions/submit-lead.ts` | MODIFY | 2 |
| `app/actions/submit-lead-shinjeong.ts` | MODIFY | 2 |
| `.env.local.example` | MODIFY | 2 |

### Row Data Format

- **Stockplus:** `[timestamp, name, phone]` (3 columns)
- **Shinjeong:** `[timestamp, name, phone, source]` (4 columns, source = `"shinjeong.vc"`)

---

## Phase 1: Create Google Sheets API Utility Module

### Objective

Create `lib/google-sheets.ts` with Service Account auth and `appendRow()` function. Install `googleapis` dependency.

### Plan

1. **Install `googleapis`** via npm
2. **Create `lib/google-sheets.ts`** with:
   - `getAuthClient()` (private): Creates `google.auth.JWT` from env vars, handles `GOOGLE_PRIVATE_KEY` newline conversion
   - `appendRow(sheetId, tabName, values)` (exported): Appends a row using `sheets.spreadsheets.values.append()` with `valueInputOption: "USER_ENTERED"`
   - Exponential backoff retry: max 3 attempts, retry on 429/500/503
   - Permission denied (403) error includes descriptive message with Service Account email

### Completion Checklist

- [ ] `googleapis` in `package.json` dependencies
- [ ] `lib/google-sheets.ts` created
- [ ] `getAuthClient()` validates env vars and converts private key newlines
- [ ] `appendRow()` exported with signature `(sheetId: string, tabName: string, values: string[]) => Promise<void>`
- [ ] Retry logic: max 3 attempts, exponential backoff, retries on 429/500/503
- [ ] 403 errors include descriptive message with SA email
- [ ] No `"use server"` in file
- [ ] Only `appendRow` exported

### Test Cases (Phase 1)

**Target coverage:** >= 70%. All tests mock `googleapis`.

#### Environment Validation
- [ ] TC-1.1: Missing `GOOGLE_SERVICE_ACCOUNT_EMAIL` throws descriptive error
- [ ] TC-1.2: Missing `GOOGLE_PRIVATE_KEY` throws descriptive error
- [ ] TC-1.3: Both env vars missing throws error
- [ ] TC-1.4: Private key newlines are converted from literal `\\n` to actual `\n`

#### appendRow
- [ ] TC-2.1: Successful append calls API with correct parameters
- [ ] TC-2.2: Sheets API created with `version: "v4"` and auth client

#### Retry Logic
- [ ] TC-3.1: Retries on 429 and succeeds on second attempt
- [ ] TC-3.2: Retries on 500 and succeeds
- [ ] TC-3.3: Retries on 503 and succeeds
- [ ] TC-3.4: Fails after 3 total attempts
- [ ] TC-3.5: No retry on 400 (immediate throw)
- [ ] TC-3.6: No retry on 401 (immediate throw)

#### Permission Denied
- [ ] TC-4.1: 403 error includes SA email in message
- [ ] TC-4.2: 403 error includes sheet ID in message

#### Edge Cases
- [ ] TC-5.1: Empty values array does not crash
- [ ] TC-5.2: Special characters in values passed through unchanged

---

## Phase 2: Replace GAS Calls and Update Env Config

### Objective

Replace GAS fetch calls in both action files with `appendRow()` calls. Update `.env.local.example`.

### Prerequisites

Phase 1 completed.

### Plan

1. **Modify `app/actions/submit-lead.ts`:**
   - Import `appendRow` from `@/lib/google-sheets`
   - Remove `fetch(APPS_SCRIPT_URL, ...)` and response handling
   - Read `STOCKPLUS_SHEET_ID` and `STOCKPLUS_SHEET_TAB` from env (validate)
   - Call `appendRow(sheetId, tabName, [timestamp, name, phone])`
   - Preserve: `"use server"`, function signature, Korean timestamp, Kakao sending, try/catch

2. **Modify `app/actions/submit-lead-shinjeong.ts`:**
   - Same pattern with `SHINJEONG_SHEET_ID`, `SHINJEONG_SHEET_TAB`
   - Row values: `[timestamp, name, phone, "shinjeong.vc"]` (4 columns)
   - Preserve: `getKoreanTimestamp()`, `SHINJEONG_KAKAO_TEMPLATE_ID`

3. **Update `.env.local.example`:**
   - Remove: `APPS_SCRIPT_URL`, `SECRET_TOKEN`, `SHINJEONG_APPS_SCRIPT_URL`, `SHINJEONG_SECRET_TOKEN`
   - Add: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `STOCKPLUS_SHEET_ID`, `STOCKPLUS_SHEET_TAB`, `SHINJEONG_SHEET_ID`, `SHINJEONG_SHEET_TAB`

4. **Verify:** No remaining GAS env var references in codebase

### Completion Checklist

- [ ] `submit-lead.ts` uses `appendRow` with `STOCKPLUS_SHEET_ID`/`STOCKPLUS_SHEET_TAB`
- [ ] `submit-lead.ts` passes `[timestamp, name, phone]` (3 values)
- [ ] `submit-lead.ts` preserves function signature and Kakao logic
- [ ] `submit-lead.ts` has no GAS references
- [ ] `submit-lead-shinjeong.ts` uses `appendRow` with `SHINJEONG_SHEET_ID`/`SHINJEONG_SHEET_TAB`
- [ ] `submit-lead-shinjeong.ts` passes `[timestamp, name, phone, "shinjeong.vc"]` (4 values)
- [ ] `submit-lead-shinjeong.ts` preserves function signature and Kakao logic
- [ ] `submit-lead-shinjeong.ts` has no GAS references
- [ ] `.env.local.example` updated with new vars, old vars removed
- [ ] No GAS env var references remain in source files
- [ ] CTA component imports unchanged

### Test Cases (Phase 2)

**Target coverage:** >= 70%. Mock `appendRow` and `sendKakaoMessage`.

#### submitLead
- [ ] TC-2.1: Successful submission returns `{ success: true }` and calls `appendRow` correctly
- [ ] TC-2.2: Row values are `[timestamp, name, phone]` (3 elements)
- [ ] TC-2.3: Timestamp uses Korean format
- [ ] TC-2.4: Kakao failure does not affect success result
- [ ] TC-2.5: Phone dashes removed for Kakao (`"010-1234-5678"` -> `"01012345678"`)
- [ ] TC-2.6: appendRow throw returns `{ success: false, error: "..." }`
- [ ] TC-2.7: Missing `STOCKPLUS_SHEET_ID` returns error
- [ ] TC-2.8: Missing `STOCKPLUS_SHEET_TAB` returns error

#### submitLeadShinjeong
- [ ] TC-3.1: Successful submission calls `appendRow` with shinjeong env vars
- [ ] TC-3.2: Row values include `"shinjeong.vc"` as 4th element
- [ ] TC-3.3: Uses `SHINJEONG_SHEET_ID`/`SHINJEONG_SHEET_TAB` (not stockplus)
- [ ] TC-3.4: Kakao failure does not affect result
- [ ] TC-3.5: Uses `SHINJEONG_KAKAO_TEMPLATE_ID`
- [ ] TC-3.6: appendRow throw returns `{ success: false, error: "..." }`
- [ ] TC-3.7: Missing `SHINJEONG_SHEET_ID` returns error

#### Codebase Verification
- [ ] CV-1: No `APPS_SCRIPT_URL` in source files
- [ ] CV-2: No `SECRET_TOKEN` in source files (excluding Solapi context)
- [ ] CV-3: No `SHINJEONG_APPS_SCRIPT_URL` in source files
- [ ] CV-4: No `SHINJEONG_SECRET_TOKEN` in source files
- [ ] CV-5: `.env.local.example` has all new vars, no old vars

#### Edge Cases
- [ ] TC-4.1: Function signatures unchanged (input and return types)
- [ ] TC-4.2: Empty name/phone still calls appendRow (validation is at form level)
