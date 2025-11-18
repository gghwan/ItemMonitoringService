# Implementation Plan: Perceived Price Monitoring MVP (React Native)

**Branch**: `001-perceived-price-mvp` | **Date**: 2025-11-14 | **Spec**: `specs/001-perceived-price-mvp/spec.md`
**Input**: Feature specification from `/specs/001-perceived-price-mvp/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This MVP delivers a mobile **Perceived Price Monitoring Service** implemented as a React Native app for iOS and Android.  
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

- **Mapping to Our IA**:
  - Home screen: maps to the main “menu/home” screen in the Figma design, adapted to show **Today’s perceived index**, **basket summary cards**, and **top price-change items** instead of coffee menus.
  - Category screen: reuses the category/list layout from the Figma design for **price categories** and representative items.
  - Basket screen: reuses the cart/checkout list layout for our **saved items basket**, including per-item rows and summary modules.
  - Item detail screen: follows the product detail pattern (image/graph area on top, key stats, description/notes below) adapted for **price graph + actual vs perceived price modules + interpretation card**.
- **Implementation Approach**:
  - Phase 1–2: Implement a **static UI shell** that closely matches the Figma visual design using mocked data and placeholder components, ensuring navigation and layout are correct.
  - Phase 3+: Gradually replace mock data with live data and AI outputs while preserving the visual structure; final polish (animations, micro-interactions, empty states) is done after core flows are stable.
  - Shared UI primitives (to avoid boilerplate and divergence between screens):
    - Layout / structure: `AppCard`, `SearchBar`, (later) `ScreenContainer`, `SectionHeader`, shared list row components.
    - Feedback: standardized loading spinners, error/empty states, and interpretation-card scroll behavior.
    - These primitives must be used by Home, Search, Basket, Category, and Item Detail screens instead of ad-hoc styles to keep the UX consistent and spec-aligned.

### External Data & AI Integration

<!-- 한국어 주석: 서울시 공공 물가 관련 API와 Gemini API 연동 방식을 명시합니다. -->

- **Public Data Sources (Seoul & National)**:  
  - Seoul retail price information API (e.g., city-level price news) exposed via endpoints documented at `http://115.84.165.40/dataList/10611/S/2/datasetView.do`  
  - Seoul essential goods and agricultural/fishery/livestock price information API documented at `http://115.84.165.40/dataList/10611/S/2/datasetView.do`  
  - Seoul service usage price/fee information API documented at `http://115.84.165.40/dataList/10611/S/2/datasetView.do`  
  - National consumer price index (CPI) and related inflation indicators from e-나라지표 (`https://www.index.go.kr/unity/potal/main/EachDtlPageDetail.do?idx_cd=1060`) used as a macro benchmark for perceived vs. official inflation gaps.  
  - Additional national sources like KAMIS where applicable for item-level national averages.
- **Backend Responsibility**: A backend (or serverless) service will periodically fetch and normalize these Seoul APIs into our internal `PriceSnapshot`, `Item`, and `Region` models, compute regional actual prices and gaps with **deterministic code**, cache results, and expose a **single mobile-facing API** that the React Native app calls.
- **Gemini Integration**: The backend will call the Gemini API server-side using structured inputs built from our normalized data (not by letting Gemini scrape raw APIs), in order to:  
  - refine or smooth personalized perceived baseline price ranges (for items/regions) based on deterministic features (purchase cycle, volatility, user sensitivity, regional premiums)  
  - generate natural-language interpretation cards explaining why prices feel expensive or cheap.  
  For policy/explanatory content such as CPI descriptions, the backend MAY augment prompts with additional context retrieved via an embeddings/RAG pipeline (e.g., over CPI documentation), but all **numerical calculations** (averages, deltas, percentages) MUST remain in our codebase.
- **Mobile Client Role**: The React Native app only talks to our backend APIs (never directly to Gemini or the Seoul open APIs) via `priceRepository` and `perceivedPriceRepository`, minimizing API key exposure and allowing AI/data logic to evolve independently of the client.

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
