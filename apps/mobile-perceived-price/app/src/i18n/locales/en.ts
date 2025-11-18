// 한국어 주석: 영어 언어팩입니다. 기본은 한국어지만, 확장을 위해 함께 정의합니다.

export const en = {
  common: {
    loading: 'Loading…',
    errorGeneric: 'Failed to load data. Please try again later.'
  },
  home: {
    title: "Today's Perceived Index",
    searchPlaceholder: 'Search items (e.g., rice, eggs, milk)',
    basketTodayTitle: 'If you buy your basket today…',
    basketTodayBody: 'If you buy everything in your basket today, it may feel about {extraCost} KRW more expensive.',
    basketSummary: 'Basket summary',
    basketEmpty: 'No items saved yet. Add some from item detail.',
    basketViewLink: 'View basket',
    consumptionPattern: 'My consumption pattern',
    topPriceChanges: 'Top price changes',
    noSpendingData: 'No spending data yet.',
    noTopChanges: 'No significant price changes detected.'
  },
  search: {
    title: 'Search items',
    placeholder: 'Search items (e.g., rice, eggs, milk)',
    suggestionRice: 'Rice 10kg',
    suggestionEggs: 'Eggs 30pcs',
    suggestionMilk: 'Milk 1L'
  },
  detail: {
    title: 'Item detail',
    regionalPriceTitle: 'Regional actual price',
    perceivedVsActualTitle: 'Perceived baseline vs actual',
    whyExpensiveTitle: 'Why this feels expensive',
    regionalPriceBody: '{regionName} actual price {price} KRW.',
    perceivedVsActualBody: 'Baseline {baselineLow}–{baselineHigh} KRW vs actual {actual} KRW',
    addToBasket: '+ Add to basket'
  },
  basket: {
    title: 'Basket',
    empty: 'No items in your basket yet.'
  },
  expenditure: {
    title: 'Expenditure',
    body: 'Spending management dashboards will be rendered here.'
  },
  category: {
    title: 'Category',
    body: 'You will soon be able to browse frequently checked items by category here.'
  },
  item: {
    rice10kg: 'Rice 10kg',
    eggs: 'Eggs 30pcs',
    milk1l: 'Milk 1L'
  },
  consumption: {
    food: 'Groceries',
    cafe: 'Cafe',
    delivery: 'Delivery',
    other: 'Other'
  },
  nav: {
    home: 'Home',
    category: 'Category',
    basket: 'Basket',
    expenditure: 'Expenditure'
  }
} as const;

