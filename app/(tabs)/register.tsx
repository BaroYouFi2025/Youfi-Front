import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
 
import YouFiLogo from '@/components/YouFiLogo/YouFiLogo';
import { createMissingPersonReport, uploadPhoto } from '@/services/missingPersonAPI';
import { MissingPersonData, MissingPersonFormErrors } from '@/types/MissingPersonTypes';
import { hasFormErrors, validateMissingPersonForm } from '@/utils/validation';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin-top: 32px;
`;

const Title = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 700;
  font-size: 24px;
  line-height: 27px;
  color: #16171a;
  letter-spacing: -0.24px;
  text-align: center;
  flex: 1;
`;

const AIButton = styled.TouchableOpacity`
  background-color: #25b2e2;
  border-radius: 16px;
  padding: 2px 8px;
`;

const AIButtonText = styled.Text`
  font-family: 'Material Symbols Rounded';
  font-weight: 300;
  font-size: 24px;
  color: #ffffff;
  text-align: center;
`;

const FormContainer = styled.View`
  padding: 16px;
  gap: 16px;
`;

const InputGroup = styled.View`
  gap: 8px;
`;

const InputLabel = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 10px;
  line-height: 13px;
  color: #000000;
  letter-spacing: -0.2px;
`;

const InputField = styled.TextInput`
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  height: 32px;
  padding: 0 8px;
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 10px;
  color: #949494;
  letter-spacing: -0.2px;
`;

const DateInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DateInput = styled(InputField)`
  flex: 1;
`;

const CalendarIcon = styled.Text`
  font-family: 'Material Symbols Rounded';
  font-weight: 300;
  font-size: 24px;
  color: #bbbcbe;
  position: absolute;
  right: 8px;
`;

const GenderContainer = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const GenderButton = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  height: 32px;
  width: 120px;
  justify-content: center;
  align-items: center;
  ${(props: { selected: boolean }) => props.selected && `
    background-color: #25b2e2;
    border-color: #25b2e2;
  `}
`;

const GenderButtonText = styled.Text<{ selected: boolean }>`
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 15px;
  line-height: 17px;
  color: ${(props: { selected: boolean }) => props.selected ? '#ffffff' : '#000000'};
  letter-spacing: -0.3px;
`;

const PhotoUploadContainer = styled.TouchableOpacity`
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  height: 125px;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const UploadIcon = styled.Text`
  font-family: 'Material Symbols Rounded';
  font-weight: 200;
  font-size: 32px;
  color: #949494;
`;

const UploadText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: #949494;
  letter-spacing: -0.13px;
`;

const MapContainer = styled.View`
  height: 190px;
  border-radius: 16px;
  background-color: #e5e7eb;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
`;

const MapPlaceholder = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 14px;
  color: #6b7280;
`;

const ErrorText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 10px;
  color: #ef4444;
  margin-top: 4px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #25b2e2;
  border-radius: 8px;
  height: 48px;
  justify-content: center;
  align-items: center;
  margin: 16px;
  margin-bottom: 32px;
`;

const SubmitButtonText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 700;
  font-size: 16px;
  color: #ffffff;
