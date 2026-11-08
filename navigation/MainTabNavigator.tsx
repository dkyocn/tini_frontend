import React, {useEffect, useState} from 'react';
import {Alert, BackHandler, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from '../utils/api';
import useStoredState from '../utils/useStoredState';
import {useConfirm} from '../components/tiny-ui/components/ConfirmProvider';
import MainPage, {TabKey} from '../pages/main/MainPage';
import MyPage from '../pages/myPage/MyPage';
import MyPageSubPage from '../pages/myPage/MyPageSubPage';
import ThemePage from '../pages/myPage/ThemePage';
import ProfilePage from '../pages/myPage/ProfilePage';
import LoginAccountPage from '../pages/myPage/LoginAccountPage';
import ConfirmActionPage, {ConfirmAction} from '../pages/myPage/ConfirmActionPage';
import NotificationSettingsPage from '../pages/myPage/NotificationSettingsPage';
import TemplateSettingsPage, {
  DEFAULT_TEMPLATE_SETTINGS,
  TEMPLATE_OPTIONS,
  TemplateOptionKey,
} from '../pages/myPage/TemplateSettingsPage';
import OptionSelectPage from '../pages/myPage/OptionSelectPage';
import TermsDetailPage from '../pages/myPage/TermsDetailPage';
import VersionInfoPage from '../pages/myPage/VersionInfoPage';

// 마이페이지 하위 화면 (Figma "마이페이지_수정" 섹션). 스택으로 쌓고 뒤로가기로 하나씩 뺌.
type Route =
  | {name: 'profile'}
  | {name: 'loginAccount'}
  | {name: 'deviceData'}
  | {name: 'logout'}
  | {name: 'notification'}
  | {name: 'theme'}
  | {name: 'template'}
  | {name: 'templateOption'; key: TemplateOptionKey}
  | {name: 'termsDetail'; title: string}
  | {name: 'versionInfo'}
  | {name: 'list'; title: string; items: string[]};

// 메뉴 항목 → 화면. 키: "섹션/항목"
// 여기에 없는 항목(시스템 설정, FAQ …)은 아직 Figma 화면이 없어 준비 중 안내만 띄움.
const MENU_ROUTES: Record<string, Route> = {
  '계정관리/로그인 계정': {name: 'loginAccount'},
  '계정관리/기기정보 삭제': {name: 'deviceData'},
  '계정관리/로그아웃': {name: 'logout'},
  '계정관리/알림 설정': {name: 'notification'},
  '설정/테마': {name: 'theme'},
  '설정/템플릿 설정(시간 설정)': {name: 'template'},
  '앱 정보/상세 약관': {name: 'termsDetail', title: '상세 약관'},
  '앱 정보/버전정보': {name: 'versionInfo'},
  '구독/이용 플랜': {name: 'list', title: '이용 플랜', items: ['플랜 갱신일']},
  '구독/쿠폰 등록': {name: 'list', title: '쿠폰 등록', items: ['선물권 등록']},
};

type Props = {
  onLogout: () => void;
};

export default function MainTabNavigator({onLogout}: Props) {
  const [screen, setScreen] = useState<'main' | 'myPage'>('main');
  const [stack, setStack] = useState<Route[]>([]);
  const confirm = useConfirm();
  const showNotReady = (title: string) =>
    confirm({title, message: '아직 준비 중인 화면이에요.', showCancel: false});
  const [templateSettings, updateTemplateSettings] = useStoredState(
    'templateSettings',
    DEFAULT_TEMPLATE_SETTINGS,
  );

  const push = (route: Route) => setStack(prev => [...prev, route]);
  const pop = () => setStack(prev => prev.slice(0, -1));

  // 안드로이드 하드웨어 뒤로가기: 하위 화면 → 마이페이지 → 메인 순으로 돌아감
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length > 0) {
        pop();
        return true;
      }
      if (screen === 'myPage') {
        setScreen('main');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [stack.length, screen]);

  const handleLogout = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      await axios.post(`${API_BASE_URL}/logout`, null, {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
    } finally {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      onLogout();
    }
  };

  // TODO: 각 탭 화면이 준비되면 실제 네비게이션으로 연결.
  // 아직 실제 화면이 없는 탭(검색/책)은 현재 화면을 유지한 채 안내만 띄움.
  const handleTabPress = (key: TabKey) => {
    if (key === 'user') {
      setStack([]);
      setScreen('myPage');
      return;
    }
    if (key === 'home') {
      setStack([]);
      setScreen('main');
      return;
    }

    if (key === 'search') {
      Alert.alert('알림', '아직 준비중인 화면입니다');
    } else if (key === 'book') {
      // TODO: 작성 중인 다이어리 화면으로 이동
      Alert.alert('다이어리', '작성 중인 다이어리로 이동 (준비 중)');
    }
  };

  const handleMenuItemPress = (section: string, item: string) => {
    const route = MENU_ROUTES[`${section}/${item}`];
    if (route) {
      push(route);
      return;
    }
    showNotReady(item);
  };

  // TODO: 앱 초기화 / 다이어리 전체 삭제 / 계정 탈퇴 API가 생기면 연결
  const deviceDataActions: ConfirmAction[] = [
    {
      label: '앱 초기화',
      confirm: {
        title: '앱 초기화',
        message:
          '설정을 제외한 모든 다이어리 및 데이터,\n개인 설정, 앱 데이터가 초기 상태로 돌아갑니다.\n정말 초기화하시겠습니까?',
        confirmLabel: '초기화',
      },
      onConfirm: () => showNotReady('앱 초기화'),
    },
    {
      label: '다이어리 전체 삭제',
      confirm: {
        title: '다이어리 전체 삭제',
        message: '모든 다이어리 데이터가 삭제되며,\n복구할 수 없습니다.\n정말 삭제하시겠습니까?',
        confirmLabel: '전체 삭제',
      },
      onConfirm: () => showNotReady('다이어리 전체 삭제'),
    },
  ];

  // Figma 로그아웃 화면엔 "계정 탈퇴"만 있어서, 실제 로그아웃 항목을 위에 추가함
  const logoutActions: ConfirmAction[] = [
    {
      label: '로그아웃',
      confirm: {
        title: '로그아웃',
        message: '로그아웃 하시겠습니까?',
        confirmLabel: '로그아웃',
      },
      onConfirm: handleLogout,
    },
    {
      label: '계정 탈퇴',
      confirm: {
        title: '계정 탈퇴',
        message: '계정을 탈퇴하면 모든 데이터가 삭제되며,\n복구할 수 없습니다.\n정말 탈퇴하시겠습니까?',
        confirmLabel: '계정 탈퇴',
      },
      onConfirm: () => showNotReady('계정 탈퇴'),
    },
  ];

  const renderRoute = (route: Route) => {
    const common = {onBack: pop, onTabPress: handleTabPress};
    switch (route.name) {
      case 'profile':
        return <ProfilePage {...common} />;
      case 'loginAccount':
        return <LoginAccountPage {...common} />;
      case 'deviceData':
        return <ConfirmActionPage title="기기정보 삭제" actions={deviceDataActions} {...common} />;
      case 'logout':
        return <ConfirmActionPage title="로그아웃" actions={logoutActions} {...common} />;
      case 'notification':
        return (
          <NotificationSettingsPage
            onOpenMarketingTerms={() =>
              push({name: 'termsDetail', title: '마케팅 정보 활용 동의'})
            }
            {...common}
          />
        );
      case 'theme':
        return <ThemePage {...common} />;
      case 'template':
        return (
          <TemplateSettingsPage
            settings={templateSettings}
            onChange={updateTemplateSettings}
            onOpenOption={key => push({name: 'templateOption', key})}
            {...common}
          />
        );
      case 'templateOption': {
        const {title, options} = TEMPLATE_OPTIONS[route.key];
        return (
          <OptionSelectPage
            title={title}
            options={options}
            selected={templateSettings[route.key]}
            onSelect={option => updateTemplateSettings({[route.key]: option})}
            {...common}
          />
        );
      }
      case 'termsDetail':
        return <TermsDetailPage title={route.title} {...common} />;
      case 'versionInfo':
        return <VersionInfoPage {...common} />;
      case 'list':
        return (
          <MyPageSubPage
            title={route.title}
            items={route.items}
            onItemPress={showNotReady}
            {...common}
          />
        );
    }
  };

  const top = stack[stack.length - 1];

  // 화면 전환 시 무거운 일러스트를 매번 재마운트하지 않도록,
  // 메인/마이페이지는 계속 마운트해두고 display로만 보이는 화면을 바꿈.
  return (
    <View style={{flex: 1}}>
      <View style={screen === 'main' ? {flex: 1} : styles.hidden}>
        <MainPage onTabPress={handleTabPress} />
      </View>
      <View style={screen === 'myPage' && !top ? {flex: 1} : styles.hidden}>
        <MyPage
          onTabPress={handleTabPress}
          onProfilePress={() => push({name: 'profile'})}
          onMenuItemPress={handleMenuItemPress}
        />
      </View>
      {screen === 'myPage' && top && <View style={{flex: 1}}>{renderRoute(top)}</View>}
    </View>
  );
}

const styles = {
  hidden: {display: 'none' as const},
};
