/**
 * ConsentAgreementCard (약관 전체 동의 카드)
 * Figma node: 1097:14913  —  원본 프레임: Frame 1948755639
 *
 * "전체 동의하기" 헤더 + 구분선 + 개별 약관 동의 항목 목록.
 * 일부 항목은 우측에 "보기"(밑줄, #D9D9D9) 링크 포함.
 *
 * 주의:
 *  - 구분선(Line268)은 피그마 SVG 에셋 대신 1px 배경 View로 대체.
 *  - 폰트 'Inter'는 앱에 폰트 로딩/링크 필요.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

// 항목: gap은 라벨과 "보기" 사이 간격(피그마 값). link 없으면 "보기" 미표시
const ITEMS: { label: string; hasLink: boolean; gap: number }[] = [
  { label: '(필수) 만 12세 이상', hasLink: false, gap: 0 },
  { label: '(필수) 티니 트래커 이용약관 동의', hasLink: true, gap: 50 },
  { label: '(필수) 개인정보 처리방침 동의', hasLink: true, gap: 67 },
  { label: '(선택) 티니 트래커 알림 수신', hasLink: true, gap: 76 },
  { label: '(선택) 티니 트래커 알림 수신', hasLink: false, gap: 0 },
  { label: '(선택) 티니 트래커 알림 수신', hasLink: false, gap: 0 },
];

export default function ConsentAgreementCard() {
  return (
    <View style={styles.container}>
      {/* 카드 배경 */}
      <View style={styles.card} />

      {/* 전체 동의하기 헤더 */}
      <View style={styles.headerRow}>
        <View style={styles.checkbox} />
        <Text style={styles.headerText}>전체 동의하기</Text>
      </View>

      {/* 구분선 (헤더와 목록 사이) */}
      <View style={styles.divider} />

      {/* 개별 동의 항목 */}
      <View style={styles.list}>
        {ITEMS.map((item, i) => (
          <View key={i} style={styles.itemRow}>
            <View style={styles.checkbox} />
            <View style={[styles.itemTextGroup, item.hasLink && { gap: item.gap }]}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              {item.hasLink && <Text style={styles.viewLink}>보기</Text>}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 353,
    height: 385,
  },
  card: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 353,
    height: 385,
    backgroundColor: colors.white,
    borderRadius: 20,
  },
  headerRow: {
    position: 'absolute',
    left: 20,
    top: 31,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.black,
  },
  headerText: {
    fontFamily: fonts.inter,
    fontSize: 16,
    color: colors.black,
  },
  divider: {
    position: 'absolute',
    left: 353 / 2 - 150.5,
    top: 385 / 2 - 129.5,
    width: 300,
    height: 1,
    backgroundColor: colors.black,
  },
  list: {
    position: 'absolute',
    left: 20,
    top: 91,
    width: 306,
    gap: 28,
    alignItems: 'flex-start',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  itemTextGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLabel: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
  },
  viewLink: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: '#D9D9D9',
    textDecorationLine: 'underline',
  },
});
