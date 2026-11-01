/**
 * TimePickerSheet (시간 선택 바텀시트)
 * Figma: 마이페이지_수정 > 일일 리마인드 시간 (35:1179) / 하루 종료 시간 (35:1281)
 *
 * 흰 시트(상단 radius 30) + 제목(20, bold) + 시/분 휠 2열(16, bold)
 * + 가운데 선택 띠(연회색 60px, radius 20) + 세로 구분선 + 확인 버튼(연두, 353 x 50, radius 30).
 * 선택된 행은 검정, 나머지는 #A1A1A1.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
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

const HOURS = Array.from({ length: 24 }, (_, h) => h);
const MINUTES = [0, 10, 20, 30, 40, 50];

function hourLabel(h: number): string {
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h < 12 ? '오전' : '오후'} ${h12}`;
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

type WheelProps = {
  items: number[];
  selectedIndex: number;
  format: (v: number) => string;
  onChange: (index: number) => void;
};

function Wheel({ items, selectedIndex, format, onChange }: WheelProps) {
  const ref = useRef<ScrollView>(null);
  const [liveIndex, setLiveIndex] = useState(selectedIndex);

  useEffect(() => {
    setLiveIndex(selectedIndex);
    // 모달이 열린 직후 레이아웃이 끝난 뒤 위치를 맞춤
    const id = setTimeout(() => {
      ref.current?.scrollTo({ y: selectedIndex * ITEM_HEIGHT, animated: false });
    }, 0);
    return () => clearTimeout(id);
  }, [selectedIndex]);

  const indexFromEvent = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    return Math.max(0, Math.min(items.length - 1, i));
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = indexFromEvent(e);
    if (i !== liveIndex) setLiveIndex(i);
  };

  const handleEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    onChange(indexFromEvent(e));
  };

  return (
    <ScrollView
      ref={ref}
      style={styles.wheel}
      contentContainerStyle={{ paddingVertical: SIDE_PAD }}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      scrollEventThrottle={16}
      onScroll={handleScroll}
      onMomentumScrollEnd={handleEnd}
      onScrollEndDrag={handleEnd}
    >
      {items.map((v, i) => (
        <TouchableOpacity
          key={v}
          style={styles.wheelItem}
          activeOpacity={0.6}
          onPress={() => {
            ref.current?.scrollTo({ y: i * ITEM_HEIGHT, animated: true });
            setLiveIndex(i);
            onChange(i);
          }}
        >
          <Text style={[styles.wheelText, i === liveIndex && styles.wheelTextSelected]}>
            {format(v)}
          </Text>
        </TouchableOpacity>
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
  const initialMinuteIndex = Math.max(0, MINUTES.indexOf(value.minute));
  const [hourIndex, setHourIndex] = useState(value.hour);
  const [minuteIndex, setMinuteIndex] = useState(initialMinuteIndex);

  useEffect(() => {
    if (visible) {
      setHourIndex(value.hour);
      setMinuteIndex(Math.max(0, MINUTES.indexOf(value.minute)));
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
            <View style={styles.columns}>
              <Wheel
                items={HOURS}
                selectedIndex={hourIndex}
                format={hourLabel}
                onChange={setHourIndex}
              />
              <Wheel
                items={MINUTES}
                selectedIndex={minuteIndex}
                format={minuteLabel}
                onChange={setMinuteIndex}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.confirm}
            activeOpacity={0.8}
            onPress={() => onConfirm({ hour: HOURS[hourIndex], minute: MINUTES[minuteIndex] })}
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
  columns: {
    width: 248,
    height: WHEEL_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wheel: {
    width: 80,
    height: WHEEL_HEIGHT,
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
