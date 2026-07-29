/**
 * ProfileInfoForm (프로필 정보 입력 폼)
 * Figma node: 1097:14944  —  원본 프레임명: Frame 1948756056
 *
 * 목적: 닉네임 / 생년월일 / 성별 3개 필드. 각 필드는 라벨(+필수/선택) · 값 · 하단 구분선으로 구성.
 * 구분선은 피그마 에셋(라인 이미지)을 참조.
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

// 피그마 에셋 — 7일 후 만료, 로컬 asset으로 교체
import ImgLine269 from '../../../assets/images/tini-ui/d08be608-ed75-45c9-b3b9-2a820cf75439.svg';

type Field = {
  label: string;
  requirement: string;      // "(필수)" | "(선택)"
  requirementRequired: boolean; // true면 olive, false면 회색
  value: string;
  valuePlaceholder?: boolean; // true면 값이 placeholder(회색)
};

const FIELDS: Field[] = [
  { label: '닉네임', requirement: '(필수)', requirementRequired: true, value: 'TINY' },
  { label: '생년월일', requirement: '(필수)', requirementRequired: true, value: '0000.00.00' },
  { label: '성별', requirement: '(선택)', requirementRequired: false, value: '성별을 선택 해주세요.', valuePlaceholder: true },
];

export default function ProfileInfoForm() {
  return (
    <View style={styles.container}>
      {FIELDS.map((f) => (
        <View key={f.label} style={styles.field}>
          <View style={styles.textBlock}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{f.label}</Text>
              <Text style={f.requirementRequired ? styles.reqRequired : styles.reqOptional}>
                {f.requirement}
              </Text>
            </View>
            <Text style={f.valuePlaceholder ? styles.valuePlaceholder : styles.value}>
              {f.value}
            </Text>
          </View>
          <ImgLine269 style={styles.divider} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 24,
    width: '100%',
  },
  field: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
    width: '100%',
  },
  textBlock: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: fonts.inter,
    fontWeight: '500',
    fontSize: 16,
    color: colors.black,
  },
  reqRequired: {
    fontFamily: fonts.inter,
    fontSize: 16,
    color: colors.olive, // #B0CA67
  },
  reqOptional: {
    fontFamily: fonts.inter,
    fontSize: 16,
    color: '#D9D9D9', // newToken
  },
  value: {
    fontFamily: fonts.inter,
    fontSize: 16,
    color: colors.black,
    width: '100%',
  },
  valuePlaceholder: {
    fontFamily: fonts.inter,
    fontSize: 16,
    color: '#757575', // newToken
  },
  divider: {
    width: '100%',
    height: 1,
  },
});
