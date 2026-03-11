# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
