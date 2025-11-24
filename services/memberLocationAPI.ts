import EventSource from 'react-native-sse';
import type {
    SSEConnectionOptions,
    SSELocationEvent
} from '../types/MemberLocationTypes';
import { getAccessToken } from '../utils/authStorage';
import { API_BASE_URL } from './config';

let eventSource: EventSource | null = null;

/**
 * 구성원 위치 스트림에 연결
 */
export const connectMemberLocationStream = async (
    options: SSEConnectionOptions
): Promise<void> => {
    const { onUpdate, onError, onHeartbeat } = options;

    // 기존 연결이 있으면 종료
    if (eventSource) {
        disconnectMemberLocationStream();
    }

    try {
        const token = await getAccessToken();
        if (!token) {
            throw new Error('인증 토큰이 없습니다.');
        }

        // react-native-sse가 Authorization 헤더를 제대로 전달하지 못하는 문제로
        // 쿼리 파라미터로 토큰 전달 (서버가 지원하는 경우)
        const url = `${API_BASE_URL}/members/locations/stream?token=${encodeURIComponent(token)}`;

        console.log('📡 ========== SSE 연결 시작 ==========');
        console.log('📡 URL:', API_BASE_URL + '/members/locations/stream');
        console.log('📡 시간:', new Date().toISOString());
        console.log('📡 토큰 (앞 20자):', token.substring(0, 20) + '...');
        console.log('📡 토큰 길이:', token.length);
        console.log('📡 쿼리 파라미터로 토큰 전달 시도');

        eventSource = new EventSource(url, {
            headers: {
                'Accept': 'text/event-stream',
            },
            pollingInterval: 0, // SSE는 폴링 비활성화
        });

        // 메시지 수신 이벤트
        eventSource.addEventListener('message', (event) => {
            try {
                const data: SSELocationEvent = JSON.parse(event.data as string);

                console.log(`📡 SSE 이벤트 수신: ${data.type}`, data.timestamp);

                switch (data.type) {
                    case 'INITIAL':
                    case 'UPDATE':
                        // payload가 null이거나 빈 배열이어도 업데이트 (구성원이 없는 경우)
                        const members = data.payload || [];
                        console.log(`📡 구성원 위치 업데이트: ${members.length}명`);
                        onUpdate(members);
                        break;
                    case 'HEARTBEAT':
                        console.log('💓 Heartbeat 수신');
                        onHeartbeat?.();
                        break;
                }
            } catch (err) {
                console.error('❌ SSE 메시지 파싱 오류:', err);
                onError(err as Error);
            }
        });

        // 연결 열림
        eventSource.addEventListener('open', () => {
            console.log('✅ SSE 연결 성공');
        });

        // 에러 처리
        eventSource.addEventListener('error', (event: any) => {
            console.error('❌ SSE 연결 오류:', event);

            // 401 인증 에러는 재연결하지 않음 (서버 수정 필요)
            if (event.xhrStatus === 401) {
                console.log('⏭️ 401 인증 에러 - 서버에서 쿼리 파라미터 지원 필요. 재연결 중단');
                onError(new Error('인증 실패: 서버에서 쿼리 파라미터로 토큰을 받을 수 있도록 수정이 필요합니다.'));
                return;
            }

            // 그 외 에러는 5초 후 재연결 시도
            if (event.type === 'error') {
                setTimeout(() => {
                    console.log('🔄 SSE 재연결 시도...');
                    connectMemberLocationStream(options);
                }, 5000);
            }

            onError(new Error('SSE 연결 오류'));
        });

        // 연결 종료
        eventSource.addEventListener('close', () => {
            console.log('📡 SSE 연결 종료');
        });

    } catch (err) {
        console.error('❌ SSE 연결 실패:', err);
        onError(err as Error);
    }
};

/**
 * 구성원 위치 스트림 연결 종료
 */
export const disconnectMemberLocationStream = (): void => {
    if (eventSource) {
        console.log('📡 SSE 연결 해제');
        eventSource.close();
        eventSource = null;
    }
};

/**
 * 현재 연결 상태 확인
 */
export const isStreamConnected = (): boolean => {
    return eventSource !== null;
};
