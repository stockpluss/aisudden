<!-- dotclaude-config
working_directory: .dc_workspace
base_branch: develop
language: ko_KR
worktree_path: .
-->

# Google Sheets API Direct Integration - Specification

## Overview

Google Apps Script(GAS) 기반 Google Sheet 기록 방식을 Next.js 서버 측 Google Sheets API 직접 호출 방식으로 교체한다. 도메인 및 시트가 늘어날 때마다 GAS 배포를 별도로 관리해야 하는 현재 구조의 유지보수 부담을 해소하고, 새로운 시트/도메인 추가 시 최소한의 코드 변경으로 대응할 수 있도록 한다.

Target Version: **2.0.0** (current main = 1.0.0)

## Functional Requirements

- [ ] FR-1: Service Account 인증을 사용하여 서버 측에서 Google Sheets API를 직접 호출하는 공유 유틸리티 모듈(`lib/google-sheets.ts`)을 생성한다.
- [ ] FR-2: 각 도메인별로 독립된 submit-lead 액션 파일을 유지한다. 기존 파일: `app/actions/submit-lead.ts`(stockplus), `app/actions/submit-lead-shinjeong.ts`(shinjeong).
- [ ] FR-3: 각 도메인 액션 파일은 GAS fetch 호출 대신 공유 유틸리티(`lib/google-sheets.ts`)를 통해 Google Sheets API를 호출하도록 변경한다.
- [ ] FR-4: 도메인별 Google Sheet ID와 탭 이름은 환경변수로 관리한다. 패턴: `{DOMAIN}_SHEET_ID`, `{DOMAIN}_SHEET_TAB`.
- [ ] FR-5: Service Account 인증 정보는 공유 환경변수로 관리한다: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`.
- [ ] FR-6: 시트에 기록하는 데이터 형식은 기존과 동일하게 유지한다: timestamp(한국 시간), name, phone. shinjeong의 경우 source 필드를 추가로 포함한다.
- [ ] FR-7: Google Sheet 기록 성공 후 카카오 알림톡 전송 로직(`sendKakaoMessage`)은 기존과 동일하게 유지한다. 카카오 전송 실패는 전체 결과에 영향을 주지 않는다.
- [ ] FR-8: `.env.local.example` 파일을 새로운 환경변수 체계로 업데이트한다. 기존 `APPS_SCRIPT_URL`, `SECRET_TOKEN`, `SHINJEONG_APPS_SCRIPT_URL`, `SHINJEONG_SECRET_TOKEN` 항목을 제거하고 새로운 Google Sheets API 관련 변수로 교체한다.
- [ ] FR-9: `googleapis` npm 패키지를 프로젝트 의존성으로 추가한다.

## Non-Functional Requirements

- [ ] NFR-1: Service Account credential 관리는 환경변수를 통해서만 수행한다. 인증 정보가 코드에 하드코딩되거나 저장소에 커밋되지 않아야 한다.
- [ ] NFR-2: 새로운 도메인/시트 추가 시 필요한 작업을 최소화한다: 환경변수 추가 + 도메인별 액션 파일 생성만으로 대응 가능해야 한다.
- [ ] NFR-3: 기존 CTA 컴포넌트(`components/stockplus/fixed-cta.tsx`, `components/shinjeong/fixed-cta.tsx`)의 import 경로 및 호출 인터페이스에 변경이 없어야 한다. submit-lead 함수의 시그니처(`{name: string, phone: string}`)와 반환 형식(`{success: boolean, error?: string}`)을 유지한다.

## Constraints

- `feature/shinjeong.vc` 브랜치에서 직접 작업한다. 새로운 worktree를 생성하지 않는다.
- React + Next.js 이외의 추가 프레임워크를 도입하지 않는다.
- 기존 코드베이스 패턴(App Router, Server Actions, `"use server"` 디렉티브)을 따른다.
- Next.js 16 (App Router) + React 19 + TypeScript 환경을 유지한다.

## Out of Scope

- 명시적으로 제외된 항목 없음.

## Related Code

| # | File | Description |
|---|------|-------------|
| 1 | `app/actions/submit-lead.ts` (79 lines) | Stockplus용 현재 GAS POST 구현. `APPS_SCRIPT_URL` 환경변수 사용. `submitLead()` 함수 export. |
| 2 | `app/actions/submit-lead-shinjeong.ts` (68 lines) | Shinjeong용 현재 GAS POST 구현. `SHINJEONG_APPS_SCRIPT_URL` 환경변수 사용. `submitLeadShinjeong()` 함수 export. |
| 3 | `.env.local.example` (11 lines) | 현재: `APPS_SCRIPT_URL`, `SECRET_TOKEN` 포함. Shinjeong용 변수(`SHINJEONG_APPS_SCRIPT_URL`, `SHINJEONG_SECRET_TOKEN`)는 미포함 상태. |
| 4 | `components/stockplus/fixed-cta.tsx` | `submitLead`를 `@/app/actions/submit-lead`에서 import하여 호출. 변경 불필요. |
| 5 | `components/shinjeong/fixed-cta.tsx` | `submitLeadShinjeong`를 `@/app/actions/submit-lead-shinjeong`에서 import하여 호출. 변경 불필요. |
| 6 | `app/actions/send-kakao-message.ts` | Sheet 기록 후 호출됨. 변경 불필요. |

## Conflicts and Resolutions

| # | Existing Behavior | Required Behavior | Resolution |
|---|-------------------|-------------------|-----------|
| 1 | `APPS_SCRIPT_URL`, `SECRET_TOKEN` 환경변수 사용 | `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `STOCKPLUS_SHEET_ID`, `STOCKPLUS_SHEET_TAB` 환경변수 사용 | 기존 GAS 관련 환경변수를 완전히 교체. `.env.local.example` 업데이트. |
| 2 | `SHINJEONG_APPS_SCRIPT_URL`, `SHINJEONG_SECRET_TOKEN` 환경변수 사용 | `SHINJEONG_SHEET_ID`, `SHINJEONG_SHEET_TAB` 환경변수 사용 | 동일하게 교체. |
| 3 | `fetch()`로 GAS URL에 POST 요청 | `googleapis` 패키지의 Google Sheets API 클라이언트로 직접 append 호출 | 각 submit-lead 파일 내부 구현 교체. 외부 인터페이스 유지. |

