# CI/CD Complete - Design Document

## Feature Overview

- **Purpose**: Enhance the existing GitHub Actions deploy workflow with health checks, Slack notifications, nginx management, and build validation.
- **Problem**: The current `deploy.yml` is a minimal rsync + build + PM2 restart pipeline with no monitoring, no rollback, and no notification. Multiple domains (stockplus.im, shinjeong.vc) are served from one repo, but there is no verification that all domains are healthy after deployment.
- **Solution**: Modify the single `deploy.yml` file to add concurrency control, secret validation, separated build steps, nginx backup/validate/reload with rollback, domain health checks, and Slack notifications.

## Architecture Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | All changes in single `deploy.yml` file | Minimal scope; single workflow already exists |
| 2 | Inline shell scripts, not reusable composite actions | YAGNI; complexity does not warrant extraction |
| 3 | Slack via `curl` to Slack Web API (`chat.postMessage`) | No marketplace action dependency; bot token already available |
| 4 | Health checks via `curl` with retry | Simple, no extra tooling needed |
| 5 | nginx management via SSH commands | Config lives on server only (not in repo) |
| 6 | Split build and deploy into separate steps | Enables fail-fast on build failure before touching nginx/PM2 |
| 7 | Use `if: failure()` and `if: success()` for Slack notifications | Native GitHub Actions conditional; clean separation of success/failure paths |
| 8 | Concurrency group to prevent overlapping deploys | Avoids race conditions on simultaneous pushes to main |

## Data Model

### GitHub Secrets/Variables

| Name | Type | Purpose |
|------|------|---------|
| `EC2_SSH_KEY` | Secret | SSH private key for EC2 access |
| `EC2_HOST` | Secret | EC2 instance hostname/IP |
| `LANDING_PAGE_DEPLOYER_TOKEN` | Secret | Slack Bot OAuth token (`xoxb-...`) |
| `SLACK_CHANNEL_ID` | Secret | Slack channel ID for notifications |
| `NGINX_CONFIG_PATH` | Variable | Absolute path to nginx.conf on the EC2 server |

## File Structure

| File | Action | Description |
|------|--------|-------------|
| `.github/workflows/deploy.yml` | Modify | Enhance existing workflow with all new steps |

## Proposed Workflow Step Order

The final `deploy.yml` will have these steps in order within a single `deploy` job:

```
 1. Checkout
 2. Validate Secrets/Variables
 3. Setup SSH
 4. Rsync to EC2
 5. Install Dependencies (SSH)
 6. Build (SSH) -- stops on failure (FR-4)
 7. nginx: Backup config (SSH)
 8. nginx: Add version comment (SSH)
 9. nginx: Validate with nginx -t (SSH)
10. nginx: Reload (SSH) -- or rollback on failure (FR-3)
11. PM2 Restart (SSH)
12. Health Checks -- curl each domain (FR-1)
13. Slack: Success Notification (if: success()) (FR-2)
14. Slack: Failure Notification (if: failure()) (FR-2)
```

## Phase Overview

| Phase | Description | Status | Dependencies |
|-------|-------------|--------|--------------|
| 1 | Core Workflow Enhancement | Complete | None |
| 2 | Verification and Polish | Not Started | Phase 1 |

---

# Phase 1: Core Workflow Enhancement

## Objective

Rewrite `.github/workflows/deploy.yml` to implement the full step order above, covering all functional requirements (FR-1 through FR-4) and non-functional requirements (NFR-1, NFR-2).

## Prerequisites

- Access to the repository at `.github/workflows/deploy.yml`
- Understanding of existing secrets: `EC2_SSH_KEY`, `EC2_HOST`, `LANDING_PAGE_DEPLOYER_TOKEN`
- Understanding of existing variable: `NGINX_CONFIG_PATH`

## Instructions

### 1. Add Concurrency Group

At the top level of the workflow (same level as `name`, `on`, `jobs`), add:

```yaml
concurrency:
  group: deploy-production
  cancel-in-progress: false
```

This prevents overlapping deploys. `cancel-in-progress: false` means a queued deploy waits rather than cancelling the running one.

### 2. Add Secret/Variable Validation Step

