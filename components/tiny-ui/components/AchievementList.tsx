/**
 * AchievementList (업적/뱃지 목록)
 * Figma node: 1097:15315  —  원본 프레임명: Frame 1948756023
 *
 * "1짱 다독가" 업적 행이 세로로 반복되는 리스트.
 * 각 행: 원형 뱃지(73x73) + 레벨/제목/설명 + 진행상태.
 * 첫 행은 "수령하기 / 진행완료"(완료), 나머지는 "14/20 / 진행중".
 * 행 간격 97px (top: 0, 97, 194, 291, 388, 485, 582).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

const ROW_TOPS = [0, 97, 194, 291, 388, 485, 582];

type Item = {
  count: string;        // 우측 상단 텍스트 (수령하기 / 14/20)
  countLeft: number;    // 우측 상단 텍스트 left
  label: string;        // 진행상태 (진행완료 / 진행중)
  labelColor: string;   // 진행상태 색
};

const ITEMS: Item[] = [
  { count: '수령하기', countLeft: 293, label: '진행완료', labelColor: colors.black },
  { count: '14/20', countLeft: 300, label: '진행중', labelColor: '#cdcdcd' },
  { count: '14/20', countLeft: 300, label: '진행중', labelColor: '#cdcdcd' },
  { count: '14/20', countLeft: 300, label: '진행중', labelColor: '#cdcdcd' },
  { count: '14/20', countLeft: 300, label: '진행중', labelColor: '#cdcdcd' },
  { count: '14/20', countLeft: 300, label: '진행중', labelColor: '#cdcdcd' },
  { count: '14/20', countLeft: 300, label: '진행중', labelColor: '#cdcdcd' },
];

export default function AchievementList() {
  return (
    <View style={styles.container}>
      {ITEMS.map((item, i) => (
        <View key={i} style={[styles.row, { top: ROW_TOPS[i] }]}>
          <View style={styles.badge} />
          <Text style={styles.level}>Lv.03</Text>
          <Text style={styles.title}>1짱 다독가</Text>
          <Text style={styles.desc}>한 달 20권 이상 독서 완료</Text>
          <Text style={[styles.count, { left: item.countLeft }]}>{item.count}</Text>
          <Text style={[styles.status, { color: item.labelColor }]}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 355,
    height: ROW_TOPS[ROW_TOPS.length - 1] + 73, // 655
  },
  row: {
    position: 'absolute',
    left: 0,
    width: 355,
    height: 73,
  },
  badge: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 73,
    height: 73,
    borderRadius: 45.5,
    backgroundColor: '#cdcdcd',
  },
  level: {
    position: 'absolute',
    left: 101,
    top: 18,
    fontFamily: fonts.inter,
    fontWeight: '700',
    fontSize: 14,
    color: colors.olive, // #B0CA67
  },
  title: {
    position: 'absolute',
    left: 147,
    top: 17,
    fontFamily: fonts.inter,
    fontWeight: '700',
    fontSize: 16,
    color: colors.black,
  },
  desc: {
    position: 'absolute',
    left: 101,
    top: 45,
    width: 153,
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
  },
  count: {
    position: 'absolute',
    top: 18,
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
  },
  status: {
    position: 'absolute',
    left: 282, // calc(318.5 - 73/2) : 폭73 중앙정렬
    top: 45,
    width: 73,
    textAlign: 'center',
    fontFamily: fonts.inter,
    fontSize: 14,
  },
});
