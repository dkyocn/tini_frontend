import React from 'react';
import {View, Text, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type Props = {
  onLogout: () => void;
};

export default function MainTabNavigator({onLogout}: Props) {
  const handleLogout = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      await axios.post('http://172.20.10.2:8080/api/v1/tini/logout', null, {
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

  return (
    <View style={styles.container}>
      <Text>MainTabNavigator</Text>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() =>
          Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
            {text: '취소', style: 'cancel'},
            {text: '확인', onPress: handleLogout},
          ])
        }>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#ff4444',
    borderRadius: 8,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