Add a new step after checkout and before Setup SSH. This step must run a shell script that checks each required secret/variable is non-empty. Use `if` conditions or shell tests. Print a clear error message naming the missing secret/variable, then `exit 1`.

Required checks:
- `secrets.EC2_SSH_KEY` is non-empty
- `secrets.EC2_HOST` is non-empty
- `secrets.LANDING_PAGE_DEPLOYER_TOKEN` is non-empty
- `vars.NGINX_CONFIG_PATH` is non-empty

Use environment variables to pass secrets into the shell without exposing values. For example:

```yaml
env:
  HAS_SSH_KEY: ${{ secrets.EC2_SSH_KEY != '' }}
  HAS_HOST: ${{ secrets.EC2_HOST != '' }}
  HAS_SLACK_TOKEN: ${{ secrets.LANDING_PAGE_DEPLOYER_TOKEN != '' }}
  HAS_NGINX_PATH: ${{ vars.NGINX_CONFIG_PATH != '' }}
```

Then in the shell script, check each `HAS_*` variable equals `'true'`. This avoids printing secret values.

### 3. Keep Existing Checkout and Setup SSH Steps

The existing `actions/checkout@v4` and SSH setup steps remain as-is. No changes needed.

### 4. Keep Existing Rsync Step

The existing rsync step remains as-is.

### 5. Split Build into Separate Steps

Replace the current single "Build and Restart" step with two separate SSH steps:

**Step 5a: Install Dependencies**
- SSH into EC2
- `source ~/.nvm/nvm.sh`
- Set pnpm PATH
- `cd /home/ubuntu/aisudden`
- `pnpm install --frozen-lockfile`

**Step 5b: Build**
- SSH into EC2
- Same environment setup (nvm, pnpm PATH)
- `cd /home/ubuntu/aisudden`
- `pnpm run build`
- If this step fails, the job stops (GitHub Actions default behavior). The failure notification step (step 14) will fire due to `if: failure()`.

### 6. nginx Management Steps

Add four sequential steps, all running via SSH on EC2. Each step must use `sudo` for nginx commands.

**Step 6a: nginx Backup**
- `sudo cp $NGINX_CONFIG_PATH ${NGINX_CONFIG_PATH}.old`
- Use `vars.NGINX_CONFIG_PATH` passed via environment variable

**Step 6b: nginx Add Version Comment**
- Use `sed` to insert/replace the first-line version comment
- Format: `# v2.1.0 - 2026-03-23 - deployed from commit ${{ github.sha }}`
- Command: `sudo sed -i '1s/^# v.*$/# v2.1.0 - $(date +%Y-%m-%d) - ${{ github.sha }}/' $NGINX_CONFIG_PATH`
- If line 1 is not already a version comment, insert it: `sudo sed -i '1i\# v2.1.0 - $(date +%Y-%m-%d) - ${{ github.sha }}' $NGINX_CONFIG_PATH`
- A simpler approach: always remove existing version comment line if present, then insert new one at line 1.

**Step 6c: nginx Validate**
- `sudo nginx -t`
- If this fails, must rollback. Use a combined script:

```bash
if ! sudo nginx -t; then
  echo "nginx validation failed, rolling back..."
  if [ -f "${NGINX_CONFIG_PATH}.old" ]; then
    sudo cp "${NGINX_CONFIG_PATH}.old" "$NGINX_CONFIG_PATH"
  fi
  exit 1
fi
```

**Step 6d: nginx Reload**
- `sudo nginx -s reload`

Pass `NGINX_CONFIG_PATH` as an environment variable in each step:
```yaml
env:
  NGINX_CONFIG_PATH: ${{ vars.NGINX_CONFIG_PATH }}
```

### 7. PM2 Restart Step

- SSH into EC2
- `source ~/.nvm/nvm.sh && cd /home/ubuntu/aisudden && pm2 restart aisudden`

### 8. Health Check Step

Add a step that checks all four domains. Use `curl` with retry logic. Example approach:

