/**
 * ThemePage (설정 > 테마)
 *
 * Figma "설정_테마" (node 21:4154). 카드 3개, 모두 화면 이동 없이 이 화면에서 바로 선택:
 *  - 글꼴 설정      : 프리텐다드 3개                               → 글꼴은 따로 하나 선택
 *  - 색상 테마      : 파스텔 컬러 4개 + 오른쪽 색 견본(20px 5칸)  ┐ 둘을 합쳐 하나만 선택.
 *  - 다크/라이트 테마: 다크 테마 / 라이트 테마                     ┘ (색상 테마를 고르면 다크/라이트는 해제, 반대도 동일)
 * 선택 표시는 Figma 6:1075 라디오(선택: 연두 원+흰 점 / 미선택: 회색 원).
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { RadioBullet } from '../../components/tiny-ui/components/MyPageMenuCard';
import useStoredState from '../../utils/useStoredState';
import { colors, fonts } from '../../components/tiny-ui/theme';
import SubPageLayout from './SubPageLayout';
import type { TabKey } from '../main/MainPage';

const PASTEL_SWATCH = ['#36BFFF', '#25EEE7', '#FFF79A', '#E1FFCC', '#FFD9D9'];

/** 색상 테마 / 다크·라이트 테마 중 하나만 선택됨 */
export type Appearance = { kind: 'color'; index: number } | { kind: 'mode'; mode: 'dark' | 'light' };

export type ThemeSettings = {
  /** 글꼴 (행 index) */
  font: number;
  appearance: Appearance;
};

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  font: 0,
  appearance: { kind: 'mode', mode: 'light' },
};

type Row = { label: string; swatch?: string[]; mode?: 'dark' | 'light' };
type Section = {
  title: string;
  height: number;
  rowFontSize: number;
  rows: Row[];
  select: 'font' | 'color' | 'mode';
};

const SECTIONS: Section[] = [
  {
    title: '글꼴 설정',
    height: 250,
    rowFontSize: 14,
    rows: Array.from({ length: 3 }, () => ({ label: '프리텐다드 (Pretendard)' })),
    select: 'font',
  },
  {
    title: '색상 테마',
    height: 280,
    rowFontSize: 16,
    rows: Array.from({ length: 4 }, () => ({ label: '파스텔 컬러', swatch: PASTEL_SWATCH })),
    select: 'color',
  },
  {
    title: '다크/라이트 테마',
    height: 250,
    rowFontSize: 14,
    rows: [
      { label: '다크 테마', mode: 'dark' },
      { label: '라이트 테마', mode: 'light' },
    ],
    select: 'mode',
  },
];

type Props = {
  onBack?: () => void;
  onTabPress?: (key: TabKey) => void;
};

export default function ThemePage({ onBack, onTabPress }: Props) {
  const [theme, updateTheme] = useStoredState('themeSettings', DEFAULT_THEME_SETTINGS);
  const { appearance } = theme;

  const isSelected = (section: Section, row: Row, index: number) => {
    switch (section.select) {
      case 'font':
        return theme.font === index;
      case 'color':
        return appearance.kind === 'color' && appearance.index === index;
      case 'mode':
        return appearance.kind === 'mode' && appearance.mode === row.mode;
    }
  };

  const handleRowPress = (section: Section, row: Row, index: number) => {
    if (section.select === 'font') {
      updateTheme({ font: index });
    } else if (section.select === 'color') {
      updateTheme({ appearance: { kind: 'color', index } });
    } else if (row.mode) {
      updateTheme({ appearance: { kind: 'mode', mode: row.mode } });
    }
  };

  return (
    <SubPageLayout title="테마" onBack={onBack} onTabPress={onTabPress}>
      <View style={styles.sections}>
        {SECTIONS.map((section) => (
          <View key={section.title} style={[styles.card, { minHeight: section.height }]}>
            <View style={styles.headerRow}>
              <View style={styles.iconBox} />
              <Text style={styles.headerText}>{section.title}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.rows}>
              {section.rows.map((row, i) => (
                <TouchableOpacity
                  key={`${row.label}-${i}`}
                  style={styles.row}
                  activeOpacity={0.6}
                  onPress={() => handleRowPress(section, row, i)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected(section, row, i) }}
                >
                  <View style={styles.rowLeft}>
                    <RadioBullet selected={isSelected(section, row, i)} />
                    <Text style={[styles.rowText, { fontSize: section.rowFontSize }]}>
                      {row.label}
                    </Text>
                  </View>
                  {row.swatch && (
                    <View style={styles.swatch}>
                      {row.swatch.map((c) => (
                        <View key={c} style={[styles.swatchCell, { backgroundColor: c }]} />
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    </SubPageLayout>
  );
}

const styles = StyleSheet.create({
  sections: {
    gap: 40,
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 23,
    gap: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 20,
    height: 20,
    backgroundColor: colors.black,
  },
  headerText: {
    fontFamily: fonts.inter,
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.line,
  },
  rows: {
    width: '100%',
    gap: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rowText: {
    fontFamily: fonts.inter,
    color: colors.black,
  },
  swatch: {
    flexDirection: 'row',
  },
  swatchCell: {
    width: 20,
    height: 20,
  },
});
