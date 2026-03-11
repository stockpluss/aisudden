# Multi-Domain Architecture - Specification

## Overview

Add shinjeong.vc domain support to the existing stockplus.im Next.js 16 application. A single repository serves multiple domains via middleware host-based URL rewriting. Each domain operates with independent Google Analytics tracking, Google Sheet storage, and Kakao alimtalk messaging (with optional template ID).

## Functional Requirements

### FR-1: Middleware Host-Based Routing
- [ ] Create `middleware.ts` at project root
- [ ] Inspect the `Host` header of each incoming request
- [ ] Map known domains to internal path segments:
  - `stockplus.im` → `/stockplus`
  - `shinjeong.vc` → `/shinjeong`
- [ ] Rewrite the URL internally so the App Router resolves to `app/{segment}/page.tsx`
- [ ] The rewrite must be transparent to the client (URL in browser does not change)

### FR-2: Unknown Domain Returns 404
- [ ] If the `Host` header does not match any mapped domain AND is not `localhost`, return a 404 response from middleware
- [ ] `localhost` (with any port) is always allowed through for local development

### FR-3: Local Development Support
- [ ] On `localhost`, accept a `?site=` query parameter to simulate a specific domain (e.g., `?site=stockplus`, `?site=shinjeong`)
- [ ] If `localhost` request has no `?site=` param, show a dev index page listing available domains
- [ ] The dev index page is `app/page.tsx` (root-level fallback)

### FR-4: Domain-Independent GA Conversion Tracking
- [ ] Create `lib/analytics.ts` as a domain-specific GA configuration registry
- [ ] Each domain entry contains: GA4 measurement ID(s), Google Ads conversion ID(s), and conversion label(s)
- [ ] Move `gtagReportConversion` logic from `lib/utils.ts` into `lib/analytics.ts`, parameterized by domain key
- [ ] `lib/utils.ts` retains only the `cn()` utility function
- [ ] Each domain's `layout.tsx` loads only its own GA/Ads script tags (no hardcoded IDs in root layout)
- [ ] If GA is not configured for a domain, skip conversion tracking; form submission must still work normally

### FR-5: Domain-Independent Google Sheet Storage
- [ ] Each domain uses its own Apps Script URL and secret token, read from environment variables
- [ ] Environment variable naming convention: `{DOMAIN_PREFIX}_APPS_SCRIPT_URL`, `{DOMAIN_PREFIX}_SECRET_TOKEN`
  - stockplus: `APPS_SCRIPT_URL`, `SECRET_TOKEN` (existing, unchanged)
  - shinjeong: `SHINJEONG_APPS_SCRIPT_URL`, `SHINJEONG_SECRET_TOKEN`
- [ ] If the Apps Script URL is not set for a domain, the submit action must return an error
- [ ] Create `app/actions/submit-lead-shinjeong.ts` for shinjeong-specific submission using shinjeong env vars

### FR-6: Kakao Alimtalk with Optional Template ID
- [ ] Modify `sendKakaoMessage` in `app/actions/send-kakao-message.ts` to accept an optional `templateId` parameter
- [ ] If `templateId` is not provided or is empty/undefined, skip the Kakao alimtalk send entirely (do not error)
- [ ] If `templateId` is provided, send the alimtalk using that template ID
- [ ] Shared Kakao infrastructure env vars remain unchanged: `SOLAPI_API_KEY`, `SOLAPI_API_SECRET_KEY`, `SOLAPI_FROM_NUMBER`, `KAKAO_CHANNEL_ID`
- [ ] Domain-specific template ID env vars:
  - stockplus: `KAKAO_TEMPLATE_ID` (existing)
  - shinjeong: `SHINJEONG_KAKAO_TEMPLATE_ID` (empty string = skip alimtalk)
- [ ] Each domain's submit-lead action passes the appropriate template ID to `sendKakaoMessage`

### FR-7: Domain-Specific Page Structure
- [ ] Each domain has its own directory under `app/`: `app/stockplus/`, `app/shinjeong/`
- [ ] Each domain directory contains:
  - `layout.tsx` — domain-specific metadata (title, description, icons) and GA script tags
  - `page.tsx` — domain-specific landing page content
- [ ] Root `app/layout.tsx` becomes a domain-neutral shell (HTML boilerplate, font, global CSS only; no GA scripts)
- [ ] Domain-specific components live under `components/{domain}/`
- [ ] Shared UI components remain in `components/ui/`

## Functional Requirements (Nice-to-Have)

