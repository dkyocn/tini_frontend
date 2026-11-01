/**
 * ToggleSwitch (알림 설정 토글)
 * Figma: 마이페이지_수정 > 계정관리_알림설정 (node 35:1137)
 *
 * 60 x 30, radius 30. 켜짐: 연두 배경 + 흰 원(24) 오른쪽 / 꺼짐: 연회색 배경 + 흰 원 왼쪽.
 */

import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { colors } from '../theme';

type Props = {
  value: boolean;
  onValueChange?: (next: boolean) => void;
};

export default function ToggleSwitch({ value, onValueChange }: Props) {
  return (
    <TouchableOpacity
      style={[styles.track, value ? styles.trackOn : styles.trackOff]}
      activeOpacity={0.8}
      onPress={() => onValueChange?.(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <View style={styles.knob} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 60,
    height: 30,
    borderRadius: 30,
    padding: 3,
    flexDirection: 'row',
  },
  trackOn: {
    backgroundColor: colors.accent,
    justifyContent: 'flex-end',
  },
  trackOff: {
    backgroundColor: colors.bg,
    justifyContent: 'flex-start',
  },
  knob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
});
