# 진짜 물가 (Perceived Price Monitoring Service)

**단일 가구·20–30대**를 위한 생활 물가 체감 서비스입니다.  
사용자가 검색한 품목에 대해 **실제 가격**과 **체감 기준 가격대(“기억 가격”)**를 비교하고,  
“왜 이렇게 비싸게 느껴지는지”를 **AI 해석 카드**로 설명해 줍니다.

이 레포는 GitHub spec‑kit 기반으로 설계된 **모노레포**이며:

- `apps/mobile-perceived-price` : React Native (Expo) 모바일 앱
- `apps/perceived-price-api` : Node/Express 백엔드 API
- `specs/001-perceived-price-mvp` : 전체 스펙/아키텍처/태스크 문서

---

## 1. 주요 기능 (MVP)

- **홈 – 오늘의 체감 지수**
  - 현재 위치(자치구) 기준 **오늘의 체감 인덱스** 요약
  - “오늘 장바구니를 모두 구매하면…” 카드 (추정 추가 비용)
  - 장바구니 요약, 소비 패턴(카테고리별 비중), 가격 변동 TOP 리스트

- **검색 / 품목 상세**
  - 품목 검색 (예: 쌀 10kg, 계란 30개, 우유 1L)
  - 지역별 실제 가격 vs 체감 기준 가격대 비교
  - **Gemini 2.5 Pro + RAG** 기반 해석 카드:  
    “왜 비싸게/저렴하게/비슷하게 느껴지는지”를 한국어로 설명

- **장바구니**
  - 품목 상세 화면에서 장바구니에 추가
  - 장바구니 탭에서 저장된 품목 리스트 확인 (AsyncStorage 영속화)

- **카테고리 / 지출 관리**
  - 현재는 “추후 추가 예정” 화면 (디자인 셸만 구현)
  - 카테고리별 즐겨찾기, 지출 대시보드로 확장 예정

---

## 2. 기술 스택

### 모바일 앱 (`apps/mobile-perceived-price/app`)

- React Native 0.76 + Expo SDK 52
- TypeScript 5.x
- React Navigation (Native Stack + Bottom Tabs)
- Zustand (MVI 스타일 스토어)
- `@tanstack/react-query` (데이터 패칭)
- Axios (HTTP 클라이언트)
- AsyncStorage (장바구니 영속화)
- `expo-location` (현재 위치 기반 Region)
- Pretendard 폰트 (`expo-font` + 로컬 OTF)
- i18n: 간단한 헬퍼(`t`, `tWithVars`) + `ko.ts`, `en.ts`
- 디자인 시스템
  - Figma: `생활물가_디자인시스템`
  - Kakao OROR Forge 방식의 Figma-to-Code
  - `theme/colors.ts`, `spacing.ts`, `typography.ts`
  - 공통 컴포넌트: `ScreenContainer`, `AppCard`, `SectionHeader`, `SearchBar` 등

### 백엔드 API (`apps/perceived-price-api`)

- Node.js 20+, Express
- TypeScript
- Axios (외부 API + Gemini 호출)
- `@google/generative-ai` (Gemini 2.5 Pro 클라이언트)
- `dotenv`, `cors`, `zod`
- 주요 라우터
  - `/v1/prices/...` : 서울시 물가 API 래핑
  - `/v1/inflation/cpi/latest` : CPI 요약
  - `/v1/perceived-prices/...` : 체감 기준/실제 가격/해석 카드

---

## 3. 레포 구조

```text
apps/
  mobile-perceived-price/
    app/
      App.tsx
      src/
        app/
          navigation/      # React Navigation (Stack, Tabs)
          theme/           # colors, spacing, typography
          config/          # env.ts (API base URL)
        components/        # AppCard, ScreenContainer, SearchBar, SectionHeader ...
        features/
          home/
          search/
          basket/
          category/
          expenditure/
          item-detail/
        state/             # Zustand stores (searchStore, basketStore, itemDetailStore, locationStore)
        services/          # httpClient, priceRepository, perceivedPriceRepository, locationService, basketStorage
        utils/             # analytics, perceivedIndexCalculator
        i18n/              # t, tWithVars, locales (ko/en)
        types/             # 공통 타입들 (Region, Item, PriceSnapshot, ...)
  perceived-price-api/
    src/
      index.ts             # Express 엔트리포인트
      routes/
        prices.ts          # /v1/prices/...
        cpi.ts             # /v1/inflation/cpi/latest
        perceived.ts       # /v1/perceived-prices/...
      clients/
        seoulPriceClient.ts
        cpiClient.ts
        geminiClient.ts    # Gemini 2.5 Pro + RAG + Fallback
      rag/
        knowledgeBase.ts   # RAG용 문서 껍데기 (향후 벡터 DB로 교체)
specs/
  001-perceived-price-mvp/
    spec.md
    plan.md
    tasks.md
    quickstart.md
    data-model.md
    contracts/
      seoul-price-apis.md
      national-cpi.md
    ai-architecture.md
```

