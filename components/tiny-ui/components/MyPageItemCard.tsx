/**
 * MyPageItemCard (마이페이지 하위 화면의 단일 항목 카드)
 * Figma: 마이페이지_수정 섹션 > 로그인 계정 / 기기정보 삭제 / 알림 설정 / 프로필 / 설정 팝업 등의 흰 카드
 *
 * 353 x 60, radius 20, 좌측 불릿(16) + 14px 텍스트. 탭하면 onPress.
 *  - trailing    : 오른쪽 영역 (값 텍스트, 토글, "선택 중" 등)
 *  - inactive    : 불릿을 회색으로 (선택되지 않은 옵션)
 *  - hideBullet  : 불릿 대신 leading(로고 등)을 그릴 때
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, fonts } from '../theme';
import { MenuBullet } from './MyPageMenuCard';

type Props = {
  label: string;
  onPress?: () => void;
  inactive?: boolean;
  leading?: React.ReactNode;
  /** label 아래 보조 텍스트 (예: "2024.12.25 연동") */
  subLabel?: string;
  trailing?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function MyPageItemCard({
  label,
  onPress,
  inactive = false,
  leading,
  subLabel,
  trailing,
  style,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, subLabel ? styles.cardTall : null, style]}
      activeOpacity={onPress ? 0.6 : 1}
      disabled={!onPress}
      onPress={onPress}
    >
      <View style={[styles.left, subLabel ? styles.leftTop : null]}>
        {leading ?? <MenuBullet inactive={inactive} />}
        <View style={styles.labelBlock}>
          <Text style={[styles.label, leading ? styles.labelMedium : null]}>{label}</Text>
          {subLabel ? <Text style={styles.subLabel}>{subLabel}</Text> : null}
        </View>
      </View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </TouchableOpacity>
  );
}

/** 오른쪽 회색 굵은 값 텍스트 (프로필 값, 리마인드 시간 등) */
export function ItemValueText({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <Text style={[styles.value, dark && styles.valueDark]}>{children}</Text>;
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 20,
  },
  cardTall: {
    height: 90,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexShrink: 1,
  },
  leftTop: {
    alignItems: 'flex-start',
  },
  labelBlock: {
    gap: 8,
  },
  label: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
  },
  labelMedium: {
    fontWeight: '500',
  },
  subLabel: {
    fontFamily: fonts.inter,
    fontSize: 14,
    fontWeight: '500',
    color: colors.tagGray,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginLeft: 12,
  },
  value: {
    fontFamily: fonts.inter,
    fontSize: 14,
    fontWeight: '700',
    color: '#A1A1A1',
    textAlign: 'right',
  },
  valueDark: {
    color: colors.black,
  },
});
