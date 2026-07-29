/**
 * DecorateShopScreen (꾸미기 상점 화면)
 * Figma node: 1097:15412  —  원본 프레임: Frame 1948756064
 *
 * "꾸미기" 상점: 상단 타이틀 + 카테고리 탭(트로피/책장/라디오/다이어리/벽지/책상 책/티니)
 * + 선택 탭 밑줄 + 원형 아이템 슬롯 그리드(4열 x 3행) + 우측 스크롤 인디케이터.
 *
 * 주의:
 *  - 탭 밑줄(Vector3)은 피그마 SVG 에셋을 사용.
 *  - 폰트 'Inter'는 앱에 폰트 로딩/링크 필요.
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

// 피그마 에셋 — 7일 후 만료, 로컬 asset으로 교체
import ImgUnderline from '../../../assets/images/tini-ui/230ebb38-c06f-4d45-8298-b759e9c7c7f9.svg';

// 탭 라벨과 절대 좌표(left). 첫 탭만 활성(검정), 나머지 비활성(#7F7F7F)
const TABS: { label: string; left: number; active: boolean }[] = [
  { label: '트로피', left: 20, active: true },
  { label: '책장', left: 76, active: false },
  { label: '라디오', left: 117.5, active: false },   // calc(25%+18.75px), 부모 393 기준
  { label: '다이어리', left: 173.5, active: false },  // calc(25%+74.75px)
  { label: '벽지', left: 243, active: false },        // calc(50%+46.5px)
  { label: '책상 책', left: 284.5, active: false },   // calc(75%-10.75px)
  { label: '티니', left: 344.5, active: false },      // calc(75%+49.25px)
];

// 원형 슬롯 좌표: 4열(left) x 3행(top)
const COL_LEFT = [20, 113, 207, 300]; // calc(25%+14.75)=113, calc(50%+10.5)=207, calc(75%+5.25)=300
const ROW_TOP = [129, 238, 347];

export default function DecorateShopScreen() {
  return (
    <View style={styles.container}>
      {/* 카드 배경 */}
      <View style={styles.card} />

      {/* 타이틀 */}
      <Text style={styles.title}>꾸미기</Text>

      {/* 카테고리 탭 */}
      {TABS.map((t, i) => (
        <Text
          key={i}
          style={[styles.tab, { left: t.left }, t.active ? styles.tabActive : styles.tabInactive]}
        >
          {t.label}
        </Text>
      ))}

      {/* 활성 탭 밑줄 */}
      <ImgUnderline style={styles.underline} />

      {/* 원형 아이템 슬롯 그리드 */}
      {ROW_TOP.map((top) =>
        COL_LEFT.map((left, ci) => (
          <View key={`${top}-${left}`} style={[styles.slot, { left, top }]} />
        ))
      )}

      {/* 스크롤 인디케이터 */}
      <View style={styles.scrollIndicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 393,
    height: 480,
  },
  card: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 393,
    height: 480,
    backgroundColor: colors.white,
    borderRadius: 30,
  },
  title: {
    position: 'absolute',
    top: 26,
    left: 393 / 2 - 22.5,
    fontFamily: fonts.inter,
    fontSize: 16,
    color: colors.black,
  },
  tab: {
    position: 'absolute',
    top: 70,
    fontFamily: fonts.inter,
    fontSize: 16,
  },
  tabActive: {
    color: colors.black,
  },
  tabInactive: {
    color: '#7F7F7F',
  },
  underline: {
    position: 'absolute',
    left: 21,
    top: 104,
    width: 44,
    height: 2,
  },
  slot: {
    position: 'absolute',
    width: 73,
    height: 73,
    borderRadius: 45.5,
    backgroundColor: colors.bg, // #F6F6F9
  },
  scrollIndicator: {
    position: 'absolute',
    top: 172,
    left: 393 - 14,
    width: 8,
    height: 80,
    borderRadius: 5,
    backgroundColor: '#DBDBDB',
  },
});
