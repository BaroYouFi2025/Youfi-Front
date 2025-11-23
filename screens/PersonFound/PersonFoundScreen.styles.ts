import { Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  position: relative;
`;

export const BackButton = styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #16171a;
  font-family: 'Wanted Sans';
  letter-spacing: -0.2px;
  flex: 1;
  text-align: center;
  margin-right: 48px;
`;

export const ContentContainer = styled.View`
  padding: 0 16px;
  padding-bottom: 32px;
`;

export const FoundBadge = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #f0fdf4;
  border: 1px solid #24c879;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
  gap: 8px;
`;

export const FoundBadgeText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #24c879;
  font-family: 'Wanted Sans';
  letter-spacing: -0.18px;
`;

export const Avatar = styled(Image)`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: #e5e7eb;
  border-width: 3px;
  border-color: #24c879;
`;

export const NameText = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #16171a;
  margin-top: 16px;
  font-family: 'Wanted Sans';
  letter-spacing: -0.24px;
`;

export const MapContainer = styled.View`
  width: 100%;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  margin-top: 24px;
  background-color: #e5e7eb;
`;

export const MapImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

export const LocationInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
  padding: 12px 16px;
  background-color: #f9fdfe;
  border-radius: 8px;
  gap: 8px;
`;

export const LocationText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #16171a;
  flex: 1;
  font-family: 'Wanted Sans';
  letter-spacing: -0.14px;
`;

export const InfoCard = styled.View`
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
  margin-top: 24px;
  shadow-color: #000000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 3;
`;

export const Section = styled.View`
  gap: 12px;
`;

export const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #16171a;
  font-family: 'Wanted Sans';
  letter-spacing: -0.16px;
`;

export const InfoRow = styled.View`
  gap: 12px;
`;

export const InfoItem = styled.View`
  gap: 4px;
`;

export const InfoLabel = styled.Text`
  font-size: 12px;
  color: #949494;
  font-family: 'Wanted Sans';
  font-weight: 400;
`;

export const InfoValue = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #16171a;
  font-family: 'Wanted Sans';
  letter-spacing: -0.14px;
`;

export const DescriptionText = styled.Text`
  font-size: 14px;
  color: #16171a;
  line-height: 20px;
  font-family: 'Wanted Sans';
  letter-spacing: -0.14px;
`;

