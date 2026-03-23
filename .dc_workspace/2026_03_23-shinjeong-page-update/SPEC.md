<!-- dotclaude-config
working_directory: .dc_workspace
base_branch: main
language: ko_KR
worktree_path: ../aisudden-feature-shinjeong-page-update
doc_dir: 2026_03_23-shinjeong-page-update
-->

# shinjeong.vc Landing Page Content Update - Specification

**Target Version:** 2.1.0

## Overview

shinjeong.vc 랜딩 페이지의 콘텐츠를 업데이트한다:
1. 페이지 전반에서 AI 관련 문구를 삭제/수정
2. "검증된 실적" 섹션의 숫자 통계를 이미지 4장으로 교체 (PC: 2x2 그리드, Mobile: 1x4 세로)
3. "스탁플러스" 텍스트를 "신정투자그룹"으로 변경

## Functional Requirements

- [ ] FR-1: AI 문구 삭제/수정
- [ ] FR-2: 검증된 실적 섹션 이미지 교체
- [ ] FR-3: 브랜드명 변경 (스탁플러스 -> 신정투자그룹)

### FR-1: AI 문구 삭제/수정

대상 파일 및 변경 사항:

**`app/shinjeong/layout.tsx`**
- Line 4 (title): "AI 급등주 시그널 | 실시간 AI 분석으로 급등주 포착" 에서 AI 관련 문구를 제거한 형태로 변경
- Line 6 (description): "AI가 거래량..." 에서 AI 관련 문구를 제거한 형태로 변경

**`components/shinjeong/hero-section.tsx`**
- Line 44: "AI 분석 진행 중" -> "분석 진행 중"
- Line 171: "AI 실시간 시장 분석 중" -> "실시간 시장 분석 중"
- Line 201: "AI가 24시간" -> "24시간"

**`components/shinjeong/features-section.tsx`**
- Line 8: "AI가 24시간 실시간으로 분석합니다" -> "24시간 실시간으로 분석합니다"

### FR-2: 검증된 실적 섹션 이미지 교체

**`components/shinjeong/stats-section.tsx`**
- 현재 숫자 기반 통계 4개를 이미지 4장(`sj_gr_01.jpg` ~ `sj_gr_04.jpg`)으로 교체
- 이미지 파일을 프로젝트 루트의 `sj_gr_01~04.jpg`에서 `public/images/shinjeong/` 디렉토리로 이동
- PC 레이아웃: 2x2 그리드
- Mobile 레이아웃: 1열 4줄 (세로 스크롤)
- Next.js `Image` 컴포넌트 사용 권장

### FR-3: 브랜드명 변경 (스탁플러스 -> 신정투자그룹)

**`components/shinjeong/site-footer.tsx`**
- Line 14: 브랜드명 "스탁플러스" -> "신정투자그룹"
- Line 40: "© 2026 스탁플러스" -> "© 2026 신정투자그룹"

**`components/shinjeong/fixed-cta.tsx`**
- Line 178: 개인정보처리방침 내 "스탁플러스" -> "신정투자그룹"

## Non-Functional Requirements

- 성능: 없음 (특별한 성능 요구사항 없음)
- 보안: 없음

## Constraints

- 기존 코드베이스 패턴을 따를 것
- stockplus.im 관련 파일은 절대 수정하지 않을 것 (shinjeong 관련 파일만 변경 대상)
- Tailwind CSS + inline oklch 색상 패턴 유지

## Out of Scope

- stockplus.im 페이지 변경
- 새로운 기능 추가
- API/백엔드 변경
- 분석/트래킹 설정 변경

## Analysis Results

### Related Code

| # | File | Line | Relationship |
|---|------|------|--------------|
| 1 | `app/shinjeong/layout.tsx` | 4, 6 | AI 문구 포함 메타데이터 |
| 2 | `components/shinjeong/hero-section.tsx` | 44, 171, 201 | AI 문구 포함 히어로 섹션 |
| 3 | `components/shinjeong/features-section.tsx` | 8 | AI 문구 포함 기능 섹션 |
| 4 | `components/shinjeong/stats-section.tsx` | 14-47, 93-99 | 검증된 실적 섹션 (숫자 통계) |
| 5 | `components/shinjeong/site-footer.tsx` | 14, 40 | "스탁플러스" 브랜드명 |
| 6 | `components/shinjeong/fixed-cta.tsx` | 178 | 개인정보처리방침 내 "스탁플러스" |

### Conflicts Identified

없음. shinjeong 전용 컴포넌트만 수정하므로 stockplus.im과 충돌 없음.

### Edge Cases

| # | Case | Expected Behavior |
|---|------|-------------------|
| 1 | 이미지 로딩 실패 | alt 텍스트 표시 |
| 2 | 모바일 뷰포트 전환 | 2x2 <-> 1x4 레이아웃 올바르게 전환 |
| 3 | 이미지 최적화 | Next.js Image 컴포넌트로 자동 최적화 |
