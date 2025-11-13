// detail.styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  bg: '#FFFFFF',
  text: '#111111',
  sub: '#6B7280',
  line: '#E5E7EB',
  primary: '#FF6347',     // 신고 버튼(주황/빨강색으로 통일)
  accent: '#FF8D7F',     // 강조 색상 (주황)
  blue: '#3498db',        // 취소 버튼
  lightGray: '#F8FAFC',
};

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingHorizontal: 0, paddingBottom: 100 }, // 신고 버튼 고정으로 인해 paddingHorizontal 제거 및 paddingBottom 늘림

  // --- Header & Back Button (기존 유지) ---
  header: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backArrow: { fontSize: 32, color: COLORS.text, marginLeft: 2 },

  // --- Fixed Report Button (신고하기 버튼 하단 고정) ---
  reportBtnFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    paddingVertical: 20,
    alignItems: 'center',
  },
  reportBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  spacer: {
    height: 30, // 스크롤 마지막 부분 여백
  },

  // --- 1. 지도 및 기본 정보 영역 ---
  mapContainer: {
    width: '100%',
    height: width * 0.9, // 지도를 넓게 설정
    position: 'relative',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  mapBox: { // 지도 이미지 스타일
    width: '100%',
    height: '100%',
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
  },
  infoSummaryBox: { // 지도 위 정보 요약 박스
    position: 'absolute',
    top: width * 0.9 - 75, // 지도 이미지 하단에 겹치도록 위치 조정
    left: 40,
    right: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  infoSummaryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: '#ccc',
  },
  infoSummaryTextGroup: {
    flex: 1,
  },
  infoSummaryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  infoSummaryDate: {
    fontSize: 13,
    color: COLORS.sub,
  },
  infoSummaryAge: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.accent, // 주황색
  },

  // --- 2 & 3. 인상착의 및 예측 영역 ---
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 20,
    marginTop: 30, // infoSummaryBox와의 간격 확보
    marginBottom: 10,
  },
  styleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  styleImage: {
    width: width * 0.35,
    height: width * 0.5,
    borderRadius: 10,
    marginRight: 20,
    backgroundColor: '#ccc',
  },
  styleDetailGroup: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  styleDetailRow: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  styleLabel: {
    fontWeight: 'bold',
    color: COLORS.text,
    minWidth: 60,
  },
  
  // --- 4. 기타 정보 카드 (기존 카드 스타일 재활용 및 수정) ---
  card: {
    marginTop: 14,
    borderRadius: 16,
    padding: 18,
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: '#EAECF0',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  itemLabel: { fontWeight: '800', fontSize: 16, color: COLORS.text, minWidth: 100 },
  itemLine: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  // --- Modal Styles (새로 추가) ---
  modalCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // 검은색 반투명 오버레이
  },
  // 1. 신고 확인 모달
  modalConfirmView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.85,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.text,
  },
  modalPersonInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
  },
  modalProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
    backgroundColor: '#ccc',
  },
  modalTextGroup: {
    flex: 1,
  },
  modalNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalAgeText: {
    fontSize: 16,
    color: COLORS.sub,
    marginTop: 2,
  },
  modalDescription: {
    fontSize: 14,
    color: COLORS.sub,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: COLORS.blue,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  
  // 2. 신고 완료 모달
  modalSuccessView: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: width * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successMessageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  successMessageSubtitle: {
    fontSize: 16,
    color: COLORS.sub,
  },
});