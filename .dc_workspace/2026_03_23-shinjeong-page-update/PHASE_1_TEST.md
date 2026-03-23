# Phase 1: Test Cases

## Test Coverage Target

>= 70% of functional requirements verified via build validation and content checks.

Note: This project involves content/text edits and static image rendering. There are no unit-testable logic changes. Testing focuses on build validation, content verification, and asset checks.

## Build Validation

- [x] `pnpm build` completes successfully with exit code 0
- [x] No TypeScript compilation errors
- [x] No missing import errors in `stats-section.tsx` after rewrite

## Content Verification Tests

### FR-1: AI Text Removal

- [x] Grep `app/shinjeong/layout.tsx` for the exact string `"AI"` in metadata fields -- expect it is no longer present in title or description
- [x] Grep `components/shinjeong/hero-section.tsx` for `"AI "` (with trailing space) -- expect zero matches
- [x] Grep `components/shinjeong/hero-section.tsx` for `"AI가"` -- expect zero matches
- [x] Grep `components/shinjeong/features-section.tsx` for `"AI가"` -- expect zero matches
- [x] Verify `hero-section.tsx` contains the string `"분석 진행 중"` (without "AI" prefix)
- [x] Verify `hero-section.tsx` contains the string `"실시간 시장 분석 중"` (without "AI" prefix)
- [x] Verify `hero-section.tsx` contains the string `"24시간"` without preceding `"AI가"`
- [x] Verify `features-section.tsx` contains `"24시간 실시간으로 분석합니다"`

### FR-2: Stats Section Image Replacement

- [x] `components/shinjeong/stats-section.tsx` does NOT contain `"use client"`
- [x] `components/shinjeong/stats-section.tsx` does NOT contain `useState`
- [x] `components/shinjeong/stats-section.tsx` does NOT contain `useEffect`
- [x] `components/shinjeong/stats-section.tsx` does NOT contain `IntersectionObserver`
- [x] `components/shinjeong/stats-section.tsx` contains `import Image from "next/image"` (or equivalent)
- [x] `components/shinjeong/stats-section.tsx` references all 4 image paths: `sj_gr_01.jpg`, `sj_gr_02.jpg`, `sj_gr_03.jpg`, `sj_gr_04.jpg`
- [x] `components/shinjeong/stats-section.tsx` contains `grid-cols-2` for desktop layout
- [x] `components/shinjeong/stats-section.tsx` contains `grid-cols-1` for mobile layout
- [x] Each Image element has a non-empty `alt` attribute
- [x] Section header text "검증된 실적" is preserved in the component

### FR-3: Brand Name Change

- [x] Grep all files under `app/shinjeong/` and `components/shinjeong/` for `"스탁플러스"` -- expect zero matches
- [x] `components/shinjeong/site-footer.tsx` contains `"신정투자그룹"` (at least 2 occurrences)
- [x] `components/shinjeong/fixed-cta.tsx` contains `"신정투자그룹"`

## Asset Verification

- [x] File exists: `public/images/shinjeong/sj_gr_01.jpg`
- [x] File exists: `public/images/shinjeong/sj_gr_02.jpg`
- [x] File exists: `public/images/shinjeong/sj_gr_03.jpg`
- [x] File exists: `public/images/shinjeong/sj_gr_04.jpg`
- [x] All 4 image files are non-empty (file size > 0 bytes)

## Edge Cases

- [x] No other components outside `app/shinjeong/` and `components/shinjeong/` were modified
- [x] `stockplus.im` related files remain untouched (spot check `components/stockplus.im/` for no changes)
- [x] The transparency/disclaimer notice at the bottom of stats-section.tsx is preserved after rewrite
