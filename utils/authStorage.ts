import * as SecureStore from 'expo-secure-store';

export const REFRESH_TOKEN_KEY = 'refreshToken';
export const ACCESS_TOKEN_KEY = 'accessToken';

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    return null;
  }
};

export const setRefreshToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (error) {
  }
};

export const deleteRefreshToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
    return null;
  }
};

export const setAccessToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  } catch (error) {
  }
};

export const deleteAccessToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
  }
};

export const clearStoredTokens = async (): Promise<void> => {
  await Promise.allSettled([
    deleteAccessToken(),
    deleteRefreshToken(),
    deleteStoredFCMToken(),
    deleteDeviceId(), // deviceId도 함께 삭제
  ]);
};

// FCM 토큰 저장/조회
export const FCM_TOKEN_KEY = 'fcmToken';
export const DEVICE_UUID_KEY = 'deviceUuid';

export const getStoredFCMToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(FCM_TOKEN_KEY);
  } catch (error) {
    return null;
  }
};

export const setStoredFCMToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(FCM_TOKEN_KEY, token);
  } catch (error) {
  }
};

export const deleteStoredFCMToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(FCM_TOKEN_KEY);
  } catch (error) {
  }
};

// Device UUID 저장/조회
export const getDeviceUuid = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(DEVICE_UUID_KEY);
  } catch (error) {
    return null;
  }
};

export const setDeviceUuid = async (uuid: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(DEVICE_UUID_KEY, uuid);
  } catch (error) {
  }
};

export const generateDeviceUuid = (): string => {
  // 간단한 UUID v4 형식 생성 (실제로는 crypto.randomUUID()를 사용하는 것이 좋지만, React Native에서는 이 방법 사용)
  const chars = '0123456789abcdef';
  const segments = [8, 4, 4, 4, 12];
  return segments
    .map((len) => {
      let segment = '';
      for (let i = 0; i < len; i++) {
        segment += chars[Math.floor(Math.random() * chars.length)];
      }
      return segment;
    })
    .join('-');
};

// Device ID 저장/조회 (Numeric ID from DB)
export const DEVICE_ID_KEY = 'deviceId';

export const getDeviceId = async (): Promise<number | null> => {
  try {
    const id = await SecureStore.getItemAsync(DEVICE_ID_KEY);
    return id ? parseInt(id, 10) : null;
  } catch (error) {
    return null;
  }
};

export const setDeviceId = async (id: number): Promise<void> => {
  try {
    await SecureStore.setItemAsync(DEVICE_ID_KEY, id.toString());
  } catch (error) {
  }
};

export const deleteDeviceId = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(DEVICE_ID_KEY);
  } catch (error) {
  }
};
