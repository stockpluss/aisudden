# Phase 2: Test Cases

## Test Coverage Target

>= 70%

## Scope

Phase 2 modifies `app/actions/submit-lead.ts` and `app/actions/submit-lead-shinjeong.ts`. Tests must mock `appendRow` from `lib/google-sheets` and `sendKakaoMessage` from `app/actions/send-kakao-message`.

## Test Files

- `app/actions/__tests__/submit-lead.test.ts`
- `app/actions/__tests__/submit-lead-shinjeong.test.ts`

## Unit Tests

### submit-lead.ts (submitLead)

#### Happy Path
- [ ] **TC-2.1: Successful submission** - Mock `appendRow` to resolve, mock `sendKakaoMessage` to return `{ success: true }`. Call `submitLead({ name: "John", phone: "010-1234-5678" })`. Verify:
  - Returns `{ success: true }`
  - `appendRow` was called with `(STOCKPLUS_SHEET_ID, STOCKPLUS_SHEET_TAB, [timestamp, "John", "010-1234-5678"])`
  - `sendKakaoMessage` was called with `{ to: "01012345678", name: "John", templateId: KAKAO_TEMPLATE_ID }`

- [ ] **TC-2.2: Row values format** - Verify `appendRow` receives exactly 3 values in the array: `[timestamp, name, phone]`.

- [ ] **TC-2.3: Timestamp is Korean format** - Verify the first element passed to `appendRow` matches the Korean timestamp format (contains Korean date separators or Asia/Seoul timezone output).

#### Kakao Integration
- [ ] **TC-2.4: Kakao failure does not affect result** - Mock `appendRow` to resolve, mock `sendKakaoMessage` to return `{ success: false, error: "kakao error" }`. Verify `submitLead` still returns `{ success: true }`.

- [ ] **TC-2.5: Phone number dash removal for Kakao** - Call with `phone: "010-1234-5678"`. Verify `sendKakaoMessage` receives `to: "01012345678"` (dashes removed).

#### Error Handling
- [ ] **TC-2.6: appendRow throws** - Mock `appendRow` to throw `new Error("Sheet write failed")`. Verify `submitLead` returns `{ success: false, error: "Sheet write failed" }`.

- [ ] **TC-2.7: Missing STOCKPLUS_SHEET_ID** - Unset `STOCKPLUS_SHEET_ID` env var. Call `submitLead`. Verify returns `{ success: false }` with error message mentioning the missing variable.

- [ ] **TC-2.8: Missing STOCKPLUS_SHEET_TAB** - Unset `STOCKPLUS_SHEET_TAB` env var. Call `submitLead`. Verify returns `{ success: false }` with error message.

### submit-lead-shinjeong.ts (submitLeadShinjeong)

#### Happy Path
- [ ] **TC-3.1: Successful submission** - Mock `appendRow` to resolve, mock `sendKakaoMessage` to return `{ success: true }`. Call `submitLeadShinjeong({ name: "Jane", phone: "010-9876-5432" })`. Verify:
  - Returns `{ success: true }`
  - `appendRow` was called with `(SHINJEONG_SHEET_ID, SHINJEONG_SHEET_TAB, [timestamp, "Jane", "010-9876-5432", "shinjeong.vc"])`

- [ ] **TC-3.2: Row values include source field** - Verify `appendRow` receives exactly 4 values: `[timestamp, name, phone, "shinjeong.vc"]`. The 4th element must be the string `"shinjeong.vc"`.

- [ ] **TC-3.3: Uses SHINJEONG env vars** - Verify `appendRow` is called with `SHINJEONG_SHEET_ID` and `SHINJEONG_SHEET_TAB` (not STOCKPLUS variants).

#### Kakao Integration
- [ ] **TC-3.4: Kakao failure does not affect result** - Same pattern as TC-2.4 but for shinjeong. Verify `submitLeadShinjeong` returns `{ success: true }` even when Kakao fails.

- [ ] **TC-3.5: Uses SHINJEONG_KAKAO_TEMPLATE_ID** - Verify `sendKakaoMessage` is called with `templateId: process.env.SHINJEONG_KAKAO_TEMPLATE_ID`.

#### Error Handling
- [ ] **TC-3.6: appendRow throws** - Mock `appendRow` to throw. Verify returns `{ success: false, error: "..." }`.

- [ ] **TC-3.7: Missing SHINJEONG_SHEET_ID** - Verify appropriate error when env var is missing.

## Integration Tests (Manual Verification)

These cannot be automated without real Google credentials but should be verified manually:

- [ ] **IT-1:** Submit form on Stockplus landing page; verify row appears in Stockplus Google Sheet
- [ ] **IT-2:** Submit form on Shinjeong landing page; verify row appears in Shinjeong Google Sheet with source column
- [ ] **IT-3:** Verify Kakao alimtalk is sent after successful sheet write
- [ ] **IT-4:** Verify CTA components work without any code changes

## Codebase Verification (Non-test Checks)

- [ ] **CV-1:** Search codebase for `APPS_SCRIPT_URL` - should return 0 matches in source files
- [ ] **CV-2:** Search codebase for `SECRET_TOKEN` - should return 0 matches in source files (excluding Solapi keys)
- [ ] **CV-3:** Search codebase for `SHINJEONG_APPS_SCRIPT_URL` - should return 0 matches
- [ ] **CV-4:** Search codebase for `SHINJEONG_SECRET_TOKEN` - should return 0 matches
- [ ] **CV-5:** `.env.local.example` contains all new env vars and none of the old GAS vars

## Edge Cases

- [ ] **TC-4.1: Function signature unchanged** - Verify `submitLead` accepts `{ name: string, phone: string }` and returns `Promise<{ success: boolean, error?: string }>`. Same for `submitLeadShinjeong`.
- [ ] **TC-4.2: Empty name or phone** - Call `submitLead({ name: "", phone: "" })`. Verify it still calls `appendRow` (validation is done at the form level, not in the action).

## Notes

- Mock `appendRow` using `jest.mock("@/lib/google-sheets")` or equivalent.
- Mock `sendKakaoMessage` using `jest.mock("./send-kakao-message")` or equivalent.
- Set test env vars (`STOCKPLUS_SHEET_ID`, etc.) in `beforeEach` and clean up in `afterEach`.
- The `"use server"` directive may cause issues in test environments. If so, the test file may need to handle module resolution accordingly.
