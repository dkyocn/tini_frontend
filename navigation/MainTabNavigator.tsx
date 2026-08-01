import React from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from '../utils/api';
import MainPage, {TabKey} from '../pages/main/MainPage';

type Props = {
  onLogout: () => void;
};

export default function MainTabNavigator({onLogout}: Props) {
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
  // 지금은 두 번째 탭(검색)에서 로그아웃, 가운데 책 탭에서 다이어리 이동(준비중)만 연결.
  const handleTabPress = (key: TabKey) => {
    if (key === 'search') {
      Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
        {text: '취소', style: 'cancel'},
        {text: '확인', onPress: handleLogout},
      ]);
    } else if (key === 'book') {
      // TODO: 작성 중인 다이어리 화면으로 이동
      Alert.alert('다이어리', '작성 중인 다이어리로 이동 (준비 중)');
    }
  };

  return <MainPage onTabPress={handleTabPress} />;
}
