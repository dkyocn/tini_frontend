/**
 * StickerProductCard (수제제작 스티커 상품 카드)
 * Figma node: 1097:15036  —  원본 프레임명: Frame 1948755503
 *
 * 목적: 상단 플레이스홀더 이미지(314x185) + 제목 "수제제작 스티커"(18) + 설명(14) + 그라데이션 "버튼".
 * 카드 353x318, borderRadius 30.
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

// 피그마 에셋 — 7일 후 만료, 로컬 asset으로 교체
const img03PlaceholderIcon = require('../../../assets/images/tini-ui/69c837f4-fb3c-447a-827e-235c08152d5d.png');

type StickerProductCardProps = {
  title?: string;
  description?: string;
  buttonLabel?: string;
  onPress?: () => void;
};

export default function StickerProductCard({
  title = '수제제작 스티커',
  description = '설명: 민트닮은 무언가 민트닮은 무언가 민트닮은\\',
  buttonLabel = '버튼',
  onPress,
}: StickerProductCardProps) {
  return (
    <View style={styles.card}>
      {/* 플레이스홀더 이미지 영역 */}
      <View style={styles.imageArea}>
        <View style={styles.imageBase} />
        <Image source={img03PlaceholderIcon} style={styles.imageFill} resizeMode="cover" />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {/* 그라데이션 원본: linear-gradient(90deg, #D1E795, #D1E795), linear-gradient(90deg, #25EEBA, #25EEBA) */}
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 353,
    height: 318,
    borderRadius: 30,
    backgroundColor: colors.white,
  },
  imageArea: {
    position: 'absolute',
    top: 20,
    left: 176.5 + 0.5 - 314 / 2, // left-[calc(50%+0.5px)], translate-x -50%
    width: 314,
    height: 185,
    borderRadius: 24,
    overflow: 'hidden',
  },
  imageBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
    borderRadius: 24,
  },
  imageFill: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
    borderRadius: 24,
  },
  title: {
    position: 'absolute',
    top: 213,
    left: 20,
    fontFamily: fonts.inter,
    fontSize: 18,
    color: colors.black,
  },
  description: {
    position: 'absolute',
    top: 243,
    left: 20,
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
  },
  button: {
    position: 'absolute',
    top: 273,
    left: 20,
    width: 73,
    height: 30,
    borderRadius: 50,
    backgroundColor: colors.accent, // 그라데이션 베이스색
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 7,
    paddingBottom: 6,
    paddingLeft: 24,
    paddingRight: 23,
  },
  buttonText: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
  },
});
