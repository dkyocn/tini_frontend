/**
 * CalendarPopup (날짜 선택 달력 팝업)
 * Figma: 오늘의 트래킹 > 날짜 선택 (node 64:2074)
 *
 * 흰 카드(radius 20, 그림자) 안에
 *  - ‹ 2026년 6월 › 월 이동 (Inter Bold 20)
 *  - 요일 행(일~토, 16) + 구분선(#D5D5D5)
 *  - 날짜 그리드(Inter Bold 16, #2C2C2C, 행 간격 51). 선택한 날짜는 연두 원(29) + 흰 글자
 * 날짜를 누르면 onSelect(date). 오늘 이후 날짜는 흐리게 표시되고 선택할 수 없음.
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, fonts } from '../theme';
import ImgArrowLeft from '../../../assets/images/tini-ui/cb283c80-54fa-4c1a-81ea-87d91b3f0c54.svg';
import ImgArrowRight from '../../../assets/images/tini-ui/fd1303a8-8432-42e7-a4c3-3b6a88e33333.svg';
import ImgLine from '../../../assets/images/tini-ui/1c5c468d-cb4a-4de2-9802-99f9606b9777.svg';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const COL_WIDTH = 43;
const ROW_HEIGHT = 51;
const SELECTED_SIZE = 29;

type Props = {
  value: Date;
  onSelect: (date: Date) => void;
  style?: StyleProp<ViewStyle>;
};

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  );
}

/** 해당 월의 날짜를 주 단위(일~토)로 나눔. 앞뒤 빈칸은 null */
function buildWeeks(year: number, month: number): (number | null)[][] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export default function CalendarPopup({ value, onSelect, style }: Props) {
  const today = startOfDay(new Date());
  const [view, setView] = useState({ year: value.getFullYear(), month: value.getMonth() });

  const isCurrentMonth = view.year === today.getFullYear() && view.month === today.getMonth();
  const moveMonth = (delta: number) => {
    const d = new Date(view.year, view.month + delta, 1);
    setView({ year: d.getFullYear(), month: d.getMonth() });
  };

  return (
    <View style={[styles.card, style]}>
      {/* 월 이동 */}
      <View style={styles.monthNav}>
        <TouchableOpacity
          style={styles.arrowBox}
          onPress={() => moveMonth(-1)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="이전 달"
        >
          <ImgArrowLeft width={15.5} height={8.5} style={styles.arrowLeft} />
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {view.year}년 {view.month + 1}월
        </Text>
        <TouchableOpacity
          style={[styles.arrowBox, isCurrentMonth && styles.disabled]}
          onPress={() => moveMonth(1)}
          disabled={isCurrentMonth}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="다음 달"
        >
          <ImgArrowRight width={15.5} height={8.5} style={styles.arrowRight} />
        </TouchableOpacity>
      </View>

      {/* 요일 + 구분선 */}
      <View style={styles.weekdayWrap}>
        <View style={styles.row}>
          {WEEKDAYS.map((d) => (
            <Text key={d} style={[styles.cell, styles.weekday]}>
              {d}
            </Text>
          ))}
        </View>
        <ImgLine width="100%" height={1} />
      </View>

      {/* 날짜 그리드 */}
      <View style={styles.grid}>
        {buildWeeks(view.year, view.month).map((week, w) => (
          <View key={w} style={[styles.row, styles.dateRow]}>
            {week.map((day, i) => {
              if (day === null) return <View key={i} style={styles.cell} />;
              const date = new Date(view.year, view.month, day);
              const selected = isSameDay(date, value);
              const future = date > today;
              return (
                <TouchableOpacity
                  key={i}
                  style={styles.cell}
                  onPress={() => onSelect(date)}
                  disabled={future}
                  activeOpacity={0.6}
                  accessibilityState={{ selected, disabled: future }}
                >
                  <View style={[styles.dayCircle, selected && styles.dayCircleSelected]}>
                    <Text
                      style={[
                        styles.dayText,
                        selected && styles.dayTextSelected,
                        future && styles.dayTextFuture,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingTop: 25,
    paddingBottom: 6,
    paddingHorizontal: 12,
    // drop-shadow(0 4px 2px rgba(0,0,0,0.25))
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 4,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  arrowBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 원본 화살표는 아래(∨) 방향 → Figma처럼 회전
  arrowLeft: {
    transform: [{ rotate: '90deg' }],
  },
  arrowRight: {
    transform: [{ rotate: '-90deg' }],
  },
  disabled: {
    opacity: 0.3,
  },
  monthText: {
    fontFamily: fonts.inter,
    fontWeight: '700',
    fontSize: 20,
    color: colors.black,
  },
  weekdayWrap: {
    marginTop: 25,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    width: COL_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekday: {
    fontFamily: fonts.inter,
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
  },
  grid: {
    marginTop: 12,
  },
  dateRow: {
    height: ROW_HEIGHT,
  },
  dayCircle: {
    width: SELECTED_SIZE,
    height: SELECTED_SIZE,
    borderRadius: SELECTED_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    backgroundColor: colors.accent,
  },
  dayText: {
    fontFamily: fonts.inter,
    fontWeight: '700',
    fontSize: 16,
    color: colors.dateText,
  },
  dayTextSelected: {
    color: colors.white,
  },
  dayTextFuture: {
    color: colors.placeholderBar,
  },
});
