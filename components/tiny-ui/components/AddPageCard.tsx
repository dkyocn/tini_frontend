/**
 * AddPageCard (페이지 추가 카드)
 * Figma node: 1097:15109  —  원본 프레임명: Frame 1948756073
 *
 * 목적: "페이지 추가" 헤더 + 체크박스, "저장된 페이지" / "속지 양식" 탭(구분선),
 *       91x134 속지 썸네일 3열 x 2행 그리드, 하단 그라데이션 "페이지 추가" 버튼.
 * 카드 480 높이, borderRadius 30.
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

// 피그마 에셋 — 7일 후 만료, 로컬 asset으로 교체
import ImgVector3 from '../../../assets/images/tini-ui/0bd27ea4-b072-4282-9a93-89a72b57da73.svg'; // 탭 구분선
import ImgFrame1948755666 from '../../../assets/images/tini-ui/25aa86e1-3448-4848-b631-8366a3e3f300.svg'; // 속지 썸네일

const ROWS_TOP = [121, 275];

type AddPageCardProps = {
  onPressAddPage?: () => void;
};

export default function AddPageCard({ onPressAddPage }: AddPageCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>페이지 추가</Text>
      <View style={styles.checkbox} />

      {/* 좌측 탭: 저장된 페이지 (+ 밑줄) */}
      <View style={styles.tabLeft}>
        <Text style={styles.tabText}>저장된 페이지</Text>
        <ImgVector3 style={styles.tabUnderline} />
      </View>

      {/* 우측 탭: 속지 양식 */}
      <View style={styles.tabRight}>
        <Text style={styles.tabText}>속지 양식</Text>
      </View>

      {/* 속지 썸네일 그리드 */}
      {ROWS_TOP.map((top, ri) => (
        <View key={ri} style={[styles.row, { top }]}>
          {[0, 1, 2].map((ci) => (
            <View key={ci} style={styles.thumb}>
              <ImgFrame1948755666 width="100%" height="100%" />
            </View>
          ))}
        </View>
      ))}

      {/* 하단 페이지 추가 버튼 (그라데이션 베이스색) */}
      {/* 그라데이션 원본: linear-gradient(90deg, #D1E795, #D1E795), linear-gradient(90deg, #25EEBA, #25EEBA) */}
      <TouchableOpacity style={styles.addButton} onPress={onPressAddPage}>
        <Text style={styles.addButtonText}>페이지 추가</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 353,
    height: 480,
    borderRadius: 30,
    backgroundColor: colors.white,
  },
  title: {
    position: 'absolute',
    top: 25,
    left: 176.5 - 39.5, // left-[calc(50%-39.5px)]
    fontFamily: fonts.inter,
    fontSize: 16,
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
  tabLeft: {
    position: 'absolute',
    left: 21,
    top: 67,
    width: 146,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  tabRight: {
    position: 'absolute',
    left: 176.5 + 10.5, // left-[calc(50%+10.5px)]
    top: 67,
    width: 146,
    flexDirection: 'column',
    alignItems: 'center',
  },
  tabText: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
    textAlign: 'center',
  },
  tabUnderline: {
    width: 146,
    height: 1,
  },
  row: {
    position: 'absolute',
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  thumb: {
    width: 91,
    height: 134,
  },
  addButton: {
    position: 'absolute',
    top: 429,
    left: 176.5 - 0.5 - 120 / 2, // left-[calc(50%-0.5px)], translate-x -50%
    width: 120,
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
  addButtonText: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
  },
});
