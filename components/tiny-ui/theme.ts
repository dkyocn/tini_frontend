/**
 * theme.ts — 티니 UI 공용 디자인 토큰
 * 피그마 파일 "티니 UI 제작"에서 추출한 값 기반.
 * 컴포넌트는 여기 토큰을 import해서 사용합니다.
 *
 * 커스텀 폰트("Nanum GgocNaeEum" 등)는 앱에서 폰트 로딩/링크가 필요합니다.
 * (expo-font 또는 react-native.config.js 로 등록)
 */

export const colors = {
  white: '#FFFFFF',
  black: '#000000',
  gray1: '#333333',
  bg: '#F6F6F9',        // 이미지/플레이스홀더 베이스
  accent: '#D1E795',    // 티니 포인트 연두
  olive: '#B0CA67',     // 그라데이션 하단 색

  // 컴포넌트 추출 중 발견된 추가 토큰 (아직 일부 컴포넌트는 리터럴로 인라인되어 있음)
  mint: '#25EEBA',      // 그라데이션 상위 레이어 / 민트 강조
  mint2: '#7BFA9F',     // 그라데이션 끝색
  pink: '#FF3672',      // 통계 라벨 강조(연속 작성일 수 등)
  dateText: '#2C2C2C',  // 달력 날짜 숫자
  line: '#DBDBDB',      // 스크롤바 / 얇은 선
  placeholderBar: '#D5D5D5', // 썸네일 바 기본
  placeholderBar2: '#B9B9B9',
  handle: '#E3E3E3',    // 바텀시트 드래그 핸들
  badgeFill: '#CDCDCD', // 업적 뱃지 기본
  progressBar: '#E6EFDD',
  tagGray: '#D9D9D9',   // (선택) 태그 / 보기 링크
  placeholderText: '#757575', // 입력 플레이스홀더
  inactiveTab: '#7F7F7F',
  cardGray: '#EFEFEF',  // 강조 카드 배경
} as const;

export const fonts = {
  body: 'Nanum GgocNaeEum', // 본문 손글씨체
  inter: 'Inter',
} as const;

export const fontSize = {
  body18: 18,
} as const;

export const radius = {
  card: 30,
} as const;

export const spacing = {
  screenPad: 20,
} as const;

export type Colors = typeof colors;
export type Fonts = typeof fonts;
