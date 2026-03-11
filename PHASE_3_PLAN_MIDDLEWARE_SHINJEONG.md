# PHASE 3: Middleware + Shinjeong Site Integration

## Objective

1. Create `middleware.ts` for host-based routing with localhost `?site=` support.
2. Add the shinjeong landing page: components, page, layout, server action.

## File Changes

### 3.1 Create `middleware.ts` (project root)

Based on the reference middleware from the download folder, adapted per SPEC.md requirements.

```typescript
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const DOMAIN_MAP: Record<string, string> = {
  "stockplus.im": "/stockplus",
  "www.stockplus.im": "/stockplus",
  "shinjeong.vc": "/shinjeong",
  "www.shinjeong.vc": "/shinjeong",
}

const BYPASS_PREFIXES = [
  "/api/",
  "/_next/",
  "/favicon",
  "/robots",
  "/sitemap",
  "/images/",
]

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const host = request.headers.get("host") ?? ""

  // Always pass through static assets, API routes, Next.js internals
  if (BYPASS_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // Localhost handling
  const isLocalhost = host.startsWith("localhost") || host.startsWith("127.0.0.1")

  if (isLocalhost) {
    const siteParam = request.nextUrl.searchParams.get("site")
    if (siteParam) {
      const targetBase = `/${siteParam}`
      // Validate the site param maps to a known path
      const isKnownSite = Object.values(DOMAIN_MAP).includes(targetBase)
      if (!isKnownSite) {
        return new NextResponse("Not Found", { status: 404 })
      }
      if (pathname.startsWith(targetBase)) {
        return NextResponse.next()
      }
      const url = request.nextUrl.clone()
      url.pathname = pathname === "/" ? targetBase : `${targetBase}${pathname}`
      url.searchParams.delete("site")
      return NextResponse.rewrite(url)
    }
    // No ?site= param on localhost -> show dev index (app/page.tsx)
    return NextResponse.next()
  }

  // Production: map host to internal path
  const targetBase = DOMAIN_MAP[host]

  if (!targetBase) {
    // Unknown domain -> 404
    return new NextResponse("Not Found", { status: 404 })
  }

  // Already on correct internal path -> pass through
  if (pathname.startsWith(targetBase)) {
    return NextResponse.next()
  }

  // Rewrite to domain-specific path
  const url = request.nextUrl.clone()
  url.pathname = pathname === "/" ? targetBase : `${targetBase}${pathname}`
  url.search = search
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
```

Key differences from the download reference:
- Uses `/stockplus` and `/shinjeong` (not `/main` and `/aisudden`)
- Adds `/images/` to BYPASS_PREFIXES (public assets)
- Unknown non-localhost hosts return 404 (per FR-2)
- Localhost `?site=` support with validation (per FR-3)
- Localhost without `?site=` passes through to dev index (per FR-3)

### 3.2 Create `components/shinjeong/` directory

Copy 5 section components from the download folder and adapt:

**Source**: `/home/ulismoon/Downloads/b_5nevBzdfBjK-1773204475778/components/`

| Source File | Target File | Import Changes |
|-------------|-------------|----------------|
| `hero-section.tsx` | `components/shinjeong/hero-section.tsx` | None (only uses react, lucide-react) |
| `stats-section.tsx` | `components/shinjeong/stats-section.tsx` | None (only uses react) |
| `features-section.tsx` | `components/shinjeong/features-section.tsx` | None (only uses lucide-react) |
| `performance-section.tsx` | `components/shinjeong/performance-section.tsx` | Change `import { cn } from "@/lib/utils"` -- keep as is, `cn` is still in `@/lib/utils` |
| `site-footer.tsx` | `components/shinjeong/site-footer.tsx` | None (no imports) |

### 3.3 Create `components/shinjeong/fixed-cta.tsx`

**Source**: `/home/ulismoon/Downloads/b_5nevBzdfBjK-1773204475778/components/aisudden/fixed-cta.tsx`

Changes from source:
1. **Rename** export: `AisuddenFixedCTA` -> `ShinjeongFixedCTA`
2. **Change** import: `submitLeadAisudden` -> `submitLeadShinjeong`
   - From: `import { submitLeadAisudden } from "@/app/actions/submit-lead-aisudden"`
   - To: `import { submitLeadShinjeong } from "@/app/actions/submit-lead-shinjeong"`
3. **Add** analytics import: `import { gtagReportConversion } from "@/lib/analytics"`
4. **Add** conversion call in `handleSubmit`, before `submitLeadShinjeong` call:
   ```typescript
   gtagReportConversion("shinjeong", name.trim(), phone.trim().replace(/\D/g, ""))
   ```
5. **Update** the server action call:
   - From: `const result = await submitLeadAisudden({ ... })`
   - To: `const result = await submitLeadShinjeong({ ... })`
6. **Keep** everything else identical: the form UI, validation, dismissed state, inline styles.

### 3.4 Create `app/actions/submit-lead-shinjeong.ts`

**Source**: `/home/ulismoon/Downloads/b_5nevBzdfBjK-1773204475778/app/actions/submit-lead-aisudden.ts`

