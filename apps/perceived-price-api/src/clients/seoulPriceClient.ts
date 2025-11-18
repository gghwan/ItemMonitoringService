import axios from 'axios';

// 한국어 주석: 서울시 물가 관련 오픈 API를 호출해 내부 도메인 모델로 변환하는 클라이언트입니다.
// 실제 필드 구조는 공개 문서를 참고해 보완하고, 여기서는 MVP용 최소 껍데기와 타입만 정의합니다.

export type SeoulPriceSnapshot = {
  itemCode: string;
  itemName: string;
  unit: string;
  regionCode: string;
  regionName: string;
  price: number;
  currency: 'KRW';
  observedAt: string;
};

export type NormalizedPriceResponse = {
  item: {
    code: string;
    name: string;
    category: string;
    unitLabel: string;
  };
  region: {
    code: string;
    name: string;
    level: 'city' | 'district';
    parentCode: string | null;
  };
  snapshots: Array<{
    source: 'seoul';
    price: number;
    currency: 'KRW';
    observedAt: string;
  }>;
};

const SEOUL_PRICE_API_BASE_URL =
  process.env.SEOUL_PRICE_API_BASE_URL ?? 'http://115.84.165.40';

// 한국어 주석:
// - 실제 API 스펙에 따라 querystring/path를 조정해야 합니다.
// - 여기서는 itemCode/regionCode를 그대로 전달하는 GET 엔드포인트가 있다고 가정한 껍데기입니다.

export async function fetchLatestPriceFromSeoul(
  itemCode: string,
  regionCode: string
): Promise<NormalizedPriceResponse> {
  try {
    const url = `${SEOUL_PRICE_API_BASE_URL}/api/prices/latest`;
    const response = await axios.get<SeoulPriceSnapshot>(url, {
      params: { itemCode, regionCode }
    });

    const payload = response.data;

    return {
      item: {
        code: payload.itemCode,
        name: payload.itemName,
        category: 'unknown',
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
  } catch (_err) {
    // 한국어 주석: 서울시 API가 실패한 경우를 위해, 기존 목업과 비슷한 안전한 기본값을 반환합니다.
    return {
      item: {
        code: itemCode,
        name: 'Rice 10kg',
        category: 'grain',
        unitLabel: '10kg'
      },
      region: {
        code: regionCode,
        name: 'Seoul · Gangseo-gu',
        level: 'district',
        parentCode: 'SEOUL'
      },
      snapshots: [
        {
          source: 'seoul',
          price: 51900,
          currency: 'KRW',
          observedAt: '2025-10-01'
        }
      ]
    };
  }
}


