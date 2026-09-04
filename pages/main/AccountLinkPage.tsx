/**
 * AccountLinkPage (로그인 계정)
 *
 * 마이페이지 > 계정관리 > "로그인 계정"에서 진입하는 화면.
 * 구성:
 *  - 타이틀 바: "로그인 계정"(24, 중앙)
 *  - 계정 연동 / 계정 연동 해제 박스 (각 355x60, 좌측 검정 20x20 아이콘 + 14px 텍스트, 박스 간 간격 12)
 *  - 하단 탭바 (다른 화면들과 동일)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgProps } from 'react-native-svg';

import IconHome from '../../assets/images/main/nav-home.svg';
import IconSearch from '../../assets/images/main/nav-search.svg';
import IconBook from '../../assets/images/main/nav-book.svg';
import IconBag from '../../assets/images/main/nav-bag.svg';
import IconUser from '../../assets/images/main/nav-user.svg';

const NAV_COLOR = '#2C2C2C';

export type TabKey = 'home' | 'search' | 'book' | 'bag' | 'user';

const TABS: { key: TabKey; Icon: React.FC<SvgProps>; w: number; h: number }[] = [
  { key: 'home', Icon: IconHome, w: 23, h: 23 },
  { key: 'search', Icon: IconSearch, w: 24, h: 24 },
  { key: 'book', Icon: IconBook, w: 24, h: 20 },
  { key: 'bag', Icon: IconBag, w: 24, h: 24 },
  { key: 'user', Icon: IconUser, w: 23, h: 23 },
];

const ITEMS = ['계정 연동', '계정 연동 해제'];

type Props = {
  onTabPress?: (key: TabKey) => void;
  onItemPress?: (item: string) => void;
};

export default function AccountLinkPage({ onTabPress, onItemPress }: Props) {
  const handleItemPress = (item: string) => {
    if (onItemPress) {
      onItemPress(item);
      return;
    }
    Alert.alert(item, '아직 준비 중인 화면이에요.');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>로그인 계정</Text>
      </View>

      <View style={styles.list}>
        {ITEMS.map((label) => (
          <TouchableOpacity
            key={label}
            style={styles.box}
            activeOpacity={0.6}
            onPress={() => handleItemPress(label)}
          >
            <View style={styles.iconBox} />
            <Text style={styles.label}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flex: 1 }} />

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
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  titleText: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  list: {
    alignItems: 'center',
    gap: 12,
  },
  box: {
    width: 355,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  iconBox: {
    width: 20,
    height: 20,
    backgroundColor: '#000000',
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 14,
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
