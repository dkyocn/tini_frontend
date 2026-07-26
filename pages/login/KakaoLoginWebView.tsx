import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';

// ⚠️ 카카오 개발자 콘솔 - tinitracker 앱의 REST API 키
const KAKAO_REST_API_KEY = '3d737eaa01d88ebcc8350d5c83631d2f';

// ⚠️ 카카오 개발자 콘솔 > 카카오 로그인 > Redirect URI 에 등록되어 있어야 함
const REDIRECT_URI = 'https://oauth-tinitracker.local/kakao';

const AUTH_URL =
  `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: (accessToken: string) => void;
  onError?: (error: unknown) => void;
};

export default function KakaoLoginWebView({ visible, onClose, onSuccess, onError }: Props) {
  const handleNavigation = async (navState: WebViewNavigation) => {
    const url = navState.url;
    if (!url.startsWith(REDIRECT_URI)) return;

    const codeMatch = url.match(/[?&]code=([^&]+)/);
    const errorMatch = url.match(/[?&]error=([^&]+)/);

    if (errorMatch) {
      onError?.(new Error(`카카오 인증 거부: ${decodeURIComponent(errorMatch[1])}`));
      onClose();
      return;
    }

    if (!codeMatch) return;

    const code = decodeURIComponent(codeMatch[1]);

    try {
      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: KAKAO_REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code,
      }).toString();

      const res = await fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
        body,
      });

      const json = await res.json();

      if (json.access_token) {
        onSuccess(json.access_token);
      } else {
        onError?.(new Error(`토큰 교환 실패: ${JSON.stringify(json)}`));
      }
    } catch (e) {
      onError?.(e);
    } finally {
      onClose();
    }
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>닫기</Text>
        </TouchableOpacity>
        <Text style={styles.title}>카카오 로그인</Text>
        <View style={styles.closeBtn} />
      </View>
      <WebView
        source={{ uri: AUTH_URL }}
        onNavigationStateChange={handleNavigation}
        incognito
        thirdPartyCookiesEnabled
        javaScriptEnabled
        domStorageEnabled
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FEE500',
  },
  closeBtn: {
    width: 60,
    padding: 4,
  },
  closeText: {
    fontSize: 14,
    color: '#191919',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#191919',
    textAlign: 'center',
  },
});
