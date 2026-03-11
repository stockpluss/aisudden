# Phase 1: Test Cases

## Test Coverage Target

>= 70%

## Scope

Phase 1 creates `lib/google-sheets.ts`. Since this module interacts with external Google APIs, all tests must mock the `googleapis` package. No real API calls should be made.

## Test File

Create `lib/__tests__/google-sheets.test.ts` (or `lib/google-sheets.test.ts` depending on project test conventions).

## Unit Tests

### getAuthClient (tested indirectly through appendRow)

- [ ] **TC-1.1: Missing GOOGLE_SERVICE_ACCOUNT_EMAIL** - Call `appendRow()` with `GOOGLE_SERVICE_ACCOUNT_EMAIL` unset. Expect thrown error message to contain `"GOOGLE_SERVICE_ACCOUNT_EMAIL"`.
- [ ] **TC-1.2: Missing GOOGLE_PRIVATE_KEY** - Call `appendRow()` with `GOOGLE_PRIVATE_KEY` unset. Expect thrown error message to contain `"GOOGLE_PRIVATE_KEY"`.
- [ ] **TC-1.3: Both env vars missing** - Call `appendRow()` with both unset. Expect thrown error mentioning at least one missing variable.
- [ ] **TC-1.4: GOOGLE_PRIVATE_KEY newline conversion** - Set `GOOGLE_PRIVATE_KEY` to a string containing literal `\\n` sequences. Mock `google.auth.JWT` constructor. Verify the `key` argument passed to JWT has actual newline characters (`\n`), not the literal string `\\n`.

### appendRow

- [ ] **TC-2.1: Successful append** - Mock `sheets.spreadsheets.values.append` to resolve successfully. Call `appendRow("sheet-id", "Tab1", ["a", "b", "c"])`. Verify:
  - `append` was called with `spreadsheetId: "sheet-id"`, `range: "Tab1"`, `valueInputOption: "USER_ENTERED"`, `requestBody: { values: [["a", "b", "c"]] }`
  - Function resolves without error (returns `void`)
- [ ] **TC-2.2: Correct Sheets API parameters** - Verify `google.sheets()` is called with `version: "v4"` and the auth client.

### Retry Logic

- [ ] **TC-3.1: Retry on 429 (rate limit)** - Mock `append` to fail with `{ code: 429 }` on first call, then succeed on second. Verify `appendRow` resolves successfully and `append` was called exactly 2 times.
- [ ] **TC-3.2: Retry on 500 (server error)** - Mock `append` to fail with `{ code: 500 }` on first call, then succeed. Verify success after retry.
- [ ] **TC-3.3: Retry on 503 (service unavailable)** - Mock `append` to fail with `{ code: 503 }` on first call, then succeed. Verify success after retry.
- [ ] **TC-3.4: Max 3 attempts then fail** - Mock `append` to fail with `{ code: 429 }` on all 3 calls. Verify `appendRow` throws after 3 attempts total.
- [ ] **TC-3.5: No retry on 400 (client error)** - Mock `append` to fail with `{ code: 400 }`. Verify `appendRow` throws immediately without retry (`append` called exactly 1 time).
- [ ] **TC-3.6: No retry on 401 (unauthorized)** - Mock `append` to fail with `{ code: 401 }`. Verify immediate throw, no retry.

### Permission Denied Error Handling

- [ ] **TC-4.1: Error 403 includes descriptive message** - Mock `append` to fail with `{ code: 403 }`. Verify the thrown error message contains the Service Account email and mentions sharing the sheet.
- [ ] **TC-4.2: Permission error message includes sheet ID** - Verify the error message for 403 includes the `sheetId` argument that was passed to `appendRow`.

## Edge Cases

- [ ] **TC-5.1: Empty values array** - Call `appendRow("sheet-id", "Tab1", [])`. Verify it still calls `append` with `{ values: [[]] }` (no crash).
- [ ] **TC-5.2: Values with special characters** - Call with values containing commas, quotes, newlines. Verify they are passed through unchanged to the API.

## Notes

- All tests must mock `googleapis`. Use `jest.mock("googleapis")` or equivalent.
- Set and unset environment variables using `process.env` in `beforeEach`/`afterEach` to avoid test pollution.
- If the project does not yet have a test runner configured, the coder should set up Jest or Vitest before running these tests. Check `package.json` for existing test configuration first.
