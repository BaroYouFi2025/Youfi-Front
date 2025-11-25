import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Platform, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { LatLng, MapPressEvent, Marker, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import YouFiLogo from '@/components/YouFiLogo/YouFiLogo';
import { createMissingPersonReport, uploadPhoto } from '@/services/missingPersonAPI';
import { MissingPersonData, MissingPersonFormErrors } from '@/types/MissingPersonTypes';
import { hasFormErrors, validateMissingPersonForm } from '@/utils/validation';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import styled from 'styled-components/native';

const INITIAL_REGION: Region = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const formatDate = (value: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateTime = (value: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

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
  font-size: 12px;
  line-height: 16px;
  color: #111827;
  letter-spacing: -0.2px;
`;

const InputField = styled.TextInput.attrs({
  placeholderTextColor: '#9ca3af',
})`
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  height: 44px;
  padding: 0 12px;
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 12px;
  color: #111827;
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
  height: 40px;
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
  overflow: hidden;
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

const PhotoPreview = styled.Image`
  width: 100%;
  height: 100%;
`;

const MapContainer = styled.View`
  height: 190px;
  border-radius: 16px;
  overflow: hidden;
  background-color: #e5e7eb;
  border: 1px solid #d1d5db;
  margin-top: 16px;
`;

const MapPlaceholder = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`;

const MapPlaceholderText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 14px;
  color: #6b7280;
`;

const LocationSummary = styled.View`
  margin-top: 8px;
`;

const LocationText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 10px;
  color: #4b5563;
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
`;

const SubmitButtonText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 700;
  font-size: 16px;
  color: #ffffff;
`;

const PickerOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.35);
  justify-content: flex-end;
`;

const PickerContainer = styled.View`
  background-color: #ffffff;
  padding: 12px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const PickerActions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const PickerActionText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 600;
  font-size: 14px;
  color: #0f172a;
`;

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ name?: string }>();

  const [formData, setFormData] = useState<MissingPersonData>({
    name: params.name || '',
    birthDate: '',
    gender: 'MALE',
    missingDate: '',
    height: '',
    weight: '',
    body: '',
    bodyEtc: '',
    clothesTop: '',
    clothesBottom: '',
    clothesEtc: '',
  });

  const [errors, setErrors] = useState<MissingPersonFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>(INITIAL_REGION);
  const [activePicker, setActivePicker] = useState<'birth' | 'missing' | null>(null);
  const [pickerValue, setPickerValue] = useState<Date>(new Date());
  const [androidTimePickerVisible, setAndroidTimePickerVisible] = useState(false);
  const birthDateDisplay = formatDate(formData.birthDate);
  const missingDateDisplay = formatDateTime(formData.missingDate);

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
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      handleInputChange('photo', result.assets[0].uri);
    }
  };

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const nextLocation: LatLng = { latitude, longitude };

    setSelectedLocation(nextLocation);
    setMapRegion(prev => ({ ...prev, latitude, longitude }));
    setFormData(prev => ({ ...prev, location: nextLocation }));
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: undefined }));
    }
  };

  const openPicker = (type: 'birth' | 'missing') => {
    const currentValue =
      type === 'birth' && formData.birthDate
        ? new Date(formData.birthDate)
        : type === 'missing' && formData.missingDate
          ? new Date(formData.missingDate)
          : new Date();
    setPickerValue(currentValue);
    setActivePicker(type);
    setAndroidTimePickerVisible(false);
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

  const handleAndroidDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'dismissed') {
      setActivePicker(null);
      setAndroidTimePickerVisible(false);
      return;
    }
    if (event.type === 'set' && date) {
      // 안드로이드 시스템 다이얼로그에서 확인을 눌렀을 때만 처리
      if (activePicker === 'birth') {
        handleInputChange('birthDate', date.toISOString().split('T')[0]);
        setActivePicker(null);
      } else if (activePicker === 'missing') {
        // 실종일자는 날짜 선택 후 시간 선택기 표시
        const currentTime = pickerValue;
        const newDate = new Date(date);
        newDate.setHours(currentTime.getHours(), currentTime.getMinutes(), 0, 0);
        setPickerValue(newDate);
        setAndroidTimePickerVisible(true);
      }
    }
  };

  const handleAndroidTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'dismissed') {
      setActivePicker(null);
      setAndroidTimePickerVisible(false);
      return;
    }
    if (event.type === 'set' && date) {
      // 안드로이드 시스템 다이얼로그에서 확인을 눌렀을 때만 처리
      if (activePicker === 'missing') {
        const currentDate = pickerValue;
        const newDateTime = new Date(currentDate);
        newDateTime.setHours(date.getHours(), date.getMinutes(), 0, 0);
        setPickerValue(newDateTime);
        // 시간 선택 후 바로 저장
        handleInputChange('missingDate', newDateTime.toISOString());
        setActivePicker(null);
        setAndroidTimePickerVisible(false);
      }
    }
  };

  const handlePickerConfirm = () => {
    if (!activePicker) return;
    if (activePicker === 'birth') {
      handleInputChange('birthDate', pickerValue.toISOString().split('T')[0]);
    } else if (activePicker === 'missing') {
      handleInputChange('missingDate', pickerValue.toISOString());
    }
    setActivePicker(null);
  };

  const handlePickerCancel = () => {
    setActivePicker(null);
  };

  useEffect(() => {
    const loadCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return;
        }
        const current = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = current.coords;
        setMapRegion(prev => ({
          ...prev,
          latitude,
          longitude,
        }));
      } catch (error) {
        console.error('Failed to fetch current location', error);
      }
    };

    loadCurrentLocation();
  }, []);

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

      if (response.missingPersonId) {
        Alert.alert('등록 완료', '실종자 정보가 성공적으로 등록되었습니다.', [
          { text: '확인', onPress: () => {
            // Reset form
            setFormData({
              name: '',
              birthDate: '',
              gender: 'MALE',
              missingDate: '',
              height: '',
              weight: '',
              body: '',
              bodyEtc: '',
              clothesTop: '',
              clothesBottom: '',
              clothesEtc: '',
            });
            setErrors({});
            setSelectedLocation(null);
            setMapRegion(INITIAL_REGION);
          }}
        ]);
      } else {
        throw new Error('등록 응답이 올바르지 않습니다.');
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 + insets.bottom }}
      >
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
            <TouchableOpacity activeOpacity={0.8} onPress={() => openPicker('birth')}>
              <DateInputContainer>
                <DateInput
                  placeholder="생년월일을 선택하세요"
                  value={birthDateDisplay}
                  editable={false}
                  caretHidden
                />
                <CalendarIcon><Entypo name="calendar" size={24} color="#949494" /></CalendarIcon>
              </DateInputContainer>
            </TouchableOpacity>
            {errors.birthDate && <ErrorText>{errors.birthDate}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <InputLabel>실종자 사진 업로드</InputLabel>
            <PhotoUploadContainer onPress={handlePhotoUpload}>
              {formData.photo ? (
                <PhotoPreview source={{ uri: formData.photo }} resizeMode="cover" />
              ) : (
                <>
                  <Feather name="upload" size={32} color="#949494" />
                  <UploadText>사진을 업로드 해주세요</UploadText>
                </>
              )}
            </PhotoUploadContainer>
          </InputGroup>

          <InputGroup>
            <InputLabel>성별</InputLabel>
            <GenderContainer>
              <GenderButton
                selected={formData.gender === 'MALE'}
                onPress={() => handleInputChange('gender', 'MALE')}
              >
                <GenderButtonText selected={formData.gender === 'MALE'}>남성</GenderButtonText>
              </GenderButton>
              <GenderButton
                selected={formData.gender === 'FEMALE'}
                onPress={() => handleInputChange('gender', 'FEMALE')}
              >
                <GenderButtonText selected={formData.gender === 'FEMALE'}>여성</GenderButtonText>
              </GenderButton>
            </GenderContainer>
          </InputGroup>

          <InputGroup>
            <InputLabel>실종일자</InputLabel>
            <TouchableOpacity activeOpacity={0.8} onPress={() => openPicker('missing')}>
              <DateInputContainer>
                <DateInput
                  placeholder="실종일자와 시간을 선택하세요"
                  value={missingDateDisplay}
                  editable={false}
                  caretHidden
                />
                <CalendarIcon><Entypo name="calendar" size={24} color="#949494" /></CalendarIcon>
              </DateInputContainer>
            </TouchableOpacity>
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
              value={formData.body}
              onChangeText={(value: string) => handleInputChange('body', value)}
            />
            {errors.body && <ErrorText>{errors.body}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <InputLabel>기타 신체 특징</InputLabel>
            <InputField
              placeholder="기타 신체 특징이 있다면 입력해주세요"
              value={formData.bodyEtc}
              onChangeText={(value: string) => handleInputChange('bodyEtc', value)}
            />
            {errors.bodyEtc && <ErrorText>{errors.bodyEtc}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <InputLabel>상의</InputLabel>
            <InputField
              placeholder="실종자의 상의 정보를 입력하세요"
              value={formData.clothesTop}
              onChangeText={(value: string) => handleInputChange('clothesTop', value)}
            />
            {errors.clothesTop && <ErrorText>{errors.clothesTop}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <InputLabel>하의</InputLabel>
            <InputField
              placeholder="실종자의 하의 정보를 입력하세요"
              value={formData.clothesBottom}
              onChangeText={(value: string) => handleInputChange('clothesBottom', value)}
            />
            {errors.clothesBottom && <ErrorText>{errors.clothesBottom}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <InputLabel>기타 인상 착의 특징</InputLabel>
            <InputField
              placeholder="실종자의 기타 인상 착의 특징이 있다면 입력해주세요"
              value={formData.clothesEtc}
              onChangeText={(value: string) => handleInputChange('clothesEtc', value)}
            />
            {errors.clothesEtc && <ErrorText>{errors.clothesEtc}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <InputLabel>실종 위치</InputLabel>
            <MapContainer>
              <MapView
                style={{ flex: 1, width: '100%' }}
                region={mapRegion}
                initialRegion={INITIAL_REGION}
                onRegionChangeComplete={setMapRegion}
                onPress={handleMapPress}
                showsUserLocation
                showsMyLocationButton
              >
                {selectedLocation && <Marker coordinate={selectedLocation} />}
              </MapView>

              {!selectedLocation && (
                <MapPlaceholder pointerEvents="none">
                  <MapPlaceholderText>지도에서 실종 위치를 탭해주세요</MapPlaceholderText>
                </MapPlaceholder>
              )}
            </MapContainer>
            {selectedLocation && (
              <LocationSummary>
                <LocationText>위도: {selectedLocation.latitude.toFixed(5)}</LocationText>
                <LocationText>경도: {selectedLocation.longitude.toFixed(5)}</LocationText>
              </LocationSummary>
            )}
            {errors.location && <ErrorText>{errors.location}</ErrorText>}
          </InputGroup>
        </FormContainer>

        <SubmitButton
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={{ marginBottom: 48 + insets.bottom }}
        >
          <SubmitButtonText>
            {isSubmitting ? '등록 중...' : '실종자 등록'}
          </SubmitButtonText>
        </SubmitButton>
      </ScrollView>

      {/* iOS는 모달 내에서 스피너 사용 */}
      {activePicker && Platform.OS === 'ios' && (
        <Modal transparent animationType="fade" visible>
          <PickerOverlay>
            <PickerContainer>
              <PickerActions>
                <PickerActionText onPress={handlePickerCancel}>취소</PickerActionText>
                <PickerActionText onPress={handlePickerConfirm}>완료</PickerActionText>
              </PickerActions>
              {activePicker === 'birth' && (
                <DateTimePicker
                  value={pickerValue}
                  mode="date"
                  display="spinner"
                  onChange={handlePickerChange}
                  themeVariant="light"
                  textColor="#0f172a"
                  style={{ backgroundColor: '#ffffff', height: 220 }}
                />
              )}
              {activePicker === 'missing' && (
                <DateTimePicker
                  value={pickerValue}
                  mode="datetime"
                  display="spinner"
                  onChange={handlePickerChange}
                  themeVariant="light"
                  textColor="#0f172a"
                  style={{ backgroundColor: '#ffffff', height: 220 }}
                />
              )}
            </PickerContainer>
          </PickerOverlay>
        </Modal>
      )}
      
      {/* Android는 시스템 다이얼로그 사용 (모달 없이) */}
      {activePicker && Platform.OS === 'android' && activePicker === 'birth' && (
        <DateTimePicker
          value={pickerValue}
          mode="date"
          display="default"
          onChange={handleAndroidDateChange}
        />
      )}
      {activePicker && Platform.OS === 'android' && activePicker === 'missing' && !androidTimePickerVisible && (
        <DateTimePicker
          value={pickerValue}
          mode="date"
          display="default"
          onChange={handleAndroidDateChange}
        />
      )}
      {activePicker && Platform.OS === 'android' && activePicker === 'missing' && androidTimePickerVisible && (
        <DateTimePicker
          value={pickerValue}
          mode="time"
          display="default"
          onChange={handleAndroidTimeChange}
        />
      )}
    </Container>
  );
}
