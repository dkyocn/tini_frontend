/**
 * AchievementMethodCard (업적 달성 방법 카드)
 * Figma node: 1097:15225  —  원본 프레임명: Frame 1948756071
 *
 * 목적: "달성 방법" 헤더 + 체크박스, 원형 뱃지 이미지(120x120),
 *       업적명 "1짱 다독가"(Bold 16), 안내 문구 2블록, 하단 "달성하러가기" 버튼(accent).
 * 카드 353x480, borderRadius 20.
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

// 피그마 에셋 — 7일 후 만료, 로컬 asset으로 교체
import ImgEllipse2176 from '../../../assets/images/tini-ui/3acad251-dd66-4e9b-b540-c77f0964d501.svg';

type AchievementMethodCardProps = {
  onPressGo?: () => void;
};

export default function AchievementMethodCard({ onPressGo }: AchievementMethodCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.header}>달성 방법</Text>
      <View style={styles.checkbox} />

      <View style={styles.badge}>
        <ImgEllipse2176 width={120} height={120} />
      </View>

      <Text style={styles.achievementName}>1짱 다독가</Text>

      <Text style={styles.desc1}>
        업적을 달성하기 위해서는{'\n'}서재에 등록된 책이 20권 이상이어야 해요.
      </Text>

      <Text style={styles.desc2}>
        북트래커 템플릿에 읽은 책을 기록하면{'\n'}서재에 책이 등록돼요.
      </Text>

      <TouchableOpacity style={styles.goButton} onPress={onPressGo}>
        <Text style={styles.goButtonText}>달성하러가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 353,
    height: 480,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  header: {
    position: 'absolute',
    top: 25,
    left: 176.5 - 48.5, // left-[calc(50%-48.5px)]
    fontFamily: fonts.inter,
    fontSize: 24,
    color: colors.black,
  },
  checkbox: {
    position: 'absolute',
    left: 20,
    top: 27,
    width: 20,
    height: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.black,
  },
  badge: {
    position: 'absolute',
    top: 92,
    left: 176.5 + 0.5 - 120 / 2, // left-[calc(50%+0.5px)], translate-x -50%
    width: 120,
    height: 120,
  },
  achievementName: {
    position: 'absolute',
    top: 240,
    left: 176.5 - 35.5, // left-[calc(50%-35.5px)]
    fontFamily: fonts.inter,
    fontWeight: '700',
    fontSize: 16,
    color: colors.black,
  },
  desc1: {
    position: 'absolute',
    top: 271,
    left: 176.5 - 295 / 2, // left-1/2, translate-x -50%, w-295
    width: 295,
    fontFamily: fonts.inter,
    fontSize: 16,
    lineHeight: 16 * 1.4,
    color: colors.black,
    textAlign: 'center',
  },
  desc2: {
    position: 'absolute',
    top: 323,
    left: 0,
    width: 353 + 1, // left-[calc(50%+0.5px)] + translate-x -50%, whitespace-nowrap 중앙정렬
    fontFamily: fonts.inter,
    fontSize: 16,
    lineHeight: 16 * 1.4,
    color: colors.black,
    textAlign: 'center',
  },
  goButton: {
    position: 'absolute',
    top: 410,
    left: 116,
    width: 120,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accent, // #D1E795
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    paddingBottom: 5,
    paddingLeft: 16,
    paddingRight: 16,
  },
  goButtonText: {
    fontFamily: fonts.inter,
    fontSize: 16,
    color: colors.black,
  },
});
