import axios, { AxiosInstance } from 'axios';
import { apiConfig } from '@app/config/env';

// 한국어 주석: 공통 HTTP 클라이언트 인스턴스. baseURL은 env 설정에서 가져옵니다.

export const httpClient: AxiosInstance = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: 10_000
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 한국어 주석: 이 레벨에서 공통 에러 로깅/변환을 수행할 수 있습니다.
    return Promise.reject(error);
  }
);


