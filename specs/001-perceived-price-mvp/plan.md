# Implementation Plan: Perceived Price Monitoring MVP (React Native)

**Branch**: `001-perceived-price-mvp` | **Date**: 2025-11-14 | **Spec**: `specs/001-perceived-price-mvp/spec.md`
**Input**: Feature specification from `/specs/001-perceived-price-mvp/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This MVP delivers a mobile service called **“진짜 물가”** implemented as a React Native app for iOS and Android.  
The application lets single-person households search for items, see the gap between **regional actual prices** and their **AI-estimated perceived baseline price**, understand **why** a price feels expensive through an interpretation card, and manage a **basket** of frequently checked items.  
The mobile client will consume one or more backend APIs that expose normalized public price data (KAMIS, CPI, etc.) and AI-derived perceived price ranges; for this plan we assume those APIs exist or are mocked, and focus on the React Native client architecture, state management, and UX flows.

## Technical Context

<!-- 한국어 주석: 아래 기술 스택은 React Native 기반 클린 아키텍처를 전제로 합니다. -->

**Language/Version**: TypeScript 5.x, React Native (0.76+), JavaScript ES2020  
**Primary Dependencies**: React Navigation (stack + bottom tabs), React Query (or TanStack Query) for API data, Zustand or Redux Toolkit for MVI-style state, Axios or Fetch wrapper for HTTP, Victory Native/Recharts-like library for simple charts, react-native-permissions + geolocation for region detection  
**Storage**: Remote REST/GraphQL APIs for price and AI data (backend TBD), AsyncStorage/secure storage for local cache (basket, last region, feature flags)  
**Testing**: Jest + React Native Testing Library for unit/widget tests, optional Detox for basic end-to-end flows (search → detail, basket → detail)  
**Target Platform**: iOS 15+ and Android 8+ mobile devices  
**Project Type**: mobile (single React Native app)  
**Performance Goals**: 60 fps on main flows; initial Home screen data load within 1s on warm start with cached data and within 2.5s on cold start over 4G; smooth scrolling lists with up to ~100 items  
**Constraints**: Works with intermittent connectivity (show cached last-known prices, explicit freshness timestamps); minimal perceived latency in search autocomplete (<300ms for local filtering, <800ms for remote hits)  
**Scale/Scope**: 1 React Native app, ~6–8 main screens (Home, Search, Search Results, Category, Category Detail, Basket, Item Detail, basic Settings); user base initially <50k MAU

### Deployment / Hosting

- **Mobile app**: Built with Expo (SDK 52) and distributed via app stores/TestFlight using environment-specific `EXPO_PUBLIC_API_BASE_URL` to point at the correct backend.
- **Backend API**: Node + Express service deployed on **Railway**, which provides a continuously running container suitable for:
  - periodic ingestion of Seoul public price APIs and national CPI data
  - server-side Gemini calls using environment variables (e.g., `GEMINI_API_KEY`)
  - caching and precomputation of price snapshots and perceived indices.
- **Configuration**:
  - Backend: environment variables configured in Railway (and local `.env`) for `PORT`, `GEMINI_API_KEY`, `SEOUL_PRICE_API_BASE_URL`, `CPI_URL`.
  - Mobile: `.env` per environment with `EXPO_PUBLIC_API_BASE_URL` set to the Railway service URL (or `http://localhost:4000` in development).

### UI / Design System

