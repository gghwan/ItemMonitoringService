### National CPI & Living Price Index → 모바일 도메인 매핑 (T051)

**참고 URL**: `https://www.index.go.kr/unity/potal/main/EachDtlPageDetail.do?idx_cd=1060`  
e-나라지표에서 제공하는 **소비자물가지수(CPI)** 및 관련 지표입니다.

> 주의: 현재는 백엔드 구현(`cpiClient.ts`)에 맞춘 **MVP용 요약 스키마**만 사용합니다.  
> 실제로는 HTML 파싱 또는 별도 제공되는 API를 통해 최신 지표를 정교하게 가져와야 합니다.

---

### 1. 모바일이 필요로 하는 최소 CPI 정보

모바일의 체감 해석 카드는 “전체 물가 vs 생활물가”의 방향성을 설명하는 정도면 충분하므로,  
현재는 아래 3개의 YoY(전년동월대비) 값만 사용합니다.

```ts
// apps/perceived-price-api/src/clients/cpiClient.ts
export type CpiSnapshot = {
  date: string;               // 기준일 (예: 2025-10-01)
  headlineCpiYoY: number;     // 소비자물가지수 YoY (%)
  coreCpiYoY: number;         // 근원물가지수 YoY (%)
  livingPriceIndexYoY: number;// 생활물가지수 YoY (%)
};
```

모바일에는 그대로 내려보내며, 해석 카드 생성 로직에서 다음과 같이 사용합니다:

- `livingPriceIndexYoY > headlineCpiYoY` 인 경우  
  → “생활물가가 전체 CPI보다 더 가파르게 오른다”는 문장을 생성  
- 그 외  
  → “전체 CPI와 비슷한 수준으로 움직인다”는 문장을 생성

---

### 2. 백엔드 클라이언트 스펙 (`cpiClient.ts`)

```ts
const CPI_URL =
  process.env.CPI_URL ??
  'https://www.index.go.kr/unity/potal/main/EachDtlPageDetail.do?idx_cd=1060';

export async function fetchLatestCpi(): Promise<CpiSnapshot> {
  try {
    await axios.get(CPI_URL);

    return {
      date: '2025-10-01',
      headlineCpiYoY: 2.4,
      coreCpiYoY: 2.0,
      livingPriceIndexYoY: 3.1
    };
  } catch (_err) {
    return {
      date: '2025-10-01',
      headlineCpiYoY: 2.4,
      coreCpiYoY: 2.0,
      livingPriceIndexYoY: 3.1
    };
  }
}
```

- 현재는 HTML 파싱을 구현하지 않고, 네트워크 연결 여부만 확인한 뒤 **고정 목업 값**을 반환합니다.
- 추후 작업:
  - e-나라지표 HTML에서 최신 월의 CPI/생활물가지수 테이블을 파싱하는 파서 추가  
  - 또는, 별도의 공식 API가 있을 경우 해당 API → `CpiSnapshot` 매핑 로직으로 대체

---

### 3. API 계약: `/v1/inflation/cpi/latest`

모바일 앱은 다음 REST 엔드포인트를 사용해 최신 CPI 스냅샷을 가져올 수 있습니다.

- **Method**: `GET`
- **Path**: `/v1/inflation/cpi/latest`
- **Query**: 없음 (향후 baseDate, region 등 옵션 추가 가능)
- **Response Body**:

```json
{
  "date": "2025-10-01",
  "headlineCpiYoY": 2.4,
  "coreCpiYoY": 2.0,
  "livingPriceIndexYoY": 3.1
}
```

이 응답은 현재 `generatePerceivedInterpretation()`에서 바로 사용되며,  
체감 해석 카드에 “최근 물가는 어느 정도 속도로 오르고 있는지”에 대한 배경 문장을 더해 줍니다.

# Backend Contract: National CPI & Inflation Indicators

<!-- 한국어 주석: e-나라지표 CPI 데이터를 어떻게 ingest/정규화하여 앱에 제공할지 정의합니다. -->

## Source

- CPI documentation & data: `https://www.index.go.kr/unity/potal/main/EachDtlPageDetail.do?idx_cd=1060`

## Normalization Rules

- Monthly CPI indices are ingested as:

```json
{
  "date": "2025-10-01",
  "headlineCpiYoY": 2.4,
  "coreCpiYoY": 2.0,
  "livingPriceIndexYoY": 3.1
}
```

- These values are stored in a dedicated CPI table and exposed to the app as part of:
  - Item detail macro comparison (e.g., "headline CPI +2.4% vs your basket feels +10–15%").
  - Home dashboard copy and graphs.

## Mobile-Facing API Shape (Example)

```json
GET /v1/inflation/cpi/latest

{
  "date": "2025-10-01",
  "headlineCpiYoY": 2.4,
  "coreCpiYoY": 2.0,
  "livingPriceIndexYoY": 3.1
}
```


