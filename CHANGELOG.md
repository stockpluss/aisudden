# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-03-23

### Added
- Concurrency control in deploy workflow to prevent overlapping deployments
- Secret and variable validation step that checks all required credentials before deployment
- nginx config management: backup, version comment injection, validation (`nginx -t`), and automatic rollback on failure
- Post-deployment health checks for all 4 domains (stockplus.im, www.stockplus.im, shinjeong.vc, www.shinjeong.vc)
- Slack notifications on deployment success (green) and failure (red with @mention)
- Result images (`sj_gr_01.jpg` ~ `sj_gr_04.jpg`) displayed in responsive grid layout (PC: 2x2, Mobile: 1x4) on shinjeong.vc page

### Changed
- Separated `pnpm install` and `pnpm run build` into distinct workflow steps for fail-fast behavior
- All secrets are now passed via environment variables, never exposed in workflow logs
- Removed AI-related text from shinjeong.vc layout metadata, hero section, and features section
- Replaced stats section (numeric statistics) with result images grid on shinjeong.vc page
- Renamed brand from "스탁플러스" to "신정투자그룹" in shinjeong.vc footer and privacy policy

## [2.0.0] - 2026-03-11

### Added
- `lib/google-sheets.ts` - Google Sheets API 직접 연동 유틸리티 (Service Account 인증)
- `googleapis` npm 패키지 의존성 추가
- Exponential backoff 재시도 로직 (최대 3회, 429/500/503 에러 시)
- Service Account 권한 부재 시 명확한 에러 메시지

### Changed
- `submit-lead.ts` - GAS fetch 호출을 Google Sheets API `appendRow()` 호출로 교체
- `submit-lead-shinjeong.ts` - 동일하게 GAS에서 Google Sheets API로 전환
- `.env.local.example` - GAS 관련 환경변수를 Google Sheets API 환경변수로 교체

### Removed
- `APPS_SCRIPT_URL`, `SECRET_TOKEN` 환경변수 (Google Sheets API Service Account로 대체)
- `SHINJEONG_APPS_SCRIPT_URL`, `SHINJEONG_SECRET_TOKEN` 환경변수 (동일)
- Google Apps Script(GAS) 의존성 완전 제거

### Breaking Changes
- 환경변수 체계 변경: `APPS_SCRIPT_URL`/`SECRET_TOKEN` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`/`GOOGLE_PRIVATE_KEY` + 도메인별 `*_SHEET_ID`/`*_SHEET_TAB`
- Google Sheets에 Service Account 이메일로 편집자 공유 설정 필요

## [1.0.0] - 2026-03-11

### Added
- Multi-domain architecture with middleware host-based URL rewriting
- shinjeong.vc domain support with dedicated landing page
- Domain-specific Google Analytics/Ads conversion tracking via `lib/analytics.ts` registry
- Domain-specific Google Sheet storage with separate Apps Script URLs per domain
- Optional Kakao alimtalk per domain (skip when template ID is not configured)
- Localhost `?site=` query parameter for local development
- 404 response for unknown/unmapped domains
- Dev index page at root for localhost access
- SPEC.md, GLOBAL.md, and phase design documents
- README.md with comprehensive new domain addition guide (code, nginx, SSL, DNS)

### Changed
- Restructured stockplus components from `components/` to `components/stockplus/`
- Moved stockplus page from `app/page.tsx` to `app/stockplus/page.tsx`
- Root `app/layout.tsx` is now a domain-neutral shell (no GA scripts or domain-specific metadata)
- `sendKakaoMessage` now accepts optional `templateId` parameter instead of reading env var directly
- `submit-lead.ts` now passes `templateId` explicitly to `sendKakaoMessage`
- `gtagReportConversion` moved from `lib/utils.ts` to `lib/analytics.ts` with domain-keyed config
- `.env.local.example` updated with shinjeong-specific environment variables
