import React from 'react';
import {
  LogoContainer,
  LogoImage,
} from './YouFiLogo.styles';

const logoSource = require('@/assets/images/youfi-logo.png');

export default function YouFiLogo() {
  return (
    <LogoContainer>
      <LogoImage source={logoSource} />
    </LogoContainer>
  );
}