`;

export default function RegisterScreen() {
  const [formData, setFormData] = useState<MissingPersonData>({
    name: '',
    birthDate: '',
    gender: 'male',
    missingDate: '',
    height: '',
    weight: '',
    bodyType: '',
    physicalFeatures: '',
    topClothing: '',
    bottomClothing: '',
    otherFeatures: '',
  });

  const [errors, setErrors] = useState<MissingPersonFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof MissingPersonData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof MissingPersonFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhotoUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진을 업로드하려면 갤러리 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      handleInputChange('photo', result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    // Validate form
    const validationErrors = validateMissingPersonForm(formData);

    if (hasFormErrors(validationErrors)) {
      setErrors(validationErrors);
      Alert.alert('입력 오류', '필수 항목을 확인해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload photo if exists
      let photoUrl = formData.photo;
      if (formData.photo) {
        photoUrl = await uploadPhoto(formData.photo);
      }

      // Submit form data
      const submissionData = { ...formData, photo: photoUrl };
      const response = await createMissingPersonReport(submissionData);

      if (response.success) {
        Alert.alert('등록 완료', '실종자 정보가 성공적으로 등록되었습니다.', [
          { text: '확인', onPress: () => {
            // Reset form
            setFormData({
              name: '',
              birthDate: '',
              gender: 'male',
              missingDate: '',
              height: '',
              weight: '',
              bodyType: '',
              physicalFeatures: '',
              topClothing: '',
              bottomClothing: '',
              otherFeatures: '',
            });
            setErrors({});
          }}
        ]);
      }
    } catch (error) {
      Alert.alert('오류', error instanceof Error ? error.message : '등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Header>
        <YouFiLogo />
      </Header>
      <ScrollView showsVerticalScrollIndicator={false}>
        <FormContainer>
          <InputGroup>
            <InputLabel>이름</InputLabel>
            <InputField
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChangeText={(value: string) => handleInputChange('name', value)}
            />
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <InputLabel>생년월일</InputLabel>
            <DateInputContainer>
              <DateInput
                placeholder="생년월일을 선택하세요"
                value={formData.birthDate}
                onChangeText={(value: string) => handleInputChange('birthDate', value)}
              />
              <CalendarIcon><Entypo name="calendar" size={24} color="#949494" /></CalendarIcon>
            </DateInputContainer>
            {errors.birthDate && <ErrorText>{errors.birthDate}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <InputLabel>실종자 사진 업로드</InputLabel>
            <PhotoUploadContainer onPress={handlePhotoUpload}>
              <Feather name="upload" size={32} color="#949494" />
              <UploadText>사진을 업로드 해주세요</UploadText>
            </PhotoUploadContainer>
          </InputGroup>

          <InputGroup>
            <InputLabel>성별</InputLabel>
            <GenderContainer>
              <GenderButton
                selected={formData.gender === 'male'}
                onPress={() => handleInputChange('gender', 'male')}
              >
                <GenderButtonText selected={formData.gender === 'male'}>남성</GenderButtonText>
              </GenderButton>
              <GenderButton
                selected={formData.gender === 'female'}
                onPress={() => handleInputChange('gender', 'female')}
              >
                <GenderButtonText selected={formData.gender === 'female'}>여성</GenderButtonText>
              </GenderButton>
              <GenderButton
                selected={formData.gender === 'private'}
                onPress={() => handleInputChange('gender', 'private')}
              >
                <GenderButtonText selected={formData.gender === 'private'}>비공개</GenderButtonText>
              </GenderButton>
            </GenderContainer>
          </InputGroup>

          <InputGroup>
            <InputLabel>실종일자</InputLabel>
            <DateInputContainer>
              <DateInput
                placeholder="실종일자를 선택하세요"
                value={formData.missingDate}
                onChangeText={(value: string) => handleInputChange('missingDate', value)}
              />
              <CalendarIcon><Entypo name="calendar" size={24} color="#949494" /></CalendarIcon>
            </DateInputContainer>
            {errors.missingDate && <ErrorText>{errors.missingDate}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <InputLabel>키</InputLabel>
            <InputField
              placeholder="실종자의 키를 입력하세요"
              value={formData.height}
              onChangeText={(value: string) => handleInputChange('height', value)}
              keyboardType="numeric"
            />
            {errors.height && <ErrorText>{errors.height}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <InputLabel>몸무게</InputLabel>
            <InputField
              placeholder="실종자의 몸무게를 입력하세요"
              value={formData.weight}
              onChangeText={(value: string) => handleInputChange('weight', value)}
              keyboardType="numeric"
            />
            {errors.weight && <ErrorText>{errors.weight}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <InputLabel>체형</InputLabel>
            <InputField
              placeholder="실종자의 체형을 선택하세요"
              value={formData.bodyType}
              onChangeText={(value: string) => handleInputChange('bodyType', value)}
            />
          </InputGroup>

          <InputGroup>
            <InputLabel>기타 신체 특징</InputLabel>
            <InputField
              placeholder="기타 신체 특징이 있다면 입력해주세요"
              value={formData.physicalFeatures}
              onChangeText={(value: string) => handleInputChange('physicalFeatures', value)}
            />
          </InputGroup>

          <InputGroup>
            <InputLabel>상의</InputLabel>
            <InputField
              placeholder="실종자의 상의 정보를 입력하세요"
              value={formData.topClothing}
              onChangeText={(value: string) => handleInputChange('topClothing', value)}
            />
          </InputGroup>

          <InputGroup>
            <InputLabel>하의</InputLabel>
            <InputField
              placeholder="실종자의 하의 정보를 입력하세요"
              value={formData.bottomClothing}
              onChangeText={(value: string) => handleInputChange('bottomClothing', value)}
            />
          </InputGroup>

          <InputGroup>
            <InputLabel>기타 인상 착의 특징</InputLabel>
            <InputField
              placeholder="실종자의 기타 인상 착의 특징이 있다면 입력해주세요"
              value={formData.otherFeatures}
              onChangeText={(value: string) => handleInputChange('otherFeatures', value)}
            />
          </InputGroup>

          <InputGroup>
            <InputLabel>위도,경도 설정</InputLabel>
            <MapContainer>
              <MapPlaceholder>지도 위치 선택</MapPlaceholder>
            </MapContainer>
          </InputGroup>
        </FormContainer>

        <SubmitButton onPress={handleSubmit} disabled={isSubmitting}>
          <SubmitButtonText>
            {isSubmitting ? '등록 중...' : '실종자 등록'}
          </SubmitButtonText>
        </SubmitButton>
      </ScrollView>
    </Container>
  );
}
