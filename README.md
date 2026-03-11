# AISudden - 멀티 도메인 랜딩페이지 플랫폼

## 1. 프로젝트 개요

Next.js 16 기반의 멀티 도메인 랜딩페이지 플랫폼입니다. 하나의 코드베이스에서 여러 도메인의 랜딩페이지를 서빙합니다.

### 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS 4 + Radix UI
- **폼 관리**: React Hook Form + Zod
- **패키지 매니저**: pnpm
- **서버**: EC2 + nginx (리버스 프록시) + PM2 (프로세스 매니저)
- **CI/CD**: GitHub Actions (main 브랜치 push 시 자동 배포)

### 도메인 라우팅 구조

미들웨어(`middleware.ts`)가 요청의 `Host` 헤더를 읽어 도메인별 경로로 리라이트합니다.

```
stockplus.im  -->  /stockplus  (middleware rewrite)
shinjeong.vc  -->  /shinjeong  (middleware rewrite)
newdomain.com -->  /newdomain  (새 도메인 추가 시)
```

### 현재 운영 중인 도메인

| 도메인 | 내부 경로 | 설명 |
|--------|-----------|------|
| stockplus.im | `/stockplus` | AI 급등주포착 스탁플러스 |
| shinjeong.vc | `/shinjeong` | 신정VC |

---

## 2. 새 도메인 추가 가이드

새 도메인을 추가하려면 아래 6단계를 순서대로 진행합니다.

### Step 1: 코드 변경

#### 1-1. 미들웨어에 도메인 매핑 추가

`middleware.ts` 파일의 `DOMAIN_MAP`에 새 도메인을 추가합니다.

```typescript
"newdomain.com": "/newdomain",
"www.newdomain.com": "/newdomain",
```

#### 1-2. 앱 라우트 생성

`app/newdomain/` 디렉토리에 다음 파일을 생성합니다.

- **`app/newdomain/layout.tsx`**: 도메인 전용 메타데이터(title, description, favicon)와 Google Analytics 스크립트를 설정합니다. 기존 `app/layout.tsx`를 참고하여 GA ID, Google Ads ID 등을 해당 도메인용으로 변경합니다.
- **`app/newdomain/page.tsx`**: 랜딩페이지 메인 페이지입니다. `@/components/newdomain/` 에서 컴포넌트를 import합니다.

#### 1-3. 컴포넌트 생성

`components/newdomain/` 디렉토리에 랜딩페이지 컴포넌트를 생성합니다. 기존 컴포넌트 구조를 참고합니다.

```
components/newdomain/
  hero-section.tsx
  benefits-section.tsx
  trust-section.tsx
  performance-section.tsx
  footer.tsx
  fixed-cta.tsx
```

#### 1-4. Server Action 생성

`app/actions/submit-lead-newdomain.ts` 파일을 생성합니다. 기존 `app/actions/submit-lead.ts`를 참고하되, 환경변수 이름을 도메인에 맞게 변경합니다.

```typescript
// 예시: 도메인별 환경변수 사용
const response = await fetch(process.env.NEWDOMAIN_APPS_SCRIPT_URL!, { ... })
```

#### 1-5. Google Analytics 설정 (필요 시)

`lib/analytics.ts` 파일에 `SITE_ANALYTICS` 설정을 추가합니다. GA4 측정 ID, Google Ads 전환 ID 등을 도메인별로 관리합니다.

#### 1-6. 환경변수 추가

`.env.local` 파일에 새 도메인에 필요한 환경변수를 추가합니다.

```bash
# newdomain - Google Sheet 연동
NEWDOMAIN_APPS_SCRIPT_URL=https://script.google.com/macros/s/xxxxx/exec
NEWDOMAIN_SECRET_TOKEN=your_secret_token_here

# newdomain - 카카오 알림톡 (비워두면 알림톡 발송 생략)
NEWDOMAIN_KAKAO_TEMPLATE_ID=
```

### Step 2: nginx 설정

EC2 서버에서 nginx 설정 파일에 새 server 블록을 추가합니다.

```nginx
server {
    listen 80;
    server_name newdomain.com www.newdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

> **주의**: `proxy_set_header Host $host;` 설정은 반드시 포함해야 합니다. 미들웨어가 `Host` 헤더를 읽어 도메인별 라우팅을 수행하므로, 이 헤더가 누락되면 도메인 구분이 동작하지 않습니다.

설정 후 nginx를 재시작합니다.

```bash
sudo nginx -t          # 설정 문법 검증
sudo systemctl reload nginx
```

### Step 3: SSL 인증서 발급 (Let's Encrypt)

certbot을 사용하여 SSL 인증서를 발급합니다.

```bash
sudo certbot --nginx -d newdomain.com -d www.newdomain.com
```

이 명령은 자동으로 다음을 수행합니다.
- SSL 인증서 발급
- nginx 설정에 SSL 관련 설정 자동 추가 (443 포트, 인증서 경로 등)
- 인증서 자동 갱신 스케줄 등록

### Step 4: DNS 설정

도메인 등록 업체(가비아, 호스팅KR 등)에서 DNS A 레코드를 EC2 서버의 퍼블릭 IP 주소로 설정합니다.

```
newdomain.com      A    <EC2_PUBLIC_IP>
www.newdomain.com  A    <EC2_PUBLIC_IP>
```

> DNS 전파에 최대 24~48시간이 소요될 수 있습니다. 일반적으로 수 분 이내에 반영됩니다.

### Step 5: 배포

코드 변경 사항을 `main` 브랜치에 push하면 GitHub Actions가 자동으로 다음을 수행합니다.

1. 코드를 EC2로 rsync
2. `pnpm install --frozen-lockfile` 실행
3. `pnpm run build` 실행
4. `pm2 restart aisudden` 으로 서비스 재시작

### Step 6: 서버 환경변수 설정

EC2 서버에 SSH로 접속하여 `.env.local`에 환경변수를 추가합니다. 배포 시 `.env.local`은 rsync에서 제외되므로 서버에서 직접 설정해야 합니다.

```bash
ssh ubuntu@<EC2_HOST>
vi /home/ubuntu/aisudden/.env.local
# 새 도메인 환경변수 추가 후 저장

