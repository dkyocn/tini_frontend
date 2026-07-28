/**
 * DiaryShelfScreen (다이어리 책장 화면)
 * Figma node: 1097:15482  —  원본 프레임명: Frame 1948756065  (file: 티니 UI 제작)
 *
 * 목적: "다이어리" 화면. 상단 헤더 + 책갈피 달린 다이어리 카드 4행 x 3열 그리드.
 * 피그마 정확 값:
 *  - 배경: 393 x 684, #F6F6F9(colors.bg), 화면 가로 중앙 정렬
 *  - 그리드: left 20 / top 81 / width 353, 행 간격 20, 열 간격 16
 *  - 카드(책): 100 x 140, 흰색, borderRadius TL10 TR20 BL10 BR20, marginRight -29
 *  - 책갈피 탭: 36 x 30, 흰색, 180도 회전, borderRadius TL8 TR30 BL8 BR30
 *  - 헤더: top 18 / width 354, 뒤로가기 20x20(검정), 타이틀 "다이어리" Inter 24, 우측 아이콘 52x20
 *  - 스크롤바 인디케이터: 8 x 80, #DBDBDB, borderRadius 5, left 379 / top 375
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

// 피그마 에셋 — 7일 후 만료, 로컬 asset으로 교체
const imgHeaderIcon = require('../../../assets/images/tini-ui/e0bcc76e-c902-40f4-8fd7-fd64d5be82b1.png');

function DiaryBook() {
  return (
    <View style={styles.bookItem}>
      <View style={styles.bookCover} />
      <View style={styles.bookmark} />
    </View>
  );
}

export default function DiaryShelfScreen() {
  const rows = [0, 1, 2, 3];
  return (
    <View style={styles.root}>
      <View style={styles.bg} />

      {/* 스크롤바 인디케이터 */}
      <View style={styles.scrollbar} />

      {/* 다이어리 카드 그리드 */}
      <View style={styles.grid}>
        {rows.map((r) => (
          <View key={r} style={styles.row}>
            <DiaryBook />
            <DiaryBook />
            <DiaryBook />
          </View>
        ))}
      </View>

      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.backIcon} />
        <View style={styles.headerRight}>
          <Text style={styles.title}>다이어리</Text>
          <Image source={imgHeaderIcon} style={styles.headerIcon} resizeMode="contain" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 393,
    height: 684,
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 393,
    height: 684,
    backgroundColor: colors.bg,
  },
  scrollbar: {
    position: 'absolute',
    left: 379,
    top: 375,
    width: 8,
    height: 80,
    borderRadius: 5,
    backgroundColor: '#DBDBDB',
  },
  grid: {
    position: 'absolute',
    left: 20,
    top: 81,
    width: 353,
    flexDirection: 'column',
    rowGap: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 16,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookCover: {
    width: 100,
    height: 140,
    marginRight: -29,
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 20,
  },
  bookmark: {
    width: 36,
    height: 30,
    backgroundColor: colors.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 30,
    transform: [{ rotate: '180deg' }],
  },
  header: {
    position: 'absolute',
    top: 18,
    left: 19.5,
    width: 354,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backIcon: {
    width: 20,
    height: 20,
    backgroundColor: colors.black,
  },
  headerRight: {
    width: 213,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.inter,
    fontSize: 24,
    color: colors.black,
  },
  headerIcon: {
    width: 52,
    height: 20,
  },
});
