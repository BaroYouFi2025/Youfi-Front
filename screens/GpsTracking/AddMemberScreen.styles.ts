import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #f2f3f4;
`;

export const BackButton = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.7,
}))`
  padding: 4px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #16171a;
`;

export const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f2f3f4;
  border-radius: 12px;
  padding: 12px 16px;
  margin: 20px 16px;
`;

export const SearchIcon = styled.View`
  margin-right: 8px;
`;

export const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #16171a;
`;

export const SearchResultContainer = styled.View`
  flex: 1;
  padding: 0 16px;
  background-color: #ffffff;
`;

export const EmptyText = styled.Text`
  font-size: 16px;
  color: #848587;
  text-align: center;
  margin-top: 40px;
`;

export const ErrorText = styled.Text`
  font-size: 14px;
  color: #ff6f61;
  text-align: center;
  margin: 0 16px 12px;
`;
