import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { detailStyles } from './detail.styles';
import ConfirmReportModal from './ConfirmReportModal';
import SuccessReportModal from './SuccessReportModal';
import { getAccessToken } from '@/utils/authStorage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://jjm.jojaemin.com';
const DEFAULT_AVATAR = require('@/assets/images/default_profile.png');

type MissingPersonDetail = {
  id: string;
  name?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  missingDate?: string;
  height?: number;
  weight?: number;
  body?: string;
  bodyEtc?: string;
  clothesTop?: string;
  clothesBottom?: string;
  clothesEtc?: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  predictedFaceUrl?: string;
  appearanceImageUrl?: string;
};

const formatAge = (birthDate?: string, at?: string) => {
  if (!birthDate) return undefined;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return undefined;
  const ref = at ? new Date(at) : new Date();
  if (Number.isNaN(ref.getTime())) return undefined;
  let age = ref.getFullYear() - birth.getFullYear();
  const m = ref.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < birth.getDate())) age -= 1;
  return age;
};

const resolvePhotoUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const base = API_BASE_URL.replace(/\/+$/, '');
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
};

const DetailScreen: React.FC = () => {
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    photoUrl?: string;
    location?: string;
    date?: string;
    info?: string;
  }>();

  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [detail, setDetail] = useState<MissingPersonDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const personId = params.id;

  const fetchDetail = async () => {
    if (!personId) return;
    try {
      setLoading(true);
      const token = await getAccessToken();
      const res = await axios.get(`${API_BASE_URL}/missing-persons/${personId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const data = res.data;
      setDetail({
        id: (data.missingPersonId ?? data.id ?? '').toString(),
        name: data.name,
        birthDate: data.birthDate,
        gender: data.gender,
        address: data.address,
        missingDate: data.missingDate ?? data.missing_date,
        height: data.height,
        weight: data.weight,
        body: data.body,
        bodyEtc: data.bodyEtc,
        clothesTop: data.clothesTop,
        clothesBottom: data.clothesBottom,
        clothesEtc: data.clothesEtc,
        latitude: data.latitude,
        longitude: data.longitude,
        photoUrl: resolvePhotoUrl(data.photoUrl ?? params.photoUrl),
        predictedFaceUrl: resolvePhotoUrl(data.predictedFaceUrl),
        appearanceImageUrl: resolvePhotoUrl(data.appearanceImageUrl),
      });
    } catch (err) {
      console.log('❌ 상세 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [personId]);

  const uiData = useMemo(() => {
    const d = detail;
    const name = d?.name || params.name || '이름 미상';
    const location = d?.address || params.location || '위치 정보 없음';
    const missingDate = d?.missingDate || params.date;
    const photo = d?.photoUrl || resolvePhotoUrl(params.photoUrl);
    const appearance = d?.appearanceImageUrl || '';
    const predicted = d?.predictedFaceUrl || '';

    return {
      name,
      location,
      missingDate,
      birthDate: d?.birthDate,
      ageAtMissing: formatAge(d?.birthDate, missingDate),
      currentAge: formatAge(d?.birthDate),
      height: d?.height,
      weight: d?.weight,
      body: d?.body,
      bodyEtc: d?.bodyEtc,
      clothesTop: d?.clothesTop,
      clothesBottom: d?.clothesBottom,
      clothesEtc: d?.clothesEtc,
      photo,
      appearance,
      predicted,
    };
  }, [detail, params.name, params.location, params.date, params.photoUrl]);

  const handleReport = () => {
    setConfirmModalVisible(true);
  };

  const handleCancel = () => {
    setConfirmModalVisible(false);
  };

  const handleConfirm = () => {
    setConfirmModalVisible(false);

    // 첫 번째 모달 완전히 닫힌 뒤 두 번째 모달 열기 (겹침 없음)
    setTimeout(() => setSuccessModalVisible(true), 70);
  };

  const handleSuccessClose = () => setSuccessModalVisible(false);

  return (
    <>
      <ConfirmReportModal
        visible={isConfirmModalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
      <SuccessReportModal
        visible={isSuccessModalVisible}
        onClose={handleSuccessClose}
      />

      <ScrollView style={detailStyles.container}>
        {loading && (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator />
          </View>
        )}

        {/* 지도/대표 이미지 영역 */}
        <View style={detailStyles.mapContainer}>
            {uiData.appearance ? (
              <Image
                source={{ uri: uiData.appearance }}
                style={detailStyles.mapImage}
              />
            ) : null}
          <View style={detailStyles.mapAvatarOverlay}>
            <Image
              source={uiData.photo ? { uri: uiData.photo } : DEFAULT_AVATAR}
              style={detailStyles.mapAvatar}
            />
          </View>
        </View>

        <View style={detailStyles.infoSection}>
          <Image
            source={uiData.photo ? { uri: uiData.photo } : DEFAULT_AVATAR}
            style={detailStyles.avatar}
          />

          <View style={detailStyles.nameAgeContainer}>
            <Text style={detailStyles.nameText}>
              {uiData.name}
              {uiData.ageAtMissing !== undefined ? ` • ${uiData.ageAtMissing}세(당시)` : ''}
            </Text>
            <Text style={detailStyles.dateText}>
              {uiData.missingDate || '실종 일시 정보 없음'}
            </Text>
          </View>
        </View>

        <View style={detailStyles.divider} />

        {/* 인상착의 */}
        <View style={detailStyles.section}>
          <Text style={detailStyles.sectionTitle}>인상착의</Text>
          <View style={detailStyles.descriptionContent}>
            {uiData.appearance ? (
              <Image
                source={{ uri: uiData.appearance }}
                style={detailStyles.descriptionImage}
              />
            ) : null}
            <View style={detailStyles.descriptionDetails}>
              <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>상의 :</Text> {uiData.clothesTop || '정보 없음'}</Text>
              <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>하의 :</Text> {uiData.clothesBottom || '정보 없음'}</Text>
              <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>기타 :</Text> {uiData.clothesEtc || uiData.bodyEtc || '정보 없음'}</Text>
              <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>체형 :</Text> {uiData.body || '정보 없음'}</Text>

              <View style={detailStyles.separatorLine} />

              <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>키 :</Text> {uiData.height ? `${uiData.height}cm` : '정보 없음'}</Text>
              <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>몸무게 :</Text> {uiData.weight ? `${uiData.weight}kg` : '정보 없음'}</Text>
            </View>
          </View>
        </View>

        {/* 현재 모습 예측 */}
        <View style={detailStyles.section}>
          <Text style={detailStyles.sectionTitle}>현재 모습 예측</Text>
          <View style={detailStyles.descriptionContent}>
            {uiData.predicted ? (
              <Image
                source={{ uri: uiData.predicted }}
                style={detailStyles.currentLookImage}
              />
            ) : null}
            <View style={detailStyles.currentLookDetails}>
              <Text style={detailStyles.currentLookLine}>
                <Text style={detailStyles.detailLabel}>나이 :</Text> {uiData.currentAge !== undefined ? `${uiData.currentAge}세` : '정보 없음'}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />

        {/* 신고 버튼 */}
        <View style={detailStyles.reportButtonContainer}>
          <TouchableOpacity style={detailStyles.reportButton} onPress={handleReport}>
            <Text style={detailStyles.reportButtonText}>신고하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default DetailScreen;
