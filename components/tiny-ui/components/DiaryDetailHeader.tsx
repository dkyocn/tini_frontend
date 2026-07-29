/**
 * DiaryDetailHeader (다이어리 상세 헤더)
 * Figma node: 1097:15056  —  원본 프레임명: Frame 1948756058  (file: 티니 UI 제작)
 *
 * 목적: 다이어리 상세 화면 상단 헤더. 타이틀 + 우측 액션 아이콘(공유/편집) 2개.
 * 피그마 정확 값:
 *  - 배경: 393 x 684, #F6F6F9(colors.bg)
 *  - 헤더 행: left 20 / top 18, 아이템 하단 정렬(items-end), 타이틀-아이콘그룹 간격 60
 *  - 타이틀: "다이어리 1년 가보자고" Inter 24, 검정
 *  - 아이콘 그룹: 간격 8, 아이콘 각각 30 x 30 (두 번째는 30x30 배경 위 24x24 Edit 아이콘)
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

// 피그마 에셋 — 7일 후 만료, 로컬 asset으로 교체
import ImgIcon1 from '../../../assets/images/tini-ui/f67ee50f-7702-4410-a998-af0769a35ced.svg';
import ImgIcon2Bg from '../../../assets/images/tini-ui/81c7fe52-7372-4b53-9f78-2d7b576b7d22.svg';
import ImgIcon2Edit from '../../../assets/images/tini-ui/c339c43e-2075-437f-9f72-722e901cf490.svg';

type Props = {
  title?: string;
  onPressIcon1?: () => void;
  onPressIcon2?: () => void;
};

export default function DiaryDetailHeader({
  title = '다이어리 1년 가보자고',
  onPressIcon1,
  onPressIcon2,
}: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.bg} />

      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.iconGroup}>
          <TouchableOpacity onPress={onPressIcon1} hitSlop={8}>
            <ImgIcon1 style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={onPressIcon2} hitSlop={8} style={styles.icon2}>
            <ImgIcon2Bg style={styles.icon2Bg} />
            <ImgIcon2Edit style={styles.icon2Edit} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 393,
    height: 684,
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 393,
    height: 684,
    backgroundColor: colors.bg,
  },
  header: {
    position: 'absolute',
    left: 20,
    top: 18,
    flexDirection: 'row',
    alignItems: 'flex-end',
    columnGap: 60,
  },
  title: {
    fontFamily: fonts.inter,
    fontSize: 24,
    color: colors.black,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  icon: {
    width: 30,
    height: 30,
  },
  icon2: {
    width: 30,
    height: 30,
  },
  icon2Bg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 30,
    height: 30,
  },
  icon2Edit: {
    position: 'absolute',
    left: 3,
    top: 3,
    width: 24,
    height: 24,
  },
});
