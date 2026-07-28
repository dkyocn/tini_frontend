/**
 * WritingDiaryCardHighlighted (작성중인 다이어리 카드 — 중앙 강조)
 * Figma node: 1097:15459  —  원본 노드명: cil:options C  (file: 티니 UI 제작)
 *
 * 목적: "작성중인 다이어리" 카드. 회색 배경 위 썸네일들 중 가운데 하나가 크게 강조된 상태.
 * 피그마 정확 값 (카드 353 x 170, borderRadius 10, overflow hidden, 배경 #EFEFEF):
 *  - 타이틀: "작성중인 다이어리" Inter Medium 16, 검정, left 115 / top 18
 *  - 그룹 아이콘: 20 x 18.41, left 22 / top 65
 *  - 일반 바: 57 x 84, #B9B9B9, borderRadius 10, top 59.89, left 18 / 83 / 213 / 278 / 343
 *  - 강조 바: 65 x 95.79, #D5D5D5, borderRadius 10, left 144 / top 54
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

// 피그마 에셋 — 7일 후 만료, 로컬 asset으로 교체
const imgGroup = require('../../../assets/images/tini-ui/8aa59480-7ef6-4605-9fde-dcf3cf36467c.png');

export default function WritingDiaryCardHighlighted() {
  const bars = [18, 83, 213, 278, 343];
  return (
    <View style={styles.card}>
      {bars.map((left) => (
        <View key={left} style={[styles.bar, { left }]} />
      ))}

      {/* 중앙 강조 썸네일 */}
      <View style={styles.barActive} />

      <Image source={imgGroup} style={styles.groupIcon} resizeMode="contain" />
      <Text style={styles.title}>작성중인 다이어리</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 353,
    height: 170,
    borderRadius: 10,
    backgroundColor: '#EFEFEF',
    overflow: 'hidden',
  },
  bar: {
    position: 'absolute',
    top: 59.89,
    width: 57,
    height: 84,
    borderRadius: 10,
    backgroundColor: '#B9B9B9',
  },
  barActive: {
    position: 'absolute',
    left: 144,
    top: 54,
    width: 65,
    height: 95.79,
    borderRadius: 10,
    backgroundColor: '#D5D5D5',
  },
  title: {
    position: 'absolute',
    left: 115,
    top: 18,
    fontFamily: fonts.inter,
    fontWeight: '500',
    fontSize: 16,
    color: colors.black,
  },
  groupIcon: {
    position: 'absolute',
    left: 22,
    top: 65,
    width: 20,
    height: 18.41,
  },
});
