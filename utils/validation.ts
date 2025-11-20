import { MissingPersonData, MissingPersonFormErrors } from '@/types/MissingPersonTypes';

export const validateMissingPersonForm = (data: MissingPersonData): MissingPersonFormErrors => {
  const errors: MissingPersonFormErrors = {};

  // Name validation
  if (!data.name.trim()) {
    errors.name = '이름을 입력해주세요.';
  } else if (data.name.trim().length < 2) {
    errors.name = '이름은 2글자 이상 입력해주세요.';
  }

  // Birth date validation
  if (!data.birthDate.trim()) {
    errors.birthDate = '생년월일을 입력해주세요.';
  } else if (!isValidDate(data.birthDate)) {
    errors.birthDate = '올바른 날짜 형식으로 입력해주세요. (YYYY-MM-DD)';
  }

  // Missing date validation
  if (!data.missingDate.trim()) {
    errors.missingDate = '실종일자를 입력해주세요.';
  } else if (!isValidDate(data.missingDate)) {
    errors.missingDate = '올바른 날짜 형식으로 입력해주세요. (YYYY-MM-DD)';
  } else if (new Date(data.missingDate) > new Date()) {
    errors.missingDate = '실종일자는 오늘 이전이어야 합니다.';
  }

  // Height validation
  if (!data.height.trim()) {
    errors.height = '키를 입력해주세요.';
  } else if (isNaN(Number(data.height)) || Number(data.height) <= 0) {
    errors.height = '올바른 키를 입력해주세요.';
  } else if (Number(data.height) < 50 || Number(data.height) > 250) {
    errors.height = '키는 50cm ~ 250cm 사이로 입력해주세요.';
  }

  // Weight validation
  if (!data.weight.trim()) {
    errors.weight = '몸무게를 입력해주세요.';
  } else if (isNaN(Number(data.weight)) || Number(data.weight) <= 0) {
    errors.weight = '올바른 몸무게를 입력해주세요.';
  } else if (Number(data.weight) < 10 || Number(data.weight) > 300) {
    errors.weight = '몸무게는 10kg ~ 300kg 사이로 입력해주세요.';
  }

  // Location validation
  if (
    !data.location ||
    data.location.latitude === undefined ||
    data.location.longitude === undefined
  ) {
    errors.location = '실종 위치를 지도에서 선택해주세요.';
  }

  return errors;
};

export const isValidDate = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export const hasFormErrors = (errors: MissingPersonFormErrors): boolean => {
  return Object.keys(errors).length > 0;
};
