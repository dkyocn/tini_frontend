/**
 * MyPageMenuCard (마이페이지 메뉴 카드)
 * Figma node: 1097:15235  —  원본 프레임: Frame 1948755502
 *
 * "마이페이지" 헤더 + 구분선 + 메뉴 항목(설정/도움말/구독/프로필).
 * 각 항목 좌측에 검정 20x20 아이콘 자리.
 *
 * 주의:
 *  - 구분선(Line268)은 피그마 SVG 에셋 대신 1px 배경 View로 대체.
 *  - 폰트 'Inter'는 앱에 폰트 로딩/링크 필요.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

const MENU = ['설정', '도움말', '구독', '프로필'];

export default function MyPageMenuCard() {
  return (
    <View style={styles.container}>
      {/* 카드 배경 */}
      <View style={styles.card} />

      {/* 내용 */}
      <View style={styles.content}>
        {/* 헤더 */}
        <View style={styles.headerRow}>
          <View style={styles.iconBox} />
          <Text style={styles.headerText}>마이페이지</Text>
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 메뉴 항목들 */}
        <View style={styles.menuList}>
          {MENU.map((label, i) => (
            <View key={i} style={styles.menuRow}>
              <View style={styles.iconBox} />
              <Text style={styles.menuText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 353,
    height: 300,
  },
  card: {
    position: 'absolute',
    left: (353 - 353) / 2,
    top: 0,
    width: 353,
    height: 300,
    backgroundColor: colors.white,
    borderRadius: 20,
  },
  content: {
    position: 'absolute',
    left: 20,
    top: 23,
    width: 306,
    gap: 20,
    alignItems: 'flex-start',
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
  },
  menuText: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
  },
});
