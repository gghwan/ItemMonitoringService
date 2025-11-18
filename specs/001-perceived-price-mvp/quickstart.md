# Quickstart: Perceived Price Monitoring MVP

> 이 문서는 로컬 개발 환경에서 **모바일 앱(Expo)** 과 **백엔드 API(Node/Express)** 를 함께 실행하는 방법을 설명합니다.  
> 대상 브랜치: `001-perceived-price-mvp`

---

## 1. 사전 준비

- macOS (Apple Silicon 기준)
- Node.js 20.x 이상
- npm 10.x 이상
- Expo CLI (`npx expo`로 자동 설치)
- iOS 시뮬레이터 또는 실제 iPhone (동일 Wi‑Fi 네트워크)

레포 클론이 되어 있다고 가정합니다:

```bash
git clone <this-repo>
cd ItemMonitoringService
```

---

## 2. 환경 변수 설정

### 2.1 백엔드 (`apps/perceived-price-api/.env`)

아래 예시를 참고해 `.env` 파일을 만듭니다:

```env
PORT=4000

SEOUL_PRICE_API_BASE_URL=http://115.84.165.40
CPI_URL=https://www.index.go.kr/unity/potal/main/EachDtlPageDetail.do?idx_cd=1060

# 선택: Gemini 2.5 Pro 사용 시 필수
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL_NAME=gemini-2.5-pro
```

- `GEMINI_API_KEY`를 설정하지 않으면, 백엔드는 **결정적 Fallback 로직**으로 해석 카드를 생성합니다.

### 2.2 모바일 (`apps/mobile-perceived-price/app/.env`)

모바일 앱이 백엔드에 접근할 수 있도록, **맥의 로컬 IP**를 사용해야 합니다.  
Expo 로그 또는 `ifconfig`/`ipconfig`로 IP를 확인한 뒤, 다음과 같이 설정합니다:

```env
# 예: 맥 IP가 172.30.1.43인 경우
EXPO_PUBLIC_API_BASE_URL=http://172.30.1.43:4000
```

- 시뮬레이터에서만 실행한다면 `http://localhost:4000`도 동작하지만, **실기기(iPhone)** 에서는 반드시 LAN IP를 써야 합니다.

---

## 3. 의존성 설치

### 3.1 백엔드

```bash
cd apps/perceived-price-api
npm install
```

### 3.2 모바일 앱

```bash
cd ../mobile-perceived-price/app
npm install
```

---

## 4. 서버 실행

### 4.1 백엔드 API 서버

```bash
cd apps/perceived-price-api
npm run dev
```

정상 실행 시 콘솔에 다음과 비슷한 로그가 표시됩니다:

```text
[perceived-price-api] listening on http://localhost:4000
```

헬스 체크:

```bash
curl http://localhost:4000/health
# => { "status": "ok" }
```

### 4.2 모바일 앱 (Expo)

```bash
cd apps/mobile-perceived-price/app
npx expo start -c
```

- iOS 시뮬레이터: 터미널에서 `i` 키
- 실제 iPhone: Expo 앱에서 QR 코드 스캔 (맥과 같은 Wi‑Fi 네트워크여야 함)

---

## 5. 주요 플로우 확인

### 5.1 홈 화면

1. 앱 실행 후 **위치 권한 허용**  
   - `locationStore` → `locationService`가 현재 위치를 강서구(`SEOUL_GANGSEO`)로 매핑합니다.
2. 홈 탭에서:
   - 상단 지역 라벨: `Seoul · Gangseo-gu`
   - “오늘의 체감 지수” 타이틀
   - “오늘 장바구니를 모두 구매하면…” 카드
   - 장바구니 요약, 소비 패턴, 가격 변동 TOP 섹션이 렌더링됩니다.
3. 백엔드:
   - `/v1/perceived-prices/summary?regionCode=SEOUL_GANGSEO` 호출

### 5.2 검색 → 품목 상세

1. 홈 상단 검색창 터치 → 검색 화면 진입
2. 예: “쌀” 입력 후 결과 탭 → 품목 선택
3. 상세 화면에서:
   - 내 지역 실제 가격 카드
   - 체감 기준 vs 실제 가격 카드
   - AI 해석 카드(스크롤 가능)
4. 백엔드:
   - `/v1/perceived-prices/items/RICE_10KG?regionCode=SEOUL_GANGSEO` 호출
   - `seoulPriceClient` + `cpiClient` + `geminiClient.buildInterpretation` 실행

---

## 6. 문제 발생 시 체크리스트

- 홈에서 “데이터를 불러오지 못했어요” 문구만 보일 때:
  - 백엔드 서버(`npm run dev`)가 실행 중인지 확인
  - 모바일 `.env`의 `EXPO_PUBLIC_API_BASE_URL`이 **맥 IP와 포트 4000**을 가리키는지 확인
- 상세 화면 해석 카드가 항상 동일한 문구만 표시될 때:
  - 백엔드 `.env`에 `GEMINI_API_KEY`가 설정되어 있는지 확인
  - 설정되어 있음에도 Fallback만 사용된다면, 서버 로그의 `[geminiClient] failed to call Gemini` 메시지를 확인

---

이 퀵스타트는 **로컬 개발자 온보딩**과 **spec-kit의 Phase 1 출력물(quickstart.md)** 역할을 겸합니다.  
새로운 환경에서 이 문서만 따라 하면, 모바일/백엔드/AI 파이프라인 전체를 쉽게 재현할 수 있습니다.


