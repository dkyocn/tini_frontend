/**
 * MyPageSubPage (마이페이지 하위 화면 — 항목 카드 목록형)
 *
 * 로그인 계정 / 기기정보 삭제 / 설정 팝업 / 기본 정보 / 이용 플랜 / 쿠폰 등록처럼
 * "제목 + 흰 카드 항목들" 구조의 화면을 title, items만 바꿔 재사용.
 * (Figma 마이페이지 섹션의 각 하위 프레임)
 */

import React from 'react';
import { Alert } from 'react-native';

import MyPageItemCard from '../../components/tiny-ui/components/MyPageItemCard';
import SubPageLayout from './SubPageLayout';
import type { TabKey } from '../main/MainPage';

type Props = {
  title: string;
  items: string[];
  onBack?: () => void;
  onTabPress?: (key: TabKey) => void;
  onItemPress?: (item: string) => void;
};

export default function MyPageSubPage({ title, items, onBack, onTabPress, onItemPress }: Props) {
  const handlePress = (item: string) => {
    if (onItemPress) {
      onItemPress(item);
      return;
    }
    Alert.alert(item, '아직 준비 중인 화면이에요.');
  };

  return (
    <SubPageLayout title={title} onBack={onBack} onTabPress={onTabPress}>
      {items.map((label) => (
        <MyPageItemCard key={label} label={label} onPress={() => handlePress(label)} />
      ))}
    </SubPageLayout>
  );
}
