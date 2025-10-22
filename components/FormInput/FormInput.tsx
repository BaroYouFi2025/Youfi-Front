import React, { ReactNode } from 'react';
import { TextInputProps } from 'react-native';
import {
  InputContainer,
  InputGroup,
  InputLabel,
  InputLine,
  RightIconContainer,
  TextInput,
} from './FormInput.styles';

interface FormInputProps extends TextInputProps {
  label: string;
  rightIcon?: ReactNode;
}

export default function FormInput({ label, rightIcon, ...props }: FormInputProps) {
  return (
    <InputGroup>
      <InputLabel>{label}</InputLabel>
      <InputContainer>
        <TextInput {...props} />
        {rightIcon && (
          <RightIconContainer>
            {rightIcon}
          </RightIconContainer>
        )}
      </InputContainer>
      <InputLine />
    </InputGroup>
  );
}