/**
 * MyPage (마이페이지)
 *
 * 네비게이션 바의 프로필(user) 탭에서 진입하는 화면.
 * 구성:
 *  - 헤더: 오늘 날짜(좌) + 클로버 보유 뱃지(우)
 *  - 타이틀 바: 메뉴 아이콘 + "마이페이지"(24) + 검색 아이콘
 *  - 프로필 카드: 프로필 사진(없으면 기본 티니 로고) + 닉네임 + 아이디
 *  - 메뉴 카드 5개: 프로필 / 계정관리 / 설정 / 도움말 / 구독
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
};

const SECTIONS: Section[] = [
  { title: '프로필', items: ['기본 정보', '성별', '아이디'] },
  {
    title: '계정관리',
    items: ['로그인 계정', '기기정보 삭제', '로그아웃', '알림 설정', '마케팅 정보 활용 동의'],
  },
  { title: '설정', items: ['테마', '템플릿 설정(시간 설정)', '시스템 설정', '언어', '앱 아이콘'] },
  { title: '도움말', items: ['FAQ', '공지사항', '문의', '라이센스'] },
  { title: '구독', items: ['이용 플랜', '쿠폰 등록', '무료 체험 광고'] },
];

type Props = {
  cloverCount?: number;
  nickname?: string;
  userId?: string;
  profileImageUri?: string | null;
  onTabPress?: (key: TabKey) => void;
  onMenuItemPress?: (section: string, item: string) => void;
};

export default function MyPage({
  cloverCount = 10,
  nickname,
  userId,
  profileImageUri = null,
  onTabPress,
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
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            {profileImageUri ? (
              <Image source={{ uri: profileImageUri }} style={styles.avatarImage} />
            ) : (
              <TiniLogo width={44} height={44} />
            )}
          </View>
          <View style={styles.profileTextBlock}>
            <Text style={styles.nickname}>{displayNickname}</Text>
            <Text style={styles.userId}>{displayUserId}</Text>
          </View>
        </View>

        {/* 메뉴 카드들 */}
        {SECTIONS.map((section) => (
          <MyPageMenuCard
            key={section.title}
            title={section.title}
            items={buildItems(section)}
          />
        ))}
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
    fontWeight: '600',
    color: '#000000',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 36,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 64,
    height: 64,
  },
  profileTextBlock: {
    gap: 4,
  },
  nickname: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  userId: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#757575',
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
