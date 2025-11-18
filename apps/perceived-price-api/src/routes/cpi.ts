import { Router } from 'express';
import { fetchLatestCpi } from '../clients/cpiClient';

// 한국어 주석: 국가 CPI 및 생활물가지수 등 거시 물가 지표를 제공하는 엔드포인트입니다.

export const cpiRouter = Router();

// 결과 경로: /v1/inflation/cpi/latest
cpiRouter.get('/latest', async (_req, res) => {
  try {
    const snapshot = await fetchLatestCpi();
    res.json(snapshot);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[cpiRouter] failed to fetch latest CPI', err);
    res.status(500).json({ message: 'Failed to fetch CPI' });
  }
});


