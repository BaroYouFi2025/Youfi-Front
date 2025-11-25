import { StyleSheet } from 'react-native';

export const COLORS = {
  bg: '#FFFFFF',
  text: '#111111',
  sub: '#6B7280',
  line: '#E5E7EB',
  primary: '#13A7E6', // 파란색 버튼
  primary2: '#FF8D7F', // 빨간색 버튼
  pillText: '#FFFFFF',
};

// 여백 조절 포인트 (전체적으로 여백을 줄임)
const TOP_OFFSET = 20; // 상단 여백
const SECTION_TOP = 24; // 섹션 제목 상단 여백
const SECTION_BOTTOM = 12; // 섹션 제목 하단 여백
const ITEM_VERTICAL_PADDING = 8; // 아이템 내부 세로 패딩
const SEPARATOR_GAP = 16; // 구분선 상하 여백
const BOTTOM_INSET = 40; // 하단 여백 (CTA 버튼 아래)

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: COLORS.bg 
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: TOP_OFFSET,
    paddingBottom: BOTTOM_INSET,
  },

  sectionTitle: {
    fontSize: 20, 
    fontWeight: '800',
    marginTop: SECTION_TOP,
    marginBottom: SECTION_BOTTOM,
    color: COLORS.text,
  },

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SECTION_TOP, 
    marginBottom: SECTION_BOTTOM,
  },

  // 기본/경찰청 토글
  switchWrap: { flexDirection: 'row', alignItems: 'center' },
  switchText: { fontSize: 14 }, 
  switchActive: { color: COLORS.text, fontWeight: '700' },
  switchInactive: { color: '#A3A3A3' },

  // 리스트 아이템 기본 스타일
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center', 
    paddingVertical: ITEM_VERTICAL_PADDING,
  },
  avatar: {
    width: 56, // 아바타 크기 줄임
    height: 56, // 아바타 크기 줄임
    borderRadius: 6,
    backgroundColor: '#D1D5DB',
    marginRight: 12, // 마진 줄임
  },
  itemTextWrap: { flex: 1 },
  
  // ❌ 기존 itemTitle 제거, 아래 두 개로 대체
  // itemTitle: { ... }, 
  
  // 🌟🌟 Item Name (이름) 🌟🌟
  nameText: {
    fontSize: 15, 
    fontWeight: '700', // 굵게
    color: COLORS.text,
    lineHeight: 20,
  },
  
  // 🌟🌟 Item Location & Date (위치 및 날짜) 🌟🌟
  locationDateText: {
    marginTop: 2, 
    fontSize: 12, 
    fontWeight: 'normal',
    color: COLORS.sub,
    lineHeight: 18, 
  },

  // 🌟🌟 Item Sub (인상착의) (가장 작고 얇게) 🌟🌟
  itemSub: { 
    marginTop: 4, 
    fontSize: 11, // 가장 작게
    color: COLORS.sub, 
    lineHeight: 16, 
  },

  // 구분선
  separator: { height: 1, backgroundColor: COLORS.line, marginVertical: SEPARATOR_GAP / 2 }, 

  // 버튼 (자세히 보기)
  pillBtnBlue: {
    backgroundColor: COLORS.primary, // 파란색
    paddingVertical: 8, 
    paddingHorizontal: 14, 
    borderRadius: 8,
    alignSelf: 'center', 
  },
  pillBtnRed: {
    backgroundColor: COLORS.primary2, // 빨간색
    paddingVertical: 8, 
    paddingHorizontal: 14, 
    borderRadius: 8,
    alignSelf: 'center', 
  },
  pillBtnText: { 
    color: COLORS.pillText, 
    fontWeight: '700', 
    fontSize: 12, 
  },

  // 가까운 경찰청 찾기 버튼
  findPoliceButton: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#25b2e2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  findPoliceButtonDisabled: {
    opacity: 0.6,
  },
  findPoliceButtonText: {
    color: COLORS.pillText,
    fontSize: 16,
    fontWeight: '700',
  },

  // 하단 CTA 버튼
  ctaBtn: {
    marginTop: 24, 
    backgroundColor: COLORS.primary,
    paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: 'center',
  },
  ctaBtnText: { 
    color: COLORS.pillText, 
    fontSize: 16, 
    fontWeight: '800', 
    letterSpacing: 0.2 
  },
});