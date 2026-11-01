/**
 * MyPageMenuCard (마이페이지 메뉴 카드)
 * Figma node: 1097:15235  —  원본 프레임: Frame 1948755502
 *
 * 섹션 헤더(굵게, 클릭 불가) + 구분선 + 메뉴 항목들(클릭 시 onPress 호출).
 * 헤더 좌측에 검정 20x20 아이콘 자리, 각 항목 좌측에 연두색 16px 원(불릿).
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

/** 항목 앞 연두 원(16px) + 가운데 흰 점(4px). inactive면 회색(선택 안 된 옵션) */
export function MenuBullet({ inactive = false }: { inactive?: boolean }) {
  return (
    <View style={[styles.bullet, inactive && styles.bulletInactive]}>
      <View style={styles.bulletDot} />
    </View>
  );
}

/**
 * 단일 선택용 라디오 (Figma 6:1075 "여가 항목 구분")
 * 선택됨: 연두 원(16) + 흰 점(4) / 선택 안 됨: 회색(#E0E0E0) 원만
 */
export function RadioBullet({ selected }: { selected: boolean }) {
  return (
    <View style={[styles.bullet, !selected && styles.radioOff]}>
      {selected && <View style={styles.bulletDot} />}
    </View>
  );
}

export type MenuItem = {
  label: string;
  onPress?: () => void;
};

type Props = {
  title: string;
  items: MenuItem[];
  /** 카드 최소 높이 (Figma는 섹션마다 높이가 고정: 250/320/280 …) */
  minHeight?: number;
};

export default function MyPageMenuCard({ title, items, minHeight }: Props) {
  return (
    <View style={[styles.card, minHeight ? { minHeight } : null]}>
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
            <MenuBullet />
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
  bullet: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulletInactive: {
    backgroundColor: colors.tagGray,
  },
  radioOff: {
    backgroundColor: '#E0E0E0',
  },
  bulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.white,
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
    backgroundColor: colors.line,
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
