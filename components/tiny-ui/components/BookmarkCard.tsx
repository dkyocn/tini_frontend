/**
 * BookmarkCard (북마크 카드)
 * Figma node: 1097:15137  —  원본 프레임명: Frame 1948756074
 *
 * 목적: "북마크" 헤더 + 체크박스, "인덱스" / "책갈피" 탭(구분선),
 *       91x134 빈 썸네일 3열 x 2행 그리드, 하단 흰색 "북마크 추가" / "이전 페이지" 버튼 2개.
 * 카드 480 높이, borderRadius 30.
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

// 피그마 에셋 — 7일 후 만료, 로컬 asset으로 교체
import ImgVector3 from '../../../assets/images/tini-ui/c7dedbe2-2ac0-4786-b5d8-40f3a401b156.svg'; // 탭 구분선

const ROWS_TOP = [121, 275];

type BookmarkCardProps = {
  onPressAddBookmark?: () => void;
  onPressPrevPage?: () => void;
};

export default function BookmarkCard({
  onPressAddBookmark,
  onPressPrevPage,
}: BookmarkCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>북마크</Text>
      <View style={styles.checkbox} />

      {/* 좌측 탭: 인덱스 (+ 밑줄) */}
      <View style={styles.tabLeft}>
        <Text style={styles.tabText}>인덱스</Text>
        <ImgVector3 style={styles.tabUnderline} />
      </View>

      {/* 우측 탭: 책갈피 */}
      <View style={styles.tabRight}>
        <Text style={styles.tabText}>책갈피</Text>
      </View>

      {/* 빈 썸네일 그리드 */}
      {ROWS_TOP.map((top, ri) => (
        <View key={ri} style={[styles.row, { top }]}>
          {[0, 1, 2].map((ci) => (
            <View key={ci} style={styles.thumb} />
          ))}
        </View>
      ))}

      {/* 하단 버튼 2개 */}
      <TouchableOpacity style={[styles.button, styles.buttonLeft]} onPress={onPressAddBookmark}>
        <Text style={styles.buttonText}>북마크 추가</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonRight]} onPress={onPressPrevPage}>
        <Text style={styles.buttonText}>이전 페이지</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 353,
    height: 480,
    borderRadius: 30,
    backgroundColor: colors.white,
  },
  title: {
    position: 'absolute',
    top: 25,
    left: 176.5 - 22.5, // left-[calc(50%-22.5px)]
    fontFamily: fonts.inter,
    fontSize: 16,
    color: colors.black,
  },
  checkbox: {
    position: 'absolute',
    left: 20,
    top: 27,
    width: 20,
    height: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.black,
  },
  tabLeft: {
    position: 'absolute',
    left: 21,
    top: 67,
    width: 146,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  tabRight: {
    position: 'absolute',
    left: 176.5 + 10.5, // left-[calc(50%+10.5px)]
    top: 67,
    width: 146,
    flexDirection: 'column',
    alignItems: 'center',
  },
  tabText: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
    textAlign: 'center',
  },
  tabUnderline: {
    width: 146,
    height: 1,
  },
  row: {
    position: 'absolute',
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  thumb: {
    width: 91,
    height: 134,
    borderRadius: 10,
    backgroundColor: colors.bg, // #F6F6F9
  },
  button: {
    position: 'absolute',
    top: 429,
    width: 120,
    height: 30,
    borderRadius: 50,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 7,
    paddingBottom: 6,
    paddingLeft: 24,
    paddingRight: 23,
  },
  buttonLeft: {
    left: 0.375 * 353 - 25.38 - 120 / 2, // left-[calc(37.5%-25.38px)], translate-x -50%
  },
  buttonRight: {
    left: 0.625 * 353 + 26.38 - 120 / 2, // left-[calc(62.5%+26.38px)], translate-x -50%
  },
  buttonText: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
  },
});
