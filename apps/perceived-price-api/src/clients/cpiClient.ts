import axios from 'axios';

// 한국어 주석: 국가 CPI 및 생활물가지수 등 거시 물가 지표를 가져오는 클라이언트입니다.
// 실제 구현에서는 e-나라지표 페이지(https://www.index.go.kr/...)를 파싱하거나,
// 별도 제공되는 API를 사용하는 방식으로 교체할 수 있습니다.

export type CpiSnapshot = {
  date: string;
  headlineCpiYoY: number;
  coreCpiYoY: number;
  livingPriceIndexYoY: number;
};

const CPI_URL =
  process.env.CPI_URL ??
  'https://www.index.go.kr/unity/potal/main/EachDtlPageDetail.do?idx_cd=1060';

export async function fetchLatestCpi(): Promise<CpiSnapshot> {
  try {
    // 한국어 주석:
    // - 현재는 HTML 파싱을 구현하지 않고, 향후 실제 파서 구현을 염두에 둔 껍데기입니다.
    // - axios 호출은 네트워크 연결/응답 확인 정도에만 사용하고, 값은 목업으로 반환합니다.
    await axios.get(CPI_URL);

    return {
      date: '2025-10-01',
      headlineCpiYoY: 2.4,
      coreCpiYoY: 2.0,
      livingPriceIndexYoY: 3.1
    };
  } catch (_err) {
    // 한국어 주석: CPI를 불러오지 못하더라도, 서비스가 완전히 중단되지 않도록
    // 안전한 기본값을 반환합니다.
    return {
      date: '2025-10-01',
      headlineCpiYoY: 2.4,
      coreCpiYoY: 2.0,
      livingPriceIndexYoY: 3.1
    };
  }
}


