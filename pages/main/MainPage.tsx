/**
 * MainPage (메인 페이지 · 책장/서재 홈)
 * Figma node: 1:416  —  원본 프레임명: 책장_서재  (file: Untitled / RkeFpjflulGebhaLnQbXWt)
 *
 * 로그인 + 프로필 입력을 마치면 진입하는 홈 화면.
 * 구성:
 *  - 헤더: 오늘 날짜(좌) + 클로버 보유 뱃지(우, CloverCount 재사용)
 *  - 중앙 일러스트: 책장/토끼/라디오/클로버/트로피/연속작성일 카드/펼친 책 (단일 SVG)
 *  - 하단 탭바: 홈 / 검색 / 책장 / 상점 / 프로필 (5개 아이콘)
 *
 * 일러스트 인터랙션 (SVG 위에 투명 터치 영역을 겹쳐 구현):
 *  - 연속 작성일 카드(좌상단) → StreakCalendarCard 팝업
 *  - 트로피(우상단)         → AchievementList 팝업 (업적)
 *  - 초록 책(중앙 좌측)      → BookshelfScreen 팝업 (책장)
 *  - 세잎클로버 티니(우하단) → 오늘의 트래킹 (아직 화면 없음 → onOpenTracking / placeholder)
 *
 * 터치 영역 좌표는 Figma 노드 1:435(Layer_2, 319 x 544) 기준. 화면 폭에 맞춰 scale.
 *
 * 피그마 기준값 (393 x 852 프레임):
 *  - 날짜 텍스트: Inter SemiBold 24, #2C2C2C (좌측 여백 ≈ 20)
 *  - 클로버 뱃지: 73 x 30, radius 50 (CloverCount 컴포넌트)
 *  - 일러스트: 319 x 544 (원본 비율 유지, 화면 폭에 맞춰 축소)
 *  - 탭바: 높이 67, 흰 배경. 아이콘 중앙 x = 58.5 / 124 / 197 / 270 / 336.5
 *
 * 참고:
 *  - 일러스트 안의 "27일"(연속 작성일)은 디자인대로 이미지에 포함(정적). 추후 동적 분리 가능.
 *  - 큰 일러스트는 SVGO로 15MB → 3.2MB(정밀도 1) 최적화한 SVG 사용.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Modal,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgProps } from 'react-native-svg';

import CloverCount from '../../components/common/clover_count';
import StreakCalendarCard from '../../components/tiny-ui/components/StreakCalendarCard';
import AchievementList from '../../components/tiny-ui/components/AchievementList';
import BookshelfScreen from '../../components/tiny-ui/components/BookshelfScreen';
import Illustration from '../../assets/images/main/illust-bookshelf.svg';
import IconHome from '../../assets/images/main/nav-home.svg';
import IconSearch from '../../assets/images/main/nav-search.svg';
import IconBook from '../../assets/images/main/nav-book.svg';
import IconBag from '../../assets/images/main/nav-bag.svg';
import IconUser from '../../assets/images/main/nav-user.svg';

const ILLUST_W = 319;
const ILLUST_H = 544;
const NAV_COLOR = '#2C2C2C';

export type TabKey = 'home' | 'search' | 'book' | 'bag' | 'user';

// 탭바 아이콘 정의 (렌더 크기는 피그마 노드 크기 기준)
const TABS: { key: TabKey; Icon: React.FC<SvgProps>; w: number; h: number }[] = [
  { key: 'home', Icon: IconHome, w: 23, h: 23 },
  { key: 'search', Icon: IconSearch, w: 24, h: 24 },
  { key: 'book', Icon: IconBook, w: 24, h: 20 },
  { key: 'bag', Icon: IconBag, w: 24, h: 24 },
  { key: 'user', Icon: IconUser, w: 23, h: 23 },
];

// 일러스트(319 x 544) 안에서 눌러야 하는 영역. 노드 bbox + 여유 패딩.
type PopupKey = 'streak' | 'achievement' | 'bookshelf';
type Hotspot = {
  key: string;
  x: number;
  y: number;
  w: number;
  h: number;
  popup?: PopupKey; // 있으면 해당 팝업 열기
  soonTitle?: string; // 팝업이 없으면 "준비 중" 안내 (제목)
};
const HOTSPOTS: Hotspot[] = [
  { key: 'streak', popup: 'streak', x: 18, y: 0, w: 132, h: 158 }, // 연속 작성일 카드 (좌상단)
  { key: 'achievement', popup: 'achievement', x: 186, y: 38, w: 112, h: 98 }, // 트로피 (우상단)
  { key: 'bookshelf', popup: 'bookshelf', x: 12, y: 224, w: 88, h: 172 }, // 초록 책 (중앙 좌측)
  { key: 'tracking', soonTitle: '오늘의 트래킹', x: 203, y: 336, w: 102, h: 110 }, // 세잎클로버 티니 (우하단)
  { key: 'rabbit', soonTitle: '토끼 인형', x: 96, y: 214, w: 98, h: 96 }, // 토끼 인형 (중앙)
  { key: 'radio', soonTitle: '라디오', x: 222, y: 150, w: 82, h: 124 }, // 라디오 (우측, 안테나 포함)
  { key: 'book', soonTitle: '펼친 책', x: 60, y: 452, w: 210, h: 92 }, // 하단 펼친 책
];

// 팝업 키 → 렌더할 컴포넌트
const POPUPS: Record<PopupKey, React.ComponentType> = {
  streak: StreakCalendarCard,
  achievement: AchievementList,
  bookshelf: BookshelfScreen,
};

function formatKoreanDate(d: Date): string {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

type Props = {
  /** 보유 클로버 수 (헤더 뱃지) */
  cloverCount?: number;
  /** 탭 아이콘을 눌렀을 때 (네비게이션 연결 지점) */
  onTabPress?: (key: TabKey) => void;
  /** 세잎클로버 티니 → 오늘의 트래킹 (없으면 준비중 안내) */
  onOpenTracking?: () => void;
};

