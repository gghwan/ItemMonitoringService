# Data Model: Perceived Price Monitoring MVP

> 이 문서는 Perceived Price Monitoring MVP에서 사용하는 **핵심 도메인 모델**을 정리합니다.  
> 모바일 앱(React Native)과 백엔드 API(Node/Express)가 공유하는 개념을 기준으로 합니다.

---

## 1. 개요

사용자의 “체감 물가”를 계산하고 설명하기 위한 핵심 개념은 다음과 같습니다.

- **Region**: 행정구역 (서울시·자치구)
- **Item**: 품목 (예: 쌀 10kg, 계란 30개, 우유 1L)
- **PriceSnapshot**: 특정 시점의 실제 가격 (서울시 API, KAMIS)
- **PerceivedBaseline**: 사용자가 기억하는 가격대(하한/상한)
- **PerceivedPriceDetail**: 실제 가격 + 기억 가격대 + 해석 카드
- **HomePerceivedIndexSummary**: 홈 화면에 표시되는 “오늘의 체감 지수” 요약
- **UserConsumptionProfile**: 카테고리별 소비 비중
- **CpiSnapshot**: CPI/생활물가지수 등 거시 지표
- **BasketItem**: 사용자 장바구니에 저장된 품목

---

## 2. 공통 타입 정의

아래 타입들은 모바일/백엔드 모두에서 같은 의미를 갖습니다.

### 2.1 Region

```ts
type RegionLevel = 'city' | 'district';

type Region = {
  code: string;         // "SEOUL_GANGSEO"
  name: string;         // "Seoul · Gangseo-gu"
  level: RegionLevel;   // 'city' | 'district'
  parentCode: string;   // 상위 지역 코드 (예: 'SEOUL')
};
```

### 2.2 Item

```ts
type ItemCategory = 'grain' | 'dairy' | 'service' | 'other';

type Item = {
  code: string;        // "RICE_10KG"
  name: string;        // "쌀 10kg"
  category: ItemCategory;
  unitLabel: string;   // "10kg", "30개", "1L" 등
};
```

### 2.3 PriceSnapshot

```ts
type PriceSource = 'seoul' | 'kamis' | 'other';

type PriceSnapshot = {
  source: PriceSource; // 데이터 출처
  price: number;       // 실제 가격
  currency: 'KRW';
  observedAt: string;  // ISO 날짜 문자열
};
```

---

## 3. 체감 가격 관련 모델

### 3.1 PerceivedPriceBaseline

```ts
type PerceivedPriceBaseline = {
  itemCode: string;         // 품목 코드
  regionCode: string;       // 지역 코드
  lowerBound: number;       // 체감 기준 하한
  upperBound: number;       // 체감 기준 상한
  currency: 'KRW';
  referencePeriodLabel: string; // "최근 12개월" 등 설명용 텍스트
};
```

### 3.2 InterpretationCard

```ts
type InterpretationCard = {
  id: string;
  title: string;     // 예: "왜 이렇게 비싸게 느껴질까요?"
  body: string;      // AI가 생성한 자연어 해석
  createdAt: string; // ISO 날짜 문자열
};
```

### 3.3 PerceivedPriceDetail

```ts
type PerceivedPriceDetail = {
  region: Region;
  baseline: PerceivedPriceBaseline;
  actualPrice: number;
  currency: 'KRW';
  interpretation: InterpretationCard;
};
```

백엔드 `/v1/perceived-prices/items/:itemCode` 응답과 모바일 `ItemDetailScreen`이 이 타입을 사용합니다.

---

## 4. 홈 요약 및 장바구니 모델

### 4.1 HomePerceivedIndexSummary

```ts
type HomePerceivedIndexSummary = {
  region: Region;
  perceivedExtraCost: number; // 오늘 장바구니 전체가 체감상 얼마나 더 비싸게 느껴지는지 (원 단위)
  currency: 'KRW';
};
```

백엔드 `/v1/perceived-prices/summary` 응답과 모바일 `HomeScreen`이 사용합니다.

### 4.2 BasketItem

```ts
type BasketItem = {
  id: string;   // 장바구니 아이템 고유 ID (클라이언트 생성)
  item: Item;   // 품목 정보
  region: Region; // 해당 품목에 대해 조회한 지역
};
```

모바일에서만 관리되는 로컬 장바구니이며, AsyncStorage로 영속화됩니다.

---

## 5. 사용자 소비 패턴 및 CPI 모델

### 5.1 UserConsumptionProfile

```ts
type UserConsumptionProfile = {
  userId: string;
  foodRatio: number;     // 0~1, 식료품 비중
  cafeRatio: number;     // 카페/외식 비중
  deliveryRatio: number; // 배달 비중
  otherRatio: number;    // 기타 비중
};
```

MVP에서는 목업 데이터로만 사용하며, 향후 실제 카드/계좌 내역 기반으로 계산할 수 있습니다.

### 5.2 CpiSnapshot

```ts
type CpiSnapshot = {
  date: string;              // "2025-10-01"
  headlineCpiYoY: number;    // 소비자물가지수 YoY(%)
  coreCpiYoY: number;        // 근원물가지수 YoY(%)
  livingPriceIndexYoY: number; // 생활물가지수 YoY(%)
};
```

백엔드 `cpiClient`와 `geminiClient`에서 사용되며, 해석 카드의 매크로 문맥을 제공하는 데 사용됩니다.

---

## 6. API 레벨 응답 모델

### 6.1 `/v1/prices/items/:itemCode/regions/:regionCode/latest`

```ts
type NormalizedPriceResponse = {
  item: Item;
  region: Region;
  snapshots: PriceSnapshot[];
};
```

### 6.2 `/v1/perceived-prices/items/:itemCode`

```ts
type PerceivedPriceDetailResponse = PerceivedPriceDetail;
```

### 6.3 `/v1/perceived-prices/summary`

```ts
type HomePriceSummaryResponse = {
  perceivedIndex: HomePerceivedIndexSummary;
  basketItems: BasketItem[]; // 향후 서버측 추천/통계용
};
```

### 6.4 `/v1/inflation/cpi/latest`

```ts
type CpiResponse = CpiSnapshot;
```

---

## 7. 향후 확장 포인트

- `packages/shared-types/` 생성 후, 위 타입들을 공통 패키지로 추출해 모바일/백엔드에서 같이 사용
- `packages/price-domain/`에 체감 인덱스 계산 로직(`calculatePerceivedIndex`) 이동
- `UserConsumptionProfile`를 실제 카드 소비 데이터로 채우기 위한 데이터 소스 정의


