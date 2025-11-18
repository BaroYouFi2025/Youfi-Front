import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background for the main screen
  },
  
  // --- Header/Navigation ---
  header: {
    paddingTop: 40, // Space for status bar
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    zIndex: 10, // Ensure back button is on top of the map
  },
  backButton: {
    fontSize: 24,
    color: '#000', // Assuming a dark back button color
  },

  // --- Map Section ---
  mapContainer: {
    width: '100%',
    aspectRatio: 1 / 0.8, // Adjust aspect ratio to match the image
    marginBottom: 10,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapAvatarOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    // Center the avatar exactly where the marker is shown
    transform: [{ translateX: -15 }, { translateY: -40 }], 
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white', // White border/background for the avatar on map
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  mapAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },

  // --- Basic Info Section ---
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: -40, // Pull the info section up to overlap the bottom of the map
    backgroundColor: 'transparent', // Make the background transparent here
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 1, // Slight border to match the design style
    borderColor: '#ddd', 
  },
  nameAgeContainer: {
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },

  // --- Divider ---
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 20,
    marginBottom: 10,
  },

  // --- General Section Styling (인상착의 & 현재 모습 예측) ---
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  
  // --- Description Content (Image & Details Side-by-Side) ---
  descriptionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 0, // No padding inside the content box itself
  },
  descriptionImage: {
    width: width * 0.45, // About 45% of the screen width
    height: width * 0.45 * (3 / 2), // Adjust height to match the portrait aspect ratio in the image
    marginRight: 15,
    borderRadius: 8,
    borderWidth: 1, 
    borderColor: '#eee',
  },
  descriptionDetails: {
    flex: 1,
    paddingTop: 5, // Align text slightly below the top
  },
  detailLine: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
  },
  detailLabel: {
    fontWeight: 'bold',
    width: 70, // Fixed width for alignment of labels
    textAlign: 'left',
    color: '#333',
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
    width: '90%', // Shorter line within the details column
  },

  // --- Current Look Prediction ---
  currentLookImage: {
    width: width * 0.45, // Same width as description image
    aspectRatio: 1.25 / 1, // Adjust aspect ratio to match the portrait image in the design
    marginRight: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  currentLookDetails: {
    flex: 1,
    justifyContent: 'center', // Vertically center the age text
    paddingTop: 5,
  },
  currentLookLine: {
    fontSize: 15,
    color: '#444',
  },

  // --- Report Button (Fixed at Bottom) ---
  reportButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white', // Background for the sticky button area
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
  },
  reportButton: {
    backgroundColor: '#ff6347', // Tomato red color from the image
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  reportButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Modal overlay (배경 어둡게)
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
},

// 공통 모달 박스
modalBox: {
  width: '80%',
  backgroundColor: '#fff',
  padding: 25,
  borderRadius: 10,
  alignItems: 'center',
},

modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 15,
},

modalDesc: {
  fontSize: 14,
  color: '#555',
  marginBottom: 20,
  textAlign: 'center',
},

modalButtonRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
},

modalButton: {
  flex: 1,
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: 'center',
  marginHorizontal: 5,
},

cancelButton: {
  backgroundColor: '#3498db',
},

confirmButton: {
  backgroundColor: '#ff6347',
},

modalButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

// 신고 완료 모달 박스
successModalBox: {
  width: '80%',
  backgroundColor: '#fff',
  paddingVertical: 35,
  paddingHorizontal: 20,
  borderRadius: 10,
  alignItems: 'center',
},

successTitle: {
  fontSize: 20,
  color: '#ff6347',
  fontWeight: 'bold',
  marginBottom: 10,
},

successSubtitle: {
  fontSize: 16,
  color: '#666',
},

  
});