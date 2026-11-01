/**
 * MyPage (마이페이지)
 *
 * 네비게이션 바의 프로필(user) 탭에서 진입하는 화면.
 * 구성:
 *  - 헤더: 오늘 날짜(좌) + 클로버 보유 뱃지(우)
 *  - 타이틀 바: 메뉴 아이콘 + "마이페이지"(24) + 검색 아이콘
 *  - 프로필 카드: 프로필 사진(없으면 기본 티니 로고) + 닉네임(40) + 아이디/이메일(16)
 *    (탭하면 프로필 화면으로 이동)
 *  - 메뉴 카드 5개: 계정관리 / 설정 / 도움말 / 앱 정보 / 구독  (Figma "마이페이지_수정" 35:428)
 *    (섹션 헤더는 클릭 불가, 하위 항목만 클릭 시 다른 페이지로 이동)
 *  - 하단 탭바 (메인 화면과 동일)
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgProps } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CloverCount from '../../components/common/clover_count';
import MyPageMenuCard, {
  MenuItem,
} from '../../components/tiny-ui/components/MyPageMenuCard';
import TiniLogo from '../../assets/images/tini.svg';
import IconHome from '../../assets/images/main/nav-home.svg';
import IconSearch from '../../assets/images/main/nav-search.svg';
import IconBook from '../../assets/images/main/nav-book.svg';
import IconBag from '../../assets/images/main/nav-bag.svg';
import IconUser from '../../assets/images/main/nav-user.svg';

const NAV_COLOR = '#2C2C2C';

export type TabKey = 'home' | 'search' | 'book' | 'bag' | 'user';

const TABS: { key: TabKey; Icon: React.FC<SvgProps>; w: number; h: number }[] = [
  { key: 'home', Icon: IconHome, w: 23, h: 23 },
  { key: 'search', Icon: IconSearch, w: 24, h: 24 },
  { key: 'book', Icon: IconBook, w: 24, h: 20 },
  { key: 'bag', Icon: IconBag, w: 24, h: 24 },
  { key: 'user', Icon: IconUser, w: 23, h: 23 },
];

function formatKoreanDate(d: Date): string {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

type Section = {
  title: string;
  items: string[];
  /** Figma 카드 높이 (섹션마다 고정) */
  height: number;
};

const SECTIONS: Section[] = [
  {
    title: '계정관리',
    items: ['로그인 계정', '기기정보 삭제', '로그아웃', '알림 설정', '마케팅 정보 활용 동의'],
    height: 320,
  },
  {
    title: '설정',
    items: ['테마', '템플릿 설정(시간 설정)', '시스템 설정', '언어', '앱 아이콘'],
    height: 320,
  },
  { title: '도움말', items: ['FAQ', '공지사항', '문의'], height: 250 },
  { title: '앱 정보', items: ['상세 약관', '라이센스', '개인정보 처리 방침'], height: 250 },
  { title: '구독', items: ['이용 플랜', '쿠폰 등록', '무료 체험 광고'], height: 250 },
];

type Props = {
  cloverCount?: number;
  nickname?: string;
  userId?: string;
  profileImageUri?: string | null;
  onTabPress?: (key: TabKey) => void;
  onProfilePress?: () => void;
  onMenuItemPress?: (section: string, item: string) => void;
};

export default function MyPage({
  cloverCount = 10,
  nickname,
  userId,
  profileImageUri = null,
  onTabPress,
  onProfilePress,
  onMenuItemPress,
}: Props) {
  const [storedNickname, setStoredNickname] = useState('티니');
  const [storedUserId, setStoredUserId] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const [savedNick, savedId] = await Promise.all([
        AsyncStorage.getItem('userNick'),
        AsyncStorage.getItem('userId'),
      ]);
      if (savedNick) setStoredNickname(savedNick);
      if (savedId) setStoredUserId(savedId);
    };
    loadUser();
  }, []);

  const displayNickname = nickname ?? storedNickname;
  const displayUserId = userId ?? storedUserId;

  const handleMenuItemPress = (section: string, item: string) => {
    if (onMenuItemPress) {
      onMenuItemPress(section, item);
      return;
    }
    Alert.alert(item, '아직 준비 중인 화면이에요.');
  };

  const buildItems = (section: Section): MenuItem[] =>
    section.items.map((label) => ({
      label,
      onPress: () => handleMenuItemPress(section.title, label),
    }));

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {/* 헤더: 날짜 + 클로버 뱃지 */}
      <View style={styles.header}>
        <Text style={styles.dateText}>{formatKoreanDate(new Date())}</Text>
        <CloverCount count={cloverCount} />
      </View>

      {/* 타이틀 바 */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>마이페이지</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 카드 */}
        <TouchableOpacity
          style={styles.profileCard}
          activeOpacity={onProfilePress ? 0.7 : 1}
          disabled={!onProfilePress}
          onPress={onProfilePress}
        >
          <View style={styles.avatar}>
            {profileImageUri ? (
              <Image source={{ uri: profileImageUri }} style={styles.avatarImage} />
            ) : (
              <TiniLogo width={55} height={55} />
            )}
          </View>
          <View style={styles.profileTextBlock}>
            <Text style={styles.nickname}>{displayNickname}</Text>
            <Text style={styles.userId}>{displayUserId}</Text>
          </View>
        </TouchableOpacity>

        {/* 메뉴 카드들 */}
        {SECTIONS.map((section) => (
          <MyPageMenuCard
            key={section.title}
            title={section.title}
            items={buildItems(section)}
            minHeight={section.height}
          />
        ))}

        <Text style={styles.version}>ver 2.0</Text>
      </ScrollView>

      {/* 하단 탭바 */}
      <View style={styles.tabBar}>
        {TABS.map(({ key, Icon, w, h }) => (
          <TouchableOpacity
            key={key}
            style={styles.tabItem}
            onPress={() => onTabPress?.(key)}
            activeOpacity={0.6}
          >
            <Icon width={w} height={h} color={NAV_COLOR} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F6F6F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  dateText: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '600',
    color: '#2C2C2C',
    letterSpacing: -0.5,
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  titleText: {
    fontFamily: 'Inter',
    fontSize: 24,
    color: '#000000',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
    gap: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 120,
    paddingHorizontal: 23,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 75,
    height: 75,
  },
  // 이름은 위, 이메일은 아래에 붙도록 아바타 높이(75)에 맞춰 양끝 정렬
  profileTextBlock: {
    height: 75,
    justifyContent: 'space-between',
  },
  nickname: {
    fontFamily: 'Inter',
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '700',
    color: '#000000',
  },
  userId: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#000000',
  },
  version: {
    alignSelf: 'center',
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#000000',
  },
  tabBar: {
    height: 67,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
