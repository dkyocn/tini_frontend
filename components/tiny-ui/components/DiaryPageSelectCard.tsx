/**
 * DiaryPageSelectCard (다이어리 페이지 선택 카드)
 * Figma node: 1097:15069  —  원본 프레임명: Frame 1948756072
 *
 * 목적: "다이어리 이름" 헤더 + 좌측 체크박스 + 우측 "선택"(그라데이션) 버튼,
 *       91x134 썸네일 3열 x 3행 그리드(각 썸네일 우하단에 번호 뱃지), 우측 스크롤바.
 * 카드 480 높이, borderRadius 30, overflow hidden.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

// 그리드 행 데이터 (원본 번호 그대로)
const ROWS: { top: number; numbers: string[] }[] = [
  { top: 96, numbers: ['1', '2', '3'] },
  { top: 250, numbers: ['4', '5', '6'] },
  { top: 404, numbers: ['4', '5', '6'] },
];

type DiaryPageSelectCardProps = {
  title?: string;
  onPressSelect?: () => void;
};

export default function DiaryPageSelectCard({
  title = '다이어리 이름',
  onPressSelect,
}: DiaryPageSelectCardProps) {
  return (
    <View style={styles.card}>
      {/* 헤더 */}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.checkbox} />
      {/* 그라데이션 원본: linear-gradient(90deg, #D1E795, #D1E795), linear-gradient(90deg, #25EEBA, #25EEBA) */}
      <TouchableOpacity style={styles.selectButton} onPress={onPressSelect}>
        <Text style={styles.selectButtonText}>선택</Text>
      </TouchableOpacity>

      {/* 썸네일 그리드 */}
      {ROWS.map((row, ri) => (
        <View key={ri} style={[styles.row, { top: row.top }]}>
          {row.numbers.map((n, ci) => (
            <View key={ci} style={styles.thumb}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{n}</Text>
              </View>
            </View>
          ))}
        </View>
      ))}

      {/* 스크롤바 */}
      <View style={styles.scrollbar} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 353,
    height: 480,
    borderRadius: 30,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  title: {
    position: 'absolute',
    top: 25,
    left: 176.5 - 46.5, // left-[calc(50%-46.5px)]
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
  selectButton: {
    position: 'absolute',
    top: 19,
    left: 0.875 * 353 - 7.38 - 63 / 2, // left-[calc(87.5%-7.38px)], translate-x -50%
    width: 63,
    height: 30,
    borderRadius: 50,
    backgroundColor: colors.accent, // 그라데이션 베이스색
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 7,
    paddingBottom: 6,
    paddingLeft: 24,
    paddingRight: 23,
  },
  selectButtonText: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
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
  badge: {
    position: 'absolute',
    left: 35,
    top: 109,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 6,
    paddingRight: 7,
  },
  badgeText: {
    fontFamily: fonts.inter,
    fontSize: 14,
    lineHeight: 14,
    color: colors.black,
  },
  scrollbar: {
    position: 'absolute',
    top: 344,
    left: 353 - 14, // left-[calc(100%-14px)]
    width: 8,
    height: 80,
    borderRadius: 5,
    backgroundColor: '#DBDBDB', // newToken
  },
});
