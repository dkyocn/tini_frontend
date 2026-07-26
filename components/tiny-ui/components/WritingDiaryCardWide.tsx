/**
 * WritingDiaryCardWide (작성중인 다이어리 카드 — 6썸네일)
 * Figma node: 1097:15436  —  원본 노드명: cil:options B  (file: 티니 UI 제작)
 *
 * 목적: "작성중인 다이어리" 카드. 썸네일 6개(카드 폭을 넘어가는 부분은 overflow hidden으로 클립).
 * 피그마 정확 값 (카드 353 x 170, borderRadius 10, overflow hidden, 흰 배경):
 *  - 타이틀: "작성중인 다이어리" Inter Medium 16, 검정, left 115 / top 18
 *  - 그룹 아이콘: 20 x 18.41, left 22 / top 65
 *  - 썸네일 바: 57 x 84, #D5D5D5, borderRadius 10, top 61, left 18 / 83 / 148 / 213 / 278 / 343
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

// 피그마 에셋 — 7일 후 만료, 로컬 asset으로 교체
const imgGroup = require('../../../assets/images/tini-ui/650099ee-b875-4fb7-93bc-1f6a63813a10.png');

export default function WritingDiaryCardWide() {
  const bars = [18, 83, 148, 213, 278, 343];
  return (
    <View style={styles.card}>
      {bars.map((left) => (
        <View key={left} style={[styles.bar, { left }]} />
      ))}

      <Text style={styles.title}>작성중인 다이어리</Text>
      <Image source={imgGroup} style={styles.groupIcon} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 353,
    height: 170,
    borderRadius: 10,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  bar: {
    position: 'absolute',
    top: 61,
    width: 57,
    height: 84,
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
