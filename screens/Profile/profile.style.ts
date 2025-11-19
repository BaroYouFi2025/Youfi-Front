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

  settingIcon: {
    fontSize: 20,
    color: "#007AFF",
  },

  /* -------------------------
      카드 스타일 (수정됨)
  -------------------------- */
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 18,
    alignItems: "center",
    paddingTop: 25,         // 🔥 수정
    paddingBottom: 45,      // 🔥 수정
    marginBottom: "10%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  /* -------------------------
      프로필 이미지 (수정됨)
  -------------------------- */
  avatar: {
    width: 160,             // 🔥 200 → 160 (디자인 최적)
    height: 160,
    borderRadius: 80,
    backgroundColor: "#fff", // 기본 이미지 없을 때 깔끔하게
    marginTop: 10,           // 🔥 추가됨 — 이미지가 카드 안으로 들어오게 함
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

  editBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
});
