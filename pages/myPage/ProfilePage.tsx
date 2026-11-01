/**
 * ProfilePage (마이페이지 > 프로필)
 *
 * Figma "프로필_기본정보" (node 35:1415). 마이페이지 상단 프로필 카드를 누르면 진입.
 * 닉네임 / 이메일 / 생년월일 / 성별 — 오른쪽에 회색 굵은 값.
 */

import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MyPageItemCard, {
  ItemValueText,
} from '../../components/tiny-ui/components/MyPageItemCard';
import SubPageLayout from './SubPageLayout';
import type { TabKey } from '../main/MainPage';

const GENDER_LABELS: Record<string, string> = {
  FEMALE: '여',
  MALE: '남',
  NONBINARY: '해당사항없음',
};

type Props = {
  onBack?: () => void;
  onTabPress?: (key: TabKey) => void;
};

export default function ProfilePage({ onBack, onTabPress }: Props) {
  const [profile, setProfile] = useState({ nickname: '', email: '', birthDate: '', gender: '' });

  useEffect(() => {
    const load = async () => {
      const [nick, id, birth, gender] = await Promise.all([
        AsyncStorage.getItem('userNick'),
        AsyncStorage.getItem('userId'),
        AsyncStorage.getItem('userBirthDate'),
        AsyncStorage.getItem('userGender'),
      ]);
      setProfile({
        nickname: nick ?? '',
        email: id ?? '',
        birthDate: birth ?? '',
        gender: gender ? GENDER_LABELS[gender] ?? '' : '',
      });
    };
    load();
  }, []);

  const rows = [
    { label: '닉네임', value: profile.nickname },
    { label: '이메일', value: profile.email },
    { label: '생년월일', value: profile.birthDate },
    { label: '성별', value: profile.gender },
  ];

  return (
    <SubPageLayout title="프로필" onBack={onBack} onTabPress={onTabPress}>
      {rows.map(({ label, value }) => (
        <MyPageItemCard
          key={label}
          label={label}
          trailing={<ItemValueText>{value || '-'}</ItemValueText>}
        />
      ))}
    </SubPageLayout>
  );
}
