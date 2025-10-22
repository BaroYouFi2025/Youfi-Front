import * as SecureStore from 'expo-secure-store';

export const REFRESH_TOKEN_KEY = 'refreshToken';

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.warn('Failed to retrieve refresh token from secure storage', error);
    return null;
  }
};

export const setRefreshToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.warn('Failed to persist refresh token to secure storage', error);
  }
};

export const deleteRefreshToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.warn('Failed to remove refresh token from secure storage', error);
  }
};
