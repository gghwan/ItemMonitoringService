### Seoul Public Price APIs → 모바일 도메인 매핑 (T050)

**참고 URL**: `http://115.84.165.40/dataList/10611/S/2/datasetView.do`  
서울시 물가 소식 / 생필품 / 농수축산물 / 서비스 이용 가격 정보 등 여러 데이터셋을 제공하는 오픈 API입니다.

> 주의: 아래 스키마는 현재 백엔드 구현(`seoulPriceClient.ts`)에 맞춘 **MVP용 추상화**입니다.  
> 실제 필드명/타입은 공개 문서를 확인한 뒤 보완해야 합니다.

---

### 1. 원본 API (예상 스키마)

- **엔드포인트 (예)**  
  - `GET /api/...` (실제 path, 파라미터는 문서 참고)
- **주요 필드 (예시)**  
  - `ITEM_CD` (품목 코드)  
  - `ITEM_NAME` (품목명)  
  - `UNIT` (단위, 예: 10kg, 30개, 1L)  
  - `REGION_CD` (행정구 코드)  
  - `REGION_NAME` (행정구 이름, 예: 강서구)  
  - `PRICE` (가격, 숫자)  
  - `YMD` (조사일자, YYYYMMDD)

백엔드에서는 위 필드를 `SeoulPriceSnapshot` 타입으로 변환하는 것을 목표로 합니다.

```ts
// apps/perceived-price-api/src/clients/seoulPriceClient.ts
export type SeoulPriceSnapshot = {
  itemCode: string;
  itemName: string;
  unit: string;
  regionCode: string;
  regionName: string;
  price: number;
  currency: 'KRW';
  observedAt: string; // ISO 8601 (예: 2025-10-01)
};
```

---

### 2. 모바일용 정규화 응답 스키마

모바일 앱은 서울시 원본 스키마를 직접 알 필요가 없고, 아래와 같은 **도메인 중심 응답**만 사용합니다.

```ts
// apps/perceived-price-api/src/clients/seoulPriceClient.ts
export type NormalizedPriceResponse = {
  item: {
    code: string;       // 예: RICE_10KG
    name: string;       // 예: 쌀 10kg
    category: string;   // 예: grain, dairy 등
    unitLabel: string;  // 예: 10kg
  };
  region: {
    code: string;             // 예: SEOUL_GANGSEO
    name: string;             // 예: Seoul · Gangseo-gu
    level: 'city' | 'district';
    parentCode: string | null; // 예: SEOUL
  };
  snapshots: Array<{
    source: 'seoul';
    price: number;
    currency: 'KRW';
    observedAt: string; // ISO 8601
  }>;
};
```

- 이 타입은 `/v1/prices/items/:itemCode/regions/:regionCode/latest` 응답에 그대로 사용됩니다.
- `itemCode` / `regionCode`는
  - 모바일에서 사용하는 코드 체계 (`RICE_10KG`, `SEOUL_GANGSEO`)와
  - 서울시 API의 코드 (`ITEM_CD`, `REGION_CD`) 사이의 매핑 테이블을 통해 연결합니다 (향후 `packages/price-domain`으로 분리 예정).

---

### 3. 백엔드 매핑 로직 요약

```ts
// apps/perceived-price-api/src/clients/seoulPriceClient.ts
const SEOUL_PRICE_API_BASE_URL =
  process.env.SEOUL_PRICE_API_BASE_URL ?? 'http://115.84.165.40';

export async function fetchLatestPriceFromSeoul(
  itemCode: string,
  regionCode: string
): Promise<NormalizedPriceResponse> {
  const url = `${SEOUL_PRICE_API_BASE_URL}/api/prices/latest`;
  const response = await axios.get<SeoulPriceSnapshot>(url, {
    params: { itemCode, regionCode }
  });

  const payload = response.data;

  return {
    item: {
      code: payload.itemCode,
      name: payload.itemName,
      category: 'unknown', // TODO: 품목 코드 → 카테고리 매핑
      unitLabel: payload.unit
    },
    region: {
      code: payload.regionCode,
      name: payload.regionName,
      level: 'district',
      parentCode: 'SEOUL'
    },
    snapshots: [
      {
        source: 'seoul',
        price: payload.price,
        currency: payload.currency,
        observedAt: payload.observedAt
      }
    ]
  };
}
```

> **TODO (후속 작업)**  
> - 실제 서울시 오픈 API path 및 파라미터 반영  
> - `ITEM_CD/REGION_CD` ↔ 내부 코드(`RICE_10KG`, `SEOUL_GANGSEO`) 매핑 테이블 정의  
> - 데이터셋별(물가 소식, 생필품, 농수축산물, 서비스 이용)로 source 태그 확장 (예: `source: 'seoul-living'`)

# Backend Contract: Seoul Public Price APIs → Internal Models

<!-- 한국어 주석: 서울시 물가 관련 공공데이터를 어떻게 `PriceSnapshot` / `Item` / `Region`으로 정규화할지 정의합니다. -->

## Source Endpoints

- Base documentation: `http://115.84.165.40/dataList/10611/S/2/datasetView.do`
- Datasets:
  - Retail price information (city/district)
  - Essential goods & agricultural/fishery/livestock prices
  - Service usage prices/fees

## Normalization Rules

- **Region mapping**
  - Map Seoul administrative codes to `Region`:
    - `district` (시/군/구) → `Region.level = "district"`
    - `city` (Seoul) → `Region.level = "city"`
    - `national` aggregation handled via national sources (CPI/KAMIS).
- **Item mapping**
  - Each public item code maps to a single `Item.code`.
  - `Item.unitLabel` derived from dataset unit (e.g., "10kg", "1kg", "30개").
- **PriceSnapshot**
  - One row per `(itemCode, regionCode, observationDate)` with:
    - `source = "seoul"`
    - `price` in KRW
    - `observedAt` as ISO date.

## Mobile-Facing API Shape (Example)

```json
GET /v1/prices/items/{itemCode}/regions/{regionCode}/latest

{
  "item": { "code": "RICE_10KG", "name": "Rice 10kg", "category": "grain", "unitLabel": "10kg" },
  "region": { "code": "SEOUL_GANGSEO", "name": "Seoul · Gangseo-gu", "level": "district", "parentCode": "SEOUL" },
  "snapshots": [
    { "source": "seoul", "price": 51900, "currency": "KRW", "observedAt": "2025-10-01" }
  ]
}
```


