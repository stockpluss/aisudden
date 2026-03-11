# Google Sheets API Direct Integration - Global Documentation

## Feature Overview

**Problem:** Each new domain/sheet requires a separate Google Apps Script (GAS) deployment, creating maintenance overhead. The current architecture couples authentication (SECRET_TOKEN) and endpoint (APPS_SCRIPT_URL) per domain.

**Solution:** Replace GAS-based Google Sheet writes with direct Google Sheets API calls from Next.js server actions using a shared Service Account. A single utility module (`lib/google-sheets.ts`) centralizes auth and retry logic, while each domain's action file calls `appendRow()` with its own Sheet ID and tab name from environment variables.

**Target Version:** 2.0.0

## Architecture Decision

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API Client | `googleapis` npm package | Typed Sheets API client with built-in auth; well-maintained by Google |
| Auth Method | Service Account JWT | Server-to-server auth without user interaction; credentials via env vars |
| Module Location | `lib/google-sheets.ts` | Follows existing project convention (`lib/` for shared utilities) |
| Retry Strategy | Exponential backoff, max 3 attempts | Handles transient API errors and quota limits gracefully |
| `"use server"` Directive | Action files only, NOT in lib module | Lib module is a plain utility; only action files need the server directive |
| Private Key Newlines | `.replace(/\\n/g, "\n")` on `GOOGLE_PRIVATE_KEY` | Environment variables store literal `\n`; must convert to actual newlines for PEM parsing |

## Data Model

### Row Format per Domain

**Stockplus** (`submit-lead.ts`):
```
[timestamp, name, phone]
```

**Shinjeong** (`submit-lead-shinjeong.ts`):
```
[timestamp, name, phone, source]
```

- `timestamp`: Korean time formatted via `Intl.DateTimeFormat` with `Asia/Seoul` timezone
- `source`: hardcoded string `"shinjeong.vc"` in shinjeong action

### Environment Variables

**Shared (Service Account):**
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Service Account email address
- `GOOGLE_PRIVATE_KEY` - PEM-encoded private key (with literal `\n` in env)

**Per Domain:**
- `{DOMAIN}_SHEET_ID` - Google Spreadsheet ID
- `{DOMAIN}_SHEET_TAB` - Target tab/sheet name within the spreadsheet

Current domains: `STOCKPLUS`, `SHINJEONG`

## Phase Overview

| Phase | Description | Status | Dependencies |
|-------|-------------|--------|--------------|
| 1 | Create Google Sheets API utility module (`lib/google-sheets.ts`) and install `googleapis` | Not Started | None |
| 2 | Replace GAS calls in action files and update `.env.local.example` | Not Started | Phase 1 |

## File Structure

| File | Action | Phase | Description |
|------|--------|-------|-------------|
| `lib/google-sheets.ts` | CREATE | 1 | Shared Google Sheets API client with Service Account auth, `appendRow()`, retry logic |
| `package.json` | MODIFY | 1 | Add `googleapis` to dependencies |
| `app/actions/submit-lead.ts` | MODIFY | 2 | Replace GAS fetch with `appendRow()` call; read `STOCKPLUS_SHEET_ID`, `STOCKPLUS_SHEET_TAB` |
| `app/actions/submit-lead-shinjeong.ts` | MODIFY | 2 | Replace GAS fetch with `appendRow()` call; read `SHINJEONG_SHEET_ID`, `SHINJEONG_SHEET_TAB` |
| `.env.local.example` | MODIFY | 2 | Remove GAS env vars, add Google Sheets API env vars |

## Unchanged Files (verify no breakage)

- `components/stockplus/fixed-cta.tsx` - imports `submitLead` from `@/app/actions/submit-lead`
- `components/shinjeong/fixed-cta.tsx` - imports `submitLeadShinjeong` from `@/app/actions/submit-lead-shinjeong`
- `app/actions/send-kakao-message.ts` - called after Sheet write; no changes needed
