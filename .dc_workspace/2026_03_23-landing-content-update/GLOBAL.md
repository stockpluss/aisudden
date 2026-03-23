# Landing Content Update - Global Documentation

## Feature Overview

### Purpose
Update the shinjeong.vc landing page text, content, and layout to better communicate the core service value proposition.

### Problem
The current landing page text and structure do not accurately convey the service's core value. On mobile, the hero section's top padding is too large, preventing the scroll cue from appearing in the first viewport.

### Solution
Apply targeted text/layout edits across 5 existing files, delete 1 unused component file, and reduce hero section padding for mobile.

## Architecture Decision

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Single phase execution | All changes are independent text/layout edits with no inter-dependency |
| 2 | Delete `performance-section.tsx` entirely | Cleaner than leaving dead code; component is fully removed from page |
| 3 | Remove STATS array inline | Simply delete the constant and its rendering block from hero-section.tsx |
| 4 | Adjust hero padding with responsive Tailwind classes | Use `py-4` on mobile (replacing `py-10`) for FR-09 |

## Data Model

No data model changes. All modifications are presentation-layer only.

## Phase Overview

| Phase | Description | Status | Dependencies |
|-------|-------------|--------|--------------|
| 1 | Landing Content Update - text edits, section removal, layout adjustment | Complete | None |

## File Structure

### Files to Modify

| File | Changes |
|------|---------|
| `components/shinjeong/hero-section.tsx` | FR-01 (headline), FR-02 (remove STATS), FR-09 (reduce padding) |
| `components/shinjeong/stats-section.tsx` | FR-04 (heading text), FR-05 (add description text below grid) |
| `components/shinjeong/site-footer.tsx` | FR-03 (business info), FR-06 (subtitle text) |
| `components/shinjeong/fixed-cta.tsx` | FR-07 (CTA button text and heading) |
| `app/shinjeong/page.tsx` | FR-08 (remove PerformanceSection import and usage) |

### Files to Delete

| File | Reason |
|------|--------|
| `components/shinjeong/performance-section.tsx` | FR-08 - entire component removed from page |
