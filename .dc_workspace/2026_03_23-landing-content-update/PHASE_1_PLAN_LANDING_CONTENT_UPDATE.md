# Phase 1: Landing Content Update

## Objective

Update all text content, remove unused sections, and adjust hero layout spacing across the shinjeong landing page.

## Prerequisites

- None (first and only phase)

## Instructions

### FR-01: Hero Headline Text Change

**File**: `components/shinjeong/hero-section.tsx` (lines 176-191)

Replace the headline content inside the `<h1>` tag:
- Change the first `<span>` text from `빠른 정보가` to `혼자 찾기 어려운 급등주,`
- Change the second `<span>` text (the one with gradient styling) from `수익입니다` to `실시간 알림으로 받아보세요`
- Keep the gradient styling (`linear-gradient(135deg, oklch(0.62 0.22 255), oklch(0.78 0.15 200))`) on the second line as-is
- Keep the `<br />` between the two spans

### FR-02: Remove STATS Array and Rendering Block

**File**: `components/shinjeong/hero-section.tsx`

1. Delete the STATS constant definition (lines 11-15):
   ```
   const STATS = [
     { value: "+47%", label: "월 평균 수익률" },
     { value: "85%", label: "최근 승률" },
     { value: "24/7", label: "실시간 분석" },
   ]
   ```
2. Delete the stats rendering block (lines 220-232):
   ```
   <div className="flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-8 pt-1 w-full">
     {STATS.map((s, i) => (
       ...
     ))}
   </div>
   ```

### FR-03: Update Footer Business Information

**File**: `components/shinjeong/site-footer.tsx` (line 36-37)

In the bottom row `<div>`, update:
- Change `대표자: 홍길동` to `대표자: 김경덕`
- Change `사업자등록번호: 000-00-00000` to `사업자등록번호: 261-03-03355`

### FR-04: Change Stats Section Heading

**File**: `components/shinjeong/stats-section.tsx` (line 19)

Change the `<h2>` text from `숫자로 증명하는 신뢰` to `실제 포착 사례`.

### FR-05: Add Description Text Below Image Grid

**File**: `components/shinjeong/stats-section.tsx`

After the closing `</div>` of the image grid (after line 38), add a descriptive text block:
- Add a `<div>` with centered text styling and top margin (`mt-8 text-center`)
- First line (primary text, slightly larger/bolder): `거래량 급증 + 상승 시그널 포착 후 알림 발송`
- Second line (secondary/muted text): `포착 시점 이후 상승 흐름 확인`
- Use existing text styling patterns: `text-sm md:text-base font-semibold text-foreground` for the first line, `text-sm text-muted-foreground` for the second line

Sample code for the new block (insert after the grid `</div>` closing tag on line 38, before the parent `</div>` on line 40):
```tsx
        <div className="mt-8 text-center">
          <p className="text-sm md:text-base font-semibold text-foreground">
            거래량 급증 + 상승 시그널 포착 후 알림 발송
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            포착 시점 이후 상승 흐름 확인
          </p>
        </div>
```

### FR-06: Update Footer Subtitle

**File**: `components/shinjeong/site-footer.tsx` (lines 16-17)

Change the `<p>` subtitle text:
- From: `실시간 급등주 포착 서비스. 거래량, 언론이슈, 기업공시를 분석해 투자 기회를 제공합니다.`
- To: `실시간 급등주 포착 서비스 거래량, 언론이슈, 기업공시를 분석해 정보를 제공합니다`
- Note: Remove the period after `서비스`, change `투자 기회를` to `정보를`, remove trailing period.

### FR-07: Change CTA Button and Heading Text

**File**: `components/shinjeong/fixed-cta.tsx`

1. Line 101: Change the heading from:
   ```
   급등주<span className="text-primary"> 무료</span> 받기
   ```
   To:
   ```
   급등주 받아보기
   ```
   (Remove the `<span>` wrapper entirely; use plain text)

2. Line 134: Change the button text from `"무료 받기"` to `"급등주 받아보기"` in the ternary expression:
   ```
   {isSubmitting ? "전송중..." : "급등주 받아보기"}
   ```

### FR-08: Remove PerformanceSection

**File**: `app/shinjeong/page.tsx`

1. Delete the import statement on line 4:
   ```
   import { PerformanceSection } from "@/components/shinjeong/performance-section"
   ```
2. Delete the usage on line 15:
   ```
   <PerformanceSection />
   ```

**File**: `components/shinjeong/performance-section.tsx`

3. Delete this file entirely.

### FR-09: Reduce Hero Top Padding on Mobile

**File**: `components/shinjeong/hero-section.tsx` (line 160)

Change the padding class on the inner content wrapper `<div>`:
- From: `py-10 lg:py-20`
- To: `py-4 lg:py-20`

This reduces mobile top/bottom padding from 2.5rem to 1rem, ensuring the scroll cue is visible in the first mobile viewport.

## Completion Checklist

- [x] FR-01: Hero headline changed to "혼자 찾기 어려운 급등주, / 실시간 알림으로 받아보세요" — Verified in hero-section.tsx:172,184
- [x] FR-02: STATS array and stats rendering block deleted — Verified: no STATS constant in hero-section.tsx
- [x] FR-03: Footer business info updated (대표자: 김경덕, 사업자등록번호: 261-03-03355) — Verified in site-footer.tsx:36-37
- [x] FR-04: Stats section heading changed to "실제 포착 사례" — Verified in stats-section.tsx:19
- [x] FR-05: Description text added below image grid — Verified in stats-section.tsx:40-47
- [x] FR-06: Footer subtitle updated (period removed, "투자 기회를" -> "정보를", trailing period removed) — Verified in site-footer.tsx:17
- [x] FR-07: CTA button text changed to "급등주 받아보기" (both heading and button) — Verified in fixed-cta.tsx:101,134
- [x] FR-08: PerformanceSection removed from page.tsx; performance-section.tsx file deleted — Verified: no import in page.tsx, file does not exist
- [x] FR-09: Hero mobile padding reduced from py-10 to py-4 — Verified in hero-section.tsx:154
- [x] Visual verification: build succeeds, no TypeScript errors, layout structure intact

## Notes

- All changes are independent text/layout edits. They can be applied in any order.
- The gradient styling on the hero headline second line must be preserved exactly as-is.
- After deleting performance-section.tsx, verify no other file imports it (only page.tsx does).
- The longer headline text ("혼자 찾기 어려운 급등주, / 실시간 알림으로 받아보세요") should be visually verified on mobile to ensure it does not overflow or break the layout.
