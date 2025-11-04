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
    height: 14,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    marginTop: 20,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4FC3F7",
    borderRadius: 8,
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