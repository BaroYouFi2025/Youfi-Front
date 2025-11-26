import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { login as loginRequest } from '@/services/authAPI';
import { setAccessToken, setRefreshToken } from '@/utils/authStorage';

export default function LoginScreen() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignupPress = () => {
    router.push('/phone-verification');
  };

  const handleLogin = async () => {
    if (!userId.trim() || !password.trim()) {
      setErrorMessage('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // deviceUuid 가져오기 또는 생성
      const { getDeviceUuid, generateDeviceUuid, setDeviceUuid } = await import('@/utils/authStorage');
      let deviceUuid = await getDeviceUuid();
      if (!deviceUuid) {
        deviceUuid = generateDeviceUuid();
        await setDeviceUuid(deviceUuid);
      }

      const { accessToken, refreshToken } = await loginRequest({
        uid: userId.trim(),
        password,
        deviceUuid,
      });

      if (!refreshToken) {
        throw new Error('리프레시 토큰을 받아오지 못했습니다.');
      }

      await Promise.all([setAccessToken(accessToken), setRefreshToken(refreshToken)]);

      // 로그인 성공 후 FCM 토큰 업데이트
      try {
        const { getStoredFCMToken } = await import('@/utils/authStorage');
        const { updateFcmToken } = await import('@/services/deviceAPI');

        // 저장된 FCM 토큰 확인
        let fcmToken = await getStoredFCMToken();

        // 저장된 토큰이 없으면 새로 발급 시도
        if (!fcmToken) {
          try {
            const app = require('@react-native-firebase/app').default;
            const messagingModule = require('@react-native-firebase/messaging');
            const messaging = messagingModule.getMessaging(app);
            const authStatus = await messaging.requestPermission();
            const enabled = authStatus === 1 || authStatus === 2;

            if (enabled) {
              const token = await messagingModule.getToken(messaging);
              if (token) {
                fcmToken = token;
              }
            }
          } catch (error) {
            // Firebase 사용 불가능한 환경 (Expo Go 등)
          }
        }

        // FCM 토큰 업데이트 (빈 문자열이어도 전송)
        await updateFcmToken(fcmToken || '');
      } catch (error) {
        // FCM 토큰 업데이트 실패해도 로그인은 계속 진행
      }

      // 로그인 성공 후 홈 화면으로 이동
      router.replace('/(tabs)');
    } catch (error) {
      const message = error instanceof Error ? error.message : '로그인에 실패했습니다. 다시 시도해주세요.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentArea}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            <Text style={styles.logoBlack}>You</Text>
            <Text style={styles.logoBlue}>Fi</Text>
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>아이디</Text>
            <TextInput
              style={styles.textInput}
              value={userId}
              onChangeText={setUserId}
              placeholder=""
              returnKeyType="next"
              autoCapitalize="none"
            />
            <View style={styles.inputLine} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>비밀번호</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder=""
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.visibilityIcon}
              >
                <Text style={styles.visibilityText}>👁</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputLine} />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <TouchableOpacity
            style={[styles.loginButton, isSubmitting && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isSubmitting}
            activeOpacity={isSubmitting ? 1 : 0.7}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.loginButtonText}>로그인</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.signupButton} onPress={handleSignupPress} disabled={isSubmitting}>
            <Text style={styles.signupButtonText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.homeIndicator}>
        <View style={styles.homeIndicatorBar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 160,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 120,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  logoBlack: {
    color: '#000000',
  },
  logoBlue: {
    color: '#25b2e2',
  },
  inputContainer: {
    marginBottom: 100,
  },
  inputGroup: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 15,
    color: '#bbbcbe',
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    fontSize: 16,
    paddingVertical: 8,
    color: '#000000',
  },
  passwordContainer: {
    position: 'relative',
  },
  visibilityIcon: {
    position: 'absolute',
    right: 0,
    top: 8,
  },
  visibilityText: {
    fontSize: 18,
    color: '#bbbcbe',
  },
  inputLine: {
    height: 1,
    backgroundColor: '#bbbcbe',
    marginTop: 4,
  },
  buttonContainer: {
    gap: 12,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  loginButton: {
    backgroundColor: '#25b2e2',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: '#f9fdfe',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#25b2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#25b2e2',
    fontSize: 20,
    fontWeight: 'bold',
  },
  homeIndicator: {
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeIndicatorBar: {
    width: 144,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 100,
  },
});
