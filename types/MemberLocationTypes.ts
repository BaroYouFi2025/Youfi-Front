// SSE 이벤트 타입
export type SSEEventType = 'INITIAL' | 'UPDATE' | 'HEARTBEAT';

// 구성원 위치 정보
export interface MemberLocation {
    userId: number;
    name: string;
    relationship: string;
    batteryLevel: number;
    distance: number;
    location: {
        latitude: number;
        longitude: number;
    };
}

// SSE 이벤트 응답 구조
export interface SSELocationEvent {
    type: SSEEventType;
    timestamp: string;
    payload: MemberLocation[] | null;
}

// SSE 연결 옵션
export interface SSEConnectionOptions {
    onUpdate: (members: MemberLocation[]) => void;
    onError: (error: Error) => void;
    onHeartbeat?: () => void;
}
