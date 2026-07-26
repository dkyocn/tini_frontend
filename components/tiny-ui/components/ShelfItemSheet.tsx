/**
 * ShelfItemSheet (선반 아이템 바텀시트)
 * Figma node: 1097:15358  —  원본 프레임: Frame 1948756063
 *
 * 하단 바텀시트: 상단 드래그 핸들 + "선반" 탭 pill(그라데이션) +
 * "생활 가계부" 썸네일 아이템 4개 가로 나열.
 *
 * 주의:
 *  - "선반" pill은 그라데이션(순정 StyleSheet 미지원)이라 베이스색으로 대체.
 *    정확 스펙: linear-gradient(90deg, #D1E795 0%, #D1E795 100%) over #25EEBA (주석 참고)
 *  - 폰트 'Inter'는 앱에 폰트 로딩/링크 필요.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

const ITEMS = ['생활 가계부', '생활 가계부', '생활 가계부', '생활 가계부'];

export default function ShelfItemSheet() {
  return (
    <View style={styles.container}>
      {/* 바텀시트 배경 */}
      <View style={styles.sheet} />

      {/* 드래그 핸들 */}
      <View style={styles.handle} />

      {/* "선반" 탭 pill (그라데이션 → 베이스색 대체) */}
      {/* linear-gradient(90deg, #D1E795 0%, #D1E795 100%) over #25EEBA */}
      <View style={styles.pill}>
        <Text style={styles.pillText}>선반</Text>
      </View>

      {/* 아이템 4개 */}
      <View style={styles.itemsRow}>
        {ITEMS.map((label, i) => (
          <View key={i} style={styles.item}>
            <View style={styles.thumb} />
            <Text style={styles.itemLabel}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 393,
    height: 240,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 393,
    height: 240,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  handle: {
    position: 'absolute',
    top: 8,
    left: (393 - 80) / 2,
    width: 80,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#E3E3E3',
  },
  pill: {
    position: 'absolute',
    top: 28,
    left: 160,
    width: 73,
    height: 30,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent, // #D1E795 (그라데이션 베이스)
  },
  pillText: {
    fontFamily: fonts.inter,
    fontSize: 16,
    color: colors.black,
  },
  itemsRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 74,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 12,
  },
  item: {
    width: 80,
    alignItems: 'center',
    gap: 4,
  },
  thumb: {
    width: 80,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#DBDBDB',
  },
  itemLabel: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
    textAlign: 'center',
    width: '100%',
  },
});
