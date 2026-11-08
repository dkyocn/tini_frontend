/**
 * SubPageLayout (마이페이지 하위 화면 공용 뼈대)
 *
 * Figma "마이페이지" 섹션의 하위 화면들(로그인 계정, 기기정보 삭제, 설정 팝업, 테마 …)이
 * 공유하는 틀:
 *  - 헤더: 오늘 날짜(좌) + 클로버 보유 뱃지(우)
 *  - 타이틀(24, 중앙) + 뒤로가기(onBack이 있을 때, 좌측)
 *  - 내용 영역(스크롤) — children
 *  - footer (스크롤 밖, 탭바 바로 위 고정 — 예: 상세 약관의 "확인" 버튼)
 *  - 하단 탭바 (메인 화면과 동일)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import CloverCount from '../../components/common/clover_count';
import BottomTabBar from '../../components/common/BottomTabBar';
import type { TabKey } from '../main/MainPage';

const NAV_COLOR = '#2C2C2C';

function formatKoreanDate(d: Date): string {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

type Props = {
  title: string;
  children: React.ReactNode;
  cloverCount?: number;
  footer?: React.ReactNode;
  onBack?: () => void;
  onTabPress?: (key: TabKey) => void;
};

export default function SubPageLayout({
  title,
  children,
  cloverCount = 10,
  footer,
  onBack,
  onTabPress,
}: Props) {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
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

      {/* 하단 탭바 (현재 페이지 연두색) */}
      <BottomTabBar activeKey="user" onTabPress={onTabPress} />
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
});
