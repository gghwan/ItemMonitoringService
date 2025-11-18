import type { HomePerceivedIndexSummary, BasketItem } from '../types';
import { httpClient } from './httpClient';

// 한국어 주석: 홈 화면에서 사용할 가격 요약 정보를 제공하는 레포지토리입니다.

export type HomePriceSummary = {
  perceivedIndex: HomePerceivedIndexSummary;
  basketItems: BasketItem[];
};

export async function fetchHomePriceSummary(regionCode?: string): Promise<HomePriceSummary> {
  const response = await httpClient.get<HomePriceSummaryResponse>('/v1/perceived-prices/summary', {
    params: regionCode ? { regionCode } : undefined
  });
  const { perceivedIndex, basketItems } = response.data;
  return { perceivedIndex, basketItems };
}

type HomePriceSummaryResponse = {
  perceivedIndex: HomePerceivedIndexSummary;
  basketItems: BasketItem[];
};
