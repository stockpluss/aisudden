<!-- dotclaude-config
working_directory: .dc_workspace
base_branch: main
language: ko_KR
worktree_path: ../aisudden-feature-cicd-complete
doc_dir: 2026_03_23-cicd-complete
-->

# CI/CD Complete - Specification

## Overview

- **Goal**: CI/CD 완전성 확인 및 보완
- **Problem**: 여러 도메인 페이지(stockplus.im, shinjeong.vc)가 한 repo에 있음. 모든 도메인에 대해 성공적으로 빌드 + 배포가 되고 있는지 확인 필요. nginx + certbot 설정도 CI/CD에서 관리할 수 있도록 개선.
- **Target Version**: 2.1.0

## Current State

- GitHub Actions workflow exists: `.github/workflows/deploy.yml`
  - Trigger: push to main
  - Steps: rsync → pnpm install → build → PM2 restart
- nginx: managed on EC2 server only at path stored in GitHub variable `NGINX_CONFIG_PATH`
- certbot: auto-renewal via systemd timer
- No monitoring/alerting currently

## Functional Requirements

- [ ] **FR-1: Domain Health Check**
  - After deployment, verify each domain responds with HTTP 200
  - Domains: stockplus.im, shinjeong.vc (and www variants)
  - Fail deployment if any domain health check fails

- [ ] **FR-2: Slack Notifications**
  - Send Slack notification on deployment success/failure
  - Use `LANDING_PAGE_DEPLOYER_TOKEN` GitHub secret
  - On failure: tag `<@U09ML6H3EBY>` for immediate attention

- [ ] **FR-3: nginx Management (server-side only, NOT in repo)**
  - Before nginx config changes: backup `nginx.conf` → `nginx.conf.old`
  - Add version comment on first line of `nginx.conf` (e.g., `# v2.1.0 - 2026-03-23`)
  - Validate with `nginx -t` before applying
  - On `nginx -t` failure: rollback from `.old` + Slack notification
  - Use `NGINX_CONFIG_PATH` GitHub variable for server path

- [ ] **FR-4: Build Validation**
  - Ensure all domains build successfully
  - On build failure: stop deployment + Slack notification

## Non-Functional Requirements

- [ ] **NFR-1: Security**
  - CI/CD secrets must be safely stored in GitHub Secrets
  - Clear error messages when secrets are missing
  - No secrets exposed in logs

- [ ] **NFR-2: Monitoring**
  - Slack alerts for deployment success/failure
  - Deployment status visible in GitHub Actions UI

## Constraints

- Follow existing codebase patterns
- Use existing GitHub Actions infrastructure
- nginx.conf stays on server only (not version-controlled in repo)
- Use GitHub Secrets/Variables: `EC2_SSH_KEY`, `EC2_HOST`, `LANDING_PAGE_DEPLOYER_TOKEN`, `NGINX_CONFIG_PATH`

## Out of Scope

- certbot SSL monitoring (auto-renewal handles this)
- Docker containerization
- Staging/preview environments
- Multi-environment (dev/staging/prod) pipeline

## Analysis Results

### Related Code

| # | File | Relationship |
|---|------|--------------|
| 1 | `.github/workflows/deploy.yml` | Existing CI/CD pipeline to enhance |
| 2 | `middleware.ts` | Domain routing (stockplus.im, shinjeong.vc) |
| 3 | `next.config.mjs` | Build configuration |
| 4 | `.env.local.example` | Environment variable definitions |

### Conflicts Identified

| # | Existing Behavior | Required Behavior | Resolution |
|---|-------------------|-------------------|------------|
| 1 | deploy.yml has no health checks | Need domain health checks | Add health check step after PM2 restart |
| 2 | No Slack notifications | Need success/failure alerts | Add Slack notification steps |
| 3 | nginx managed manually | Need automated nginx management in CI/CD | Add nginx backup/validate/apply steps |

### Edge Cases

| # | Case | Expected Behavior |
|---|------|-------------------|
| 1 | Build fails | Stop deployment, send Slack with @mention |
| 2 | nginx -t fails | Rollback to .old, send Slack alert |
| 3 | Concurrent pushes | GitHub Actions concurrency handles this |
| 4 | Secret missing | Clear error message in workflow output |

## GitHub Secrets/Variables Summary

| Name | Type | Purpose |
|------|------|---------|
| `EC2_SSH_KEY` | Secret | SSH private key for EC2 |
| `EC2_HOST` | Secret | EC2 instance host |
| `LANDING_PAGE_DEPLOYER_TOKEN` | Secret | Slack Bot token for notifications |
| `NGINX_CONFIG_PATH` | Variable | Absolute path to nginx.conf on server |
