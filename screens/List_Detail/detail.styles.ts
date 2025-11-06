import { StyleSheet } from 'react-native';

const COLORS = {
  bg: '#FFFFFF',
  text: '#111111',
  sub: '#6B7280',
  line: '#E5E7EB',
  primary: '#FF8D7F',     // 신고 버튼(분홍)
};

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingHorizontal: 20, paddingBottom: 24 },

  header: {
    height: 44,
    justifyContent: 'center',
  },
  backArrow: { fontSize: 32, color: COLORS.text, marginLeft: 2 },

  mapBox: {
    width: '100%',
    height: 260,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 14,
  },
  profileAvatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#D1D5DB',
    marginRight: 16,
  },
  profileName: { fontSize: 28, fontWeight: '800', color: COLORS.text },

  card: {
    marginTop: 14,
    borderRadius: 16,
    padding: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EAECF0',
  },

  itemLabel: { fontWeight: '800', fontSize: 18, color: COLORS.text },
  itemLine: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 16,
  },

  warnText: {
    marginTop: 8,
    marginBottom: 16,
    color: '#FF8D7F',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },

  reportBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  reportBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
