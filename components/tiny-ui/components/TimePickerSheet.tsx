/**
 * TimePickerSheet (시간 선택 바텀시트)
 * Figma: 일일 리마인드 시간 (64:2305) — 하루 종료 시간 등 같은 시트를 공유
 *
 * 흰 시트(상단 radius 30) + 제목(20, bold)
 * + 휠 3열(16, bold): 왼쪽 오전/오후 │ 오른쪽 시(1~12) : 분(00~59)
 * + 가운데 선택 띠(연회색 60px, radius 20) + 가운데 세로 구분선(200) + 확인 버튼(연두, 353 x 50, radius 30).
 * 선택된 행은 검정, 나머지는 #A1A1A1. 시와 분 사이 ":"는 선택 띠에만 표시.
 * 분 휠은 무한 휠(59분 ↔ 00분이 이어짐).
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';

export type TimeValue = { hour: number; minute: number };

const ITEM_HEIGHT = 52;
const VISIBLE_ROWS = 5;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;
const SIDE_PAD = ITEM_HEIGHT * Math.floor(VISIBLE_ROWS / 2);

const PERIODS = [0, 1]; // 0: 오전, 1: 오후
const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1); // 1 ~ 12
const MINUTES = Array.from({ length: 60 }, (_, m) => m); // 0 ~ 59

// 열 위치: 시트 가운데(구분선) 기준 가로 오프셋 (Figma 393 폭 기준 좌표에서 계산)
const PERIOD_CENTER = -84.5;
const HOUR_CENTER = 56.5;
const COLON_CENTER = 81;
const MINUTE_CENTER = 105.5;

function periodLabel(p: number): string {
  return p === 0 ? '오전' : '오후';
}

function hourLabel(h: number): string {
  return String(h).padStart(2, '0');
}

/** 24시간 → [오전/오후 index, 1~12시 index] */
function splitHour(hour: number): [number, number] {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return [hour < 12 ? 0 : 1, h12 - 1];
}

/** [오전/오후 index, 1~12시 index] → 24시간 */
function joinHour(periodIndex: number, hourIndex: number): number {
  return periodIndex * 12 + (HOURS_12[hourIndex] % 12);
}

function minuteLabel(m: number): string {
  return String(m).padStart(2, '0');
}

/** "오후 07:30" 형태 (설정 팝업 화면 표기) */
export function formatTimePadded({ hour, minute }: TimeValue): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour < 12 ? '오전' : '오후'} ${String(h12).padStart(2, '0')}:${minuteLabel(minute)}`;
}

/** "오전 9:00" 형태 (알림 설정 화면 표기) */
export function formatTimeShort({ hour, minute }: TimeValue): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour < 12 ? '오전' : '오후'} ${h12}:${minuteLabel(minute)}`;
}

// 무한 휠: 항목을 여러 벌 이어 붙이고, 멈출 때마다 가운데 벌의 같은 위치로 몰래 옮김
const LOOP_COPIES = 7;

type WheelProps = {
  items: number[];
  width: number;
  /** 시트 가운데(구분선) 기준 이 열의 가운데 x 오프셋 */
  center: number;
  selectedIndex: number;
  format: (v: number) => string;
  onChange: (index: number) => void;
  /** 끝과 처음이 이어지는 무한 휠 (예: 59분 다음 00분) */
  loop?: boolean;
};

/** 휠 한 칸. 선택 여부가 바뀐 칸만 다시 그려지도록 memo */
const WheelItem = React.memo(function WheelItem({
  label,
  selected,
  position,
  onPressPosition,
}: {
  label: string;
  selected: boolean;
  position: number;
  onPressPosition: (position: number) => void;
}) {
  return (
    <Pressable style={styles.wheelItem} onPress={() => onPressPosition(position)}>
      <Text style={[styles.wheelText, selected && styles.wheelTextSelected]}>{label}</Text>
    </Pressable>
  );
});

