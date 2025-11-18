import { create } from 'zustand';
import { nanoid } from 'nanoid/non-secure';
import type { BasketItem, Item, Region } from '../types';
import { loadBasketItems, saveBasketItems } from '../services/basketStorage';

// 한국어 주석: 장바구니 상태 저장소입니다. AsyncStorage와 동기화합니다.

export type BasketState = {
  items: BasketItem[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  addItem: (item: Item, region: Region) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clear: () => Promise<void>;
};

export const useBasketStore = create<BasketState>((set, get) => ({
  items: [],
  isHydrated: false,
  hydrate: async () => {
    if (get().isHydrated) {
      return;
    }
    const stored = await loadBasketItems();
    set({ items: stored, isHydrated: true });
  },
  addItem: async (item: Item, region: Region) => {
    const next: BasketItem = {
      id: nanoid(),
      item,
      region
    };
    const items = [...get().items, next];
    set({ items });
    await saveBasketItems(items);
  },
  removeItem: async (id: string) => {
    const items = get().items.filter((entry) => entry.id !== id);
    set({ items });
    await saveBasketItems(items);
  },
  clear: async () => {
    set({ items: [] });
    await saveBasketItems([]);
  }
}));


