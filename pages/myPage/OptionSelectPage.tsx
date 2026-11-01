/**
 * OptionSelectPage (하나를 고르는 마이페이지 하위 화면)
 *
 * Figma "템플릿설정_설정 팝업" — 일주일 시작일(35:1335) / 시간 표기 / 월 표시 / 요일 표시.
 * 선택된 항목: 연두 불릿 + 오른쪽 "선택 중"(#A8CA55) / 나머지: 회색 불릿.
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';

import MyPageItemCard from '../../components/tiny-ui/components/MyPageItemCard';
import { fonts } from '../../components/tiny-ui/theme';
import SubPageLayout from './SubPageLayout';
import type { TabKey } from '../main/MainPage';

type Props = {
  title: string;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  onBack?: () => void;
  onTabPress?: (key: TabKey) => void;
};

export default function OptionSelectPage({
  title,
  options,
  selected,
  onSelect,
  onBack,
  onTabPress,
}: Props) {
  return (
    <SubPageLayout title={title} onBack={onBack} onTabPress={onTabPress}>
      {options.map((option) => {
        const isSelected = option === selected;
        return (
          <MyPageItemCard
            key={option}
            label={option}
            inactive={!isSelected}
            onPress={() => onSelect(option)}
            trailing={isSelected ? <Text style={styles.selected}>선택 중</Text> : undefined}
          />
        );
      })}
    </SubPageLayout>
  );
}

const styles = StyleSheet.create({
  selected: {
    marginRight: 15,
    fontFamily: fonts.inter,
    fontSize: 14,
    color: '#A8CA55',
  },
});
