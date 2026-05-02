# 초저가알리미 — 배포 가이드

## 빠른 시작 (로컬 테스트 — 3분)

```bash
cd backend
cp .env.example .env    # 환경변수 파일 생성 (수정 불필요)
npm install
npm start               # http://localhost:4000 에서 즉시 실행
```
> MongoDB/Firebase 없이 **인메모리 모드**로 바로 동작합니다.
> 브라우저에서 `http://localhost:4000/api/deals` 접속 → 실시간 뽐뿌 핫딜 확인!

---

## 상용 배포 (무료 — 약 30분)

### Step 1. MongoDB Atlas 무료 DB 생성

1. https://www.mongodb.com/cloud/atlas/register 접속 → 회원가입 (Google 로그인 가능)
2. **"Build a Database"** 클릭
3. **M0 Free** 선택 → Region: `Seoul (ap-northeast-2)` → **"Create Deployment"**
4. Database Access → **"Add New Database User"**
   - Username: `hotdeal`
   - Password: 자동 생성 → **복사해두기**
   - Role: `Atlas Admin`
5. Network Access → **"Add IP Address"** → **"Allow Access from Anywhere"** (0.0.0.0/0)
6. Database → **"Connect"** → **"Drivers"** → 연결 문자열 복사
   ```
   mongodb+srv://hotdeal:<password>@cluster0.xxxxx.mongodb.net/hotdeal?retryWrites=true&w=majority
   ```
   > `<password>` 부분을 4번에서 만든 비밀번호로 교체

### Step 2. Render 백엔드 배포

1. https://render.com 접속 → GitHub 로그인
2. **"New +"** → **"Web Service"**
3. GitHub 리포지토리 **`Lowest_price_notification`** 연결
4. 설정:
   - **Name:** `hotdeal-api`
   - **Region:** `Singapore`
   - **Root Directory:** `backend`
   - **Runtime:** `Docker`
   - **Instance Type:** `Free`
5. **Environment Variables** 추가:
   | Key | Value |
   |---|---|
   | `PORT` | `4000` |
   | `MONGODB_URI` | Step 1에서 복사한 연결 문자열 |
6. **"Create Web Service"** 클릭 → 자동 빌드 & 배포 (약 5분)
7. 배포 완료 후 URL 확인: `https://hotdeal-api-xxxx.onrender.com`

### Step 3. 프론트엔드 API URL 업데이트

`frontend/src/services/api.ts` 파일에서:
```typescript
const BASE_URL = __DEV__
  ? 'http://10.0.2.2:4000/api'
  : 'https://hotdeal-api-xxxx.onrender.com/api';  // ← Render URL로 변경
```

### Step 4. Expo 계정 & EAS Build

1. https://expo.dev 접속 → 회원가입
2. 터미널에서:
   ```bash
   npm install -g eas-cli
   eas login           # 가입한 계정으로 로그인
   cd frontend
   eas build --platform android --profile preview
   ```
3. 빌드 완료 (약 15분) → APK 다운로드 링크 제공 → 폰에 설치

### Step 5. GitHub Actions CI/CD 활성화

GitHub 리포지토리 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Secret 이름 | 값 | 용도 |
|---|---|---|
| `RENDER_DEPLOY_HOOK_URL` | Render 대시보드 → Settings → Deploy Hook URL | 자동 배포 |
| `EXPO_TOKEN` | expo.dev → Settings → Access Tokens → 생성 | EAS 빌드 |

> 이후 main 브랜치에 push하면 **자동으로 백엔드 배포 + APK 빌드**됩니다.

---

## (선택) Firebase 푸시 알림 설정

> 푸시 알림 없이도 앱은 정상 동작합니다. 나중에 추가해도 됩니다.

1. https://console.firebase.google.com → 프로젝트 생성 (`hotdeal-app`)
2. 프로젝트 설정 → **서비스 계정** → **새 비공개 키 생성**
3. JSON 파일에서 아래 값을 Render 환경변수에 추가:
   | Key | JSON 필드 |
   |---|---|
   | `FIREBASE_PROJECT_ID` | `project_id` |
   | `FIREBASE_CLIENT_EMAIL` | `client_email` |
   | `FIREBASE_PRIVATE_KEY` | `private_key` (전체 복사) |

---

## 아키텍처 요약

```
[뽐뿌 크롤링] → [Node.js Backend (Render 무료)]
                    ↕ MongoDB Atlas (무료)
                    ↕ FCM 푸시 (무료, 선택)
                    ↓
              [React Native App (Expo EAS 빌드)]
```

**월 운영비: ₩0**
