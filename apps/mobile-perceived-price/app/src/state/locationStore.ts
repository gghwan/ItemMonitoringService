import { create } from 'zustand';
import type { Region } from '../types';
import { resolveUserRegion, type LocationResult } from '../services/locationService';

// 한국어 주석: 위치 기반 지역 정보를 전역으로 보관하는 저장소입니다.
// - 앱 진입 시 한 번만 권한 요청/위치 조회를 수행하고
// - 이후에는 저장된 Region 정보를 가격/체감 지수 API 호출에 활용합니다.

export type LocationStatus = 'idle' | 'loading' | 'success' | 'permission-denied' | 'error';

export type LocationState = {
  status: LocationStatus;
  region?: Region;
  errorMessage?: string;
  resolve: () => Promise<void>;
};

export const useLocationStore = create<LocationState>((set, get) => ({
  status: 'idle',
  region: undefined,
  errorMessage: undefined,
  resolve: async () => {
    const { status } = get();
    if (status === 'loading' || status === 'success' || status === 'permission-denied') {
      return;
    }

    set({ status: 'loading', errorMessage: undefined });

    const result: LocationResult = await resolveUserRegion();

    if (result.type === 'success') {
      set({ status: 'success', region: result.region });
      return;
    }

    if (result.type === 'permission-denied') {
      set({ status: 'permission-denied', errorMessage: undefined });
      return;
    }

    set({ status: 'error', errorMessage: result.message });
  }
}));


