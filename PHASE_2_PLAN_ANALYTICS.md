# PHASE 2: Analytics Separation + Kakao Flexibility

## Objective

1. Extract `gtagReportConversion` from `lib/utils.ts` into a new `lib/analytics.ts` with
   domain-keyed configuration registry.
2. Modify `sendKakaoMessage` to accept an optional `templateId` parameter and skip alimtalk
   when not provided.
3. Update `submit-lead.ts` to pass `templateId` explicitly.

## File Changes

### 2.1 Create `lib/analytics.ts`

New file. Contains:

**Domain analytics config registry:**
```typescript
type SiteAnalyticsConfig = {
  ga4Id: string
  adsIds: { id: string; conversionLabel: string }[]
}

const SITE_ANALYTICS: Record<string, SiteAnalyticsConfig> = {
  stockplus: {
    ga4Id: "G-K45WKWMEYX",
    adsIds: [
      { id: "AW-11246851271", conversionLabel: "atwMCPTj97waEMep9fIp" },
      { id: "AW-17780944854", conversionLabel: "mF1tCNr8m8wbENbfzp5C" },
    ],
  },
  shinjeong: {
    ga4Id: "",
    adsIds: [],
  },
}
```

**`gtagReportConversion(site, name, phone)` function:**

Migrated from current `lib/utils.ts` lines 9-34. Key differences:
- Accepts `site: string` as first parameter to look up config
- Iterates over `adsIds` array from the config instead of hardcoded send_to values
- If site not found in registry or has no adsIds, silently returns (no error)
- The `user_data` set and phone normalization logic (`+82${phone.slice(1)}`) remains identical

**Export:** `getAnalyticsConfig(site: string)` for use by layout files to get GA IDs
for script tag generation.

### 2.2 Modify `lib/utils.ts`

**Current file** (35 lines): Contains `cn()` (lines 1-6) and `gtagReportConversion` (lines 8-34).

**Action**: Remove lines 8-34 (the `gtagReportConversion` function and its comment).
Keep only the `cn()` function and its imports (lines 1-6).

Result: 6 lines total.

### 2.3 Modify `components/stockplus/fixed-cta.tsx`

**Current import** (line 12): `import {gtagReportConversion} from "@/lib/utils";`

**Change to**: `import {gtagReportConversion} from "@/lib/analytics";`

**Current call** (line 62): `gtagReportConversion(formData.name.trim(), formData.phone.trim().replace(/\D/g, ""));`

**Change to**: `gtagReportConversion("stockplus", formData.name.trim(), formData.phone.trim().replace(/\D/g, ""));`

### 2.4 Modify `app/actions/send-kakao-message.ts`

**Current signature** (line 5): `export async function sendKakaoMessage(params: { to: string; name: string })`

**New signature**: `export async function sendKakaoMessage(params: { to: string; name: string; templateId?: string })`

**Add early return** at beginning of try block (after line 10):
```typescript
if (!params.templateId) {
  console.log("[kakao] Template ID not provided, skipping alimtalk")
  return { success: true, skipped: true }
}
```

**Change line 22** from `templateId: process.env.KAKAO_TEMPLATE_ID!,` to `templateId: params.templateId,`

The rest of the function remains identical.

### 2.5 Modify `app/actions/submit-lead.ts`

**Current call** (lines 54-57):
```typescript
const kakaoResult = await sendKakaoMessage({
  to: phoneNumber,
  name: formData.name,
})
```

**Change to**:
```typescript
const kakaoResult = await sendKakaoMessage({
  to: phoneNumber,
  name: formData.name,
  templateId: process.env.KAKAO_TEMPLATE_ID,
})
```

This preserves backward compatibility -- `KAKAO_TEMPLATE_ID` env var is already set for stockplus.

## Checklist

- [ ] Create `lib/analytics.ts` with `SITE_ANALYTICS` registry and `gtagReportConversion(site, name, phone)`
- [ ] Export `getAnalyticsConfig(site)` from `lib/analytics.ts`
- [ ] Remove `gtagReportConversion` from `lib/utils.ts` (keep only `cn()`)
- [ ] Update import in `components/stockplus/fixed-cta.tsx`: `@/lib/utils` -> `@/lib/analytics`
- [ ] Update call in `components/stockplus/fixed-cta.tsx`: add `"stockplus"` as first arg
- [ ] Modify `send-kakao-message.ts`: add optional `templateId` param, skip if empty
- [ ] Modify `send-kakao-message.ts`: use `params.templateId` instead of `process.env.KAKAO_TEMPLATE_ID`
- [ ] Modify `submit-lead.ts`: pass `templateId: process.env.KAKAO_TEMPLATE_ID` to `sendKakaoMessage`
- [ ] Verify `pnpm build` succeeds
- [ ] Verify no other files import `gtagReportConversion` from `@/lib/utils` (only `components/ui/*` imports `cn` from `@/lib/utils`)

## Files Modified/Created

| File | Action |
|------|--------|
| `lib/analytics.ts` | NEW |
| `lib/utils.ts` | MODIFIED (remove gtagReportConversion) |
| `components/stockplus/fixed-cta.tsx` | MODIFIED (import path + call signature) |
| `app/actions/send-kakao-message.ts` | MODIFIED (templateId param) |
| `app/actions/submit-lead.ts` | MODIFIED (pass templateId) |
