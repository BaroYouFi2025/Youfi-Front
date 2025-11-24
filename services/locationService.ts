import { getAccessToken } from '@/utils/authStorage';
import * as Battery from 'expo-battery';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { updateGpsLocation } from './deviceAPI';

const LOCATION_TASK_NAME = 'background-location-task';

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
        const accessToken = await getAccessToken();
        if (!accessToken) {
          return;
        }

        // 배터리 레벨 가져오기
        const batteryLevel = await Battery.getBatteryLevelAsync();
        const batteryPercent = Math.round(batteryLevel * 100);


        await updateGpsLocation(
          location.coords.latitude,
          location.coords.longitude,
          batteryPercent,
          accessToken
        );

      } catch (error) {
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

