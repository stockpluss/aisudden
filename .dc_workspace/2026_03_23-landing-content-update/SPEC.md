<!-- dotclaude-config
working_directory: .dc_workspace
base_branch: main
language: ko_KR
worktree_path: ../aisudden-feature-landing-content-update
doc_dir: 2026_03_23-landing-content-update
-->

# Landing Content Update - Specification

## Overview

shinjeong.vc 랜딩 페이지의 텍스트, 콘텐츠, 레이아웃을 수정하여 서비스 메시지를 개선한다.

## Problem

현재 shinjeong.vc 랜딩 페이지의 텍스트와 구조가 서비스의 핵심 가치를 정확히 전달하지 못하고 있으며, 모바일에서 hero 영역의 상단 공백이 커서 스크롤 문구가 첫 화면에 보이지 않는 UX 문제가 있다.

## Target Version

2.1.1

## Functional Requirements

- [ ] **FR-01**: hero 헤드라인 텍스트 변경
  - Before: "빠른 정보가 수익입니다"
  - After: "혼자 찾기 어려운 급등주, 실시간 알림으로 받아보세요"
  - File: `components/shinjeong/hero-section.tsx` (lines 176-191)

- [ ] **FR-02**: 통계 수치 섹션 삭제
  - 삭제 대상: `+47% 월 평균 수익률`, `85% 최근 승률`, `24/7 실시간 분석` 카드 영역
  - File: `components/shinjeong/hero-section.tsx` (lines 11-15, 220-232)

- [ ] **FR-03**: Footer에 사업자 정보 추가
  - 추가: 사업자등록번호 261-03-03355, 대표자 김경덕
  - File: `components/shinjeong/site-footer.tsx`

- [ ] **FR-04**: 섹션 헤딩 변경
  - Before: "숫자로 증명하는 신뢰"
  - After: "실제 포착 사례"
  - File: `components/shinjeong/stats-section.tsx` (line 19)

- [ ] **FR-05**: 2x2 이미지 그리드 아래 텍스트 추가
  - 추가 텍스트: "거래량 급증 + 상승 시그널 포착 후 알림 발송" / "포착 시점 이후 상승 흐름 확인"
  - File: `components/shinjeong/stats-section.tsx`

- [ ] **FR-06**: Footer 서브타이틀 수정
  - Before: "실시간 급등주 포착 서비스. 거래량, 언론이슈, 기업공시를 분석해 투자 기회를 제공합니다."
  - After: "실시간 급등주 포착 서비스 거래량, 언론이슈, 기업공시를 분석해 정보를 제공합니다"
  - File: `components/shinjeong/site-footer.tsx` (lines 16-17)

- [ ] **FR-07**: CTA 버튼 텍스트 변경
  - Before: "무료 받기"
  - After: "급등주 받아보기"
  - File: `components/shinjeong/fixed-cta.tsx` (line 134)

- [ ] **FR-08**: 실적 공개 섹션 완전 삭제
  - 삭제 대상: PerformanceSection 컴포넌트 전체
  - File: `components/shinjeong/performance-section.tsx` (삭제 또는 import 제거)
  - File: `app/shinjeong/page.tsx` (PerformanceSection import 및 사용 제거)

- [ ] **FR-09**: hero 상단 공백 줄이기
  - 모바일에서 스크롤 문구가 첫 화면에 보이도록 hero 섹션 상단 패딩/마진 축소
  - File: `components/shinjeong/hero-section.tsx`

## Non-Functional Requirements

없음 (성능, 보안 요구사항 없음)

## Constraints

- 기존 코드베이스 패턴을 따를 것
- oklch 색상 시스템 유지
- Tailwind CSS 스타일링 패턴 유지

## Out of Scope

없음

## Analysis Results

### Related Code

| # | File | Line | Relationship |
|---|------|------|--------------|
| 1 | `components/shinjeong/hero-section.tsx` | 176-191 | 헤드라인 텍스트 위치 |
| 2 | `components/shinjeong/hero-section.tsx` | 11-15 | STATS 배열 정의 |
| 3 | `components/shinjeong/hero-section.tsx` | 220-232 | STATS 렌더링 영역 |
| 4 | `components/shinjeong/stats-section.tsx` | 19 | 섹션 헤딩 위치 |
| 5 | `components/shinjeong/stats-section.tsx` | 23-38 | 이미지 그리드 렌더링 |
| 6 | `components/shinjeong/site-footer.tsx` | 12-17 | 브랜드 + 서브타이틀 |
| 7 | `components/shinjeong/fixed-cta.tsx` | 134 | CTA 버튼 텍스트 |
| 8 | `components/shinjeong/performance-section.tsx` | 전체 | 실적 공개 섹션 |
| 9 | `app/shinjeong/page.tsx` | - | PerformanceSection import/사용 |

### Conflicts Identified

없음 (텍스트/콘텐츠 변경이므로 충돌 없음)

### Edge Cases

| # | Case | Expected Behavior |
|---|------|-------------------|
| 1 | 모바일 반응형 | 변경된 텍스트 길이가 레이아웃을 깨뜨리지 않아야 함 |
| 2 | 실적 공개 섹션 삭제 후 | 페이지 흐름이 자연스러워야 함 |
| 3 | hero 상단 공백 축소 | 모바일에서 스크롤 문구가 첫 화면에 보여야 함 |