# PM2 재시작 (환경변수 반영)
cd /home/ubuntu/aisudden
pm2 restart aisudden
```

---

## 3. 로컬 개발

### 서버 실행

```bash
pnpm install
pnpm dev
```

### 도메인별 페이지 접근 방법

로컬에서 도메인별 페이지를 테스트하는 방법은 두 가지입니다.

#### 방법 1: 쿼리 파라미터 사용 (간편)

```
http://localhost:3000/?site=stockplus    # stockplus.im 페이지
http://localhost:3000/?site=shinjeong    # shinjeong.vc 페이지
```

#### 방법 2: /etc/hosts 파일 수정

`/etc/hosts` 파일에 로컬 도메인을 추가합니다.

```
127.0.0.1  stockplus.local
127.0.0.1  shinjeong.local
```

그런 다음 미들웨어의 `DOMAIN_MAP`에 로컬 도메인도 추가합니다.

```typescript
"stockplus.local:3000": "/",
"shinjeong.local:3000": "/shinjeong",
```

---

## 4. 환경변수 참조

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `APPS_SCRIPT_URL` | stockplus.im용 Google Apps Script 웹앱 URL | `https://script.google.com/macros/s/.../exec` |
| `SECRET_TOKEN` | stockplus.im용 Apps Script 인증 토큰 | SHA-256 해시값 |
| `SOLAPI_API_KEY` | SOLAPI(문자/알림톡) API Key | `NCSYGUFYOU...` |
| `SOLAPI_API_SECRET_KEY` | SOLAPI API Secret Key | `VLWGRR5I...` |
| `SOLAPI_FROM_NUMBER` | 발신 전화번호 | `01012345678` |
| `KAKAO_CHANNEL_ID` | 카카오 채널 ID (알림톡 발송용) | `KA01PF...` |
| `KAKAO_TEMPLATE_ID` | stockplus.im용 카카오 알림톡 템플릿 ID | `KA01TP...` |
| `SHINJEONG_APPS_SCRIPT_URL` | shinjeong.vc용 Google Apps Script 웹앱 URL | `https://script.google.com/macros/s/.../exec` |
| `SHINJEONG_SECRET_TOKEN` | shinjeong.vc용 Apps Script 인증 토큰 | SHA-256 해시값 |
| `SHINJEONG_KAKAO_TEMPLATE_ID` | shinjeong.vc용 알림톡 템플릿 ID (비워두면 생략) | `KA01TP...` |

> **참고**: `.env.local` 파일은 git에 커밋하지 않습니다. 서버에서 직접 관리합니다.

---

## 5. 프로젝트 디렉토리 구조

```
aisudden/
  middleware.ts               # 도메인 기반 라우팅 미들웨어
  app/
    layout.tsx                # 도메인 중립 루트 레이아웃 (공통 shell)
    page.tsx                  # localhost dev index 페이지
    globals.css               # 전역 스타일
    stockplus/                # stockplus.im 전용 라우트
      layout.tsx              # stockplus GA 스크립트 + 메타데이터
      page.tsx                # stockplus 랜딩페이지
    shinjeong/                # shinjeong.vc 전용 라우트
      layout.tsx              # shinjeong GA 스크립트 + 메타데이터
      page.tsx                # shinjeong 랜딩페이지
    actions/
      submit-lead.ts          # stockplus 리드 제출
      submit-lead-shinjeong.ts # shinjeong 리드 제출
      send-kakao-message.ts   # 카카오 알림톡 발송 (공통)
  components/
    ui/                       # shadcn/ui 공통 UI 컴포넌트
    stockplus/                # stockplus.im 전용 컴포넌트
    shinjeong/                # shinjeong.vc 전용 컴포넌트
  lib/
    utils.ts                  # cn() 유틸리티
    analytics.ts              # 도메인별 GA 전환 추적
  public/                     # 정적 파일 (이미지, 파비콘 등)
  .github/workflows/
    deploy.yml                # GitHub Actions 배포 워크플로우
```

---

## 6. 배포 아키텍처

```
[사용자] ---> [DNS] ---> [EC2 퍼블릭 IP]
                              |
                         [nginx :443]
                              |
                    proxy_pass + Host 헤더 전달
                              |
                      [Next.js :3000 (PM2)]
                              |
                    middleware.ts 도메인 라우팅
                         /        \
                 stockplus.im   shinjeong.vc
                 app/stockplus/  app/shinjeong/
```
