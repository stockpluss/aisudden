# PHASE 4: Environment Config + CSS Animations

## Objective

1. Add shinjeong-specific CSS animations to `app/globals.css`.
2. Update `.env.local.example` with shinjeong environment variables.

## File Changes

### 4.1 Modify `app/globals.css` - Add Shinjeong Animations

The shinjeong components use three CSS animations defined in the download's `globals.css`
(lines 98-125). These must be appended to the existing `app/globals.css`.

**Existing animations in `app/globals.css`** (lines 147-173):
- `@keyframes float` (lines 147-155) - used by stockplus
- `@keyframes pulse-glow` (lines 157-163) - used by stockplus
- `.animate-float` (lines 167-169)
- `.animate-pulse-glow` (lines 171-173)

**Animations to ADD** (from download `globals.css`):

```css
/* Shinjeong-specific animations */
@keyframes scan-line {
  0% { transform: translateY(-100%); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(2000%); opacity: 0; }
}

.animate-scan {
  animation: scan-line 3s ease-in-out infinite;
}

@keyframes progress-fill {
  0% { width: 0%; }
  100% { width: var(--target-width); }
}

.animate-progress {
  animation: progress-fill 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
```

**Note on `float-up` vs `float`**: The download defines `@keyframes float-up` and binds
it to `.animate-float`. The existing codebase already has `@keyframes float` bound to
`.animate-float`. The shinjeong `hero-section.tsx` does NOT actually use the `.animate-float`
class (it uses inline transition styles for progress bars). So no conflict. However,
if shinjeong components are found to use `.animate-float`, the existing `float` keyframes
at `translateY(-20px)` are close enough to `float-up` at `translateY(-10px)`. No change needed.

**Append location**: After line 173 (end of `.animate-pulse-glow` block).

### 4.2 Modify `.env.local.example`

**Current file** (12 lines): Contains stockplus-specific env vars.

**Append** shinjeong env vars:

```bash
# Shinjeong (shinjeong.vc)
SHINJEONG_APPS_SCRIPT_URL=https://GOOGLE_APPS_SCRIPT_DEPLOY_URL_HERE
SHINJEONG_SECRET_TOKEN=SECRET_KEY_SET_INTO_SCRIPT_HERE
SHINJEONG_KAKAO_TEMPLATE_ID=          # Leave empty to skip alimtalk
```

## Checklist

- [ ] Append `scan-line` keyframes and `.animate-scan` class to `app/globals.css`
- [ ] Append `progress-fill` keyframes and `.animate-progress` class to `app/globals.css`
- [ ] Add shinjeong env vars to `.env.local.example`
- [ ] Verify `pnpm build` succeeds
- [ ] Verify shinjeong hero section scan-line animation works visually
- [ ] Verify no CSS conflicts with existing stockplus animations

## Files Modified

| File | Action |
|------|--------|
| `app/globals.css` | MODIFIED (append animations) |
| `.env.local.example` | MODIFIED (append shinjeong vars) |
