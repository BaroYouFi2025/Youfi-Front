import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { detailStyles } from './detail.styles';

const mapImageSource = 'path/to/map_image.png'; // Placeholder for the map
const originalLookImageSource = 'path/to/original_look_image.png'; // Placeholder for the original look
const currentLookImageSource = 'path/to/current_look_image.png'; // Placeholder for the current look
const userAvatarSource = 'path/to/user_avatar.png'; // Placeholder for the avatar

const DetailScreen: React.FC = () => {
  // Hardcoded data based on the image content
  const details = {
    name: '아트쿠(남)',
    ageAtTime: 32, // (당시)
    birthDate: '2005년 8월 21일 오후 7:22',
    height: '175cm',
    weight: '60kg',
    topWear: '흰 티셔츠',
    bottomWear: '청바지',
    bodyType: '보통 체형',
    otherFeature: '왼쪽 귀 뒤에 점이 있음',
    currentAge: 52,
  };

  return (
    <ScrollView style={detailStyles.container}>
      {/* Back Button and Header Space */}
      <View style={detailStyles.header}>
        {/* Placeholder for actual back button icon */}
        <Text style={detailStyles.backButton}>&lt;</Text>
      </View>

      {/* Map Section */}
      <View style={detailStyles.mapContainer}>
        <Image
          source={{ uri: mapImageSource }}
          style={detailStyles.mapImage}
          resizeMode="cover"
        />
        {/* Avatar overlay on the map */}
        <View style={detailStyles.mapAvatarOverlay}>
          <Image
            source={{ uri: userAvatarSource }}
            style={detailStyles.mapAvatar}
          />
        </View>
      </View>

      {/* Basic Info Section */}
      <View style={detailStyles.infoSection}>
        <Image
          source={{ uri: userAvatarSource }}
          style={detailStyles.avatar}
        />
        <View style={detailStyles.nameAgeContainer}>
          <Text style={detailStyles.nameText}>{details.name} • {details.ageAtTime}세(당시)</Text>
          <Text style={detailStyles.dateText}>{details.birthDate}</Text>
        </View>
      </View>
      
      {/* Divider */}
      <View style={detailStyles.divider} />


      {/* Physical Description Section (인상착의) */}
      <View style={detailStyles.section}>
        <Text style={detailStyles.sectionTitle}>인상착의</Text>
        <View style={detailStyles.descriptionContent}>
          <Image
            source={{ uri: originalLookImageSource }}
            style={detailStyles.descriptionImage}
          />
          <View style={detailStyles.descriptionDetails}>
            <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>상의 :</Text> {details.topWear}</Text>
            <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>하의 :</Text> {details.bottomWear}</Text>
            <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>체형 :</Text> {details.bodyType}</Text>
            <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>기타 :</Text> {details.otherFeature}</Text>
            
            <View style={detailStyles.separatorLine} /> 
            
            <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>키 :</Text> {details.height}</Text>
            <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>몸무게 :</Text> {details.weight}</Text>
          </View>
        </View>
      </View>

      {/* Current Look Prediction Section (현재 모습 예측) */}
      <View style={detailStyles.section}>
        <Text style={detailStyles.sectionTitle}>현재 모습 예측</Text>
        <View style={detailStyles.descriptionContent}>
          <Image
            source={{ uri: currentLookImageSource }}
            style={detailStyles.currentLookImage}
          />
          <View style={detailStyles.currentLookDetails}>
            <Text style={detailStyles.currentLookLine}>
                <Text style={detailStyles.detailLabel}>나이 :</Text> {details.currentAge}세
            </Text>
          </View>
        </View>
      </View>
      
      {/* Spacer to prevent content from being hidden behind the fixed button */}
      <View style={{ height: 100 }} /> 

      {/* Fixed Report Button */}
      <View style={detailStyles.reportButtonContainer}>
        <TouchableOpacity style={detailStyles.reportButton} onPress={() => console.log('Report Pressed')}>
          <Text style={detailStyles.reportButtonText}>신고하기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DetailScreen;