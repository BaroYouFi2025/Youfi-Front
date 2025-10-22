import React, { useState } from 'react';
import FormInput from '../../components/FormInput';
import {
  Container,
  ScrollContainer,
  StatusBarSpace,
  HeaderContainer,
  HeaderTitle,
  FormContainer,
  PhoneContainer,
  PhoneInput,
  VerifyButton,
  VerifyButtonText,
  InputLabel,
  InputLine,
  CheckIcon,
  CancelIcon,
  CalendarIcon,
  ButtonContainer,
  SignupButton,
  SignupButtonText,
  BottomSpace,
  HomeIndicator,
  HomeIndicatorBar,
} from './signup.styles';

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    verificationCode: '',
    name: '',
    birthDate: '',
  });

  const handleSignup = () => {
    console.log('Signup pressed:', formData);
  };

  const handlePhoneVerification = () => {
    console.log('Phone verification pressed');
  };

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
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
            value={formData.username}
            onChangeText={(text) => updateFormData('username', text)}
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

          <PhoneContainer>
            <InputLabel>전화번호</InputLabel>
            <PhoneInput
              value={formData.phoneNumber}
              onChangeText={(text) => updateFormData('phoneNumber', text)}
              placeholder=""
              keyboardType="phone-pad"
            />
            <InputLine />
            <VerifyButton onPress={handlePhoneVerification}>
              <VerifyButtonText>확인</VerifyButtonText>
            </VerifyButton>
          </PhoneContainer>

          <FormInput
            label="인증코드"
            value={formData.verificationCode}
            onChangeText={(text) => updateFormData('verificationCode', text)}
            placeholder=""
            rightIcon={
              <>
                <CheckIcon>✓</CheckIcon>
                <CancelIcon>✕</CancelIcon>
              </>
            }
          />

          <FormInput
            label="이름"
            value={formData.name}
            onChangeText={(text) => updateFormData('name', text)}
            placeholder=""
            autoCapitalize="words"
          />

          <FormInput
            label="생년월일"
            value={formData.birthDate}
            onChangeText={(text) => updateFormData('birthDate', text)}
            placeholder=""
            rightIcon={<CalendarIcon>📅</CalendarIcon>}
          />
        </FormContainer>

        <ButtonContainer>
          <SignupButton onPress={handleSignup}>
            <SignupButtonText>회원가입</SignupButtonText>
          </SignupButton>
        </ButtonContainer>

        <BottomSpace />
      </ScrollContainer>

      <HomeIndicator>
        <HomeIndicatorBar />
      </HomeIndicator>
    </Container>
  );
}