## Edge Cases

| # | Case | Expected Behavior |
|---|------|-------------------|
| 1 | Service Account에 대상 시트 권한 없음 | 명확한 에러 메시지를 로그에 기록하고, 클라이언트에 `{success: false, error: "..."}` 반환. 에러 메시지에 Service Account 이메일을 시트에 공유해야 한다는 안내를 포함. |
| 2 | 환경변수에 Sheet ID 누락 또는 유효하지 않은 값 | 첫 호출 시 validation 에러 발생. 로그에 누락된 환경변수명을 명시. |
| 3 | Google API quota 초과 | Exponential backoff 재시도 구현. 최대 3회 재시도 후 실패 반환. |
| 4 | `GOOGLE_PRIVATE_KEY` 형식 오류 (줄바꿈 처리 등) | PEM 형식 파싱 시 `\n` 문자열을 실제 줄바꿈으로 변환하는 처리 포함. 파싱 실패 시 명확한 에러 메시지 기록. |

## Environment Variables

### New Variables (Required)

```
# Google Sheets Service Account (shared across all domains)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Stockplus Sheet
STOCKPLUS_SHEET_ID=spreadsheet-id-here
STOCKPLUS_SHEET_TAB=Sheet1

# Shinjeong Sheet
SHINJEONG_SHEET_ID=spreadsheet-id-here
SHINJEONG_SHEET_TAB=Sheet1
```

### Removed Variables

```
APPS_SCRIPT_URL        (replaced by STOCKPLUS_SHEET_ID + shared auth)
SECRET_TOKEN           (no longer needed - Service Account handles auth)
SHINJEONG_APPS_SCRIPT_URL  (replaced by SHINJEONG_SHEET_ID + shared auth)
SHINJEONG_SECRET_TOKEN     (no longer needed)
```

## Target Architecture

```
lib/
  google-sheets.ts          # Shared Google Sheets API client (NEW)
                            # - Service Account auth via googleapis
                            # - appendRow(sheetId, tabName, values[]) function
                            # - Exponential backoff retry logic

app/actions/
  submit-lead.ts            # Stockplus lead submission (MODIFY)
                            # - Replace GAS fetch with google-sheets.ts call
                            # - Read STOCKPLUS_SHEET_ID, STOCKPLUS_SHEET_TAB
                            # - Keep submitLead() signature and return type

  submit-lead-shinjeong.ts  # Shinjeong lead submission (MODIFY)
                            # - Replace GAS fetch with google-sheets.ts call
                            # - Read SHINJEONG_SHEET_ID, SHINJEONG_SHEET_TAB
                            # - Keep submitLeadShinjeong() signature and return type

  send-kakao-message.ts     # NO CHANGE

.env.local.example          # UPDATE with new env var template
```

## Acceptance Criteria

1. Stockplus 랜딩 페이지에서 CTA 폼 제출 시 `STOCKPLUS_SHEET_ID`로 지정된 Google Sheet에 데이터가 기록된다.
2. Shinjeong 랜딩 페이지에서 CTA 폼 제출 시 `SHINJEONG_SHEET_ID`로 지정된 Google Sheet에 데이터가 기록된다.
3. 기존 GAS 관련 환경변수(`APPS_SCRIPT_URL`, `SECRET_TOKEN`, `SHINJEONG_APPS_SCRIPT_URL`, `SHINJEONG_SECRET_TOKEN`)에 대한 의존성이 완전히 제거된다.
4. CTA 컴포넌트의 코드 변경 없이 기존과 동일하게 동작한다.
5. Sheet 기록 성공 후 카카오 알림톡이 기존과 동일하게 발송된다.
6. Service Account 권한 부재, 환경변수 누락, API quota 초과 등 에러 상황에서 적절한 에러 처리가 수행된다.
