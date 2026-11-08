/**
 * TermsDetailPage (마이페이지 > 앱 정보 > 상세 약관)
 *
 * Figma "앱 정보?" 섹션 > 상세 약관 (node 35:1523).
 * 조항 제목(16, semibold) + 본문(14, #A1A1A1, 줄간격 1.6). 스크롤, 하단 "확인" 버튼(연두, radius 30).
 * TODO: 확정된 약관 문구로 교체 (현재 Figma 시안 문구)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { colors, fonts } from '../../components/tiny-ui/theme';
import SubPageLayout from './SubPageLayout';
import type { TabKey } from '../main/MainPage';

type Clause = { title: string; body: string[] };

const CLAUSES: Clause[] = [
  {
    title: '1 조 (목적)',
    body: [
      "본 약관은 회사가 제공하는 저널링 서비스(이하 '서비스')의 이벤트, 프로모션, 신규 기능 업데이트 등 유용한 정보를 사용자에게 제공하기 위해 마케팅 정보를 수신하고 활용하는 것에 동의하는 내용에 대해 규정합니다.",
    ],
  },
  {
    title: '제 2 조 (수집 및 활용 항목)',
    body: [
      '1.  수집 항목',
      '     닉네임, 이메일 주소, 서비스 이용 내역, 기기 식별자',
      '2.  활용 목적',
      '•   신규 기능 및 서비스 업데이트 안내',
      '•   구독 할인, 이벤트 및 프로모션 정보 제공',
      '•   서비스 이용 내역을 기반으로 한 맞춤형 저널링 콘텐츠 추천',
    ],
  },
  {
    title: '제3조 (보유 및 이용 기간)',
    body: [
      '마케팅 정보 수신 동의일로부터 회원 탈퇴 또는 수신 동의 철회 시까지 해당 정보를 보유 및 이용합니다.',
    ],
  },
  {
    title: '제4조 (동의 거부 권리 및 불이익 안내)',
    body: [
      '사용자는 마케팅 정보 수신 동의를 거부할 권리가 있습니다. 동의를 거부하더라도 기본 서비스(일기 작성, 조회, 편집 등) 이용에는 아무런 제한이 없습니다. 다만, 이벤트 참여 기회 및 할인 혜택 안내가 제한될 수 있습니다.',
    ],
  },
];

type Props = {
  title?: string;
  onBack?: () => void;
  onTabPress?: (key: TabKey) => void;
};

export default function TermsDetailPage({ title = '상세 약관', onBack, onTabPress }: Props) {
  return (
    <SubPageLayout
      title={title}
      onBack={onBack}
      onTabPress={onTabPress}
      footer={
        <TouchableOpacity style={styles.confirm} activeOpacity={0.8} onPress={onBack}>
          <Text style={styles.confirmText}>확인</Text>
        </TouchableOpacity>
      }
    >
      <View style={styles.clauses}>
        {CLAUSES.map((clause) => (
          <View key={clause.title} style={styles.clause}>
            <Text style={styles.clauseTitle}>{clause.title}</Text>
            <View>
              {clause.body.map((line, i) => (
                <Text key={i} style={styles.clauseBody}>
                  {line}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>
    </SubPageLayout>
  );
}

const styles = StyleSheet.create({
  clauses: {
    paddingHorizontal: 16,
    gap: 20,
  },
  clause: {
    gap: 12,
  },
  clauseTitle: {
    fontFamily: fonts.inter,
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  clauseBody: {
    fontFamily: fonts.inter,
    fontSize: 14,
    lineHeight: 22.4,
    color: '#A1A1A1',
  },
  confirm: {
    height: 50,
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
