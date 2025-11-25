import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import MapView, { LatLng, MapPressEvent, Marker, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { getMissingPersonById, updateMissingPerson, uploadPhoto } from '@/services/missingPersonAPI';
import { MissingPersonData, MissingPersonFormErrors } from '@/types/MissingPersonTypes';
import { hasFormErrors, validateMissingPersonForm } from '@/utils/validation';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  BackButton,
  BackButtonText,
  CalendarIcon,
  Container,
  DateInput,
  DateInputContainer,
  ErrorText,
  FormContainer,
  GenderButton,
  GenderButtonText,
  GenderContainer,
  Header,
  InputField,
  InputGroup,
  InputLabel,
  LoadingWrap,
  LocationSummary,
  LocationText,
  MapContainer,
  MapPlaceholder,
  MapPlaceholderText,
  PhotoPreview,
  PhotoUploadContainer,
  PickerActionText,
  PickerActions,
  PickerContainer,
  PickerOverlay,
  SubmitButton,
  SubmitButtonText,
  Title,
  UploadText,
} from './MissingPersonEdit.styles';

const INITIAL_REGION: Region = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const normalizeDateValue = (value?: string) => {
  if (!value) return null;
  const normalized = value.includes(' ') && !value.includes('T')
    ? value.replace(' ', 'T')
    : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value: string) => {
  const date = normalizeDateValue(value);
  if (!date) return '';
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateTime = (value: string) => {
  const date = normalizeDateValue(value);
  if (!date) return '';
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export default function MissingPersonEditScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const missingPersonId = Array.isArray(id) ? id[0] : id;

  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<MissingPersonData>({
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

  const [errors, setErrors] = useState<MissingPersonFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>(INITIAL_REGION);
  const [activePicker, setActivePicker] = useState<'birth' | 'missing' | null>(null);
  const [pickerValue, setPickerValue] = useState<Date>(new Date());
  const birthDateDisplay = formatDate(formData.birthDate);
  const missingDateDisplay = formatDateTime(formData.missingDate);

  useEffect(() => {
    const loadDetail = async () => {
      if (!missingPersonId) {
        Alert.alert('오류', '실종자 ID가 없습니다.');
        router.back();
        return;
      }

      setIsLoading(true);
      try {
        const detail = await getMissingPersonById(missingPersonId);

        setFormData({
          name: detail.name || '',
          birthDate: detail.birthDate || '',
          gender: detail.gender || 'MALE',
          missingDate: detail.missingDate || '',
          height: detail.height?.toString() || '',
          weight: detail.weight?.toString() || '',
          body: detail.body || '',
          bodyEtc: detail.bodyEtc || '',
          clothesTop: detail.clothesTop || '',
          clothesBottom: detail.clothesBottom || '',
          clothesEtc: detail.clothesEtc || '',
          photo: detail.photoUrl,
          location: detail.latitude && detail.longitude
            ? { latitude: detail.latitude, longitude: detail.longitude }
            : undefined,
        });

        if (detail.latitude && detail.longitude) {
          const location = { latitude: detail.latitude, longitude: detail.longitude };
          setSelectedLocation(location);
          setMapRegion(prev => ({ ...prev, ...location }));
        }
      } catch (error) {
        Alert.alert('오류', error instanceof Error ? error.message : '데이터를 불러오지 못했습니다.');
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadDetail();
  }, [missingPersonId]);

  const handleInputChange = (field: keyof MissingPersonData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof MissingPersonFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const setBirthDateValue = (date: Date) => {
    handleInputChange('birthDate', date.toISOString().split('T')[0]);
  };

  const setMissingDateValue = (date: Date) => {
    handleInputChange('missingDate', date.toISOString());
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

  const getPickerInitialValue = (type: 'birth' | 'missing') => {
    const value = type === 'birth' ? formData.birthDate : formData.missingDate;
    return normalizeDateValue(value) ?? new Date();
  };

  const openAndroidBirthPicker = (currentValue: Date) => {
    DateTimePickerAndroid.open({
      value: currentValue,
      mode: 'date',
      is24Hour: true,
      onChange: (event, date) => {
        if (event.type === 'set' && date) {
          setBirthDateValue(date);
        }
      },
    });
  };

  const openAndroidMissingPicker = (currentValue: Date) => {
    DateTimePickerAndroid.open({
      value: currentValue,
      mode: 'date',
      is24Hour: true,
      onChange: (event, date) => {
        if (event.type !== 'set' || !date) return;
        const pickedDate = new Date(date);

        DateTimePickerAndroid.open({
          value: pickedDate,
          mode: 'time',
          is24Hour: true,
          onChange: (timeEvent, timeDate) => {
            if (timeEvent.type !== 'set' || !timeDate) return;
            const combined = new Date(pickedDate);
            combined.setHours(timeDate.getHours(), timeDate.getMinutes(), 0, 0);
            setMissingDateValue(combined);
          },
        });
      },
    });
  };

  const openPicker = (type: 'birth' | 'missing') => {
    const currentValue = getPickerInitialValue(type);

    if (Platform.OS === 'android') {
      if (type === 'birth') {
        openAndroidBirthPicker(currentValue);
      } else {
        openAndroidMissingPicker(currentValue);
      }
      return;
    }

    setPickerValue(currentValue);
    setActivePicker(type);
  };

  const handlePickerChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'dismissed') {
      setActivePicker(null);
      return;
    }
    if (date) {
      setPickerValue(date);
    }
  };

  const handleAndroidDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'dismissed' || !date) return;
    setPickerValue(prev => {
      const next = new Date(prev);
      next.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      return next;
    });
  };

  const handleAndroidTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'dismissed' || !date) return;
    setPickerValue(prev => {
      const next = new Date(prev);
      next.setHours(date.getHours(), date.getMinutes(), 0, 0);
      return next;
    });
  };

  const handlePickerConfirm = () => {
    if (!activePicker) return;
    if (activePicker === 'birth') {
      setBirthDateValue(pickerValue);
    } else if (activePicker === 'missing') {
      setMissingDateValue(pickerValue);
    }
    setActivePicker(null);
  };

  const handlePickerCancel = () => {
    setActivePicker(null);
  };

  const handleSubmit = async () => {
    if (!missingPersonId) return;

    const validationErrors = validateMissingPersonForm(formData);

    if (hasFormErrors(validationErrors)) {
      setErrors(validationErrors);
      Alert.alert('입력 오류', '필수 항목을 확인해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      let photoUrl = formData.photo;
      // Only upload if it's a local file URI (not already a URL)
      if (formData.photo && !formData.photo.startsWith('http')) {
        photoUrl = await uploadPhoto(formData.photo);
      }

      const submissionData = { ...formData, photo: photoUrl };
      await updateMissingPerson(missingPersonId, submissionData);

      Alert.alert('수정 완료', '실종자 정보가 성공적으로 수정되었습니다.', [
        { text: '확인', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('오류', error instanceof Error ? error.message : '수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingWrap>
          <ActivityIndicator size="large" color="#25b2e2" />
        </LoadingWrap>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={() => router.back()}>
          <BackButtonText>{'<'}</BackButtonText>
        </BackButton>
        <Title>정보 수정</Title>
        <View style={{ width: 40 }} />
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
            <InputLabel>실종자 사진</InputLabel>
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
              placeholder="실종자의 체형을 입력하세요"
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
              placeholder="기타 인상 착의 특징이 있다면 입력해주세요"
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
            {isSubmitting ? '수정 중...' : '정보 수정'}
          </SubmitButtonText>
        </SubmitButton>
      </ScrollView>

      {activePicker && (
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
                  textColor={Platform.OS === 'ios' ? '#0f172a' : undefined}
                  style={{ backgroundColor: '#ffffff', height: 220 }}
                />
              )}
              {activePicker === 'missing' && Platform.OS === 'ios' && (
                <DateTimePicker
                  value={pickerValue}
                  mode="datetime"
                  display="spinner"
                  onChange={handlePickerChange}
                  themeVariant="light"
                  textColor={Platform.OS === 'ios' ? '#0f172a' : undefined}
                  style={{ backgroundColor: '#ffffff', height: 220 }}
                />
              )}
              {activePicker === 'missing' && Platform.OS === 'android' && (
                <>
                  <DateTimePicker
                    value={pickerValue}
                    mode="date"
                    display="spinner"
                    onChange={handleAndroidDateChange}
                  />
                  <DateTimePicker
                    value={pickerValue}
                    mode="time"
                    display="spinner"
                    onChange={handleAndroidTimeChange}
                  />
                </>
              )}
            </PickerContainer>
          </PickerOverlay>
        </Modal>
      )}
    </Container>
  );
}
