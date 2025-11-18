---

description: "Task list template for feature implementation"
---

# Tasks: Perceived Price Monitoring MVP (React Native)

**Input**: Design documents from `/specs/001-perceived-price-mvp/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Mobile (React Native)**: `apps/mobile-perceived-price/app/src/` and `apps/mobile-perceived-price/tests/`
- **Shared packages**: `packages/price-domain/`, `packages/shared-types/`, `packages/analytics-client/`
- Paths below follow the folder structure defined in `plan.md`

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the React Native project and basic tooling

- [ ] T001 Create `apps/mobile-perceived-price` directory and initialize React Native app with TypeScript template (e.g., `npx react-native init PerceivedPriceApp --template react-native-template-typescript`), then move contents under `apps/mobile-perceived-price/app/` if needed
- [ ] T002 Install core dependencies (React Navigation, React Query, Zustand/Redux Toolkit, Axios, chart library, AsyncStorage, geolocation/permissions) and wire base `App.tsx` in `apps/mobile-perceived-price/app/`
- [ ] T003 [P] Configure linting/formatting tools (ESLint, Prettier, TypeScript strict mode) and basic CI lint/test scripts
- [ ] T004A [P] Create base theme (colors, typography, spacing) and shared UI primitives in `apps/mobile-perceived-price/app/src/components/` that visually align with the `생활물가_디자인시스템` Figma design while keeping naming generic (e.g., `AppCard`, `SearchBar`, `BottomTabBar`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Define environment configuration and API client wrapper in `apps/mobile-perceived-price/app/src/app/config/` and `apps/mobile-perceived-price/app/src/services/httpClient.ts` (base URLs, timeouts, error mapping)
- [ ] T005 [P] Implement price and AI repository interfaces in `apps/mobile-perceived-price/app/src/services/priceRepository.ts` and `apps/mobile-perceived-price/app/src/services/perceivedPriceRepository.ts` with mock implementations backed by static JSON or a dev server
- [ ] T006 [P] Implement region/location service in `apps/mobile-perceived-price/app/src/services/locationService.ts` including permission handling and a manual region picker fallback
- [ ] T007 Create core domain types in `apps/mobile-perceived-price/app/src/types/` (User, Region, Item, PriceSnapshot, PerceivedPriceBaseline, UserConsumptionProfile, BasketItem, InterpretationCard), with an eye toward later extraction into `packages/shared-types`
- [ ] T008 Configure error handling and logging utilities in `apps/mobile-perceived-price/app/src/utils/` (including KPI event logging stubs for search, basket additions, item detail views)
- [ ] T009 Setup navigation root in `apps/mobile-perceived-price/app/src/app/navigation/` (bottom tab navigation: Home, Category, Basket; stack navigation for Search, Item Detail)
- [ ] T050 [P] Document backend contracts in `specs/001-perceived-price-mvp/contracts/seoul-price-apis.md` that describe how Seoul public price APIs (`http://115.84.165.40/dataList/10611/S/2/datasetView.do` and related datasets) are normalized into `PriceSnapshot`/`Item`/`Region` for the mobile client
- [ ] T051 [P] Document backend contracts in `specs/001-perceived-price-mvp/contracts/national-cpi.md` that describe how national CPI and related indices from `https://www.index.go.kr/unity/potal/main/EachDtlPageDetail.do?idx_cd=1060` are ingested, normalized, and exposed to the app (e.g., for charts and macro comparisons)
- [ ] T052 [P] Define backend endpoint(s) for Gemini-powered perceived price estimation and interpretation that accept item/region/user context, compute all numeric features deterministically from normalized Seoul price/CPI data, and call Gemini only with structured inputs (and optional URL/text context) before exposing a simple REST response shape for `perceivedPriceRepository`
- [ ] T053 [P] Implement an embeddings/RAG pipeline (e.g., using `gemini-embedding-001` and a vector store) over CPI and policy/explanatory documents so the backend can retrieve short, relevant passages to include in Gemini prompts without re-deriving numeric statistics inside the model

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Search → Item Detail with perceived price & explanation (Priority: P1) 🎯 MVP