function Wheel({ items, width, center, selectedIndex, format, onChange, loop = false }: WheelProps) {
  const ref = useRef<ScrollView>(null);
  const count = items.length;
  const copies = loop ? LOOP_COPIES : 1;
  const total = count * copies;
  // 가운데 벌의 시작 위치 (loop가 아니면 0)
  const base = loop ? Math.floor(copies / 2) * count : 0;

  const [livePosition, setLivePosition] = useState(base + selectedIndex);
  const liveRef = useRef(base + selectedIndex);
  const reportedRef = useRef(selectedIndex); // 이 휠이 마지막으로 부모에게 알린 값
  const momentumRef = useRef(false);
  const dragEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  // 처음 위치. 스크롤 중 바뀌면 네이티브가 위치를 다시 잡아 끊기므로 한 번만 계산
  const initialOffset = useRef({ x: 0, y: (base + selectedIndex) * ITEM_HEIGHT }).current;

  const setLive = (position: number) => {
    liveRef.current = position;
    setLivePosition(position);
  };

  // 바깥에서 값이 바뀐 경우(시트를 다시 열었을 때 등)에만 위치를 맞춤.
  // 휠이 스스로 알린 값은 무시해야 스크롤 도중 위치가 튀지 않음
  useEffect(() => {
    if (selectedIndex === reportedRef.current && liveRef.current % count === selectedIndex) return;
    reportedRef.current = selectedIndex;
    const position = base + selectedIndex;
    setLive(position);
    const id = setTimeout(() => ref.current?.scrollTo({ y: position * ITEM_HEIGHT, animated: false }), 0);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  // 처음 열릴 때 위치 맞춤 (레이아웃이 끝난 뒤)
  useEffect(() => {
    const id = setTimeout(
      () => ref.current?.scrollTo({ y: liveRef.current * ITEM_HEIGHT, animated: false }),
      0,
    );
    return () => clearTimeout(id);
  }, []);

  useEffect(
    () => () => {
      if (dragEndTimer.current) clearTimeout(dragEndTimer.current);
    },
    [],
  );

  const positionFromY = (y: number) =>
    Math.max(0, Math.min(total - 1, Math.round(y / ITEM_HEIGHT)));

  /** 스크롤이 완전히 멈췄을 때: 값 확정 + (무한 휠이면) 가운데 벌로 이동 */
  const settle = (position: number) => {
    const index = ((position % count) + count) % count;
    if (loop) {
      const centered = base + index;
      if (centered !== position) {
        ref.current?.scrollTo({ y: centered * ITEM_HEIGHT, animated: false });
      }
      setLive(centered);
    } else {
      setLive(position);
    }
    reportedRef.current = index;
    onChangeRef.current(index);
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const position = positionFromY(e.nativeEvent.contentOffset.y);
    if (position !== liveRef.current) setLive(position);
  };

  const handleBeginDrag = () => {
    momentumRef.current = false;
    if (dragEndTimer.current) clearTimeout(dragEndTimer.current);
  };

  // 손을 뗀 뒤 관성 스크롤이 이어지면 거기서 확정. 관성 없이 멈춘 경우만 여기서 확정
  const handleEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const position = positionFromY(e.nativeEvent.contentOffset.y);
    dragEndTimer.current = setTimeout(() => {
      if (!momentumRef.current) settle(position);
    }, 150);
  };

  const handleMomentumBegin = () => {
    momentumRef.current = true;
    if (dragEndTimer.current) clearTimeout(dragEndTimer.current);
  };

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    momentumRef.current = false;
    settle(positionFromY(e.nativeEvent.contentOffset.y));
  };

  const handlePress = useCallback(
    (position: number) => {
      ref.current?.scrollTo({ y: position * ITEM_HEIGHT, animated: true });
      setLive(position);
      const index = position % count;
      reportedRef.current = index;
      onChangeRef.current(index);
    },
    [count],
  );

  return (
    <ScrollView
      ref={ref}
      style={[styles.wheel, { width, marginLeft: center - width / 2 }]}
      contentContainerStyle={{ paddingVertical: SIDE_PAD }}
      contentOffset={initialOffset}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      scrollEventThrottle={16}
      onScroll={handleScroll}
      onScrollBeginDrag={handleBeginDrag}
      onScrollEndDrag={handleEndDrag}
      onMomentumScrollBegin={handleMomentumBegin}
      onMomentumScrollEnd={handleMomentumEnd}
    >
      {Array.from({ length: total }, (_, position) => (
        <WheelItem
          key={position}
          label={format(items[position % count])}
          selected={position === livePosition}
          position={position}
          onPressPosition={handlePress}
        />
      ))}
    </ScrollView>
  );
}

