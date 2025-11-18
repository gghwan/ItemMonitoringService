// 한국어 주석: 도메인 엔티티 타입 정의. 서버와 모바일이 공유하는 개념을 기준으로 설계합니다.

export type RegionLevel = 'district' | 'city' | 'national';

export type Region = {
  code: string;
  name: string;
  level: RegionLevel;
  parentCode?: string;
};

export type ItemCategory = 'grain' | 'vegetable' | 'fruit' | 'meat' | 'fish' | 'dairy' | 'beverage' | 'service' | 'other';

export type Item = {
  code: string;
  name: string;
  category: ItemCategory;
  unitLabel: string; // e.g., "10kg", "1 dozen", "per 1 cup"
};

export type PriceSource = 'seoul' | 'national_cpi' | 'kamis' | 'other_public';

export type PriceSnapshot = {
  itemCode: string;
  regionCode: string;
  source: PriceSource;
  price: number;
  currency: 'KRW';
  observedAt: string; // ISO date
};

export type PerceivedPriceBaseline = {
  itemCode: string;
  regionCode: string;
  lowerBound: number;
  upperBound: number;
  currency: 'KRW';
  referencePeriodLabel: string; // e.g., "last 12 months"
};

export type BasketItem = {
  id: string;
  item: Item;
  region: Region;
};

export type HomePerceivedIndexSummary = {
  region: Region;
  perceivedExtraCost: number; // e.g., 1000 (KRW)
  currency: 'KRW';
};

export type UserConsumptionProfile = {
  totalMonthlySpending: number;
  foodSpendingRatio: number; // 0~1
  lastThreeMonthsTrendLabel: string; // e.g., "increasing", "stable", "decreasing"
};

export type InterpretationCard = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};



