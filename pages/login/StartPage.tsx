import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import TiniSvg from '../../assets/tini.svg';

const { height } = Dimensions.get('window');

type Props = {
  onStart: () => void;
};

export default function StartPage({ onStart }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <TiniSvg width={height * 0.22} height={height * 0.22} />
      </View>

      <View style={styles.textWrapper}>
        <Text style={styles.title}>티니 트래커</Text>
        <Text style={styles.subtitle}>일상의 하루를 트래킹하는 티니!</Text>
        <Text style={styles.description}>
          {
            '다이어리를 꾸미고, 하루를 트래킹 할 수 있어요.\n티니의 주요기능을 알아볼까요?'
          }
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={onStart}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>티니 시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F9',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 85,
  },
  textWrapper: {
    alignItems: 'center',
    marginBottom: 133,
    gap: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 15,
    color: '#000000',
  },
  description: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 4,
  },
  button: {
    width: 353,
    height: 50,
    backgroundColor: '#D1E795',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 1,
  },
});
