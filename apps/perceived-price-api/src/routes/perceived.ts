import { Router } from 'express';
import { fetchLatestPriceFromSeoul } from '../clients/seoulPriceClient';
import { fetchLatestCpi } from '../clients/cpiClient';
import {
  buildInterpretation,
  type PerceivedBaseline
} from '../clients/geminiClient';

// 한국어 주석: 결정적 지표 + Gemini 기반 체감 가격/해석 정보를 제공하는 엔드포인트입니다.
// 현재는 Gemini 호출 대신 결정적 계산을 기반으로 한 간단한 해석 문장을 생성합니다.

export const perceivedRouter = Router();

perceivedRouter.get('/items/:itemCode', async (req, res) => {
  const { itemCode } = req.params;
  const regionCodeFromQuery = typeof req.query.regionCode === 'string' ? req.query.regionCode : undefined;

  try {
    const regionCode = regionCodeFromQuery ?? 'SEOUL_GANGSEO';
    const region = {
      code: regionCode,
      name: regionCode === 'SEOUL_GANGNAM' ? 'Seoul · Gangnam-gu' : 'Seoul · Gangseo-gu',
      level: 'district' as const,
      parentCode: 'SEOUL'
    };

    const latestPrice = await fetchLatestPriceFromSeoul(itemCode, region.code);
    const latestSnapshot = latestPrice.snapshots[latestPrice.snapshots.length - 1];
    const actualPrice = latestSnapshot.price;

    const baseline: PerceivedBaseline = {
      itemCode,
      regionCode: region.code,
      // 한국어 주석: 실제 구현에서는 사용자별 기억 가격/구매 주기 등을 반영해 계산합니다.
      lowerBound: Math.round(actualPrice * 0.9),
      upperBound: Math.round(actualPrice * 1.1),
      currency: 'KRW',
      referencePeriodLabel: '최근 12개월'
    };

    const macro = await fetchLatestCpi();
    const interpretation = await buildInterpretation({
      itemCode,
      region,
      baseline,
      actualPrice,
      macro
    });

    res.json({
      region,
      baseline,
      actualPrice,
      currency: 'KRW',
      interpretation
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[perceivedRouter] failed to build perceived price detail', err);
    res.status(500).json({ message: 'Failed to build perceived price detail' });
  }
});

perceivedRouter.get('/summary', (req, res) => {
  // 한국어 주석: 홈 화면에서 사용할 체감 인덱스 요약용 목업 엔드포인트입니다.
  const regionCodeFromQuery = typeof req.query.regionCode === 'string' ? req.query.regionCode : undefined;
  const regionCode = regionCodeFromQuery ?? 'SEOUL_GANGSEO';
  const region = {
    code: regionCode,
    name: regionCode === 'SEOUL_GANGNAM' ? 'Seoul · Gangnam-gu' : 'Seoul · Gangseo-gu',
    level: 'district',
    parentCode: 'SEOUL'
  };

  const perceivedExtraCost = 1000;

  res.json({
    perceivedIndex: {
      region,
      perceivedExtraCost,
      currency: 'KRW' as const
    },
    basketItems: []
  });
});