Changes from source:
1. **Rename** function: `submitLeadAisudden` -> `submitLeadShinjeong`
2. **Remove** the inline `sendKakaoAisudden` function (lines 36-64)
3. **Import** shared `sendKakaoMessage` instead: `import { sendKakaoMessage } from "./send-kakao-message"`
4. **Change** env vars:
   - `AISUDDEN_APPS_SCRIPT_URL` -> `SHINJEONG_APPS_SCRIPT_URL`
   - `AISUDDEN_SECRET_TOKEN` -> `SHINJEONG_SECRET_TOKEN`
5. **Change** source field: `"aisudden.com"` -> `"shinjeong.vc"`
6. **Replace** Kakao call with shared function:
   ```typescript
   const kakaoResult = await sendKakaoMessage({
     to: phoneNumber,
     name: formData.name,
     templateId: process.env.SHINJEONG_KAKAO_TEMPLATE_ID,
   })
   ```
7. **Change** log prefix: `[aisudden]` -> `[shinjeong]`
8. **Keep** the `getKoreanTimestamp()` helper function (same logic as stockplus `submit-lead.ts`)

### 3.5 Create `app/shinjeong/page.tsx`

**Source**: `/home/ulismoon/Downloads/b_5nevBzdfBjK-1773204475778/app/aisudden/page.tsx`

Changes:
1. Update all imports from `@/components/` to `@/components/shinjeong/`
2. Change `AisuddenFixedCTA` import to `ShinjeongFixedCTA` from `@/components/shinjeong/fixed-cta`
3. Rename function: `AisuddenPage` -> `ShinjeongPage`

```typescript
import { HeroSection } from "@/components/shinjeong/hero-section"
import { StatsSection } from "@/components/shinjeong/stats-section"
import { FeaturesSection } from "@/components/shinjeong/features-section"
import { PerformanceSection } from "@/components/shinjeong/performance-section"
import { SiteFooter } from "@/components/shinjeong/site-footer"
import { ShinjeongFixedCTA } from "@/components/shinjeong/fixed-cta"

export default function ShinjeongPage() {
  return (
    <>
      <main className="min-h-screen pb-20">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <PerformanceSection />
        <SiteFooter />
      </main>
      <ShinjeongFixedCTA />
    </>
  )
}
```

### 3.6 Create `app/shinjeong/layout.tsx`

**Source**: `/home/ulismoon/Downloads/b_5nevBzdfBjK-1773204475778/app/aisudden/layout.tsx`

The download layout has metadata but no GA scripts (shinjeong GA IDs are not yet configured).
Create the layout with metadata and a placeholder structure for GA scripts that can be
added later when shinjeong GA IDs are available.

```typescript
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "AI 급등주 시그널 | 실시간 AI 분석으로 급등주 포착",
  description:
    "AI가 거래량, 언론이슈, 기업공시를 24시간 실시간 분석해 급등 가능성이 높은 종목을 즉시 알려드립니다. 무료로 시작하세요.",
  keywords: "급등주, AI 주식, 주식 분석, 급등주 포착, 실시간 주식, 주식 시그널",
}

export const viewport: Viewport = {
  themeColor: "#1a2035",
  width: "device-width",
  initialScale: 1,
}

export default function ShinjeongLayout({ children }: { children: React.ReactNode }) {
  // GA scripts will be added here when shinjeong.vc GA/Ads IDs are configured
  return <>{children}</>
}
```

## Checklist

- [ ] Create `middleware.ts` at project root with host-based routing
- [ ] Copy `hero-section.tsx` to `components/shinjeong/`
- [ ] Copy `stats-section.tsx` to `components/shinjeong/`
- [ ] Copy `features-section.tsx` to `components/shinjeong/`
- [ ] Copy `performance-section.tsx` to `components/shinjeong/` (keep `@/lib/utils` import for `cn`)
- [ ] Copy `site-footer.tsx` to `components/shinjeong/`
- [ ] Create `components/shinjeong/fixed-cta.tsx` from aisudden source (rename, add analytics, update action import)
- [ ] Create `app/actions/submit-lead-shinjeong.ts` (use shared `sendKakaoMessage`, SHINJEONG_* env vars)
- [ ] Create `app/shinjeong/page.tsx` with `@/components/shinjeong/*` imports
- [ ] Create `app/shinjeong/layout.tsx` with shinjeong metadata
- [ ] Verify `pnpm build` succeeds
- [ ] Verify middleware routing works for `?site=stockplus` and `?site=shinjeong`

## Files Modified/Created

| File | Action |
|------|--------|
| `middleware.ts` | NEW |
| `components/shinjeong/hero-section.tsx` | NEW (copied from download) |
| `components/shinjeong/stats-section.tsx` | NEW (copied from download) |
| `components/shinjeong/features-section.tsx` | NEW (copied from download) |
| `components/shinjeong/performance-section.tsx` | NEW (copied from download) |
| `components/shinjeong/site-footer.tsx` | NEW (copied from download) |
| `components/shinjeong/fixed-cta.tsx` | NEW (adapted from download) |
| `app/actions/submit-lead-shinjeong.ts` | NEW |
| `app/shinjeong/page.tsx` | NEW |
| `app/shinjeong/layout.tsx` | NEW |
