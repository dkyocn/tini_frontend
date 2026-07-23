import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from './api';

// FCM 권한 요청 (iOS는 명시적 허용 필요)
export async function requestFcmPermission(): Promise<boolean> {
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

// FCM 토큰 획득 및 로컬 저장 + 백엔드 전송
export async function saveFcmToken(accessToken: string): Promise<void> {
  try {
    const granted = await requestFcmPermission();
    if (!granted) return;

    const fcmToken = await messaging().getToken();
    await AsyncStorage.setItem('fcmToken', fcmToken);

    await axios.post(
      `${API_BASE_URL}/user/device-token`,
      {deviceToken: fcmToken},
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
  } catch (error) {
    console.error('FCM 토큰 저장 실패:', error);
  }
}

// 토큰 갱신 구독 (App.tsx에서 호출)
export function subscribeFcmTokenRefresh(): () => void {
  return messaging().onTokenRefresh(async (newToken: string) => {
    try {
      await AsyncStorage.setItem('fcmToken', newToken);
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) return;

      await axios.post(
        `${API_BASE_URL}/user/device-token`,
        {deviceToken: newToken},
        {headers: {Authorization: `Bearer ${accessToken}`}},
      );
    } catch (error) {
      console.error('FCM 토큰 갱신 실패:', error);
    }
  });
}
