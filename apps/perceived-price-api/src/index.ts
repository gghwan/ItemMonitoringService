import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pricesRouter } from './routes/prices';
import { cpiRouter } from './routes/cpi';
import { perceivedRouter } from './routes/perceived';

// 한국어 주석: 체감물가 서비스 백엔드의 엔트리 포인트입니다.
// 현재는 목업 데이터를 반환하며, 후속 작업에서 서울시 공공데이터와 Gemini 연동 로직을 채웁니다.

const app = express();
const port = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/v1/prices', pricesRouter);
app.use('/v1/inflation', cpiRouter);
app.use('/v1/perceived-prices', perceivedRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[perceived-price-api] listening on http://localhost:${port}`);
});