**Goal**: Allow users to search for an item and view an item detail page that shows regional actual price, perceived baseline price range, and an AI interpretation card explaining why the price feels expensive.

**Independent Test**: With mock API data and location enabled, a tester can open the app, perform a search, select an item, and verify that the item detail page renders all required modules without using Basket or Category flows.

### Tests for User Story 1 (OPTIONAL - recommended) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Unit tests for price/AI repositories with mocked HTTP responses in `apps/mobile-perceived-price/tests/unit/services/priceRepository.test.ts`
- [ ] T011 [P] [US1] Integration test for Search → Item Detail flow using React Native Testing Library in `apps/mobile-perceived-price/tests/integration/searchToDetail.test.tsx`

### Implementation for User Story 1

- [ ] T012 [P] [US1] Implement search screen UI in `apps/mobile-perceived-price/app/src/features/search/SearchScreen.tsx` with item autocomplete driven by public-data item codes
- [ ] T013 [P] [US1] Implement search result list and click-through to item detail in `apps/mobile-perceived-price/app/src/features/search/components/SearchResultList.tsx`
- [ ] T014 [US1] Implement item detail screen container in `apps/mobile-perceived-price/app/src/features/item-detail/ItemDetailScreen.tsx` that composes actual price module, perceived baseline module, and interpretation card
- [ ] T015 [US1] Implement actual price module UI and hooks in `apps/mobile-perceived-price/app/src/features/item-detail/components/ActualPriceSection.tsx` (consuming `priceRepository`)
- [ ] T016 [US1] Implement perceived baseline module UI and logic in `apps/mobile-perceived-price/app/src/features/item-detail/components/PerceivedBaselineSection.tsx` (consuming `perceivedPriceRepository`)
- [ ] T017 [US1] Implement interpretation card component in `apps/mobile-perceived-price/app/src/features/item-detail/components/InterpretationCard.tsx` including scroll tracking for KPI logging
- [ ] T018 [US1] Wire MVI-style state store for search and item detail in `apps/mobile-perceived-price/app/src/state/searchStore.ts` and `apps/mobile-perceived-price/app/src/state/itemDetailStore.ts` (actions for query, selection, loading, error states)
- [ ] T019 [US1] Add KPI event logging for search queries, item selections, and interpretation card scroll depth in `apps/mobile-perceived-price/app/src/utils/analytics.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Basket of frequently checked items (Priority: P2)

**Goal**: Allow users to add items to a persistent basket, see a list of saved items with key price-change information, and navigate from Basket or Home basket summary into item detail.

**Independent Test**: With US1 and foundational tasks complete, a tester can add items from item detail to the basket, reopen the app, and verify that the Basket and Home summary still show the same items and can navigate to item detail.

### Tests for User Story 2 (OPTIONAL - recommended) ⚠️

- [ ] T020 [P] [US2] Unit tests for basket store persistence (add/remove, rehydrate from AsyncStorage) in `apps/mobile-perceived-price/tests/unit/state/basketStore.test.ts`
- [ ] T021 [P] [US2] Integration test for Basket → Item Detail navigation in `apps/mobile-perceived-price/tests/integration/basketToDetail.test.tsx`

### Implementation for User Story 2

- [ ] T022 [P] [US2] Implement basket store in `apps/mobile-perceived-price/app/src/state/basketStore.ts` (add/remove, clear, derived selectors for summary)
- [ ] T023 [P] [US2] Implement AsyncStorage persistence layer for the basket in `apps/mobile-perceived-price/app/src/services/basketStorage.ts`
- [ ] T024 [US2] Add "Add to Basket" CTA on `ItemDetailScreen` and ensure it dispatches to `basketStore`
- [ ] T025 [US2] Implement Basket screen UI in `apps/mobile-perceived-price/app/src/features/basket/BasketScreen.tsx` displaying saved items with current price and change vs. one month ago
- [ ] T026 [US2] Implement Home basket summary module in `apps/mobile-perceived-price/app/src/features/home/components/BasketSummarySection.tsx`
- [ ] T027 [US2] Wire navigation from Home basket summary and Basket list items into `ItemDetailScreen`
- [ ] T028 [US2] Add KPI event logging for basket additions, removals, and Basket screen views in `apps/mobile-perceived-price/app/src/utils/analytics.ts`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Home perceived index & consumption pattern summary (Priority: P3)

**Goal**: Provide a Home dashboard that summarizes today’s perceived index based on basket items, regional prices, and (when available) user consumption patterns, plus highlight top items with largest price changes.

**Independent Test**: With foundational tasks and US1/US2 complete, a tester can open Home with a pre-filled basket and mock consumption profile, and verify that the perceived index module, consumption graph, and top-changers list render correctly even if card data is missing.

### Tests for User Story 3 (OPTIONAL - recommended) ⚠️

- [ ] T029 [P] [US3] Unit tests for perceived index calculation helper in `apps/mobile-perceived-price/tests/unit/utils/perceivedIndexCalculator.test.ts`
- [ ] T030 [P] [US3] Integration test for Home dashboard rendering with/without card data in `apps/mobile-perceived-price/tests/integration/homeDashboard.test.tsx`

### Implementation for User Story 3

- [ ] T031 [P] [US3] Implement `perceivedIndexCalculator` in `apps/mobile-perceived-price/app/src/utils/perceivedIndexCalculator.ts` that aggregates basket items, regional prices, and sensitivity factors into a perceived delta value
- [ ] T032 [P] [US3] Implement Home screen container in `apps/mobile-perceived-price/app/src/features/home/HomeScreen.tsx` including perceived index module, basket summary, favorite categories, and top price-change list shells
- [ ] T033 [US3] Implement summary graph of consumption patterns in `apps/mobile-perceived-price/app/src/features/home/components/ConsumptionSummaryChart.tsx` (with mocked or basic data from `UserConsumptionProfile`)
- [ ] T034 [US3] Implement top price-change list in `apps/mobile-perceived-price/app/src/features/home/components/TopChangersSection.tsx`
- [ ] T035 [US3] Implement empty/onboarding states when basket or card data is missing, ensuring no crashes and clear copy
- [ ] T036 [US3] Add KPI logging for Home perceived index impressions and scroll depth for interpretation areas in `apps/mobile-perceived-price/app/src/utils/analytics.ts`

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T040 [P] Documentation updates in `specs/001-perceived-price-mvp/quickstart.md` and the monorepo README for the React Native app and shared packages
- [ ] T041 Code cleanup and refactoring (extract shared components, remove duplication in stores/services; move stable types to `packages/shared-types`)
- [ ] T042 Performance optimization for large lists and charts (e.g., FlatList tuning, memoization) in `apps/mobile-perceived-price/app/src/features/*`
- [ ] T043 [P] Additional unit tests in `apps/mobile-perceived-price/tests/unit/` for critical utilities and stores
- [ ] T044 Security/privacy hardening (review analytics payloads, storage of region/card-derived data)
- [ ] T045 Run `quickstart.md` validation: set up monorepo from scratch on macOS Apple Silicon and confirm main flows (Search → Detail, Basket, Home) function as per spec
- [ ] T046 [P] Consolidate repeated UI/UX patterns into shared primitives (`SearchBar`, `ScreenContainer`, `SectionHeader`, shared list row/card components) and ensure all feature screens use them instead of custom inline styles

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for [endpoint] in tests/contract/test_[name].py"
Task: "Integration test for [user journey] in tests/integration/test_[name].py"

# Launch all models for User Story 1 together:
Task: "Create [Entity1] model in src/models/[entity1].py"
Task: "Create [Entity2] model in src/models/[entity2].py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
