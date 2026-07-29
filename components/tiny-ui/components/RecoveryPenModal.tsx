/**
 * RecoveryPenModal (연속 작성 복구펜 안내 모달)
 * Figma node: 1097:15542  —  원본 프레임명: Frame 1948756067
 *
 * 다이어리 연속 작성 복구펜 안내/상점 이동 카드.
 * 카드 353 x 320, borderRadius 20, 흰 배경.
 *
 * 주의:
 *  - "상점으로 이동" 버튼은 세로 그라데이션(순정 StyleSheet 미지원).
 *    베이스색 #25eeba 로 대체, 정확한 값은 주석 참고(expo-linear-gradient 등 필요).
 *  - 에셋 URL은 발급 후 7일이면 만료됩니다.
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import TiniFrame from '../../../assets/images/tiniFrame.svg';
import { colors, fonts } from '../theme';

// 피그마 에셋 — 7일 후 만료, 로컬 asset으로 교체
import ImgVector from '../../../assets/images/tini-ui/821b9407-e0a4-47ba-bd31-89d194615e6c.svg';

type Props = {
  onPressShop?: () => void;
};

export default function RecoveryPenModal({ onPressShop }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>연속 작성 복구펜</Text>

      <View style={styles.checkbox} />

      {/* 캐릭터 이미지 (티니찐찐푀종 2) */}
      <View style={styles.tiny}>
        <TiniFrame width={80} height={96} />
      </View>

      {/* 장식용 벡터 (회전) */}
      <ImgVector style={styles.vector} />

      <Text style={styles.desc}>
        {'다이어리 연속 작성 중 \n하루를 놓쳤을 때 복구펜을 보유한 상태라면\n기록을 유지할 수 있어요!'}
      </Text>

      {/*
        정확한 그라데이션(순정 StyleSheet 미지원, 참고용):
        linear-gradient(180deg, #25eeba 0%, #7bfa9f 100%)
      */}
      <TouchableOpacity style={styles.button} onPress={onPressShop} activeOpacity={0.8}>
        <Text style={styles.buttonText}>상점으로 이동</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 353,
    height: 320,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  title: {
    position: 'absolute',
    top: 21,
    left: 92, // calc(50% - 84.5px)
    fontFamily: fonts.inter,
    fontSize: 24,
    color: colors.black,
  },
  checkbox: {
    position: 'absolute',
    top: 26,
    left: 20,
    width: 20,
    height: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.black,
  },
  tiny: {
    position: 'absolute',
    left: 136, // 중앙 정렬 기준 80px 폭
    top: 70,   // calc(50% - 42px) 중심 → top
    width: 80,
    height: 96,
  },
  vector: {
    position: 'absolute',
    left: 214, // calc(50% + 37.5px)
    top: 93,
    width: 36.064,
    height: 40.578,
    transform: [{ rotate: '-167.14deg' }],
  },
  desc: {
    position: 'absolute',
    top: 184,
    left: 0,
    width: 353,
    textAlign: 'center',
    fontFamily: fonts.inter,
    fontSize: 16,
    lineHeight: 22.4, // 16 * 1.4
    color: colors.black,
  },
  button: {
    position: 'absolute',
    top: 266,
    left: 116, // 중앙 정렬 기준 120px 폭
    width: 120,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    paddingBottom: 5,
    paddingHorizontal: 16,
    backgroundColor: '#25eeba', // 그라데이션 베이스색
  },
  buttonText: {
    fontFamily: fonts.inter,
    fontSize: 16,
    color: colors.black,
  },
});