<!-- 한국어 주석: "생활물가_디자인시스템" Figma와 Kakao OROR Forge 글(https://tech.kakao.com/posts/611, 612)을 그대로 참고해 Figma-to-Code 방식으로 구현합니다. -->

- **Reference Design**: Primary reference is the `생활물가_디자인시스템` Figma file, supplemented by the OROR Forge Figma-to-Code methodology from Kakao Tech Blog posts [611] and [612]. The older coffee-shop Figma는 사용하지 않습니다.
- **Design Tokens (theme)**:
  - Colors: `theme.colors` defines `primary`, `primarySoft`, `primaryStrong`, `background`, `surface`, `surfaceElevated`, `textPrimary`, `textSecondary`, `borderSoft`, `accentPositive`, `accentNegative`, `badgeBackground`, `badgeText`, `divider`, `warning`, `info`, mapped from the 생활물가 Figma palette.
  - Typography: `theme.typography` defines `heading1`, `heading2`, `subtitle`, `body`, `caption` using the **Pretendard** font family and sizes/line-heights tuned for 375px mobile, mirroring the Figma text styles.
  - Spacing: `theme.spacing` (`xs`, `sm`, `md`, `lg`, `xl`) encodes the frequently used vertical/horizontal gaps in the Figma layout so that all screens snap to the same scale.
- **Primitive Components (Figma → Code)**:
  - Layout: `ScreenContainer` centralizes background color, safe padding, and scroll behavior to match the base screen frame in the 디자인시스템.
  - Cards: `AppCard` implements the common card shell (radius, border, shadow, padding) shared by modules on Home, Basket, and Item Detail.
  - Text structure: `SectionHeader` renders section titles/subtitles using `heading2` and `caption` tokens, following the section patterns in Figma.
  - Inputs: `SearchBar` provides the rounded search field used on Home/Search, with colors and typography wired to the theme.
- **Screen Composition**:
  - Each screen (Home, Search, Basket, Category, Item Detail, Expenditure) is built by composing the primitives above, avoiding ad-hoc inline styles as much as possible.
  - Layout specs from Figma (margins, paddings, gaps) are first translated into tokens and primitive props, not copied directly into each screen, in line with the OROR Forge approach.
- **Implementation Phases**:
  - Phase 1–2: Build a thin **design shell** that matches the 생활물가 Figma screens using mocked data, verifying navigation, layout, and component hierarchy.
  - Phase 3+: Wire live data (Seoul APIs + Gemini-powered endpoints) into the existing shell and polish micro-interactions (loading states, interpretation-card scroll tracking, empty states) without changing the underlying design tokens or component contracts.

### External Data & AI Integration

<!-- 한국어 주석: 서울시 공공 물가 관련 API와 Gemini 2.5 Pro + RAG 연동 방식을 명시합니다. 자세한 내용은 ai-architecture.md 참조. -->

- **Public Data Sources (Seoul & National)**:  
  - Seoul retail price information API (e.g., city-level price news) exposed via endpoints documented at `http://115.84.165.40/dataList/10611/S/2/datasetView.do`  
  - Seoul essential goods and agricultural/fishery/livestock price information API documented at `http://115.84.165.40/dataList/10611/S/2/datasetView.do`  
  - Seoul service usage price/fee information API documented at `http://115.84.165.40/dataList/10611/S/2/datasetView.do`  
  - National consumer price index (CPI) and related inflation indicators from e-나라지표 (`https://www.index.go.kr/unity/potal/main/EachDtlPageDetail.do?idx_cd=1060`) used as a macro benchmark for perceived vs. official inflation gaps.  
  - Additional national sources like KAMIS where applicable for item-level national averages.
- **Backend Responsibility**:  
  - `seoulPriceClient`가 서울시 물가 API를 호출해 `SeoulPriceSnapshot`을 내부 `PriceSnapshot`/`Item`/`Region` 모델로 정규화합니다.  
  - `cpiClient`가 e-나라지표에서 CPI/생활물가지수 정보를 가져와 `CpiSnapshot`으로 변환합니다.  
  - `/v1/perceived-prices/items/:itemCode` 엔드포인트는 위 데이터들을 바탕으로 **결정적 로직으로 실제 가격/기억 가격대/변동률**을 계산한 뒤, Gemini에 넘길 구조화 입력을 생성합니다.
- **Gemini 2.5 Pro + RAG Integration**:  
  - 백엔드의 `geminiClient.buildInterpretation`가 `@google/generative-ai` SDK를 사용해 **`gemini-2.5-pro`** (또는 환경변수로 지정된 모델)을 호출합니다.  
  - 입력은 `InterpretationInput` (item, region, baseline, actualPrice, macro, locale)와 `retrieveRagContext`로 검색된 `RagDocument[]`이며, 모든 숫자 계산은 사전에 코드에서 수행합니다.  
  - 프롬프트는 JSON 기반으로 설계되어, Gemini가 `{ "title": string, "body": string }` 형식의 JSON만 반환하도록 제한합니다. 파싱 실패 또는 응답 이상 시, 순수 함수형 Fallback 로직(`generatePerceivedInterpretationFallback`)을 사용합니다.
- **RAG (Retrieval Augmented Generation)**:  
  - `rag/knowledgeBase.ts`는 CPI/생활물가지수/체감 물가 심리 등 설명 텍스트를 `RagDocument`로 관리하고, 태그 기반 검색(`retrieveRagContext`)을 제공합니다.  
  - MVP에서는 하드코딩된 문서와 키워드 필터를 사용하며, 추후 Gemini Embedding + 벡터 DB로 교체할 수 있도록 인터페이스만 고정합니다.
- **Mobile Client Role**:  
  - React Native 앱은 `priceRepository`/`perceivedPriceRepository`를 통해 **오직 백엔드 API**만 호출하고, Gemini나 서울시 공공데이터에 직접 접근하지 않습니다.  
  - 이를 통해 API 키를 안전하게 관리하고, AI/RAG 로직을 클라이언트 배포와 독립적으로 개선할 수 있습니다.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Keep a **single mobile client** for MVP; do not introduce multiple apps or micro-frontends.  
- Use a **clean modular structure** inside the React Native app: separate UI (screens/components), state (MVI-like stores), and data access (repositories/services).  
- Avoid premature optimization: defer heavy offline sync, full analytics pipeline, and advanced personalization to later specs; only basic logging/KPI events are in scope.  
- No constitution violations are expected for this MVP; repository-like abstractions inside the client are justified to keep the price/AI integration testable and replaceable.

## Project Structure

### Documentation (this feature)

```text
specs/001-perceived-price-mvp/
├── spec.md              # Feature specification (already written)
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0 output (tech/AI/public data research)
├── data-model.md        # Phase 1 output (mobile + backend-facing models)
├── quickstart.md        # Phase 1 output (how to run the RN app + mock backend)
├── contracts/           # Phase 1 output (API contracts for price/AI services)
├── ai-architecture.md   # AI / RAG / Gemini 2.5 Pro 설계 및 구현 세부 설명
└── tasks.md             # Phase 2 output (/speckit.tasks or manual derivation)
```

### Source Code (repository root)

```text
apps/
└── mobile-perceived-price/
    ├── app/
    │   ├── src/
    │   │   ├── app/
    │   │   │   ├── navigation/        # React Navigation stacks, tabs, deep links
    │   │   │   ├── theme/             # Colors, typography, spacing tokens
    │   │   │   └── config/            # API base URLs, feature flags
    │   │   ├── features/
    │   │   │   ├── home/
    │   │   │   ├── search/
    │   │   │   ├── category/
    │   │   │   ├── basket/
    │   │   │   └── item-detail/
    │   │   ├── components/            # Shared UI components (cards, lists, charts)
    │   │   ├── state/                 # MVI stores (Zustand/Redux slices) + selectors
    │   │   ├── services/              # Repository-style API clients (price, AI, user)
    │   │   ├── utils/                 # Formatting, mapping, error handling
    │   │   └── types/                 # Shared TypeScript types/interfaces
    │   ├── ios/                       # RN native iOS config (auto-generated)
    │   ├── android/                   # RN native Android config (auto-generated)
    │   └── package.json               # App-level dependencies and scripts
    └── tests/
        ├── unit/                      # Pure functions, hooks, stores
        ├── integration/               # Screen + navigation + state wiring
        └── e2e/                       # Detox flows (optional for MVP)

packages/
├── price-domain/                      # Shared perceived-price calculation logic
├── shared-types/                      # Cross-app TypeScript types
└── analytics-client/                  # Shared analytics/KPI client
```

**Structure Decision**: Single **React Native mobile app** under `mobile/perceived-price` with feature-based folders (`home`, `search`, `basket`, etc.).  
Repositories/services in `services/` mediate between screens/state and external APIs so that backend evolution (e.g., switching KAMIS provider or AI model) does not ripple through UI code. Tests mirror the app folder structure for clear traceability from spec → plan → tasks → implementation.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Client-side repository layer (`services/`) | Encapsulates price/AI APIs and public data normalization logic behind a stable interface, enabling easy mocking in tests and future backend replacement | Direct `fetch` calls from screens would tightly couple UI to API shapes, make testing difficult, and spread normalization/business rules across components |
