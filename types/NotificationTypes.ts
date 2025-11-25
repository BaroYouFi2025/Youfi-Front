// 알림 타입 정의
// 백엔드 Notification 도메인과 일치하는 타입 정의

export enum NotificationType {
  INVITE_REQUEST = 'INVITE_REQUEST', // 초대 요청
  FOUND_REPORT = 'FOUND_REPORT', // 발견 신고
  NEARBY_ALERT = 'NEARBY_ALERT', // 근처 알림
}

// 알림 응답 DTO (서버에서 read로 반환되지만 클라이언트에서는 isRead로 사용)
export interface NotificationResponse {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean; // 클라이언트에서 사용하는 필드명
  read?: boolean; // 서버에서 반환하는 필드명 (매핑용)
  createdAt: string; // ISO 8601 형식
  readAt: string | null; // ISO 8601 형식
  relatedEntityId: number | null; // 실종자 ID, 초대 ID, 발견신고 ID 등
}

// 알림을 통한 초대 수락 요청
export interface AcceptInvitationFromNotificationRequest {
  relation: string; // 관계 (예: "아버지", "어머니")
}

// 알림을 통한 초대 수락 응답 (백엔드에서 반환)
export interface AcceptInvitationResponse {
  relationshipIds: number[];
}