### FR-N1: README Guide for Adding New Domains
- [ ] Document the step-by-step process for adding a new domain covering three levels:
  1. Code changes (middleware map, directory structure, env vars, analytics registry)
  2. nginx configuration (server block, proxy_pass, Host header forwarding)
  3. SSL certificate (Let's Encrypt / certbot setup)

## Non-Functional Requirements

### NFR-1: Input Validation
- [ ] CTA form input validation already exists and must be preserved for all domains
- [ ] Each domain's CTA form must apply the same validation rules (name required, phone format check)

### NFR-2: Error Isolation
- [ ] A failure in one domain's Kakao alimtalk must not affect the Google Sheet submission (already the pattern in existing code)
- [ ] A failure in one domain's submission must not affect other domains

## Constraints

- **Framework**: Next.js 16 App Router (no Pages Router)
- **Styling**: Tailwind CSS 4
- **UI Library**: shadcn/ui (shared components in `components/ui/`)
- **Server Logic**: Server Actions (no API routes)
- **Deployment**: EC2 via GitHub Actions + PM2
- **Reverse Proxy**: nginx with `Host` header forwarding (`proxy_set_header Host $host`)
- **Existing env vars for stockplus must not be renamed** — backward compatibility required

## Out of Scope

- Database or authentication systems
- Domain-specific favicon or robots.txt handling
- Performance optimization beyond current baseline
- Multi-language / i18n support

## Analysis Results

### Related Code (Current State)

| # | File | Lines | Current Behavior | Required Change |
|---|------|-------|------------------|-----------------|
| 1 | `app/layout.tsx` | 29-46 | Stockplus GA4/Ads script tags hardcoded in root layout | Remove GA scripts from root; move to domain-specific layouts |
| 2 | `lib/utils.ts` | 9-34 | `gtagReportConversion` with stockplus-only conversion IDs | Extract to `lib/analytics.ts` with domain-keyed registry |
| 3 | `components/fixed-cta.tsx` | 12, 62 | Imports `gtagReportConversion` from `lib/utils` | Update import path to `lib/analytics.ts`; pass domain key |
| 4 | `app/actions/send-kakao-message.ts` | 22-27 | `templateId` hardcoded from `KAKAO_TEMPLATE_ID` env var | Accept `templateId` as optional parameter; skip if unset |
| 5 | `app/actions/submit-lead.ts` | 54-57 | Calls `sendKakaoMessage` without `templateId` param | Pass domain-specific `templateId` to `sendKakaoMessage` |

### Conflicts and Resolutions

| # | Existing Behavior | Required Behavior | Resolution |
|---|-------------------|-------------------|------------|
| 1 | `sendKakaoMessage` reads `KAKAO_TEMPLATE_ID` from env directly | Accept `templateId` as a function parameter | Add optional `templateId` param; if undefined/empty, skip alimtalk entirely and return success |
| 2 | `gtagReportConversion` has stockplus GA Ads IDs hardcoded | Domain-specific tracking with different conversion IDs | Create `lib/analytics.ts` with a registry map keyed by domain; export domain-aware `gtagReportConversion(domain, name, phone)` |
| 3 | Any unknown domain request falls through to `app/page.tsx` | Unknown non-localhost domains return 404 | Middleware checks host against domain map; returns `NextResponse` with 404 status for unmapped non-localhost hosts |

### Edge Cases

| # | Case | Expected Behavior |
|---|------|-------------------|
| 1 | `SHINJEONG_KAKAO_TEMPLATE_ID` is empty or not set | Skip alimtalk send; Google Sheet submission proceeds; return success |
| 2 | `SHINJEONG_APPS_SCRIPT_URL` is not set | Return error from submit action; do not attempt Sheet or Kakao send |
| 3 | GA not configured for a domain (no IDs in registry) | Skip conversion tracking silently; form submission works normally |
| 4 | `localhost` without `?site=` query parameter | Show dev index page (`app/page.tsx`) listing available domain links |
| 5 | Unknown domain (e.g., `random.com`) hits the server | Middleware returns 404 response |
| 6 | Simultaneous CTA submissions from stockplus.im and shinjeong.vc | Processed independently; each uses its own env vars and Sheet |
| 7 | `localhost?site=unknown` | Treat as unmapped; show 404 or dev index (same as unknown domain on localhost) |

## Directory Structure (Target)

```
middleware.ts                          # NEW - host-based routing
lib/
  utils.ts                            # MODIFIED - cn() only, gtagReportConversion removed
  analytics.ts                        # NEW - domain-specific GA tracking registry
app/
  layout.tsx                          # MODIFIED - domain-neutral shell (no GA scripts)
  page.tsx                            # MODIFIED - dev index / fallback for localhost
  stockplus/
    layout.tsx                        # NEW - stockplus GA scripts + metadata
    page.tsx                          # NEW - moved from current app/page.tsx
  shinjeong/
    layout.tsx                        # NEW - shinjeong GA scripts + metadata
    page.tsx                          # NEW - shinjeong landing page
  actions/
    submit-lead.ts                    # MODIFIED - pass templateId to sendKakaoMessage
    send-kakao-message.ts             # MODIFIED - accept optional templateId param
    submit-lead-shinjeong.ts          # NEW - shinjeong-specific submission
components/
  ui/                                 # UNCHANGED - shared shadcn/ui components
  stockplus/                          # NEW directory - moved from components/ root
  shinjeong/                          # NEW directory - shinjeong-specific components
```

## Environment Variables

```bash
# Stockplus (existing - must not be renamed)
APPS_SCRIPT_URL=                      # Google Apps Script URL for stockplus
SECRET_TOKEN=                         # Apps Script auth token for stockplus
KAKAO_TEMPLATE_ID=                    # Kakao alimtalk template for stockplus

# Shinjeong (new)
SHINJEONG_APPS_SCRIPT_URL=            # Google Apps Script URL for shinjeong
SHINJEONG_SECRET_TOKEN=               # Apps Script auth token for shinjeong
SHINJEONG_KAKAO_TEMPLATE_ID=          # Kakao alimtalk template for shinjeong (empty = skip)

# Shared (existing - used by all domains)
SOLAPI_API_KEY=                       # Solapi API key
SOLAPI_API_SECRET_KEY=                # Solapi API secret
SOLAPI_FROM_NUMBER=                   # Sender phone number
KAKAO_CHANNEL_ID=                     # Kakao channel profile ID (pfId)
```
