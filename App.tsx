import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthStack from './navigation/AuthStack';
import MainTabNavigator from './navigation/MainTabNavigator';
import ComponentPreview from './pages/ComponentPreview';

const PREVIEW_COMPONENTS = false;
// TEMP: Firebase 비활성화 (카카오 로그인 테스트용)
// import { subscribeFcmTokenRefresh } from './utils/fcm';

export default function App() {
  if (PREVIEW_COMPONENTS) return <ComponentPreview />;

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        setIsLoggedIn(!!accessToken);
      } catch (e) {
        console.error('로그인 상태 확인 실패', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();

    // FCM 토큰이 갱신될 때 자동으로 백엔드에 업데이트
    // TEMP: Firebase 비활성화 (카카오 로그인 테스트용)
    // const unsubscribe = subscribeFcmTokenRefresh();
    // return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      // 스플래시 화면 또는 로딩 컴포넌트
      <SafeAreaProvider />
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isLoggedIn ? <MainTabNavigator onLogout={() => setIsLoggedIn(false)} /> : <AuthStack onLoginSuccess={() => setIsLoggedIn(true)} />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