---

## 4. 실행 방법 (로컬 개발)

자세한 내용은 `specs/001-perceived-price-mvp/quickstart.md` 를 참고하세요. 핵심만 요약하면:

### 4.1 백엔드 `.env` 설정

`apps/perceived-price-api/.env`:

```env
PORT=4000

SEOUL_PRICE_API_BASE_URL=http://115.84.165.40
CPI_URL=https://www.index.go.kr/unity/potal/main/EachDtlPageDetail.do?idx_cd=1060

# 선택: Gemini 2.5 Pro 사용 시
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL_NAME=gemini-2.5-pro
```

### 4.2 모바일 `.env` 설정

`apps/mobile-perceived-price/app/.env`:

```env
# 맥의 로컬 IP 기준 (예: 172.30.1.43)
EXPO_PUBLIC_API_BASE_URL=http://<YOUR_LOCAL_IP>:4000
```

> iPhone 실기기에서 테스트할 경우 반드시 `localhost`가 아닌 **맥 IP**를 사용해야 합니다.

### 4.3 의존성 설치

```bash
# 백엔드
cd apps/perceived-price-api
npm install

# 모바일 앱
cd ../mobile-perceived-price/app
npm install
```

### 4.4 서버 실행

```bash
# 백엔드 서버
cd apps/perceived-price-api
npm run dev
# -> [perceived-price-api] listening on http://localhost:4000

# 모바일 앱 (Expo)
cd ../mobile-perceived-price/app
npx expo start -c
```

iOS 시뮬레이터 또는 Expo 앱(iPhone)으로 실행합니다.

---

## 5. AI / RAG / Gemini 아키텍처

자세한 내용은 `specs/001-perceived-price-mvp/ai-architecture.md` 참조.

요약:

- 결정적 계산
  - 서울시 가격 스냅샷 + CPI + (향후) 소비 패턴 →  
    코드에서 실제 가격, 기억 가격대, diff%, 방향(비싸게/저렴하게/비슷하게) 계산.
- RAG
  - `rag/knowledgeBase.ts` 에 CPI/생활물가지수/체감 물가 설명 텍스트를 `RagDocument`로 관리.
  - `retrieveRagContext()` 로 topic 기반 관련 문서(top‑k) 검색.
- Gemini 2.5 Pro
  - `geminiClient.buildInterpretation` 이 `@google/generative-ai` 로 Gemini 2.5 Pro 호출.
  - 입력: 결정적 계산 결과 + RAG 문서 + locale
  - 출력: `{ title, body }` JSON
  - 실패 시: `generatePerceivedInterpretationFallback` (순수 함수형 해석 로직) 사용.

---

## 6. Roadmap (예정)

- 서울시 물가 API 실제 필드/파라미터에 맞춘 구현
- e-나라지표 CPI HTML 파싱 또는 정식 API 연동
- RAG: 문서 수집/임베딩/벡터스토어로 교체 (현재는 하드코딩)
- UserConsumptionProfile을 실제 카드/계좌 데이터로 채우는 파이프라인
- 카테고리/지출 관리 화면 기능 구현
- Jest 기반 유닛/통합 테스트 추가
- Railway + GitHub Actions 기반 CI/CD 파이프라인

---

> 이 README는 spec-kit 문서(`spec.md`, `plan.md`, `tasks.md`, `ai-architecture.md`, `data-model.md`, `quickstart.md`)를 기반으로 작성되었습니다.  
> 스펙 변경 시에는 먼저 `specs/001-perceived-price-mvp/` 내 문서를 업데이트하고, 필요한 부분만 README에 반영합니다.


