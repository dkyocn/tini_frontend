/**
 * ColorThemeCard (색상 테마 선택 카드)
 * Figma node: 1097:15258  —  원본 프레임: Frame 1948756062
 *
 * "색상 테마" 헤더 + 구분선 + 팔레트 목록.
 * 각 행: 라벨 + 우측 5색 스와치. 첫 행만 체크박스(border), 나머지는 검정 아이콘.
 *
 * 주의:
 *  - 구분선(Line268)은 피그마 SVG 에셋 대신 1px 배경 View로 대체.
 *  - 폰트 'Inter'는 앱에 폰트 로딩/링크 필요.
 *  - 스와치 색상은 대부분 테마에 없는 리터럴 값(리포트 newTokens 참고).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

type Row = { label: string; top: number; selected: boolean; swatches: string[] };

const ROWS: Row[] = [
  {
    label: '기본 컬러 파레트',
    top: 100,
    selected: true, // border 체크박스
    swatches: ['#01031A', colors.white, '#7BFA9F', '#FF3672', '#25EEBA'],
  },
  {
    label: '파스텔 컬러',
    top: 140,
    selected: false,
    swatches: ['#36BFFF', '#25EEE7', '#FFF79A', '#E1FFCC', '#FFD9D9'],
  },
  {
    label: '티니 컬러',
    top: 180,
    selected: false,
    swatches: ['#01031A', colors.white, '#7BFA9F', '#FF3672', '#25EEBA'],
  },
  {
    label: '오올 블루~',
    top: 220,
    selected: false,
    swatches: ['#01031A', colors.white, '#7BFA9F', '#FF3672', '#25EEBA'],
  },
  {
    label: '파랑파랑파라라라랑',
    top: 260,
    selected: false,
    swatches: ['#6BA6FF', '#8E8EFF', '#C7D4F0', '#2E5BFF', '#191B86'],
  },
];

export default function ColorThemeCard() {
  return (
    <View style={styles.container}>
      {/* 카드 배경 */}
      <View style={styles.card} />

      {/* 헤더 + 구분선 */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.iconBoxSolid} />
          <Text style={styles.headerText}>색상 테마</Text>
        </View>
        <View style={styles.divider} />
      </View>

      {/* 팔레트 행들 */}
      {ROWS.map((row, i) => (
        <View key={i} style={[styles.paletteRow, { top: row.top }]}>
          <View style={styles.labelGroup}>
            {row.selected ? <View style={styles.iconBoxBorder} /> : <View style={styles.iconBoxSolid} />}
            <Text style={styles.rowLabel}>{row.label}</Text>
          </View>
          <View style={styles.swatchGroup}>
            {row.swatches.map((c, si) => (
              <View key={si} style={[styles.swatch, { backgroundColor: c }]} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 353,
    height: 320,
  },
  card: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 353,
    height: 320,
    backgroundColor: colors.white,
    borderRadius: 20,
  },
  header: {
    position: 'absolute',
    left: 24,
    top: 40,
    width: 306,
    gap: 20,
    alignItems: 'flex-start',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerText: {
    fontFamily: fonts.inter,
    fontSize: 16,
    color: colors.black,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.black,
  },
  paletteRow: {
    position: 'absolute',
    left: 24,
    width: 306,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rowLabel: {
    fontFamily: fonts.inter,
    fontSize: 16,
    color: colors.black,
  },
  swatchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swatch: {
    width: 20,
    height: 20,
  },
  iconBoxSolid: {
    width: 20,
    height: 20,
    backgroundColor: colors.black,
  },
  iconBoxBorder: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.black,
  },
});
