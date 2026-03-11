# PHASE 4: Test Plan - Environment + CSS

## Pre-Condition

All changes from PHASE_1 through PHASE_4 are applied.

## Build Verification

- [ ] `pnpm build` completes without errors
- [ ] No CSS parsing errors in build output

## CSS Animation Verification

- [ ] Navigate to `http://localhost:3000/?site=shinjeong`
- [ ] Hero section: scan-line animation visible (horizontal line moving down through the signal panel)
- [ ] Signal panel progress bars animate from 0% to target width on scroll/mount
- [ ] No CSS animation conflicts visible on stockplus page (`?site=stockplus`):
  - Float animation still works on stockplus page elements
  - Pulse-glow animation still works

## Environment Variable Verification

- [ ] `.env.local.example` contains all 3 shinjeong vars:
  - `SHINJEONG_APPS_SCRIPT_URL`
  - `SHINJEONG_SECRET_TOKEN`
  - `SHINJEONG_KAKAO_TEMPLATE_ID`
- [ ] `.env.local.example` still contains all original stockplus/shared vars (unchanged)

## Full Integration Test (End-to-End)

### Stockplus flow
- [ ] `localhost:3000/?site=stockplus` shows stockplus landing
- [ ] Submit CTA with valid name + phone
- [ ] Data appears in stockplus Google Sheet
- [ ] Kakao alimtalk sends (with KAKAO_TEMPLATE_ID set)
- [ ] GA conversion events fire in browser

### Shinjeong flow
- [ ] `localhost:3000/?site=shinjeong` shows shinjeong landing
- [ ] Submit CTA with valid name + phone
- [ ] Data appears in shinjeong Google Sheet (requires SHINJEONG_APPS_SCRIPT_URL)
- [ ] Kakao alimtalk skipped (with SHINJEONG_KAKAO_TEMPLATE_ID empty)
- [ ] No GA errors in console (shinjeong has empty GA config, should silently skip)

### Edge cases
- [ ] `localhost:3000/` shows dev index page
- [ ] `localhost:3000/?site=unknown` returns 404
- [ ] Submitting shinjeong CTA without SHINJEONG_APPS_SCRIPT_URL returns error gracefully

## Final Checklist

All items from GLOBAL.md validation checklist should pass:
- [ ] `pnpm dev` starts without errors
- [ ] `localhost:3000` shows dev index page
- [ ] `localhost:3000/?site=stockplus` renders stockplus landing
- [ ] `localhost:3000/?site=shinjeong` renders shinjeong landing
- [ ] Stockplus CTA submission works (Sheet + Kakao)
- [ ] Shinjeong CTA submission works (Sheet, Kakao skipped if no templateId)
- [ ] `pnpm build` succeeds
