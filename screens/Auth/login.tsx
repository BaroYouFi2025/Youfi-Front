import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

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
      const { accessToken, refreshToken } = await loginRequest({
        uid: userId.trim(),
        password,
      });

      if (!refreshToken) {
        throw new Error('리프레시 토큰을 받아오지 못했습니다.');
      }

      await Promise.all([setAccessToken(accessToken), setRefreshToken(refreshToken)]);

      // 로그인 성공 후 권한 요청 및 기기 등록
      try {
        // 1. 위치 권한 확인 및 요청
        let locationPermissionGranted = false;
        try {
          const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
          if (existingStatus !== 'granted') {
            const { status } = await Location.requestForegroundPermissionsAsync();
            locationPermissionGranted = status === 'granted';
            if (!locationPermissionGranted) {
              console.log('⚠️ 위치 권한이 거부되었습니다.');
            }
          } else {
            locationPermissionGranted = true;
          }
        } catch (error) {
          console.error('❌ 위치 권한 요청 실패:', error);
        }

        // 2. 알림 권한 확인 및 요청
        let fcmToken: string = '';
        try {
          // Expo Notifications 권한 요청
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }

          if (finalStatus === 'granted') {
            // Firebase는 네이티브 빌드에서만 사용 가능
            try {
              const messaging = require('@react-native-firebase/messaging').default;
              const authStatus = await messaging().requestPermission();
              const enabled = authStatus === 1 || authStatus === 2;

              if (enabled) {
                const token = await messaging().getToken();
                if (token) {
                  fcmToken = token;
                  console.log('✅ FCM 토큰 발급 성공');
                }
              }
            } catch (firebaseError) {
              // Expo Go에서는 Firebase 사용 불가 (정상 동작)
              console.log('ℹ️ Firebase 사용 불가 (Expo Go 환경)');
            }
          } else {
            console.log('⚠️ 알림 권한이 거부되었습니다.');
          }
        } catch (error) {
          console.error('❌ 알림 권한 요청 실패:', error);
        }

        // 3. 기기 등록
        const { registerDevice } = await import('@/services/deviceAPI');
        await registerDevice(fcmToken, accessToken);
        console.log('✅ 기기 등록 완료');
      } catch (error) {
        console.error('❌ 로그인 후 기기 등록 실패:', error);
        // 기기 등록 실패해도 로그인은 성공 처리
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
