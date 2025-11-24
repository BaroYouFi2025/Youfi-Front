import { StyleSheet } from 'react-native';

export const colors = {
  bg: '#F6F7FB',
  card: '#FFFFFF',
  text: '#111111',
  sub: '#6B7280',
  primary: '#4FC3F7',
  line: '#E5E7EB',
  accent: '#E6F7FF',
  danger: '#FF6B6B',
};

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.sub,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 14,
  },
  profileTextWrap: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  profileEmail: {
    marginTop: 4,
    fontSize: 13,
    color: colors.sub,
  },
  miniButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  miniButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.sub,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.line,
    marginLeft: 52,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowTextWrap: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  rowDesc: {
    fontSize: 13,
    color: colors.sub,
    marginTop: 2,
  },
  chevron: {
    fontSize: 18,
    color: colors.sub,
  },
  versionRow: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  versionText: {
    fontSize: 14,
    color: colors.sub,
  },
  logoutBtn: {
    marginTop: 28,
    backgroundColor: colors.danger,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },

  withdrawBtn: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.danger,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  withdrawText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '800',
  },
});
