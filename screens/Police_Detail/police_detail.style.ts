import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // --- Header Style ---
  header: {
    paddingHorizontal: 15,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingRight: 15,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
  },
  // --- Scroll Content Style ---
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // 버튼 영역만큼 여백 확보
  },
  // --- Image Style ---
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
  // --- Information Style ---
  infoSection: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap', 
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 120,
  },
  infoValue: {
    fontSize: 18,
    color: '#333',
    flexShrink: 1,
  },
  descriptionText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginTop: 5,
  },
  spacer: {
    height: 30,
  },
  // --- Report Button Style ---
  reportButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF6347',
    paddingVertical: 18,
    alignItems: 'center',
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  
  modalView: {
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
    color: '#333',
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
    backgroundColor: '#eee',
  },
  modalTextGroup: {
    flex: 1,
  },
  modalNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalAgeText: {
    fontSize: 16,
    color: '#777',
    marginTop: 2,
  },
  modalDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  modalErrorText: {
    fontSize: 13,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 12,
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
    backgroundColor: '#3498db',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#FF6347',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  
  // --- 2. 신고 완료 모달 스타일 ---
  successModalView: {
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
    color: '#FF6347',
    marginBottom: 10,
  },
  successMessageSubtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
  officePlaceholder: {
    fontSize: 14,
    color: '#777',
    marginBottom: 16,
    textAlign: 'center',
  },
  officeCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fdfdfd',
  },
  officeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1d1d1f',
    marginBottom: 4,
  },
  officeSubtitle: {
    fontSize: 13,
    color: '#FF6347',
    marginBottom: 8,
  },
  officeMeta: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  findPoliceButton: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#1E88E5',
    paddingVertical: 14,
    alignItems: 'center',
  },
  findPoliceButtonDisabled: {
    opacity: 0.6,
  },
  findPoliceButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalErrorHelper: {
    fontSize: 13,
    color: '#d32f2f',
    marginTop: 12,
    textAlign: 'center',
  },
  overlayDismissArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  successErrorText: {
    fontSize: 13,
    color: '#d32f2f',
    marginBottom: 12,
    textAlign: 'center',
  },
});