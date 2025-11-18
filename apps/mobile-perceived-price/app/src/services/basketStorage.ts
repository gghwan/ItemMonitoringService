import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BasketItem } from '../types';

// 한국어 주석: 장바구니를 AsyncStorage에 저장/불러오는 레이어입니다.

const STORAGE_KEY = 'perceived-price/basket';

export async function loadBasketItems(): Promise<BasketItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as BasketItem[];
    return parsed ?? [];
  } catch {
    return [];
  }
}

export async function saveBasketItems(items: BasketItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // 한국어 주석: 저장 실패 시 조용히 무시합니다. 추후 로깅 추가 가능.
  }
}


