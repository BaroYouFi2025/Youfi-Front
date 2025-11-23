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

    console.log('📍 ========== GPS 업데이트 트리거 ==========');
    console.log('📍 시간:', new Date().toISOString());
    console.log('📍 위치 데이터 개수:', locations.length);

    if (location) {
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          console.log('⏭️ GPS 업데이트 건너뜀: 로그인하지 않음');
          return;
        }

        // 배터리 레벨 가져오기
        const batteryLevel = await Battery.getBatteryLevelAsync();
        const batteryPercent = Math.round(batteryLevel * 100);

        console.log('📍 ========== 백그라운드 위치 정보 ==========');
        console.log('📍 위도 (latitude):', location.coords.latitude);
        console.log('📍 경도 (longitude):', location.coords.longitude);
        console.log('📍 고도 (altitude):', location.coords.altitude);
        console.log('📍 정확도 (accuracy):', location.coords.accuracy, 'm');
        console.log('📍 속도 (speed):', location.coords.speed, 'm/s');
        console.log('📍 방향 (heading):', location.coords.heading);
        console.log('📍 배터리 레벨:', batteryPercent, '%');
        console.log('📍 타임스탬프:', new Date(location.timestamp).toLocaleString('ko-KR'));
        console.log('📍 =========================================');

        await updateGpsLocation(
          location.coords.latitude,
          location.coords.longitude,
          batteryPercent,
          accessToken
        );
        
        console.log('📍 ========== GPS 업데이트 완료 ==========');
      } catch (error) {
        console.error('❌ ========== GPS 업데이트 실패 ==========');
        console.error('❌ 에러:', error);
        console.error('❌ ======================================');
      }
    } else {
      console.log('⚠️ 위치 데이터 없음');
    }
  }
});

/**
 * 백그라운드 위치 추적 시작
 */
export const startBackgroundLocationTracking = async (): Promise<boolean> => {
  try {
    console.log('📍 위치 권한 요청 시작');
    
    // 위치 권한 확인
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log('📍 포그라운드 위치 권한 상태:', status);
    
    if (status !== 'granted') {
      console.warn('⚠️ 위치 권한이 허용되지 않았습니다. 설정에서 권한을 허용해주세요.');
      return false;
    }

    // 백그라운드 위치 권한 확인 (Android와 iOS 모두)
    const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
    console.log('📍 백그라운드 위치 권한 상태:', backgroundStatus.status);
    
    if (backgroundStatus.status !== 'granted') {
      console.warn('⚠️ 백그라운드 위치 권한이 허용되지 않았습니다. 설정에서 "항상 허용"으로 변경해주세요.');
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
      timeInterval: 10000, // 10초마다
      distanceInterval: 50, // 50미터 이동 시
      foregroundService: {
        notificationTitle: 'YouFi 위치 추적',
        notificationBody: '위치를 업데이트하고 있습니다.',
      },
    });

    console.log('✅ 백그라운드 위치 추적 시작 (10초 간격)');
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
      console.log('✅ 백그라운드 위치 추적 중지');
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

