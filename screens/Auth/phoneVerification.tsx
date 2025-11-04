import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform } from 'react-native';

import { checkPhoneVerificationStatus, requestPhoneVerificationToken } from '@/services/phoneVerificationAPI';

import {
  ActionGroup,
  Button,
  ButtonText,
  Container,
  Content,
  Description,
  HeaderArea,
  HelperText,
  InputLabel,
  InputSection,
  PhoneInput,
  ScrollContainer,
  SecondaryButton,
  SecondaryButtonText,
  Title,
  TokenContainer,
  TokenLabel,
  TokenValue,
} from './phoneVerification.styles';

const MIN_PHONE_LENGTH = 11;

export default function PhoneVerificationScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    setPhoneNumber(digitsOnly.slice(0, MIN_PHONE_LENGTH));
  };

  const handleRequestToken = async () => {
    if (phoneNumber.length !== MIN_PHONE_LENGTH) {
      Alert.alert('전화번호 확인', '휴대폰 번호 11자리를 모두 입력해주세요. (예: 01012345678)');
      return;
    }

    setIsRequesting(true);

    try {
      const response = await requestPhoneVerificationToken({ phoneNumber });
      setToken(response.token);
      Alert.alert(
        '인증 토큰 발급',
        `발급된 토큰을 복사해 verifybaro@gmail.com 으로 전달해주세요.\n\n토큰: ${response.token}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : '인증 토큰 발급에 실패했습니다.';
      Alert.alert('오류', message);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleCheckStatus = async () => {
    if (phoneNumber.length !== MIN_PHONE_LENGTH) {
      Alert.alert('전화번호 확인', '휴대폰 번호 11자리를 모두 입력해주세요.');
      return;
    }

    setIsChecking(true);

    try {
      const status = await checkPhoneVerificationStatus(phoneNumber);

      if (status.verified) {
        Alert.alert('인증 완료', '전화번호 인증이 확인되었습니다.', [
          {
            text: '확인',
            onPress: () =>
              router.replace({
                pathname: '/signup',
                params: { phoneNumber, verified: 'true' },
              }),
          },
        ]);
        return;
      }

      Alert.alert('인증 대기 중', '아직 인증이 완료되지 않았습니다. 잠시 후 다시 시도해주세요.');
    } catch (error) {
      const message = error instanceof Error ? error.message : '인증 상태 확인에 실패했습니다.';
      Alert.alert('오류', message);
    } finally {
      setIsChecking(false);
    }
  };

  const isPhoneValid = phoneNumber.length === MIN_PHONE_LENGTH;

  return (
    <Container edges={['top', 'left', 'right']} style={Platform.select({ android: { paddingTop: 24 } })}>
      <ScrollContainer keyboardShouldPersistTaps="handled">
        <Content>
          <HeaderArea>
            <Title>전화번호 인증</Title>
            <Description>
              회원가입을 위해 먼저 휴대폰 번호 인증을 완료해주세요. 토큰을 발급받은 후
              {' '}
              verifybaro@gmail.com
              으로 전달하면 관리자가 인증을 진행합니다.
            </Description>
          </HeaderArea>

          <InputSection>
            <InputLabel>휴대폰 번호</InputLabel>
            <PhoneInput
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              placeholder="01012345678"
              maxLength={MIN_PHONE_LENGTH}
              returnKeyType="done"
            />
            <HelperText>※ 숫자만 입력해주세요. 하이픈(-)은 제외됩니다.</HelperText>
          </InputSection>

          {token && (
            <TokenContainer>
              <TokenLabel>발급된 토큰</TokenLabel>
              <TokenValue>{token}</TokenValue>
              <HelperText>
                토큰은 1회용이며 인증 완료 전까지 안전하게 보관해주세요. 토큰을 재발급하면 이전 토큰은
                사용할 수 없습니다.
              </HelperText>
            </TokenContainer>
          )}

          <ActionGroup>
            <Button
              disabled={isRequesting || !isPhoneValid}
              onPress={handleRequestToken}
              activeOpacity={isRequesting || !isPhoneValid ? 1 : 0.7}
            >
              {isRequesting ? <ActivityIndicator color="#ffffff" /> : <ButtonText>인증 토큰 발급</ButtonText>}
            </Button>

            <SecondaryButton
              disabled={isChecking || !isPhoneValid}
              onPress={handleCheckStatus}
              activeOpacity={isChecking || !isPhoneValid ? 1 : 0.7}
            >
              {isChecking ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <SecondaryButtonText>인증 완료 확인</SecondaryButtonText>
              )}
            </SecondaryButton>
          </ActionGroup>

          <HelperText>
            인증 요청 후 일정 시간이 소요될 수 있습니다. 인증이 완료되면 위 버튼을 눌러 다시 확인해주세요.
          </HelperText>
        </Content>
      </ScrollContainer>
    </Container>
  );
}
