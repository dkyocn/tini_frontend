/**
 * CreatePostHeader (게시물 작성하기 상단 바)
 * Figma node: 1097:15405  —  원본 프레임명: Frame 1948755760
 *
 * 목적: 게시물 작성 화면 상단의 헤더. 아바타 + "게시물 작성하기" 라벨과 우측 "게시하기" 버튼.
 * 배경은 그라데이션이라 순정 StyleSheet로는 표현 불가 → 베이스색(accent)으로 대체.
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

// 피그마 에셋 — 7일 후 만료, 로컬 asset으로 교체
import ImgEllipse2188 from '../../../assets/images/tini-ui/3b31ef1d-a8e5-4d9e-873a-cc2f1c28caae.svg';

type CreatePostHeaderProps = {
  title?: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export default function CreatePostHeader({
  title = '게시물 작성하기',
  actionLabel = '게시하기',
  onPressAction,
}: CreatePostHeaderProps) {
  return (
    // 그라데이션 원본: linear-gradient(90deg, #D1E795 0%, #D1E795 100%), linear-gradient(90deg, #25EEBA 0%, #25EEBA 100%)
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={styles.avatar}>
            <ImgEllipse2188 width={30} height={30} />
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={onPressAction}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.accent, // 그라데이션 베이스색
    paddingLeft: 17,
    paddingRight: 16,
    paddingVertical: 15,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  row: {
    width: 360,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 30,
    height: 30,
  },
  title: {
    fontFamily: fonts.inter,
    fontSize: 14,
    lineHeight: 16,
    color: colors.black,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.white,
    width: 73,
    height: 30,
    borderRadius: 50,
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
