import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthStack from './navigation/AuthStack';
import MainTabNavigator from './navigation/MainTabNavigator';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        // 더 엄격하게 하려면 refreshToken도 확인하거나, 토큰 유효성 검사 API 호출 가능
        setIsLoggedIn(!!accessToken);
      } catch (e) {
        console.error('로그인 상태 확인 실패', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      // 스플래시 화면 또는 로딩 컴포넌트
      <></>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainTabNavigator /> : <AuthStack onLoginSuccess={() => setIsLoggedIn(true)} />}
    </NavigationContainer>
  );
}
