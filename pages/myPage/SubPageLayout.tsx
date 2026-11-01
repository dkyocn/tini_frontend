/**
 * SubPageLayout (마이페이지 하위 화면 공용 뼈대)
 *
 * Figma "마이페이지" 섹션의 하위 화면들(로그인 계정, 기기정보 삭제, 설정 팝업, 테마 …)이
 * 공유하는 틀:
 *  - 헤더: 오늘 날짜(좌) + 클로버 보유 뱃지(우)
 *  - 타이틀(24, 중앙) + 뒤로가기(onBack이 있을 때, 좌측)
 *  - 내용 영역(스크롤) — children
 *  - footer (스크롤 밖, 탭바 바로 위 고정 — 예: 상세 약관의 "확인" 버튼)
 *  - "ver 2.0" (showVersion, 탭바 바로 위 고정)
 *  - 하단 탭바 (메인 화면과 동일)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, SvgProps } from 'react-native-svg';

import CloverCount from '../../components/common/clover_count';
import type { TabKey } from '../main/MainPage';
import IconHome from '../../assets/images/main/nav-home.svg';
import IconSearch from '../../assets/images/main/nav-search.svg';
import IconBook from '../../assets/images/main/nav-book.svg';
import IconBag from '../../assets/images/main/nav-bag.svg';
import IconUser from '../../assets/images/main/nav-user.svg';

const NAV_COLOR = '#2C2C2C';

const TABS: { key: TabKey; Icon: React.FC<SvgProps>; w: number; h: number }[] = [
  { key: 'home', Icon: IconHome, w: 23, h: 23 },
  { key: 'search', Icon: IconSearch, w: 24, h: 24 },
  { key: 'book', Icon: IconBook, w: 24, h: 20 },
  { key: 'bag', Icon: IconBag, w: 24, h: 24 },
  { key: 'user', Icon: IconUser, w: 23, h: 23 },
];

function formatKoreanDate(d: Date): string {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

type Props = {
  title: string;
  children: React.ReactNode;
  cloverCount?: number;
  /** 탭바 위 "ver 2.0" 표시 여부 (테마 화면처럼 스크롤되는 화면은 끔) */
  showVersion?: boolean;
  footer?: React.ReactNode;
  onBack?: () => void;
  onTabPress?: (key: TabKey) => void;
};

export default function SubPageLayout({
  title,
  children,
  cloverCount = 10,
  showVersion = true,
  footer,
  onBack,
  onTabPress,
}: Props) {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.dateText}>{formatKoreanDate(new Date())}</Text>
        <CloverCount count={cloverCount} />
      </View>

      <View style={styles.titleBar}>
        {onBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.6}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="뒤로가기"
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 5L8 12L15 19"
                stroke={NAV_COLOR}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        )}
        <Text style={styles.titleText}>{title}</Text>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      {footer && <View style={styles.footer}>{footer}</View>}

      {showVersion && <Text style={styles.version}>ver 2.0</Text>}

      <View style={styles.tabBar}>
        {TABS.map(({ key, Icon, w, h }) => (
          <TouchableOpacity
            key={key}
            style={styles.tabItem}
            onPress={() => onTabPress?.(key)}
            activeOpacity={0.6}
          >
            <Icon width={w} height={h} color={NAV_COLOR} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F6F6F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  dateText: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '600',
    color: '#2C2C2C',
    letterSpacing: -0.5,
  },
  titleBar: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 12,
    height: 29,
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: 'Inter',
    fontSize: 24,
    color: '#000000',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
    gap: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  version: {
    alignSelf: 'center',
    paddingBottom: 20,
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#000000',
  },
  tabBar: {
    height: 67,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
