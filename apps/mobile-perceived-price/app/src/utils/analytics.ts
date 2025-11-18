// 한국어 주석: KPI 측정을 위한 간단한 이벤트 로깅 유틸입니다.
// 실제 서비스에서는 분석 SDK(예: Amplitude, Firebase 등)로 교체됩니다.

type AnalyticsEventName =
  | 'search_query'
  | 'search_select_item'
  | 'basket_add_item'
  | 'basket_remove_item'
  | 'item_detail_view'
  | 'interpretation_scroll_depth'
  | 'home_perceived_index_impression';

type AnalyticsEventPayload = Record<string, unknown>;

export function logEvent(name: AnalyticsEventName, payload: AnalyticsEventPayload = {}): void {
  // eslint-disable-next-line no-console
  console.log('[analytics]', name, payload);
}

export function logSearchQuery(query: string): void {
  logEvent('search_query', { query });
}

export function logSearchSelectItem(itemCode: string): void {
  logEvent('search_select_item', { itemCode });
}

export function logBasketAddItem(itemCode: string): void {
  logEvent('basket_add_item', { itemCode });
}

export function logBasketRemoveItem(itemCode: string): void {
  logEvent('basket_remove_item', { itemCode });
}

export function logItemDetailView(itemCode: string): void {
  logEvent('item_detail_view', { itemCode });
}

export function logInterpretationScrollDepth(itemCode: string, depthRatio: number): void {
  logEvent('interpretation_scroll_depth', { itemCode, depthRatio });
}

export function logHomePerceivedIndexImpression(regionCode: string): void {
  logEvent('home_perceived_index_impression', { regionCode });
}


