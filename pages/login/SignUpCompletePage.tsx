import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import TiniSvg from '../../assets/tini.svg';

const {height} = Dimensions.get('window');

type Props = {
  onComplete: () => void;
};

export default function SignUpCompletePage({onComplete}: Props) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <View style={styles.container}>
      <TiniSvg width={height * 0.2} height={height * 0.2} />
      <Text style={styles.text}>가입 완료!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F9',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  text: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
