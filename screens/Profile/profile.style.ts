import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 40,
  },

  header: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    width: 110,
    height: 35,
    resizeMode: "contain",
  },

  settingBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#E6F7FF",
  },

  // 🌟 settingIcon 스타일: <Ionicons> 컴포넌트에 적용
  settingIcon: {
    fontSize: 24,
    color: "#007AFF",
  },

  /* -------------------------
      카드 스타일
  -------------------------- */
  card: {
    width: "90%",
    borderRadius: 18,
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 45,
    marginBottom: "10%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  /* -------------------------
      프로필 이미지
  -------------------------- */
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#fff",
    marginTop: 0,
    marginBottom: 18,
    resizeMode: "cover",
  },

  name: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
  },

  level: {
    fontSize: 20,
    fontWeight: "500",
    color: "#333",
    marginTop: 8,
  },

  levelNum: {
    fontSize: 22,
    fontWeight: "700",
    color: "#007AFF",
  },

  /* -------------------------
      경험치 바
  -------------------------- */
  progressBar: {
    width: "80%",
    height: 16,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    marginTop: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#BDBDBD",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#4FC3F7",
    borderRadius: 10,
    position: "absolute",
    left: 0,
    top: 0,
  },

  expText: {
    marginTop: 8,
    fontSize: 15,
    color: "#333",
  },

  /* -------------------------
      칭호 뱃지
  -------------------------- */
  badgeImage: {
    marginTop: 18,
    width: 280,
    height: 60,
    resizeMode: "contain",
  },

  /* -------------------------
      프로필 편집 버튼
  -------------------------- */
  editBtn: {
    width: "80%",
    backgroundColor: "#4FC3F7",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  // 🌟 추가: 아이콘과 텍스트를 담을 컨테이너
  editBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 🌟 추가: 연필 아이콘 전용 스타일
  editIcon: {
    fontSize: 18,
    color: "#fff",
  },

  editBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    marginLeft: 8,
  },
});