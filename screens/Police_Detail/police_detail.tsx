import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { styles } from './police_detail.style';
import ConfirmReportModal from './ConfirmReportModal';
import SuccessReportModal from './SuccessReportModal';
import { getAccessToken } from '@/utils/authStorage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://jjm.jojaemin.com';
const DEFAULT_AVATAR = require('@/assets/images/default_profile.png');

type PoliceDetail = {
  id: string;
  name?: string;
  ageAtTime?: number | string;
  currentAge?: number | string;
  occurrenceDate?: string;
  dress?: string;
  category?: string;
  gender?: string;
  location?: string;
  description?: string;
  photoUrl?: string;
};

const resolvePhotoUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const base = API_BASE_URL.replace(/\/+$/, '');
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
};

const PoliceDetailScreen = () => {
  const params = useLocalSearchParams<{ id?: string; name?: string; photoUrl?: string }>();
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [detail, setDetail] = useState<PoliceDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const personId = params.id;

  const fetchDetail = async () => {
    if (!personId) return;
    try {
      setLoading(true);
      const token = await getAccessToken();
      const res = await axios.get(`${API_BASE_URL}/missing/police/missing-persons/${personId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const data = res.data;
      setDetail({
        id: (data.missingPersonPoliceId ?? data.id ?? '').toString(),
        name: data.name,
        ageAtTime: data.missingAge,
        currentAge: data.ageNow,
        occurrenceDate: data.occurrenceDate,
        dress: data.dress,
        category: data.statusCode,
        gender: data.gender,
        location: data.occurrenceAddress,
        description: data.specialFeatures,
        photoUrl: resolvePhotoUrl(data.photoUrl ?? params.photoUrl),
      });
    } catch (err) {
      console.log('❌ 경찰청 상세 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [personId]);

  const uiData = useMemo(() => {
    const d = detail;
    return {
      name: d?.name || params.name || '이름 미상',
      ageAtTime: d?.ageAtTime ?? '-',
      currentAge: d?.currentAge ?? '-',
      occurrenceDate: d?.occurrenceDate ?? '-',
      dress: d?.dress ?? '-',
      category: d?.category ?? '-',
      gender: d?.gender ?? '-',
      location: d?.location ?? '-',
      description: d?.description ?? '-',
      photo: d?.photoUrl || resolvePhotoUrl(params.photoUrl),
    };
  }, [detail, params.name, params.photoUrl]);

  const handleReport = () => {
    setConfirmModalVisible(true);
  };

  const handleCancel = () => {
    setConfirmModalVisible(false);
  };

  const handleConfirm = () => {
    setConfirmModalVisible(false);
    setSuccessModalVisible(true);
    console.log('확인 클릭: 182로 연결');
  };

  const handleSuccessClose = () => {
    setSuccessModalVisible(false);
    console.log('신고 완료 모달 닫기');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ConfirmReportModal
        visible={isConfirmModalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        name={uiData.name}
        ageAtTime={typeof uiData.ageAtTime === 'number' ? `${uiData.ageAtTime}세` : uiData.ageAtTime}
        avatar={uiData.photo ? { uri: uiData.photo } : DEFAULT_AVATAR}
      />
      <SuccessReportModal
        visible={isSuccessModalVisible}
        onClose={handleSuccessClose}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading && (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator />
          </View>
        )}

        <View style={styles.imageContainer}>
          <Image
            source={uiData.photo ? { uri: uiData.photo } : DEFAULT_AVATAR}
            style={styles.profileImage}
          />
        </View>

        <View style={styles.infoSection}>
          {[
            { label: '이름', value: uiData.name },
            { label: '나이(당시)', value: typeof uiData.ageAtTime === 'number' ? `${uiData.ageAtTime}세` : uiData.ageAtTime },
            { label: '나이(현재)', value: typeof uiData.currentAge === 'number' ? `${uiData.currentAge}세` : uiData.currentAge },
            { label: '발생일시', value: uiData.occurrenceDate },
            { label: '착의사항', value: uiData.dress },
            { label: '대상구분', value: uiData.category },
            { label: '성별구분', value: uiData.gender },
            { label: '발생장소', value: uiData.location },
          ].map((item, index) => (
            <View key={index} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{item.label} : </Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>기타사항 : </Text>
            <Text style={styles.infoValue}>{uiData.description}</Text>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
        <Text style={styles.reportButtonText}>신고하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PoliceDetailScreen;