export default function MainPage({ cloverCount = 10, onTabPress, onOpenTracking }: Props) {
  const { width } = useWindowDimensions();
  const [activePopup, setActivePopup] = useState<PopupKey | null>(null);

  // 화면 폭에 맞춰 일러스트 비율 유지 축소 (기준 319 폭)
  const illustWidth = Math.min(ILLUST_W, width - 40);
  const illustHeight = (illustWidth * ILLUST_H) / ILLUST_W;
  const scale = illustWidth / ILLUST_W;

  const handleTab = (key: TabKey) => {
    onTabPress?.(key);
  };

  const handleHotspot = (h: Hotspot) => {
    if (h.popup) {
      setActivePopup(h.popup);
      return;
    }
    if (h.key === 'tracking' && onOpenTracking) {
      onOpenTracking();
      return;
    }
    Alert.alert(h.soonTitle ?? '준비 중', '아직 준비 중인 화면이에요.');
  };

  const PopupComp = activePopup ? POPUPS[activePopup] : null;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {/* 헤더: 날짜 + 클로버 뱃지 */}
      <View style={styles.header}>
        <Text style={styles.dateText}>{formatKoreanDate(new Date())}</Text>
        <CloverCount count={cloverCount} />
      </View>

      {/* 중앙 일러스트 + 터치 영역 */}
      <View style={styles.illustWrap}>
        <View style={{ width: illustWidth, height: illustHeight }}>
          <Illustration width={illustWidth} height={illustHeight} />
          {HOTSPOTS.map((h) => (
            <TouchableOpacity
              key={h.key}
              activeOpacity={0.5}
              onPress={() => handleHotspot(h)}
              style={[
                styles.hotspot,
                {
                  left: h.x * scale,
                  top: h.y * scale,
                  width: h.w * scale,
                  height: h.h * scale,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* 하단 탭바 */}
      <View style={styles.tabBar}>
        {TABS.map(({ key, Icon, w, h }) => (
          <TouchableOpacity
            key={key}
            style={styles.tabItem}
            onPress={() => handleTab(key)}
            activeOpacity={0.6}
          >
            <Icon width={w} height={h} color={NAV_COLOR} />
          </TouchableOpacity>
        ))}
      </View>

      {/* 팝업 (연속 작성일 / 업적 / 책장) */}
      <Modal
        visible={activePopup !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActivePopup(null)}
      >
        <ScrollView
          style={styles.overlay}
          contentContainerStyle={styles.overlayScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* 바깥(빈 공간) 터치 시 닫힘 */}
          <Pressable style={styles.overlayContent} onPress={() => setActivePopup(null)}>
            {/* 팝업 내부 터치는 닫히지 않도록 전파 차단 */}
            <Pressable onPress={() => {}}>{PopupComp ? <PopupComp /> : null}</Pressable>
          </Pressable>
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  illustWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotspot: {
    position: 'absolute',
    // backgroundColor: 'rgba(255,0,0,0.25)', // 터치 영역 디버그용 (필요시 주석 해제)
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayScroll: {
    flexGrow: 1,
  },
  overlayContent: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
});
