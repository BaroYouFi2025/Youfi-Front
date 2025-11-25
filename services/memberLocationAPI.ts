import EventSource from 'react-native-sse';
import type {
  SSEConnectionOptions,
  SSELocationEvent
} from '../types/MemberLocationTypes';
import type { MemberLocation } from '../types/MemberLocationTypes';
import apiClient from './apiClient';
import { getAccessToken } from '../utils/authStorage';
import { API_BASE_URL } from './config';

let eventSource: EventSource | null = null;
let initialMessageTimer: number | null = null;

const clearInitialTimer = () => {
  if (initialMessageTimer) {
    clearTimeout(initialMessageTimer);
    initialMessageTimer = null;
  }
};

const sanitizeMemberLocations = (members: MemberLocation[] | null | undefined): MemberLocation[] => {
  if (!Array.isArray(members)) return [];

  const seen = new Set<number>();
  const uniqueMembers: MemberLocation[] = [];

  members.forEach((member) => {
    if (!member || typeof member.userId !== 'number') return;
    if (seen.has(member.userId)) return;
    seen.add(member.userId);
    uniqueMembers.push(member);
  });

  return uniqueMembers;
};

const fetchMemberLocations = async (): Promise<MemberLocation[]> => {
  const response = await apiClient.get<MemberLocation[]>('/members/locations');
  return sanitizeMemberLocations(response.data);
};

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
  clearInitialTimer();

  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    // react-native-sse가 Authorization 헤더를 제대로 전달하지 못하는 문제로
    // 쿼리 파라미터로 토큰 전달 (서버가 지원하는 경우)
    const url = `${API_BASE_URL}/members/locations/stream?token=${encodeURIComponent(token)}`;

    eventSource = new EventSource(url, {
      headers: {
        Accept: 'text/event-stream',
      },
      pollingInterval: 0, // SSE는 폴링 비활성화
    });

    const handleIncoming = (label: string) => (event: any) => {
      const rawData = event?.data as string;

      clearInitialTimer();

      try {
        const data: SSELocationEvent = JSON.parse(rawData);

        switch (data.type) {
          case 'INITIAL':
          case 'UPDATE': {
            const members = sanitizeMemberLocations(data.payload);
            onUpdate(members);
            break;
          }
          case 'HEARTBEAT':
            onHeartbeat?.();
            break;
          default:
            break;
        }
      } catch (err) {
        onError(err as Error);
      }
    };

    // 메시지 수신 이벤트 (커스텀 이벤트명 포함)
    // 서버는 .name("location")으로 이벤트를 보내므로 'location' 이벤트를 리스닝해야 함
    const eventNames: Array<'message' | string> = ['message', 'location', 'INITIAL', 'UPDATE', 'HEARTBEAT'];
    eventNames.forEach((eventName) => {
      // react-native-sse 타입 정의에는 커스텀 이벤트가 없으므로 any 캐스팅
      eventSource?.addEventListener(eventName as any, handleIncoming(eventName));
    });

    // 연결 열림
    eventSource.addEventListener('open', async () => {
      clearInitialTimer();

      // 서버에서 첫 이벤트를 주지 않는 상황 대비로 즉시 1회 조회
      try {
        const members = await fetchMemberLocations();
        onUpdate(members);
      } catch (fetchError) {
        // 초기 조회 실패는 무시 (SSE로 받을 예정)
      }
    });

    // 에러 처리
    eventSource.addEventListener('error', (event: any) => {
      // 401 인증 에러는 재연결하지 않음
      if (event?.xhrStatus === 401) {
        onError(new Error('인증 실패'));
        return;
      }

      // 그 외 에러는 5초 후 재연결 시도
      if (event?.type === 'error') {
        setTimeout(() => {
          connectMemberLocationStream(options);
        }, 5000);
      }

      onError(new Error('SSE 연결 오류'));
      clearInitialTimer();
    });

    // 연결 종료
    eventSource.addEventListener('close', () => {
      clearInitialTimer();
    });
  } catch (err) {
    onError(err as Error);
    clearInitialTimer();
  }
};

/**
 * 구성원 위치 스트림 연결 종료
 */
export const disconnectMemberLocationStream = (): void => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
  clearInitialTimer();
};

/**
 * 현재 연결 상태 확인
 */
export const isStreamConnected = (): boolean => {
  return eventSource !== null;
};
