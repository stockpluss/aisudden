# PHASE 2: Test Plan - Analytics + Kakao

## Pre-Condition

All changes from PHASE_1 and PHASE_2 are applied.

## Build Verification

- [ ] `pnpm build` completes without errors
- [ ] No TypeScript errors related to `gtagReportConversion` signature changes
- [ ] No TypeScript errors related to `sendKakaoMessage` signature changes

## Analytics Verification

- [ ] `lib/utils.ts` contains ONLY the `cn()` function (no `gtagReportConversion`)
- [ ] `lib/analytics.ts` exports `gtagReportConversion(site, name, phone)` and `getAnalyticsConfig(site)`
- [ ] Grep confirms no file imports `gtagReportConversion` from `@/lib/utils`
- [ ] `components/stockplus/fixed-cta.tsx` imports from `@/lib/analytics`
- [ ] On stockplus page, submit CTA form and verify in browser DevTools:
  - `gtag("set", "user_data", ...)` fires with correct name and +82 phone
  - `gtag("event", "conversion", { send_to: "AW-11246851271/atwMCPTj97waEMep9fIp" })` fires
  - `gtag("event", "conversion", { send_to: "AW-17780944854/mF1tCNr8m8wbENbfzp5C" })` fires

## Kakao Verification

- [ ] With `KAKAO_TEMPLATE_ID` set: stockplus CTA submission sends Kakao alimtalk normally
- [ ] Server logs show `[kakao] Starting kakao message with data:` followed by success
- [ ] Temporarily unset `KAKAO_TEMPLATE_ID` (empty string):
  - Submit stockplus CTA
  - Server logs show `[kakao] Template ID not provided, skipping alimtalk`
  - Google Sheet still receives the data
  - No error returned to the client
- [ ] Restore `KAKAO_TEMPLATE_ID` after test

## Regression Check

- [ ] All `components/ui/*.tsx` files still import `cn` from `@/lib/utils` without error
- [ ] Stockplus CTA form validation still works (empty name, bad phone format)
- [ ] Google Sheet submission is unaffected by Kakao changes