```bash
DOMAINS="stockplus.im www.stockplus.im shinjeong.vc www.shinjeong.vc"
FAILED=0
for domain in $DOMAINS; do
  HTTP_CODE=$(curl -o /dev/null -s -w "%{http_code}" --retry 3 --retry-delay 5 --max-time 10 "https://${domain}")
  if [ "$HTTP_CODE" -ne 200 ]; then
    echo "FAIL: ${domain} returned HTTP ${HTTP_CODE}"
    FAILED=1
  else
    echo "OK: ${domain} returned HTTP 200"
  fi
done
if [ "$FAILED" -eq 1 ]; then
  exit 1
fi
```

### 9. Slack Success Notification

Add a step with `if: success()`. Use `curl` to call Slack `chat.postMessage`:

```yaml
- name: Slack Notification (Success)
  if: success()
  env:
    SLACK_TOKEN: ${{ secrets.LANDING_PAGE_DEPLOYER_TOKEN }}
    SLACK_CHANNEL: ${{ secrets.SLACK_CHANNEL_ID }}
  run: |
    curl -X POST https://slack.com/api/chat.postMessage \
      -H "Authorization: Bearer $SLACK_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"channel\": \"$SLACK_CHANNEL\",
        \"text\": \"Deployment successful: aisudden @ ${GITHUB_SHA::7}\",
        \"attachments\": [{
          \"color\": \"#36a64f\",
          \"fields\": [
            {\"title\": \"Repository\", \"value\": \"${{ github.repository }}\", \"short\": true},
            {\"title\": \"Branch\", \"value\": \"${{ github.ref_name }}\", \"short\": true},
            {\"title\": \"Commit\", \"value\": \"${{ github.sha }}\", \"short\": false},
            {\"title\": \"Action\", \"value\": \"<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Run>\", \"short\": false}
          ]
        }]
      }"
```

### 10. Slack Failure Notification

Add a step with `if: failure()`. Same curl pattern but with red color and `<@U09ML6H3EBY>` mention:

```yaml
- name: Slack Notification (Failure)
  if: failure()
  env:
    SLACK_TOKEN: ${{ secrets.LANDING_PAGE_DEPLOYER_TOKEN }}
    SLACK_CHANNEL: ${{ secrets.SLACK_CHANNEL_ID }}
  run: |
    curl -X POST https://slack.com/api/chat.postMessage \
      -H "Authorization: Bearer $SLACK_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"channel\": \"$SLACK_CHANNEL\",
        \"text\": \"Deployment FAILED: aisudden @ ${GITHUB_SHA::7} <@U09ML6H3EBY>\",
        \"attachments\": [{
          \"color\": \"#ff0000\",
          \"fields\": [
            {\"title\": \"Repository\", \"value\": \"${{ github.repository }}\", \"short\": true},
            {\"title\": \"Branch\", \"value\": \"${{ github.ref_name }}\", \"short\": true},
            {\"title\": \"Commit\", \"value\": \"${{ github.sha }}\", \"short\": false},
            {\"title\": \"Action\", \"value\": \"<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Run>\", \"short\": false}
          ]
        }]
      }"
```

**Important**: Both Slack notification steps must have `if: always() && (success())` / `if: always() && (failure())` pattern, OR more precisely: the failure notification needs `if: failure()` which triggers when any previous step failed. However, since `if: failure()` will skip if the job was cancelled, this is acceptable behavior.

**Security note**: The `SLACK_TOKEN` is passed as an env var and used via `$SLACK_TOKEN` in shell -- it will NOT appear in logs because GitHub Actions automatically masks secrets in output.

## Completion Checklist

- [x] Concurrency group added at workflow level -- Verified in deploy.yml:7-9
- [x] Secret/variable validation step added (checks 5 values: EC2_SSH_KEY, EC2_HOST, LANDING_PAGE_DEPLOYER_TOKEN, SLACK_CHANNEL_ID, NGINX_CONFIG_PATH) -- Verified in deploy.yml:17-49
- [x] Build split into install + build steps (separate SSH commands) -- Verified in deploy.yml:72-82
- [x] nginx backup step creates `.old` copy -- Verified in deploy.yml:84-89
- [x] nginx version comment step updates first line -- Verified in deploy.yml:91-97
- [x] nginx validate step runs `nginx -t` with rollback on failure -- Verified in deploy.yml:99-113
- [x] nginx reload step runs `nginx -s reload` -- Verified in deploy.yml:115-119
- [x] PM2 restart is a separate step (after nginx success) -- Verified in deploy.yml:121-125
- [x] Health check step curls all 4 domains with retry -- Verified in deploy.yml:127-142
- [x] Slack success notification (green, `if: success()`) -- Verified in deploy.yml:144-165
- [x] Slack failure notification (red, `if: failure()`, includes `<@U09ML6H3EBY>`) -- Verified in deploy.yml:167-188
- [x] No secret values exposed in logs (use env vars, not inline expressions in echo/curl body where avoidable) -- All secrets in env: blocks only

