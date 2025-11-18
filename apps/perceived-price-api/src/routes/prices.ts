import { Router } from 'express';
import { fetchLatestPriceFromSeoul } from '../clients/seoulPriceClient';

// 한국어 주석: 서울시 물가 API 및 기타 공공데이터에서 정규화된 가격 정보를 제공하는 엔드포인트입니다.
// 현재는 서버 내부에서 서울시 API를 호출한 뒤, 내부 도메인 모델로 변환해 반환합니다.

export const pricesRouter = Router();

pricesRouter.get('/items/:itemCode/regions/:regionCode/latest', async (req, res) => {
  const { itemCode, regionCode } = req.params;

  try {
    const normalized = await fetchLatestPriceFromSeoul(itemCode, regionCode);
    res.json(normalized);
  } catch (err) {
    // 한국어 주석: 예기치 못한 오류의 경우 최소한의 정보와 함께 500을 반환합니다.
    // 클라이언트는 공통 에러 메시지를 사용합니다.
    // eslint-disable-next-line no-console
    console.error('[pricesRouter] failed to fetch latest price', err);
    res.status(500).json({ message: 'Failed to fetch latest price' });
  }
});

