import { getAccessToken, getStoredFCMToken } from '@/utils/authStorage';
import * as Battery from 'expo-battery';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { updateGpsLocation } from './deviceAPI';

const LOCATION_TASK_NAME = 'background-location-task';

// 마지막 GPS 업데이트 추적용 변수
let lastGpsUpdate: {
  timestamp: number;
  latitude: number;
  longitude: number;
} | null = null;

// 두 좌표 간 거리 계산 (미터)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // 지구 반지름 (미터)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 거리 (미터)
};

// 백그라운드 위치 추적 태스크 정의
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('❌ 위치 추적 태스크 오류:', error);
    return;
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const location = locations[locations.length - 1];


    if (location) {
      try {
        // 토큰 존재 여부 확인 (apiClient 인터셉터가 자동으로 사용)
        const accessToken = await getAccessToken();
        if (!accessToken) {
          console.log('⚠️ AccessToken이 없어 GPS 업데이트를 건너뜁니다.');
          return;
        }

        // GPS 업데이트 조건 확인
        let shouldUpdate = false;
        let updateReason = '초기 위치';

        if (lastGpsUpdate) {
          const timeDiff = Date.now() - lastGpsUpdate.timestamp;
          const distance = calculateDistance(
            lastGpsUpdate.latitude,
            lastGpsUpdate.longitude,
            location.coords.latitude,
            location.coords.longitude
          );

          // 60초 경과 또는 50m 이상 이동한 경우에만 업데이트
          if (timeDiff >= 60000) {
            shouldUpdate = true;
            updateReason = `시간 간격 (${Math.round(timeDiff / 1000)}초 경과)`;
          } else if (distance >= 50) {
            shouldUpdate = true;
            updateReason = `거리 이동 (${Math.round(distance)}m 이동)`;
          } else {
            // 조건을 만족하지 않으면 건너뛰기
            return;
          }
        } else {
          // 첫 업데이트는 항상 실행
          shouldUpdate = true;
        }

        // 조건을 만족하는 경우에만 업데이트 실행
        if (shouldUpdate) {
          // 배터리 레벨 가져오기
          const batteryLevel = await Battery.getBatteryLevelAsync();
          const batteryPercent = Math.round(batteryLevel * 100);

          await updateGpsLocation(
            location.coords.latitude,
            location.coords.longitude,
            batteryPercent
          );
        }

        // 마지막 업데이트 정보 저장
        lastGpsUpdate = {
          timestamp: Date.now(),
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

      } catch (error: any) {
        // 404 에러 (리소스를 찾을 수 없음) 발생 시 기기 재등록 시도
        if (error.message?.includes('404') || error.response?.status === 404) {
          console.log('♻️ 기기 정보가 유효하지 않아 재등록을 시도합니다...');
          try {
            const fcmToken = await getStoredFCMToken();
            const currentAccessToken = await getAccessToken();
            if (!currentAccessToken) {
              console.log('⚠️ AccessToken이 없어 재등록을 건너뜁니다.');
              return;
            }

            const { registerDevice } = await import('./deviceAPI');
            await registerDevice(fcmToken || '', currentAccessToken);

            // 배터리 레벨 다시 가져오기
            const currentBatteryLevel = await Battery.getBatteryLevelAsync();
            const currentBatteryPercent = Math.round(currentBatteryLevel * 100);

            // 재등록 후 GPS 업데이트 재시도 (apiClient 인터셉터가 자동으로 토큰 추가)
            console.log('✅ 기기 재등록 성공, GPS 업데이트 재시도');
            await updateGpsLocation(
              location.coords.latitude,
              location.coords.longitude,
              currentBatteryPercent
            );
            return; // 재시도 성공 시 종료
          } catch (retryError) {
            console.error('❌ 기기 재등록 및 GPS 업데이트 재시도 실패:', retryError);
          }
        }

        console.error('❌ ========== GPS 업데이트 실패 ==========');
        console.error('❌ 에러:', error);
        console.error('❌ ======================================');
      }
    } else {
    }
  }
});

/**
 * 백그라운드 위치 추적 시작
 */
export const startBackgroundLocationTracking = async (): Promise<boolean> => {
  try {

    // 위치 권한 확인
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      return false;
    }

    // 백그라운드 위치 권한 확인 (Android와 iOS 모두)
    const backgroundStatus = await Location.requestBackgroundPermissionsAsync();

    if (backgroundStatus.status !== 'granted') {
      return false;
    }

    // 이미 실행 중인지 확인
    const isTaskDefined = TaskManager.isTaskDefined(LOCATION_TASK_NAME);
    if (!isTaskDefined) {
      console.error('❌ 위치 추적 태스크가 정의되지 않았습니다.');
      return false;
    }

    // 백그라운드 위치 추적 시작
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 60000, // 60초마다
      distanceInterval: 50, // 50미터 이동 시
      deferredUpdatesInterval: 60000, // Android: 최소 60초 간격 보장
      foregroundService: {
        notificationTitle: 'YouFi 위치 추적',
        notificationBody: '위치를 업데이트하고 있습니다.',
      },
    });

    return true;
  } catch (error) {
    console.error('❌ 백그라운드 위치 추적 시작 실패:', error);
    return false;
  }
};

/**
 * 백그라운드 위치 추적 중지
 */
export const stopBackgroundLocationTracking = async (): Promise<void> => {
  try {
    const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (isRunning) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
  } catch (error) {
    console.error('❌ 백그라운드 위치 추적 중지 실패:', error);
  }
};

/**
 * 현재 위치 추적 상태 확인
 */
export const isLocationTrackingActive = async (): Promise<boolean> => {
  try {
    return await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  } catch (error) {
    console.error('❌ 위치 추적 상태 확인 실패:', error);
    return false;
  }
};

