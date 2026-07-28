/**
 * StreakCalendarCard (연속 작성 캘린더/현황 카드)
 * Figma node: 1097:15551  —  원본 프레임: Frame 1948756068
 *
 * 월 네비게이션(2026.06, 좌우 화살표) + 통계 2개(연속 작성일 수 / 복구펜 보유수) +
 * 요일 헤더가 있는 달력 그리드(도장 이미지 + 날짜 숫자).
 *
 * 주의:
 *  - 화살표/도장(클로버·연필)·구분선은 피그마 에셋 사용.
 *  - 달력 셀은 7열 x 5행 grid를 flex 행으로 구현.
 *  - 폰트 'Inter'는 앱에 폰트 로딩/링크 필요.
 */

import React, { useState } from 'react';
import { View, Text, Image, Modal, Pressable, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';
import TiniFrame from '../../../assets/images/tiniFrame.svg';
import StreakGuideCard from './StreakGuideCard';
import RecoveryPenModal from './RecoveryPenModal';

// 피그마 에셋 — 7일 후 만료, 로컬 asset으로 교체
const imgClover = require('../../../assets/images/tini-ui/517731c9-8a29-411d-8ebe-d95b1a93fb77.png');
const imgArrowLeft = require('../../../assets/images/tini-ui/50cbfa2a-40e8-4ac7-9a10-c63f8e36c4a1.png');
const imgArrowRight = require('../../../assets/images/tini-ui/9259d871-e44a-4d10-9678-1d841d71cfe5.png');
const imgEdit = require('../../../assets/images/tini-ui/4e8a2886-2e2b-4d91-ae0a-2974a26545d2.png');
const imgLine266 = require('../../../assets/images/tini-ui/9d674988-f584-4902-89cc-12b3a1cb1e7f.png');

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// 달력 셀 정의 (7열 x 5행). 피그마 노드 배치 그대로.
type Cell = { type: 'empty' | 'stamp1' | 'stamp2' | 'num'; value?: string };
const GRID: Cell[][] = [
  // row 1
  [{ type: 'empty' }, { type: 'empty' }, { type: 'stamp1' }, { type: 'stamp1' }, { type: 'stamp1' }, { type: 'stamp1' }, { type: 'stamp1' }],
  // row 2
  [{ type: 'stamp1' }, { type: 'stamp1' }, { type: 'stamp1' }, { type: 'stamp1' }, { type: 'stamp1' }, { type: 'stamp1' }, { type: 'stamp1' }],
  // row 3
  [{ type: 'stamp1' }, { type: 'stamp1' }, { type: 'stamp1' }, { type: 'stamp1' }, { type: 'stamp1' }, { type: 'stamp1' }, { type: 'stamp1' }],
  // row 4
  [{ type: 'stamp2' }, { type: 'stamp1' }, { type: 'stamp2' }, { type: 'stamp1' }, { type: 'stamp1' }, { type: 'stamp1' }, { type: 'empty' }],
  // row 5
  [{ type: 'stamp2' }, { type: 'num', value: '17' }, { type: 'num', value: '18' }, { type: 'stamp1' }, { type: 'num', value: '21' }, { type: 'num', value: '22' }, { type: 'empty' }],
];

function CalCell({ cell }: { cell: Cell }) {
  if (cell.type === 'num') {
    return (
      <View style={styles.cell}>
        <Text style={styles.dateNum}>{cell.value}</Text>
      </View>
    );
  }
  if (cell.type === 'stamp1' || cell.type === 'stamp2') {
    return (
      <View style={styles.stamp}>
        <TiniFrame width={32} height={41} />
      </View>
    );
  }
  return <View style={styles.cell} />;
}

export default function StreakCalendarCard() {
  const [guideVisible, setGuideVisible] = useState(false);
  const [recoveryVisible, setRecoveryVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* 카드 배경 */}
      <View style={styles.card} />

      <View style={styles.content}>
        {/* 월 네비게이션 */}
        <View style={styles.monthRow}>
          <View style={styles.checkboxLight} />
          <View style={styles.monthNav}>
            <Image source={imgArrowLeft} style={styles.arrow} resizeMode="contain" />
            <Text style={styles.monthText}>2026.06</Text>
            <Image source={imgArrowRight} style={styles.arrow} resizeMode="contain" />
          </View>
        </View>

        {/* 통계 + 달력 컬럼 */}
        <View style={styles.statsAndCal}>
          {/* 통계 2박스 */}
          <View style={styles.statsRow}>
            <View style={styles.statBox} />
            {/* 연속 작성일 수 */}
            <View style={[styles.statContent, { left: 24 }]}>
              <Text style={styles.statLabelPink}>연속 작성일 수</Text>
              <View style={styles.statValueRow}>
                <Image source={imgClover} style={styles.statIcon} resizeMode="contain" />
                <View style={styles.valueGroup}>
                  <Text style={styles.valueBig}>01</Text>
                  <Text style={styles.valueUnit}>일</Text>
                </View>
                <TouchableOpacity
                  style={styles.checkboxLight}
                  onPress={() => setGuideVisible(true)}
                  activeOpacity={0.6}
                />
              </View>
            </View>
            {/* 복구펜 보유수 */}
            <View style={[styles.statContent, { left: 184 }]}>
              <Text style={styles.statLabelMint}>복구펜 보유수</Text>
              <View style={styles.statValueRow}>
                <Image source={imgEdit} style={styles.statIcon} resizeMode="contain" />
                <View style={styles.valueGroup}>
                  <Text style={styles.valueBig}>41</Text>
                  <Text style={styles.valueUnit}>개</Text>
                </View>
                <TouchableOpacity
                  style={styles.checkboxLight}
                  onPress={() => setRecoveryVisible(true)}
                  activeOpacity={0.6}
                />
              </View>
            </View>
          </View>

          {/* 달력 */}
          <View style={styles.calendar}>
            {/* 요일 헤더 */}
            <View style={styles.calHeaderBlock}>
              <View style={styles.weekdayRow}>
                {WEEKDAYS.map((d) => (
                  <Text key={d} style={styles.weekday}>{d}</Text>
                ))}
              </View>
              <Image source={imgLine266} style={styles.calLine} resizeMode="stretch" />
            </View>

            {/* 날짜 그리드 */}
            <View style={styles.grid}>
              {GRID.map((row, ri) => (
                <View key={ri} style={styles.gridRow}>
                  {row.map((cell, ci) => (
                    <View key={ci} style={styles.gridCellWrap}>
                      <CalCell cell={cell} />
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* 연속 작성일 수 안내 모달 */}
      <Modal visible={guideVisible} transparent animationType="fade" onRequestClose={() => setGuideVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setGuideVisible(false)}>
          <Pressable onPress={() => {}}>
            <StreakGuideCard />
          </Pressable>
        </Pressable>
      </Modal>

      {/* 복구펜 안내 모달 */}
      <Modal visible={recoveryVisible} transparent animationType="fade" onRequestClose={() => setRecoveryVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setRecoveryVisible(false)}>
          <Pressable onPress={() => {}}>
            <RecoveryPenModal />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 393,
    height: 520,
    borderRadius: 30,
  },
  card: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 393,
    height: 520,
    backgroundColor: colors.bg, // #F6F6F9
    borderRadius: 20,
  },
  content: {
    position: 'absolute',
    left: 393 / 2 - 160.5,
    top: 520 / 2 - 240.5,
    width: 320,
    gap: 24,
    alignItems: 'flex-start',
  },
  // 월 네비게이션
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 46,
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
  checkboxLight: {
    width: 20,
    height: 20,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.black,
  },
  // 통계 + 달력
  statsAndCal: {
    width: '100%',
    gap: 12,
  },
  statsRow: {
    height: 80,
    width: '100%',
  },
  statBox: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 320,
    height: 80,
    backgroundColor: colors.white,
    borderRadius: 20,
  },
  statContent: {
    position: 'absolute',
    top: 13,
    gap: 4,
    alignItems: 'flex-start',
  },
  statLabelPink: {
    fontFamily: fonts.inter,
    fontSize: 16,
    color: '#FF3672',
  },
  statLabelMint: {
    fontFamily: fonts.inter,
    fontSize: 16,
    color: '#25EEBA',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 24,
    height: 24,
  },
  valueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  valueBig: {
    fontFamily: fonts.inter,
    fontWeight: '700',
    fontSize: 30,
    color: colors.black,
  },
  valueUnit: {
    fontFamily: fonts.inter,
    fontSize: 16,
    color: colors.black,
  },
  // 달력
  calendar: {
    width: '100%',
    height: 330,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    gap: 16,
  },
  calHeaderBlock: {
    width: '100%',
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
  calLine: {
    width: '100%',
    height: 1,
  },
  grid: {
    width: 290,
    height: 264,
    gap: 10,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
  },
  gridCellWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: {
    width: 32,
    height: 41,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stamp: {
    width: 32,
    height: 41,
  },
  dateNum: {
    fontFamily: fonts.inter,
    fontWeight: '700',
    fontSize: 16,
    color: '#2C2C2C',
  },
});
