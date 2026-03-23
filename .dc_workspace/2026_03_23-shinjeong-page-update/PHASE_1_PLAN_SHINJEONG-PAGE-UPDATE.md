# Phase 1: Shinjeong Page Update

## Objective

Update the Shinjeong landing page content: remove AI-related text, replace the stats section with static images, and change the brand name from "StockPlus" to "Shinjeong Investment Group."

## Prerequisites

- None (single phase, no prior dependencies)
- Source images `sj_gr_01.jpg` through `sj_gr_04.jpg` exist at `/home/ulismoon/Documents/stockpluss/aisudden/`

## Instructions

### Step 1: Copy Image Assets

1. Create directory `public/images/shinjeong/`
2. Copy files `sj_gr_01.jpg`, `sj_gr_02.jpg`, `sj_gr_03.jpg`, `sj_gr_04.jpg` from `/home/ulismoon/Documents/stockpluss/aisudden/` to the worktree `public/images/shinjeong/`

### Step 2: FR-1 - Remove AI Text

#### 2a. `app/shinjeong/layout.tsx`
- Line 4: Remove "AI" from the title metadata string. The title should read the same but without "AI".
- Line 6: Remove "AI가" from the description metadata string. Adjust spacing so the sentence reads naturally.

#### 2b. `components/shinjeong/hero-section.tsx`
- Line 44: Change `"AI 분석 진행 중"` to `"분석 진행 중"`
- Line 171: Change `"AI 실시간 시장 분석 중"` to `"실시간 시장 분석 중"`
- Line 201: Change `"AI가 24시간"` to `"24시간"`

#### 2c. `components/shinjeong/features-section.tsx`
- Line 8: Change `"AI가 24시간 실시간으로 분석합니다"` to `"24시간 실시간으로 분석합니다"`

### Step 3: FR-2 - Rewrite Stats Section

Fully rewrite `components/shinjeong/stats-section.tsx`:

**Remove entirely:**
- `"use client"` directive
- `StatItem` interface
- `Counter` component (with useState, useEffect, IntersectionObserver logic)
- `STATS` constant array

**New implementation:**
- Import `Image` from `next/image`
- Preserve the existing section header text ("검증된 실적") and the transparency/disclaimer notice at the bottom of the section
- Render 4 images in a responsive grid:
  - `/images/shinjeong/sj_gr_01.jpg`
  - `/images/shinjeong/sj_gr_02.jpg`
  - `/images/shinjeong/sj_gr_03.jpg`
  - `/images/shinjeong/sj_gr_04.jpg`
- Desktop layout: `grid-cols-2` (2x2 grid)
- Mobile layout: `grid-cols-1` (single column, 4 rows)
- Each `Image` must have meaningful Korean alt text describing the stat graphic
- The component must NOT have `"use client"` since it no longer uses any client-side hooks or state

### Step 4: FR-3 - Brand Name Change

#### 4a. `components/shinjeong/site-footer.tsx`
- Line 14: Change `"스탁플러스"` to `"신정투자그룹"`
- Line 40: Change `"© 2026 스탁플러스"` to `"© 2026 신정투자그룹"`

#### 4b. `components/shinjeong/fixed-cta.tsx`
- Line 178: Change `"스탁플러스"` to `"신정투자그룹"`

### Step 5: Verification

1. Run `pnpm build` and confirm it succeeds without errors
2. Grep all files under `components/shinjeong/` and `app/shinjeong/` for `"스탁플러스"` -- expect zero matches
3. Confirm images are accessible at `/images/shinjeong/sj_gr_0{1-4}.jpg`
4. Visually verify responsive layout if possible (2x2 desktop, 1x4 mobile)

## Completion Checklist

### FR-1: AI Text Removal
- [x] `layout.tsx` line 4: "AI" removed from title — Verified in `app/shinjeong/layout.tsx:4`
- [x] `layout.tsx` line 6: "AI가" removed from description — Verified in `app/shinjeong/layout.tsx:6`
- [x] `hero-section.tsx` line 44: "AI 분석 진행 중" -> "분석 진행 중" — Verified in `components/shinjeong/hero-section.tsx:44`
- [x] `hero-section.tsx` line 171: "AI 실시간 시장 분석 중" -> "실시간 시장 분석 중" — Verified in `components/shinjeong/hero-section.tsx:171`
- [x] `hero-section.tsx` line 201: "AI가 24시간" -> "24시간" — Verified in `components/shinjeong/hero-section.tsx:201`
- [x] `features-section.tsx` line 8: "AI가 24시간 실시간으로 분석합니다" -> "24시간 실시간으로 분석합니다" — Verified in `components/shinjeong/features-section.tsx:8`

### FR-2: Stats Section Image Replacement
- [x] `public/images/shinjeong/` directory created
- [x] `sj_gr_01.jpg` through `sj_gr_04.jpg` copied to `public/images/shinjeong/` (all 4 files non-empty)
- [x] `stats-section.tsx` rewritten: "use client" removed — no "use client" directive present
- [x] `stats-section.tsx` rewritten: StatItem, Counter, STATS removed — none present
- [x] `stats-section.tsx` rewritten: Image import from next/image added — Verified in `components/shinjeong/stats-section.tsx:1`
- [x] `stats-section.tsx` rewritten: 4 images in responsive grid (grid-cols-2 desktop, grid-cols-1 mobile) — Verified in `components/shinjeong/stats-section.tsx:26`
- [x] `stats-section.tsx` rewritten: meaningful alt text on each image — Verified in `components/shinjeong/stats-section.tsx:4-7`
- [x] `stats-section.tsx` rewritten: section header and transparency notice preserved — Verified in `components/shinjeong/stats-section.tsx:16,44-48`

### FR-3: Brand Name Change
- [x] `site-footer.tsx` line 14: "스탁플러스" -> "신정투자그룹" — Verified in `components/shinjeong/site-footer.tsx:14`
- [x] `site-footer.tsx` line 40: "© 2026 스탁플러스" -> "© 2026 신정투자그룹" — Verified in `components/shinjeong/site-footer.tsx:40`
- [x] `fixed-cta.tsx` line 178: "스탁플러스" -> "신정투자그룹" — Verified in `components/shinjeong/fixed-cta.tsx:178`

### Verification
- [x] `pnpm build` succeeds without errors — Build compiled successfully
- [x] No references to "스탁플러스" remain in shinjeong components — Grep returned zero matches
- [x] AI-related text properly removed/modified in all specified locations
- [x] Images load correctly at `/images/shinjeong/sj_gr_0{1-4}.jpg` — All 4 files exist and are non-empty
- [x] Responsive layout: 2x2 on desktop, 1x4 on mobile — grid-cols-1 / md:grid-cols-2 confirmed

## Notes

- The source images are located in the **main repo root** (`/home/ulismoon/Documents/stockpluss/aisudden/`), not in the worktree. They must be copied into the worktree's `public/images/shinjeong/` directory.
- `stats-section.tsx` is the only file that requires a full rewrite. All other files are simple text substitutions.
- After removing "use client", ensure no client-side imports (useState, useEffect, etc.) remain in stats-section.tsx.
