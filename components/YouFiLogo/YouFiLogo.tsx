import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  LogoContainer,
  LogoSquareContainer,
  LogoSquare1,
  LogoSquare2,
  LogoSquare3,
  LogoSquare4,
  YouText,
  FiText,
} from './YouFiLogo.styles';

export default function YouFiLogo() {
  return (
    <LogoContainer>
      <LogoSquareContainer>
        <LogoSquare1>
          <LinearGradient
            colors={['#cef1fc', '#2ccbff']}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 6,
              transform: [{ rotate: '314.314deg' }],
            }}
          />
        </LogoSquare1>
        <LogoSquare2>
          <LinearGradient
            colors={['#cef1fc', '#2ccbff']}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 6,
              transform: [{ rotate: '314.314deg' }],
            }}
          />
        </LogoSquare2>
        <LogoSquare3>
          <LinearGradient
            colors={['#cef1fc', '#2ccbff']}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 6,
              transform: [{ rotate: '314.314deg' }],
            }}
          />
        </LogoSquare3>
        <LogoSquare4>
          <LinearGradient
            colors={['#cef1fc', '#2ccbff']}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 4.8,
              transform: [{ rotate: '314.314deg' }],
            }}
          />
        </LogoSquare4>
      </LogoSquareContainer>
      <YouText>You</YouText>
      <FiText>Fi</FiText>
    </LogoContainer>
  );
}