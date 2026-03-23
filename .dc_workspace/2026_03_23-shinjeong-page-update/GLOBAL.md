# Shinjeong Page Update - Global Documentation

## Feature Overview

**Purpose:** Update the Shinjeong landing page to remove AI-related branding, replace the stats section with static images, and rebrand from "StockPlus" to "Shinjeong Investment Group."

**Problem:** The current Shinjeong page contains AI-related text that should be removed, uses a client-side animated counter for stats that should be replaced with static images, and displays the old brand name.

**Solution:** A single-phase content update covering three functional requirements: AI text removal, stats section image replacement, and brand name change.

## Architecture Decision

- **stats-section.tsx conversion:** This component is converted from a client component ("use client") to a server component. All interactive logic (Counter component, useState, useEffect, IntersectionObserver) is removed. The new implementation uses Next.js `Image` for optimized static image rendering.
- **No structural changes:** All other modifications are text-only edits. No routing, API, or data model changes.

## Data Model

No data model changes. The STATS constant array is removed from `stats-section.tsx` and replaced with static image references.

## Phase Overview

| Phase | Description | Status | Dependencies |
|-------|-------------|--------|--------------|
| 1 | Content Update (AI text removal, stats images, brand rename) | Complete | None |

## File Structure

### Files to Modify

| File | Change Type |
|------|-------------|
| `app/shinjeong/layout.tsx` | Text edit (metadata) |
| `components/shinjeong/hero-section.tsx` | Text edit (3 locations) |
| `components/shinjeong/features-section.tsx` | Text edit (1 location) |
| `components/shinjeong/stats-section.tsx` | Full rewrite (client -> server component) |
| `components/shinjeong/site-footer.tsx` | Text edit (2 locations) |
| `components/shinjeong/fixed-cta.tsx` | Text edit (1 location) |

### Files/Directories to Create

| Path | Description |
|------|-------------|
| `public/images/shinjeong/` | Directory for stats images |
| `public/images/shinjeong/sj_gr_01.jpg` | Stats image 1 (copied from main repo root) |
| `public/images/shinjeong/sj_gr_02.jpg` | Stats image 2 (copied from main repo root) |
| `public/images/shinjeong/sj_gr_03.jpg` | Stats image 3 (copied from main repo root) |
| `public/images/shinjeong/sj_gr_04.jpg` | Stats image 4 (copied from main repo root) |

### Files NOT Touched

- All files under `app/stockplus.im/` and `components/stockplus.im/` remain unchanged.
