import { create } from 'zustand';
import type { Item } from '../types';

// 한국어 주석: 검색 화면의 MVI 스타일 상태 저장소입니다. 현재는 목업 아이템을 사용합니다.

const ALL_ITEMS: Item[] = [
  { code: 'RICE_10KG', name: 'Rice 10kg', category: 'grain', unitLabel: '10kg' },
  { code: 'EGG_30', name: 'Eggs 30pcs', category: 'dairy', unitLabel: '30 pcs' },
  { code: 'MILK_1L', name: 'Milk 1L', category: 'dairy', unitLabel: '1L' }
];

export type SearchState = {
  query: string;
  results: Item[];
  updateQuery: (value: string) => void;
  clear: () => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  results: ALL_ITEMS,
  updateQuery: (value: string) => {
    const trimmed = value ?? '';
    const lower = trimmed.toLowerCase();
    const filtered = ALL_ITEMS.filter((item) =>
      item.name.toLowerCase().includes(lower)
    );

    set({ query: trimmed, results: filtered });
  },
  clear: () => set({ query: '', results: ALL_ITEMS })
}));


