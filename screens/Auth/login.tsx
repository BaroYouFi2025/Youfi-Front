import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignupPress = () => {
    router.push('/signup');
  };

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.contentArea}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            <Text style={styles.logoBlack}>You</Text>
            <Text style={styles.logoBlue}>Fi</Text>
          </Text>
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>아이디</Text>
            <TextInput
              style={styles.textInput}
              value={userId}
              onChangeText={setUserId}
              placeholder=""
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
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.visibilityIcon}
              >
                <Text style={styles.visibilityText}>👁</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputLine} />
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signupButton} onPress={handleSignupPress}>
            <Text style={styles.signupButtonText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Home Indicator */}
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
  loginButton: {
    backgroundColor: '#25b2e2',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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