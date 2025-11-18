import * as ExpoLocation from 'expo-location';
import type { Region } from '../types';

// 한국어 주석: 위치 기반 지역 정보를 제공하는 서비스입니다.
// 현재는 권한 요청 + 간단한 목업 매핑만 수행합니다.

export type LocationResult =
  | { type: 'success'; region: Region }
  | { type: 'permission-denied' }
  | { type: 'error'; message: string };

export async function resolveUserRegion(): Promise<LocationResult> {
  try {
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      return { type: 'permission-denied' };
    }

    const location = await ExpoLocation.getCurrentPositionAsync({});
    // TODO: 위도/경도를 행정구역 코드로 매핑하는 로직을 추가합니다.
    // 현재는 강서구로 고정된 목업 값을 반환합니다.

    const region: Region = {
      code: 'SEOUL_GANGSEO',
      name: 'Seoul · Gangseo-gu',
      level: 'district',
      parentCode: 'SEOUL'
    };

    return { type: 'success', region };
  } catch (err) {
    return { type: 'error', message: 'Failed to determine region' };
  }
}


