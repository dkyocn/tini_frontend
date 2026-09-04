/**
 * MyPageMenuCard (마이페이지 메뉴 카드)
 * Figma node: 1097:15235  —  원본 프레임: Frame 1948755502
 *
 * 섹션 헤더(굵게, 클릭 불가) + 구분선 + 메뉴 항목들(클릭 시 onPress 호출).
 * 각 항목 좌측에 검정 20x20 아이콘 자리.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

export type MenuItem = {
  label: string;
  onPress?: () => void;
};

type Props = {
  title: string;
  items: MenuItem[];
};

export default function MyPageMenuCard({ title, items }: Props) {
  return (
    <View style={styles.card}>
      {/* 헤더 (클릭 불가) */}
      <View style={styles.headerRow}>
        <View style={styles.iconBox} />
        <Text style={styles.headerText}>{title}</Text>
      </View>

      {/* 구분선 */}
      <View style={styles.divider} />

      {/* 메뉴 항목들 (클릭 시 다른 페이지로 이동) */}
      <View style={styles.menuList}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.menuRow}
            onPress={item.onPress}
            activeOpacity={0.6}
          >
            <View style={styles.iconBox} />
            <Text style={styles.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 23,
    gap: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 20,
    height: 20,
    backgroundColor: colors.black,
  },
  headerText: {
    fontFamily: fonts.inter,
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.black,
  },
  menuList: {
    width: '100%',
    gap: 28,
    alignItems: 'flex-start',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  menuText: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
  },
});
