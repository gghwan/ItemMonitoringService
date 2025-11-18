# Feature Specification: Perceived Price Monitoring MVP

**Feature Branch**: `001-perceived-price-mvp`  
**Created**: 2025-11-14  
**Status**: Draft  
**Input**: User description: "Perceived price monitoring service that compares actual vs. perceived prices using public data and user consumption patterns"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Search and understand why a specific item feels expensive (Priority: P1)

Seoyoon, a single-person household user, wants to search for an item (e.g., rice, eggs, milk) and immediately see how its actual price compares to what she typically expects to pay, along with an explanation of why it currently feels expensive.

**Why this priority**: This is the core value of the service: closing the gap between perceived and actual prices for frequently bought items, delivering value even if only a single item detail view is available.

**Independent Test**: Can be fully tested by having a user open the app, search for a single item, open the item detail page, and verify that actual price, perceived baseline price range, and an interpretation card are all displayed without using any other screens.

**Acceptance Scenarios**:

1. **Given** the app is installed and location permission is granted, **When** the user searches for "rice" from the Home search bar and selects a matching result, **Then** the item detail page shows regional actual price, perceived baseline price range, and a personalized interpretation card.
2. **Given** a user with connected card consumption data, **When** the user opens the item detail page for a frequently purchased item, **Then** the interpretation card references their recent food spending proportion and regional price differences in its explanation.

---

### User Story 2 - Manage a basket of frequently checked items (Priority: P2)

The user wants to save items they frequently monitor (e.g., rice, eggs, delivery food categories) into a basket so that the Home screen and Basket screen can quickly summarize their perceived vs. actual price gaps.

**Why this priority**: Once the core single-item experience works, recurring value comes from repeatedly checking a small set of items; the basket enables daily/weekly monitoring without repeated searches.

**Independent Test**: Can be fully tested by allowing the user to add items from search results or item detail to the basket, then validating that the Home module and Basket screen reflect saved items and price-change summaries without requiring category browsing or expenditure dashboards.

**Acceptance Scenarios**:

1. **Given** the user is on an item detail page, **When** they tap "Add to Basket", **Then** the item is added to the basket, and the Home basket summary dashboard shows the new item with its perceived vs. actual price comparison.
2. **Given** the user has at least one item saved in the basket, **When** they navigate to the Basket tab, **Then** they see a list of saved items with current price, change vs. one month ago, and a perceived index prediction per item.

---

### User Story 3 - Understand my overall perceived index and spending pattern (Priority: P3)

The user wants to see, on the Home screen, a simple overview of how their recent consumption patterns and regional prices affect their perceived price index today (e.g., "If you buy everything in your basket today, it will feel about 1,000 KRW more expensive").

**Why this priority**: This aggregates item-level insights into a personal "perceived inflation dashboard", helping users build trust in the service and their own spending decisions, but can ship after the core item and basket flows.

**Independent Test**: Can be fully tested by connecting card data (or using mock data), calculating a perceived index for the current region and basket, and validating the Home module copy and values without needing category browsing or interpretation of individual items.

**Acceptance Scenarios**:

1. **Given** the user has at least one item in the basket and card consumption data is available, **When** they open the Home screen, **Then** they see a "Today’s perceived index" module summarizing the perceived additional cost if they bought all basket items today.
2. **Given** the user has no basket items or card data connected, **When** they open the Home screen, **Then** the perceived index module shows an empty or onboarding state (e.g., "Add items to your basket and connect your card to see your perceived index") instead of an error.

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!-- 한국어 주석: 아래 엣지 케이스는 실제 구현 시 테스트 케이스로 반드시 반영해야 합니다. -->

- Public price data for a searched item is missing at city/district level: system SHOULD fall back to metropolitan CPI or national averages and clearly label the source.
- Location permission is denied: system SHOULD allow manual region selection and still compute actual vs. perceived prices using the selected region.
- Card consumption data is not connected or temporarily unavailable: system SHOULD still show public-data-based actual prices, disable personalized sensitivity factors, and show an explicit message about limited personalization.
- Item purchase cycle is unusually short or long compared to statistics: AI perceived baseline SHOULD handle outliers without producing obviously wrong ranges (e.g., negative prices, extremely wide ranges).
- Shrinkflation or quantity changes (e.g., 30 eggs → 20 eggs) occur: system SHOULD normalize prices per standard unit (e.g., per kg, per 10 eggs) so comparisons remain meaningful.
- Network/API failures from public data providers: system SHOULD show a graceful error or cached last-known values with a "last updated" timestamp instead of blocking the entire page.

## Requirements *(mandatory)*

### Functional Requirements

