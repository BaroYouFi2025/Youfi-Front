import { ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff;
`;

export const MapWrapper = styled.View`
  height: 220px;
  background-color: #eaf6ff;
  overflow: hidden;
`;

export const ContentCard = styled.View`
  flex: 1;
  margin-top: -32px;
  background-color: #ffffff;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  padding: 0 16px 24px;
  shadow-color: #000000;
  shadow-opacity: 0.12;
  shadow-radius: 12px;
  shadow-offset: 0px -2px;
  elevation: 6;
`;

export const ContentScroll = styled(ScrollView).attrs(() => ({
  contentContainerStyle: {
    paddingBottom: 32,
  },
  showsVerticalScrollIndicator: false,
}))`
  flex: 1;
`;

export const HandleBar = styled.View`
  width: 32px;
  height: 4px;
  border-radius: 2px;
  background-color: #d8d8d8;
  align-self: center;
  margin-top: 8px;
  margin-bottom: 16px;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #16171a;
  text-align: center;
  margin-bottom: 20px;
`;

export const SearchRow = styled.View`
  flex-direction: row;
  align-items: center;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #f3f3f3;
  padding: 0 12px;
  margin-bottom: 24px;
`;

export const SearchField = styled(TextInput)`
  flex: 1;
  margin-left: 8px;
  font-size: 13px;
  color: #16171a;
  padding: 0;
`;

export const SearchStatus = styled.View`
  align-items: flex-start;
  margin-bottom: 4px;
`;

export const SearchStatusText = styled.Text`
  font-size: 12px;
  color: #8c8d91;
`;

export const MemberSection = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 0;
  margin-bottom: 20px;
`;

export const MemberRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 0;
`;

export const Avatar = styled.View`
  width: 55px;
  height: 55px;
  border-radius: 32px;
  background-color: #e0e0e0;
  margin-right: 16px;
  shadow-color: #000000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
  elevation: 2;
`;

export const AvatarImage = styled.Image`
  width: 55px;
  height: 55px;
  border-radius: 32px;
  background-color: #e0e0e0;
  margin-right: 16px;
`;

export const MemberName = styled.Text`
  flex: 1;
  font-size: 20px;
  font-weight: 700;
  color: #16171a;
`;

export const RelationButton = styled.TouchableOpacity<{ $active?: boolean }>`
  height: 26px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1.5px solid ${({ $active }: { $active?: boolean }) => ($active ? '#25b2e2' : '#4dc0e7')};
  background-color: ${({ $active }: { $active?: boolean }) => ($active ? '#e6f7fd' : '#f9fdfe')};
  align-items: center;
  justify-content: center;
`;

export const RelationButtonText = styled.Text`
  font-size: 10px;
  font-weight: 500;
  color: #000000;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: #bbbcbe;
`;

export const ListEmptyText = styled.Text`
  font-size: 14px;
  color: #8c8d91;
  text-align: center;
  padding: 12px 0;
`;

export const BottomPanel = styled.View`
  background-color: #ffffff;
  border-radius: 21px;
  padding: 20px 12px 12px;
  shadow-color: #000000;
  shadow-opacity: 0.12;
  shadow-radius: 8px;
  shadow-offset: 0px -2px;
  elevation: 5;
`;

export const PanelTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #16171a;
  text-align: center;
  margin-bottom: 16px;
`;

export const ChipsWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
`;

export const RelationChip = styled.TouchableOpacity<{ $active?: boolean }>`
  padding: 6px 16px;
  height: 32px;
  border-radius: 16px;
  border: 1.5px solid ${({ $active }: { $active?: boolean }) => ($active ? '#25b2e2' : '#4dc0e7')};
  background-color: ${({ $active }: { $active?: boolean }) => ($active ? '#25b2e2' : '#f9fdfe')};
  align-items: center;
  justify-content: center;
`;

export const RelationChipText = styled.Text<{ $active?: boolean }>`
  font-size: 17px;
  font-weight: 500;
  color: ${({ $active }: { $active?: boolean }) => ($active ? '#ffffff' : '#000000')};
`;

export const SubmitButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  height: 48px;
  border-radius: 16px;
  background-color: ${({ disabled }: { disabled?: boolean }) => (disabled ? '#cdeef9' : '#9fddf2')};
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

export const SubmitButtonText = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
`;
