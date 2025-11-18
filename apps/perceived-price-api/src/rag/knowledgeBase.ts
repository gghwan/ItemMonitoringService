// 한국어 주석:
// - RAG(Retrieval Augmented Generation)를 위한 간단한 지식 베이스 껍데기 구현입니다.
// - 현재는 실제 벡터스토어/임베딩 대신, 하드코딩된 문서 목록과
//   매우 단순한 키워드 매칭으로 top-k 문서를 반환합니다.
// - 향후 Gemini Embedding API + 벡터 DB(pgvector 등)로 교체합니다.

export type RagDocument = {
  id: string;
  title: string;
  body: string;
  tags: string[];
};

export type RagQuery = {
  topic: 'cpi' | 'living-price-index' | 'general-inflation';
  locale: 'ko' | 'en';
  limit?: number;
};

// TODO: 실제 서비스에서는 외부 파일/DB에서 문서를 로딩합니다.
const docs: RagDocument[] = [
  {
    id: 'cpi-basic-ko',
    title: '소비자물가지수(CPI)란?',
    tags: ['cpi', 'headline', '기본개념'],
    body:
      '소비자물가지수(CPI)는 가계가 구입하는 상품과 서비스의 평균 가격 변동을 측정하는 지표입니다. ' +
      '일반적으로 전체적인 물가 수준이 얼마나 올랐는지를 파악할 때 사용합니다.'
  },
  {
    id: 'living-index-vs-cpi-ko',
    title: '생활물가지수와 소비자물가지수의 차이',
    tags: ['living-price-index', 'cpi', '체감물가'],
    body:
      '생활물가지수는 자주 구입하는 품목 위주로 구성되어 있어, 소비자들이 체감하는 물가 상승을 더 민감하게 반영합니다. ' +
      '반면 소비자물가지수는 보다 광범위한 품목을 포함해 전체 물가 수준을 나타냅니다.'
  },
  {
    id: 'inflation-perception-ko',
    title: '체감 물가가 실제 물가보다 높게 느껴지는 이유',
    tags: ['체감물가', '심리'],
    body:
      '사람들은 자주 접하는 가격 변화에 더 민감하게 반응하고, 크게 오른 품목은 오래 기억하는 경향이 있습니다. ' +
      '또한 소득 대비 지출 비중이 큰 항목의 가격이 오르면 전체 물가가 더 많이 오른 것처럼 느껴질 수 있습니다.'
  }
];

export function retrieveRagContext(query: RagQuery): RagDocument[] {
  const limit = query.limit ?? 3;

  // 한국어 주석: 현재는 topic에 따라 태그 필터만 수행합니다.
  const topicTag =
    query.topic === 'cpi'
      ? 'cpi'
      : query.topic === 'living-price-index'
      ? 'living-price-index'
      : '체감물가';

  return docs.filter((doc) => doc.tags.includes(topicTag)).slice(0, limit);
}


