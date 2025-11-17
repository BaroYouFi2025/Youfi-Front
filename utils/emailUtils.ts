import { Alert, Linking } from 'react-native';

/**
 * 인증 토큰을 포함한 SMS를 관리자 이메일로 발송하기 위해 문자 앱을 엽니다.
 * 통신사의 SMS-to-Email 서비스를 통해 전화번호가 자동으로 From 주소에 포함됩니다.
 * @param token - 인증 토큰
 * @param phoneNumber - 사용자 전화번호 (사용되지 않음, SMS 발신자 번호로 자동 설정됨)
 */
export const openEmailWithToken = async (token: string, phoneNumber: string): Promise<void> => {
  const recipient = 'verifybaro@gmail.com';
  const body = encodeURIComponent(token);

  const smsUrl = `sms:${recipient}&body=${body}`;

  try {
    const canOpen = await Linking.canOpenURL(smsUrl);

    if (canOpen) {
      await Linking.openURL(smsUrl);
    } else {
      // SMS 앱이 없는 경우 수동 복사 안내
      Alert.alert(
        '문자 앱을 찾을 수 없음',
        `다음 토큰을 복사하여 baroyoufi@gmail.com으로 문자를 보내주세요:\n\n${token}`,
        [
          {
            text: '확인',
          },
        ]
      );
    }
  } catch (error) {
    console.error('문자 앱 열기 실패:', error);
    Alert.alert(
      '오류',
      `문자 앱을 열 수 없습니다. 다음 토큰을 복사하여 baroyoufi@gmail.com으로 문자를 보내주세요:\n\n${token}`,
      [
        {
          text: '확인',
        },
      ]
    );
  }
};

/**
 * SMS 연결 지원 여부를 확인합니다.
 */
export const isEmailLinkingSupported = async (): Promise<boolean> => {
  try {
    return await Linking.canOpenURL('sms:');
  } catch {
    return false;
  }
};
