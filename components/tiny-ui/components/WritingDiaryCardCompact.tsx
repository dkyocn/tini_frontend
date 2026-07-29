/**
 * WritingDiaryCardCompact (작성중인 다이어리 카드 — 4썸네일 + 추가)
 * Figma node: 1097:15383  —  원본 노드명: cil:options A  (file: 티니 UI 제작)
 *
 * 목적: "작성중인 다이어리" 카드. 썸네일 4개 + 우측 추가 아이콘.
 * 피그마 정확 값 (카드 353 x 170, borderRadius 10, overflow hidden, 흰 배경):
 *  - 타이틀: "작성중인 다이어리" Inter Medium 16, 검정, left 115 / top 18
 *  - 그룹 아이콘: 20 x 18.41, left 22 / top 65
 *  - 썸네일 바: 57 x 84, #D5D5D5, borderRadius 10, top 60, left 18 / 83 / 148 / 213
 *  - 추가 아이콘 박스: 30 x 30, 흰색, left 298 / top 87
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

// 피그마 에셋 — 7일 후 만료, 로컬 asset으로 교체
import ImgAddIcon from '../../../assets/images/tini-ui/9299565d-4d31-43c9-acd5-10fb2a08c6ca.svg';
import ImgGroup from '../../../assets/images/tini-ui/144be2b7-da8a-436e-be09-3bacc36f9d61.svg';

export default function WritingDiaryCardCompact() {
  const bars = [18, 83, 148, 213];
  return (
    <View style={styles.card}>
      {bars.map((left) => (
        <View key={left} style={[styles.bar, { left }]} />
      ))}

      <View style={styles.addBox}>
        <ImgAddIcon style={styles.addIcon} />
      </View>

      <Text style={styles.title}>작성중인 다이어리</Text>
      <ImgGroup style={styles.groupIcon} />
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
    top: 60,
    width: 57,
    height: 84,
    borderRadius: 10,
    backgroundColor: '#D5D5D5',
  },
  addBox: {
    position: 'absolute',
    left: 298,
    top: 87,
    width: 30,
    height: 30,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addIcon: {
    width: 30,
    height: 30,
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
