/**
 * LoginAccountPage (마이페이지 > 계정관리 > 로그인 계정)
 *
 * Figma "계정관리_로그인계정" (node 35:1022) + "계정 연동 해제" 팝업 (35:963).
 * Apple / Google / 카카오톡 — 연동된 계정은 연동일(회색)과 주황 "연동해제" 버튼,
 * 아닌 계정은 검정 테두리 "연동하기" 버튼.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MyPageItemCard from '../../components/tiny-ui/components/MyPageItemCard';
import { useConfirm } from '../../components/tiny-ui/components/ConfirmProvider';
import { colors, fonts } from '../../components/tiny-ui/theme';
import SubPageLayout from './SubPageLayout';
import type { TabKey } from '../main/MainPage';

type Provider = 'apple' | 'google' | 'kakao';

const UNLINK_COLOR = '#FA855A';

function AppleLogo() {
  return <Image source={require('../../assets/images/mypage/logo-apple.png')} style={styles.apple} />;
}

// Figma에서 원본 이미지를 18x20 프레임에 잘라 씀 (h 151.52%, w 167.55%, left -34.04%, top -25.76%)
function GoogleLogo() {
  return (
    <View style={styles.googleFrame}>
      <Image source={require('../../assets/images/mypage/logo-google.png')} style={styles.googleImage} />
    </View>
  );
}

function KakaoLogo() {
  return <Image source={require('../../assets/images/mypage/logo-kakao.png')} style={styles.kakao} />;
}

const PROVIDERS: { key: Provider; label: string; Logo: React.FC }[] = [
  { key: 'apple', label: 'Apple', Logo: AppleLogo },
  { key: 'google', label: 'Google', Logo: GoogleLogo },
  { key: 'kakao', label: '카카오톡', Logo: KakaoLogo },
];

type Props = {
  onBack?: () => void;
  onTabPress?: (key: TabKey) => void;
};

export default function LoginAccountPage({ onBack, onTabPress }: Props) {
  const [linked, setLinked] = useState<Partial<Record<Provider, string>>>({});
  const confirm = useConfirm();

  useEffect(() => {
    AsyncStorage.getItem('loginProvider').then((provider) => {
      if (provider === 'google' || provider === 'kakao' || provider === 'apple') {
        // TODO: 서버에서 연동일을 내려주면 표시 (현재는 연동 여부만 표시)
        setLinked({ [provider]: '' });
      }
    });
  }, []);

  const linkedCount = Object.keys(linked).length;

  const handleLink = (provider: Provider) => {
    // TODO: 소셜 계정 추가 연동 API 연결
    confirm({
      title: '계정 연동',
      message: `${PROVIDERS.find((p) => p.key === provider)?.label} 연동은 아직 준비 중이에요.`,
      showCancel: false,
    });
  };

  const handleUnlinkPress = async (provider: Provider) => {
    if (linkedCount <= 1) {
      confirm({
        title: '계정 연동 해제',
        message: '로그인할 수 있는 계정이\n최소 1개는 있어야 해요.',
        showCancel: false,
      });
      return;
    }
    const ok = await confirm({
      title: '계정 연동 해제',
      message:
        '계정 연동을 해제하면, 해당 로그인 방식으로 더 이상 로그인을 할 수 없습니다.\n정말 해제하시겠습니까?',
      confirmLabel: '해제 하기',
    });
    if (!ok) return;
    // TODO: 계정 연동 해제 API 연결
    setLinked((prev) => {
      const next = { ...prev };
      delete next[provider];
      return next;
    });
  };

  return (
    <SubPageLayout title="로그인 계정" onBack={onBack} onTabPress={onTabPress}>
      {PROVIDERS.map(({ key, label, Logo }) => {
        const isLinked = key in linked;
        const linkedAt = linked[key];
        return (
          <MyPageItemCard
            key={key}
            label={label}
            leading={
              <View style={styles.logoBox}>
                <Logo />
              </View>
            }
            subLabel={isLinked && linkedAt ? `${linkedAt} 연동` : undefined}
            trailing={
              <TouchableOpacity
                style={[styles.linkButton, isLinked && styles.unlinkButton]}
                activeOpacity={0.6}
                onPress={() => (isLinked ? handleUnlinkPress(key) : handleLink(key))}
              >
                <Text style={[styles.linkText, isLinked && styles.unlinkText]}>
                  {isLinked ? '연동해제' : '연동하기'}
                </Text>
              </TouchableOpacity>
            }
          />
        );
      })}
    </SubPageLayout>
  );
}

const styles = StyleSheet.create({
  logoBox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  apple: {
    width: 15,
    height: 20,
    resizeMode: 'cover',
  },
  googleFrame: {
    width: 18,
    height: 20,
    overflow: 'hidden',
  },
  googleImage: {
    position: 'absolute',
    width: 18 * 1.6755,
    height: 20 * 1.5152,
    left: -18 * 0.3404,
    top: -20 * 0.2576,
  },
  kakao: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  linkButton: {
    width: 80,
    height: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.black,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlinkButton: {
    borderColor: UNLINK_COLOR,
  },
  linkText: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
  },
  unlinkText: {
    color: UNLINK_COLOR,
  },
});
