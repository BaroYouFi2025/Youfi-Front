import { AxiosError } from 'axios';

import { resolveErrorMessage } from '@/utils/apiErrorHandler';
import { getAccessToken } from '@/utils/authStorage';

import apiClient from './apiClient';

/**
 * 이미지 파일을 업로드하고 서버에서 접근 가능한 URL을 반환합니다.
 */
export const uploadImage = async (imageUri: string, fileName = 'image.jpg'): Promise<string> => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error('로그인 세션이 만료되었습니다. 다시 로그인 후 시도해주세요.');
    }

    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: fileName,
    } as any);

    const response = await apiClient.post<{ url: string }>(
      '/images',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data.url;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};
