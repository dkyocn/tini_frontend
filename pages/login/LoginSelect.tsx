import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {login as kakaoLogin} from '@react-native-seoul/kakao-login';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TokenDTO = {
  accessToken: string;
  refreshToken: string;
};

type Props = {
  onLoginSuccess: () => void;
};

export default function LoginSelect({onLoginSuccess}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleKakaoLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const kakaoToken = await kakaoLogin();

      const response = await axios.post<TokenDTO>(
        'http://localhost:8080/api/v1/tini/user/kakao/login',
        {accessToken: kakaoToken.accessToken},
      );

      const {accessToken, refreshToken} = response.data;
      await AsyncStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        await AsyncStorage.setItem('refreshToken', refreshToken);
      }

      onLoginSuccess();
    } catch (error) {
      console.error('카카오 로그인 실패:', error);
      Alert.alert('로그인 실패', '카카오 로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: 구글 소셜 로그인 구현
  };

  const handleAppleLogin = () => {
    // TODO: 애플 소셜 로그인 구현
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TINI</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.kakaoButton, isLoading && styles.disabledButton]}
          onPress={handleKakaoLogin}
          disabled={isLoading}>
          <Text style={styles.kakaoButtonText}>
            {isLoading ? '로그인 중...' : '카카오로 시작하기'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}>
          <Text style={styles.googleButtonText}>Google로 시작하기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.appleButton} onPress={handleAppleLogin}>
          <Text style={styles.appleButtonText}>Apple로 시작하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