type Props = {
  visible: boolean;
  title: string;
  value: TimeValue;
  onConfirm: (value: TimeValue) => void;
  onClose: () => void;
};

export default function TimePickerSheet({ visible, title, value, onConfirm, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [initialPeriod, initialHour] = splitHour(value.hour);
  const [periodIndex, setPeriodIndex] = useState(initialPeriod);
  const [hourIndex, setHourIndex] = useState(initialHour);
  const [minuteIndex, setMinuteIndex] = useState(value.minute);

  useEffect(() => {
    if (visible) {
      const [p, h] = splitHour(value.hour);
      setPeriodIndex(p);
      setHourIndex(h);
      setMinuteIndex(value.minute);
    }
  }, [visible, value.hour, value.minute]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.dim}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: 26 + insets.bottom }]}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.wheelArea}>
            <View style={styles.selectionBand} pointerEvents="none" />
            <View style={styles.divider} pointerEvents="none" />
            <Text style={styles.colon} pointerEvents="none">
              :
            </Text>
            <View style={styles.columns}>
              <Wheel
                items={PERIODS}
                width={80}
                center={PERIOD_CENTER}
                selectedIndex={periodIndex}
                format={periodLabel}
                onChange={setPeriodIndex}
              />
              <Wheel
                items={HOURS_12}
                width={40}
                center={HOUR_CENTER}
                selectedIndex={hourIndex}
                format={hourLabel}
                onChange={setHourIndex}
              />
              <Wheel
                items={MINUTES}
                width={40}
                center={MINUTE_CENTER}
                selectedIndex={minuteIndex}
                format={minuteLabel}
                onChange={setMinuteIndex}
                loop
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.confirm}
            activeOpacity={0.8}
            onPress={() =>
              onConfirm({ hour: joinHour(periodIndex, hourIndex), minute: MINUTES[minuteIndex] })
            }
          >
            <Text style={styles.confirmText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dim: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.inter,
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
  },
  wheelArea: {
    width: '100%',
    height: WHEEL_HEIGHT,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: (WHEEL_HEIGHT - 60) / 2,
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.bg,
  },
  divider: {
    position: 'absolute',
    top: (WHEEL_HEIGHT - 200) / 2,
    width: 1,
    height: 200,
    backgroundColor: colors.line,
  },
  // 각 열은 가운데(구분선)를 기준으로 절대 배치
  columns: {
    ...StyleSheet.absoluteFillObject,
  },
  wheel: {
    position: 'absolute',
    left: '50%',
    top: 0,
    height: WHEEL_HEIGHT,
  },
  colon: {
    position: 'absolute',
    left: '50%',
    marginLeft: COLON_CENTER - 10,
    width: 20,
    top: (WHEEL_HEIGHT - 20) / 2,
    lineHeight: 20,
    fontFamily: fonts.inter,
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelText: {
    fontFamily: fonts.inter,
    fontSize: 16,
    fontWeight: '700',
    color: '#A1A1A1',
    textAlign: 'center',
  },
  wheelTextSelected: {
    color: colors.black,
  },
  confirm: {
    width: '100%',
    height: 50,
    marginTop: 14,
    borderRadius: 30,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontFamily: fonts.inter,
    fontSize: 16,
    color: colors.black,
  },
});
