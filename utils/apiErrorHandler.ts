import { AxiosError } from 'axios';

/**
 * API 에러 메시지를 추출하는 통합 유틸리티
 * 모든 서비스 파일에서 공통으로 사용
 */
export const resolveErrorMessage = (error: AxiosError, defaultMessage?: string): string => {
  const fallbackMessage = defaultMessage || '요청에 실패했습니다. 다시 시도해주세요.';

  // HTTP 응답이 있는 경우
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data as { message?: string; errorMessage?: string } | string;

    // 상태 코드별 메시지
    if (status === 401) {
      return '인증 토큰이 유효하지 않습니다. 다시 로그인해주세요.';
    }
    if (status === 403) {
      return '접근 권한이 없습니다. 로그인 후 다시 시도해주세요.';
    }
    if (status === 404) {
      return '요청하신 정보를 찾을 수 없습니다.';
    }

    // 백엔드에서 보낸 에러 메시지 추출
    if (typeof data === 'object' && data !== null) {
      return data.message || data.errorMessage || `서버 오류 (${status})`;
    }
    if (typeof data === 'string' && data.trim()) {
      return data;
    }

    return `서버 오류 (${status})`;
  }

  // 네트워크 에러 등
  if (error.message) {
    return error.message;
  }

  return fallbackMessage;
};

/**
 * 인증이 필요한 API 호출용 토큰 검증 함수
 */
export const requireAccessToken = async (
  getAccessToken: () => Promise<string | null>
): Promise<string> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('로그인 세션이 만료되었습니다. 다시 로그인 후 시도해주세요.');
  }
  return token;
};

/**
 * 인증 헤더 생성 함수
 */
export const getAuthHeaders = async (
  getAccessToken: () => Promise<string | null>
): Promise<Record<string, string>> => {
  const accessToken = await getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return headers;
};
