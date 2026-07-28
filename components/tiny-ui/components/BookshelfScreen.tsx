/**
 * BookshelfScreen (내 책장 화면)
 * Figma node: 1097:14976  —  원본 프레임명: Frame 1948755646  (file: 티니 UI 제작)
 *
 * 목적: "내 책장" 화면. 책 표지 썸네일 4행 x 3열 그리드.
 * 피그마 정확 값:
 *  - 배경: 393 x 684, #F6F6F9(colors.bg), 화면 가로 중앙 정렬
 *  - 그리드: left 19 / top 81 / width 354, 행 간격 20, 열 간격 21
 *  - 책 표지: 104 x 152, borderRadius 10, 이미지 위에 흰색 오버레이(피그마 var --리화 = white)
 *  - 헤더: top 18 / left 19 / width 354, 뒤로가기 20x20(검정), 타이틀 "내 책장" Inter 24, 우측 아이콘 52x20
 *  - 스크롤바 인디케이터: 8 x 80, #DBDBDB, borderRadius 5, left 379 / top 375
 *
 * 참고: 흰색 오버레이는 피그마 원본대로 표지 이미지를 덮습니다(플레이스홀더 성격).
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

// 피그마 에셋 — 7일 후 만료, 로컬 asset으로 교체
const imgBookCover = require('../../../assets/images/tini-ui/0baafee3-d45c-4ca4-8337-729d44cab5b5.png');
const imgHeaderIcon = require('../../../assets/images/tini-ui/6d697e03-5a5c-4ec7-9320-3e51e3ab698a.png');

function BookCover() {
  return (
    <View style={styles.cover}>
      <Image source={imgBookCover} style={styles.coverImg} resizeMode="cover" />
      <View style={styles.coverOverlay} />
    </View>
  );
}

export default function BookshelfScreen() {
  const rows = [0, 1, 2, 3];
  return (
    <View style={styles.root}>
      <View style={styles.bg} />

      {/* 책 표지 그리드 */}
      <View style={styles.grid}>
        {rows.map((r) => (
          <View key={r} style={styles.row}>
            <BookCover />
            <BookCover />
            <BookCover />
          </View>
        ))}
      </View>

      {/* 스크롤바 인디케이터 */}
      <View style={styles.scrollbar} />

      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.backIcon} />
        <View style={styles.headerRight}>
          <Text style={styles.title}>내 책장</Text>
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
  grid: {
    position: 'absolute',
    left: 19,
    top: 81,
    width: 354,
    flexDirection: 'column',
    rowGap: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 21,
  },
  cover: {
    width: 104,
    height: 152,
    borderRadius: 10,
    overflow: 'hidden',
  },
  coverImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 104,
    height: 152,
    borderRadius: 10,
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    backgroundColor: colors.white,
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
  header: {
    position: 'absolute',
    top: 18,
    left: 19,
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
