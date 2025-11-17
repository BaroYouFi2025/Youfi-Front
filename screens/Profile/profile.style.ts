//profile.style.ts
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

  // 카드
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 45,
    marginBottom: "10%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 200,
    height: 200,
    marginBottom: 18,
    borderRadius: 100,
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

  // 경험치 바
  progressBar: {
    width: "80%",
    height: 16,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    marginTop: 20,
    overflow: "hidden", // ✅ 내부 fill이 넘어가지 않게
    borderWidth: 1,
    borderColor: "#BDBDBD",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4FC3F7", // ✅ 테마 색상
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

  // 칭호 뱃지
  badgeImage: {
    marginTop: 18,
    width: 280,
    height: 60,
    resizeMode: "contain",
  },

  // 편집 버튼
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
