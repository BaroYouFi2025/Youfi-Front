import Entypo from '@expo/vector-icons/Entypo';
import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Modal, Platform, TouchableOpacity, View } from 'react-native';

import FormInput from '@/components/FormInput';
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal';
import { signup as signupRequest } from '@/services/authAPI';
import { registerDevice } from '@/services/deviceAPI';
import { setAccessToken, setRefreshToken } from '@/utils/authStorage';

import {
  BottomSpace,
  ButtonContainer,
  Container,
  FormContainer,
  HeaderContainer,
  HeaderTitle,
  HomeIndicator,
  HomeIndicatorBar,
  PickerActionText,
  PickerActions,
  PickerContainer,
  PickerOverlay,
  ScrollContainer,
  SignupButton,
  SignupButtonText,
  StatusBarSpace,
  WarningText,
} from './signup.styles';

// Firebase는 네이티브 빌드에서만 사용 가능 (v22+ 모듈식 API)
let firebaseApp: any = null;
let getMessagingFunc: any = null;
let requestPermissionFunc: any = null;
let getTokenFunc: any = null;

try {
  const app = require('@react-native-firebase/app').default;
  const messagingModule = require('@react-native-firebase/messaging');
  firebaseApp = app;
  getMessagingFunc = messagingModule.getMessaging;
  requestPermissionFunc = messagingModule.requestPermission;
  getTokenFunc = messagingModule.getToken;
} catch (e) {
  // Expo Go에서는 Firebase 사용 불가
}

interface FormState {
  uid: string;
  password: string;
  confirmPassword: string;
  username: string;
  birthDate: string;
}

const BIRTHDATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const normalizeDateValue = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export default function SignupScreen() {
  const params = useLocalSearchParams<{ phoneNumber?: string | string[]; verified?: string | string[] }>();

  const verifiedPhoneNumber = useMemo(() => {
    if (typeof params.phoneNumber === 'string') {
      return params.phoneNumber;
    }

    if (Array.isArray(params.phoneNumber) && params.phoneNumber.length > 0) {
      return params.phoneNumber[0];
    }

    return '';
  }, [params.phoneNumber]);

  const isVerified = useMemo(() => {
    if (typeof params.verified === 'string') {
      return params.verified === 'true';
    }

    if (Array.isArray(params.verified) && params.verified.length > 0) {
      return params.verified[0] === 'true';
    }

    return false;
  }, [params.verified]);

  useEffect(() => {
    if (!isVerified || !verifiedPhoneNumber) {
      router.replace('/phone-verification');
    }
  }, [isVerified, verifiedPhoneNumber]);

  const [formData, setFormData] = useState<FormState>({
    uid: '',
    password: '',
    confirmPassword: '',
    username: '',
    birthDate: '',
  });

  const [isPrivacyPolicyVisible, setIsPrivacyPolicyVisible] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // DatePicker States
  const [activePicker, setActivePicker] = useState<'birth' | null>(null);
  const [pickerValue, setPickerValue] = useState<Date>(new Date());

  const updateFormData = (key: keyof FormState, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrorMessage(null);
  };

  const validateForm = (): boolean => {
    const { uid, password, confirmPassword, username, birthDate } = formData;

    if (!uid.trim() || !password || !confirmPassword || !username.trim() || !birthDate.trim()) {
      setErrorMessage('필수 정보를 모두 입력해주세요.');
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return false;
    }

    if (password.length < 8 || password.length > 20) {
      setErrorMessage('비밀번호는 8자 이상 20자 이하여야 합니다.');
      return false;
    }

    if (!BIRTHDATE_REGEX.test(birthDate.trim())) {
      setErrorMessage('생년월일은 YYYY-MM-DD 형식으로 입력해주세요.');
      return false;
    }

    if (!verifiedPhoneNumber || verifiedPhoneNumber.length !== 11) {
      setErrorMessage('전화번호 인증을 다시 진행해주세요.');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!isVerified || !verifiedPhoneNumber) {
      router.replace('/phone-verification');
      return;
    }

    if (!validateForm()) {
      return;
    }

    const { uid, password, username, birthDate } = formData;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await signupRequest({
        uid: uid.trim(),
        password,
        username: username.trim(),
        birthDate: birthDate.trim(),
        phone: verifiedPhoneNumber,
      });

      if (!response.refreshToken) {
        throw new Error('리프레시 토큰을 받아오지 못했습니다.');
      }

      await Promise.all([setAccessToken(response.accessToken), setRefreshToken(response.refreshToken)]);

      // 회원가입 성공 후 FCM 토큰 발급 및 기기 등록
      // 1. 먼저 FCM 토큰 발급 시도 (알림 권한이 있는 경우)
      let fcmToken: string | undefined = undefined;

      if (firebaseApp && getMessagingFunc) {
        try {
          const messaging = getMessagingFunc(firebaseApp);
          // 알림 권한 확인 및 요청
          const currentAuthStatus = await messaging.requestPermission();
          let authStatus = currentAuthStatus;

          // 권한이 아직 결정되지 않았으면 요청
          if (currentAuthStatus === 0) {
            authStatus = await requestPermissionFunc(messaging);
          } else if (currentAuthStatus === -1) {
            // 이미 거부된 경우: 설정으로 안내 (비동기로 처리하여 회원가입은 계속 진행)
            setTimeout(() => {
              Alert.alert(
                '알림 권한 필요',
                '푸시 알림을 받으려면 알림 권한이 필요합니다. 설정에서 알림 권한을 허용해주세요.',
                [
                  { text: '나중에', style: 'cancel' },
                  {
                    text: '설정 열기',
                    onPress: async () => {
                      if (Platform.OS === 'ios') {
                        await Linking.openURL('app-settings:');
                      } else {
                        await Linking.openSettings();
                      }
                    },
                  },
                ]
              );
            }, 500);
          }

          // 권한이 허용된 경우에만 토큰 발급
          const enabled = authStatus === 1 || authStatus === 2;

          if (enabled) {
            // 권한이 있을 때만 FCM 토큰 발급
            const token = await getTokenFunc(messaging);
            if (token) {
              fcmToken = token;
            } else {
            }
          } else {
          }
        } catch (error) {
          console.error('FCM 토큰 발급 실패:', error);
          // FCM 토큰 발급 실패해도 기기 등록은 계속 진행
        }
      }

      // 2. FCM 토큰 발급 후 기기 등록 (항상 수행)
      try {
        await registerDevice(fcmToken || '', response.accessToken);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ 회원가입 후 기기 등록 실패:', {
          error: errorMessage,
          fullError: error,
        });
        // 기기 등록 실패해도 회원가입은 계속 진행
      }

      router.replace('/(tabs)');
    } catch (error) {
      const message = error instanceof Error ? error.message : '회원가입에 실패했습니다. 다시 시도해주세요.';
      setErrorMessage(message);
      Alert.alert('회원가입 실패', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAndroidBirthPicker = (currentValue: Date) => {
    DateTimePickerAndroid.open({
      value: currentValue,
      mode: 'date',
      is24Hour: true,
      onChange: (event, date) => {
        if (event.type === 'set' && date) {
          updateFormData('birthDate', date.toISOString().split('T')[0]);
        }
      },
    });
  };

  const openPicker = () => {
    const currentValue = normalizeDateValue(formData.birthDate) ?? new Date();

    if (Platform.OS === 'android') {
      openAndroidBirthPicker(currentValue);
      return;
    }

    setPickerValue(currentValue);
    setActivePicker('birth');
  };

  const handlePickerChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'dismissed') {
      setActivePicker(null);
      return;
    }
    if (date && Platform.OS === 'ios') {
      setPickerValue(date);
    }
  };

  const handlePickerConfirm = () => {
    updateFormData('birthDate', pickerValue.toISOString().split('T')[0]);
    setActivePicker(null);
  };

  const handlePickerCancel = () => {
    setActivePicker(null);
  };

  const handleAndroidDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'dismissed') {
      setActivePicker(null);
      return;
    }
    if (event.type === 'set' && date) {
      updateFormData('birthDate', date.toISOString().split('T')[0]);
      setActivePicker(null);
    }
  };

  return (
    <Container>
      <ScrollContainer showsVerticalScrollIndicator={false}>
        <StatusBarSpace />

        <HeaderContainer>
          <HeaderTitle>회원가입</HeaderTitle>
        </HeaderContainer>

        <FormContainer>
          <FormInput
            label="아이디"
            value={formData.uid}
            onChangeText={(text) => updateFormData('uid', text)}
            placeholder=""
            autoCapitalize="none"
          />

          <FormInput
            label="비밀번호"
            value={formData.password}
            onChangeText={(text) => updateFormData('password', text)}
            placeholder=""
            secureTextEntry
            autoCapitalize="none"
          />

          <FormInput
            label="비밀번호 확인"
            value={formData.confirmPassword}
            onChangeText={(text) => updateFormData('confirmPassword', text)}
            placeholder=""
            secureTextEntry
            autoCapitalize="none"
          />

          <FormInput
            label="전화번호"
            value={verifiedPhoneNumber}
            editable={false}
            placeholder=""
          />

          <FormInput
            label="이름"
            value={formData.username}
            onChangeText={(text) => updateFormData('username', text)}
            placeholder=""
          />

          <TouchableOpacity activeOpacity={0.8} onPress={openPicker}>
            <View pointerEvents="none">
              <FormInput
                label="생년월일"
                value={formData.birthDate}
                placeholder="YYYY-MM-DD"
                editable={false}
                rightIcon={<Entypo name="calendar" size={24} color="#949494" />}
              />
            </View>
          </TouchableOpacity>
        </FormContainer>

        <ButtonContainer>
          {errorMessage && <WarningText>{errorMessage}</WarningText>}
          <SignupButton
            onPress={handleSignup}
            disabled={isSubmitting}
            activeOpacity={isSubmitting ? 1 : 0.7}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <SignupButtonText>회원가입</SignupButtonText>
            )}
          </SignupButton>
        </ButtonContainer>

        <BottomSpace />
      </ScrollContainer>

      <HomeIndicator>
        <HomeIndicatorBar />
      </HomeIndicator>

      <PrivacyPolicyModal
        visible={isPrivacyPolicyVisible}
        onAgree={() => setIsPrivacyPolicyVisible(false)}
      />

      {/* iOS Picker Modal */}
      {activePicker === 'birth' && Platform.OS === 'ios' && (
        <Modal transparent animationType="fade" visible>
          <PickerOverlay>
            <PickerContainer>
              <PickerActions>
                <PickerActionText onPress={handlePickerCancel}>취소</PickerActionText>
                <PickerActionText onPress={handlePickerConfirm}>완료</PickerActionText>
              </PickerActions>
              <DateTimePicker
                value={pickerValue}
                mode="date"
                display="spinner"
                onChange={handlePickerChange}
                themeVariant="light"
                textColor="#0f172a"
                style={{ backgroundColor: '#ffffff', height: 220 }}
              />
            </PickerContainer>
          </PickerOverlay>
        </Modal>
      )}

      {/* Android Picker (Fallback if not using DateTimePickerAndroid.open) - usually not needed if openAndroidBirthPicker is used */}
      {activePicker === 'birth' && Platform.OS === 'android' && (
        <DateTimePicker
          value={pickerValue}
          mode="date"
          display="default"
          onChange={handleAndroidDateChange}
        />
      )}
    </Container>
  );
}
