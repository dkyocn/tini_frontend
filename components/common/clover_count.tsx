import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  count: number;
};

export default function CloverCount({ count }: Props) {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/clover.png')} style={styles.icon} />
      <Text style={styles.label}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 73,
    height: 30,
    borderRadius: 50,
    backgroundColor: '#D1E795',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 14,
    color: '#000000',
  },
});
