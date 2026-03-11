# PHASE 3: Test Plan - Middleware + Shinjeong

## Pre-Condition

All changes from PHASE_1, PHASE_2, and PHASE_3 are applied.

## Build Verification

- [ ] `pnpm build` completes without errors
- [ ] No "Module not found" errors for `@/components/shinjeong/*` imports
- [ ] No TypeScript errors in `submit-lead-shinjeong.ts`

## Middleware Routing Tests

### Localhost with `?site=` parameter

- [ ] `http://localhost:3000/` - shows dev index page (two links)
- [ ] `http://localhost:3000/?site=stockplus` - renders stockplus landing page
- [ ] `http://localhost:3000/?site=shinjeong` - renders shinjeong landing page
- [ ] `http://localhost:3000/?site=unknown` - returns 404

### Static assets bypass

- [ ] `http://localhost:3000/images/horizontal-logo.png` - serves image correctly
- [ ] `http://localhost:3000/_next/static/*` - serves Next.js bundles correctly
- [ ] `http://localhost:3000/logo_64.png` - serves favicon icon (if exists)

### Host-based routing (requires `/etc/hosts` modification)

Add to `/etc/hosts`: `127.0.0.1 stockplus.local shinjeong.local`

- [ ] `http://stockplus.local:3000/` - Note: this will NOT match `stockplus.im` in DOMAIN_MAP.
      To fully test host-based routing, either:
  - Temporarily add `"stockplus.local"` to DOMAIN_MAP, or
  - Use curl: `curl -H "Host: stockplus.im" http://localhost:3000/`

## Shinjeong Page Rendering

- [ ] Navigate to `http://localhost:3000/?site=shinjeong`
- [ ] HeroSection renders with:
  - "빠른 정보가 수익입니다" headline
  - AI signal panel with animated progress bars
  - Stats row (+47%, 85%, 24/7)
  - "Scroll" button at bottom
- [ ] StatsSection renders with 4 stat cards and counter animations
- [ ] FeaturesSection renders with 6 feature cards in grid
- [ ] PerformanceSection renders with 4 monthly records (table on desktop, cards on mobile)
- [ ] SiteFooter renders with brand, legal info, copyright
- [ ] ShinjeongFixedCTA bar renders fixed at bottom

## Shinjeong CTA Form

- [ ] Form shows: name input, phone input, privacy checkbox, submit button
- [ ] Validation: submit without name -> shows error "이름을 입력해주세요."
- [ ] Validation: submit with bad phone -> shows error about phone format
- [ ] Validation: submit without checkbox -> shows error about privacy consent
- [ ] With `SHINJEONG_APPS_SCRIPT_URL` and `SHINJEONG_SECRET_TOKEN` set:
  - Submit form -> data appears in shinjeong Google Sheet
  - Source field shows "shinjeong.vc"
- [ ] With `SHINJEONG_KAKAO_TEMPLATE_ID` empty or unset:
  - Server log shows: `[kakao] Template ID not provided, skipping alimtalk`
  - Form submission still succeeds
- [ ] Dismiss button (X) hides the CTA bar

## Regression Check

- [ ] Stockplus page (`?site=stockplus`) still works identically to Phase 2
- [ ] Stockplus CTA still submits to stockplus Sheet
- [ ] Stockplus GA conversion still fires
- [ ] Dev index page at `/` still shows both links
