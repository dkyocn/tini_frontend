import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  value: string | number;
};

export default function CircleNumber({ value }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.circle} />
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 73,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D9D9D9',
  },
  value: {
    fontFamily: 'SF Pro',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 14,
    color: '#000000',
    textAlign: 'center',
  },
});
