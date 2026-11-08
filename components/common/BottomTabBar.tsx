/**
 * BottomTabBar (하단 탭바 — 홈 / 검색 / 책 / 상점 / 마이페이지)
 * Figma: 하단 메뉴바 (node 65:2354)
 *
 * 흰 배경 67 높이. 기기 하단 안전영역(홈 인디케이터)까지 흰색으로 채움
 * → 이 탭바를 쓰는 화면은 SafeAreaView edges에서 'bottom'을 빼야 함.
 * 현재 페이지의 아이콘(activeKey)은 연두색, 나머지는 #2C2C2C.
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgProps } from 'react-native-svg';

import { colors } from '../tiny-ui/theme';
import IconHome from '../../assets/images/main/nav-home.svg';
import IconSearch from '../../assets/images/main/nav-search.svg';
import IconBook from '../../assets/images/main/nav-book.svg';
import IconBag from '../../assets/images/main/nav-bag.svg';
import IconUser from '../../assets/images/main/nav-user.svg';

export type TabKey = 'home' | 'search' | 'book' | 'bag' | 'user';

const NAV_COLOR = colors.dateText; // #2C2C2C
const ACTIVE_COLOR = colors.accent; // #D1E795

// 렌더 크기는 Figma 노드 크기 기준
const TABS: { key: TabKey; Icon: React.FC<SvgProps>; w: number; h: number; label: string }[] = [
  { key: 'home', Icon: IconHome, w: 23, h: 23, label: '홈' },
  { key: 'search', Icon: IconSearch, w: 24, h: 24, label: '검색' },
  { key: 'book', Icon: IconBook, w: 24, h: 20, label: '책' },
  { key: 'bag', Icon: IconBag, w: 24, h: 24, label: '상점' },
  { key: 'user', Icon: IconUser, w: 23, h: 23, label: '마이페이지' },
];

type Props = {
  /** 현재 페이지 탭 (연두색으로 표시) */
  activeKey?: TabKey;
  onTabPress?: (key: TabKey) => void;
};

export default function BottomTabBar({ activeKey, onTabPress }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.bar}>
        {TABS.map(({ key, Icon, w, h, label }) => {
          const active = key === activeKey;
          return (
            <TouchableOpacity
              key={key}
              style={styles.tabItem}
              onPress={() => onTabPress?.(key)}
              activeOpacity={0.6}
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected: active }}
            >
              <Icon width={w} height={h} color={active ? ACTIVE_COLOR : NAV_COLOR} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  bar: {
    height: 67,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
