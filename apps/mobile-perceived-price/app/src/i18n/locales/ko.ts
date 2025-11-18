// 한국어 주석: 한국어 기본 언어팩입니다. UI는 한국어가 메인이며, 영문은 보조용입니다.

export const ko = {
  common: {
    loading: '불러오는 중…',
    errorGeneric: '데이터를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
  },
  home: {
    title: '오늘의 체감 지수',
    searchPlaceholder: '품목 검색 (예: 쌀, 계란, 우유)',
    basketTodayTitle: '오늘 장바구니를 모두 구매하면…',
    basketTodayBody: '오늘 장바구니를 모두 구매하면 약 {extraCost}원 정도 더 비싸게 느껴질 수 있어요.',
    basketSummary: '장바구니 요약',
    basketEmpty: '아직 담긴 품목이 없어요. 품목 상세 화면에서 장바구니에 추가해 보세요.',
    basketViewLink: '장바구니 보기',
    consumptionPattern: '나의 소비 패턴',
    topPriceChanges: '가격 변동 TOP',
    noSpendingData: '아직 소비 데이터가 없습니다.',
    noTopChanges: '최근 큰 가격 변동이 감지되지 않았어요.'
  },
  search: {
    title: '품목 검색',
    placeholder: '품목 검색 (예: 쌀, 계란, 우유)',
    suggestionRice: '쌀 10kg',
    suggestionEggs: '계란 30개',
    suggestionMilk: '우유 1L'
  },
  detail: {
    title: '품목 상세',
    regionalPriceTitle: '내 지역 실제 가격',
    perceivedVsActualTitle: '체감 기준 vs 실제 가격',
    whyExpensiveTitle: '왜 비싸게 느껴질까',
    regionalPriceBody: '{regionName}의 실제 가격은 {price}원입니다.',
    perceivedVsActualBody: '기억 가격 {baselineLow}~{baselineHigh}원 vs 실제 {actual}원',
    addToBasket: '+ 장바구니에 추가'
  },
  basket: {
    title: '장바구니',
    empty: '장바구니에 담긴 품목이 없어요.'
  },
  expenditure: {
    title: '지출 관리',
    body: '지출 관리 대시보드는 향후 이 화면에서 제공될 예정입니다.'
  },
  category: {
    title: '카테고리',
    body: '카테고리별로 자주 보는 품목을 곧 이 화면에서 확인할 수 있어요.'
  },
  item: {
    rice10kg: '쌀 10kg',
    eggs: '계란 30개',
    milk1l: '우유 1L'
  },
  consumption: {
    food: '식료품',
    cafe: '카페',
    delivery: '배달',
    other: '기타'
  },
  nav: {
    home: '홈',
    category: '카테고리',
    basket: '장바구니',
    expenditure: '지출 관리'
  }
} as const;

