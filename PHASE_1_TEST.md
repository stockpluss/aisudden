# PHASE 1: Test Plan - Restructure

## Pre-Condition

All changes from PHASE_1_PLAN_RESTRUCTURE.md are applied.

## Build Verification

- [ ] `pnpm build` completes without errors
  - Specifically watch for: "Module not found" errors from broken import paths
  - Check that no component still imports from `@/components/hero-section` (old path)

## Runtime Verification

- [ ] `pnpm dev` starts without console errors
- [ ] Navigate to `http://localhost:3000/` - shows dev index page with two links
- [ ] Navigate to `http://localhost:3000/stockplus` - renders the full stockplus landing page:
  - HeroSection visible at top
  - PerformanceSection visible
  - TrustSection visible
  - BenefitsSection visible
  - Footer visible at bottom
  - FixedCTA bar fixed at bottom of viewport
- [ ] CTA form submission still works at `/stockplus`:
  - Enter name and phone, submit
  - Google Sheet receives the data
  - Kakao alimtalk sends (if KAKAO_TEMPLATE_ID is set)
  - GA conversion tracking fires (check browser console for gtag calls)

## Import Path Verification

Manually confirm no stale imports remain:
- [ ] `components/stockplus/fixed-cta.tsx` imports `@/components/ui/button` (valid)
- [ ] `components/stockplus/fixed-cta.tsx` imports `@/app/actions/submit-lead` (valid)
- [ ] `components/stockplus/fixed-cta.tsx` imports `@/lib/utils` (valid - will change in Phase 2)
- [ ] `app/stockplus/page.tsx` imports from `@/components/stockplus/*` (valid)

## Regression Check

- [ ] No files remain in `components/` root that should have been moved (only `theme-provider.tsx` and `ui/` remain)
- [ ] `app/layout.tsx` has no GA `<Script>` tags
- [ ] `app/layout.tsx` has no stockplus-specific metadata (title, icons)
- [ ] `app/stockplus/layout.tsx` contains GA scripts and stockplus metadata

## Known Limitation

At this point, middleware does not exist yet, so host-based routing is not functional.
The stockplus page is only accessible via direct URL `/stockplus`. This is expected.
