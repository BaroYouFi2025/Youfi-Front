// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components/native';

export const LogoContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

export const LogoImage = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: 140px;
  height: 44px;
`;
