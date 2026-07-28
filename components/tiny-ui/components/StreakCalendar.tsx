/**
 * StreakCalendar (연속 작성 캘린더)
 * Figma node: 1314:9764  —  원본 프레임명: Frame 1948756104
 *
 * 다이어리 연속 작성 현황 캘린더 카드.
 *  - 외곽: 353 x 520, 배경 #F6F6F9(bg), rounded 20
 *  - 헤더: 체크박스 + ◀ 2026.06 ▶
 *  - 통계 카드(320x80): 연속 작성일 수(#ff3672) 01일 / 복구펜 보유수(#25eeba) 41개
 *  - 요일 행(일~토) + 구분선
 *  - 5x7 캘린더 그리드: 도장 이미지(IMG_4817/IMG_4818) 및 날짜 숫자(17/18/21/22)
 *
 * 주의:
 *  - 연두 진행바(#e6efdd)는 원본이 좌우 동색 그라데이션이라 단색으로 표현.
 *  - 에셋 URL은 발급 후 7일이면 만료됩니다.
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

// 피그마 에셋 — 7일 후 만료, 로컬 asset으로 교체
const imgClover = require('../../../assets/images/tini-ui/038f09cb-c482-415d-8e69-31d1c2497623.png');
const imgStamp4817 = require('../../../assets/images/tini-ui/0f506290-95a3-4b7c-83ce-5ab1892ab49e.png');
const imgStamp4818 = require('../../../assets/images/tini-ui/b07a713e-9de9-4ebb-9165-63a321a9bcc2.png');
const imgArrowLeft = require('../../../assets/images/tini-ui/cb283c80-54fa-4c1a-81ea-87d91b3f0c54.png');
const imgArrowRight = require('../../../assets/images/tini-ui/fd1303a8-8432-42e7-a4c3-3b6a88e33333.png');
const imgEdit = require('../../../assets/images/tini-ui/6cbb8a63-bdf5-465f-aa1c-853597880f0f.png');
const imgLine = require('../../../assets/images/tini-ui/1c5c468d-cb4a-4de2-9802-99f9606b9777.png');

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

type Cell = 'empty' | 's4817' | 's4818' | string; // 문자열이면 날짜 숫자

// 행렬(5행 x 7열) — 원본 그리드 셀 구성 그대로
const GRID: Cell[][] = [
  ['empty', 'empty', 's4817', 's4817', 's4817', 's4817', 's4817'],
  ['s4817', 's4817', 's4817', 's4817', 's4817', 's4817', 's4817'],
  ['s4817', 's4817', 's4817', 's4817', 's4817', 's4817', 's4817'],
  ['s4818', 's4817', 's4818', 's4817', 's4817', 's4817', 'empty'],
  ['s4818', '17', '18', 's4817', '21', '22', 'empty'],
];

const CELL_W = 32;
const CELL_H = 41;
const GAP = 10;

export default function StreakCalendar() {
  return (
    <View style={styles.card}>
      {/* 안쪽 흰 카드 */}
      <View style={styles.innerCard} />

      {/* 연두 진행바 (그라데이션 → 단색 #e6efdd) */}
      <View style={[styles.bar, { top: 227, left: 112, width: 208 }]} />
      <View style={[styles.bar, { top: 283, left: 26, width: 298 }]} />
      <View style={[styles.bar, { top: 338, left: 26, width: 298 }]} />

      {/* 헤더: 체크박스 + 월 네비게이션 */}
      <View style={styles.header}>
        <View style={styles.checkbox} />
        <View style={styles.monthNav}>
          <Image source={imgArrowLeft} style={styles.arrow} resizeMode="contain" />
          <Text style={styles.monthText}>2026.06</Text>
          <Image source={imgArrowRight} style={styles.arrow} resizeMode="contain" />
        </View>
      </View>

      {/* 통계 카드 */}
      <View style={styles.statCard}>
        {/* 연속 작성일 수 */}
        <View style={[styles.statCol, { left: 24 }]}>
          <Text style={[styles.statLabel, { color: '#ff3672' }]}>연속 작성일 수</Text>
          <View style={styles.statRow}>
            <Image source={imgClover} style={styles.statIcon} resizeMode="contain" />
            <View style={styles.statValue}>
              <Text style={styles.statNumber}>01</Text>
              <Text style={styles.statUnit}>일</Text>
            </View>
            <View style={styles.checkbox} />
          </View>
        </View>

        {/* 복구펜 보유수 */}
        <View style={[styles.statCol, { left: 184 }]}>
          <Text style={[styles.statLabel, { color: '#25eeba' }]}>복구펜 보유수</Text>
          <View style={styles.statRow}>
            <Image source={imgEdit} style={styles.statIcon} resizeMode="contain" />
            <View style={styles.statValue}>
              <Text style={styles.statNumber}>41</Text>
              <Text style={styles.statUnit}>개</Text>
            </View>
            <View style={styles.checkbox} />
          </View>
        </View>
      </View>

      {/* 요일 행 + 구분선 */}
      <View style={styles.weekdayWrap}>
        <View style={styles.weekdayRow}>
          {WEEKDAYS.map((d) => (
            <Text key={d} style={styles.weekday}>{d}</Text>
          ))}
        </View>
        <Image source={imgLine} style={styles.line} resizeMode="stretch" />
      </View>

      {/* 캘린더 그리드 */}
      <View style={styles.grid}>
        {GRID.map((row, r) =>
          row.map((cell, c) => {
            if (cell === 'empty') return null;
            const left = c * (CELL_W + GAP);
            const top = r * (CELL_H + GAP);
            if (cell === 's4817' || cell === 's4818') {
              return (
                <Image
                  key={`${r}-${c}`}
                  source={cell === 's4817' ? imgStamp4817 : imgStamp4818}
                  style={[styles.stamp, { left, top }]}
                  resizeMode="contain"
                />
              );
            }
            // 날짜 숫자 셀
            return (
              <View key={`${r}-${c}`} style={[styles.numberCell, { left, top }]}>
                <Text style={styles.numberText}>{cell}</Text>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 353,
    height: 520,
    borderRadius: 20,
    backgroundColor: colors.bg, // #F6F6F9
  },
  innerCard: {
    position: 'absolute',
    top: 169,
    left: 17, // calc(50% + 0.5px) 중심, 폭 320
    width: 320,
    height: 332,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  bar: {
    position: 'absolute',
    height: 38,
    borderRadius: 20,
    backgroundColor: '#e6efdd',
  },
  header: {
    position: 'absolute',
    top: 23,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 46,
  },
  checkbox: {
    width: 20,
    height: 20,
    backgroundColor: colors.bg, // #F6F6F9
    borderWidth: 1,
    borderColor: colors.black,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  arrow: {
    width: 24,
    height: 24,
  },
  monthText: {
    fontFamily: fonts.inter,
    fontWeight: '700',
    fontSize: 24,
    color: colors.black,
  },
  statCard: {
    position: 'absolute',
    top: 76,
    left: 16,
    width: 320,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  statCol: {
    position: 'absolute',
    top: 13,
    gap: 4,
  },
  statLabel: {
    fontFamily: fonts.inter,
    fontSize: 16,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 24,
    height: 24,
  },
  statValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontFamily: fonts.inter,
    fontWeight: '700',
    fontSize: 30,
    color: colors.black,
  },
  statUnit: {
    fontFamily: fonts.inter,
    fontSize: 16,
    color: colors.black,
  },
  weekdayWrap: {
    position: 'absolute',
    top: 180,
    left: 28,
    width: 296,
    alignItems: 'center',
    gap: 12,
  },
  weekdayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
  },
  weekday: {
    fontFamily: fonts.inter,
    fontSize: 16,
    color: colors.black,
  },
  line: {
    width: '100%',
    height: 1,
  },
  grid: {
    position: 'absolute',
    top: 227,
    left: 31,
    width: 290,
    height: 264,
  },
  stamp: {
    position: 'absolute',
    width: CELL_W,
    height: CELL_H,
  },
  numberCell: {
    position: 'absolute',
    width: CELL_W,
    height: CELL_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontFamily: fonts.inter,
    fontWeight: '700',
    fontSize: 16,
    color: '#2c2c2c',
  },
});
