import type { PerceivedPriceBaseline, InterpretationCard, Region } from '../types';
import { httpClient } from './httpClient';

// 한국어 주석: 체감 기준 가격 및 해석 카드를 제공하는 레포지토리입니다.

export type PerceivedPriceDetail = {
  region: Region;
  baseline: PerceivedPriceBaseline;
  actualPrice: number;
  currency: 'KRW';
  interpretation: InterpretationCard;
};

export async function fetchPerceivedPriceDetail(
  itemCode: string,
  regionCode?: string
): Promise<PerceivedPriceDetail> {
  const response = await httpClient.get<PerceivedPriceDetailResponse>(
    `/v1/perceived-prices/items/${encodeURIComponent(itemCode)}`,
    {
      params: regionCode ? { regionCode } : undefined
    }
  );

  const { region, baseline, actualPrice, currency, interpretation } = response.data;

  return {
    region,
    baseline,
    actualPrice,
    currency,
    interpretation
  };
}

type PerceivedPriceDetailResponse = {
  region: Region;
  baseline: PerceivedPriceBaseline;
  actualPrice: number;
  currency: 'KRW';
  interpretation: InterpretationCard;
};


