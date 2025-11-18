// 한국어 주석:
// - 실제 서비스에서는 Google Gemini API를 호출해 체감 물가 해석 카드를 생성합니다.
// - 여기서는 백엔드에서 결정적으로 계산한 수치들을 기반으로, 간단한 해석 문장을 만들어내는
//   순수 함수 형태의 껍데기 구현과, RAG 컨텍스트를 결합하는 인터페이스만 제공합니다.

import type { CpiSnapshot } from './cpiClient';
import { retrieveRagContext, type RagDocument } from '../rag/knowledgeBase';
import { GoogleGenerativeAI } from '@google/generative-ai';

export type RegionSummary = {
  code: string;
  name: string;
  level: 'city' | 'district';
  parentCode: string | null;
};

export type PerceivedBaseline = {
  itemCode: string;
  regionCode: string;
  lowerBound: number;
  upperBound: number;
  currency: 'KRW';
  referencePeriodLabel: string;
};

export type InterpretationInput = {
  itemCode: string;
  region: RegionSummary;
  baseline: PerceivedBaseline;
  actualPrice: number;
  macro: CpiSnapshot;
  locale?: 'ko' | 'en';
};

export type InterpretationResult = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

// 한국어 주석:
// - fallback 해석 로직: Gemini를 사용하지 않고도 동작해야 하므로, 순수 함수로 유지합니다.
export function generatePerceivedInterpretationFallback(
  input: InterpretationInput
): InterpretationResult {
  const { itemCode, region, baseline, actualPrice, macro, locale = 'ko' } = input;

  const midpoint = (baseline.lowerBound + baseline.upperBound) / 2;
  const diff = actualPrice - midpoint;
  const diffPercent = (diff / midpoint) * 100;

  const direction =
    diffPercent > 5 ? '비싸게' : diffPercent < -5 ? '저렴하게' : '비슷하게';

  const macroSentence =
    macro.livingPriceIndexYoY > macro.headlineCpiYoY
      ? '생활물가지수 상승률이 전체 소비자물가지수보다 높아, 체감 물가가 더 가파르게 오르고 있습니다.'
      : '전체 소비자물가지수와 생활물가지수가 비슷한 수준으로 움직이고 있습니다.';

  // 한국어 주석:
  // - RAG 컨텍스트: CPI/생활물가/체감 물가 관련 설명을 짧게 가져와, 본문 뒤에 덧붙입니다.
  // - 실제 Gemini 호출 시에는 이 컨텍스트를 prompt에 주입하는 형태로 사용합니다.
  const contextDocs: RagDocument[] = retrieveRagContext({
    topic: 'living-price-index',
    locale,
    limit: 2
  });

  const contextText =
    contextDocs.length > 0
      ? '\n\n참고로, 다음 설명도 함께 볼 수 있어요:\n' +
        contextDocs
          .map((doc) => `- ${doc.title}: ${doc.body}`)
          .join('\n')
      : '';

  const body =
    `${region.name}에서 ${itemCode}의 최근 가격은 ${actualPrice.toLocaleString()}원으로, ` +
    `지난 ${baseline.referencePeriodLabel} 동안 기억해 둔 가격대(약 ${baseline.lowerBound.toLocaleString()}~${baseline.upperBound.toLocaleString()}원)에 비해 ` +
    `${Math.abs(diffPercent).toFixed(1)}% 정도 ${direction} 느껴질 수 있어요. ` +
    macroSentence +
    contextText;

  return {
    id: `interpretation-${itemCode}`,
    title: '왜 이렇게 비싸게 느껴질까요?',
    body,
    createdAt: new Date().toISOString()
  };
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL_NAME = process.env.GEMINI_MODEL_NAME ?? 'gemini-1.5-pro';

// 한국어 주석:
// - Gemini API를 호출해 InterpretationResult를 생성합니다.
// - 실패 시 generatePerceivedInterpretationFallback을 사용합니다.
export async function buildInterpretation(
  input: InterpretationInput
): Promise<InterpretationResult> {
  if (!GEMINI_API_KEY) {
    return generatePerceivedInterpretationFallback(input);
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });

    const { itemCode, region, baseline, actualPrice, macro, locale = 'ko' } = input;

    const midpoint = (baseline.lowerBound + baseline.upperBound) / 2;
    const diff = actualPrice - midpoint;
    const diffPercent = (diff / midpoint) * 100;

    const contextDocs: RagDocument[] = retrieveRagContext({
      topic: 'living-price-index',
      locale,
      limit: 3
    });

    const systemInstruction =
      '당신은 생활 물가 서비스의 해설 카드 작가입니다. ' +
      '응답은 반드시 유효한 JSON 형식으로만 반환하세요. ' +
      '숫자 계산은 입력으로 주어진 값을 그대로 사용하고, 새로운 수치를 임의로 만들지 마세요.';

    const prompt = {
      item: {
        code: itemCode,
        regionCode: region.code,
        regionName: region.name,
        baselineLower: baseline.lowerBound,
        baselineUpper: baseline.upperBound,
        actualPrice,
        diffPercent,
        currency: baseline.currency
      },
      macro: {
        headlineCpiYoY: macro.headlineCpiYoY,
        livingPriceIndexYoY: macro.livingPriceIndexYoY,
        coreCpiYoY: macro.coreCpiYoY
      },
      contextDocs,
      locale
    };

    const userInstruction =
      '다음 JSON 입력을 바탕으로, 사용자가 이해하기 쉬운 한국어 해석 카드를 만들어 주세요.\n' +
      '응답 형식은 다음 JSON 스키마를 따라야 합니다.\n' +
      '{ "title": string, "body": string }\n' +
      '설명은 3~6문장 정도로, 왜 현재 가격이 비싸게/저렴하게/비슷하게 느껴지는지에 초점을 맞춰 주세요.';

    const result = await model.generateContent({
      systemInstruction,
      contents: [
        {
          role: 'user',
          parts: [
            { text: userInstruction },
            { text: JSON.stringify(prompt) }
          ]
        }
      ]
    });

    const text = result.response.text().trim();

    let parsed: { title?: string; body?: string };
    try {
      parsed = JSON.parse(text);
    } catch {
      // 모델이 JSON 포맷을 완전히 지키지 못한 경우를 대비해 폴백
      return generatePerceivedInterpretationFallback(input);
    }

    if (!parsed.title || !parsed.body) {
      return generatePerceivedInterpretationFallback(input);
    }

    return {
      id: `interpretation-${input.itemCode}`,
      title: parsed.title,
      body: parsed.body,
      createdAt: new Date().toISOString()
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[geminiClient] failed to call Gemini, falling back to local interpretation', err);
    return generatePerceivedInterpretationFallback(input);
  }
}



