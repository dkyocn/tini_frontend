import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from '../utils/api';
import MainPage, {TabKey} from '../pages/main/MainPage';
import MyPage from '../pages/main/MyPage';
import AccountLinkPage from '../pages/main/AccountLinkPage';

type Props = {
  onLogout: () => void;
};

export default function MainTabNavigator({onLogout}: Props) {
  const [screen, setScreen] = useState<'main' | 'myPage' | 'accountLink'>('main');

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

  const confirmLogout = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {text: '확인', onPress: handleLogout},
    ]);
  };

  // TODO: 각 탭 화면이 준비되면 실제 네비게이션으로 연결.
  // 아직 실제 화면이 없는 탭(검색/책)은 현재 화면을 유지한 채 안내만 띄움.
  // 로그아웃은 마이페이지 > 계정관리 > 로그아웃에서 처리.
  const handleTabPress = (key: TabKey) => {
    if (key === 'user') {
      setScreen('myPage');
      return;
    }
    if (key === 'home') {
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
    if (section === '계정관리' && item === '로그아웃') {
      confirmLogout();
      return;
    }
    if (section === '계정관리' && item === '로그인 계정') {
      setScreen('accountLink');
      return;
    }
    Alert.alert(item, '아직 준비 중인 화면이에요.');
  };

  const handleAccountLinkItemPress = (item: string) => {
    Alert.alert(item, '아직 준비 중인 화면이에요.');
  };

  // 화면 전환 시 무거운 일러스트를 매번 재마운트하지 않도록,
  // 화면들을 계속 마운트해두고 display로만 보이는 화면을 바꿈.
  return (
    <View style={{flex: 1}}>
      <View style={screen === 'main' ? {flex: 1} : styles.hidden}>
        <MainPage onTabPress={handleTabPress} />
      </View>
      <View style={screen === 'myPage' ? {flex: 1} : styles.hidden}>
        <MyPage onTabPress={handleTabPress} onMenuItemPress={handleMenuItemPress} />
      </View>
      <View style={screen === 'accountLink' ? {flex: 1} : styles.hidden}>
        <AccountLinkPage onTabPress={handleTabPress} onItemPress={handleAccountLinkItemPress} />
      </View>
    </View>
  );
}

const styles = {
  hidden: {display: 'none' as const},
};