<!-- 한국어 주석: 아래 FR-004, FR-005는 숫자 계산은 백엔드에서 결정적 로직으로, 설명은 LLM이 담당한다는 책임 분리를 명시합니다. -->

- **FR-001**: System MUST allow users to search for items by name with auto-complete suggestions based on public data item codes (e.g., KAMIS).
- **FR-002**: System MUST detect the user’s city/district via GPS (when permitted) and use it to query regional price data, with a manual region selection fallback.
- **FR-003**: System MUST retrieve and aggregate public price data (Seoul city price APIs, national CPI, KAMIS, living cost indices) to compute a "regional actual price" per item, including comparisons vs. metropolitan and national averages, using deterministic server-side calculations.
- **FR-004**: System MUST estimate a perceived baseline price range per item for the user via a backend AI service that combines deterministic signals (purchase cycle, volatility, user consumption profile, regional price gaps) with a model such as Gemini; the mobile app MUST only consume the resulting range and MUST NOT perform its own price aggregation logic.
- **FR-005**: System MUST generate an AI interpretation card that explains, in human-readable language, why the current price may feel expensive or cheap (e.g., purchase cycle, regional premium, spending proportion), using structured server-side inputs (normalized public data and user metrics) and, where appropriate, additional retrieved context (e.g., CPI explanations) rather than asking the model to scrape or infer raw numbers from external URLs.
- **FR-006**: System MUST allow users to add and remove items from a basket, and persist the basket across sessions.
- **FR-007**: System MUST display a basket summary on the Home screen, showing key items and their perceived vs. actual price gaps.
- **FR-008**: System MUST provide dedicated Basket and Category screens, including item lists, basic price-change information, and navigation into item detail pages.
- **FR-009**: System MUST summarize the user’s perceived index on the Home screen based on basket items, regional prices, and consumption patterns (e.g., "≈ 1,000 KRW more expensive if purchased today").
- **FR-010**: System MUST handle missing or stale data gracefully, with clear UI states (e.g., "data temporarily unavailable" or "no card data connected") instead of generic errors.
- **FR-011**: System MUST log key user interactions for analytics (searches, basket additions, item detail views, interpretation card scroll depth) to support KPI measurement.
- **FR-012**: System MUST externalize all user-facing strings into a lightweight i18n layer so that Korean can be the primary UI language while still allowing future locale switches (e.g., English) without touching business logic or view models.

*Unclear / to-be-refined requirements (NEEDS CLARIFICATION):*

- **FR-013**: System MUST integrate with card companies or banks to retrieve transaction history [NEEDS CLARIFICATION: exact providers, auth flows, and data retention policies].
- **FR-014**: System MUST anonymize and/or aggregate user consumption data for analytics [NEEDS CLARIFICATION: anonymization strategy and regulatory requirements].

### Key Entities *(include if feature involves data)*

- **User**: Represents an individual app user; key attributes include unique identifier, demographic metadata (optional), region (current and preferred), and consent flags for data usage.
- **Region**: Represents a geographic area (city/district, metropolitan, national); key attributes include region code, name, and hierarchy (district → city → national).
- **Item**: Represents a monitored good or service (e.g., rice, eggs, coffee); key attributes include item code (from public data), display name, category, unit (e.g., kg, pack of 10), and metadata about typical purchase cycle.
- **PriceSnapshot**: Represents a time-stamped price for a given item and region; attributes include item code, region code, price value, source (KAMIS, CPI, etc.), and effective date.
- **PerceivedPriceBaseline**: Represents a computed perceived baseline price range for a user-item pair; attributes include lower bound, upper bound, reference period, and factors used in the computation (e.g., volatility level, purchase cycle).
- **UserConsumptionProfile**: Represents summarized user spending behavior; attributes include category-level spending ratios, total monthly spending, recent change rate, and sensitivity indicators for specific categories.
- **BasketItem**: Represents an item saved to the user’s basket; attributes include user ID, item reference, created date, and optional user labels or notes.
- **InterpretationCard**: Represents an explanation generated for a specific user-item-region context; attributes include text content, contributing factors (e.g., "regional premium", "short purchase cycle"), and generation timestamp.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 60% of sessions reach an item detail result page (Home → Search/Category/Basket → Item Detail) within the first two minutes.
- **SC-002**: At least 30% of users who view an item detail page add at least one item to the basket within the same session.
- **SC-003**: At least 70% of item detail page views scroll past 80% of the AI interpretation card content, indicating that users are reading "why it feels expensive".
- **SC-004**: Among users who complete an in-app survey after using the service for at least two weeks, at least 50% report that their understanding of "why prices feel expensive" has improved (self-reported scale).
- **SC-005**: Repeat visit rate (weekly active / monthly active) reaches at least 40% within three months of launch, indicating sustained value in monitoring perceived prices over time.
