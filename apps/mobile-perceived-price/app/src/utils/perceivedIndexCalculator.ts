import type { BasketItem, HomePerceivedIndexSummary, Region } from '../types';

// 한국어 주석: 장바구니 품목과 지역 정보를 바탕으로 체감 인덱스를 계산하는 헬퍼입니다.
// 실제 서비스에서는 서버에서 계산하지만, 클라이언트에서도 간단한 시뮬레이션이나 캐시된 값을 재구성할 때 사용할 수 있습니다.

export type PerceivedIndexInput = {
  region: Region;
  basket: BasketItem[];
};

export function calculatePerceivedIndex(input: PerceivedIndexInput): HomePerceivedIndexSummary {
  const { region, basket } = input;

  // 품목 수에 비례해서 간단히 체감 추가 비용을 추정하는 목업 로직입니다.
  const baseExtraCost = 1000;
  const extraPerItem = 250;
  const perceivedExtraCost = baseExtraCost + extraPerItem * Math.max(basket.length - 1, 0);

  return {
    region,
    perceivedExtraCost,
    currency: 'KRW'
  };
}


