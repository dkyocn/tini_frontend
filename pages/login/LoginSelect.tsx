import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { login as kakaoLogin } from '@react-native-seoul/kakao-login';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '../../utils/api';
// TEMP: Firebase 비활성화 (카카오 로그인 테스트용)
// import {saveFcmToken} from '../../utils/fcm';

type Gender = 'FEMALE' | 'MALE' | 'NONBINARY';

type TokenDTO = {
  accessToken: string;
  refreshToken: string;
  user?: {
    userGender?: Gender | null;
    userBirthDate?: string | null;
  };
};

export type InitialProfile = {
  birthdate?: string;
  gender?: Gender;
};

type Props = {
  onLoginSuccess: (initialProfile?: InitialProfile) => void;
};

export default function LoginSelect({ onLoginSuccess }: Props) {
  const [loadingProvider, setLoadingProvider] = useState<
    'kakao' | 'google' | null
  >(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '465749187993-d787pf2pfftffuf0m2l4fdiq8bed5bic.apps.googleusercontent.com',
      iosClientId:
        '465749187993-uh9hd2q0dv88sktt3e7a7te8mdqv11lp.apps.googleusercontent.com',
      offlineAccess: true,
      scopes: ['https://www.googleapis.com/auth/user.birthday.read'],
    });
  }, []);

  const handleKakaoLogin = async () => {
    console.log('[KAKAO] 1 handleKakaoLogin called, loadingProvider=', loadingProvider);
    if (loadingProvider) {
      console.log('[KAKAO] 1a early-return (already loading)');
      return;
    }
    setLoadingProvider('kakao');
    console.log('[KAKAO] 2 loadingProvider set to kakao, about to await kakaoLogin()');

    try {
      const kakaoToken = await kakaoLogin();
      console.log('[KAKAO] 3 kakaoLogin resolved, token=', JSON.stringify(kakaoToken));

      console.log('[KAKAO] 4 calling backend...');
      const response = await axios.post<TokenDTO>(
        `${API_BASE_URL}/user/kakao/login`,
        { accessToken: kakaoToken.accessToken },
        { timeout: 8000 },
      );
      console.log('[KAKAO] 5 backend responded status=', response.status);


      const { accessToken, refreshToken, user } = response.data;
      await AsyncStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        await AsyncStorage.setItem('refreshToken', refreshToken);
      }

      // TEMP: Firebase 비활성화 (카카오 로그인 테스트용)
      // await saveFcmToken(accessToken);

      const birthdate = user?.userBirthDate
        ? user.userBirthDate.slice(0, 10).replace(/-/g, '.')
        : undefined;

      onLoginSuccess({
        birthdate,
        gender: user?.userGender ?? undefined,
      });
    } catch (error) {
      console.log('[KAKAO] X caught error:', error);
      console.error('카카오 로그인 실패:', error);
      Alert.alert(
        '로그인 실패',
        '카카오 로그인에 실패했습니다. 다시 시도해주세요.',
      );

    } finally {
      console.log('[KAKAO] Y finally: setLoadingProvider(null)');
      setLoadingProvider(null);
    }
  };

  const handleGoogleLogin = async () => {
    if (loadingProvider) return;
    setLoadingProvider('google');

    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;

      if (!idToken) {
        throw new Error('Google idToken을 받지 못했습니다.');
      }

      let birthdate: string | null = null;
      try {
        const {accessToken: googleAccessToken} = await GoogleSignin.getTokens();
        const peopleResponse = await axios.get(
          'https://people.googleapis.com/v1/people/me',
          {
            params: {personFields: 'birthdays'},
            headers: {Authorization: `Bearer ${googleAccessToken}`},
          },
        );
        const date = peopleResponse.data?.birthdays?.[0]?.date;
        if (date?.year && date?.month && date?.day) {
          birthdate = `${date.year}.${String(date.month).padStart(2, '0')}.${String(date.day).padStart(2, '0')}`;
        }
      } catch (birthdateError) {
        console.error('구글 생년월일 조회 실패:', birthdateError);
      }

      const backendResponse = await axios.post<TokenDTO>(
        `${API_BASE_URL}/user/google/login`,
        { accessToken: idToken },
      );

      const { accessToken, refreshToken } = backendResponse.data;
      await AsyncStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        await AsyncStorage.setItem('refreshToken', refreshToken);
      }
      // TEMP: Firebase 비활성화 (카카오 로그인 테스트용)
      // await saveFcmToken(accessToken);

      onLoginSuccess({
        birthdate: birthdate ?? undefined,
      });
    } catch (error) {
      console.error('구글 로그인 실패:', error);
      Alert.alert(
        '로그인 실패',
        '구글 로그인에 실패했습니다. 다시 시도해주세요.',
      );
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleAppleLogin = () => {
    // TODO: 애플 소셜 로그인 구현
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TINI</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.kakaoButton, loadingProvider && styles.disabledButton]}
          onPress={handleKakaoLogin}
          disabled={!!loadingProvider}
        >
          <Text style={styles.kakaoButtonText}>
            {loadingProvider === 'kakao' ? '로그인 중...' : '카카오로 시작하기'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.googleButton,
            loadingProvider && styles.disabledButton,
          ]}
          onPress={handleGoogleLogin}
          disabled={!!loadingProvider}
        >
          <Text style={styles.googleButtonText}>
            {loadingProvider === 'google'
              ? '로그인 중...'
              : 'Google로 시작하기'}
          </Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity style={styles.appleButton} onPress={handleAppleLogin}>
            <Text style={styles.appleButtonText}>Apple로 시작하기</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6F9',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 60,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  kakaoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#191919',
  },
  googleButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  appleButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  appleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
