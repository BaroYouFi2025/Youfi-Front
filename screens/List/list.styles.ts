import { StyleSheet } from 'react-native';

export const COLORS = {
  bg: '#FFFFFF',
  text: '#111111',
  sub: '#6B7280',
  line: '#E5E7EB',
  primary: '#13A7E6',
  primary2: '#FF8D7F',
  pillText: '#FFFFFF',
};

// 여백 조절 포인트
const TOP_OFFSET = 56;
const SECTION_TOP = 20;
const SECTION_BOTTOM = 18;
const SEPARATOR_GAP = 20;
const BOTTOM_INSET = 56;

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: TOP_OFFSET,
    paddingBottom: BOTTOM_INSET,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: SECTION_TOP,
    marginBottom: SECTION_BOTTOM,
    color: COLORS.text,
  },

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SECTION_TOP + 8,
    marginBottom: SECTION_BOTTOM - 8,
  },

  // 기본/경찰청 토글
  switchWrap: { flexDirection: 'row', alignItems: 'center' },
  switchText: { fontSize: 16 },
  switchActive: { color: COLORS.text, fontWeight: '700' },
  switchInactive: { color: '#A3A3A3' },

  // 리스트 아이템
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 6,
    backgroundColor: '#D1D5DB',
    marginRight: 14,
  },
  itemTextWrap: { flex: 1 },
  itemTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  itemSub: { marginTop: 6, fontSize: 12, color: COLORS.sub, lineHeight: 18 },

  // 구분선
  separator: { height: 1, backgroundColor: COLORS.line, marginVertical: SEPARATOR_GAP },

  // 버튼
  pillBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  pillBtn2: {
    backgroundColor: COLORS.primary2,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  pillBtnText: { color: COLORS.pillText, fontWeight: '700', fontSize: 12 },

  // 하단 CTA
  ctaBtn: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  pillBtnBlue: {
  backgroundColor: '#00AEEF',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8,
},
pillBtnRed: {
  backgroundColor: '#F47B7B',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8,
},

  ctaBtnText: { color: COLORS.pillText, fontSize: 18, fontWeight: '800', letterSpacing: 0.2 },
});