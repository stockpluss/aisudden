# Phase 1: Create Google Sheets API Utility Module

## Objective

Create a shared utility module `lib/google-sheets.ts` that provides Google Sheets API access via Service Account authentication, and install the `googleapis` dependency.

## Prerequisites

- None (first phase)

## Instructions

### Step 1: Install googleapis package

Run `npm install googleapis` to add it to `package.json` dependencies. Verify it appears in `package.json` under `dependencies`.

### Step 2: Create `lib/google-sheets.ts`

Create the file `lib/google-sheets.ts` with the following components:

#### 2a: Auth Client Factory

Create a `getAuthClient()` function (not exported) that:
- Reads `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` from `process.env`
- Validates both variables exist; if missing, throw an Error with a message naming the missing variable(s): `"Missing environment variable: GOOGLE_SERVICE_ACCOUNT_EMAIL"` or similar
- Converts `GOOGLE_PRIVATE_KEY` newlines: `.replace(/\\n/g, "\n")`
- Creates and returns a `google.auth.JWT` instance with:
  - `email`: the service account email
  - `key`: the converted private key
  - `scopes`: `["https://www.googleapis.com/auth/spreadsheets"]`

#### 2b: appendRow Function

Export an async function with this signature:

```typescript
export async function appendRow(
  sheetId: string,
  tabName: string,
  values: string[]
): Promise<void>
```

Implementation:
1. Call `getAuthClient()` to obtain the JWT client
2. Create a Sheets API client: `google.sheets({ version: "v4", auth })`
3. Call `sheets.spreadsheets.values.append()` with:
   - `spreadsheetId`: `sheetId`
   - `range`: `tabName` (the API auto-appends to the next empty row)
   - `valueInputOption`: `"USER_ENTERED"`
   - `requestBody`: `{ values: [values] }`
4. Wrap the call in retry logic (see Step 2c)

#### 2c: Exponential Backoff Retry

Implement retry logic around the `sheets.spreadsheets.values.append()` call:
- Maximum 3 attempts total (initial + 2 retries)
- Backoff delays: 1s, 2s (double each time)
- Retry only on errors where `error.code` is `429` (rate limit) or `500`/`503` (server errors)
- On non-retryable errors, throw immediately
- On final retry failure, throw the last error

#### 2d: Permission Denied Error Handling

After exhausting retries (or on a non-retryable error), check if the error indicates a permission issue (HTTP 403 or error message containing "permission" or "forbidden"). If so, enhance the error message:

```
`Permission denied for sheet "${sheetId}". Ensure the sheet is shared with the Service Account: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`
```

### Important Constraints

- Do NOT add `"use server"` to this file. It is a plain utility module, not a server action.
- Do NOT export `getAuthClient()`. Only `appendRow` should be exported.
- Use `import { google } from "googleapis"` (named import).

## Completion Checklist

- [ ] `googleapis` package is installed and listed in `package.json` dependencies
- [ ] `lib/google-sheets.ts` file exists
- [ ] `getAuthClient()` reads and validates `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY`
- [ ] `GOOGLE_PRIVATE_KEY` newline conversion is applied (`.replace(/\\n/g, "\n")`)
- [ ] `appendRow(sheetId, tabName, values)` is exported with correct signature
- [ ] `appendRow` uses `sheets.spreadsheets.values.append()` with `valueInputOption: "USER_ENTERED"`
- [ ] Exponential backoff retry implemented: max 3 attempts, retries on 429/500/503
- [ ] Permission denied errors include descriptive message with Service Account email
- [ ] No `"use server"` directive in the file
- [ ] Only `appendRow` is exported (not `getAuthClient`)

## Notes

- The `google.auth.JWT` constructor accepts `email`, `key`, and `scopes` as constructor arguments. Do not use `keyFile` (we use env vars, not files).
- `range` parameter for `values.append()` can simply be the tab name (e.g., `"Sheet1"`). The API will find the next available row automatically.
- The `googleapis` package is large but tree-shaking is not a concern here since this runs server-side only.
