# GLOBAL - Multi-Domain Architecture

## Project Context

A Next.js 16 App Router application currently serving a single domain (`stockplus.im`).
This work adds `shinjeong.vc` as a second domain, served from the same codebase via
middleware host-based URL rewriting.

**Repository root**: `/home/ulismoon/Documents/stockpluss/aisudden`
**Branch**: `feature/shinjeong.vc`
**Framework**: Next.js 16 App Router, Tailwind CSS 4, shadcn/ui

## Architecture Decisions

### AD-1: Middleware Host-Based Rewriting

The middleware inspects the `Host` header and internally rewrites `/` to `/stockplus` or
`/shinjeong`. The browser URL does not change. Unknown non-localhost hosts return 404.
Localhost supports `?site=` query parameter for development.

### AD-2: Domain Directory Convention

Each domain gets its own directory under `app/` and `components/`:
- `app/{domain}/layout.tsx` - domain metadata + GA scripts
- `app/{domain}/page.tsx` - domain landing page
- `components/{domain}/` - domain-specific components
- `app/actions/submit-lead-{domain}.ts` - domain-specific server action (except stockplus which keeps `submit-lead.ts`)

### AD-3: Analytics Registry Pattern

`lib/analytics.ts` holds a `Record<string, SiteAnalyticsConfig>` mapping domain keys
to GA4 measurement IDs and Google Ads conversion configs. The `gtagReportConversion(site, name, phone)`
function uses this registry. Domain-specific layout files load the appropriate GA script tags.

### AD-4: Kakao Message Parameterization

`sendKakaoMessage` accepts an optional `templateId` parameter. If absent or empty,
Kakao alimtalk is silently skipped (returns `{ success: true, skipped: true }`).
Each domain's submit-lead action passes its own `templateId` from env vars.

### AD-5: CSS Strategy

Both sites share `app/globals.css`. Shinjeong components use inline `style={{}}` with
`oklch()` colors directly rather than CSS custom properties, so no CSS variable conflicts.
Only shinjeong-specific `@keyframes` animations are appended to `globals.css`.

### AD-6: Shared Infrastructure

- `components/ui/` - shadcn/ui components, shared by all domains
- `components/theme-provider.tsx` - shared
- `lib/utils.ts` - `cn()` only (after `gtagReportConversion` removal)
- `app/actions/send-kakao-message.ts` - shared Kakao sender with `templateId` param
- Environment vars: `SOLAPI_*`, `KAKAO_CHANNEL_ID` shared across domains

## Environment Variables

```
# Stockplus (existing, unchanged names)
APPS_SCRIPT_URL=
SECRET_TOKEN=
KAKAO_TEMPLATE_ID=

# Shinjeong (new)
SHINJEONG_APPS_SCRIPT_URL=
SHINJEONG_SECRET_TOKEN=
SHINJEONG_KAKAO_TEMPLATE_ID=          # empty = skip alimtalk

# Shared (existing)
SOLAPI_API_KEY=
SOLAPI_API_SECRET_KEY=
SOLAPI_FROM_NUMBER=
KAKAO_CHANNEL_ID=
```

## Target Directory Structure

```
middleware.ts                          # NEW
lib/
  utils.ts                            # MODIFIED - cn() only
  analytics.ts                        # NEW
app/
  layout.tsx                          # MODIFIED - neutral shell
  page.tsx                            # MODIFIED - dev index for localhost
  globals.css                         # MODIFIED - add shinjeong animations
  stockplus/
    layout.tsx                        # NEW
    page.tsx                          # NEW (moved from app/page.tsx)
  shinjeong/
    layout.tsx                        # NEW
    page.tsx                          # NEW
  actions/
    submit-lead.ts                    # MODIFIED
    send-kakao-message.ts             # MODIFIED
    submit-lead-shinjeong.ts          # NEW
components/
  ui/                                 # UNCHANGED
  theme-provider.tsx                  # UNCHANGED
  stockplus/                          # NEW dir (7 files moved from components/)
  shinjeong/                          # NEW dir (6 files from download)
```

## Phase Overview

| Phase | Description | Dependencies |
|-------|-------------|--------------|
| 1 | Restructure existing code into stockplus/ subdirectories | None |
| 2 | Analytics separation + Kakao flexibility | Phase 1 (imports change) |
| 3 | Middleware + shinjeong site integration | Phase 1, Phase 2 |
| 4 | Environment config + CSS animations | Phase 3 |

All phases are SEQUENTIAL due to shared file modifications (layout.tsx, utils.ts,
fixed-cta.tsx, send-kakao-message.ts, submit-lead.ts, globals.css).

## Naming Conventions

- Server actions: `submitLead` (stockplus), `submitLeadShinjeong` (shinjeong)
- Components: `FixedCTA` (stockplus), `ShinjeongFixedCTA` (shinjeong)
- Analytics: `gtagReportConversion("stockplus", ...)`, `gtagReportConversion("shinjeong", ...)`
- Log prefixes: `[stockplus]`, `[shinjeong]`, `[kakao]`

## Validation Checklist (All Phases Complete)

- [ ] `pnpm dev` starts without errors
- [ ] `localhost:3000` shows dev index page
- [ ] `localhost:3000/?site=stockplus` renders stockplus landing
- [ ] `localhost:3000/?site=shinjeong` renders shinjeong landing
- [ ] Stockplus CTA submission works (Sheet + Kakao)
- [ ] Shinjeong CTA submission works (Sheet, Kakao skipped if no templateId)
- [ ] `pnpm build` succeeds
