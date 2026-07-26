/**
 * SearchBar (검색 바)
 * Figma node: 1097:15008  —  원본 프레임명: Frame 1948755506  (file: 티니 UI 제작)
 *
 * 목적: 그라데이션 배경 위 흰색 알약형 검색 입력 바.
 * 피그마 정확 값:
 *  - 컨테이너: 패딩 좌우 20 / 상하 15 (알약 353 + 좌우 20 = 폭 393)
 *  - 알약: 353 x 30, 흰색, borderRadius 50, 패딩 pl18 pr194 / py7
 *  - 플레이스홀더 텍스트: "검색어를 입력해 주세요." Inter 14, lineHeight 16, 검정, 가운데 정렬
 *
 * 그라데이션(순정 StyleSheet 미지원 — 베이스색으로 대체, 정확 스펙은 주석):
 *   linear-gradient(90deg, rgb(209,231,149) 0%, rgb(209,231,149) 100%)  ← 베이스 = #D1E795 (colors.accent)
 *   위에 linear-gradient(90deg, rgb(37,238,186) 0%, rgb(37,238,186) 100%)  ← #25EEBA
 *   정확 재현 시 expo-linear-gradient 등 필요.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

type Props = {
  placeholder?: string;
};

export default function SearchBar({ placeholder = '검색어를 입력해 주세요.' }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.pill}>
        <Text style={styles.placeholder}>{placeholder}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.accent, // 그라데이션 베이스 #D1E795
  },
  pill: {
    width: 353,
    height: 30,
    borderRadius: 50,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 18,
    paddingRight: 194,
    paddingVertical: 7,
  },
  placeholder: {
    fontFamily: fonts.inter,
    fontSize: 14,
    lineHeight: 16,
    color: colors.black,
    textAlign: 'center',
  },
});
