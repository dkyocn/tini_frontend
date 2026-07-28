/**
 * TextFormatToolbar (텍스트 서식 툴바)
 * Figma node: 1097:15206  —  원본 프레임명: Frame 1948756060
 *
 * 흰 배경 pill(rounded 30) 위에 서식 관련 요소(Aa / 아이콘 / B / 벡터)가 나열.
 * 요소 간격 47, 좌우 패딩 40 / 상하 10. 내부 행 폭 307 x 높이 29.
 *
 * 주의: 에셋 URL은 발급 후 7일이면 만료됩니다.
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

// 피그마 에셋 — 7일 후 만료, 로컬 asset으로 교체
const imgFrame = require('../../../assets/images/tini-ui/5718636e-fc4e-4efe-a668-5405b73d08e4.png');
const imgVector = require('../../../assets/images/tini-ui/455ebf82-8b88-4fad-800b-f95323f3e038.png');

export default function TextFormatToolbar() {
  return (
    <View style={styles.bar}>
      <View style={styles.row}>
        <Text style={styles.aa}>Aa</Text>
        <Image source={imgFrame} style={styles.frameIcon} resizeMode="contain" />
        <Text style={styles.bold}>B</Text>
        <Image source={imgVector} style={styles.vector} resizeMode="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.white,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 10,
    // drop-shadow(0px 4px 5px rgba(0,0,0,0.25))
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  row: {
    width: 307,
    height: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 47,
  },
  aa: {
    fontFamily: fonts.inter,
    fontWeight: '500',
    fontSize: 24,
    letterSpacing: -2.16,
    color: colors.black,
  },
  frameIcon: {
    width: 24,
    height: 20,
  },
  bold: {
    fontFamily: fonts.inter,
    fontWeight: '900',
    fontSize: 24,
    color: colors.black,
  },
  vector: {
    width: 20,
    height: 15,
  },
});