## Notes

- nginx operations run on EVERY deployment, not just when config changes. This is intentional -- it ensures the version comment is always up to date and validates config integrity.
- The `NGINX_CONFIG_PATH` is a GitHub **Variable** (not Secret), accessed via `vars.NGINX_CONFIG_PATH`.
- `LANDING_PAGE_DEPLOYER_TOKEN` is the Slack bot OAuth token (format: `xoxb-...`).
- The `if: failure()` condition triggers when ANY previous step in the job has failed. This means even an nginx rollback failure will trigger the Slack failure notification.

---

# Phase 1: Test Cases

## Test Coverage Target

>= 70% of workflow paths covered by manual verification checklist.

## YAML Syntax Validation

- [x] TC-1.1: Run `yamllint` or equivalent on `deploy.yml` -- no syntax errors (validated with python3 yaml.safe_load)
- [ ] TC-1.2: Run `actionlint` on `deploy.yml` -- N/A: actionlint not available in environment

## Secret/Variable Validation Step

- [x] TC-2.1: When all secrets are present, step passes and workflow continues -- verified step logic at lines 24-49
- [x] TC-2.2: When `EC2_SSH_KEY` is empty/missing, step fails with clear message naming the missing secret -- verified at line 27
- [x] TC-2.3: When `NGINX_CONFIG_PATH` variable is empty/missing, step fails with clear message -- verified at line 42

## Build Steps

- [x] TC-3.1: When `pnpm install` fails, workflow stops before build step -- separate steps, GitHub Actions default fail-fast behavior
- [x] TC-3.2: When `pnpm run build` fails, workflow stops before nginx steps; Slack failure notification fires -- `if: failure()` on line 168
- [x] TC-3.3: When build succeeds, workflow proceeds to nginx steps -- sequential step order confirmed

## nginx Management

- [x] TC-4.1: Backup step creates `${NGINX_CONFIG_PATH}.old` as a copy of current config -- verified at line 89
- [x] TC-4.2: Version comment step adds/replaces first line with version + date + commit SHA -- verified at line 97
- [x] TC-4.3: When `nginx -t` succeeds, workflow proceeds to reload -- sequential step order confirmed
- [x] TC-4.4: When `nginx -t` fails, config is rolled back from `.old` file, and step exits with failure -- verified at lines 104-113
- [x] TC-4.5: When `nginx -t` fails AND `.old` file does not exist, step exits with failure (no crash) -- `if [ -f ... ]` guard at line 106
- [x] TC-4.6: `nginx -s reload` runs only after successful `nginx -t` -- validate step exits 1 on failure, blocking reload

## PM2 Restart

- [x] TC-5.1: PM2 restart runs only after successful nginx reload -- sequential step order confirmed
- [x] TC-5.2: PM2 restart failure triggers Slack failure notification -- `if: failure()` on line 168

## Health Checks

- [x] TC-6.1: All 4 domains return HTTP 200 -- step passes -- verified logic at lines 131-142
- [x] TC-6.2: One domain returns non-200 -- step fails, output names the failing domain -- FAIL message at line 134
- [x] TC-6.3: Domain is unreachable -- curl retry logic retries 3 times before failing -- `--retry 3` at line 132
- [x] TC-6.4: Health check URLs match the domains in `middleware.ts` (stockplus.im, www.stockplus.im, shinjeong.vc, www.shinjeong.vc) -- confirmed match

## Slack Notifications

