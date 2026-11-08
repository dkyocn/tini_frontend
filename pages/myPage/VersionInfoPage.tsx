/**
 * VersionInfoPage (마이페이지 > 앱 정보 > 버전정보)
 *
 * 카카오톡 "앱 관리" 화면의 "버전정보" 섹션 구성 참고: 앱 아이콘 + 앱 이름 + 버전.
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';

import MyPageItemCard from '../../components/tiny-ui/components/MyPageItemCard';
import { colors, fonts } from '../../components/tiny-ui/theme';
import TiniLogo from '../../assets/images/tini.svg';
import SubPageLayout from './SubPageLayout';
import type { TabKey } from '../main/MainPage';

const APP_VERSION = 'ver 2.0';

type Props = {
  onBack?: () => void;
  onTabPress?: (key: TabKey) => void;
};

export default function VersionInfoPage({ onBack, onTabPress }: Props) {
  return (
    <SubPageLayout title="버전정보" onBack={onBack} onTabPress={onTabPress}>
      <Text style={styles.sectionLabel}>버전정보</Text>
      <MyPageItemCard
        label="TINI"
        subLabel={APP_VERSION}
        leading={<TiniLogo width={20} height={20} />}
      />
    </SubPageLayout>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontFamily: fonts.inter,
    fontSize: 14,
    fontWeight: '600',
    color: colors.placeholderText,
  },
});
