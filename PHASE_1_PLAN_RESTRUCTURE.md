# PHASE 1: Restructure Existing Code

## Objective

Move existing stockplus-specific code into domain-specific subdirectories (`components/stockplus/`,
`app/stockplus/`) and make the root layout domain-neutral. After this phase, the application
must behave identically to before -- no functional changes.

## File Changes

### 1.1 Create `components/stockplus/` directory and move 7 component files

**Source files** (all in `/home/ulismoon/Documents/stockpluss/aisudden/components/`):
- `hero-section.tsx` - uses `lucide-react`, `useEffect`, `useRef` (no project imports)
- `performance-section.tsx` - uses `lucide-react` (no project imports)
- `trust-section.tsx` - uses `lucide-react` (no project imports)
- `benefits-section.tsx` - uses `lucide-react` (no project imports)
- `award-section.tsx` - uses `lucide-react` (no project imports)
- `footer.tsx` - no imports (no project imports)
- `fixed-cta.tsx` - imports from `@/components/ui/*`, `@/app/actions/submit-lead`, `@/lib/utils`

**Action**: `git mv` each file from `components/` to `components/stockplus/`.

**Import updates needed in `fixed-cta.tsx`**: None at this phase. The `@/components/ui/*`
imports remain valid. The `@/lib/utils` and `@/app/actions/submit-lead` imports remain valid.
The only path that changes is the component's own location.

**Files that must NOT be moved**:
- `components/theme-provider.tsx` - shared, stays at root
- `components/ui/` - shared, stays at root

### 1.2 Create `app/stockplus/page.tsx`

**Action**: Create new file with content from current `app/page.tsx` (line 1-20), updating
all import paths from `@/components/` to `@/components/stockplus/`.

Current `app/page.tsx` imports (lines 1-7):
```
import { HeroSection } from "@/components/hero-section"
import { AwardSection } from "@/components/award-section"
import { TrustSection } from "@/components/trust-section"
import { BenefitsSection } from "@/components/benefits-section"
import { PerformanceSection } from "@/components/performance-section"
import { FixedCTA } from "@/components/fixed-cta"
import { Footer } from "@/components/footer"
```

Updated imports:
```
import { HeroSection } from "@/components/stockplus/hero-section"
import { AwardSection } from "@/components/stockplus/award-section"
import { TrustSection } from "@/components/stockplus/trust-section"
import { BenefitsSection } from "@/components/stockplus/benefits-section"
import { PerformanceSection } from "@/components/stockplus/performance-section"
import { FixedCTA } from "@/components/stockplus/fixed-cta"
import { Footer } from "@/components/stockplus/footer"
```

The component function `LandingPage` and its JSX remain identical.

### 1.3 Create `app/stockplus/layout.tsx`

Extract stockplus-specific metadata and GA scripts from current `app/layout.tsx`.

New file content includes:
- The `Metadata` export from current `app/layout.tsx` lines 10-18 (title, description, icons)
- The GA `<Script>` tags from current `app/layout.tsx` lines 29-46
- A layout component wrapping children with a fragment, plus the GA scripts in a `<head>` block

```typescript
import type { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
  title: "AI 급등주포착 | 스탁플러스",
  description: "AI가 실시간으로 분석하고 알려주는 급등주 정보. 매달 공증된 실적 공개.",
  icons: {
    icon: "/logo_64.png",
    apple: "/logo_64.png",
  },
}

export default function StockplusLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-K45WKWMEYX" strategy="afterInteractive" />
      <Script id="google-gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-K45WKWMEYX', {'allow_enhanced_conversions': true});
          gtag('config', 'AW-17780944854', {'allow_enhanced_conversions': true});
          gtag('config', 'AW-11246851271', {'allow_enhanced_conversions': true});
        `}
      </Script>
      {children}
    </>
  )
}
```

### 1.4 Modify `app/layout.tsx` - Make Domain-Neutral

**Current file**: 54 lines. Remove stockplus-specific content.

Changes:
- **Remove** `import Script from "next/script"` (line 3) - no longer needed in root
- **Remove** metadata export (lines 10-18) - moved to stockplus layout
- **Add** a generic metadata export (title: "Landing", no icons)
- **Remove** the `<head>` block with GA `<Script>` tags (lines 27-46)
- **Keep** `import {Geist} from "next/font/google"` (line 4)
- **Keep** `import {Analytics} from "@vercel/analytics/next"` (line 5)
- **Keep** `import "./globals.css"` (line 6)
- **Keep** the Geist font setup (line 8)
- **Keep** the `<html>`, `<body>`, `{children}`, `<Analytics/>` structure

Result: Root layout is a neutral shell with HTML boilerplate, Geist font, global CSS, Vercel Analytics.

### 1.5 Replace `app/page.tsx` - Dev Index Page

Replace the current landing page content with a simple localhost dev index page.

```typescript
import Link from "next/link"

export default function DevIndexPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Development Index</h1>
        <p className="text-muted-foreground">Select a site to preview:</p>
        <div className="flex flex-col gap-3">
          <Link href="/?site=stockplus" className="text-primary hover:underline">
            stockplus.im
          </Link>
          <Link href="/?site=shinjeong" className="text-primary hover:underline">
            shinjeong.vc
          </Link>
        </div>
      </div>
    </main>
  )
}
```

## Checklist

- [ ] Create `components/stockplus/` directory
- [ ] Move 7 component files from `components/` to `components/stockplus/` via `git mv`
- [ ] Create `app/stockplus/page.tsx` with updated import paths (`@/components/stockplus/...`)
- [ ] Create `app/stockplus/layout.tsx` with stockplus metadata + GA scripts
- [ ] Modify `app/layout.tsx`: remove metadata, remove GA Script tags, keep as neutral shell
- [ ] Replace `app/page.tsx` with dev index page
- [ ] Verify `pnpm build` succeeds (no broken imports)
- [ ] Verify the stockplus page renders correctly at `/stockplus` route

## Files Modified/Created

| File | Action |
|------|--------|
| `components/stockplus/hero-section.tsx` | MOVED from `components/` |
| `components/stockplus/performance-section.tsx` | MOVED from `components/` |
| `components/stockplus/trust-section.tsx` | MOVED from `components/` |
| `components/stockplus/benefits-section.tsx` | MOVED from `components/` |
| `components/stockplus/award-section.tsx` | MOVED from `components/` |
| `components/stockplus/footer.tsx` | MOVED from `components/` |
| `components/stockplus/fixed-cta.tsx` | MOVED from `components/` |
| `app/stockplus/page.tsx` | NEW |
| `app/stockplus/layout.tsx` | NEW |
| `app/layout.tsx` | MODIFIED |
| `app/page.tsx` | REPLACED |
