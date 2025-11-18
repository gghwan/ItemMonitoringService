import { create } from 'zustand';
import type { PerceivedPriceDetail } from '../services/perceivedPriceRepository';
import { fetchPerceivedPriceDetail } from '../services/perceivedPriceRepository';

// 한국어 주석: 품목 상세 화면의 상태 저장소입니다.

export type ItemDetailState = {
  isLoading: boolean;
  errorMessage?: string;
  detail?: PerceivedPriceDetail;
  loadItemDetail: (itemCode: string, regionCode?: string) => Promise<void>;
};

export const useItemDetailStore = create<ItemDetailState>((set) => ({
  isLoading: false,
  errorMessage: undefined,
  detail: undefined,
  loadItemDetail: async (itemCode: string, regionCode?: string) => {
    set({ isLoading: true, errorMessage: undefined });

    try {
      const detail = await fetchPerceivedPriceDetail(itemCode, regionCode);
      set({ detail, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        errorMessage: 'Failed to load item detail.'
      });
    }
  }
}));


