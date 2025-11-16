import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 0,
    marginBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    borderBottomWidth: 0,
  },

  logo: {
    top: 50,
    width: 100,
    height: 50,
    resizeMode: "contain",
  },
  title: {
    position: "absolute",
    paddingTop: 50,
    left: 20,
    top: 65,
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    zIndex: 10,
  },
  backButton: {
    fontSize: 32,
    color: "#4FC3F7",
    position: "absolute",
    right: 20,
    top: 15,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 105,
    paddingBottom: 60,
  },

  profileImageSection: {
    alignItems: "center",
    marginBottom: 32,
  },

  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#d1d5db",
  },

  changePhotoButton: {
    marginTop: 12,
    backgroundColor: "transparent",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
  },

  changePhotoButtonText: {
    color: "#4FC3F7",
    fontWeight: "500",
    fontSize: 14,
    textAlign: "center",
    marginLeft: 4,
  },

  inputSection: {
    marginBottom: 32,
    width: "100%",
  },
  label: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111",
    height: 50,
  },

  badgeSection: {
    marginBottom: 32,
    width: "100%",
  },

  badgeImage: {
    width: "auto",
    height: 60,
    marginBottom: 0,
    resizeMode: "contain",
  },

  backgroundSection: {
    marginBottom: 32,
    width: "100%",
  },

  backgroundBox: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f3f4f6",
    alignSelf: "center",
  },

  backgroundLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  changeBackgroundButton: {
    backgroundColor: "transparent",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },

  changeBackgroundButtonText: {
    color: "#4FC3F7",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginLeft: 4,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111",
  },

  titleItem: {
    marginBottom: 16,
    alignItems: "center",
  },

  titleBadgeImage: {
    width: 300,
    height: 70,
    resizeMode: "contain",
  },

  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#4FC3F7",
    borderRadius: 10,
    alignItems: "center",
  },

  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  backgroundItem: {
    width: "30%",
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
});
