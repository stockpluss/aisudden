# Phase 1: Test Cases

## Test Coverage Target

>= 70% of functional requirements verified

## Build Verification

- [x] `npm run build` (or `pnpm build`) completes without errors
- [x] No TypeScript compilation errors after removing PerformanceSection import
- [x] No unused import warnings

## Unit Tests

### hero-section.tsx

- [x] FR-01: Headline first line reads "혼자 찾기 어려운 급등주,"
- [x] FR-01: Headline second line reads "실시간 알림으로 받아보세요"
- [x] FR-01: Gradient styling is preserved on second line span
- [x] FR-02: STATS constant no longer exists in file
- [x] FR-02: No stats rendering block (no `.map` over STATS) in file
- [x] FR-09: Inner content div has `py-4 lg:py-20` (not `py-10 lg:py-20`)

### stats-section.tsx

- [x] FR-04: Section heading reads "실제 포착 사례" (not "숫자로 증명하는 신뢰")
- [x] FR-05: Text "거래량 급증 + 상승 시그널 포착 후 알림 발송" present below image grid
- [x] FR-05: Text "포착 시점 이후 상승 흐름 확인" present below image grid

### site-footer.tsx

- [x] FR-03: "대표자: 김경덕" present (not "홍길동")
- [x] FR-03: "사업자등록번호: 261-03-03355" present (not "000-00-00000")
- [x] FR-06: Subtitle reads "실시간 급등주 포착 서비스 거래량, 언론이슈, 기업공시를 분석해 정보를 제공합니다"
- [x] FR-06: No period after "서비스" and no trailing period

### fixed-cta.tsx

- [x] FR-07: CTA heading reads "급등주 받아보기" (no "무료" span)
- [x] FR-07: Submit button text reads "급등주 받아보기" (not "무료 받기")

### app/shinjeong/page.tsx

- [x] FR-08: No import statement referencing `performance-section`
- [x] FR-08: No `<PerformanceSection />` JSX element in render

### File Deletion

- [x] FR-08: File `components/shinjeong/performance-section.tsx` does not exist

## Integration Tests

- [x] Page renders without runtime errors after all changes
- [x] Page component order is: HeroSection -> StatsSection -> FeaturesSection -> SiteFooter (no PerformanceSection)
- [x] ShinjeongFixedCTA renders at bottom as fixed element

## Edge Cases

- [ ] Mobile responsive: longer headline "혼자 찾기 어려운 급등주, / 실시간 알림으로 받아보세요" does not overflow or break layout on 320px-width screens (requires manual visual verification)
- [ ] Mobile responsive: "급등주 받아보기" button text fits within CTA bar without truncation (requires manual visual verification)
- [ ] After PerformanceSection removal: page scroll flow from FeaturesSection to SiteFooter is natural (no unexpected gap) (requires manual visual verification)
- [ ] Hero top spacing (FR-09): scroll cue ("Scroll" + arrow) is visible within the first mobile viewport (375px height ~667px) (requires manual visual verification)
- [ ] FR-05 description text below image grid is properly centered and visible on both mobile and desktop (requires manual visual verification)