- [x] TC-7.1: On full success, green notification is sent with repo, branch, commit, and run link -- verified at lines 144-165
- [x] TC-7.2: On any failure, red notification is sent with `<@U09ML6H3EBY>` mention -- verified at lines 167-188
- [x] TC-7.3: Slack token is not visible in GitHub Actions logs -- passed via env: block, GitHub auto-masks secrets
- [x] TC-7.4: If Slack API is unreachable, the notification step itself fails (acceptable -- does not break deployment) -- curl would fail, step exits non-zero

## Concurrency

- [x] TC-8.1: Two simultaneous pushes to main -- second deploy waits for first to complete (not cancelled) -- `cancel-in-progress: false` at line 9

## Edge Cases

- [x] TC-9.1: First-ever deployment (no `.old` nginx backup exists yet) -- backup step creates it, validate step handles missing `.old` gracefully via `if [ -f ... ]` guard at line 106
- [x] TC-9.2: Very long build time -- no artificial timeout causes premature failure (GitHub Actions default 6-hour limit applies) -- no timeout-minutes set

---

# Phase 2: Verification and Polish

## Objective

Validate the workflow written in Phase 1. Fix any issues found during review. Ensure correctness of YAML syntax, secret references, conditional logic, and edge case handling.

## Prerequisites

- Phase 1 completed (all checklist items checked)

## Instructions

### 1. Validate YAML Syntax

- Open `.github/workflows/deploy.yml`
- Verify proper indentation (2-space YAML standard for GitHub Actions)
- Verify all string values that contain `${{ }}` expressions are properly quoted
- Verify no trailing whitespace or missing colons

### 2. Verify Secret/Variable References

- Confirm all `secrets.*` references match actual GitHub Secret names: `EC2_SSH_KEY`, `EC2_HOST`, `LANDING_PAGE_DEPLOYER_TOKEN`, `SLACK_CHANNEL_ID`
- Confirm `vars.NGINX_CONFIG_PATH` uses `vars` (not `secrets`)
- Confirm no secret is used in a `run:` block via direct `${{ secrets.* }}` interpolation (use `env:` mapping instead)

### 3. Verify `if:` Conditions

- Success notification: must trigger only when ALL steps succeeded
- Failure notification: must trigger when ANY step failed
- Confirm `if: success()` and `if: failure()` are used correctly
- Verify that notification steps do NOT have dependencies that would prevent them from running (e.g., they should not depend on a step that itself may have been skipped)

### 4. Confirm nginx Rollback Edge Case

- Review the nginx validate step script
- Confirm it handles the case where `.old` file does not exist (first deployment scenario)
- The `if [ -f ... ]` check in the rollback block handles this

### 5. Verify Health Check URLs

- Cross-reference health check domains with `middleware.ts` domain list
- Confirm all 4 domains are present: `stockplus.im`, `www.stockplus.im`, `shinjeong.vc`, `www.shinjeong.vc`
- Confirm HTTPS is used (not HTTP)

### 6. Security Review

- Verify no step uses `echo` or `printf` with a secret value
- Verify Slack token is passed via `env:` block, not inline in `run:` script
- Verify SSH key is written to file, not echoed to stdout

## Completion Checklist

- [ ] YAML syntax is valid (no parse errors)
- [ ] All secret references match actual secret names
- [ ] `vars.NGINX_CONFIG_PATH` correctly uses `vars` prefix
- [ ] `if: success()` and `if: failure()` are on correct notification steps
- [ ] nginx rollback handles missing `.old` file
- [ ] Health check URLs match middleware.ts domains (all 4 present, HTTPS)
- [ ] No secrets exposed in logs

## Notes

- This phase produces minimal code changes (only fixes found during review).
- If no issues are found, this phase results in no file modifications -- just a confirmed review.

---

# Phase 2: Test Cases

## Test Coverage Target

>= 70% -- primarily re-validation of Phase 1 test cases after any fixes.

## Re-validation

- [ ] TC-R1: Re-run all Phase 1 test cases (TC-1.1 through TC-9.2) after any fixes
- [ ] TC-R2: Confirm `actionlint` passes with zero errors
- [ ] TC-R3: Perform a dry-run push to a test branch and verify GitHub Actions parses the workflow without errors

## Regression

- [ ] TC-R4: Existing deployment flow (checkout, rsync, install, build, PM2 restart) still works when all new steps succeed
- [ ] TC-R5: No new files added to repository (all changes within `deploy.yml`)
